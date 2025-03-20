from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from retry import exponential_backoff

KEYVAULT_ENDPOINT = "https://changeai-keyvault.vault.azure.net"

def get_client():
    return SecretClient(vault_url=KEYVAULT_ENDPOINT, credential=DefaultAzureCredential())

@exponential_backoff(initial_delay=1, retries=3)
def get_secret(client, secret_name):
    return client.get_secret(secret_name).value
