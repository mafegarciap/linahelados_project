let nombreCliente = localStorage.getItem("nombreCliente");


//if (!nombreCliente || nombreCliente==null) {
if (!nombreCliente) {
    //nombreCliente = prompt("¡Hola! Por favor, ingresa tu nombre:");

    // if (nombreCliente) {
    //     // Guardar el nombre en localStorage
    //     localStorage.setItem("nombreCliente", nombreCliente);
    // } else if(nombreCliente==null){
    //     Swal.fire({text:'¡Es necesario ingresar tu nombre!',
    //         confirmButtonColor: 'rgb(216,112,147)'
    //     });
    //      //alert("¡Es necesario ingresar tu nombre!");
    //  }

    Swal.fire({
        title: '¡Hola!',
        text: 'Por favor, ingresa tu nombre:',
        input: 'text', // Campo de entrada
        inputPlaceholder: 'Escribe tu nombre aquí',
        confirmButtonColor: 'rgb(216,112,147)',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
    }).then((result) => {
        if (result.isConfirmed) {
            const nombreCliente = result.value; // Obtener el valor ingresado
            if (nombreCliente) {
                localStorage.setItem("nombreCliente", nombreCliente); // Guardar en localStorage

                // Actualizar el contenido en el HTML
                if (nombreClienteHtml) {
                    nombreClienteHtml.innerHTML = `Hola <span class="nombre-rosa">${nombreCliente}</span>`;
                }
            } else {
                Swal.fire({
                    text: 'No ingresaste un nombre.',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(216,112,147)'
                });
            }
        }
    });
}



let nombreClienteHtml = document.getElementById("nombre_cliente");
console.log(nombreCliente);

// Mostrar el nombre del cliente en la sección del resumen del pedido
nombreClienteHtml.innerHTML = `Hola <span class="nombre-rosa">${nombreCliente}</span>`;



//----mostrar productos en el html desde un .json----
//capturo en contenedor
const contenedorCards = document.getElementById("opciones_pedido");


