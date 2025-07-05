//cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  alert("Sesión cerrada correctamente");
  window.location.href = "/Pagina/PaginaLogin/login.html";
}