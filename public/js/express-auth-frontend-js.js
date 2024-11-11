// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Manejo del formulario de login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: formData.get('correo'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.href = data.redirect;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar iniciar sesión');
        }
    });

    // Manejo del formulario de registro
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/auth/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre_completo: formData.get('nombre_completo'),
                    correo: formData.get('correo'),
                    cedula: formData.get('cedula'),
                    password: formData.get('password')
                })
            });

            const data = await response.json();
            alert(data.message);
            
            if (data.success) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar registrar usuario');
        }
    });

    // Botones de cambio entre login y registro (mantén tu lógica original aquí)
    const btnLogin = document.getElementById('btn_login');
    const btnRegister = document.getElementById('btn_register');
    // ... resto de tu código de UI para alternar entre formularios
});
