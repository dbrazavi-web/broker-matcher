def start_interview(user_type):
    return {
        "greeting": f"👋 Hi! Let's match you with the right {'employers' if user_type == 'broker' else 'broker'}.",
        "system_prompt": "",
        "conversation_history": []
    }

def continue_interview(message, history, system_prompt):
    history.append({"role": "user", "content": message})
    
    # Complete after 3 Q&A pairs
    if len(history) >= 6:
        return {
            "interview_complete": True,
            "conversation_history": history
        }
    
    # Questions with (e.g., ...) format for buttons
    questions = [
        "What's your company size? (e.g., 1-50 employees, 51-200 employees, 201-500 employees, 500+ employees)",
        "What's your biggest priority? Select all that apply (e.g., Cost control, Employee satisfaction, Faster decisions, Better service)",
        "When do you need a solution? (e.g., Immediately, Within 30 days, Within 90 days, Just exploring)"
    ]
    
    q_num = len(history) // 2
    next_q = questions[q_num] if q_num < len(questions) else "Thanks!"
    
    return {
        "next_question": next_q,
        "conversation_history": history,
        "interview_complete": False
    }

def extract_final_data(history, user_type):
    return {"sample": "data"}
