const noticiasContainer = document.getElementById('favoritos');

fetch(``)
  .then(res => res.json())
  .then(data => {
    const favoritos = data.response.results;
    favoritos.forEach(favoritos => {
      const div = document.createElement('div');
      div.classList.add('col-md-4', 'mb-4');

      div.innerHTML = `
        <div class="card h-100">
          ${favoritos.fields.thumbnail ? `<img src="${favoritos.fields.thumbnail}" class="card-img-top" alt="Imagen">` : ''}
          <div class="card-body">
            <h5 class="card-title">${favoritos.webTitle}</h5>
            <p class="card-text">${favoritos.fields.trailText || ''}</p>
            <a href="${favoritos.webUrl}" target="_blank" class="btn btn-outline-light">Leer más</a>
          </div>
        </div>
      `;
      noticiasContainer.appendChild(div);
    });
  })
  .catch(err => {
    favoritosContainer.innerHTML = '<p class="text-danger">Error al cargar tus favoritos.</p>';
    console.error(err);
  });
