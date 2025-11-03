document.addEventListener("DOMContentLoaded", () => {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userDisplay = document.getElementById("userNameDisplay");
    const userMenu = document.getElementById("userMenu");

    // ========== NAVBAR USER ==========
    if (userDisplay && userMenu) {
        if (currentUser) {
            userDisplay.textContent = currentUser.name;
            userDisplay.style.fontWeight = "600";
            userDisplay.style.color = "#007bff";
            userDisplay.style.marginLeft = "5px";

            userMenu.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "profile.html";
            });
        } else {
            userDisplay.textContent = "Tamu";
            userDisplay.style.opacity = "0.7";
            userDisplay.style.marginLeft = "5px";

            userMenu.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "login.html";
            });
        }
    }

    // ========== BAGIAN PROFIL ==========
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const logoutBtn = document.getElementById("logoutBtn");

    if ((profileName || profileEmail || logoutBtn) && !currentUser) {
        alert("Silakan login dulu buat liat profil.");
        window.location.href = "login.html";
        return;
    }

    if (currentUser && profileName) profileName.textContent = currentUser.name || "Pengguna";
    if (currentUser && profileEmail) profileEmail.value = currentUser.email || "";

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Yakin mau logout?");
            if (confirmLogout) {
                localStorage.removeItem("currentUser");
                alert("Kamu sudah logout.");
                window.location.href = "home.html";
            }
        });
    }

    // ========== UPDATE DATA USER ==========
    const saveButton = document.querySelector(".save-btn");
    if (saveButton) {
        loadUserData();
        saveButton.addEventListener("click", (e) => {
            e.preventDefault();
            saveUserData();
        });
    }

    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem("userData")) || {};

        document.querySelector("#input-name").value = userData.name || "";
        document.querySelector("#input-full-name").value = userData.fullName || "";
        document.querySelector("#profileEmail").value = userData.email || "";
        document.querySelector("#input-phone").value = userData.phone || "";
        document.querySelector("#input-location").value = userData.location || "";
        document.querySelector("#input-postal").value = userData.postalCode || "";

        if (userData.name && document.querySelector("#profileName")) {
            document.querySelector("#profileName").textContent = userData.name;
        }
        if (userData.location && document.querySelector(".profile-user-info p")) {
            document.querySelector(".profile-user-info p").textContent = userData.location;
        }

        if (userDisplay && userData.name) {
            userDisplay.textContent = userData.name;
        }
    }

    function saveUserData() {
        const userData = {
            name: document.querySelector("#input-name").value,
            fullName: document.querySelector("#input-full-name").value,
            email: document.querySelector("#profileEmail").value,
            phone: document.querySelector("#input-phone").value,
            location: document.querySelector("#input-location").value,
            postalCode: document.querySelector("#input-postal").value
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem("users", JSON.stringify(users));
        }

        alert("Perubahan berhasil disimpan!");
    }

    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
    const profileContent = document.getElementById("profileContent");

    const userInfoContent = profileContent.innerHTML;

    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            document.querySelectorAll(".sidebar-nav li").forEach(li => li.classList.remove("active"));
            link.parentElement.classList.add("active");

            const section = link.dataset.section;
            switchSection(section);
        });
    });

    // = = = = = = = = = WISHLIST = = = = = = = = =
    function getWishlist() {
        let wishlist = JSON.parse(localStorage.getItem("wishlistData"));
        if (!wishlist) {
            wishlist = [];
        }
        return wishlist;
    }

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

    function saveWishlist(wishlistArray) {
        localStorage.setItem("wishlistData", JSON.stringify(wishlistArray));
    }

    function formatRupiah(number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    }

    // = = = = = = = = = SWICTH FORM = = = = = = = = =
    function switchSection(section) {
        let newContent = "";

        (async () => {
            switch (section) {
                case "user-info":
                    newContent = userInfoContent;
                    profileContent.innerHTML = newContent;

                    const saveButton = document.querySelector(".save-btn");
                    if (saveButton) {
                        loadUserData();
                        saveButton.addEventListener("click", (e) => {
                            e.preventDefault();
                            saveUserData();
                        });
                    }
                    break;
                case "riwayat":
                    newContent = `
                <div class="placeholder">
                    <h2>Riwayat Transaksi</h2>
                    <p>List riwayat transaksi.</p>
                </div>`;
                    profileContent.innerHTML = newContent;
                    break;
                case "wishlist":
                    profileContent.innerHTML = `<div class="placeholder"><h2>Loading Wishlist...</h2></div>`;

                    try {
                        const response = await fetch('data/data_produk.json');
                        if (!response.ok) throw new Error('Gagal memuat data produk');
                        const allProducts = await response.json();

                        const wishlistIds = getWishlist();
                        const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

                        let wishlistHeaderHTML = `
                        <div class="wishlist-container">
                            <h2>Wishlist (${wishlistProducts.length})</h2>
                            <div class="wishlist-list">`;

                        let wishlistItemsHTML = '';
                        if (wishlistProducts.length > 0) {
                            wishlistItemsHTML = wishlistProducts.map(item => `
                                <div class="wishlist-item-new">
                                    <div class="item-image">
                                        <img src="${item.file}" alt="${item.nama}" />
                                    </div>
                                    <div class="item-details">
                                        <h4 class="item-name">${item.nama}</h4>
                                        <p class="item-category">${item.kategori}</p>
                                        <div class="item-rating">
                                            ${generateStars(item.rating)}
                                            <span>(${item.rating})</span>
                                        </div>
                                        <div class="item-price">
                                            <span>${formatRupiah(item.harga)}</span>
                                        </div>
                                    </div>
                                    <div class="item-actions">
                                        <button class="delete-wishlist-btn" data-id="${item.id}">
                                            <i class="fa-regular fa-trash-can"></i> Remove
                                        </button>
                                    </div>
                                </div>
                        `).join('');
                        } else {
                            wishlistItemsHTML = "<p>Wishlist kamu masih kosong. Mulai tambahkan dari halaman etalase produk!</p>";
                        }

                        newContent = wishlistHeaderHTML + wishlistItemsHTML + `
                        </div> </div> `;

                        profileContent.innerHTML = newContent;

                        document.querySelectorAll('.delete-wishlist-btn').forEach(button => {
                            button.addEventListener('click', (e) => {
                                const idToRemove = parseInt(button.dataset.id);
                                let currentWishlist = getWishlist();
                                currentWishlist = currentWishlist.filter(id => id !== idToRemove);
                                saveWishlist(currentWishlist);
                                switchSection('wishlist');
                            });
                        });

                    } catch (error) {
                        console.error(error);
                        profileContent.innerHTML = `<div class="placeholder"><h2>Oops!</h2><p>Gagal memuat wishlist. Cek console.</p></div>`;
                    }
                    break;
                case "pengaturan":
                    newContent = `<div class="placeholder"><h2>Pengaturan</h2><p>Halaman pengaturan akun.</p></div>`;
                    profileContent.innerHTML = newContent;
                    break;
                case "notifikasi":
                    newContent = `<div class="placeholder"><h2>Notifikasi</h2><p>Halaman notifikasi.</p></div>`;
                    profileContent.innerHTML = newContent;
                    break;
            }
        })();
    }
});
