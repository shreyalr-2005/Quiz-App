from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid

from database import get_connection, init_db
from models import SignupRequest, LoginRequest, AnswerSubmission
from questions import get_categories, get_questions_by_category, get_question_by_id, get_course_info

app = FastAPI(title="QuizMaster API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

# ─── Auth ───

@app.post("/api/signup")
def signup(req: SignupRequest):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
                       (req.name, req.username, req.password))
        conn.commit()
    except Exception:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    conn.close()
    return {"message": "Account created successfully"}

@app.post("/api/login")
def login(req: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (req.username,))
    user = cursor.fetchone()
    conn.close()
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = str(uuid.uuid4())
    return {"token": token, "name": user["name"], "username": user["username"]}

# ─── Quiz ───

@app.get("/api/categories")
def list_categories():
    return get_categories()

@app.get("/api/course/{category_id}")
def course_info(category_id: str):
    info = get_course_info(category_id)
    if not info:
        raise HTTPException(status_code=404, detail="Course not found")
    return info

@app.get("/api/questions")
def list_questions(category: Optional[str] = None, difficulty: Optional[str] = None):
    return get_questions_by_category(category, difficulty)

@app.post("/api/submit")
def submit_quiz(submission: AnswerSubmission):
    score = 0
    results = []
    for q_id_str, user_answer in submission.answers.items():
        q_id = int(q_id_str) if isinstance(q_id_str, str) else q_id_str
        q = get_question_by_id(q_id)
        if not q:
            continue
        is_correct = user_answer == q["correct_answer"]
        if is_correct:
            score += 1
        results.append({
            "id": q_id,
            "is_correct": is_correct,
            "correct_answer": q["correct_answer"],
            "user_answer": user_answer,
            "explanation": q.get("explanation", "")
        })

    if submission.username and submission.category:
        try:
            conn = get_connection()
            cursor = conn.cursor()
            total = len(results)
            percentage = (score / total * 100) if total > 0 else 0
            cursor.execute(
                "INSERT INTO scores (username, category, score, total, percentage, difficulty) VALUES (?, ?, ?, ?, ?, ?)",
                (submission.username, submission.category, score, total, percentage, submission.difficulty or "mixed")
            )
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error saving score: {e}")

    return {"score": score, "total": len(results), "results": results}

# ─── Scores ───

@app.get("/api/scores/{username}")
def get_scores(username: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scores WHERE username = ? ORDER BY taken_at DESC", (username,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/users")
def list_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.username, u.name, u.created_at,
            COUNT(s.id) AS quizzes_taken,
            COALESCE(ROUND(AVG(s.percentage), 1), 0) AS avg_score
        FROM users u LEFT JOIN scores s ON u.username = s.username
        GROUP BY u.username ORDER BY u.created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/leaderboard")
def leaderboard():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.name, u.username,
            COUNT(s.id) AS quizzes_taken,
            SUM(s.score) AS total_correct,
            SUM(s.total) AS total_questions,
            ROUND(AVG(s.percentage), 1) AS avg_percentage,
            MAX(s.percentage) AS best_score
        FROM users u INNER JOIN scores s ON u.username = s.username
        GROUP BY u.username
        ORDER BY avg_percentage DESC, total_correct DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
