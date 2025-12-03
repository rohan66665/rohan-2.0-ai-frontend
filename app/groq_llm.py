from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_groq_llm(system_prompt: str, user_prompt: str):
    try:
        response = client.chat.completions.create(
            model=os.getenv("GROQ_LLM_MODEL"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"LLM Error: {e}"
