from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

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