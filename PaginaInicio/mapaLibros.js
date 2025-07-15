
  const mapaContenedor = document.getElementById("mapaContenedor");
  const infoUbicacion = document.getElementById("infoUbicacion");

// creo una lista de libros con sus paises y coordenadas 
  const libros = [
    { pais: "Francia", coordenadas: [48.8566, 2.3522], titulo: "El Principito", autor: "Antoine de Saint-Exupéry" },
    { pais: "Chile", coordenadas: [-33.4489, -70.6693], titulo: "La casa de los espíritus", autor: "Isabel Allende" },
    { pais: "Japón", coordenadas: [35.6895, 139.6917], titulo: "Tokio Blues", autor: "Haruki Murakami" },
    { pais: "Colombia", coordenadas: [4.710989, -74.072092], titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
    { pais: "España", coordenadas: [40.416775, -3.70379], titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes" },
    { pais: "Argentina", coordenadas: [-34.6037, -58.3816], titulo: "Rayuela ", autor: "Julio Cortázar" },
    { pais: "Estados Unidos", coordenadas: [38.9072, -77.0369], titulo: "Las uvas de la ira", autor: "John Steinbeck" },
    { pais: "Mexico", coordenadas: [19.4326, -99.1332], titulo: "Pedro Páramo", autor: "Juan Rulfo" },
    { pais: "Inglaterra", coordenadas: [51.5074, -0.1278], titulo: "1984 ", autor: "George Orwell" },
    { pais: "Rusia", coordenadas: [55.7558, 37.6173], titulo: "Crimen y castigo", autor: "Fiódor Dostoyevski" },
    { pais: "Alemania", coordenadas: [52.5200, 13.4050], titulo: "Los Buddenbrook", autor: "Thomas Mann" },
    { pais: "India", coordenadas: [28.6139, 77.2090], titulo: "Hijos de la medianoche", autor: "Salman Rushdie" },
    { pais: "China", coordenadas: [39.9042, 116.4074], titulo: "La balada del ajo ", autor: "Mo Yan" },
    { pais: "Nigeria", coordenadas: [9.05785, 7.49508], titulo: "Todo se desmorona", autor: "Chinua Achebe" },
    { pais: "Sudáfrica", coordenadas: [-25.7461, 28.1881], titulo: "Desgracia ", autor: "J.M. Coetzee" },
    { pais: "Australia", coordenadas: [-35.2809, 149.1300], titulo: "Cloudstreet ", autor: "Tim Winton" },
    { pais: "Perú", coordenadas: [-12.0464, -77.0428], titulo: "El hombre que amaba a los perros", autor: "Mario Vargas Llosa" },
    { pais: "Cuba", coordenadas: [23.1136, -82.3666], titulo: "El hombre que amaba a los perros", autor: "Leonardo Padura" },
    { pais: "Canadá", coordenadas: [45.4215, -75.6972], titulo: "El cuento de la criada (The Handmaid's Tale)", autor: "Margaret Atwood" },
    { pais: "Italia", coordenadas: [41.9028, 12.4964], titulo: "Si esto es un hombre", autor: "Primo Levi" },
    { pais: "Irlanda", coordenadas: [53.3498, -6.2603], titulo: "Ulises ", autor: "James Joyce" },
    { pais: "Portugal", coordenadas: [38.7169, -9.1399], titulo: "Ensayo sobre la ceguera", autor: "José Saramago" },
    { pais: "Suecia", coordenadas: [59.3293, 18.0686], titulo: "Los hombres que no amaban a las mujeres", autor: "Stieg Larsson" },
    { pais: "Irán", coordenadas: [35.6892, 51.3890], titulo: "Persépolis ", autor: "Marjane Satrapi" },
    { pais: "Corea del Sur", coordenadas: [37.5665, 126.9780], titulo: "Por favor cuida de mamá", autor: "Kyung-sook Shin" },
    { pais: "Turquía", coordenadas: [41.0082, 28.9784], titulo: "El museo de la inocencia", autor: "Orhan Pamuk" },
    { pais: "Egipto", coordenadas: [30.0444, 31.2357], titulo: "El callejón de los milagros", autor: "Naguib Mahfuz" },
    { pais: "Kenia", coordenadas: [-1.2921, 36.8219], titulo: "Un grano de trigo", autor: "Ngũgĩ wa Thiong'o" },
    { pais: "Nueva Zelanda", coordenadas: [-41.2865, 174.7762], titulo: "The Bone People", autor: "Keri Hulme" },
    { pais: "Venezuela", coordenadas: [10.4806, -66.9036], titulo: "Doña Bárbara", autor: "Rómulo Gallegos"},
    { pais: "Uruguay", coordenadas: [-34.9011, -56.1645], titulo: "La tregua", autor: "Mario Benedetti" },
    { pais: "Bolivia", coordenadas: [-16.5000, -68.1500], titulo: "Raza de bronce", autor: "Alcides Arguedas" },
    { pais: "Paraguay", coordenadas: [-25.2637, -57.5759], titulo: "Yo el supremo", autor: "Augusto Roa Bastos" },
    { pais: "Polonia", coordenadas: [52.2297, 21.0122], titulo: "Solaris", autor: "Stanisław Lem" },
    { pais: "Noruega", coordenadas: [59.9139, 10.7522], titulo: "El mundo de Sofía", autor: "Jostein Gaarder" },
    { pais: "Grecia", coordenadas: [37.9838, 23.7275], titulo: "Zorba el griego", autor: "Nikos Kazantzakis" },

  ];

  fetch("https://api.geoapify.com/v1/ipinfo?apiKey=4de04ea914184d1380005995b6c9aac8")
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener la ubicacion");
      return response.json();
    })
    .then(data => {

      const mapa = L.map(mapaContenedor).setView([0, 0], 2); // vista global
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapa);

      // recorro la lista y agrego marcadores para cada libro
      libros.forEach(libro => {
        L.marker(libro.coordenadas)
          .addTo(mapa)
          .bindPopup(`
            <strong>${libro.titulo}</strong><br>
            ${libro.autor}<br>
            <em>${libro.pais}</em>
          `);
      });
    })
    .catch(error => {
      infoUbicacion.innerHTML = `<li class="list-group-item text-danger">No se pudo obtener la ubicacion</li>`;
    });
