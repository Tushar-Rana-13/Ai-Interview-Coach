from uuid import UUID
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.models.resume import Resume
from app.repositories.candidate import CandidateRepository
from app.repositories.resume import ResumeRepository
from app.repositories.resume_analysis import ResumeAnalysisRepository
from app.schemas.candidate import CandidateCreate, CandidateResponse
from app.schemas.resume import ResumeResponse
from app.schemas.resume_analysis_record import (
    ResumeAnalysisRecordResponse,
)
from app.services.resume_analysis import analyze_resume
from app.services.resume_extraction import extract_resume_text
from app.services.resume_storage import STORAGE_DIR, save_resume

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
        stored_path = STORAGE_DIR / stored_filename
        extracted_text = extract_resume_text(str(stored_path))
        resume = await ResumeRepository.create(
            db=db,
            candidate_id=candidate_id,
            filename=stored_filename,
            file_path=relative_path,
            extracted_text=extracted_text,
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


@router.post(
    "/{candidate_id}/resumes/{resume_id}/analysis",
    response_model=ResumeAnalysisRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_resume_analysis(
    candidate_id: UUID,
    resume_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ResumeAnalysisRecordResponse:
    """Analyze an uploaded resume and persist the structured profile."""

    settings = get_settings()

    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI analysis is not configured. Set OPENAI_API_KEY.",
        )

    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.candidate_id == candidate_id,
        )
    )
    resume = result.scalar_one_or_none()

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found for this candidate.",
        )

    if not resume.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Resume has no extracted text to analyze.",
        )

    try:
        profile = await analyze_resume(resume.extracted_text)

        record = await ResumeAnalysisRepository.create(
            db=db,
            resume_id=resume.id,
            model_name=settings.OPENAI_MODEL,
            profile=profile,
        )

        await db.commit()
        await db.refresh(record)

        return record

    except Exception:
        await db.rollback()
        raise
