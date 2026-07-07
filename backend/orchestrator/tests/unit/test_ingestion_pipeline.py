import pytest
from unittest.mock import MagicMock, patch
from modules.pipeline.ingestion import IngestionOrchestrationPipeline


class TestIngestionOrchestrationPipeline:
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_initialization(self, mock_settings, mock_httpx):
        mock_settings.CORE_URL = "http://test-core"
        
        pipeline = IngestionOrchestrationPipeline()
        
        assert pipeline is not None

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_assembly_line_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        pipeline.execute_assembly_line()
        
        mock_client.post.assert_called_once()
        log_mock.info.assert_called()

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_assembly_line_failure(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_client = MagicMock()
        mock_client.post.side_effect = Exception("API Error")
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        
        with pytest.raises(Exception):
            pipeline.execute_assembly_line()
        
        log_mock.error.assert_called()

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_forecaster_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        pipeline.execute_forecaster()
        
        assert mock_client.post.call_count == 2

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_consumption_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.patch.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        pipeline.execute_consumption()
        
        mock_client.patch.assert_called_once()

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_execute_requests_builder_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_client = MagicMock()
        mock_client.post.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        pipeline.execute_requests_builder()
        
        mock_client.post.assert_called_once()

    @patch('modules.pipeline.ingestion.logger')
    @patch('common.pipeline_base.httpx.Client')
    @patch('common.pipeline_base.settings')
    def test_return_requests_made_success(self, mock_settings, mock_httpx, mock_logger):
        mock_settings.CORE_URL = "http://test-core"
        
        test_data = [{"id": 1}, {"id": 2}]
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = test_data
        
        mock_client = MagicMock()
        mock_client.get.return_value = mock_response
        mock_httpx.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        pipeline = IngestionOrchestrationPipeline()
        result = pipeline.return_requests_made()
        
        assert result == test_data
        mock_client.get.assert_called_once()
