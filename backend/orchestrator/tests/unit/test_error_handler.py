import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime


class TestErrorHandler:
    @patch('middleware.error_handler.logger')
    def test_global_exception_handler(self, mock_logger):
        from middleware.error_handler import global_exception_handler
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        request_mock = MagicMock()
        exc = Exception("Test error")
        
        response = global_exception_handler(request_mock, exc)
        
        assert response.status_code == 500
        data = response.body.decode()
        assert "Internal server error" in data
        assert "Test error" in data

    @patch('middleware.error_handler.logger')
    def test_setup_error_handlers(self, mock_logger):
        from fastapi import FastAPI
        from middleware.error_handler import setup_error_handlers
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        app = FastAPI()
        setup_error_handlers(app)
        
        assert len(app.exception_handlers) > 0
        log_mock.debug.assert_called_with("Error handlers configured")


class TestSchemas:
    def test_api_response_success(self):
        from common.schemas import APIResponse
        
        response = APIResponse(
            success=True,
            message="Test success",
            data={"key": "value"},
            timestamp=datetime.now()
        )
        
        assert response.success is True
        assert response.message == "Test success"
        assert response.data == {"key": "value"}
        assert response.error is None

    def test_api_response_error(self):
        from common.schemas import APIResponse
        
        response = APIResponse(
            success=False,
            message="Test error",
            error="Error details",
            timestamp=datetime.now()
        )
        
        assert response.success is False
        assert response.error == "Error details"
        assert response.data is None

    def test_api_response_dict_serialization(self):
        from common.schemas import APIResponse
        
        now = datetime.now()
        response = APIResponse(
            success=True,
            message="Test",
            data={"key": "value"},
            timestamp=now
        )
        
        response_dict = response.dict()
        
        assert response_dict["success"] is True
        assert response_dict["message"] == "Test"
        assert response_dict["data"] == {"key": "value"}
