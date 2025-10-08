import openai
import os
import re
import json
openai.api_key=os.getenv("OPENAI_API_KEY")
if openai.api_key is None:
    raise ValueError("OPENAI_API_KEY environment variable not set")
def evaluate_code(code_snippet, skill_name):
    
    prompt = f"""
    You are an expert {skill_name} programmer.
    Evaluate the following code for correctness, logic, efficiency.
    Rate it 1-100 and give short feedback.

    Code:
    {code_snippet[:4000]}
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
def list_code_files(project_path, extensions=None):
    if extensions is None:
        extensions = [".py", ".ipynb", ".js", ".java", ".cpp"]
    code_files = []
    for root, _, files in os.walk(project_path):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                code_files.append(os.path.join(root, file))
    return code_files



def detect_ai_code(code_text: str):
    
    prompt = f"""
    You are an expert AI content detector. Analyze the following code and rate from 0 to 100
    how likely it is to be AI-generated (e.g., from ChatGPT, Copilot, etc.).
    0 = definitely human-written, 100 = definitely AI-generated.
    
    Code:
    {code_text[:4000]}  
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        result = response.choices[0].message.content
        match = re.search(r'(\d{1,3})', result)
        score = int(match.group(1)) if match else 0
        return score, result
    except Exception as e:
        return 0, f"Error detecting AI code: {e}"
    


def assess_coding_skill(code_path, skill_name):
    
    if os.path.isdir(code_path):
        code_files = list_code_files(code_path)
        total_score, ai_scores = 0, []
        detailed_feedback = []

        for file in code_files:
            with open(file, "r", encoding="utf-8", errors="ignore") as f:
                code = f.read()

            
            score, feedback = evaluate_code(code, skill_name)
            total_score += score
            detailed_feedback.append({file: feedback})

            
            ai_score, ai_feedback = detect_ai_code(code)
            ai_scores.append(ai_score)
            detailed_feedback.append({file + "_ai_check": ai_feedback})

        avg_score = round(total_score / len(code_files), 2) if code_files else 0
        avg_ai_score = round(sum(ai_scores) / len(ai_scores), 2) if ai_scores else 0

        practical_feedback = {
            "type": "project",
            "project_score": avg_score,
            "ai_generated_score": avg_ai_score,
            "detailed_feedback": detailed_feedback
        }
        return avg_score, json.dumps(practical_feedback, indent=2)

    else:
        
        with open(code_path, "r", encoding="utf-8", errors="ignore") as f:
            code = f.read()

        score, feedback = evaluate_code(code, skill_name)
        ai_score, ai_feedback = detect_ai_code(code)

        practical_feedback = {
            "type": "single_file",
            "code_score": score,
            "ai_generated_score": ai_score,
            "feedback": feedback,
            "ai_feedback": ai_feedback
        }
        return score, json.dumps(practical_feedback, indent=2)