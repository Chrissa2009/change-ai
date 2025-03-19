import azure.functions as func
import logging
import json
import db_utils

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
    request_body = req.get_json() 
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

@app.function_name(name="GetSurveyAnalysis")
@app.route(route="survey/analysis", methods=["GET"])
def get_survey(req: func.HttpRequest) -> func.HttpResponse:
    survey_name = req.params.get('surveyName')
    if not survey_name:
        response_body = {"error": "Malformed request, missing surveyName request parameter."}
        logging.error(f"GET survey analysis error: {response_body}")
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

        analysis = {
            "surveyName": "foo",
            "roi": {
                "value": 0.9,
                "explanation": "This is a reason the roi is this value"
            },
            "insights": [
                {
                    "title": "This is the insight title", 
                    "description": "This is a description of the insight.",
                    "contents": "This is the insight contents"
                }
            ],
            "recommendations": [
                {
                    "title": "This is the recommendation title",
                    "description": "This is a description of the recommendation.",
                    "contents": "This is the recommendations contents"
                }
            ]
        }

        logging.info(f"GET survey analysis response: {analysis}")

        return func.HttpResponse(
            json.dumps(analysis),
            mimetype='application/json',
            status_code=200
        )
    except Exception as e:
        logging.error(f"GET survey analysis error: {e}")
        return func.HttpResponse(
            json.dumps({"error": repr(e)}),
            mimetype='application/json',
            status_code=500
        )