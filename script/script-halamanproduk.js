const productForm = document.getElementById('product-form');
const quantityInput = document.getElementById('quantity');
const qtyBtns = document.querySelectorAll('.qty-btn');

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

// Fetch and load product data
async function getData() {
    try {
        const response = await fetch("data/data_produk.json");
        if (!response.ok) throw new Error('Failed to fetch product data');
        
        const data = await response.json();
        const productId = getProductIdFromUrl();
        const product = data.find(p => p.id === productId);
        
        if (product) {
            renderDataFromJson(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error loading product data:', error);
    }
}

// Update all product-related elements on the page
function renderDataFromJson(product) {
    document.getElementById('nama_produk').innerText = `${product.nama}`;
    document.title = `Jual ${product.nama} - Designplus`;
    
    document.getElementById('product-name').innerText = product.nama;
    
    const productImage = document.querySelector('.content-left img');
    if (productImage) {
        productImage.src = product.file;
        productImage.alt = product.nama;
    }

    const ratingElement = document.querySelector('.rating');
    if (ratingElement) {
        ratingElement.innerHTML = `<i class="fa-solid fa-star star"></i>${product.rating}<span id="total-rating">(${randomNum(1000, 10000)} Rating)</span>`;
    }

    const basePriceElements = document.querySelectorAll('.price');
    basePriceElements.forEach(el => {
        const priceText = el.textContent;
        if (priceText.includes('35.000')) {
            el.textContent = `Rp${product.harga.toLocaleString('id-ID')}`;
        }
    });

    updateTotal();
}

function randomNum(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    const randNumber = Math.random()*(max - min + 1) + min;
    return Math.floor(randNumber);
}

// Calculate and update total price
function updateTotal() {
    const quantity = parseInt(quantityInput.value) || 1;
    const basePriceEl = document.querySelector('.option-header .price');
    const basePrice = parseInt(basePriceEl.textContent.replace(/[^\d]/g, '')) || 0;
    
    const designType = document.querySelector('input[name="design"]:checked').value;
    const designCost = designType === 'Custom' ? 5000 : 0;
    
    const total = (basePrice + designCost) * quantity;
    
    const totalPriceEl = document.querySelector('.total-price');
    if (totalPriceEl) {
        totalPriceEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
    }
}

// Call getData when page loads
document.addEventListener('DOMContentLoaded', getData);



// Update form elements and recalculate total
productForm.addEventListener('change', function(e) {
    const material = document.querySelector('input[name="material"]:checked').value;
    const color = document.querySelector('input[name="color"]:checked').value;
    const design = document.querySelector('input[name="design"]:checked').value;
    const quantity = parseInt(quantityInput.value);

    document.getElementById('raw-material').innerText = material;
    document.getElementById('color').innerText = color;
    document.getElementById('design-option').innerText = design;
    document.getElementById('total').innerText = quantity;
    document.querySelector('.product-placeholder').innerText = material;
    
    const productName = document.getElementById('product-name').getAttribute('data-original-name') || 
                       document.getElementById('product-name').innerText;
    document.getElementById('product-name').setAttribute('data-original-name', productName);
    document.getElementById('product-name').innerText = `${productName} - ${color}`;

    updateTotal();
});

qtyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const isPlus = this.classList.contains('plus');
        const currentVal = parseInt(quantityInput.value) || 1;
        
        if (isPlus) {
            quantityInput.value = currentVal + 1;
        } else if (currentVal > 1) {
            quantityInput.value = currentVal - 1;
        }

        // Update quantity display and recalculate total
        document.getElementById('total').innerText = quantityInput.value;
        updateTotal();
    });
});

const menuLinks = document.querySelectorAll('.product-menu a');
const tabContents = document.querySelectorAll('.tab-content');

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    menuLinks.forEach(l => l.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));
    link.classList.add('active');
    const target = link.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');
  });
});

function productMenuContent(){

}

productForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const order = {
    id: Date.now(),
    productName: document.getElementById('product-name').textContent,
    material: formData.get('material'),
    color: formData.get('color'),
    design: formData.get('design'),
    quantity: parseInt(formData.get('quantity')),
    price: parseInt(document.querySelector('.option-header .price').textContent.replace(/[^\d]/g, '')),
    payment_method: 'bca',
    created_at: new Date().toISOString(),
    productImage: document.querySelector('.content-left img').src
  };

  // Save order to localStorage
  localStorage.setItem('current_order', JSON.stringify(order));
  window.location.href = 'paymentpage.html';
});

const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".slideshow-wrapper i");
const firstCardWidth = carousel.querySelector(".mp-card").offsetWidth;

let isDragging = false, startX, startScrollLeft;

arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    })
})

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = (e) => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

function changePhoto(element) {
  const mainImage = document.getElementById('mainImage');
  mainImage.src = element.src;

  const currentActive = document.querySelector('.mp-card.active');
  if (currentActive) {
    currentActive.classList.remove('active');
  }
  element.closest('.mp-card').classList.add('active');
}