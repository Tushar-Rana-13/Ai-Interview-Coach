from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class CandidateCreate(BaseModel):
    """Data required to create a candidate."""

    name: str | None = None
    email: EmailStr | None = None


class CandidateResponse(BaseModel):
    """Data returned by the API for a candidate."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str | None
    email: EmailStr | None
    created_at: datetime
    updated_at: datetime