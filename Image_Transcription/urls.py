# Image_Transcription/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.image_transcription_view, name='image_transcription'),  # Ruta principal de la app
]
