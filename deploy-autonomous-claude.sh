#!/bin/bash
# Deploy Autonomous Claude System

set -e

echo "🤖 DEPLOYING AUTONOMOUS CLAUDE SYSTEM"
echo "======================================"

# Check for Claude API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "🔑 Claude API Key Required"
    echo "Get your key from: https://console.anthropic.com/"
    read -p "Enter your Claude API key: " CLAUDE_KEY
    echo "ANTHROPIC_API_KEY=$CLAUDE_KEY" >> .env
    export ANTHROPIC_API_KEY="$CLAUDE_KEY"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install --user anthropic langchain-anthropic crewai python-dotenv
pnpm install --frozen-lockfile

# Make scripts executable
chmod +x agents/*.py

# Test Claude connection
python3 -c "
from langchain_anthropic import ChatAnthropic
import os
try:
    llm = ChatAnthropic(model='claude-3-5-sonnet-20241022', anthropic_api_key=os.getenv('ANTHROPIC_API_KEY'))
    print('✅ Claude API connection successful')
except Exception as e:
    print(f'❌ Claude API failed: {e}')
    exit(1)
"

echo "🚀 AUTONOMOUS CLAUDE SYSTEM READY!"
echo "Launch with: python3 agents/autonomous-claude-master.py"
echo "Or trigger via GitHub Actions workflow"
