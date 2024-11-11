let currentIndex = 0;
const slides = document.querySelectorAll('.slides img');
const totalSlides = slides.length;

document.getElementById('next').addEventListener('click', () => {
    changeSlide(1);
});

document.getElementById('prev').addEventListener('click', () => {
    changeSlide(-1);
});

function changeSlide(direction) {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    slides[currentIndex].classList.add('active');
}

// Mostrar la primera imagen al cargar la página
slides[currentIndex].classList.add('active');
