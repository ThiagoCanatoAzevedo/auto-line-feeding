from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from common.schemas import APIResponse
from datetime import datetime


async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=APIResponse(
            success=False,
            message="Internal server error",
            error=str(exc),
            timestamp=datetime.now()
        ).dict()
    )


def setup_error_handlers(app: FastAPI):
    app.add_exception_handler(Exception, global_exception_handler)