fetch("productos.json")
.then((respuesta)=>respuesta.json())
.then((datos)=>{
    console.log(datos);

    datos.forEach((producto)=> {
    
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
            <button class="botones agregar-producto" type="button">Agregar</button>
        `;
    
        // Agregar la card al contenedor principal
        contenedorCards.appendChild(card);
    
        // Capturar el botón Ver mas y la descripcion
        const botonVerMas = card.querySelector(".ver-mas");
        const descripcionParrafo = card.querySelector(".descripcion");
    
        // Añadir el evento de clic para alternar la descripcion
        botonVerMas.addEventListener("click", function(event) {
            event.preventDefault(); // Prevenir el envio del formulario
    
            const productoId = event.target.getAttribute("data-id"); // Obtener el id del producto
            const producto = datos.find(p => p.id == productoId); // Buscar el producto en el array
    
            // Alternar la descripción entre corta y larga
            if (descripcionParrafo.textContent === producto.descripcion_corta) {
                descripcionParrafo.textContent = producto.descripcion_larga;
                event.target.textContent = "Ver menos"; // Cambiar el texto del boton
            } else {
                descripcionParrafo.textContent = producto.descripcion_corta;
                event.target.textContent = "Ver más"; // Cambiar el texto del boton otra vez
            }
        });
    })
    
})


//------carrito de compras-----
//contador
let carrito=[]

//capturo elementos html que necesito
const opcionesPedido= document.querySelector("#opciones_pedido");
const formularioRetiro = document.getElementById("formulario_retiro");
const botonesAgregar = document.querySelectorAll(".agregar-producto");
const finalizarPedido = document.getElementById("finalizarPedido");
const seccionResumen = document.getElementById("resumen_pedido");

//capturo elementos donde muesro el resumen
const resumenRetiro = document.getElementById("resumenLugarRetiro");
const resumenProductos = document.getElementById("resumenProductos");
const resumenTotal = document.getElementById("resumenTotalOrden");

//formulario retiro
//prevengo el envieo de las imagenes que son de tipo submit

// Guardar lugar de retiro en localStorage
formularioRetiro.addEventListener("click", function (e) {
    e.preventDefault(); // Previene que el formulario se envíe
   
    if (e.target.tagName === "INPUT" && e.target.type === "image") {
        // Obtener el valor del input oculto relacionado
        const lugar = e.target.previousElementSibling.value;
        localStorage.setItem("lugarRetiro", lugar); // Guardar el valor en localStorage
        console.log(`Lugar de retiro guardado: ${lugar}`);
    }
});


//---probando manejar el evento con el contenedor principal en vez de con los botones
// Delegar eventos al contenedor principal
contenedorCards.addEventListener("click", function (e) {
    if (e.target.classList.contains("agregar-producto")) {
        const card = e.target.closest("label");
        const nombre = card.querySelector(".nombreProducto").textContent;
        const precio = parseInt(card.querySelector("#precio").textContent.replace("$", ""));
        carrito.push({ nombre, precio });
        //alert(`Producto agregado: ${nombre} - $${precio}`);
        Swal.fire({text:`Producto agregado: ${nombre} - $${precio}`,
            confirmButtonColor: 'rgb(216,112,147)'
        });
    }
});

// -------Mostrar el resumen al finalizar el pedido-------
finalizarPedido.addEventListener("click", function (e) {
    e.preventDefault();

    // Obtener lugar de retiro
    const lugarRetiro = localStorage.getItem("lugarRetiro") || "No especificado";
    resumenRetiro.textContent = `Lugar de retiro: ${lugarRetiro}`;

    // Resumir productos seleccionados
    resumenProductos.innerHTML = "";
    let total = 0;

    // Procesar carrito
    const resumenCarrito = carrito.reduce((acumulador, producto) => {
        const { nombre, precio } = producto;
        if (!acumulador[nombre]) {
            acumulador[nombre] = { cantidad: 0, precio };
        }
        acumulador[nombre].cantidad++;
        return acumulador;
    }, {});

    for (const [nombre, { cantidad, precio }] of Object.entries(resumenCarrito)) {
        const subtotal = cantidad * precio;
        total += subtotal;
        const listItem = document.createElement("li");
        listItem.textContent = `${nombre} x${cantidad} - $${subtotal}`;
        resumenProductos.appendChild(listItem);
    }

    // Procesar sabores seleccionados
    const saboresSeleccionados = Array.from(document.querySelectorAll('input[name="sabores"]:checked'))
        .map(input => input.value);
    if (saboresSeleccionados.length > 0) {
        const listItem = document.createElement("li");
        listItem.textContent = `Sabores elegidos: ${saboresSeleccionados.join(", ")}`;
        resumenProductos.appendChild(listItem);
    }

    // Procesar salsa seleccionada
    const salsaSeleccionada = document.querySelector('input[name="salsas"]:checked');
    if (salsaSeleccionada) {
        const listItem = document.createElement("li");
        listItem.textContent = `Salsa elegida: ${salsaSeleccionada.value}`;
        resumenProductos.appendChild(listItem);
    }

    // Mostrar el total
    resumenTotal.textContent = `Total a pagar: $${total}`;
    seccionResumen.scrollIntoView({ behavior: "smooth", block: "center" });

    // Habilitar el botón "Finalizar Orden"
    finalizarOrdenBtn.disabled = false;
});

const finalizarOrdenBtn = document.getElementById("finalizarOrden");

finalizarOrdenBtn.addEventListener("click", function () {
    // Limpiar el contenido del resumen
    resumenRetiro.textContent = "";
    resumenProductos.innerHTML = "";
    resumenTotal.textContent = "";

    // Eliminar el nombre del cliente del localStorage
   // localStorage.removeItem("nombreCliente");
    localStorage.removeItem("lugarRetiro");

    // Limpiar el saludo con el nombre del cliente
    document.getElementById("nombre_cliente").textContent = "";

    // Deshabilitar el botón nuevamente
    finalizarOrdenBtn.disabled = true;

    // Redirigir a otra pagina
    window.location.href = "colecta.html"
});

function borrarNombreCliente() {
    localStorage.removeItem('nombreCliente'); // Eliminar el nombre del localStorage
    //promppt con sweet alert
    Swal.fire({
        title: '¡Hola!',
        text: 'Por favor, ingresa tu nombre:',
        input: 'text', // Campo de entrada
        inputPlaceholder: 'Escribe tu nombre aquí',
        confirmButtonColor: 'rgb(216,112,147)',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar',
    }).then((result) => {
        if (result.isConfirmed) {
            const nombreCliente = result.value; // Obtener el valor ingresado
            if (nombreCliente) {
                localStorage.setItem("nombreCliente", nombreCliente); // Guardar en localStorage

                // Actualizar el contenido en el HTML
                if (nombreClienteHtml) {
                    nombreClienteHtml.innerHTML = `Hola <span class="nombre-rosa">${nombreCliente}</span>`;
                }
            } else {
                Swal.fire({
                    text: 'No ingresaste un nombre.',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(216,112,147)'
                });
            }
        }
    });
}

// agregar el evento al boton
document.getElementById('borrar_nombre').addEventListener('click', borrarNombreCliente);


//Validar formulario pagina contacto
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


document.getElementById('form_contacto').addEventListener('submit', validarFormularioCompleto);


//mostrar productos dinámicamente en la consola
// console.log("Productos disponibles:");
// for (const producto of productos) {
//     console.log(`ID: ${producto.id}, Nombre: ${producto.nombre}, Descripción: ${producto.descripcion}, Precio: $${producto.precio}`);
// }

//OJO ponerle margen a esa sección

//----listado de productos que se muestra en el home----

/*const productos=[
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
]*/

//----mostrar productos en el html desde un array-----
//capturo el contenedor:
//const contenedorCards = document.getElementById("opciones_pedido");

// Recorrerlo mediante un for
/*for (let i = 0; i < productos.length; i++) {
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
}*/
