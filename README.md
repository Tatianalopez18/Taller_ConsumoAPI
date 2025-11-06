# Clima por Ciudad (API Pública con fetch())

Proyecto sencillo para consumir una API pública de clima usando JavaScript, HTML y CSS. El usuario escribe una ciudad, el sistema busca su latitud/longitud (geocodificación) y luego consulta la temperatura actual y una descripción del clima.

**APIs usadas (sin API key):**

- Open-Meteo Geocoding API (buscar lat/lon por nombre de ciudad).
- Open-Meteo Forecast API (clima actual por lat/lon).

## 1) Objetivos de aprendizaje 

- Entender cómo hacer peticiones HTTP GET con fetch() y async/await.
- Convertir respuestas a JSON y extraer datos.
- Mostrar resultados en el DOM (HTML) de forma clara.
- Manejar errores (ciudad no encontrada, red).
- Organizar un proyecto web estático y subirlo a Git.

## 2) Tecnologías y archivos

- HTML5: estructura de la página (index.html).
- CSS3: estilos con modo claro usando variables (styles.css).
- JavaScript: lógica de red y render (app.js).

**Estructura del proyecto:**


## 3) Cómo ejecutar en local

- doble clic a index.html.

## 4) Flujo de funcionamiento 

- El usuario escribe una ciudad y hace clic en Consultar clima.

**Con la Forecast API:**
→ recibo `temperature_2m` (°C) y `weather_code` (número).

- Convierto `weather_code` a texto (“Nublado”, “Lluvia”, etc.) y muestro todo en pantalla.

## 5) Código explicado (resumen)

### 5.1. Escuchar el formulario
const weatherForm = document.getElementById("weather-form");
const weatherResult = document.getElementById("weather-result");

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();
});

### 5.2. Geocodificación
 const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
const geoResp = await fetch(geoUrl);
const geoData = await geoResp.json();
const place = geoData.results[0]; // { latitude, longitude, name, country, ... }

### 5.3. Clima actual
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&timezone=auto`;
const weatherResp = await fetch(weatherUrl);
const weatherData = await weatherResp.json();

const temp = weatherData.current.temperature_2m; // número en °C
const code = weatherData.current.weather_code;   // ej: 3 = Nublado

### 5.4. Render en el DOM
weatherResult.innerHTML = `
  <div class="card-out">
    <h3>${place.name}, ${place.country ?? ""}</h3>
    <p class="big">${temp.toFixed(1)} °C</p>
    <p>${desc}</p>
  </div>
`;


