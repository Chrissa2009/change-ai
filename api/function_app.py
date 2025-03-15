import azure.functions as func
import logging
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

# TODO: Finish this Azure function GET "surveys" for listing saved survey names
@app.route(route="surveys", methods=["GET"])
def get_surveys(req: func.HttpRequest) -> func.HttpResponse:
    # START TODO: Read from Cosmos DB List of surveys
    response_body = {
        "surveys": []
    }
    # END TODO: Read from Cosmos DB
    logging.info(f"GET surveys response: {response_body}")
    return func.HttpResponse(
        json.dumps(response_body),
        mimetype='application/json',
        status_code=200
    )

# TODO: Add GET "survey" to retrieve saved survey contents given a survey name in request body

# TODO: Add PUT "survey" to create/update survey given a survey name

# TODO: Add DELETE "survey" to delete survey given a survey name

# TODO: Add GET "insight" for calculating and responding with aggregate insight including ROI and text-based insights/recommendations, given a survey name.