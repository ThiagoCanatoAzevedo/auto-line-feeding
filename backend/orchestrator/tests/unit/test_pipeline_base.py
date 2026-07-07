import pytest
from unittest.mock import MagicMock, patch, call
from common.pipeline_base import CoreAPIClient
import httpx


class TestCoreAPIClient:
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_client_initialization(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        client = CoreAPIClient(timeout=30, max_retries=3)
        
        assert client.base_url == "http://test-core"
        assert client.timeout == 30
        assert client.max_retries == 3

    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_post_success(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient()
        result = client._post("/test-endpoint", {"key": "value"})
        
        assert result == mock_response
        mock_client.post.assert_called_once()

    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_patch_success(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.patch.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient()
        result = client._patch("/test-endpoint", {"key": "value"})
        
        assert result == mock_response
        mock_client.patch.assert_called_once()

    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_get_success(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.get.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient()
        result = client._get("/test-endpoint")
        
        assert result == mock_response
        mock_client.get.assert_called_once()

    @patch('common.pipeline_base.time.sleep')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_retry_on_http_error(self, mock_settings, mock_httpx, mock_sleep):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.text = "Server Error"
        
        error = httpx.HTTPStatusError("Error", request=MagicMock(), response=mock_response)
        
        mock_client = MagicMock()
        mock_client.post.side_effect = [error, error, MagicMock(status_code=200)]
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient(max_retries=3)
        result = client._post("/test-endpoint")
        
        assert result.status_code == 200
        assert mock_client.post.call_count == 3
        assert mock_sleep.call_count == 2

    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_raise_after_max_retries(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.text = "Server Error"
        
        error = httpx.HTTPStatusError("Error", request=MagicMock(), response=mock_response)
        
        mock_client = MagicMock()
        mock_client.post.side_effect = error
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient(max_retries=1)
        
        with pytest.raises(httpx.HTTPStatusError):
            client._post("/test-endpoint")

    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_url_normalization(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core/"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        client = CoreAPIClient()
        client._post("/test-endpoint")
        
        call_args = mock_client.post.call_args[0][0]
        assert call_args == "http://test-core/test-endpoint"
