document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
});

async function cargarUsuarios() {
    const response = await fetch("http://localhost:3000/usuarios");
    const usuarios = await response.json();
	
	console.log(usuarios)
	
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
