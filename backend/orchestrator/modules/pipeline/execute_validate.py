from common.pipeline_base import CoreAPIClient
from common.logger import logger


log = logger("execute_validate_pipeline")


class ExecutionAndValidationPipeline(CoreAPIClient):
    def __init__(self):
        super().__init__()
        log.debug("Initialized ExecutionAndValidationPipeline")

    def execute_sap(self):
        try:
            log.info("Executing SAP manager session")
            self._post("/sap-manager/session")
            log.info("SAP manager session completed successfully")
        except Exception as e:
            log.error(f"SAP manager session failed: {str(e)}", exc_info=True)
            raise

    def execute_requests_builder(self):
        try:
            log.info("Executing requests builder requester")
            self._post("requests-builder/requester")
            log.info("Requests builder requester completed successfully")
        except Exception as e:
            log.error(f"Requests builder requester failed: {str(e)}", exc_info=True)
            raise

    def execute_requests_checker(self):
        try:
            log.info("Executing requests checker LT22 open")
            self._post("requests-checker/lt22/open")
            log.info("Requests checker LT22 open completed successfully")
            
            log.info("Executing requests checker LT22 request")
            self._post("requests-checker/lt22/request")
            log.info("Requests checker LT22 request completed successfully")
        except Exception as e:
            log.error(f"Requests checker execution failed: {str(e)}", exc_info=True)
            raise