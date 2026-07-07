from config.settings import settings, RUNNER_STOP, RUNNER_LOCK
from modules.pipeline.runner import runner
from common.logger import logger
import paho.mqtt.client as mqtt, threading, time


log = logger("mqtt_orchestrator")


class MQTTOrchestrator:
    def __init__(self):
        self.host = settings.AL_MQTT_HOST
        self.port = settings.AL_MQTT_PORT
        self.ws_path = settings.AL_MQTT_PATH
        self.topic = settings.AL_MQTT_SUBSCRIBE_TOPIC
        
        self.client = mqtt.Client(protocol=mqtt.MQTTv311, transport="websockets")
        self.client.tls_set(cert_reqs=False)
        self.client.tls_insecure_set(True)
        self.client.ws_set_options(path=self.ws_path)

        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.client.on_subscribe = self._on_subscribe

        log.debug(f"Initialized MQTT orchestrator for {self.host}:{self.port}")

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            log.info(f"Connected to MQTT broker at {self.host}:{self.port}")
        else:
            log.error(f"Failed to connect to MQTT broker. Code: {rc}")

    def _on_disconnect(self, client, userdata, rc, properties=None):
        if rc != 0:
            log.warning(f"Unexpected disconnection from MQTT broker. Code: {rc}")
        else:
            log.info("Disconnected from MQTT broker")

    def _on_subscribe(self, client, userdata, mid, granted_qos, properties=None):
        log.info(f"Subscribed to topic: {self.topic}")

    def _on_message(self, client, userdata, msg):
        if RUNNER_LOCK.locked():
            log.debug("Pipeline is already running, skipping message")
            return
        
        log.info(f"Received message from topic {msg.topic}")
        self._execute_pipeline()

    def _execute_pipeline(self):
        try:
            if not RUNNER_LOCK.acquire(blocking=False):
                log.warning("Could not acquire pipeline lock")
                return
            
            try:
                RUNNER_STOP.clear()
                log.info("Starting pipeline execution from MQTT trigger")
                runner()
                log.info("Pipeline execution completed from MQTT trigger")
            finally:
                RUNNER_LOCK.release()
                
        except Exception as e:
            log.error(f"Pipeline execution failed: {str(e)}", exc_info=True)
        finally:
            if RUNNER_LOCK.locked():
                try:
                    RUNNER_LOCK.release()
                except RuntimeError:
                    pass

    def connect(self):
        try:
            log.info(f"Connecting to MQTT broker at {self.host}:{self.port}")
            self.client.connect(self.host, self.port, keepalive=60)
            log.debug(f"Subscribing to topic: {self.topic}")
            self.client.subscribe(self.topic)
        except Exception as e:
            log.error(f"Failed to connect to MQTT broker: {str(e)}", exc_info=True)
            raise

    def start(self):
        try:
            RUNNER_STOP.clear()
            log.info("Starting MQTT client loop")
            self.client.loop_start()
            time.sleep(0.5)
            log.info("MQTT client loop started")
        except Exception as e:
            log.error(f"Failed to start MQTT client loop: {str(e)}", exc_info=True)
            raise

    def stop(self):
        try:
            log.info("Stopping MQTT client")
            RUNNER_STOP.set()
            time.sleep(1)
            self.client.loop_stop()
            self.client.disconnect()
            log.info("MQTT client stopped")
        except Exception as e:
            log.error(f"Error stopping MQTT client: {str(e)}", exc_info=True)