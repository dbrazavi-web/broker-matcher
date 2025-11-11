import os
from dotenv import load_dotenv

load_dotenv()

# Validate required env vars
REQUIRED_VARS = ['CLAUDE_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
missing = [var for var in REQUIRED_VARS if not os.getenv(var)]
if missing:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")

# Export config
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')  # Optional for now
