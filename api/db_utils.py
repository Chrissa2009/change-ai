from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from azure.identity import DefaultAzureCredential

CONTAINER_NAME = "surveys"
ID_KEY = "id"
ID_QUERY = "SELECT c.id FROM c"
DB_NAME = "roi-insights-db"
COSMOS_ENDPOINT = "https://roi-cosmos-db-account.documents.azure.com:443"

def _get_container_client(client):
    database = client.get_database_client(database=DB_NAME)
    return database.get_container_client(container=CONTAINER_NAME)

def get_client():
    return CosmosClient(url=COSMOS_ENDPOINT, credential=DefaultAzureCredential())

def list_surveys(client):
    container = _get_container_client(client)
    results = container.query_items(query=ID_QUERY, enable_cross_partition_query=True)
    return [d[ID_KEY] for d in results]

def get_survey(client, name):
    container = _get_container_client(client)
    try:
        return container.read_item(item=name, partition_key=name)
    except CosmosResourceNotFoundError:
        return None

def put_survey(client, name, content):
    content[ID_KEY] = name
    container = _get_container_client(client)
    container.upsert_item(body=content)

def delete_survey(client, name):
    container = _get_container_client(client)
    try:
        container.delete_item(item=name, partition_key=name)
    except CosmosResourceNotFoundError:
        return None