// Evento para subir la hoja de vida en formato de archivo
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

// Botón para crear una nueva hoja de vida
document.getElementById('create-cv').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('crear_hoja_de_vida.html'), '_blank');
});

// Enlaces a sitios de empleo
document.getElementById('button1').addEventListener('click', function() {
    window.open('https://www.linkedin.com/onboarding/start/profile-edit/new/', '_blank');
});

document.getElementById('button2').addEventListener('click', function() {
    window.open('https://co.computrabajo.com/', '_blank');
});

document.getElementById('button3').addEventListener('click', function() {
    window.open('https://www.magneto365.com/es', '_blank');
});

// Evento para iniciar el reconocimiento de campos a partir de una captura de pantalla
document.getElementById('reconocimiento').addEventListener('click', async () => {
    await capturarPantallaYEnviar();
});

async function capturarPantallaYEnviar() {
    try {
        // Captura la pestaña actual como una imagen
        chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
            if (dataUrl) {
                // Convierte la imagen en blob para enviarla al servidor
                const response = await fetch(dataUrl);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append("imagen", blob, "captura.png");

                // Envía la imagen a la API para el reconocimiento OCR
                fetch("http://localhost:8000/api/procesar-imagen/", {
                    method: "POST",
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.camposDetectados) {
                        llenarCamposEnPagina(data.camposDetectados);
                    } else {
                        alert("No se detectaron campos en la imagen.");
                    }
                })
                .catch(error => {
                    console.error("Error al enviar la captura de pantalla:", error);
                    alert("Hubo un error al procesar la captura de pantalla.");
                });
            } else {
                alert("Error al capturar la pantalla.");
            }
        });
    } catch (error) {
        console.error("Error al capturar y enviar la pantalla:", error);
    }
}

// Función para rellenar los campos detectados en el formulario de la página
function llenarCamposEnPagina(camposDetectados) {
    for (const [nombreCampo, valorCampo] of Object.entries(camposDetectados)) {
        const campo = document.querySelector(`[name="${nombreCampo}"], [id="${nombreCampo}"]`);
        if (campo) {
            campo.value = valorCampo;
        }
    }
    alert("Formulario rellenado automáticamente con OCR.");
}

// Escucha el evento de pegar en el área de pegado
document.getElementById('image-paste-area').addEventListener('paste', async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();

            // Crear un FormData y añadir la imagen pegada
            const formData = new FormData();
            formData.append('imagen', file, 'imagen_pegada.png');

            // Enviar la imagen al servidor Django
            try {
                const response = await fetch('http://localhost:8000/api/subir-imagen-pegada/', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Imagen pegada subida correctamente');
                    console.log('Imagen almacenada:', data);
                } else {
                    alert('Error al subir la imagen pegada');
                }
            } catch (error) {
                console.error('Error al subir la imagen pegada:', error);
            }
        }
    }
});
