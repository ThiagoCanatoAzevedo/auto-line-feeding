import pytest
from unittest.mock import MagicMock, patch
from config.settings import RUNNER_STOP


class TestPipelineRunner:
    @patch('modules.pipeline.runner.ExecutionAndValidationPipeline')
    @patch('modules.pipeline.runner.IngestionOrchestrationPipeline')
    @patch('modules.pipeline.runner.logger')
    def test_runner_execution_success(self, mock_logger, mock_ingestion, mock_execute_validate):
        from modules.pipeline.runner import runner
        
        RUNNER_STOP.clear()
        
        mock_ingestion_instance = MagicMock()
        mock_ingestion.return_value = mock_ingestion_instance
        mock_ingestion_instance.return_requests_made.return_value = [{"id": 1}]
        
        mock_validate_instance = MagicMock()
        mock_execute_validate.return_value = mock_validate_instance
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        runner()
        
        mock_ingestion_instance.execute_assembly_line.assert_called_once()
        mock_ingestion_instance.execute_forecaster.assert_called_once()
        mock_ingestion_instance.execute_consumption.assert_called_once()
        mock_validate_instance.execute_sap.assert_called_once()

    @patch('modules.pipeline.runner.ExecutionAndValidationPipeline')
    @patch('modules.pipeline.runner.IngestionOrchestrationPipeline')
    @patch('modules.pipeline.runner.logger')
    def test_runner_stops_early_when_requested(self, mock_logger, mock_ingestion, mock_execute_validate):
        from modules.pipeline.runner import runner
        
        RUNNER_STOP.set()
        
        mock_logger_instance = MagicMock()
        mock_logger.return_value = mock_logger_instance
        
        runner()
        
        mock_logger_instance.info.assert_called()

    @patch('modules.pipeline.runner.ExecutionAndValidationPipeline')
    @patch('modules.pipeline.runner.IngestionOrchestrationPipeline')
    @patch('modules.pipeline.runner.logger')
    def test_runner_no_requests_made(self, mock_logger, mock_ingestion, mock_execute_validate):
        from modules.pipeline.runner import runner
        
        RUNNER_STOP.clear()
        
        mock_ingestion_instance = MagicMock()
        mock_ingestion.return_value = mock_ingestion_instance
        mock_ingestion_instance.return_requests_made.return_value = []
        
        mock_validate_instance = MagicMock()
        mock_execute_validate.return_value = mock_validate_instance
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        runner()
        
        mock_validate_instance.execute_requests_builder.assert_not_called()
        mock_validate_instance.execute_requests_checker.assert_not_called()

    @patch('modules.pipeline.runner.ExecutionAndValidationPipeline')
    @patch('modules.pipeline.runner.IngestionOrchestrationPipeline')
    @patch('modules.pipeline.runner.logger')
    def test_runner_with_requests_made(self, mock_logger, mock_ingestion, mock_execute_validate):
        from modules.pipeline.runner import runner
        
        RUNNER_STOP.clear()
        
        mock_ingestion_instance = MagicMock()
        mock_ingestion.return_value = mock_ingestion_instance
        mock_ingestion_instance.return_requests_made.return_value = [{"id": 1}, {"id": 2}]
        
        mock_validate_instance = MagicMock()
        mock_execute_validate.return_value = mock_validate_instance
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        runner()
        
        mock_validate_instance.execute_requests_builder.assert_called_once()
        mock_validate_instance.execute_requests_checker.assert_called_once()

    @patch('modules.pipeline.runner.ExecutionAndValidationPipeline')
    @patch('modules.pipeline.runner.IngestionOrchestrationPipeline')
    @patch('modules.pipeline.runner.logger')
    def test_runner_handles_exception(self, mock_logger, mock_ingestion, mock_execute_validate):
        from modules.pipeline.runner import runner
        
        RUNNER_STOP.clear()
        
        mock_ingestion_instance = MagicMock()
        mock_ingestion.return_value = mock_ingestion_instance
        mock_ingestion_instance.execute_assembly_line.side_effect = Exception("Pipeline Error")
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        with pytest.raises(Exception):
            runner()
        
        log_mock.error.assert_called()
