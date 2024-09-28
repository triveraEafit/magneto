# formularios/urls.py
from django.urls import path
from .views import subir_hoja_de_vida, crear_hoja_de_vida, obtener_hoja_de_vida

urlpatterns = [
    path('subir-hoja-de-vida/', subir_hoja_de_vida, name='subir_hoja_de_vida'),
    path('crear-hoja-de-vida/', crear_hoja_de_vida, name='crear_hoja_de_vida'),
    path('formularios/hoja-de-vida/<int:id>/', obtener_hoja_de_vida, name='obtener_hoja_de_vida')
]
