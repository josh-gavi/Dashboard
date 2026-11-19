# Desarrollo y comprobación de las guías 08 a 11

## Guía 08: estructura, API y componentes

La base recibida ya tenía Vite, React, TypeScript, MUI, `HeaderUI` y `AlertUI`. Se completó el dashboard sin sustituir su arquitectura. `Grid` distribuye 12 columnas; el selector usa 3 y los indicadores 9 en escritorio. Gráfico y tabla usan 6 cada uno y se ocultan en móvil mediante `sx`. `HeaderUI` presenta un encabezado semántico `h1`. `AlertUI` recibe descripción, severidad y variante con valores predeterminados; la alerta conserva el texto estático del ejemplo final de la guía 11.

| Elemento de Open-Meteo | Descripción / uso |
| --- | --- |
| Entrada | `latitude`, `longitude`, `current`, `hourly`, `timezone`, `forecast_days` |
| `current` | Objeto con la lectura actual y su hora |
| `current_units` | Unidades que se muestran junto a cada indicador |
| `hourly` | Arreglos paralelos de horas y mediciones |
| `daily` | Máximos, mínimos e índice UV por día; explorados en la guía 08, no requeridos por la implementación final de la guía 11 |
| Respuesta | JSON con coordenadas, zona horaria, elevación y las variables solicitadas |
| `weather_code` | Código WMO para el estado del cielo; no es una temperatura ni un texto descriptivo |
| Error | HTTP no exitoso y objeto con `error` y `reason`; debe mostrarse un mensaje legible |

Clima actual corresponde a `current.temperature_2m`, `relative_humidity_2m` y opcionalmente `weather_code`. Evolución corresponde a series de `hourly`; la guía final utiliza temperatura y viento. Pronóstico extendido corresponde a `daily.temperature_2m_max`, `temperature_2m_min` y `uv_index_max`. Las unidades se toman de la respuesta, sin asumirlas al renderizar.

React convierte componentes con nombre en mayúscula a elementos de la interfaz; los atributos JSX se reciben en un objeto de props. TypeScript comprueba las interfaces durante el desarrollo, pero no valida JSON en ejecución: por eso se agregó `parseWeatherResponse`. Emotion proporciona el motor de estilos usado por MUI. `sx` permite estilos y puntos de ruptura coherentes sin duplicar componentes. Las interfaces se importan con `import type` porque no son valores en ejecución.

## Guía 09: eventos y useState

`FormControl` agrupa el campo, `InputLabel` le da su etiqueta, `Select` controla el valor y `MenuItem` define cada opción. El evento es `SelectChangeEvent<string>`. `handleChange` extrae `event.target.value`, actualiza `cityInput` y notifica al padre. Una variable ordinaria no provoca un nuevo render; el setter de `useState` sí solicita la actualización. La desestructuración obtiene el valor actual y su función de actualización. `cityInput && ...` muestra el texto auxiliar solo cuando existe una selección.

Como en la solución de la guía 11, el selector inicia vacío y el hook consulta Guayaquil mientras selectedOption es null. Las cuatro opciones conservan los identificadores y coordenadas de las guías.

## Guía 10: interfaces, useEffect y consulta

`DashboardTypes.ts` separa `OpenMeteoResponse`, `CurrentUnits` y `Current`; en la guía 11 se agregan `HourlyUnits` y `Hourly`. Un indicador se reutiliza cuatro veces con props distintas. La aplicación se monta desde `main.tsx` en `#root`, sin un tema MUI personalizado.

El hook realiza una petición asincrónica dentro del efecto. El callback del efecto no es `async` porque debe devolver una función de limpieza, no una promesa. La dependencia cambia al elegir una ciudad o reintentar. Omitir dependencias ejecutaría el efecto después de cada render; `[]` solo serviría para una consulta fija al montar. La actualización de estado con la respuesta provoca el render con datos reales.

## Guía 11: visualización y comunicación

`App` es el ancestro común del selector, indicadores, tabla y gráfico. Mantiene `selectedOption`; el selector invoca `onOptionSelect`, y el padre pasa la selección a `useFetchData`. La respuesta se distribuye a los componentes mediante props. Esto evita Context o un gestor global para un estado que solo se comparte en una pantalla.

