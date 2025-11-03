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

        // Simpan profil pribadi (untuk halaman user)
        localStorage.setItem("userData", JSON.stringify(userData));

        // Update currentUser
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }

        // Update di daftar users (agar login pakai email baru bisa)
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem("users", JSON.stringify(users));
        }

        alert("Perubahan berhasil disimpan!");
    }

});
