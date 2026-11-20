# Art Sneyder · Checklist para aparecer en Google

Estado al 18 de noviembre de 2026. Sitio: https://sneyder.netlify.app/

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Web publicada | ✅ Hecho (el sitio está en línea con la última versión) |
| 2 | robots.txt abierto | ✅ Hecho (`Allow: /` + línea `Sitemap:`) |
| 3 | Títulos con tu servicio | ✅ Hecho (título, descripción, Open Graph, canonical y datos estructurados) |
| 4 | Google Analytics | 🟡 Código listo y probado; falta pegar tu ID de medición (`G-XXXXXXXXXX`) |
| 5 | Search Console | 🟡 Archivo de verificación listo en publicar/ (google6f951a36450b4924.html); falta subir la carpeta a Netlify y pulsar VERIFICAR |
| 6 | Ficha de Google (Perfil de Empresa) | 🟡 Falta crearla (textos listos abajo) |

## 1–3. Ya hecho en el código
- **Título:** `Diseñador Gráfico en Bogotá | Branding, Video y Web – Art Sneyder`
- **Descripción:** diseñador gráfico en Bogotá, branding, motion graphics, video, fotografía y diseño web UX/UI.
- **Nombre del sitio para Google:** dato estructurado `WebSite` con el nombre "Art Sneyder" (antes Google mostraba solo la URL).
- `robots.txt` abierto, `sitemap.xml` publicado y enlace canónico a `https://sneyder.netlify.app/`.
- Si algún día cambias a dominio propio, hay que actualizar la URL canónica, `og:url`, el sitemap, el robots y los datos estructurados.

## 4. Google Analytics 4 (ya instalado)
Propiedad **Art Sneyder** (cuenta Art sneyder), flujo web https://sneyder.netlify.app, ID de medición **G-YKD8FQ7ZBR**. Los datos pueden tardar hasta 48 h en aparecer; para comprobarlo al instante: Analytics → Informes → Tiempo real, abre el sitio, pulsa **Aceptar** en el aviso y verás la visita.

Pasos originales:
1. Entra a https://analytics.google.com → Administrar → Crear → **Propiedad** ("Art Sneyder", zona horaria Bogotá, moneda COP).
2. Crea un **flujo de datos web** con la URL `https://sneyder.netlify.app/`.
3. Copia el **ID de medición** (empieza por `G-`) y pásamelo: lo pego en el sitio.
- Respeta la Ley 1581: no se carga nada hasta que la persona pulse "Aceptar" en el aviso de privacidad (hay botón "Solo lo esencial" y se puede cambiar en *Cookies y almacenamiento*). La IP se anonimiza y no se activan señales de Google ni anuncios. Mientras el ID esté vacío el sitio sigue sin analítica, y la política de privacidad se adapta sola al activarla.

## 5. Search Console (archivo de verificación ya creado)
**Ya está:** publicar/google6f951a36450b4924.html (el que pide Google). Súbelo a Netlify junto con el resto de la carpeta publicar y pulsa **VERIFICAR**. No lo borres después.

Pasos originales (por si hay que repetirlos):
1. Entra a https://search.google.com/search-console → **Agregar propiedad** → tipo **Prefijo de URL** → `https://sneyder.netlify.app/`.
2. Elige verificación **Etiqueta HTML** y copia la etiqueta `<meta name="google-site-verification" content="...">`, o pásame solo el código `content`; la agrego en el `<head>`.
3. Ya verificado: en **Sitemaps** agrega `sitemap.xml`, y en **Inspección de URL** pega la dirección del sitio y pulsa **Solicitar indexación**.
- Aparecer con el nombre "Art Sneyder" en vez de la URL puede tardar de días a unas semanas tras volver a rastrear.

## 6. Ficha de Google (Perfil de Empresa) — textos listos
Entra a https://business.google.com → **Agregar tu empresa**.
- **Nombre:** Art Sneyder – Diseñador Gráfico
- **Categoría principal:** Diseñador gráfico
- **Categorías adicionales:** Diseñador de sitios web · Servicio de fotografía · Servicio de edición de videos
- **Tipo de negocio:** empresa con **área de servicio** (sin atender público en un local) · Área: Bogotá, Colombia
- **Sitio web:** https://sneyder.netlify.app/
- **Teléfono / WhatsApp:** +57 311 811 3811
- **Descripción (≤ 750 caracteres):**
  > Diseñador gráfico en Bogotá con más de diez años de experiencia. Creo identidades de marca, piezas publicitarias, motion graphics, edición de video, fotografía comercial, contenido para redes sociales y sitios web UX/UI para marcas y empresas. Integro diseño, tecnología e inteligencia artificial para crear experiencias visuales de alto impacto. Mira el portafolio y solicita tu cotización por WhatsApp.
- **Servicios:** Branding e identidad corporativa · Diseño gráfico y material POP · Motion graphics y animación 2D · Edición de videos · Fotografía profesional · Social media · Diseño de páginas web
- **Horario:** el que tú definas (no lo invento).
- Google pedirá **verificar** la ficha (llamada, SMS, correo o video, según el caso): lo haces tú.
- Cuando la ficha exista, pásame su enlace y lo agrego a los datos estructurados (`sameAs`) y al botón de reseñas.

## Analytics: ajustes hechos en la cuenta (19 nov 2026)
- Conservación de datos de eventos: **14 meses** (antes 2).
- **Search Console vinculado** a la propiedad Art Sneyder.
- Eventos del sitio (solo con consentimiento): generate_lead, click_whatsapp, click_email, click_cta_contacto, iew_item. Llegan en Tiempo real.
- **Pendiente (24 h después de subir el sitio):** Analytics → Administrar → Eventos → pestaña *Eventos recientes* → marcar con la estrella **generate_lead** para que cuente como evento clave (conversión).
- Los primeros datos (1 usuario, unos pocos eventos) vienen de las pruebas locales; no son visitas reales.
