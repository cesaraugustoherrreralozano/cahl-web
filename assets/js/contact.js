document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formResponse = document.getElementById('form-response');

    // variable API_URL (déjala como un string vacío "" con un comentario para poner nuestra URL de producción)
    const API_URL = ""; // TODO: Reemplazar con la URL de producción de la API en Python (FastAPI/Flask)

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Cambia el texto del botón a "Enviando..." y deshabilítalo.
        submitBtn.disabled = true;
        btnText.textContent = "Enviando...";
        btnLoader.classList.remove('hidden');

        // 2. Construye un objeto JSON con los datos.
        const formData = new FormData(contactForm);
        const data = {
            nombre: formData.get('nombre'),
            correo: formData.get('correo'),
            empresa: formData.get('empresa'),
            cargo: formData.get('cargo'),
            reto: formData.get('reto'),
            timestamp: new Date().toISOString()
        };

        try {
            // 3. Usa la API fetch para enviar un método POST
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Estándar para APIs en Python
                },
                body: JSON.stringify(data)
            });

            // 4. Maneja la respuesta
            if (response.ok) {
                showFeedback(true, "¡Solicitud enviada con éxito! Nuestro escuadrón te contactará pronto.");
                contactForm.reset();
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Mock success for demonstration if API_URL is empty
            if (API_URL === "") {
                console.warn("API_URL está vacía. Simulando éxito para propósitos de visualización.");
                setTimeout(() => {
                    showFeedback(true, "¡Solicitud enviada (Simulación)! Nuestro escuadrón te contactará pronto.");
                    contactForm.reset();
                    restoreButton();
                }, 1500);
                return;
            }
            showFeedback(false, "Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo o escríbenos directamente.");
        } finally {
            if (API_URL !== "") {
                restoreButton();
            }
        }
    });

    function restoreButton() {
        submitBtn.disabled = false;
        btnText.textContent = "Enviar Solicitud";
        btnLoader.classList.add('hidden');
    }

    function showFeedback(isSuccess, message) {
        formResponse.classList.remove('hidden', 'text-green-400', 'text-red-400');
        formResponse.classList.add(isSuccess ? 'text-green-400' : 'text-red-400');
        formResponse.textContent = message;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            formResponse.classList.add('hidden');
        }, 5000);
    }
});
