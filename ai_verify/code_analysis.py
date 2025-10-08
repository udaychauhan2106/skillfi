import openai

openai.api_key = "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"

def evaluate_code(code_snippet, skill_name):
    
    prompt = f"""
    You are an expert {skill_name} programmer.
    Evaluate the following code for correctness, logic, efficiency.
    Rate it 1-100 and give short feedback.

    Code:
    {code_snippet}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert code reviewer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )

    evaluation_text = response['choices'][0]['message']['content']

    
    import re
    match = re.search(r'(\d{1,3})', evaluation_text)
    score = int(match.group(1)) if match else 0

    return score, evaluation_text
