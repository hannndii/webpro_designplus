document.addEventListener("DOMContentLoaded", () => {
  fetch('data/data_produk.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(productData => {
      renderProducts(productData); 
    })
    .catch(error => {
      console.error('Error memuat data produk:', error);
      const gridContainer = document.querySelector(".product-grid");
      if (gridContainer) {
        gridContainer.innerHTML = "<p>GAGAL MEMUAT DATA!</p>";
      }
    });
});

// = = = = = = = = = Fungsi untuk me-render semua kartu produk DAN menambahkan click listener = = = = = = = = =
function renderProducts(productData) {
  const gridContainer = document.querySelector(".product-grid");
  if (!gridContainer) return;

  const productCardsHTML = productData.map(product => {
    return `
      <div class="product-card" id="item-${product.id}" data-id="${product.id}">
        <img src="${product.file}" alt="${product.nama}" />
        <div class="card-info">
          <span class="product-category">${product.kategori}</span>
          <h3>${product.nama}</h3>
          <div class="rating">
            ${generateStars(product.rating)}
            <span class="review-count">(${product.rating})</span>
          </div>
          <p class="product-price">${formatPrice(product.harga)}</p>
        </div>
      </div>
    `;
  }).join('');

  gridContainer.innerHTML = productCardsHTML;

// = = = = = = = = = Tambahkan event click ke setiap card = = = = = = = = = 
  const productCards = gridContainer.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id; 
      localStorage.setItem("selectedProductId", id);
      window.location.href = `halamanproduk.html?id=${id}`;
    });
  });
}

// = = = = = = = = = Fungsi untuk generate bintang rating dan format harga = = = = = = = = =
function generateStars(rating) {
  let starsHTML = '';
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fa-solid fa-star"></i>';
  if (halfStar) starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="fa-regular fa-star"></i>';
  
  return starsHTML;
}

// = = = = = = = = = Fungsi untuk format harga ke dalam Rupiah = = = = = = = = =
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}
