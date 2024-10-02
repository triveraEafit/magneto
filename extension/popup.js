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