`CITY_COORDS` centraliza las cuatro coordenadas. Para otra ciudad hay que añadir su configuración y su opción de selección. Los identificadores desconocidos se rechazan con un error controlado. La URL solicita un día en `America/Guayaquil`; cada etiqueta conserva solo `HH:mm`, sin reinterpretarla en la zona horaria del navegador.

La tabla y el gráfico reciben los mismos arreglos. El índice relaciona cada hora con temperatura y viento. `DataGrid` requiere un identificador por fila y utiliza cinco filas por página. Las columnas conservan el ancho de 160 px del ejemplo. `LineChart` muestra dos series con etiquetas que incluyen unidades: se comparan sus tendencias, sin interpretar temperatura y velocidad como magnitudes equivalentes. Ambos componentes son Community y no requieren una clave Pro o Premium.

La carga se indica con `CircularProgress`; un fallo HTTP se detecta con `respuesta.ok`, porque `fetch` no rechaza automáticamente los códigos 4xx/5xx. Un fallo de conexión, una respuesta incompleta o una espera de más de 15 segundos muestran un error; para otra consulta se selecciona una ciudad. Al cambiar de ciudad se cancela la consulta anterior con `AbortController` y se ocultan inmediatamente sus datos. La limpieza también cubre desmontajes y la comprobación adicional de efectos de `StrictMode` en desarrollo.

Los valores nulos de series horarias se conservan como huecos, sin convertirlos en cero. Las pruebas verifican coordenadas, parámetros, ciudades inválidas, unidades, series alineadas y datos incompletos.

## Versionado y publicación

La entrega conserva una etapa inicial y commits de selector, indicadores y visualización. A petición del propietario, se inicia un historial independiente bajo su identidad Git; el historial heredado se guarda en un respaldo local `.bundle` antes de reemplazar las referencias remotas. La procedencia del código base se reconoce en el README.

Se trabaja en la rama `desarrollo`, se integra a `main` mediante pull request y se publica en GitHub Pages. El workflow valida lint, pruebas y compilación antes de desplegar. `base` y `homepage` usan la ruta exacta `/Dashboard/`. La configuración de Codespaces conserva Node.js 24 y el puerto 5173.

## Demostración para la entrega

1. Abrir la URL pública y comprobar que el selector está vacío y se consulta Guayaquil por defecto, como en la guía 11.
2. Elegir Quito, Manta y Cuenca; comprobar que todos los indicadores, el gráfico y la tabla cambian juntos.
3. Comparar las primeras horas de la tabla con el tooltip del gráfico y con el JSON de Network.
4. Cambiar de ciudad rápidamente y comprobar que no aparecen respuestas de una selección anterior.
5. Desconectar la red y cambiar de ciudad para observar el error; restaurar la red y seleccionar otra ciudad.

6. Reducir la ventana a menos de 900 px para comprobar la distribución y la ocultación de tabla y gráfico.
7. Revisar Actions para ver la validación y el despliegue de `main`.

Las comprobaciones de interacción visual requieren un navegador. No se presentan como realizadas si el entorno no permite controlarlo. Los ejercicios temporales de las guías (latitud inválida, eliminación de dependencias del efecto, datos estáticos y variables sin estado) son experimentos de aprendizaje y no se conservan como fallos en la aplicación final. La documentación describe el código final y la asistencia utilizada; las reflexiones personales de la asignatura deben expresarse con las palabras del estudiante.

## Ajuste de fidelidad a la guía

La presentación se ajustó al App de la solución final de la guía 11 (páginas 23 y 24), al HeaderUI de la guía 08 y al IndicatorUI de la guía 10. Se retiraron Container, Paper, el pie personalizado, los textos agregados, el tema de colores, los bordes personalizados, los colores de series y el título agregado sobre la tabla. Se conservaron las dimensiones, los textos, la paginación y la distribución especificados por las guías. La alerta conserva el texto estático «No se prevén lluvias» del ejercicio. Las columnas de la tabla usan 160 px cada una. No hay botón de reintento ni tema personalizado en la interfaz; la cancelación y validación de respuestas permanecen como protección interna.
