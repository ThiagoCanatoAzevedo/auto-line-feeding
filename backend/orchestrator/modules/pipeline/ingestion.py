from common.pipeline_base import CoreAPIClient
from common.logger import logger

log = logger("ingestion_pipeline")


class IngestionOrchestrationPipeline(CoreAPIClient):
    def __init__(self):
        super().__init__()
        log.debug("Initialized IngestionOrchestrationPipeline")

    def execute_assembly_line(self):
        try:
            log.info("Executing assembly line upsert")
            self._post("assembly/upsert")
            log.info("Assembly line upsert completed successfully")
        except Exception as e:
            log.error(f"Assembly line upsert failed: {str(e)}", exc_info=True)
            raise

    def execute_forecaster(self):
        try:
            log.info("Executing forecaster upsert for FX4PD")
            self._post("forecast/upsert/fx4pd")
            log.info("Forecaster FX4PD upsert completed successfully")
            
            log.info("Executing forecaster upsert")
            self._post("forecast/upsert")
            log.info("Forecaster upsert completed successfully")
        except Exception as e:
            log.error(f"Forecaster upsert failed: {str(e)}", exc_info=True)
            raise

    def execute_consumption(self):
        try:
            log.info("Executing consumption update to-consume")
            self._patch("consumption/update/to-consume")
            log.info("Consumption update completed successfully")
        except Exception as e:
            log.error(f"Consumption update failed: {str(e)}", exc_info=True)
            raise

    def execute_requests_builder(self):
        try:
            log.info("Executing requests builder upsert to-request")
            self._post("requests-builder/upsert/to-request")
            log.info("Requests builder upsert completed successfully")
        except Exception as e:
            log.error(f"Requests builder upsert failed: {str(e)}", exc_info=True)
            raise

    def return_requests_made(self):
        try:
            log.info("Fetching requests made from database")
            response = self._get("requests-builder/response/requests-made/db")
            result = response.json()
            log.debug(f"Retrieved requests made: {len(result) if isinstance(result, list) else 'N/A'} items")
            return result
        except Exception as e:
            log.error(f"Failed to fetch requests made: {str(e)}", exc_info=True)
            raise