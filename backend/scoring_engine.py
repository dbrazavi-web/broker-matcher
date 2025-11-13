"""
INVERSE SCORING SYSTEM:
- LOW display score (20-40) = HIGH internal priority = Urgent customer
- HIGH display score (70-100) = LOW internal priority = Tire kicker

Display score shown to user motivates action
Internal score used for our prioritization
"""

def calculate_broker_score(data):
    score = 100  # Start high, subtract for problems
    
    # BIGGEST PROBLEM
    problem = str(data.get('biggest_problem', '') + data.get('problem', ''))
    if 'desperately' in problem.lower() or 'dried up' in problem.lower():
        score -= 40  # HIGH PRIORITY FOR US
    elif 'tanking' in problem.lower() or 'leaving' in problem.lower():
        score -= 35
    elif 'commoditized' in problem.lower() or "differentiate" in problem.lower():
        score -= 30
    
    # MONTHLY LOSS
    monthly_loss = str(data.get('monthly_loss', '') + data.get('revenue_losing', ''))
    if '$20K+' in monthly_loss or '20K+' in monthly_loss:
        score -= 25
    elif '$10-20K' in monthly_loss or '10-20K' in monthly_loss:
        score -= 20
    elif '$5-10K' in monthly_loss:
        score -= 15
    
    # CONSEQUENCE
    consequence = str(data.get('consequence', ''))
    if 'badly' in consequence.lower() or 'stalls' in consequence.lower():
        score -= 20
    elif 'Lose major' in consequence:
        score -= 15
    
    # TIMELINE
    timeline = str(data.get('timeline', '') + data.get('when_need', ''))
    if 'This week' in timeline or 'urgent' in timeline.lower():
        score -= 15
    elif 'This month' in timeline:
        score -= 10
    
    return max(5, score)

def calculate_employer_score(data):
    score = 100  # Start high, subtract for problems
    
    # BIGGEST PROBLEM
    problem = str(data.get('biggest_problem', '') + data.get('problem', ''))
    if 'ASAP' in problem or '30 days' in problem or 'Renewal' in problem:
        score -= 40  # HIGH PRIORITY FOR US
    elif 'Losing talent' in problem or 'terrible' in problem:
        score -= 35
    elif 'paralysis' in problem.lower() or "can't align" in problem.lower():
        score -= 30
    
    # MONTHLY COST
    monthly_cost = str(data.get('monthly_cost', '') + data.get('costing', ''))
    if '$50K+' in monthly_cost or '50K+' in monthly_cost:
        score -= 25
    elif '$20-50K' in monthly_cost or '20-50K' in monthly_cost:
        score -= 20
    elif '$10-20K' in monthly_cost:
        score -= 15
    
    # CONSEQUENCE
    consequence = str(data.get('consequence', ''))
    if 'Lose multiple' in consequence or 'way more' in consequence:
        score -= 20
    elif 'stuck' in consequence.lower() or 'paralysis' in consequence.lower():
        score -= 15
    
    # TIMELINE
    timeline = str(data.get('timeline', '') + data.get('when_need', ''))
    if 'Within 2 weeks' in timeline or 'urgent' in timeline.lower():
        score -= 15
    elif 'Within 1-2 months' in timeline:
        score -= 10
    
    # STAKEHOLDER CONFLICT
    disagreement = str(data.get('disagreement', '') + data.get('biggest_disagreement', ''))
    if 'CEO' in disagreement and ('CFO' in disagreement or 'blocks' in disagreement.lower()):
        score -= 15
    elif 'cheap' in disagreement.lower() or "Can't agree" in disagreement:
        score -= 10
    
    return max(5, score)

def get_priority_tier(score):
    """LOW SCORE = HIGH PRIORITY"""
    if score <= 30:
        return "HIGH"
    elif score <= 60:
        return "MEDIUM"
    else:
        return "LOW"

def get_internal_priority(score):
    """INVERSE: Low display score = High internal priority"""
    if score <= 30:
        return 95  # Top priority internally
    elif score <= 60:
        return 60  # Medium priority
    else:
        return 20  # Low priority - tire kicker

def generate_segment_label(data, user_type):
    if user_type == "broker":
        city = str(data.get('headquarters', 'Unknown')).split(',')[0].strip()
        industries = str(data.get('industry', '') + data.get('industries', 'General'))
        return f"{city} | {industries}"
    else:
        size = str(data.get('company_size', 'Unknown'))
        industry = str(data.get('industry', 'Unknown'))
        return f"{size} employees | {industry}"

def get_follow_up_action(score, user_type):
    """Determine next action based on score"""
    if score <= 30:
        return "Immediate outreach - high priority"
    elif score <= 60:
        return "Schedule discovery call within 48 hours"
    else:
        return "Add to nurture sequence"
