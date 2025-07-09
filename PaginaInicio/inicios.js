const contenedor = document.getElementById("contenedor_libros");

fetch("https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=Yg838GVGDPxGsV0EpVbAmKXRwzHNWDzB")
  .then(response => {
    if (!response.ok) throw new Error("No se pudo obtener la lista de libros");
    return response.json();
  })
  .then(data => {
    
    const libros = data.results.books.slice(0, 6); // limita a 6 libros

    //reccorrer los libros, obtengo los datos 
    libros.forEach(libro => {
      const titulo = libro.title || 'Sin título';
      const imagen = libro.book_image ;
      const autor = libro.author || 'Autor desconocido';
      const ranking_ventas = libro.rank || 'No hay descripción disponible';
      const editorial = libro.publisher || 'Editorial desconocida';
      const amazon_link = libro.amazon_product_url || '#';

      // crear un elemento de card para cada libro
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${imagen}" >
        <h3 class="titulo_config">${titulo}</h3>
        <p><em>${autor}</em></p>
        <p>${ranking_ventas}</p>
        <p class="editorial_config_titulo"><strong>Editorial:</strong> </p>
        <p class="editorial_config"> ${editorial}</p>
        <a href="${amazon_link}" target="_blank" class="btn boton_libros_destacados">Comprar en Amazon</a>

      `;
      contenedor.appendChild(card);
    });
  })
  .catch(error => {
    contenedor.innerHTML = `<p>Error al cargar los libros: ${error.message}</p>`;
  });

// key = 'Yg838GVGDPxGsV0EpVbAmKXRwzHNWDzB'; // API Key de NYT Books
//
