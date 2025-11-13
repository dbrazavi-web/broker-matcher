from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import claude_interview
from scoring_engine import (
    calculate_broker_score,
    calculate_employer_score,
    get_priority_tier,
    get_follow_up_action,
    generate_segment_label
)
import json
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

interviews = {}

# Simple JSON storage (replace with Supabase later)
DATA_DIR = "/tmp/rightfit_data"
os.makedirs(DATA_DIR, exist_ok=True)

def save_survey(user_type, data):
    filename = f"{DATA_DIR}/{user_type}_surveys.json"
    surveys = []
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            surveys = json.load(f)
    surveys.append(data)
    with open(filename, 'w') as f:
        json.dump(surveys, f, indent=2)

def load_surveys(user_type):
    filename = f"{DATA_DIR}/{user_type}_surveys.json"
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            return json.load(f)
    return []

@app.post("/api/start-interview")
async def start_interview(request: dict):
    user_type = request.get("user_type", "employer")
    session_id = request.get("session_id")
    priorities = request.get("priorities", [])
    
    interview_data = claude_interview.start_interview(user_type, priorities)
    interviews[session_id] = interview_data
    
    return {"greeting": interview_data["greeting"]}

@app.post("/api/continue-interview")
async def continue_interview(request: dict):
    session_id = request.get("session_id")
    message = request.get("message")
    
    if not session_id or session_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    interview_data = interviews[session_id]
    result = claude_interview.continue_interview(
        message,
        interview_data["conversation_history"],
        interview_data["system_prompt"]
    )
    
    interview_data["conversation_history"] = result["conversation_history"]
    
    return result

def calculate_broker_metrics(data):
    specialization_score = 75
    market_position = "Emerging Specialist"
    recommendations = [
        "Focus on your niche expertise",
        "Build case studies showcasing ROI"
    ]
    return specialization_score, market_position, recommendations

def calculate_employer_metrics(data):
    alignment_score = 68
    gaps = ["Missing parental leave", "Limited PTO"]
    matches = [
        {"name": "Benefits Pro Inc", "score": 92},
        {"name": "HR Solutions", "score": 88},
        {"name": "Total Rewards Co", "score": 85}
    ]
    return alignment_score, gaps, matches

@app.post("/api/complete-broker")
async def complete_broker_interview(request: dict):
    session_id = request.get("session_id")
    email = request.get("email")
    name = request.get("name")
    
    if not session_id or session_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    conversation_history = interviews[session_id]["conversation_history"]
    extracted_data = claude_interview.extract_final_data(conversation_history, "broker")
    extracted_data["email"] = email
    extracted_data["name"] = name
    
    score = calculate_broker_score(extracted_data)
    priority = get_priority_tier(score)
    action = get_follow_up_action(score, "broker")
    segment = generate_segment_label(extracted_data, "broker")
    
    broker_data = {
        "email": email,
        "name": name,
        "data": extracted_data,
        "desperation_score": score,
        "priority": priority,
        "segment": segment,
        "next_action": action,
        "created_at": datetime.now().isoformat()
    }
    
    save_survey("broker", broker_data)
    
    specialization_score, market_position, recommendations = calculate_broker_metrics(extracted_data)
    
    return {
        "success": True,
        "specialization_score": specialization_score,
        "market_position": market_position,
        "recommendations": recommendations,
        "desperation_score": score,
        "priority": priority,
        "segment": segment
    }

@app.post("/api/complete-employer")
async def complete_employer_interview(request: dict):
    session_id = request.get("session_id")
    email = request.get("email")
    company_name = request.get("company_name")
    
    if not session_id or session_id not in interviews:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    conversation_history = interviews[session_id]["conversation_history"]
    extracted_data = claude_interview.extract_final_data(conversation_history, "employer")
    extracted_data["email"] = email
    extracted_data["company_name"] = company_name
    
    score = calculate_employer_score(extracted_data)
    priority = get_priority_tier(score)
    action = get_follow_up_action(score, "employer")
    segment = generate_segment_label(extracted_data, "employer")
    
    employer_data = {
        "email": email,
        "company_name": company_name,
        "data": extracted_data,
        "desperation_score": score,
        "priority": priority,
        "segment": segment,
        "next_action": action,
        "created_at": datetime.now().isoformat()
    }
    
    save_survey("employer", employer_data)
    
    alignment_score, gaps, matches = calculate_employer_metrics(extracted_data)
    
    return {
        "success": True,
        "alignment_score": alignment_score,
        "gaps": gaps,
        "broker_matches": matches,
        "desperation_score": score,
        "priority": priority,
        "segment": segment,
        
        # RAW SURVEY RESPONSES (their actual words)
        "company_name": company_name,
        "email": email,
        "company_size": extracted_data.get("company_size", ""),
        "industry": extracted_data.get("industry", ""),
        "headquarters": extracted_data.get("headquarters", ""),
        "biggest_problem": extracted_data.get("biggest_problem", ""),
        "timeline": extracted_data.get("timeline", ""),
        "monthly_cost": extracted_data.get("monthly_cost", ""),
        "consequence": extracted_data.get("consequence", ""),
        "disagreement": extracted_data.get("disagreement", ""),
        
        # OPEN-ENDED RESPONSES (their actual words from conversational AI)
        "last_broker_interaction": extracted_data.get("last_broker_interaction", ""),
        "magic_wand_change": extracted_data.get("magic_wand", ""),
        "top_priority": extracted_data.get("top_priority", ""),
        "switching_history": extracted_data.get("switching_history", ""),
        "when_need": extracted_data.get("when_need", "")
    }

@app.get("/api/dashboard")
async def get_dashboard():
    brokers = load_surveys("broker")
    employers = load_surveys("employer")
    
    # Sort by desperation score
    brokers.sort(key=lambda x: x.get('desperation_score', 0), reverse=True)
    employers.sort(key=lambda x: x.get('desperation_score', 0), reverse=True)
    
    high_priority_brokers = [b for b in brokers if b.get('desperation_score', 0) >= 80]
    high_priority_employers = [e for e in employers if e.get('desperation_score', 0) >= 80]
    
    # Segment analysis
    broker_segments = {}
    for b in brokers:
        seg = b.get('segment', 'Unknown')
        if seg not in broker_segments:
            broker_segments[seg] = {"count": 0, "scores": []}
        broker_segments[seg]["count"] += 1
        broker_segments[seg]["scores"].append(b.get('desperation_score', 0))
    
    for seg in broker_segments:
        scores = broker_segments[seg]["scores"]
        broker_segments[seg]["avg_score"] = sum(scores) / len(scores) if scores else 0
        del broker_segments[seg]["scores"]
    
    # Pricing interest
    pricing_interest = {
        "$999": len([b for b in brokers if "$999" in str(b.get('data', {}).get('pricing_response', ''))]),
        "$499": len([b for b in brokers if "$499" in str(b.get('data', {}).get('pricing_response', ''))]),
        "$299": len([b for b in brokers if "$299" in str(b.get('data', {}).get('pricing_response', ''))]),
        "Not interested": len([b for b in brokers if "Not interested" in str(b.get('data', {}).get('pricing_response', ''))])
    }
    
    return {
        "total_brokers": len(brokers),
        "total_employers": len(employers),
        "high_priority_brokers": high_priority_brokers,
        "high_priority_employers": high_priority_employers,
        "broker_segments": sorted(broker_segments.items(), key=lambda x: x[1]["avg_score"], reverse=True),
        "pricing_interest": pricing_interest
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
