from typing import Any, Dict, Optional, List
from config.settings import settings
from common.logger import logger
import httpx
import time


log = logger("pipeline")


class CoreAPIClient:
    def __init__(self, timeout: int = 30, max_retries: int = 3):
        self.base_url = settings.CORE_URL.rstrip("/")
        self.timeout = timeout
        self.max_retries = max_retries
        self.client = httpx.Client(timeout=timeout)

    def __del__(self):
        try:
            self.client.close()
        except Exception as e:
            log.warning(f"Error closing HTTP client: {str(e)}")

    def _handle_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        retries: int = 0
    ) -> httpx.Response:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        try:
            log.debug(f"Calling {method.upper()} {url}")
            
            if method.upper() == "POST":
                response = self.client.post(url, json=data)
            elif method.upper() == "PATCH":
                response = self.client.patch(url, json=data)
            elif method.upper() == "GET":
                response = self.client.get(url)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            response.raise_for_status()
            log.debug(f"Request to {endpoint} completed with status {response.status_code}")
            return response
            
        except httpx.HTTPStatusError as e:
            log.error(f"HTTP error on {method.upper()} {endpoint}: {e.response.status_code} - {e.response.text}")
            if retries < self.max_retries:
                wait_time = 2 ** retries
                log.info(f"Retrying {endpoint} in {wait_time}s (attempt {retries + 1}/{self.max_retries})")
                time.sleep(wait_time)
                return self._handle_request(method, endpoint, data, retries + 1)
            raise
            
        except httpx.ConnectError as e:
            log.error(f"Connection error on {method.upper()} {endpoint}: {str(e)}")
            if retries < self.max_retries:
                wait_time = 2 ** retries
                log.info(f"Retrying {endpoint} in {wait_time}s (attempt {retries + 1}/{self.max_retries})")
                time.sleep(wait_time)
                return self._handle_request(method, endpoint, data, retries + 1)
            raise
            
        except Exception as e:
            log.error(f"Unexpected error on {method.upper()} {endpoint}: {str(e)}", exc_info=True)
            raise

    def _post(self, endpoint: str, data: Optional[Dict] = None) -> httpx.Response:
        return self._handle_request("POST", endpoint, data)

    def _patch(self, endpoint: str, data: Optional[Dict] = None) -> httpx.Response:
        return self._handle_request("PATCH", endpoint, data)

    def _get(self, endpoint: str) -> httpx.Response:
        return self._handle_request("GET", endpoint)
