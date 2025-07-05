const loginForm = document.getElementById("login-formulario");
const registroForm = document.getElementById("registro-formulario");
const formTitle = document.getElementById("formulario-titulo");
const toggleBtn = document.querySelector(".botoncambiar");
//cambiar de registro a login y de login a registro
function alternar() {
  const mostrandoLogin = loginForm.classList.contains("mostrar");
  
  if (mostrandoLogin) {
    loginForm.classList.remove("mostrar");
    loginForm.classList.add("oculto");
    registroForm.classList.remove("oculto");
    registroForm.classList.add("mostrar");
    formTitle.textContent = "Registro";
    toggleBtn.textContent = "¿Ya tienes cuenta? Inicia sesión";
  } else {
    registroForm.classList.remove("mostrar");
    registroForm.classList.add("oculto");
    loginForm.classList.remove("oculto");
    loginForm.classList.add("mostrar");
    formTitle.textContent = "Iniciar sesión";
    toggleBtn.textContent = "¿No tienes cuenta? Regístrate";
  }
}
//registro de usuario
registroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = registroForm.querySelector("input[type='text']").value;
  const password = registroForm.querySelector("input[type='password']").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("El usuario ya existe");
    return;
  }

  users[username] = { password, favoritos: [] };
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("usuarioActivo", username);
  alert("Usuario registrado correctamente");
  window.location.href = "../PaginaInicio/inicioLibros.html";
});
//login de usuario
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginForm.querySelector("input[type='text']").value;
  const password = loginForm.querySelector("input[type='password']").value;

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username] || users[username].password !== password) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  localStorage.setItem("usuarioActivo", username);
  alert("Inicio de sesión exitoso");
  window.location.href = "../PaginaInicio/inicioLibros.html";
});
