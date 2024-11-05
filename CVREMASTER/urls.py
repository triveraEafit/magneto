from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('formularios.urls')),  # Incluye las URLs de la aplicación 'formularios' en la raíz
]
