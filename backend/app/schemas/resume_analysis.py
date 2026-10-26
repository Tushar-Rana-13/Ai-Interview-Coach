
from pydantic import BaseModel, Field


class SkillItem(BaseModel):
    name: str = Field(description="Name of the skill explicitly supported by the resume.")
    evidence: str = Field(
        description="Short excerpt or explanation grounded in the resume."
    )


class ProjectItem(BaseModel):
    name: str = Field(description="Project name stated in the resume.")
    description: str = Field(
        description="Project purpose and functionality, using only supported facts."
    )
    technologies: list[str] = Field(default_factory=list)
    contributions: list[str] = Field(
        default_factory=list,
        description="Candidate contributions explicitly supported by the resume.",
    )
    evidence: str = Field(
        description="Resume text supporting the project's details."
    )


class EducationItem(BaseModel):
    qualification: str
    institution: str
    graduation_year: str | None = None
    details: list[str] = Field(default_factory=list)
    evidence: str


class ExperienceItem(BaseModel):
    role: str
    organization: str
    duration: str | None = None
    responsibilities: list[str] = Field(default_factory=list)
    evidence: str


class ResumeAnalysis(BaseModel):
    summary: str = Field(
        description="Concise summary of the candidate based only on the resume."
    )
    skills: list[SkillItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
