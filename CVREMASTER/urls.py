from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('formularios.urls')),
    path('api/', include('api.urls')), 
    path('image_transcription/', include('Image_Transcription.urls')),
    path('transcription/', views.transcription_view, name='transcription'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
