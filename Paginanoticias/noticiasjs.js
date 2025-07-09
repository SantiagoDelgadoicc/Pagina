const apiKey = 'efaaf1c4-11e3-46d2-b756-584da68ed133';
const noticiasContainer = document.getElementById('noticias');

fetch(`https://content.guardianapis.com/search?q=books&section=books&api-key=${apiKey}&show-fields=thumbnail,trailText,byline&page-size=9`)
  .then(res => res.json())
  .then(data => {
    const noticias = data.response.results;
    noticias.forEach(noticia => {
      const div = document.createElement('div');
      div.classList.add('col-md-4', 'mb-4');

      div.innerHTML = `
        <div class="card h-100">
          ${noticia.fields.thumbnail ? `<img src="${noticia.fields.thumbnail}" class="card-img-top" alt="Imagen">` : ''}
          <div class="card-body">
            <h5 class="card-title h5_noticias">${noticia.webTitle}</h5>
            <p class="card-text p_noticias">${noticia.fields.trailText || ''}</p>
            <a href="${noticia.webUrl}" target="_blank" class="btn btn-outline-light boton_noticias">Leer más</a>
          </div>
        </div>
      `;
      noticiasContainer.appendChild(div);
    });
  })
  .catch(err => {
    noticiasContainer.innerHTML = '<p class="text-danger">Error al cargar noticias.</p>';
    console.error(err);
  });
