from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch

def generate_broker_report(broker_data, output_path):
    """Generate PDF report for broker"""
    
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("Your RightFit Specialization Analysis", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 0.3*inch))
    
    # Score
    score = broker_data.get("specialization_score", 0)
    score_text = Paragraph(f"<b>Your Specialization Score: {score}/100</b>", styles['Heading2'])
    story.append(score_text)
    story.append(Spacer(1, 0.2*inch))
    
    # Research quote
    quote = Paragraph(
        '<i>"Specialist brokers close deals at 61% vs 18% for generalists, '
        'command 43% higher fees, and receive 4.2X more referrals."</i><br/>'
        '— Gartner 2023, McKinsey B2B',
        styles['BodyText']
    )
    story.append(quote)
    story.append(Spacer(1, 0.3*inch))
    
    # CTA
    cta = Paragraph(
        "<b>Subscribe for $999/month to get unlimited employer assessment credits</b>",
        styles['BodyText']
    )
    story.append(cta)
    
    doc.build(story)
    return output_path

def generate_employer_report(employer_data, matches=None, output_path="employer_report.pdf"):
    """Generate PDF report for employer"""
    
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title = Paragraph("Your RightFit Benefits Analysis", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 0.3*inch))
    
    # Scores
    alignment_score = employer_data.get("alignment_score", 0)
    gap_cost = employer_data.get("gap_cost", 0)
    
    score_text = Paragraph(
        f"<b>Alignment Score: {alignment_score}/100</b><br/>"
        f"<b>Gap Cost: ${gap_cost:,}/year</b>",
        styles['Heading2']
    )
    story.append(score_text)
    story.append(Spacer(1, 0.3*inch))
    
    # Research quote
    quote = Paragraph(
        '<i>"59% of companies switch brokers within 18 months—'
        'costing $127K in turnover."</i><br/>'
        '— SHRM 2024',
        styles['BodyText']
    )
    story.append(quote)
    story.append(Spacer(1, 0.3*inch))
    
    # Gaps
    missing = employer_data.get("missing_benefits", [])
    if missing:
        gap_text = Paragraph("<b>Missing Benefits:</b>", styles['Heading3'])
        story.append(gap_text)
        for gap in missing:
            item = Paragraph(f"• {gap.replace('_', ' ').title()}", styles['BodyText'])
            story.append(item)
        story.append(Spacer(1, 0.2*inch))
    
    # Matches (if premium)
    if matches:
        match_text = Paragraph("<b>Your Perfect-Fit Brokers:</b>", styles['Heading3'])
        story.append(match_text)
        story.append(Spacer(1, 0.2*inch))
        
        for i, match in enumerate(matches, 1):
            broker = match["broker"]
            score = match["score"]
            reasons = match["reasons"]
            broker_name = broker.get("name", "Broker")
            
            broker_para = Paragraph(
                f"<b>{i}. {broker_name} - {score}/100</b><br/>" +
                "<br/>".join(f"• {r}" for r in reasons),
                styles['BodyText']
            )
            story.append(broker_para)
            story.append(Spacer(1, 0.2*inch))
    else:
        # CTA to upgrade
        cta = Paragraph(
            "<b>🔒 Unlock broker matches for $999/month</b>",
            styles['BodyText']
        )
        story.append(cta)
    
    doc.build(story)
    return output_path