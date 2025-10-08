import openapi
openapi.key="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"

def evaluate_transcript(transcript , skill_name):
    prompt = f"""Evaluate the following transcript for conceptual understanding of {skill_name}.Rate the understanding from 1 to 100 and give a short explanation.Transcript:{transcript}"""
    response=openapi.ChatCompletion.create(
        model="gpt-4o",
        messages=[
        {"role": "system", "content": "You are an expert evaluator of technical skills."},
        {"role": "user", "content": prompt}
    ],
    temperture=0
    )
    evaluation_text=response['choices'][0]['message']['content']
    import re
    match=re.search(r'(\d{1,3})',evaluation_text)
    score=int(match.group(1)) if match else 0
    return score, evaluation_text

