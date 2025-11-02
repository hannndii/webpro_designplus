document.addEventListener("DOMContentLoaded", () => {
    // Ambil data user yang login sekali aja
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Header: tampil nama user
    const userDisplay = document.getElementById("userNameDisplay");
    const userMenu = document.getElementById("userMenu");

    if (userDisplay && userMenu) {
        if (currentUser) {
            userDisplay.textContent = currentUser.name;
            userDisplay.style.fontWeight = "600";
            userDisplay.style.color = "#007bff";
            userDisplay.style.marginLeft = "5px";

            // Klik header → profile
            userMenu.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "profile.html";
            });
        } else {
            userDisplay.textContent = "Tamu";
            userDisplay.style.opacity = "0.7";
            userDisplay.style.marginLeft = "5px";

            // Klik header → login
            userMenu.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "login.html";
            });
        }
    }

    // Profile page: proteksi + tampil info
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const logoutBtn = document.getElementById("logoutBtn");

    // Kalau halaman profile & user belum login → redirect
    if ((profileName || profileEmail || logoutBtn) && !currentUser) {
        alert("Silakan login dulu buat liat profil.");
        window.location.href = "login.html";
        return;
    }

    // Tampilkan info user
    if (currentUser && profileName) profileName.textContent = currentUser.name || "Pengguna";
    if (currentUser && profileEmail) profileEmail.textContent = currentUser.email || "-";

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            const confirmLogout = confirm("Yakin mau logout?");
            if (confirmLogout) {
                localStorage.removeItem("currentUser");
                alert("Kamu sudah logout.");
                window.location.href = "home.html";
            }
        });
    }
});
