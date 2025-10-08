import whisper

model=whisper.load_model("base")

def transcribe_video(video_path):
    try:
        result = model.transcribe(video_path)
        text = result["text"]
        segments = result.get("segments", [])
        if segments:
            avg_conf = sum(seg.get("avg_logprob", 0) for seg in segments) / len(segments)
            
            confidence = max(0, min(100, int((avg_conf + 1) * 50)))  
        else:
            confidence = 0
        return text, confidence
    except Exception as e:
        print(f"Error transcribing video {video_path}: {e}")
        return "", 0

def transcribe_all_videos(user_responses):
    
    for response in user_responses:
        video_path = response.get("video_path")
        if video_path:
            transcript, confidence = transcribe_video(video_path)
            response["transcript"] = transcript
            response["confidence"] = confidence
        else:
            response["transcript"] = None  
            response["confidence"] = 0
    return user_responses


