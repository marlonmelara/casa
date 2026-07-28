/* ============================================================================
   DATOS DE LAS DIAPOSITIVAS (extraídos de <template data-slide> en HTML)
   ============================================================================ */
const slides = Array.from(document.querySelectorAll("[data-slide]")).map((template) => ({
  codigo: template.dataset.codigo,
  navTitulo: template.dataset.titulo,
  layout: template.dataset.layout || "",
  densidad: template.dataset.densidad || "",
  html: template.innerHTML,
}));

/* ============================================================================
   ESTADO Y REFERENCIAS DEL DOM
   ============================================================================ */
let indiceActual = 0;
let fontScaleActual = 1;
const sidebar = document.getElementById("sidebar");
const btnMenu = document.getElementById("btnMenu");
const btnCerrarSidebar = document.getElementById("btnCerrarSidebar");
const listaSlides = document.getElementById("listaSlides");
const contenedorSlide = document.getElementById("contenedorSlide");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const progresoFill = document.getElementById("progresoFill");
const progresoTexto = document.getElementById("progresoTexto");

/* ============================================================================
   CONSTRUCCIÓN DEL MENÚ LATERAL
   ============================================================================ */
function construirMenu() {
  listaSlides.innerHTML = "";
  slides.forEach((slide, indice) => {
    const li = document.createElement("li");
    const boton = document.createElement("button");
    boton.className = "sidebar__item";
    boton.type = "button";
    boton.setAttribute("data-indice", indice);
    boton.innerHTML = `<span class="sidebar__codigo">${slide.codigo}</span><span>${slide.navTitulo}</span>`;
    boton.addEventListener("click", () => irASlide(indice));
    li.appendChild(boton);
    listaSlides.appendChild(li);
  });
}

/* ============================================================================
   RENDERIZADO DE LA DIAPOSITIVA ACTIVA
   ============================================================================ */
