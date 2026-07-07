import pytest
from unittest.mock import MagicMock, patch, call
from config.settings import RUNNER_STOP, RUNNER_LOCK


class TestMQTTOrchestrator:
    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_initialization(self, mock_logger, mock_settings, mock_mqtt):
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        
        assert orchestrator.host == "test-host"
        assert orchestrator.port == 8883
        assert orchestrator.ws_path == "/test/path"

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_on_connect_success(self, mock_logger, mock_settings, mock_mqtt):
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator._on_connect(None, None, None, 0)
        
        log_mock.info.assert_called()

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_on_connect_failure(self, mock_logger, mock_settings, mock_mqtt):
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator._on_connect(None, None, None, 1)
        
        log_mock.error.assert_called()

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_on_disconnect(self, mock_logger, mock_settings, mock_mqtt):
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator._on_disconnect(None, None, 0)
        
        log_mock.info.assert_called()

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_on_message_lock_acquired(self, mock_logger, mock_settings, mock_mqtt):
        RUNNER_LOCK.acquire(blocking=False)
        
        try:
            mock_settings.AL_MQTT_HOST = "test-host"
            mock_settings.AL_MQTT_PORT = 8883
            mock_settings.AL_MQTT_PATH = "/test/path"
            mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
            
            mock_client = MagicMock()
            mock_mqtt.return_value = mock_client
            
            log_mock = MagicMock()
            mock_logger.return_value = log_mock
            
            from modules.mqtt_listener.listener import MQTTOrchestrator
            
            orchestrator = MQTTOrchestrator()
            msg_mock = MagicMock()
            msg_mock.topic = "test/topic"
            
            orchestrator._on_message(None, None, msg_mock)
            
            log_mock.debug.assert_called()
        finally:
            RUNNER_LOCK.release()

    @patch('modules.mqtt_listener.listener.runner')
    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_connect_success(self, mock_logger, mock_settings, mock_mqtt, mock_runner):
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator.connect()
        
        mock_client.connect.assert_called_once_with("test-host", 8883, keepalive=60)
        mock_client.subscribe.assert_called_once_with("test/topic")

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_start_mqtt_loop(self, mock_logger, mock_settings, mock_mqtt):
        RUNNER_STOP.clear()
        
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator.start()
        
        mock_client.loop_start.assert_called_once()

    @patch('modules.mqtt_listener.listener.mqtt.Client')
    @patch('modules.mqtt_listener.listener.settings')
    @patch('modules.mqtt_listener.listener.logger')
    def test_stop_mqtt_loop(self, mock_logger, mock_settings, mock_mqtt):
        RUNNER_STOP.clear()
        
        mock_settings.AL_MQTT_HOST = "test-host"
        mock_settings.AL_MQTT_PORT = 8883
        mock_settings.AL_MQTT_PATH = "/test/path"
        mock_settings.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        
        mock_client = MagicMock()
        mock_mqtt.return_value = mock_client
        
        log_mock = MagicMock()
        mock_logger.return_value = log_mock
        
        from modules.mqtt_listener.listener import MQTTOrchestrator
        
        orchestrator = MQTTOrchestrator()
        orchestrator.stop()
        
        mock_client.loop_stop.assert_called_once()
        mock_client.disconnect.assert_called_once()
