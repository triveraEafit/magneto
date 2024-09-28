# formularios/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import HojaDeVida
import json

@csrf_exempt
def subir_hoja_de_vida(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        email = request.POST.get('email')
        cv_file = request.FILES.get('cv_file')

        hoja_de_vida = HojaDeVida(nombre=nombre, email=email, cv_file=cv_file)
        hoja_de_vida.save()

        return JsonResponse({'message': 'Hoja de vida subida correctamente.'})

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

from django.http import JsonResponse
import json

@csrf_exempt
def crear_hoja_de_vida(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            nombre = data.get('nombre')
            apellido = data.get('apellido')
            email = data.get('email')
            telefono = data.get('telefono')
            direccion = data.get('direccion')
            experiencia = data.get('experiencia')
            educacion = data.get('educacion')
            habilidades = data.get('habilidades')
            resumen = data.get('resumen')

            if all([nombre, apellido, email, telefono, direccion, experiencia, educacion, habilidades, resumen]):
                hoja_de_vida = HojaDeVida(
                    nombre=nombre,
                    apellido=apellido,
                    email=email,
                    telefono=telefono,
                    direccion=direccion,
                    experiencia=experiencia,
                    educacion=educacion,
                    habilidades=habilidades,
                    resumen=resumen,
                )
                hoja_de_vida.save()
                return JsonResponse({'message': 'Hoja de vida creada correctamente.'}, status=201)
            else:
                return JsonResponse({'error': 'Por favor, completa todos los campos.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error al procesar los datos JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': 'Error interno del servidor: ' + str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)


def obtener_hoja_de_vida(request, id):
    try:
        hoja_de_vida = HojaDeVida.objects.get(id=id)
        data = {
            'nombre': hoja_de_vida.nombre,
            'apellido': hoja_de_vida.apellido,
            'email': hoja_de_vida.email,
            'telefono': hoja_de_vida.telefono,
            'direccion': hoja_de_vida.direccion,
            'experiencia': hoja_de_vida.experiencia,
            'educacion': hoja_de_vida.educacion,
            'habilidades': hoja_de_vida.habilidades,
            'resumen': hoja_de_vida.resumen,
        }
        return JsonResponse(data)
    except HojaDeVida.DoesNotExist:
        return JsonResponse({'error': 'Hoja de vida no encontrada.'}, status=404)
