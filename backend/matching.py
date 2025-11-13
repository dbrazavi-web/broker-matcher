def match_employer_to_brokers(employer_data, broker_list):
    """Match employer to top 3 brokers using weighted algorithm"""
    
    matches = []
    
    for broker in broker_list:
        score = 0
        reasons = []
        
        # Weight 1: Can solve gaps (40%)
        employer_gaps = employer_data.get("missing_benefits", [])
        broker_capabilities = broker.get("niche_data", {}).get("capabilities", [])
        
        gaps_solved = len([g for g in employer_gaps if g in broker_capabilities])
        if employer_gaps:
            gap_score = (gaps_solved / len(employer_gaps)) * 40
            score += gap_score
            if gaps_solved > 0:
                reasons.append(f"Can solve {gaps_solved}/{len(employer_gaps)} gaps")
        
        # Weight 2: Industry match (30%)
        employer_industry = employer_data.get("industry", "tech")
        broker_industries = broker.get("niche_data", {}).get("industry_focus", {})
        
        if employer_industry in broker_industries:
            industry_pct = broker_industries.get(employer_industry, 0)
            score += (industry_pct / 100) * 30
            reasons.append(f"{industry_pct}% specialized in {employer_industry}")
        
        # Weight 3: Size match (20%)
        employer_size = employer_data.get("employee_count", 75)
        broker_size_range = broker.get("niche_data", {}).get("size_range", "50-150")
        
        try:
            min_size, max_size = map(int, broker_size_range.split("-"))
            if min_size <= employer_size <= max_size:
                score += 20
                reasons.append(f"Serves {broker_size_range} employees")
        except:
            pass
        
        # Weight 4: Proven outcomes (10%)
        retention = broker.get("niche_data", {}).get("retention_rate", 0)
        if retention > 90:
            score += 10
            reasons.append(f"{retention}% retention")
        
        matches.append({
            "broker": broker,
            "score": int(score),
            "reasons": reasons
        })
    
    # Sort by score, return top 3
    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:3]