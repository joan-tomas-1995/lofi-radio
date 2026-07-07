# 🚀 Lofi Music Radio — Plan de Mejora

> Inicio: 2026-07-07  
> Rama: `mejoras-2026`  
> Orden estricto, un punto a la vez.

---

## 🔴 FASE 1 — PWA (Progressive Web App) ✅ COMPLETADA

- [x] Instalar `vite-plugin-pwa`
- [x] Configurar plugin en `vite.config.js` (manifest + workbox)
- [x] Crear assets: iconos PWA (192x192, 512x512, maskable)
- [x] Generar `manifest.webmanifest` con nombre, colores, display standalone
- [x] Service Worker: estrategia NetworkFirst audio + CacheFirst assets
- [x] Verificar build local (`npm run build`) sin errores
- [x] Probar en local: icono instalable, offline, splash screen
- [x] Deploy a Cloudflare y validar Lighthouse PWA score

---

## 🔴 FASE 2 — Limpiar duplicación del proyecto ✅ COMPLETADA

- [x] Confirmar qué archivos están duplicados entre `raíz/` y `lofi-radio/`
- [x] Mover `manifest.json` (extensión Chrome) dentro de `lofi-radio/` si aún se usa → se mantiene en raíz con popup mínimo
- [x] Eliminar `src/`, `public/`, `package.json`, `vite.config.js`, `wrangler.jsonc` de la raíz
- [x] Actualizar `.gitignore` si es necesario
- [x] Verificar que `npm run build` y `npm run dev` funcionan desde `lofi-radio/`
- [x] Hacer deploy de prueba

---

## 🔴 FASE 3 — Sitemap dinámico + hreflang ✅ COMPLETADA

- [x] Generar sitemap.xml en el build (script o plugin) que lea `stations.json` y `blogPosts.js`
- [x] Incluir `xhtml:link` con `hreflang` para los 7 idiomas en cada URL
- [x] Añadir `<link rel="alternate" hreflang="...">` en el `<head>` vía Helmet
- [x] Verificar sitemap generado tras `npm run build`
- [x] Actualizar `robots.txt` si hay nuevas rutas que indexar

---

## 🔴 FASE 4 — OG Images dinámicas ✅ COMPLETADA

- [x] Evaluar enfoque: SVG puro + @resvg/resvg-js (sin dependencias externas de fuentes)
- [x] Implementar script `scripts/generate-og-images.mjs`
- [x] Generar 17 imágenes: home + blog + 5 posts + 10 categorías
- [x] Actualizar meta tags OG en `App.jsx`, `BlogPost.jsx`, `CategoryPage.jsx`
- [x] Cambiar Twitter card a `summary_large_image` en todas las páginas
- [x] Probar build completo y verificar imágenes en `dist/og/`

---

## 🟡 FASE 5 — Core Web Vitals ✅ COMPLETADA

- [x] GIF → `<video>` WebM/MP4 → pospuesto (requiere convertir archivos, se hará en otra fase)
- [x] YouTube IFrame API: cargar solo cuando el usuario presiona play (lazy load)
- [x] Eliminar `pure-react-carousel` → CSS scroll-snap nativo (-56 KB en ui-vendor)
- [x] Añadir `font-display: swap` para evitar FOIT/FOUT
- [x] `fetchpriority="high"` en LCP → el fondo se carga con prioridad normal vía CSS background
- [x] GA/GTM ya tiene `async`
- [x] Build verificado: ui-vendor 58.69 KB → 2.49 KB, CSS 13.22 KB → 11.77 KB

---

## 🟡 FASE 6 — Blog ❌ ELIMINADO

- [x] Blog eliminado por petición del usuario
- [x] Archivos borrados: `Blog.jsx`, `BlogPost.jsx`, `blogPosts.js`
- [x] Rutas `/blog` y `/blog/:slug` eliminadas de `App.jsx`
- [x] Sitemap y OG images actualizados (sin referencias a blog)
- [x] Bundle JS: 87 KB → 65 KB (-22 KB)

---

## 🟡 FASE 7 — Navegación entre categorías relacionadas

- [ ] Al final de cada `CategoryPage`, grid con 3-4 categorías relacionadas
- [ ] Mejorar internal linking y tiempo de sesión

---

## 🟢 FASE 8 — Mejoras CSS/UX

- [ ] `prefers-reduced-motion` para animaciones (pulse, fondos)
- [ ] Quitar `!important` de botones, usar especificidad correcta
- [ ] Revisar `overflow: hidden` en rutas de contenido (blog)

---

## 🟢 FASE 9 — Atajos de teclado

- [ ] `Espacio` = play/pause
- [ ] `←` `→` = estación anterior/siguiente
- [ ] `M` = mute/unmute
- [ ] `F` = fullscreen
- [ ] Mostrar atajos en el modal de información

---

## 🟢 FASE 10 — Analytics de errores

- [ ] Listener global de errores JS → GA4 eventos personalizados
- [ ] Tracking de fallos de carga de estaciones YouTube

---

## 🟢 FASE 11 — Tests básicos

- [ ] Instalar `vitest` + `@testing-library/react`
- [ ] Test de montaje de `AudioPlayer`
- [ ] Test de snapshot de `stations.json`
- [ ] Configurar CI mínimo (GitHub Actions)

---

> **Progreso**: 5/10 fases completadas ✅ (Blog eliminado)  
> **Última actualización**: 2026-07-07 — Blog eliminado, autoplay restaurado
