# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from .models import HojaDeVida, ImagenPegada
from .serializers import ImagenPegadaSerializer
import pytesseract
from PIL import Image
import io
import re

# Configuración de la ruta de pytesseract
pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD


class SubirHojaDeVidaAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        nombre = request.data.get('nombre')
        email = request.data.get('email')
        archivo_cv = request.FILES.get('cv_file')
        imagen_adicional = request.FILES.get('imagen_adicional')  # Obtener la imagen adicional

        # Crear instancia del modelo y guardar
        hoja_de_vida = HojaDeVida(
            nombre=nombre,
            email=email,
            archivo_cv=archivo_cv,
            imagen_adicional=imagen_adicional
        )
        hoja_de_vida.save()

        # Realizar OCR si se sube una imagen adicional
        campos_detectados = {}
        if imagen_adicional:
            try:
                image = Image.open(imagen_adicional)
                texto_extraido = pytesseract.image_to_string(image)
                campos_detectados = self.procesar_texto(texto_extraido)
            except Exception as e:
                return Response({"error": "Error al procesar la imagen para OCR: " + str(e)}, status=500)

        # Generar URL de la imagen si está presente
        imagen_url = hoja_de_vida.imagen_adicional.url if hoja_de_vida.imagen_adicional else None

        return Response({
            "mensaje": "Datos subidos correctamente.",
            "camposDetectados": campos_detectados,
            "imagen_url": imagen_url
        }, status=201)

    def procesar_texto(self, texto):
        # Mapeo de campos para reconocer los datos clave en la hoja de vida
        campos_detectados = {}
        lineas = texto.splitlines()

        for linea in lineas:
            # Usamos expresiones regulares para detectar patrones comunes de nombres, correos, y teléfonos
            if re.search(r'\bNombre\b', linea, re.IGNORECASE):
                campos_detectados["nombre"] = self.extraer_valor(linea)
            elif re.search(r'\bEmail\b|\bCorreo\b', linea, re.IGNORECASE):
                campos_detectados["email"] = self.extraer_valor(linea)
            elif re.search(r'\bTeléfono\b|\bCelular\b', linea, re.IGNORECASE):
                campos_detectados["telefono"] = self.extraer_valor(linea)
            elif re.search(r'\bDirección\b', linea, re.IGNORECASE):
                campos_detectados["direccion"] = self.extraer_valor(linea)
            elif re.search(r'\bExperiencia\b|\bTrabajos\b', linea, re.IGNORECASE):
                campos_detectados["experiencia"] = self.extraer_valor(linea)
            elif re.search(r'\bEducación\b|\bFormación\b', linea, re.IGNORECASE):
                campos_detectados["educacion"] = self.extraer_valor(linea)
            # Agrega más campos según sea necesario

        return campos_detectados

    def extraer_valor(self, linea):
        # Extrae el valor después de los dos puntos, o devuelve la línea si no hay dos puntos
        return linea.split(":")[1].strip() if ":" in linea else linea.strip()


class ProcesarImagenAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        # Obtener la imagen desde la solicitud
        imagen = request.FILES.get('imagen')
        if not imagen:
            return Response({"error": "No se recibió ninguna imagen"}, status=400)

        try:
            # Convierte la imagen para el OCR
            image = Image.open(imagen)
            texto_extraido = pytesseract.image_to_string(image)

            # Procesa el texto extraído para identificar los posibles campos de la hoja de vida
            campos_detectados = self.procesar_texto(texto_extraido)
            return Response({"camposDetectados": campos_detectados})

        except Exception as e:
            # Devuelve un error si hay problemas al procesar la imagen
            return Response({"error": str(e)}, status=500)

    def procesar_texto(self, texto):
        # Mapeo de campos para reconocer los datos clave en la hoja de vida
        campos_detectados = {}
        lineas = texto.splitlines()

        for linea in lineas:
            # Usamos expresiones regulares para detectar patrones comunes de nombres, correos, y teléfonos
            if re.search(r'\bNombre\b', linea, re.IGNORECASE):
                campos_detectados["nombre"] = self.extraer_valor(linea)
            elif re.search(r'\bEmail\b|\bCorreo\b', linea, re.IGNORECASE):
                campos_detectados["email"] = self.extraer_valor(linea)
            elif re.search(r'\bTeléfono\b|\bCelular\b', linea, re.IGNORECASE):
                campos_detectados["telefono"] = self.extraer_valor(linea)
            elif re.search(r'\bDirección\b', linea, re.IGNORECASE):
                campos_detectados["direccion"] = self.extraer_valor(linea)
            elif re.search(r'\bExperiencia\b|\bTrabajos\b', linea, re.IGNORECASE):
                campos_detectados["experiencia"] = self.extraer_valor(linea)
            elif re.search(r'\bEducación\b|\bFormación\b', linea, re.IGNORECASE):
                campos_detectados["educacion"] = self.extraer_valor(linea)
            # Agrega más campos según sea necesario

        return campos_detectados

    def extraer_valor(self, linea):
        # Extrae el valor después de los dos puntos, o devuelve la línea si no hay dos puntos
        return linea.split(":")[1].strip() if ":" in linea else linea.strip()


class SubirImagenPegadaAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        imagen = request.FILES.get('imagen')
        if not imagen:
            return Response({"error": "No se recibió ninguna imagen"}, status=400)

        # Crear una instancia del modelo con la imagen
        imagen_pegada = ImagenPegada.objects.create(imagen=imagen)

        # Serializar la respuesta para devolver la información de la imagen guardada
        serializer = ImagenPegadaSerializer(imagen_pegada, context={"request": request})
        return Response(serializer.data, status=201)
