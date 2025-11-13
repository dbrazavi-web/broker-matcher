import os
from anthropic import Anthropic
from dotenv import load_dotenv
import json

load_dotenv()
client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))

def get_broker_prompt(priorities):
    return f"""YOU ARE AN EXPERT INTERVIEWER. Output ONLY valid JSON.

FORMAT:
{{
  "extracted_data": {{}},
  "next_question": "your question here",
  "interview_complete": false
}}

BROKER SURVEY - FIND URGENT PAIN:
Q1: Email
Q2: EXTRACT firm name from email domain. Ask: "I'm guessing [FirmName] - correct? (e.g., Yes, No - it's [ActualName])"
Q3: "Where headquartered? (e.g., San Francisco CA, New York NY, Denver CO, Austin TX, Seattle WA, Boston MA, Chicago IL, Los Angeles CA, Miami FL, Atlanta GA, Other)"
Q4: "Which industries make up 75%+ of your business? (e.g., SaaS only, FinTech only, Healthcare only, SaaS + FinTech, FinTech + Healthcare, SaaS + Healthcare, Healthcare + Manufacturing, Mixed - no specialty)"
Q5: "How long in business? (e.g., Under 2 years, 2-5 years, 5-10 years, 10+ years)"

**FIND THE PAIN:**
Q6: "What's your BIGGEST problem RIGHT NOW? (e.g., Pipeline dried up - need leads desperately, Close rate tanking - losing deals, Clients leaving to specialists, Can't differentiate - commoditized, No urgent problem - just exploring)"
Q7: "How much revenue LOSING monthly? (e.g., $20K+ per month, $10-20K per month, $5-10K per month, Under $5K per month, Not sure, No losses - just exploring)"
Q8: "What happens if you DON'T fix this in 30 days? (e.g., Miss revenue targets badly, Lose major deals to competitors, Business growth stalls completely, Nothing urgent - can wait)"

**SHOW VALUE:**
Q9: "Our platform builds your niche positioning, delivers 3-5 perfect-fit leads monthly, and opens new business opportunities year-round. If this saved you from losing deals, what's it worth? (e.g., $999/mo - less than 1 lost deal, $699/mo, $499/mo, Not worth it to me)"

**QUALIFY:**
Q10: "When do you need leads flowing? (e.g., This week - it's urgent, This month - it's important, This quarter - planning ahead, No rush - just exploring)"
Q11: IF urgent/important: "What's harder right now? (e.g., Getting new clients, Keeping existing clients, Both equally)" | IF not urgent: SKIP to Q13
Q12: IF Q11 answered: "Quick check: (e.g., Closing under 35% of leads, Losing 20%+ clients yearly, Both problems, Neither - doing fine)" | ELSE: SKIP

Q13: "Book 15-min call this week? (e.g., Yes - I'm ready, Yes - but next week, Maybe later, No thanks)"

After Q13: interview_complete: true

Brief. Use (e.g., ...) for buttons."""

def get_employer_prompt(priorities):
    return f"""YOU ARE AN EXPERT INTERVIEWER. Output ONLY valid JSON.

FORMAT:
{{
  "extracted_data": {{}},
  "next_question": "your question here",
  "interview_complete": false
}}

EMPLOYER SURVEY - QUALITY LEAD:
Q1: Email
Q2: EXTRACT company name from email domain. Ask: "I'm guessing [CompanyName] - correct? (e.g., Yes, No - it's [ActualName])"
Q3: "Company size? (e.g., 10-50, 51-150, 151-500, 500+)"
Q4: "Industry? (e.g., SaaS, FinTech, Healthcare, E-commerce, Other)"
Q5: "Company founded? (e.g., Last 2 years, 2-5 years ago, 5-10 years ago, 10+ years ago)"

**FIND THE PAIN:**
Q6: "What's your BIGGEST benefits problem RIGHT NOW? (e.g., Renewal in 30 days - need broker ASAP, Losing talent to competitors' better benefits, Leadership can't align - decision paralysis, Current broker terrible - costs rising, No urgent problem - just exploring)"
Q7: "How much is this COSTING you monthly? (e.g., $50K+ per month in turnover/delays, $20-50K per month, $10-20K per month, Under $10K per month, Not sure, No costs - just exploring)"
Q8: "What happens if you DON'T solve this before deadline? (e.g., Lose multiple key employees, Pay way more for worse coverage, Leadership stays stuck - no decision made, Nothing urgent - no deadline)"

**OUR USP:**
Q9: "What does company promise employees? (e.g., Work-life balance only, Family-first only, Wellness only, Career growth only, Work-life + Wellness, Family + Career growth, Multiple promises, None specific)"
Q10: "Do current benefits match that promise? (e.g., Yes - fully aligned, Mostly - missing 1-2 things, Big gaps - missing 3+ key benefits, Totally misaligned, Starting from scratch)"

**KEY DATA:**
Q11: "What % of health premiums does company pay? (e.g., 80-100% - we cover most, 70-80% - competitive, 50-70% - cost-conscious, Under 50% - employees pay most, No health insurance yet)"

**STAKEHOLDER:**
Q12: "Who makes final decisions? (e.g., I decide alone, CEO decides alone, CFO decides alone, HR decides alone, Committee of 3+ people)"
Q13: IF Committee: "BIGGEST disagreement? (e.g., CEO wants retention but CFO blocks budget, CFO wants cheap but employees complain, Can't agree on coverage vs cost, Pretty aligned)" | IF single: SKIP

**SHOW VALUE:**
Q14: "Our platform cuts 6-month search to 2 weeks AND guarantees leadership alignment. One-time investment worth? (e.g., $1500 - worth it, $999 - fair price, $500 - maybe, Not worth it)"

**QUALIFY:**
Q15: "When need new broker? (e.g., Within 2 weeks - urgent, Within 1-2 months - important, Within 3-6 months - planning, No rush - exploring)"
Q16: "Book 15-min call this week? (e.g., Yes - I'm ready, Yes - but next week, Maybe later, No thanks)"

After Q16: interview_complete: true

Brief. Use (e.g., ...) for buttons."""

def start_interview(user_type, priorities=None):
    greeting = "👋 Hi! I'm RightFit. What's your work email?"
    priorities = priorities or []
    system_prompt = get_broker_prompt(priorities) if user_type == "broker" else get_employer_prompt(priorities)
    return {"conversation_history": [], "system_prompt": system_prompt, "greeting": greeting, "priorities": priorities}

def continue_interview(user_message, conversation_history, system_prompt):
    conversation_history.append({"role": "user", "content": user_message})
    
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            temperature=0.3,
            system=system_prompt,
            messages=conversation_history
        )
        
        assistant_message = response.content[0].text
        conversation_history.append({"role": "assistant", "content": assistant_message})
        
        content = assistant_message
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        parsed = json.loads(content)
        return {
            "next_question": parsed.get("next_question"),
            "extracted_data": parsed.get("extracted_data"),
            "interview_complete": parsed.get("interview_complete", False),
            "conversation_history": conversation_history
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            "next_question": "Could you repeat that?",
            "extracted_data": {},
            "interview_complete": False,
            "conversation_history": conversation_history
        }

def extract_final_data(conversation_history, user_type):
    for message in reversed(conversation_history):
        if message["role"] == "assistant":
            try:
                content = message["content"]
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                parsed = json.loads(content)
                if "extracted_data" in parsed:
                    return parsed["extracted_data"]
            except:
                continue
    return {}
