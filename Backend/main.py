from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mock Quiz Database
quiz_questions = [
    {
        "id": 1,
        "text": "What does HTML stand for?",
        "options": [
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
            "Hyper Tool Mouse Language"
        ],
        "correct_answer": "Hyper Text Markup Language"
    },
    {
        "id": 2,
        "text": "Choose the correct HTML element for the largest heading:",
        "options": ["<heading>", "<h1>", "<h6>", "<head>"],
        "correct_answer": "<h1>"
    },
    {
        "id": 3,
        "text": "What does CSS stand for?",
        "options": [
            "Computer Style Sheets",
            "Colorful Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets"
        ],
        "correct_answer": "Cascading Style Sheets"
    },
    {
        "id": 4,
        "text": "Inside which HTML element do we put the JavaScript?",
        "options": ["<js>", "<scripting>", "<script>", "<javascript>"],
        "correct_answer": "<script>"
    },
    {
        "id": 5,
        "text": "Which property is used to change the background color?",
        "options": ["bgcolor", "color", "background-color", "bg-color"],
        "correct_answer": "background-color"
    }
]

class AnswerSubmission(BaseModel):
    answers: Dict[int, str]

@app.get("/api/questions")
def get_questions():
    # Return questions without correct answers to prevent cheating on frontend
    questions_without_answers = []
    for q in quiz_questions:
        questions_without_answers.append({
            "id": q["id"],
            "text": q["text"],
            "options": q["options"]
        })
    return questions_without_answers

@app.post("/api/submit")
def submit_quiz(submission: AnswerSubmission):
    score = 0
    results = []
    
    for q in quiz_questions:
        q_id = q["id"]
        user_answer = submission.answers.get(q_id)
        is_correct = user_answer == q["correct_answer"]
        
        if is_correct:
            score += 1
            
        results.append({
            "id": q_id,
            "is_correct": is_correct,
            "correct_answer": q["correct_answer"], # Send back the correct answer for review
            "user_answer": user_answer
        })
        
    return {
        "score": score,
        "total": len(quiz_questions),
        "results": results
    }
