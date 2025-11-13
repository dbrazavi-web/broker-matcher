from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import claude_interview
import scoring
import database
import reporting
import os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sessions = {}

class StartInterviewRequest(BaseModel):
    user_type: str
    session_id: str

class ContinueInterviewRequest(BaseModel):
    session_id: str
    message: str

class CompleteBrokerRequest(BaseModel):
    session_id: str
    email: str
    name: str

class CompleteEmployerRequest(BaseModel):
    session_id: str
    email: str
    company_name: str

@app.post("/api/start-interview")
def start_interview_endpoint(req: StartInterviewRequest):
    session = claude_interview.start_interview(req.user_type)
    sessions[req.session_id] = session
    return {"greeting": session["greeting"]}

@app.post("/api/continue-interview")
def continue_interview_endpoint(req: ContinueInterviewRequest):
    session = sessions.get(req.session_id, {})
    result = claude_interview.continue_interview(req.message, session.get("conversation_history", []), session.get("system_prompt", ""))
    sessions[req.session_id] = {"conversation_history": result["conversation_history"], "system_prompt": session.get("system_prompt")}
    return result

@app.post("/api/complete-broker")
def complete_broker_endpoint(req: CompleteBrokerRequest):
    session = sessions.get(req.session_id, {})
    conversation_history = session.get("conversation_history", [])
    
    extracted_data = claude_interview.extract_final_data(conversation_history, "broker")
    specialization_score = scoring.calculate_broker_specialization(extracted_data)
    broker_id = database.save_broker(req.email, req.name, specialization_score, extracted_data)
    
    broker_data = {
        "name": req.name,
        "email": req.email,
        "specialization_score": specialization_score,
        **extracted_data
    }
    
    pdf_filename = f"broker_{req.email.split('@')[0]}_report.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    reporting.generate_broker_report(broker_data, pdf_path)
    
    return {
        "success": True,
        "broker_id": broker_id,
        "specialization_score": specialization_score,
        "pdf_path": pdf_path,
        "extracted_data": extracted_data
    }

@app.post("/api/complete-employer")
def complete_employer_endpoint(req: CompleteEmployerRequest):
    session = sessions.get(req.session_id, {})
    conversation_history = session.get("conversation_history", [])
    
    extracted_data = claude_interview.extract_final_data(conversation_history, "employer")
    alignment_result = scoring.calculate_employer_alignment(extracted_data)
    employer_id = database.save_employer(req.email, req.company_name, alignment_result["alignment_score"], extracted_data, {})
    
    employer_data = {
        "company_name": req.company_name,
        "email": req.email,
        **alignment_result,
        **extracted_data
    }
    
    pdf_filename = f"employer_{req.email.split('@')[0]}_report.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    reporting.generate_employer_report(employer_data, pdf_path)
    
    return {
        "success": True,
        "employer_id": employer_id,
        "alignment_score": alignment_result["alignment_score"],
        "pdf_path": pdf_path,
        "extracted_data": alignment_result
    }

@app.get("/")
def root():
    return {"message": "RightFit API - Decision Science Platform"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
