from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path

from fastapi import File, UploadFile

from app.models.resume import Resume
from app.repositories.resume import ResumeRepository
from app.schemas.resume import ResumeResponse
from app.services.resume_storage import STORAGE_DIR, save_resume
from app.core.database import get_db
from app.repositories.candidate import CandidateRepository
from app.schemas.candidate import CandidateCreate, CandidateResponse


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


@router.post(
    "",
    response_model=CandidateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_candidate(
    candidate_data: CandidateCreate,
    db: AsyncSession = Depends(get_db),
) -> CandidateResponse:
    """Create a new candidate."""

    candidate = await CandidateRepository.create(
        db=db,
        candidate_data=candidate_data,
    )

    return candidate


@router.get(
    "/{candidate_id}",
    response_model=CandidateResponse,
)
async def get_candidate(
    candidate_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> CandidateResponse:
    """Get a candidate by ID."""

    candidate = await CandidateRepository.get_by_id(
        db=db,
        candidate_id=candidate_id,
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    return candidate


@router.post(
    "/{candidate_id}/resumes",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    candidate_id: UUID,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
) -> ResumeResponse:
    """Upload a resume for an existing candidate."""

    candidate = await CandidateRepository.get_by_id(
        db=db,
        candidate_id=candidate_id,
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    stored_filename, relative_path = await save_resume(file)

    try:
        resume = await ResumeRepository.create(
            db=db,
            candidate_id=candidate_id,
            filename=stored_filename,
            file_path=relative_path,
        )

        await db.commit()
        await db.refresh(resume)

        return resume

    except Exception:
        await db.rollback()

        stored_path = STORAGE_DIR / stored_filename
        stored_path.unlink(missing_ok=True)

        raise

    finally:
        await file.close()
