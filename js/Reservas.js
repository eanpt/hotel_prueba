
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const tableBody = document.getElementById("reservationTableBody");

    tableBody.innerHTML = ""; // Limpiar contenido previo

    reservations.forEach(reservation => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = reservation.guestName;
        row.appendChild(nameCell);

        const roomCell = document.createElement("td");
        roomCell.textContent = reservation.roomNumber;
        row.appendChild(roomCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = reservation.reservationDate;
        row.appendChild(dateCell);

        const countryCell = document.createElement("td");
        countryCell.textContent = reservation.country;
        row.appendChild(countryCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = reservation.city;
        row.appendChild(statusCell);

        // Crear la celda para el botón de eliminación
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteReservation(reservation.id);
        deleteButton.classList.add("delete-button"); // Agregar clase para estilo
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

// Función para eliminar una reserva
function deleteReservation(id) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations = reservations.filter(reservation => reservation.id !== id);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    loadReservations(); // Recargar la tabla después de eliminar la reserva
}

// Mostrar reservas al cargar la página
window.onload = loadReservations;