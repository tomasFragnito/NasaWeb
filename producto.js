import Port from '../class/config.js';
import { mostrarModalConfirmacion } from '../js/modalEliminar.js';

const FRONTEND_URL = Port.getFrontend();
const BACKEND_URL = Port.getBackend();

const MAINJS = "../js/main.js";

const API_BASE = BACKEND_URL+"/api/productos";

export class Producto {
    constructor({ id, nombre, precio, tamano, genero, imagen, categoria, activo }) {
        this.id = id || null;
        this.nombre = nombre;
        this.precio = precio;
        this.tamano = tamano;
        this.genero = genero;
        this.imagen = imagen;
        this.categoria = categoria;
        this.activo = activo;
    }

    static endpoint(categoria) {
        return `${API_BASE}/all/${categoria}`;
    }

    // POST
    async crearProducto() {
        try {
            const formData = new FormData();
            formData.append("nombre", this.nombre);
            formData.append("precio", this.precio);
            formData.append("tamano", this.tamano);
            formData.append("genero", this.genero);
            formData.append("categoria", this.categoria);

            if (this.imagen instanceof File) {
                formData.append("imagen", this.imagen);
            }

            const res = await fetch(API_BASE, { //cambiar variable de api base
                method: "POST",
                body: formData
            });

            if (!res.ok) {
            let mensaje = "Error al crear producto";

            try {
                const errorBackend = await res.json();
                if (errorBackend.error) mensaje += ": " + errorBackend.error;
            } catch (e) {
                console.log("backend no envio JSON")
            }

            throw new Error(mensaje);
            }
            const data = await res.json();
            this.id = data.id;
            return data;

        } catch (err) {
            console.error("Error al guardar producto:", err);
            throw err;
        }
    }

    // PUT
    async editarProducto() {
        // actualizar datosssssss
        const cuerpo = {
            nombre: this.nombre,
            precio: this.precio,
            tamano: this.tamano,
            genero: this.genero,
            categoria: this.categoria,
            activo: this.activo
        };

        // Si la imagen es un string (URL), se envia al PUT de datos
        if (typeof this.imagen === "string") {
            cuerpo.imagen = this.imagen;
        }

        //este PUT se utiliza para enviar solo datos (NO IMAGENES)
        const resDatos = await fetch(`${API_BASE}/${this.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpo)
        });

        if (!resDatos.ok) {
            throw new Error("Error al actualizar datos del producto");
        }

        const datosActualizados = await resDatos.json();


        // Si la imagen es un file, se envia por otro PUT que soporte files
        if (this.imagen instanceof File) {
            const formData = new FormData();
            formData.append("imagen", this.imagen);

            const resImg = await fetch(`${API_BASE}/${this.id}/imagen`, { 
                method: "PUT",
                body: formData
            });

            if (!resImg.ok) {
                throw new Error("Error al actualizar imagen del producto");
            }

            const imagenActualizada = await resImg.json();
            return { ...datosActualizados, imagen: imagenActualizada.imagen };
        }
        
        return datosActualizados;
    }

    // DELETE
    async eliminarProducto() {
        try {
            const res = await fetch(`${API_BASE}/${this.id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Error al borrar producto");
            return true;

        } catch (err) {
            console.error("Error al borrar producto:", err);
            return false;
        }
    }

    mostrarActivo(){
        console.log(this.activo)
    }

    obtenerURLImagen() {
        const imgDefaultPantalon = "http://localhost:3000/uploads/defaultPantalon.jpg";
        const imgDefaultRemera = "http://localhost:3000/uploads/defaultRemera.jpg";

        // Si no hay imagen usa default
        if (!this.imagen) {
            if (this.categoria === "remeras") {
                return imgDefaultRemera;
            } else {
                return imgDefaultPantalon;
            }
        }

        // Si es URL completa 
        else if (this.imagen.startsWith("http")) {
            return this.imagen;
        }

        // Si es local /uploads/
        else {
            return `http://localhost:3000/uploads/${this.imagen}`;
        }
    }

    crearCard() {
        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = this.obtenerURLImagen();

        img.alt = this.nombre;

        const datosContainer = document.createElement("div");
        datosContainer.classList.add("card-datos");

        const nombreText = document.createElement("p");
        nombreText.textContent = this.nombre;

        const precioText = document.createElement("p");
        precioText.textContent = `$${this.precio}`;

        const tamanoText = document.createElement("p");
        tamanoText.textContent = `talle: ${this.tamano}`;

        const generoText = document.createElement("p");
        generoText.textContent = `genero: ${this.genero}`;

        datosContainer.append(nombreText, precioText, tamanoText, generoText);

        // SWITCH PARA ACTIVAR/DESACTIVAR 

        // Contenedor principal del switch
        const toggleEstadoProducto = document.createElement("label");  
        toggleEstadoProducto.classList.add("switch");

        // Input real del switch (checkbox)
        const toggleCheckbox = document.createElement("input");  
        toggleCheckbox.type = "checkbox";
        toggleCheckbox.checked = this.activo; // estado actual del producto

        // Elemento visual del switch (la animacion que se desliza)
        const toggleDeslizador = document.createElement("span");  
        toggleDeslizador.classList.add("slider");
        
        // Texto de estado
        const estadoText = document.createElement("h4");
        estadoText.classList.add("estado-producto");
        if (this.activo) {
            estadoText.textContent = "Activado";
        } else {
            estadoText.textContent = "Desactivado";
        }
        // Contenedor para switch + estado en texto
        const contenedorSwitch = document.createElement("div");
        contenedorSwitch.classList.add("switch-container");
        contenedorSwitch.append(toggleEstadoProducto, estadoText);

        // Armar estructura del switch
        toggleEstadoProducto.appendChild(toggleCheckbox);
        toggleEstadoProducto.appendChild(toggleDeslizador);

        // Evento que se dispara al cambiar el estado del switch
        toggleCheckbox.addEventListener("change", async () => {
            this.activo = toggleCheckbox.checked;

            if (this.activo) {
                estadoText.textContent = "Activado";
            } else {
                estadoText.textContent = "Desactivado";
            }

            if (await this.editarProducto()) {
                document.dispatchEvent(new Event("productosActualizados"));
            }
        });

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btnEditar");

        const btnBorrar = document.createElement("button");
        btnBorrar.textContent = "Borrar";
        btnBorrar.classList.add("btnBorrar");

        btnEditar.addEventListener("click", () => {
            import(MAINJS).then(module => {
                module.abrirModalEditar(this);
            });
        });

        btnBorrar.addEventListener("click", async () => {
            const confirmado = await mostrarModalConfirmacion();

            if (confirmado) {
                if (await this.eliminarProducto()) {
                    document.dispatchEvent(new Event("productosActualizados"));
                    console.log("producto Eliminado")
                }    
            }
        });

        const footer = document.createElement("div");
        footer.classList.add("card-footer");
        footer.append(btnEditar, btnBorrar);

        card.append(img, datosContainer, contenedorSwitch, footer);

        console.log(this.categoria)
        return card;
    }

    // GET
    static async traerProductos(categoria = "remeras") {
        try {
            const res = await fetch(Producto.endpoint(categoria));
            if (!res.ok) throw new Error("Error al traer productos");
            const data = await res.json();

            return data.map(p => new Producto(p));

        } catch (err) {
            console.error("Error al traer productos:", err);
            return [];
        }
    }
}
