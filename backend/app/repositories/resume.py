from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.resume import Resume


class ResumeRepository:
    """Database operations for resumes."""

    @staticmethod
    async def create(
        db: AsyncSession,
        candidate_id: UUID,
        filename: str,
        file_path: str,
    ) -> Resume:
        """Create a resume record and persist it."""

        resume = Resume(
            candidate_id=candidate_id,
            filename=filename,
            file_path=file_path,
        )

        db.add(resume)
        await db.flush()

        return resume