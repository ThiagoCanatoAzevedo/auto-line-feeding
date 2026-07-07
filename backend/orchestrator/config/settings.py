from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import threading, os


RUNNER_LOCK = threading.Lock()
RUNNER_STOP = threading.Event()

class Settings(BaseSettings):
    # -- APP CONFIG --
    APP_NAME: str
    APP_URL: str
    FILES_DRIVER: str
    # -- MQTT CONFIG --
    AL_MQTT_ENDPOINT: str
    AL_MQTT_HOST: str
    AL_MQTT_PORT: int
    AL_MQTT_SUBSCRIBE_TOPIC: str
    AL_MQTT_PATH: str
    # -- CORE CONFIG --
    CORE_URL: str

    model_config = SettingsConfigDict(
        env_file="config/.env.test" if os.getenv("TESTING") == "true" else "config/.env",
        extra="forbid",
        case_sensitive=True,
    )

settings = Settings()