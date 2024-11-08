chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { 
    if (request.action === "reconocerCampos") {
        // Identifica los campos de entrada en el formulario
        const campos = document.querySelectorAll('input, select, textarea');
        const camposVisibles = {};

        campos.forEach(campo => {
            const nombreCampo = campo.name || campo.id;  // Usa el "name" o "id" del campo como identificador
            if (nombreCampo) {
                // Solo añade campos que son visibles y editables
                const estiloCampo = window.getComputedStyle(campo);
                if (estiloCampo.display !== 'none' && estiloCampo.visibility !== 'hidden' && !campo.disabled) {
                    camposVisibles[nombreCampo] = campo;
                }
            }
        });

        // Envía los campos visibles de vuelta a popup.js
        chrome.runtime.sendMessage({ action: "camposDetectados", campos: camposVisibles });
    }
});
