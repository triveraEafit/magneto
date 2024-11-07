# api/models.py
from django.db import models

class HojaDeVida(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    archivo_cv = models.FileField(upload_to='cv_files/', null=True, blank=True)
    imagen_cv = models.ImageField(upload_to='cv_images/', null=True, blank=True)  # Campo de imagen

    def __str__(self):
        return f'{self.nombre} - {self.email}'

class ImagenPegada(models.Model):
    imagen = models.ImageField(upload_to='imagenes_pegadas/')
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Imagen {self.id} subida el {self.fecha_subida}"