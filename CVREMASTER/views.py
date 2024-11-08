from django.shortcuts import render

def transcription_view(request):
    return render(request, 'transcription.html')