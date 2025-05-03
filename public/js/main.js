// Slideshow Functionality for Hero and Why CSR Matters
const heroSlides = document.querySelectorAll('.hero-slideshow .slide');
const csrSlides = document.querySelectorAll('.why-csr-slideshow .slide');
let currentHeroSlide = 0;
let currentCsrSlide = 0;

function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function showCsrSlide(index) {
    csrSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    showHeroSlide(currentHeroSlide);
}

function nextCsrSlide() {
    currentCsrSlide = (currentCsrSlide + 1) % csrSlides.length;
    showCsrSlide(currentCsrSlide);
}

setInterval(nextHeroSlide, 3000); // Change hero slide every 3 seconds
setInterval(nextCsrSlide, 3000); // Change CSR slide every 3 seconds

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
});

// Additional Slideshow for "Why CSR" and "Trusted Partners"
const partnerSlides = document.querySelectorAll('.partner-carousel .item');
let currentPartnerSlide = 0;

function showPartnerSlide(index) {
    partnerSlides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
    });
}

function nextPartnerSlide() {
    currentPartnerSlide = (currentPartnerSlide + 1) % partnerSlides.length;
    showPartnerSlide(currentPartnerSlide);
}

setInterval(nextPartnerSlide, 5000); // Change slide every 5 seconds for partners

// Partners Carousel Functionality
// Partners Carousel Functionality
const partnerItems = document.querySelectorAll('.partner-item');
const partnersContainer = document.querySelector('.partners');
let currentPartnerIndex = 0;

function updatePartnerCarousel() {
    const offset = -currentPartnerIndex * (150 + 20); // 150 is min-width + 20 is margin
    partnersContainer.style.transform = `translateX(${offset}px)`;
}

document.getElementById('nextPartner').addEventListener('click', () => {
    currentPartnerIndex = (currentPartnerIndex + 1) % partnerItems.length;
    updatePartnerCarousel();
});

document.getElementById('prevPartner').addEventListener('click', () => {
    currentPartnerIndex = (currentPartnerIndex - 1 + partnerItems.length) % partnerItems.length;
    updatePartnerCarousel();
});

// Auto-loop functionality
setInterval(() => {
    currentPartnerIndex = (currentPartnerIndex + 1) % partnerItems.length;
    updatePartnerCarousel();
}, 3000); // Change every 3 seconds