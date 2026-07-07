import pytest
import logging
from unittest.mock import patch, MagicMock
import os


class TestLogger:
    @patch('common.logger.os.makedirs')
    @patch('common.logger.TimedRotatingFileHandler')
    def test_logger_initialization(self, mock_handler, mock_makedirs):
        from common.logger import logger
        
        log = logger("test_service")
        
        assert log is not None
        assert isinstance(log, logging.Logger)
        assert log.name == "test_service"

    @patch('common.logger.os.makedirs')
    @patch('common.logger.TimedRotatingFileHandler')
    def test_logger_returns_same_instance(self, mock_handler, mock_makedirs):
        from common.logger import logger
        
        log1 = logger("same_service")
        log2 = logger("same_service")
        
        assert log1 is log2

    def test_custom_formatter(self):
        from common.logger import CustomFormatter
        
        formatter = CustomFormatter("test_service")
        
        assert formatter.service_name == "TEST_SERVICE"
        assert "DEBUG" in formatter.LEVEL_COLORS
        assert "INFO" in formatter.LEVEL_COLORS
        assert "ERROR" in formatter.LEVEL_COLORS

    def test_custom_formatter_format(self):
        from common.logger import CustomFormatter
        
        formatter = CustomFormatter("test_service")
        
        record = logging.LogRecord(
            name="test_service",
            level=logging.INFO,
            pathname="test.py",
            lineno=10,
            msg="Test message",
            args=(),
            exc_info=None
        )
        
        formatted = formatter.format(record)
        
        assert "TEST_SERVICE" in formatted
        assert "Test message" in formatted
        assert "test.py" in formatted


class TestSettings:
    @patch.dict(os.environ, {
        "APP_NAME": "TestApp",
        "APP_URL": "http://test",
        "FILES_DRIVER": "test",
        "AL_MQTT_ENDPOINT": "mqtt://test",
        "AL_MQTT_HOST": "test-host",
        "AL_MQTT_PORT": "8883",
        "AL_MQTT_SUBSCRIBE_TOPIC": "test/topic",
        "AL_MQTT_PATH": "/test/path",
        "CORE_URL": "http://core-test"
    })
    def test_settings_loading(self):
        from config.settings import Settings
        
        settings = Settings()
        
        assert settings.APP_NAME == "TestApp"
        assert settings.AL_MQTT_PORT == 8883

    def test_runner_lock(self):
        from config.settings import RUNNER_LOCK
        
        assert RUNNER_LOCK.acquire(blocking=False)
        RUNNER_LOCK.release()

    def test_runner_stop(self):
        from config.settings import RUNNER_STOP
        
        RUNNER_STOP.clear()
        assert not RUNNER_STOP.is_set()
        
        RUNNER_STOP.set()
        assert RUNNER_STOP.is_set()
