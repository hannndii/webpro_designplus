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

      // Login admin
      if (email === "Admin@gmail.com" && password === "admin") {
          const admin = { name: "Admin Designplus", email };
          localStorage.setItem("currentUser", JSON.stringify(admin));
          alert("Login berhasil sebagai Admin!");
          window.location.href = "home.html";
          return;
      }

      // Login user biasa
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          alert(`Selamat datang, ${user.name}!`);
          window.location.href = "home.html";
      } else {
          alert("Email atau password salah.");
      }
  });
});
