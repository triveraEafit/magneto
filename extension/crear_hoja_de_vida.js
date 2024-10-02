document.getElementById('load-data').addEventListener('click', function() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const experiencia = document.getElementById('experiencia').value;
    const educacion = document.getElementById('educacion').value;
    const habilidades = document.getElementById('habilidades').value;
    const resumen = document.getElementById('resumen').value;

    console.log("Datos a enviar:", {
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        experiencia,
        educacion,
        habilidades,
        resumen
    });

    if (nombre && apellido && email && telefono && direccion && experiencia && educacion && habilidades && resumen) {
        fetch('http://localhost:8000/formularios/crear-hoja-de-vida/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                experiencia,
                educacion,
                habilidades,
                resumen
            }),
        })
        .then(response => {
            console.log("Respuesta del servidor:", response);
            if (!response.ok) {
                throw new Error('Error en la respuesta: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            // Aquí puedes limpiar el formulario si deseas
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar los datos: ' + error.message);
        });
    } else {
        alert('Por favor, completa todos los campos.');
    }
});
