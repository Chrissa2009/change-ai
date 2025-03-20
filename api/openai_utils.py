from openai import OpenAI
from retry import exponential_backoff

def get_client(api_key):
    return OpenAI(api_key=api_key)

@exponential_backoff(initial_delay=1, retries=3)
def get_json_response(
    client,
    system_message,
    user_message,
    response_class,
    model="gpt-4o",
    max_tokens=4096,
    temperature=0.1,
    top_p=0.1
):
    completion = client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message},
        ],
        response_format=response_class,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p
    )
    choices = completion.choices if completion else None
    message = choices[0].message if choices else None
    content = message.content if message else None
    if not content:
        raise Exception("Response from OpenAI was missing")
    return content