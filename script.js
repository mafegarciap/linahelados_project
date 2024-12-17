//pedir nombre del cliente con una aletrta linda
let nombreCliente= prompt("Ingrese su nombre")

let nombreClienteHtml= document.getElementById("nombre_cliente")
console.log(nombreCliente);
console.log(nombreClienteHtml);



nombreClienteHtml.innerHTML=`Hola <span class="nombre-rosa">${nombreCliente}</span>`
//OJO ponerle margen a esa sección

//listado de productos

const productos=[
    {
        "id": 1,
        "nombre": "Cono Sencillo",
        "descripcion_corta": "Un clásico cono con...",
        "descripcion_larga": "Un clásico cono con una bola de helado a elección.",
        "precio": 2000,
        "foto": 'img/icecream_threeball.jpg'
    },
    {
        "id": 2,
        "nombre": "Cono Doble",
        "descripcion_corta": "Cono con dos bolas...",
        "descripcion_larga": "Cono con dos bolas de helado combinables a elección.",
        "precio": 3500,
        "foto": "img/icecream_threeball.jpg"
    },
    {
        "id": 3,
        "nombre": "Cono Triple",
        "descripcion_corta": "Cono con tres bolas...",
        "descripcion_larga": "Cono con tres bolas de helado de diferentes sabores.",
        "precio": 4000,
        "foto": "img/icecream_threeball.jpg"
    },
    {
        "id": 4,
        "nombre": "Milkshake",
        "descripcion_corta": "Bebida cremosa...",
        "descripcion_larga": "Bebida cremosa hecha con helado y leche, disponible en varios sabores.",
        "precio": 4500,
        "foto": "img/icecream_threeball.jpg"
    },
    {
        "id": 5,
        "nombre": "Smoothie",
        "descripcion_corta": "Refrescante bebida...",
        "descripcion_larga": "Refrescante bebida de frutas mezcladas, ideal para un día caluroso.",
        "precio": 4000,
        "foto": "img/icecream_threeball.jpg"
    }
]

//mostrar productos en el html
//capturo el contenedor:
const contenedorCards = document.getElementById("opciones_pedido");

// Recorrerlo mediante un for
for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];

    // Crear el elemento contenedor principal
    const card = document.createElement("label");

    // Crear la estructura HTML para la card
    card.innerHTML = `
        <p class="nombreProducto">${producto.nombre}</p>
        <img src="${producto.foto}" alt="${producto.nombre}">
        <div class="mas_info">
            <p class="descripcion" id="descripcion-${producto.id}">${producto.descripcion_corta}</p>
            <button class="ver-mas" data-id="${producto.id}" type="button">Ver más</button> <!-- Se agregó type="button" -->
            <p id="precio">$${producto.precio}</p>
        </div>
        <i class="fa-regular fa-heart" style="color: #d87093;"></i>
        <button class="botones">Agregar</button>
    `;

    // Agregar la card al contenedor principal
    contenedorCards.appendChild(card);

    // Capturar el botón "Ver más" y la descripción
    const botonVerMas = card.querySelector(".ver-mas");
    const descripcionParrafo = card.querySelector(".descripcion");

    // Añadir el evento de clic para alternar la descripción
    botonVerMas.addEventListener("click", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const productoId = event.target.getAttribute("data-id"); // Obtener el id del producto
        const producto = productos.find(p => p.id == productoId); // Buscar el producto en el array

        // Alternar la descripción entre corta y larga
        if (descripcionParrafo.textContent === producto.descripcion_corta) {
            descripcionParrafo.textContent = producto.descripcion_larga;
            event.target.textContent = "Ver menos"; // Cambiar el texto del botón
        } else {
            descripcionParrafo.textContent = producto.descripcion_corta;
            event.target.textContent = "Ver más"; // Cambiar el texto del botón
        }
    });
}



//Validación formulario
// Funcion para verificar si todos los campos estan completos

function validarFormularioCompleto(event) {
    console.log("Iniciando validación del formulario");

    const formulario = document.getElementById('form_contacto');

    if (!formulario) {
        console.error("No se encontró el formulario");
        return;
    }

    const inputs = formulario.querySelectorAll('input, textarea, select');
    let hayCamposVacios = false;

    // Recorremos todos los campos
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.value.trim()) {
            console.warn(`El campo "${input.name || input.id}" está vacío.`);
            hayCamposVacios = true;
        }
    }

    if (!hayCamposVacios) {
        console.log('Todos los campos están llenos.');
    } else {
        console.log('Hay campos vacíos en el formulario.');
        event.preventDefault(); // Opcional: evitar envío si hay campos vacíos
    }
}

// Enlazar el evento submit
document.getElementById('form_contacto').addEventListener('submit', validarFormularioCompleto);


//mostrar productos dinámicamente en la consola
// console.log("Productos disponibles:");
// for (const producto of productos) {
//     console.log(`ID: ${producto.id}, Nombre: ${producto.nombre}, Descripción: ${producto.descripcion}, Precio: $${producto.precio}`);
// }
