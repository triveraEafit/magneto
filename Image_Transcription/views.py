# Image_Transcription/views.py
from django.shortcuts import render
from django.conf import settings
from .models import UploadedImage
from .forms import ImageUploadForm
import pytesseract
from PIL import Image
import os

# Configurar la ruta de Tesseract
pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

def image_transcription_view(request):
    ocr_result = ""
    last_image = None  # Variable para almacenar la última imagen subida

    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            # Guarda la imagen en la base de datos
            uploaded_image = form.save()
            
            # Abre la imagen desde el sistema de archivos y realiza OCR
            try:
                image = Image.open(uploaded_image.image.path)
                ocr_result = pytesseract.image_to_string(image)
                
                # Guarda el texto OCR en el campo `ocr_text` del modelo UploadedImage
                uploaded_image.ocr_text = ocr_result
                uploaded_image.save()
                last_image = uploaded_image  # Establece la última imagen subida
            except Exception as e:
                ocr_result = f"Error al procesar la imagen: {e}"
        else:
            ocr_result = "Formulario no válido. Por favor, intenta de nuevo."
    else:
        form = ImageUploadForm()
        
        # Carga la última imagen de la base de datos, si existe
        try:
            last_image = UploadedImage.objects.latest('uploaded_at')
            ocr_result = last_image.ocr_text  # Carga el texto OCR de la última imagen
        except UploadedImage.DoesNotExist:
            last_image = None

    # Renderiza el resultado en la plantilla
    return render(request, 'image_transcription/transcription.html', {
        'form': form,
        'ocr_result': ocr_result,
        'last_image': last_image  # Pasa la última imagen a la plantilla
    })
