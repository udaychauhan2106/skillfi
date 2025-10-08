import whisper

model=whisper.load_model("base")

def transcribe_video(video_path):
    result=model.transcribe(video_path)
    transcribe=result["text"]
    return transcribe



