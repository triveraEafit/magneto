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

// Funcionalidad para iniciar el reconocimiento de campos en pantalla
document.getElementById('reconocimiento').addEventListener('click', async () => {
    // Llamar a la función para iniciar el reconocimiento de formularios
    await iniciarReconocimiento();
});

async function iniciarReconocimiento() {
    try {
        // Envía un mensaje al contenido de la página para iniciar el reconocimiento de campos
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "reconocerCampos" });
        });
    } catch (error) {
        console.error("Error al iniciar el reconocimiento:", error);
    }
}

// Escuchar los campos detectados desde content.js y completar los datos
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "camposDetectados") {
        const campos = request.campos;

        // Solicita los datos de la hoja de vida desde Django
        try {
            const response = await fetch('http://localhost:8000/api/hoja-de-vida/1/');  // Cambia '1' por el ID adecuado de la hoja de vida
            const data = await response.json();

            // Rellena los campos en la página si hay coincidencias
            for (const nombreCampo in campos) {
                if (data[nombreCampo]) {
                    campos[nombreCampo].value = data[nombreCampo];
                }
            }

            alert('Formulario rellenado automáticamente.');
        } catch (error) {
            console.error('Error al obtener los datos de la hoja de vida:', error);
            alert('Hubo un error al obtener los datos de la hoja de vida.');
        }
    }
});
