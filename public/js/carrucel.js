let angle = 0; // Ángulo inicial de rotación
const carousel = document.querySelector('.carousel');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

// Rotar hacia la derecha al hacer clic en el botón "next"
nextButton.addEventListener('click', () => {
    angle -= 120; // Resta 120 grados para rotar hacia la derecha
    carousel.style.transform = `rotateY(${angle}deg)`;
});

// Rotar hacia la izquierda al hacer clic en el botón "prev"
prevButton.addEventListener('click', () => {
    angle += 120; // Suma 120 grados para rotar hacia la izquierda
    carousel.style.transform = `rotateY(${angle}deg)`;
});

