document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    // ===== NAVBAR =====
    const userDisplay = document.getElementById("userNameDisplay");
    const userMenu = document.getElementById("userMenu");
  
    if (userDisplay && userMenu) {
      if (currentUser) {
        userDisplay.textContent = currentUser.name || "Pengguna";
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
  
    // ===== BAGIAN PROFIL =====
    const profileName = document.getElementById("profileName");
    const profileLocation = document.querySelector(".profile-user-info p");
    const profileEmail = document.getElementById("profileEmail");
    const logoutBtn = document.getElementById("logoutBtn");
    const passwordInput = document.querySelector("#input-password");
    const togglePassword = document.querySelector(".toggle-password");
    const deleteBtn = document.getElementById("deleteAccountBtn"); // <--- Tambahkan ini
  
    if (profileName || profileEmail || logoutBtn) {
      if (!currentUser) {
        alert("Silakan login dulu buat liat profil.");
        window.location.href = "login.html";
        return;
      }
  
      // ===== TAMPILKAN DATA USER DI FORM =====
      document.querySelector("#input-name").value = currentUser.name || "";
      document.querySelector("#input-full-name").value = currentUser.fullName || "";
      document.querySelector("#profileEmail").value = currentUser.email || "";
      document.querySelector("#input-phone").value = currentUser.phone || "";
      document.querySelector("#input-location").value = currentUser.location || "";
      document.querySelector("#input-postal").value = currentUser.postalCode || "";
  
      // ===== TAMPILKAN PASSWORD LAMA =====
      if (passwordInput && currentUser.password) {
        passwordInput.value = currentUser.password;
      }
  
      if (profileName) profileName.textContent = currentUser.name || "Pengguna";
      if (profileLocation) profileLocation.textContent = currentUser.location || "";
  
      // ===== LOGOUT =====
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Yakin mau logout?")) {
            localStorage.removeItem("currentUser");
            alert("Kamu sudah logout.");
            window.location.href = "home.html";
          }
        });
      }
  
      // ===== SAVE CHANGES =====
      const saveBtn = document.querySelector(".save-btn");
      if (saveBtn) {
        saveBtn.addEventListener("click", (e) => {
          e.preventDefault();
          saveUserData();
        });
      }
  
      function saveUserData() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const oldEmail = currentUser.email;
  
        const updatedData = {
          name: document.querySelector("#input-name").value.trim(),
          fullName: document.querySelector("#input-full-name").value.trim(),
          email: document.querySelector("#profileEmail").value.trim(),
          phone: document.querySelector("#input-phone").value.trim(),
          location: document.querySelector("#input-location").value.trim(),
          postalCode: document.querySelector("#input-postal").value.trim(),
        };
  
        if (passwordInput && passwordInput.value.trim()) {
          updatedData.password = passwordInput.value.trim();
        }
  
        // UPDATE currentUser
        const newCurrentUser = { ...currentUser, ...updatedData };
        localStorage.setItem("currentUser", JSON.stringify(newCurrentUser));
  
        // UPDATE USERS
        const userIndex = users.findIndex((u) => u.email === oldEmail);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedData };
          localStorage.setItem("users", JSON.stringify(users));
        }
  
        // UPDATE TAMPILAN
        if (profileName) profileName.textContent = updatedData.name;
        if (userDisplay) userDisplay.textContent = updatedData.name;
        if (profileLocation) profileLocation.textContent = updatedData.location;
  
        alert("Perubahan berhasil disimpan!");
      }
  
      // ===== SHOW / HIDE PASSWORD =====
      if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
          } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
          }
        });
      }
  
      // ===== DELETE ACCOUNT =====
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (confirm("Yakin ingin menghapus akun ini? Semua data akan hilang.")) {
            let users = JSON.parse(localStorage.getItem("users")) || [];
            users = users.filter(u => u.email !== currentUser.email);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.removeItem("currentUser");
            alert("Akun berhasil dihapus!");
            window.location.href = "home.html";
          }
        });
      }
    }
  });
  