from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from azure.identity import DefaultAzureCredential
from retry import exponential_backoff

CONTAINER_NAME = "surveys"
ID_KEY = "id"
DATA_KEY = "data"
ID_QUERY = "SELECT c.id FROM c"
DB_NAME = "changeai-db"
COSMOS_ENDPOINT = "https://changeai-storage.documents.azure.com:443"

def _get_container_client(client):
    database = client.get_database_client(database=DB_NAME)
    return database.get_container_client(container=CONTAINER_NAME)

def get_client():
    return CosmosClient(url=COSMOS_ENDPOINT, credential=DefaultAzureCredential())

@exponential_backoff(initial_delay=1, retries=3)
def list_surveys(client):
    container = _get_container_client(client)
    results = container.query_items(query=ID_QUERY, enable_cross_partition_query=True)
    return [d[ID_KEY] for d in results]

@exponential_backoff(initial_delay=1, retries=3)
def get_survey(client, name):
    container = _get_container_client(client)
    try:
        return container.read_item(item=name, partition_key=name)[DATA_KEY]
    except CosmosResourceNotFoundError:
        return None

@exponential_backoff(initial_delay=1, retries=3)
def put_survey(client, name, content):
    record = {}
    record[ID_KEY] = name
    record[DATA_KEY] = content
    container = _get_container_client(client)
    container.upsert_item(body=record)

@exponential_backoff(initial_delay=1, retries=3)
def delete_survey(client, name):
    container = _get_container_client(client)
    try:
        container.delete_item(item=name, partition_key=name)
    except CosmosResourceNotFoundError:
        return None