
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume_analysis import ResumeAnalysisRecord
from app.schemas.resume_analysis import ResumeAnalysis


class ResumeAnalysisRepository:
    """Database operations for resume analysis records."""

    @staticmethod
    async def create(
        db: AsyncSession,
        resume_id: UUID,
        model_name: str,
        profile: ResumeAnalysis,
    ) -> ResumeAnalysisRecord:
        record = ResumeAnalysisRecord(
            resume_id=resume_id,
            model_name=model_name,
            profile=profile.model_dump(mode="json"),
        )

        db.add(record)
        await db.flush()

        return record
