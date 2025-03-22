import azure.functions as func
import logging
import json
import uuid
import db_utils
import openai_utils
import pydantic
import analysis_schema
import system_message
import keyvault_utils
import blob_utils
from datetime import datetime, timezone

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.function_name(name="ListSurveys")
@app.route(route="surveys", methods=["GET"])
def get_surveys(req: func.HttpRequest) -> func.HttpResponse:
    try:
        response_body = {"surveyNames": db_utils.list_surveys(db_utils.get_client())}
        logging.info(f"GET surveys response: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"GET surveys error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="GetSurvey")
@app.route(route="survey", methods=["GET"])
def get_survey(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"GET survey error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        survey = db_utils.get_survey(db_utils.get_client(), survey_name)
        if not survey:
            return func.HttpResponse(
                json.dumps({}),
                mimetype='application/json',
                status_code=404
            )
        logging.info(f"GET survey response: {survey}")
        return func.HttpResponse(
            json.dumps(survey),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"GET survey error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="UpsertSurvey")
@app.route(route="survey", methods=["PUT"])
def upsert_survey(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"PUT survey error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    request_body = None
    try:
        request_body = req.get_json()
    except ValueError as e:
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=400
        )
    if not request_body:
        response_body = {"error": "Malformed request, missing content in request body."}
        logging.error(f"PUT survey error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        db_utils.put_survey(db_utils.get_client(), survey_name, request_body)
        logging.info(f"PUT survey success")
        return func.HttpResponse(
            json.dumps({}),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"PUT survey error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="DeleteSurvey")
@app.route(route="survey", methods=["DELETE"])
def delete_survey(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"DELETE survey error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        client = db_utils.get_client()
        survey = db_utils.get_survey(client, survey_name)
        if not survey:
            return func.HttpResponse(
                json.dumps({}),
                mimetype='application/json',
                status_code=404
            )
        db_utils.delete_survey(client, survey_name)
        return func.HttpResponse(
            json.dumps({}),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"DELETE survey error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="PostSurveyAnalysis")
@app.route(route="survey/analysis", methods=["POST"])
def post_survey_analysis(req: func.HttpRequest) -> func.HttpResponse:
    system_prompt = system_message.ROI_EXPERT_SYSTEM_MESSAGE
    request_body = None
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"POST survey analysis error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        request_body = req.get_json()
    except ValueError as e:
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=400
        )
    if not request_body:
        response_body = {"error": "Malformed request, missing content in request body."}
        logging.error(f"POST survey analysis error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    request_json = None
    try:
        request_json = json.dumps(request_body)
    except TypeError as e:
        response_body = {"error": "Malformed request, unable to serialize request body."}
        logging.error(f"POST survey analysis error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        analysis_schema.Request.model_validate_json(request_json)
    except pydantic.ValidationError as e:
        response_body = {"error": f"Malformed request, request does not follow expected schema: {repr(e)}"}
        logging.error(f"POST survey analysis error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        api_key = keyvault_utils.get_secret(keyvault_utils.get_client(), "OpenAI")
        analysis = None
        retry = 0
        bad_quality_answer = True
        openai_response = None
        while retry < 3 and bad_quality_answer:
            openai_response = json.loads(
                    openai_utils.get_json_response(
                    client=openai_utils.get_client(api_key=api_key),
                    system_message=system_prompt,
                    user_message=request_json,
                    response_class=analysis_schema.Response
                )
            )
            logging.info(f"[RETRY {str(retry)}] POST survey analysis OpenAI response: {openai_response}")
            analysis = openai_response["analysis"]
            reported_roi = analysis["roi"]["value"]
            reported_total_costs = analysis["total_costs"]["value"]
            reported_total_benefits = analysis["total_benefits"]["value"]
            computed_roi = (reported_total_benefits - reported_total_costs) / reported_total_costs
            delta = abs(computed_roi - reported_roi)
            if abs(computed_roi - reported_roi) < 0.01:
                logging.info(f"[SUCCESS OPENAI RETRIES = {str(retry)}], delta = {delta}, reported_roi={reported_roi}, computed_roi={computed_roi}, reported_total_costs={reported_total_costs}, reported_total_benefits={reported_total_benefits} POST survey analysis response: {openai_response}")
                bad_quality_answer = False
            retry += 1
            if retry == 3 and bad_quality_answer:
                logging.error(f"[ERROR OPENAI RETRIES = {str(retry)}], delta = {delta}, reported_roi={reported_roi}, computed_roi={computed_roi}, reported_total_costs={reported_total_costs}, reported_total_benefits={reported_total_benefits} POST survey analysis response: {openai_response}")
        logging.info(f"[TOTAL OPENAI RETRIES = {str(retry)}] POST survey analysis response: {openai_response}")
        summary = openai_response["summary"]
        analysis = {
            "response": openai_response["analysis"],
            "request": request_body,
            "persona": system_prompt,
            "summary": summary
        }
        analysis_json = json.dumps(analysis)
        blob_client = blob_utils.get_client()
        prefix = str(uuid.uuid4())
        analysis_url = blob_utils.upload_blob(
            client=blob_client,
            container_name="analysis",
            blob_name=f"{prefix}.json",
            content_type="application/json",
            data=analysis_json
        )
        summary_url = blob_utils.upload_blob(
            client=blob_client,
            container_name="summary",
            blob_name=f"{prefix}.txt",
            content_type="text/plain",
            data=summary
        )
        report_version = datetime.now().isoformat()
        response = {
            "surveyName": survey_name,
            "reportVersion": report_version,
            "summary": summary_url,
            "analysis": analysis_url,
        }
        db_utils.put_report_version(
            client=db_utils.get_client(),
            surveyName=survey_name,
            reportVersion=report_version,
            content=response
        )
        logging.info(f"POST survey analysis response: {response}")
        return func.HttpResponse(
            json.dumps(response),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"POST survey analysis error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="ListReportVersions")
@app.route(route="report/versions", methods=["GET"])
def get_report_versions(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"GET report versions error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    try:
        report_versions = db_utils.list_report_versions(
            client=db_utils.get_client(),
            surveyName=survey_name
        )
        response_body = {
            "surveyName": survey_name,
            "reportVersions": report_versions
        }
        logging.info(f"GET report versions response: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"GET report versions error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )

@app.function_name(name="GetReportVersion")
@app.route(route="report/version", methods=["GET"])
def get_report_version(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"GET survey error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    report_version = req.params.get('reportVersion')
    if not report_version:
        response_body = {"error": "Malformed request, missing reportVersion request parameter."}
        logging.error(f"GET report version error: {response_body}")
        return func.HttpResponse(
            json.dumps(response_body),
            mimetype='application/json',
            status_code=400
        )
    logging.info(f"report version: {report_version}")
    try:
        report = db_utils.get_report_version(
            client=db_utils.get_client(),
            surveyName=survey_name,
            reportVersion=report_version
        )
        if not report:
            return func.HttpResponse(
                json.dumps({}),
                mimetype='application/json',
                status_code=404
            )
        logging.info(f"GET report version response: {report}")
        return func.HttpResponse(
            json.dumps(report),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"GET report version error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )