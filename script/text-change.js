const texts = [
  "Cetak brosur dengan kualitas premium.",
  "Desain kartu nama profesional.",
  "Banner dan spanduk untuk semua acara.",
  "Percetakan cepat dan hasil tajam.",
  "Solusi desain dan cetak dalam satu tempat."
];

const textElement = document.getElementById("changingText");
let textIndex = 0;
let charIndex = 0;

function typeText() {
  const currentText = texts[textIndex];
  textElement.textContent = currentText.slice(0, charIndex + 1);
  charIndex++;

  if (charIndex === currentText.length) {
    setTimeout(() => {
      charIndex = 0;
      textIndex = (textIndex + 1) % texts.length;
      typeText();
    }, 1500); // jeda sebelum ganti kalimat
  } else {
    setTimeout(typeText, 50); // kecepatan ketikan
  }
}

typeText();
