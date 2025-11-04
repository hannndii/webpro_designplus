document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return; // Skip kalau halaman bukan login
  
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!email || !password) {
        alert("Harap isi semua kolom.");
        return;
      }
  
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      // ===== LOGIN ADMIN =====
      if (email === "admin@gmail.com" && password === "admin") {
        const admin = { name: "Admin Designplus", email, role: "admin" };
        localStorage.setItem("currentUser", JSON.stringify(admin));
        alert("Login berhasil sebagai Admin!");
        window.location.href = "homeAdmin.html"; // diarahkan ke halaman admin
        return;
      }
  
      // ===== LOGIN USER BIASA =====
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        user.role = "user"; // tambahkan role biar bisa dicek nanti
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert(`Selamat datang, ${user.name}!`);
        window.location.href = "home.html";
      } else {
        alert("Email atau password salah.");
      }
    });
  });
  