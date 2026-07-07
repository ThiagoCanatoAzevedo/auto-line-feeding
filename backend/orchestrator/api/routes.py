from config.settings import settings
from fastapi import APIRouter, HTTPException
from modules.mqtt_listener.listener import MQTTOrchestrator
from common.logger import logger
from common.schemas import APIResponse
from datetime import datetime


router = APIRouter()
log = logger("routes")

mqtt_instance = None
mqtt_running = False


def _get_mqtt_instance() -> MQTTOrchestrator:
    global mqtt_instance
    if mqtt_instance is None:
        log.debug("Creating new MQTT orchestrator instance")
        mqtt_instance = MQTTOrchestrator()
    return mqtt_instance


@router.post("/mqtt/start")
def start_mqtt():
    global mqtt_running
    
    log.info("Received MQTT start request")
    
    if mqtt_running:
        log.warning("MQTT start requested but already running")
        return APIResponse(
            success=True,
            message="MQTT is already running",
            data={"status": "already_running"},
            timestamp=datetime.now()
        ).dict()

    try:
        mqtt = _get_mqtt_instance()
        mqtt.connect()
        mqtt.start()
        mqtt_running = True
        
        log.info("MQTT started successfully")
        return APIResponse(
            success=True,
            message="MQTT started successfully",
            data={"status": "started"},
            timestamp=datetime.now()
        ).dict()
        
    except Exception as e:
        log.error(f"Failed to start MQTT: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to start MQTT: {str(e)}")


@router.post("/mqtt/stop")
def stop_mqtt():
    global mqtt_running
    
    log.info("Received MQTT stop request")
    
    if not mqtt_running:
        log.warning("MQTT stop requested but not running")
        return APIResponse(
            success=True,
            message="MQTT is not running",
            data={"status": "not_running"},
            timestamp=datetime.now()
        ).dict()

    try:
        mqtt = _get_mqtt_instance()
        mqtt.stop()
        mqtt_running = False
        
        log.info("MQTT stopped successfully")
        return APIResponse(
            success=True,
            message="MQTT stopped successfully",
            data={"status": "stopped"},
            timestamp=datetime.now()
        ).dict()
        
    except Exception as e:
        log.error(f"Failed to stop MQTT: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to stop MQTT: {str(e)}")


@router.get("/mqtt/status")
def mqtt_status():
    log.debug("Received MQTT status request")
    return APIResponse(
        success=True,
        message="MQTT status retrieved",
        data={"status": "running" if mqtt_running else "stopped"},
        timestamp=datetime.now()
    ).dict()
    
    
@router.get("/health")
def health_check():
    log.debug("Health check request received")
    return APIResponse(
        success=True,
        message="Service is healthy",
        data={"status": "healthy", "app": settings.APP_NAME},
        timestamp=datetime.now()
    ).dict()