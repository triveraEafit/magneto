from django.urls import path
from .views import ProcesarImagenAPIView  # Importa la clase ProcesarImagenAPIView
from .views import SubirImagenPegadaAPIView


urlpatterns = [
    path('procesar-imagen/', ProcesarImagenAPIView.as_view(), name='procesar_imagen'),
    path('subir-imagen-pegada/', SubirImagenPegadaAPIView.as_view(), name='subir-imagen-pegada'),
]

