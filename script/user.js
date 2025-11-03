document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const userDisplay = document.getElementById("userNameDisplay");
    const userMenu = document.getElementById("userMenu");

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
});
