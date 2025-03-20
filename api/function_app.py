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
    system_prompt = req.params.get('persona') if req.params.get('persona') else system_message.ROI_EXPERT_SYSTEM_MESSAGE
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
        openai_response = json.loads(
                openai_utils.get_json_response(
                client=openai_utils.get_client(api_key=api_key),
                system_message=system_prompt,
                user_message=request_json,
                response_class=analysis_schema.Response
            )
        )
        logging.info(f"POST survey analysis OpenAI response: {openai_response}")
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
        response = {
            "summary": summary_url,
            "analysis": analysis_url
        }
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