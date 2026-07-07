from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    error: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
