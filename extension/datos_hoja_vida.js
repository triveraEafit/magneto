// datos_hoja_vida.js
 document.addEventListener('DOMContentLoaded', function() { 
    fetch('http://localhost:8000/formularios/obtener-primera-hoja-de-vida/')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('datos-container');
            if (data.error) {
                container.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            const fields = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'experiencia', 'educacion', 'habilidades', 'resumen'];
            fields.forEach(field => {
                const value = data[field] || '';
                const fieldElement = document.createElement('div');
                fieldElement.classList.add('field');
                fieldElement.innerHTML = `
                    <p><strong>${field.charAt(0).toUpperCase() + field.slice(1)}:</strong> ${value}</p>
                    <button onclick="navigator.clipboard.writeText('${value}')">Copiar</button>
                `;
                container.appendChild(fieldElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p>Hubo un problema al cargar los datos del usuario.</p>';
        });
});

document.getElementById('fill-form').addEventListener('click', function() {
    // ID del usuario
    const userId = 1;

    // Realizar la solicitud para obtener los datos de la base de datos
    fetch(`http://localhost:8000/obtener-hoja-de-vida/${userId}/`)
        .then(response => response.json())
        .then(data => {
            // Verifica si se obtuvieron los datos correctamente
            if (data.error) {
                alert('Error al obtener los datos: ' + data.error);
            } else {
                // Llame a la función que muestra los datos en la ventana emergente
                mostrarDatosEnVentanaEmergente(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener los datos.');
        });
});

// Función para mostrar los datos en la ventana emergente
function mostrarDatosEnVentanaEmergente(data) {
    // Crea el contenido de la ventana emergente
    const ventanaEmergente = window.open('', '_blank', 'width=400,height=600');
    
    // El contenido HTML que se va a mostrar en la ventana emergente
    const contenido = `
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Datos del Usuario</title>
        </head>
        <body>
            <h2>Datos del Usuario</h2>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Apellido:</strong> ${data.apellido}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Teléfono:</strong> ${data.telefono}</p>
            <p><strong>Dirección:</strong> ${data.direccion}</p>
            <p><strong>Experiencia:</strong> ${data.experiencia}</p>
            <p><strong>Educación:</strong> ${data.educacion}</p>
            <p><strong>Habilidades:</strong> ${data.habilidades}</p>
            <p><strong>Resumen:</strong> ${data.resumen}</p>
            <button onclick="copyToClipboard()">Copiar</button>
        </body>
        </html>
    `;

    // Escribe el contenido en la ventana emergente
    ventanaEmergente.document.write(contenido);
    
    // Función para copiar al portapapeles
    function copyToClipboard() {
        const textToCopy = `
            Nombre: ${data.nombre}
            Apellido: ${data.apellido}
            Email: ${data.email}
            Teléfono: ${data.telefono}
            Dirección: ${data.direccion}
            Experiencia: ${data.experiencia}
            Educación: ${data.educacion}
            Habilidades: ${data.habilidades}
            Resumen: ${data.resumen}
        `;

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Datos copiados al portapapeles.');
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }
}
