import anthropic
import os

client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=3000,
    messages=[{"role": "user", "content": """Create a complete React TypeScript DraggableMarker component for Maptap that:

1. Uses react-leaflet Marker as base
2. Handles drag events to update position
3. Works with MapPoint interface (has id, position {lat, lng}, properties)
4. Includes proper TypeScript types
5. Has accessibility support
6. Emits onPositionChange events

Provide complete production-ready code with comments."""}]
)

with open('agents/mp3_quick_result.md', 'w') as f:
    f.write("# MP-3: Quick Draggable Marker Implementation\n\n")
    f.write(response.content[0].text)

print("✅ MP-3 implementation generated!")
print("📄 Saved to: agents/mp3_quick_result.md")
