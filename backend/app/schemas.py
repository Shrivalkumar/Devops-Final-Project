from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Status = Literal["PLANNED", "RUNNING", "SUCCEEDED", "FAILED"]
Risk = Literal["LOW", "MEDIUM", "HIGH"]
Environment = Literal["DEV", "STAGING", "PRODUCTION"]

class DeploymentCreate(BaseModel):
    service_name: str = Field(min_length=2, max_length=120)
    version: str = Field(min_length=1, max_length=80)
    environment: Environment = "STAGING"
    status: Status = "PLANNED"
    risk: Risk = "MEDIUM"
    owner: str = Field(default="Platform team", min_length=2, max_length=120)
    change_summary: str = Field(default="", max_length=1000)

class DeploymentUpdate(BaseModel):
    service_name: str | None = Field(default=None, min_length=2, max_length=120)
    version: str | None = Field(default=None, min_length=1, max_length=80)
    environment: Environment | None = None
    status: Status | None = None
    risk: Risk | None = None
    owner: str | None = Field(default=None, min_length=2, max_length=120)
    change_summary: str | None = Field(default=None, max_length=1000)

class DeploymentOut(DeploymentCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class StatsOut(BaseModel):
    total: int
    planned: int
    running: int
    succeeded: int
    failed: int
