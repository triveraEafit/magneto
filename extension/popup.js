document.getElementById('upload-cv').addEventListener('click', function() {
    const fileInput = document.getElementById('cv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona un archivo.');
        return;
    }

    const formData = new FormData();
    formData.append('cv_file', file);
    formData.append('nombre', 'Nombre del usuario');
    formData.append('email', 'email@example.com');

    fetch('http://localhost:8000/subir-hoja-de-vida/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Hoja de vida subida correctamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al subir la hoja de vida.');
    });
});

document.getElementById('fill-form').addEventListener('click', function() {
    alert('Funcionalidad de rellenar formulario aún no implementada.');
});

document.getElementById('create-cv').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('crear_hoja_de_vida.html'), '_blank');
});

// Lógica para los botones de enlace
document.getElementById('button1').addEventListener('click', function() {
    window.open('https://www.linkedin.com/onboarding/start/profile-edit/new/', '_blank'); // Cambia a tu enlace
});

document.getElementById('button2').addEventListener('click', function() {
    window.open('https://co.computrabajo.com/', '_blank'); // Cambia a tu enlace
});

document.getElementById('button3').addEventListener('click', function() {
    window.open('https://www.magneto365.com/es', '_blank'); // Cambia a tu enlace
});


document.getElementById('fill-form').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('datos_hoja_vida.html'), '_blank', 'width=400,height=600');
});


document.addEventListener('DOMContentLoaded', function() {
    // Llamamos a la función para obtener los datos de la hoja de vida
    obtenerDatosHojaVida();

    // Evento para copiar los datos al portapapeles
    document.getElementById('copy-data').addEventListener('click', function() {
        const datosContainer = document.getElementById('datos');
        const dataText = datosContainer.innerText;

        if (dataText) {
            navigator.clipboard.writeText(dataText).then(() => {
                alert('Datos copiados al portapapeles.');
            }).catch(err => {
                alert('No se pudo copiar al portapapeles.');
            });
        } else {
            alert('No hay datos para copiar.');
        }
    });
});

// Función para obtener los datos de la hoja de vida
function obtenerDatosHojaVida() {
    fetch('http://localhost:8000/obtener-hoja-de-vida/')  // Cambia esta URL si es necesario
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            mostrarDatos(data);  // Función que muestra los datos en la ventana emergente
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener los datos.');
        });
}

// Función que muestra los datos en el DOM de la ventana emergente
function mostrarDatos(data) {
    const datosContainer = document.getElementById('datos');
    datosContainer.innerHTML = `
        <div class="dato">
            <label>Nombre:</label>
            <p>${data.nombre || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Apellido:</label>
            <p>${data.apellido || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Email:</label>
            <p>${data.email || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Teléfono:</label>
            <p>${data.telefono || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Dirección:</label>
            <p>${data.direccion || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Experiencia:</label>
            <p>${data.experiencia || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Educación:</label>
            <p>${data.educacion || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Habilidades:</label>
            <p>${data.habilidades || 'No disponible'}</p>
        </div>
        <div class="dato">
            <label>Resumen:</label>
            <p>${data.resumen || 'No disponible'}</p>
        </div>
    `;
}
