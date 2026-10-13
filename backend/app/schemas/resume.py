from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ResumeResponse(BaseModel):
    """Resume metadata returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    candidate_id: UUID
    filename: str
    file_path: str
    extracted_text: str | None
    created_at: datetime