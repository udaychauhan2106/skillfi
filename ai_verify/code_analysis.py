import openai
import os
import re
openai.api_key=os.getenv("OPEN_API_KEY")
if openai.api_key is None:
    raise ValueError("OPENAI_API_KEY environment variable not set")
def evaluate_code(code_snippet, skill_name):
    
    prompt = f"""
    You are an expert {skill_name} programmer.
    Evaluate the following code for correctness, logic, efficiency.
    Rate it 1-100 and give short feedback.

    Code:
    {code_snippet}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert code reviewer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        evaluation_text = response['choices'][0]['message']['content']
        match = re.search(r'(\d{1,3})', evaluation_text)
        score = int(match.group(1)) if match else 0
    except Exception as e:
        print(f"Error evaluating code: {e}")
        score = 0
        evaluation_text = ""
    return score, evaluation_text

