const weatherForm = document.getElementById("weather-form");
const weatherResult = document.getElementById("weather-result");

const WEATHER_CODES_ES = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada fuerte",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  66: "Lluvia helada ligera",
  67: "Lluvia helada fuerte",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve fuerte",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos fuertes",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve fuertes",
  95: "Tormenta",
  96: "Tormenta con granizo débil",
  99: "Tormenta con granizo fuerte",
};

function describeWeather(code) {
  return WEATHER_CODES_ES[code] ?? `Código de clima ${code}`;
}

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  weatherResult.innerHTML = "";

  const city = document.getElementById("city").value.trim();
  if (!city) {
    weatherResult.innerHTML = `<div class="error">Por favor, escribe una ciudad.</div>`;
    return;
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=es&format=json`;

    const geoResp = await fetch(geoUrl);
    if (!geoResp.ok) throw new Error("No se pudo geocodificar la ciudad.");
    const geoData = await geoResp.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherResult.innerHTML = `<div class="error">No se encontró la ciudad: <b>${city}</b>.</div>`;
      return;
    }
    const place = geoData.results[0];
    const {
      latitude,
      longitude,
      name,
      country,
      admin1 
    } = place;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,weather_code&timezone=auto`;

    const weatherResp = await fetch(weatherUrl);
    if (!weatherResp.ok) throw new Error("No se pudo obtener el clima actual.");
    const weatherData = await weatherResp.json();

    const temp = weatherData?.current?.temperature_2m;
    const code = weatherData?.current?.weather_code;
    const timeISO = weatherData?.current?.time; 

    if (typeof temp !== "number" || typeof code !== "number") {
      throw new Error("Respuesta de clima incompleta.");
    }

    const desc = describeWeather(code);


    const locationLine = [name, admin1, country].filter(Boolean).join(", ");
    const updated =
      timeISO ? new Date(timeISO).toLocaleString(undefined, { hour12: false }) : "";

    weatherResult.innerHTML = `
      <div class="card-out">
        <h3>${locationLine}</h3>
        <p class="big">${temp.toFixed(1)} °C</p>
        <p>${desc}</p>
        ${updated ? `<p class="muted">Actualizado: ${updated}</p>` : ""}
      </div>
    `;
  } catch (err) {
    console.error(err);
    weatherResult.innerHTML = `<div class="error">Ocurrió un error: ${err.message}</div>`;
  }
});
