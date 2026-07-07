import pytest
from unittest.mock import MagicMock, patch
from modules.pipeline.execute_validate import ExecutionAndValidationPipeline


class TestExecutionAndValidationPipeline:
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_initialization(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        pipeline = ExecutionAndValidationPipeline()
        
        assert pipeline is not None

    @patch('modules.pipeline.execute_validate.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_sap_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = ExecutionAndValidationPipeline()
        pipeline.execute_sap()
        
        mock_client.post.assert_called_once()

    @patch('modules.pipeline.execute_validate.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_sap_failure(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_client = MagicMock()
        mock_client.post.side_effect = Exception("SAP Error")
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = ExecutionAndValidationPipeline()
        
        with pytest.raises(Exception):
            pipeline.execute_sap()
        
        log_mock.error.assert_called()

    @patch('modules.pipeline.execute_validate.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_requests_builder(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = ExecutionAndValidationPipeline()
        pipeline.execute_requests_builder()
        
        mock_client.post.assert_called_once()

    @patch('modules.pipeline.execute_validate.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_requests_checker_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = ExecutionAndValidationPipeline()
        pipeline.execute_requests_checker()
        
        assert mock_client.post.call_count == 2

    @patch('modules.pipeline.execute_validate.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_requests_checker_first_call_fails(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_client = MagicMock()
        mock_client.post.side_effect = Exception("Checker Error")
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = ExecutionAndValidationPipeline()
        
        with pytest.raises(Exception):
            pipeline.execute_requests_checker()
        
        assert mock_client.post.call_count == 1
