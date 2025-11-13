import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

def save_broker(email, name, specialization_score, niche_data):
    """Save broker to database - simplified for testing"""
    # For now, just return a mock ID
    # TODO: Fix database schema and re-enable actual saves
    return f"broker_{email.split('@')[0]}"

def save_employer(email, company_name, alignment_score, gap_data, stakeholder_data):
    """Save employer to database - simplified for testing"""
    return f"employer_{email.split('@')[0]}"

def get_all_brokers():
    """Get all brokers for matching"""
    # Return empty for now
    return []

def save_match(employer_id, broker_id, match_score, match_reason):
    """Save a match"""
    return f"match_{employer_id}_{broker_id}"
