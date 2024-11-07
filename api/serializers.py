# api/serializers.py
from rest_framework import serializers
from formularios.models import HojaDeVida  # Asegúrate de que este es el nombre correcto de tu modelo
from .models import ImagenPegada


class HojaDeVidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HojaDeVida
        fields = '__all__'  # O especifica los campos que quieres incluir, p. ej., ['nombre', 'email', 'telefono']

class ImagenPegadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPegada
        fields = ['id', 'imagen', 'fecha_subida']