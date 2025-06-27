#!/usr/bin/env python3
"""
Claude Backend Agent - Express/Node.js Specialist
"""

import os
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv

load_dotenv()

def main():
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("❌ ANTHROPIC_API_KEY required")
        return
    
    llm = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )
    
    agent = Agent(
        role="Senior Backend Developer",
        goal="Implement robust server-side functionality",
        backstory="Expert in Express.js, TypeScript, data validation, and security",
        llm=llm
    )
    
    task = Task(
        description="Implement MP-1 CSV import/export with comprehensive validation",
        agent=agent,
        expected_output="Complete CSV processing system"
    )
    
    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
    result = crew.kickoff()
    
    print("✅ Backend implementation completed")
    return result

if __name__ == "__main__":
    main()
