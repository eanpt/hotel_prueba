// Función para hacer una reserva
function makeReservation() {
    const guestName = document.getElementById("guestName").value;
    const country = document.getElementById("country").value; // Obtener el país seleccionado
    const city = document.getElementById("city").value; // Obtener la ciudad seleccionada
    const roomNumber = document.getElementById("roomNumber").value;
    const reservationDate = document.getElementById("reservationDate").value;

    if (guestName === "" || country === "" || city === "" || roomNumber === "" || reservationDate === "") {
        alert("Por favor completa todos los campos.");
        return;
    }

    const reservation = {
        id: Date.now(),
        guestName,
        country,
        city,
        roomNumber,
        reservationDate,
    };

    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const isAlreadyReserved = reservations.some(reservation => 
        reservation.roomNumber === roomNumber && reservation.reservationDate === reservationDate
    );

    if (isAlreadyReserved) {
        alert("La habitación ya está reservada para esta fecha. Por favor, elige otra.");
        return;
    }

    reservations.push(reservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    alert("Tu reserva fue realizada con éxito gracias por preferirnos.");
    document.getElementById("guestName").value = "";
    document.getElementById("country").value = ""; // Limpiar el país
    document.getElementById("city").innerHTML = ""; // Limpiar las ciudades
    document.getElementById("city").disabled = true; // Deshabilitar el select de ciudades
    document.getElementById("roomNumber").value = "";
    document.getElementById("reservationDate").value = "";

    displayReservations();
}
function updateCities() {
    const countrySelect = document.getElementById("country");
    const citySelect = document.getElementById("city");
    citySelect.innerHTML = ""; // Limpiar las ciudades
    citySelect.disabled = true; // Deshabilitar el select de ciudades inicialmente

    const selectedCountry = countrySelect.value;

    let cities = [];
    if (selectedCountry === "colombia") {
        cities = ["bogota ,hotel cascadas", "medellin,hotel el poblado", "cartagena,hotel arena blanca"];
    } else if (selectedCountry === "peru") {
        cities = ["lima,hotel cusco"];
    }

    // Agregar las ciudades al select
    if (cities.length > 0) {
        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city.charAt(0).toUpperCase() + city.slice(1); // Capitaliza la primera letra
            citySelect.appendChild(option);
        });
        citySelect.disabled = false; // Habilitar el select de ciudades
    }
}

// Función para mostrar todas las reservas
function displayReservations() {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    const reservationsList = document.getElementById("reservations");

    reservationsList.innerHTML = "";
    reservations.forEach(reservation => {
        const li = document.createElement("li");
        li.innerHTML = `Nombre: ${reservation.guestName}, País: ${reservation.country}, Ciudad: ${reservation.city}, Habitación: ${reservation.roomNumber}, Fecha: ${reservation.reservationDate} 
        <button onclick="cancelReservation(${reservation.id})">Cancelar</button>`;
        reservationsList.appendChild(li);
    });
}

// Función para cancelar una reserva
function cancelReservation(id) {
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations = reservations.filter(reservation => reservation.id !== id);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    displayReservations();
}

// Mostrar reservas al cargar la página
window.onload = displayReservations;