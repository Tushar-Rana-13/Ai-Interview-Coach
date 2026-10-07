from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate


class CandidateRepository:
    """Database operations for candidates."""

    @staticmethod
    async def create(
        db: AsyncSession,
        candidate_data: CandidateCreate,
    ) -> Candidate:
        """Create and persist a new candidate."""

        candidate = Candidate(
            name=candidate_data.name,
            email=candidate_data.email,
        )

        db.add(candidate)
        await db.commit()
        await db.refresh(candidate)

        return candidate

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        candidate_id: UUID,
    ) -> Candidate | None:
        """Fetch a candidate by ID."""

        result = await db.execute(
            select(Candidate).where(Candidate.id == candidate_id)
        )

        return result.scalar_one_or_none()