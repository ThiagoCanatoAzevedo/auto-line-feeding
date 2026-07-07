from config.settings import RUNNER_STOP
from modules.pipeline.ingestion import IngestionOrchestrationPipeline
from modules.pipeline.execute_validate import ExecutionAndValidationPipeline
from common.logger import logger
import time

log = logger("pipeline")


def runner():
    if RUNNER_STOP.is_set():
        log.info("Pipeline runner stopped before execution")
        return

    start_time = time.time()
    log.info("Starting orchestration pipeline execution")

    try:
        ingestion = IngestionOrchestrationPipeline()
        execute_validate = ExecutionAndValidationPipeline()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: assembly_line")
            return
        
        log.info("Step 1/7: Executing assembly line")
        ingestion.execute_assembly_line()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: forecaster")
            return
        
        log.info("Step 2/7: Executing forecaster")
        ingestion.execute_forecaster()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: consumption")
            return
        
        log.info("Step 3/7: Executing consumption")
        ingestion.execute_consumption()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: requests_builder")
            return
        
        log.info("Step 4/7: Executing requests builder")
        ingestion.execute_requests_builder()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: return_requests_made")
            return
        
        log.info("Step 5/7: Retrieving requests made")
        requests_made = ingestion.return_requests_made()
        log.info(f"Retrieved {len(requests_made) if isinstance(requests_made, list) else 'N/A'} requests")

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: sap_execution")
            return
        
        log.info("Step 6/7: Executing SAP session")
        execute_validate.execute_sap()

        if RUNNER_STOP.is_set():
            log.info("Pipeline stopped: requests_builder_execution")
            return

        if requests_made:
            log.info("Step 7/7: Executing requests")
            
            if RUNNER_STOP.is_set():
                log.info("Pipeline stopped: requests_builder_execution")
                return
            
            execute_validate.execute_requests_builder()
            
            if RUNNER_STOP.is_set():
                log.info("Pipeline stopped: requests_checker")
                return
            
            execute_validate.execute_requests_checker()
            log.info("Requests execution completed successfully")
        else:
            log.info("Step 7/7: No requests to execute")

        elapsed_time = time.time() - start_time
        log.info(f"Orchestration pipeline completed successfully in {elapsed_time:.2f}s")

    except Exception as e:
        log.error(f"Pipeline execution failed: {str(e)}", exc_info=True)
        raise
