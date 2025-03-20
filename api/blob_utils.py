import os, uuid
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, ContentSettings
from retry import exponential_backoff

BLOB_ENDPOINT = "https://changeaiblob.blob.core.windows.net"

def get_client():
    return BlobServiceClient(BLOB_ENDPOINT, credential=DefaultAzureCredential())

@exponential_backoff(initial_delay=1, retries=3)
def upload_blob(client, container_name, blob_name, content_type, data):
    blob_client = client.get_blob_client(container=container_name, blob=blob_name)
    blob_client.upload_blob(data, overwrite=True, content_settings=ContentSettings(content_type=content_type))
    return blob_client.url
