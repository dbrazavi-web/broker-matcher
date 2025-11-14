import re

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def start_interview(user_type):
    return {
        "greeting": f"👋 Hi! Let's match you with the right {'employers' if user_type == 'broker' else 'broker'}. What's your work email?",
        "system_prompt": "",
        "conversation_history": []
    }

def continue_interview(message, history, system_prompt):
    # Check if first message (email)
    if len(history) == 0:
        if not is_valid_email(message):
            return {
                "next_question": "Please enter a valid work email address.",
                "conversation_history": history,
                "interview_complete": False
            }
    
    history.append({"role": "user", "content": message})
    
    # Questions in order
    questions = [
        "What's your company name?",
        "What's your company size? (e.g., 1-50 employees, 51-200 employees, 201-500 employees, 500+ employees)",
        "What's your biggest priority? (e.g., Cost control, Employee satisfaction, Faster decisions, Better service)",
        "When do you need a solution? (e.g., Immediately, Within 30 days, Within 90 days, Just exploring)"
    ]
    
    # Current question = number of user messages - 1 (subtract email)
    question_num = (len([m for m in history if m['role'] == 'user']) - 1)
    
    if question_num >= len(questions):
        return {"interview_complete": True, "conversation_history": history}
    
    return {
        "next_question": questions[question_num],
        "conversation_history": history,
        "interview_complete": False
    }

def extract_final_data(history, user_type):
    return {"sample": "data"}
