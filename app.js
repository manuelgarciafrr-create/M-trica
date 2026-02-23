// 1. SEGURIDAD ADMIN
if (window.location.pathname.includes("admin.html")) {
    const miClaveSecreta = "1234";
    if (sessionStorage.getItem("admin_autenticado") !== "true") {
        const passwordEntrada = prompt("MÉTRICA ADMIN - Ingrese Clave:");
        if (passwordEntrada === miClaveSecreta) {
            sessionStorage.setItem("admin_autenticado", "true");
        } else {
            window.location.href = "index.html";
        }
    }
}

// 2. CATÁLOGO DE PRODUCTOS (Modifica aquí tus fotos)
const PRODUCTOS_DATA = [
    {
        id: 1,
        nombre: "CAMISETA OVERSIZE MÉTRICA FRAGMENT",
        precio: "20",
        imagenes: ["imagenes/fragmentdelante.png", "imagenes/fragmentdetras.png"], 
        colores: ["Negro", "Blanco"],
        tallas: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        nombre: "CAMISETA OVERSIZE MÉTRICA AURA VISUAL",
        precio: "20",
        imagenes: ["imagenes/auradelante.png", "imagenes/auradetras.png"],
        colores: ["Negro", "Blanco" ,"Gris"],
        tallas: ["S", "M", "L", "XL"]
    }
];

// 3. FUNCIÓN PARA CAMBIAR IMAGEN (BOTONES Y DESLIZAR)
window.cambiarImagen = function(id, direccion) {
    const imgElement = document.getElementById(`img-${id}`);
    const p = PRODUCTOS_DATA.find(item => item.id === id);
    if (!p || !imgElement) return;

    // Extrae solo el nombre del archivo para comparar
    const actualSrc = imgElement.src.split('/').pop();
    let index = p.imagenes.findIndex(img => img.includes(actualSrc));

    index += direccion;
    if (index >= p.imagenes.length) index = 0;
    if (index < 0) index = p.imagenes.length - 1;

    imgElement.src = p.imagenes[index];
};

// 4. WHATSAPP
window.comprarProducto = function(id) {
    const p = PRODUCTOS_DATA.find(item => item.id === id);
    const color = document.getElementById(`color-${id}`).value;
    const talla = document.getElementById(`talla-${id}`).value;
    const miTelefono = "584120361856";

    const mensaje = encodeURIComponent(
        `Hola MÉTRICA! Quiero comprar:\n- ${p.nombre}\n- Color: ${color}\n- Talla: ${talla}\n- Precio: $${p.precio}`
    );
    window.open(`https://wa.me/${miTelefono}?text=${mensaje}`, '_blank');
};

// 5. RENDERIZAR TIENDA (Genera el HTML y activa el touch)
function renderizar(productosAMostrar = PRODUCTOS_DATA) {
    const contenedor = document.getElementById('contenedor-productos') || document.querySelector('.grid-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    productosAMostrar.forEach(p => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="contenedor-deslizable" id="area-${p.id}" style="position: relative; width: 100%; height: 400px; overflow: hidden; background: #111;">
                <button class="btn-nav flecha-izq" onclick="cambiarImagen(${p.id}, -1)" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px 10px; cursor: pointer;">&#10094;</button>
                <img src="${p.imagenes[0]}" id="img-${p.id}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                <button class="btn-nav flecha-der" onclick="cambiarImagen(${p.id}, 1)" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px 10px; cursor: pointer;">&#10095;</button>
            </div>
            <h3>${p.nombre}</h3>
            <p class="precio">$${p.precio}</p>
            <div class="selectores" style="display: flex; gap: 10px; padding: 10px;">
                <select id="color-${p.id}" style="flex: 1; background: #000; color: #fff; border: 1px solid #333; padding: 5px;">
                    ${p.colores.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <select id="talla-${p.id}" style="flex: 1; background: #000; color: #fff; border: 1px solid #333; padding: 5px;">
                    ${p.tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
            </div>
            <button class="btn-comprar" onclick="comprarProducto(${p.id})" style="width: 80%; margin: 10px auto; background: #fff; color: #000; border: none; padding: 10px; font-weight: bold; cursor: pointer;">COMPRAR</button>
        `;
        contenedor.appendChild(div);

        const areaTouch = div.querySelector(`#area-${p.id}`);
        let xInicial = null;
        areaTouch.addEventListener('touchstart', (e) => { xInicial = e.touches[0].clientX; }, {passive: true});
        areaTouch.addEventListener('touchend', (e) => {
            if (!xInicial) return;
            let xFinal = e.changedTouches[0].clientX;
            let dif = xInicial - xFinal;
            if (Math.abs(dif) > 40) { cambiarImagen(p.id, dif > 0 ? 1 : -1); }
            xInicial = null;
        }, {passive: true});
    });
}

// ============================================================
// 6. LÓGICA DEL BUSCADOR (NUEVO CAMBIO)
// ============================================================
function iniciarBuscador() {
    const inputBuscador = document.getElementById('buscador');
    if (!inputBuscador) return;

    inputBuscador.addEventListener('input', (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = PRODUCTOS_DATA.filter(p => 
            p.nombre.toLowerCase().includes(busqueda)
        );
        renderizar(filtrados);
    });
}

// Inicialización corregida
document.addEventListener('DOMContentLoaded', () => {
    renderizar();
    iniciarBuscador();
});