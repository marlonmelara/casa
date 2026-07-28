# casa

Boilerplate moderno para proyectos web pequeños con HTML, CSS y JavaScript. Estructura BEM, herramientas Rust-fast, y desarrollo local rápido.

## 📁 Estructura de Carpetas

```
casa/
├── src/
│   ├── index.html
│   ├── index.js
│   └── css/
│       ├── base.css      (reset, tipografía global)
│       └── style.css     (componentes específicos)
└── .vscode/             (configuración del editor)
```

## 📦 Dependencias

- **[servor](https://github.com/lukejacksonn/servor)**: Servidor local sin dependencias
- **[oxlint](https://oxc.rs/) & oxfmt**: Linter y formateador ultra-rápido (Rust)
- **[stylelint](https://stylelint.io/)**: Linter CSS con BEM y ordenamiento de propiedades

## 🚀 Comandos

| Comando | Descripción |
|---------|------------|
| `pnpm dev` | Inicia servidor local (puerto 1234) |
| `pnpm lint` | Valida JS y CSS sin cambios |
| `pnpm lint:all` | Autoformatea JS, CSS y ordena propiedades |
| `pnpm lint:js:fix` | Autoformatea solo JavaScript |
| `pnpm lint:css:fix` | Autoformatea solo CSS |

## ⚙️ Configuración

- **CSS**: Ordenamiento de propiedades por categoría (posición → display → dimensiones → tipografía → efectos)
- **BEM**: Nomenclatura de clases validada con Stylelint
- **VS Code**: Auto-formateo al guardar

---

**Creado con ❤️ para estudiantes y bootcampers**