function renderizarSlide() {
  const slideActual = slides[indiceActual];
  contenedorSlide.innerHTML = slideActual.html;

  const nodoSlide = contenedorSlide.querySelector(".slide");
  if (nodoSlide) {
    nodoSlide.classList.remove("slide--saliendo-izq", "slide--saliendo-der");
    if (slideActual.layout) {
      contenedorSlide.setAttribute("data-layout", slideActual.layout);
    }
    if (slideActual.densidad) {
      nodoSlide.setAttribute("data-densidad", slideActual.densidad);
    }
    // Detección de overflow para QA
    requestAnimationFrame(() => {
      if (nodoSlide.scrollHeight > nodoSlide.clientHeight + 2) {
        nodoSlide.classList.add("slide--overflow");
      } else {
        nodoSlide.classList.remove("slide--overflow");
      }
    });
  }

  document.querySelectorAll(".sidebar__item").forEach((item, indice) => {
    item.classList.toggle("sidebar__item--activo", indice === indiceActual);
  });

  const itemActivo = document.querySelector(".sidebar__item--activo");
  if (itemActivo) {
    itemActivo.scrollIntoView({ block: "nearest" });
  }

  btnAnterior.disabled = indiceActual === 0;
  btnSiguiente.disabled = indiceActual === slides.length - 1;

  const porcentaje = ((indiceActual + 1) / slides.length) * 100;
  progresoFill.style.width = porcentaje + "%";
  progresoTexto.textContent =
    String(indiceActual + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");

  if (nodoSlide) nodoSlide.style.setProperty("--font-scale", fontScaleActual);
  configurarLightboxEnSlide();
}

/* ============================================================================
   NAVEGACIÓN
   ============================================================================ */
function irASlide(nuevoIndice) {
  if (nuevoIndice < 0 || nuevoIndice >= slides.length) return;
  if (nuevoIndice === indiceActual) return;
  indiceActual = nuevoIndice;
  renderizarSlide();
}

function siguienteSlide() {
  irASlide(indiceActual + 1);
}
function anteriorSlide() {
  irASlide(indiceActual - 1);
}

btnSiguiente.addEventListener("click", siguienteSlide);
btnAnterior.addEventListener("click", anteriorSlide);

document.addEventListener("keydown", (evento) => {
  if (evento.key === "ArrowRight") siguienteSlide();
  if (evento.key === "ArrowLeft") anteriorSlide();
});

/* ---- Navegación por gestos táctiles (swipe) ---- */
let toqueInicioX = null;
const UMBRAL_SWIPE = 50;

document.getElementById("escenario").addEventListener(
  "touchstart",
  (evento) => {
    toqueInicioX = evento.changedTouches[0].clientX;
  },
  { passive: true },
);

document.getElementById("escenario").addEventListener("touchend", (evento) => {
  if (toqueInicioX === null) return;
  const toqueFinX = evento.changedTouches[0].clientX;
  const delta = toqueFinX - toqueInicioX;

  if (Math.abs(delta) > UMBRAL_SWIPE) {
    if (delta < 0) siguienteSlide();
    else anteriorSlide();
  }
  toqueInicioX = null;
});

/* ============================================================================
   TOGGLE DEL MENÚ LATERAL
   Estado "abierto" = sidebar visible. El ícono muestra una "X" cuando el
   menú está abierto (invita a cerrarlo) y tres barras cuando está oculto.
   ============================================================================ */
function actualizarEstadoBotonMenu(sidebarVisible) {
  btnMenu.classList.toggle("btn-menu--activo", sidebarVisible);
  btnMenu.classList.toggle("btn-menu--con-sidebar", sidebarVisible);
  btnMenu.setAttribute("aria-expanded", String(sidebarVisible));
}

function alternarSidebar() {
  const oculto = sidebar.classList.toggle("sidebar--oculto");
  actualizarEstadoBotonMenu(!oculto);
}

btnMenu.addEventListener("click", alternarSidebar);
btnCerrarSidebar?.addEventListener("click", alternarSidebar);

/* ============================================================================
   CONTROL DE TAMAÑO DE LETRA
   ============================================================================ */
const ZOOM_STEP = 0.1;
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.6;

function ajustarZoom(delta) {
  fontScaleActual = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, fontScaleActual + delta));
  const slide = document.querySelector(".slide");
  if (slide) slide.style.setProperty("--font-scale", fontScaleActual);
}

document.getElementById("btnLetraMas")?.addEventListener("click", () => ajustarZoom(ZOOM_STEP));
document.getElementById("btnLetraMenos")?.addEventListener("click", () => ajustarZoom(-ZOOM_STEP));

/* ============================================================================
   DARK MODE
   ============================================================================ */
const STORAGE_THEME_KEY = "presentacion-theme";

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem(STORAGE_THEME_KEY, tema);
  const btn = document.getElementById("btnModo");
  if (btn) btn.textContent = tema === "dark" ? "☀" : "☾";
}

function alternarTema() {
  const actual = document.documentElement.getAttribute("data-theme");
  aplicarTema(actual === "dark" ? "light" : "dark");
}

document.getElementById("btnModo")?.addEventListener("click", alternarTema);

/* ============================================================================
   LIGHTBOX
   ========================================================================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCerrar = document.getElementById("lightboxCerrar");

function abrirLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("lightbox--activo");
}

function cerrarLightbox() {
  lightbox.classList.remove("lightbox--activo");
  lightboxImg.src = "";
  lightboxImg.alt = "";
}

lightboxCerrar.addEventListener("click", cerrarLightbox);

lightbox.addEventListener("click", (evento) => {
  if (evento.target === lightbox) cerrarLightbox();
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarLightbox();
});

function configurarLightboxEnSlide() {
  contenedorSlide.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      abrirLightbox(img.src, img.alt);
    });
  });
}

/* ============================================================================
   INICIALIZACIÓN
   ============================================================================ */
const temaGuardado = localStorage.getItem(STORAGE_THEME_KEY);
if (temaGuardado) aplicarTema(temaGuardado);
construirMenu();
renderizarSlide();
