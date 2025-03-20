import time
import logging

def exponential_backoff(initial_delay=1, retries=3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            current_retry = 0
            current_delay = initial_delay
            while current_retry < retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    current_retry += 1
                    if current_retry >= retries:
                        logging.error(f"Retry {current_retry}. Failed to execute function '{func.__name__}'. Exhausted retries with error {repr(e)}.")
                        raise e
                    logging.info(f"Retry {current_retry}. Failed to execute function '{func.__name__}' with error {repr(e)}. Retrying in {current_delay} seconds...")
                    time.sleep(current_delay)
                    current_delay *= 2
        return wrapper
    return decorator
