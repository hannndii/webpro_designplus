document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return; // Skip kalau halaman bukan register

  registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!name || !email || !password) {
          alert("Semua kolom harus diisi!");
          return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Cek email udah ada
      if (users.some(u => u.email === email)) {
          alert("Email sudah terdaftar. Silakan login.");
          return;
      }

      // Tambah user baru
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Pendaftaran berhasil! Silakan login.");
      window.location.href = "login.html";
  });
});
