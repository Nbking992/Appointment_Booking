async function cargarUsuarios() {
    const response = await fetch("http://localhost:3000/usuarios");
    const usuarios = await response.json();
	
    const usuariosLista = document.getElementById("usuarios-lista");
    
    let tableHTML = `<h2>Usuarios Registrados</h2>
                     <table>
                     <thead>
                         <tr>
                             <th>Teléfono</th>
                             <th>Nombre</th>
                             <th>Apellido</th>
                             <th>Acciones</th>
                         </tr>
                     </thead>
                     <tbody>`;

    usuarios.forEach(user => {
        tableHTML += `<tr>
                         <td>${user.telefono}</td>
                         <td>${user.nombre}</td>
                         <td>${user.apellido}</td>
                         <td class='action-buttons'>
                             <button onclick="verUsuario('${user.telefono}')">👁 Ver</button>
                             <button onclick="modificarUsuario('${user.telefono}')">✏ Modificar</button>
                             <button onclick="eliminarUsuario('${user.telefono}')">🗑 Eliminar</button>
                         </td>
                     </tr>`;
    });
    tableHTML += "</tbody></table>";
    usuariosLista.innerHTML = tableHTML;
}

async function verUsuario(telefono) {
    const response = await fetch(`http://localhost:3000/usuarios/${telefono}`);
    const user = await response.json();
    const detalleContainer = document.getElementById("usuario-detalle-container");
    detalleContainer.innerHTML = `<h2>Detalle del Usuario</h2>
                                  <p><strong>Nombre:</strong> ${user.nombre}</p>
                                  <p><strong>Apellido:</strong> ${user.apellido}</p>
                                  <p><strong>Teléfono:</strong> ${user.telefono}</p>
                                  <p><strong>Email:</strong> ${user.email}</p>
                                  <button onclick="cerrarDetalle()">Cerrar</button>`;
    detalleContainer.classList.remove("hidden");
}

function cerrarDetalle() {
    document.getElementById("usuario-detalle-container").classList.add("hidden");
}

async function eliminarUsuario(telefono) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        await fetch(`http://localhost:3000/usuarios/${telefono}`, { method: "DELETE" });
        cargarUsuarios();
    }
}

async function modificarUsuario(telefono) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoApellido = prompt("Nuevo apellido:");
    const nuevoEmail = prompt("Nuevo email:");
    if (nuevoNombre && nuevoApellido) {
        await fetch(`http://localhost:3000/usuarios/${telefono}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre, apellido: nuevoApellido, email: nuevoEmail })
        });
        cargarUsuarios();
    }
}

// scripts/home.js

const images = [
  "https://images.pexels.com/photos/3992878/pexels-photo-3992878.jpeg",
  "https://images.pexels.com/photos/3992879/pexels-photo-3992879.jpeg",
  "https://images.pexels.com/photos/3992877/pexels-photo-3992877.jpeg",
  "https://images.pexels.com/photos/3992880/pexels-photo-3992880.jpeg"
];

let currentIndex = 0;

const carouselImage = document.getElementById("carousel-image");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const indicatorsContainer = document.getElementById("carousel-indicators");

function updateCarousel() {
  carouselImage.src = images[currentIndex];
  updateIndicators();
}

function updateIndicators() {
  indicatorsContainer.innerHTML = "";
  images.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = `w-3 h-3 mx-1 rounded-full ${
      index === currentIndex ? "bg-blue-500" : "bg-gray-300"
    }`;
    indicatorsContainer.appendChild(dot);
  });
}

leftArrow.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel();
});

rightArrow.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel();
});

updateCarousel();

let lastScrollY = window.scrollY;
const navbarTitle = document.getElementById("navbar-title");

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY) {
    navbarTitle.classList.add("opacity-0", "translate-y-[-20px]");
  } else {
    navbarTitle.classList.remove("opacity-0", "translate-y-[-20px]");
  }
  lastScrollY = window.scrollY;
});

lucide.createIcons();

