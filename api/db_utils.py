from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from azure.identity import DefaultAzureCredential
from retry import exponential_backoff

REPORTS_CONTAINER_NAME = "reports"
SURVEY_CONTAINER_NAME = "surveysV2"
SURVEY_PARTITION_KEY = "surveyPartition"
SURVEY_PARTITION_VALUE = "survey"
ID_KEY = "id"
REPORT_VERSION_KEY = "reportVersion"
REPORT_PARTITION_KEY = "surveyName"
DATA_KEY = "data"
SURVEY_QUERY = "SELECT c.id FROM c"
REPORT_VERSION_QUERY = "SELECT c.reportVersion FROM c WHERE c.surveyName = @surveyName ORDER BY c.reportVersion DESC"
DB_NAME = "changeai-db"
COSMOS_ENDPOINT = "https://changeai-storage.documents.azure.com:443"

def _get_container_client(client, container):
    database = client.get_database_client(database=DB_NAME)
    return database.get_container_client(container=container)

def _create_report_version_id(surveyName, version):
    return f"{surveyName}:{version}"

def get_client():
    return CosmosClient(url=COSMOS_ENDPOINT, credential=DefaultAzureCredential())

@exponential_backoff(initial_delay=1, retries=3)
def list_surveys(client):
    container = _get_container_client(client, SURVEY_CONTAINER_NAME)
    results = container.query_items(query=SURVEY_QUERY, partition_key=SURVEY_PARTITION_VALUE, enable_cross_partition_query=False)
    return [d[ID_KEY] for d in results]

@exponential_backoff(initial_delay=1, retries=3)
def get_survey(client, name):
    container = _get_container_client(client, SURVEY_CONTAINER_NAME)
    try:
        return container.read_item(item=name, partition_key=SURVEY_PARTITION_VALUE)[DATA_KEY]
    except CosmosResourceNotFoundError:
        return None

@exponential_backoff(initial_delay=1, retries=3)
def put_survey(client, name, content):
    record = {}
    record[ID_KEY] = name
    record[DATA_KEY] = content
    record[SURVEY_PARTITION_KEY] = SURVEY_PARTITION_VALUE
    container = _get_container_client(client, SURVEY_CONTAINER_NAME)
    container.upsert_item(body=record)

@exponential_backoff(initial_delay=1, retries=3)
def delete_survey(client, name):
    container = _get_container_client(client, SURVEY_CONTAINER_NAME)
    try:
        container.delete_item(item=name, partition_key=name)
    except CosmosResourceNotFoundError:
        return None

@exponential_backoff(initial_delay=1, retries=3)
def list_report_versions(client, surveyName):
    container = _get_container_client(client, REPORTS_CONTAINER_NAME)
    parameters = [{"name": "@surveyName", "value": surveyName}]
    results = container.query_items(query=REPORT_VERSION_QUERY, parameters=parameters, partition_key=surveyName, enable_cross_partition_query=False)
    return [d[REPORT_VERSION_KEY] for d in results]

@exponential_backoff(initial_delay=1, retries=3)
def get_report_version(client, surveyName, reportVersion):
    container = _get_container_client(client, REPORTS_CONTAINER_NAME)
    try:
        return container.read_item(item=_create_report_version_id(surveyName, reportVersion), partition_key=surveyName)[DATA_KEY]
    except CosmosResourceNotFoundError:
        return None

@exponential_backoff(initial_delay=1, retries=3)
def put_report_version(client, surveyName, reportVersion, content):
    record = {}
    record[ID_KEY] = _create_report_version_id(surveyName, reportVersion)
    record[DATA_KEY] = content
    record[REPORT_PARTITION_KEY] = surveyName
    record[REPORT_VERSION_KEY] = reportVersion
    container = _get_container_client(client, REPORTS_CONTAINER_NAME)
    container.upsert_item(body=record)