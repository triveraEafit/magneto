from django.db import models

class HojaDeVida(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField()
    telefono = models.CharField(max_length=15)
    direccion = models.TextField()
    experiencia = models.TextField()
    educacion = models.TextField()
    habilidades = models.TextField()
    resumen = models.TextField()
    cv_file = models.FileField(upload_to='hojas_de_vida/', null=True, blank=True)  # Nuevo campo

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
