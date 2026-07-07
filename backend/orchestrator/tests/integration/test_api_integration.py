import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient


@pytest.fixture
def app_with_mock_mqtt():
    with patch('api.routes._get_mqtt_instance'):
        from main import create_app
        app = create_app()
        return app


@pytest.fixture
def mocked_client(app_with_mock_mqtt):
    return TestClient(app_with_mock_mqtt)


class TestAPIIntegration:
    def test_full_mqtt_lifecycle(self, mocked_client):
        with patch('api.routes._get_mqtt_instance') as mock_get_mqtt:
            mock_mqtt = MagicMock()
            mock_get_mqtt.return_value = mock_mqtt
            
            start_response = mocked_client.post("/orchestrator/mqtt/start")
            assert start_response.status_code == 200
            assert start_response.json()["data"]["status"] == "started"
            
            status_response = mocked_client.get("/orchestrator/mqtt/status")
            assert status_response.status_code == 200
            
            stop_response = mocked_client.post("/orchestrator/mqtt/stop")
            assert stop_response.status_code == 200
            assert stop_response.json()["data"]["status"] == "stopped"

    def test_error_response_format(self, mocked_client):
        with patch('api.routes._get_mqtt_instance') as mock_get_mqtt:
            mock_mqtt = MagicMock()
            mock_mqtt.connect.side_effect = Exception("Connection error")
            mock_get_mqtt.return_value = mock_mqtt
            
            response = mocked_client.post("/orchestrator/mqtt/start")
            
            assert response.status_code == 500
            data = response.json()
            assert data["detail"] is False
            assert data["detail"] is not None

    @patch('api.routes._get_mqtt_instance')
    def test_concurrent_mqtt_state_management(self, mock_get_mqtt, mocked_client):
        import api.routes as routes_module
        
        mock_mqtt = MagicMock()
        mock_get_mqtt.return_value = mock_mqtt
        
        routes_module.mqtt_running = False
        
        response1 = mocked_client.post("/orchestrator/mqtt/start")
        assert response1.json()["data"]["status"] == "started"
        
        response2 = mocked_client.post("/orchestrator/mqtt/start")
        assert response2.json()["data"]["status"] == "already_running"
        
        routes_module.mqtt_running = True
        response3 = mocked_client.post("/orchestrator/mqtt/stop")
        assert response3.json()["data"]["status"] == "stopped"

    def test_pipeline_execution_through_mqtt_endpoint(self, mocked_client):
        with patch('api.routes._get_mqtt_instance') as mock_get_mqtt:
            mock_mqtt = MagicMock()
            mock_get_mqtt.return_value = mock_mqtt
            
            start_response = mocked_client.post("/orchestrator/mqtt/start")
            assert start_response.status_code == 200
            
            mock_mqtt.connect.assert_called_once()
            mock_mqtt.start.assert_called_once()
