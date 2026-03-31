from pydantic import BaseModel
from typing import Dict, Optional

class SignupRequest(BaseModel):
    name: str
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class AnswerSubmission(BaseModel):
    answers: Dict[int, str]
    category: Optional[str] = None
    username: Optional[str] = None
    difficulty: Optional[str] = None
