# Image_Transcription/models.py
from django.db import models

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploaded_images/')  # Campo para subir la imagen
    ocr_text = models.TextField(blank=True, null=True)  # Campo para almacenar el texto extraído por OCR
    uploaded_at = models.DateTimeField(auto_now_add=True)  # Campo para registrar la fecha de subida de la imagen

    def __str__(self):
        return f"Imagen subida el {self.uploaded_at}"
