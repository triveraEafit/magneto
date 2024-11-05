from django.urls import path
from .views import subir_hoja_de_vida, crear_hoja_de_vida, obtener_hoja_de_vida

urlpatterns = [
    path('hoja_de_vida/subir/', subir_hoja_de_vida, name='subir_hoja_de_vida'),  # Ruta para subir archivo de hoja de vida
    path('hoja_de_vida/crear/', crear_hoja_de_vida, name='crear_hoja_de_vida'),  # Ruta para crear hoja de vida con JSON
    path('hoja_de_vida/<int:id>/', obtener_hoja_de_vida, name='obtener_hoja_de_vida')  # Ruta para obtener hoja de vida por ID
]
