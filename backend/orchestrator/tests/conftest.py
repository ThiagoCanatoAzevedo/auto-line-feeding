import pytest
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))


@pytest.fixture
def mock_settings():
    with patch('config.settings.settings') as mock:
        mock.APP_NAME = "Test App"
        mock.APP_URL = "http://test-app"
        mock.FILES_DRIVER = "test_driver"
        mock.AL_MQTT_HOST = "test-mqtt-host"
        mock.AL_MQTT_PORT = 8883
        mock.AL_MQTT_SUBSCRIBE_TOPIC = "test/topic"
        mock.AL_MQTT_PATH = "/test/path"
        mock.CORE_URL = "http://test-core"
        yield mock


@pytest.fixture
def mock_httpx_client():
    with patch('common.pipeline_base.httpx.Client') as mock:
        client_mock = MagicMock()
        response_mock = MagicMock()
        response_mock.status_code = 200
        response_mock.json.return_value = {"success": True}
        
        client_mock.post.return_value = response_mock
        client_mock.patch.return_value = response_mock
        client_mock.get.return_value = response_mock
        
        mock.return_value = client_mock
        yield mock


@pytest.fixture
def mock_mqtt_client():
    with patch('modules.mqtt_listener.listener.mqtt.Client') as mock:
        client_mock = MagicMock()
        mock.return_value = client_mock
        yield mock


@pytest.fixture
def mock_logger():
    with patch('common.logger.logger') as mock:
        log_mock = MagicMock()
        mock.return_value = log_mock
        yield mock
