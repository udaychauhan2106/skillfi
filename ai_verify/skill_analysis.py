import openai
import re
import os
openai.api_key=os.getenv("OPENAI_API_KEY")
if openai.api_key is None:
    raise ValueError("OPENAI_API_KEY environment variable not set")

def evaluate_transcript(transcript , skill_name):
    prompt = f"""Evaluate the following transcript for conceptual understanding and confidence of {skill_name}.Rate the understanding from 1 to 100 and give a short explanation.Transcript:{transcript}"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert evaluator of technical skills."},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )
        evaluation_text = response['choices'][0]['message']['content']
        match = re.search(r'(\d{1,3})', evaluation_text)
        score = int(match.group(1)) if match else 0
    except Exception as e:
        print(f"Error evaluating transcript: {e}")
        score = 0
        evaluation_text = ""
    return score, evaluation_text

def evaluate_user_resposne(user_response ,skill_name):
    for response in user_response:
        transcript=response.get("transcript","")
        confidence = response.get("confidence", 0)
        if transcript:
            eval_score, eval_text = evaluate_transcript(transcript, skill_name)
            adjusted_score = round(0.8 * eval_score + 0.2 * confidence)
            response["score"] = adjusted_score
            response["evaluation_text"] = eval_text
        else:
            response["score"]=0
            response["evaluation_text"]='No Transcript available'
    
    total_levels = sum(r['level'] for r in user_response)
    combined_score = sum(r['score'] * r['level']/total_levels for r in user_response)
    return round(combined_score, 2) , user_response["evaluation_text"]




