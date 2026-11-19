# Dashboard del Clima

Dashboard de Joshua Mero para Desarrollo de Aplicaciones Web y Móviles. Implementación de las guías 08, 09, 10 y 11 con React, TypeScript, Vite, Material UI y MUI X.

**Aplicación:** https://josh-gavi.github.io/Dashboard/

**Repositorio:** https://github.com/josh-gavi/Dashboard

## Funcionalidades

- Selección de Guayaquil, Quito, Manta y Cuenca con eventos y `useState`.
- Consulta real a Open-Meteo mediante el hook personalizado `useFetchData` y `useEffect`.
- Indicadores de temperatura a 2 m, temperatura aparente, viento y humedad relativa.
- Gráfico de líneas y tabla paginada de temperatura y viento por hora con MUI X Community.
- Comunicación hijo → padre mediante `onOptionSelect`; datos del padre → hijos mediante props tipadas.
- Indicador de carga y mensajes de error HTTP o de conexión, como en la guía 11.
- Cancelación de consultas anteriores al cambiar de ciudad; nunca se presentan datos de otra ciudad como actuales.
- Diseño responsivo. El gráfico y la tabla se ocultan por debajo de 900 px, como establece la guía 08.

## Desarrollo local y Codespaces

Requiere Node.js 24 o superior. Codespaces instala las dependencias con la configuración de `.devcontainer`.

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Abre el puerto 5173 y la ruta `/Dashboard/`. Las coordenadas, variables y zona horaria se configuran en `src/utils/weather.ts`. No se necesita clave de API.

```sh
npm run lint
npm test
npm run build
npm run preview -- --host 0.0.0.0
```

En Windows PowerShell con restricciones de scripts se puede usar `npm.cmd`.

## Publicación en GitHub Pages

Cada actualización de `main` ejecuta `.github/workflows/deploy.yml`: instalación reproducible, lint, pruebas, compilación y despliegue en GitHub Pages. Los pull requests ejecutan la validación sin publicar.

En **Settings → Pages → Build and deployment**, la fuente es **GitHub Actions**. También se puede publicar desde **Actions → Validar y desplegar dashboard → Run workflow**.

Desde Codespaces con GitHub CLI autenticado:

```sh
npm run deploy
```

Ese comando compila localmente y solicita el workflow de publicación de `main`; publica el código que ya está guardado en GitHub. Primero confirma y sube tus cambios. La publicación usa la ruta `/Dashboard/`, respetando las mayúsculas del repositorio.

El comando original de la guía se conserva como `npm run deploy:legacy`: genera la rama `gh-pages`. Solo debe usarse si se cambia explícitamente la fuente de Pages a **Deploy from a branch → gh-pages → / (root)**. El flujo activo de esta entrega es GitHub Actions.

## Organización

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.tsx` | Estado compartido de ciudad y distribución de los componentes |
| `src/components/SelectorUI.tsx` | Selección controlada, evento `onChange` y callback al padre |
| `src/components/IndicatorUI.tsx` | Tarjeta reutilizable con título y valor |
| `src/components/ChartUI.tsx` | Dos series horarias en `LineChart` |
| `src/components/TableUI.tsx` | Las mismas series en `DataGrid`, cinco filas por página |
| `src/hooks/useFetchData.ts` | Consulta, carga, errores, cancelación y reintento |
| `src/types/DashboardTypes.ts` | Interfaces de datos actuales, unidades y series por hora |
| `src/utils/weather.ts` | Coordenadas, URL y validación de la respuesta |

La presentación conserva el ejemplo final de la guía 11: encabezado h2, Grid con espaciado de 5, cuatro tarjetas, gráfico de 300 px y tabla de 350 px. Se restauraron los estilos de la base inicial y se retiraron el tema personalizado y los textos adicionales. La alerta «No se prevén lluvias» es el texto estático del ejercicio, no una conclusión calculada con la API.

El detalle de las etapas, decisiones y comprobaciones está en [docs/desarrollo.md](docs/desarrollo.md).

## Procedencia y créditos

Proyecto mantenido por Joshua Mero en un repositorio independiente. La estructura inicial proviene de [FuentesElkin/Dashboard](https://github.com/FuentesElkin/Dashboard); el desarrollo posterior completa las guías de la asignatura. Se conserva este reconocimiento al iniciar un historial independiente. La implementación de esta actualización contó con asistencia de Codex.

Guías de la asignatura: [08](https://dawm3.readthedocs.io/es/latest/recursos/guias/guia08.html), [09](https://dawm3.readthedocs.io/es/latest/recursos/guias/guia09.html), [10](https://dawm3.readthedocs.io/es/latest/recursos/guias/guia10.html), [11](https://dawm3.readthedocs.io/es/latest/recursos/guias/guia11.html).

Datos meteorológicos: [Open-Meteo](https://open-meteo.com/), con atribución según [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Componentes: [Material UI](https://mui.com/material-ui/) y [MUI X Community](https://mui.com/x/).
