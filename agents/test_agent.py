import os
import anthropic

api_key = os.getenv('ANTHROPIC_API_KEY', '').strip()
print(f"API key length: {len(api_key)}")

client = anthropic.Anthropic(api_key=api_key)
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=100,
    messages=[{"role": "user", "content": "Say hello from the autocode agent!"}]
)
print("✅ Agent working!")
print(response.content[0].text)
