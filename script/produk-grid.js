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


// ========== HELPER WISHLIST ==========
function getWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlistData"));
  if (!wishlist) {
    wishlist = []; 
  }
  return wishlist;
}

function saveWishlist(wishlistArray) {
  localStorage.setItem("wishlistData", JSON.stringify(wishlistArray));
}


// ========== RENDER PRODUK DAN EVENT ==========
function renderProducts(productData) {
  const gridContainer = document.querySelector(".product-grid");
  if (!gridContainer) return;

  const currentWishlistIds = getWishlist();

  const productCardsHTML = productData.map(product => {
    const isWished = currentWishlistIds.includes(product.id);
    const heartIconClass = isWished ? 'fa-solid' : 'fa-regular';

    return `
      <div class="product-card" id="item-${product.id}" data-id="${product.id}">
        <div class="wishlist-toggle" data-id="${product.id}">
          <i class="${heartIconClass} fa-heart"></i>
        </div>
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

  // ========== EVENT NAVIGASI PRODUK ==========
  const productCards = gridContainer.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id; 
      localStorage.setItem("selectedProductId", id);
      window.location.href = `halamanproduk.html?id=${id}`;
    });
  });

  // ========== EVENT WISHLIST ==========
  const wishlistToggles = gridContainer.querySelectorAll(".wishlist-toggle");
  wishlistToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = parseInt(toggle.dataset.id);
      const icon = toggle.querySelector("i");
      let currentWishlist = getWishlist();

      if (currentWishlist.includes(id)) {
        currentWishlist = currentWishlist.filter(itemId => itemId !== id);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      } else {
        currentWishlist.push(id);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
      
      saveWishlist(currentWishlist);
    });
  });
}


// ========== GENERATE RATING ==========
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


// ========== FORMAT HARGA ==========
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}
