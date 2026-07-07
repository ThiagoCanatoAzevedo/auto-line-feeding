import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from datetime import datetime
from fastapi.testclient import TestClient


@pytest.fixture
def test_client():
    from main import create_app
    app = create_app()
    return TestClient(app)


@pytest.fixture
def reset_mqtt_state():
    import api.routes as routes_module
    original_running = routes_module.mqtt_running
    original_instance = routes_module.mqtt_instance
    
    yield
    
    routes_module.mqtt_running = original_running
    routes_module.mqtt_instance = original_instance


class TestAPIRoutes:
    def test_root_endpoint(self, test_client):
        response = test_client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "app" in data["data"]

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_start_success(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        mock_mqtt = MagicMock()
        mock_get_mqtt.return_value = mock_mqtt
        
        response = test_client.post("/orchestrator/mqtt/start")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "started"
        mock_mqtt.connect.assert_called_once()
        mock_mqtt.start.assert_called_once()

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_start_already_running(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        import api.routes as routes_module
        routes_module.mqtt_running = True
        
        response = test_client.post("/orchestrator/mqtt/start")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "already_running"
        mock_get_mqtt.assert_not_called()

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_stop_success(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        import api.routes as routes_module
        routes_module.mqtt_running = True
        
        mock_mqtt = MagicMock()
        mock_get_mqtt.return_value = mock_mqtt
        
        response = test_client.post("/orchestrator/mqtt/stop")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "stopped"
        mock_mqtt.stop.assert_called_once()

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_stop_not_running(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        import api.routes as routes_module
        routes_module.mqtt_running = False
        
        response = test_client.post("/orchestrator/mqtt/stop")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "not_running"
        mock_get_mqtt.assert_not_called()

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_status(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        import api.routes as routes_module
        routes_module.mqtt_running = True
        
        response = test_client.get("/orchestrator/mqtt/status")
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "running"

    @patch('api.routes._get_mqtt_instance')
    def test_mqtt_start_error(self, mock_get_mqtt, test_client, mock_settings, reset_mqtt_state):
        mock_mqtt = MagicMock()
        mock_mqtt.connect.side_effect = Exception("Connection failed")
        mock_get_mqtt.return_value = mock_mqtt
        
        response = test_client.post("/orchestrator/mqtt/start")
        
        assert response.status_code == 500
        data = response.json()
        assert data["success"] is False
        assert "Connection failed" in data["error"]
