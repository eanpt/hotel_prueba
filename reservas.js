document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario
    
    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const destino = document.getElementById('destino').value;
    const personas = document.getElementById('personas').value;

    // Crear un objeto con la información de la reserva
    const reserva = {
        nombre,
        email,
        telefono,
        fecha,
        destino,
        personas
    };

    // Guardar la reserva en localStorage
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Mostrar un mensaje de confirmación
    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'block';
    messageDiv.textContent = 'Reserva guardada con éxito!';
    messageDiv.style.color = 'green';

    // Limpiar el formulario
    this.reset();
});