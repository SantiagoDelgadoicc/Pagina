const noticiasContainer = document.getElementById('favoritos');
const ApiKey = 'AIzaSyCcbdlLcf8QQuJ7ssfh2ksmr1XRk1gHAo8';

window.onload = () => {
  const contenedor = document.getElementById("favoritos");
  const usuarioActivo = localStorage.getItem("usuarioActivo");
// verificar si hay un usuario activo
  if (!usuarioActivo) {
    alert("Inicia sesión para ver tus favoritos.");
    window.location.href = "/Pagina/PaginaLogin/login.html";
    return;
  }
// sacar los favoritos del usuario activo
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[usuarioActivo];
  let favoritos = Array.isArray(user?.favoritos) ? [...user.favoritos] : [];
// verificar si hay favoritos
  if (favoritos.length === 0) {
    contenedor.innerHTML = "<p class='text-white'>No tienes libros guardados.</p>";
    return;
  }

  // Tarjetas de favoritos con para que no se eliminen mas de una
  favoritos.forEach((libro, index) => {
    let descripcion = libro.descripcion || "Sin descripción disponible";
    if (descripcion.length > 100) {
      descripcion = descripcion.substring(0, 100) + "...";
    }

    const tarjeta = document.createElement("div");
    tarjeta.className = "card mx-3 p-0 mt-3 tarjeta";
    tarjeta.setAttribute("data-index", index);

    tarjeta.innerHTML = `
      <div class="posicioncirculo">
        <button class="circulo eliminar-fav" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill basura" viewBox="0 0 16 16">
            <path d="M2.5 1a1 1 0 0 0-1 1v1h13V2a1 1 0 0 0-1-1H2.5zM1 4v9.5A2.5 2.5 0 0 0 3.5 16h9a2.5 2.5 0 0 0 2.5-2.5V4H1z"/>
          </svg>
        </button>
      </div>
      <img src="${libro.imagen}" class="card-img-top" alt="libro" height="280px" width="100%">
      <div class="card-body tarjetacuerpo">
        <h5>${libro.titulo}</h5>
        <p class="card-text mt-2 letraoscura">${descripcion}</p>
        <a href="/Pagina/Paginareseñas/reseñas.html" target="_blank" class="btn mt-2 botonoscuro botontarjeta" data-index="${index}">Ver reseñas</a>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });

  // boton eliminar y reseña
  contenedor.addEventListener("click", (e) => {
    const botonResena = e.target.closest(".botontarjeta");
    const botonEliminar = e.target.closest(".eliminar-fav");

    if (botonResena) {
      const index = parseInt(botonResena.dataset.index);
      const libro = favoritos[index];
      if (libro) {
        localStorage.setItem("libro", libro.link || libro.selfLink || "");
        localStorage.setItem("ids", libro.id);
      }
    }

    if (botonEliminar) {
      const index = parseInt(botonEliminar.dataset.index);
      const confirmacion = confirm("¿Deseas eliminar este libro de tus favoritos?");
      if (confirmacion) {
        // eliminar y actualizar
        favoritos.splice(index, 1);
        user.favoritos = favoritos;
        users[usuarioActivo] = user;
        localStorage.setItem("users", JSON.stringify(users));
        contenedor.innerHTML = "";
        window.onload(); 
      }
    }
  });
};

//cerrar sesion
  function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  alert("Sesión cerrada correctamente");
  window.location.href = "/Pagina/PaginaLogin/login.html";
}

