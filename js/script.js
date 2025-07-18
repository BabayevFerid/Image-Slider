const fileInput = document.getElementById('fileInput');
const slidesContainer = document.querySelector('.slides');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
const resetBtn = document.getElementById('resetBtn');

const slider = document.getElementById('slider');

// Kontroller
const autoPlayCheckbox = document.getElementById('autoPlay');
const intervalInput = document.getElementById('intervalInput');
const dotsToggleCheckbox = document.getElementById('dotsToggle');
const navToggleCheckbox = document.getElementById('navToggle');
const speedInput = document.getElementById('speedInput');
const widthInput = document.getElementById('widthInput');

let currentIndex = 0;
let slideInterval;
let intervalTime = parseInt(intervalInput.value) * 1000;
let animationSpeed = parseInt(speedInput.value);

let images = [];

// Slayderi yeniləyir
function updateSlider() {
  if(images.length === 0){
    slidesContainer.innerHTML = `<p style="padding:20px; width:100%; text-align:center;">Şəkil yükləyin...</p>`;
    dotsContainer.innerHTML = '';
    return;
  }

  slidesContainer.style.transitionDuration = animationSpeed + 'ms';
  slidesContainer.style.transform = `translateX(${-currentIndex * 100}%)`;

  // Dots yeniləmə
  dotsContainer.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if(i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateSlider();
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  // Dots görünürlüğü
  dotsContainer.style.opacity = dotsToggleCheckbox.checked ? '1' : '0';

  // Nav düymələri görünürlüğü
  prevBtn.style.opacity = navToggleCheckbox.checked ? '1' : '0';
  nextBtn.style.opacity = navToggleCheckbox.checked ? '1' : '0';

  // Slider genişliyi
  slider.style.width = widthInput.value + 'px';
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % images.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateSlider();
}

function resetInterval() {
  if(slideInterval) clearInterval(slideInterval);
  if(autoPlayCheckbox.checked) {
    slideInterval = setInterval(nextSlide, intervalTime);
  }
}

// Şəkilləri yüklə və sliderə əlavə et
fileInput.addEventListener('change', e => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if(!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = event => {
      images.push(event.target.result);
      renderSlides();
    };
    reader.readAsDataURL(file);
  });
  fileInput.value = ''; // eyni şəkli yenidən yükləmək üçün sıfırla
});

// Slayder slaydlarını yarad
function renderSlides() {
  slidesContainer.innerHTML = '';
  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
    slide.innerHTML = `<img src="${src}" alt="İstifadəçi şəkli ${i+1}" />`;
    slidesContainer.appendChild(slide);
  });
  currentIndex = 0;
  updateSlider();
  resetInterval();
});

// Reset düyməsi
resetBtn.addEventListener('click', () => {
  images = [];
  currentIndex = 0;
  slidesContainer.innerHTML = '';
  dotsContainer.innerHTML = '';
  resetInterval();
  updateSlider();
});

// Nav düymələri
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetInterval();
});
prevBtn.addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

// Kontrollerə eventlar
autoPlayCheckbox.addEventListener('change', () => {
  resetInterval();
});
intervalInput.addEventListener('input', () => {
  let val = parseInt(intervalInput.value);
  if(val < 1) val = 1;
  else if(val > 20) val = 20;
  intervalInput.value = val;
  intervalTime = val * 1000;
  resetInterval();
});
speedInput.addEventListener('input', () => {
  let val = parseInt(speedInput.value);
  if(val < 100) val = 100;
  else if(val > 3000) val = 3000;
  speedInput.value = val;
  animationSpeed = val;
  updateSlider();
});
dotsToggleCheckbox.addEventListener('change', updateSlider);
navToggleCheckbox.addEventListener('change', updateSlider);
widthInput.addEventListener('input', () => {
  let val = parseInt(widthInput.value);
  if(val < 300) val = 300;
  else if(val > 1200) val = 1200;
  widthInput.value = val;
  updateSlider();
});

// İlk çağırış
updateSlider();
resetInterval();
