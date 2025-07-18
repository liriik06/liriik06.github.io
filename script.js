// Переменные
let finalLatitude = null;
let finalLongitude = null;
let isPlacingMarker = false;
let userMarker = null;
let testMarker = null;
let targetCircle = null;
let hasEnteredZone = false;
let zoneRadius = 500;

// Инициализация карты
const map = L.map("map").setView([55.75, 37.62], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Фейковая метка (одна и та же для теста и реального режима)
testMarker = L.marker([55.75, 37.62], { draggable: false })
  .addTo(map)
  .bindPopup("Тестовая позиция");

// === Универсальный обработчик координат ===
function handleLocationUpdate(lat, lng) {
  testMarker.setLatLng([lat, lng]);
  //map.setView([lat, lng], map.getZoom());
  testMarker.bindPopup("Вы тут").openPopup();

  if (targetCircle) {
    const distance = map.distance([lat, lng], targetCircle.getLatLng());
    const radius = targetCircle.getRadius();

    if (distance <= radius && !hasEnteredZone) {
      hasEnteredZone = true;
      document.getElementById("zone-alert").style.display = "block";
      const audio = document.getElementById("ping-sound");
      audio.currentTime = 0;
      audio.loop = true;
      audio.play().catch((err) => console.warn("sound can't play: ", err));
    } else if (distance > radius && hasEnteredZone) {
      hasEnteredZone = false;
    }
  }
}

// === Слушатели ползунков (ФАЛЬШИВЫЙ РЕЖИМ) ===
const latSlider = document.getElementById("lat-slider");
const lngSlider = document.getElementById("lng-slider");
const latValue = document.getElementById("lat-value");
const lngValue = document.getElementById("lng-value");

function syncSliders() {
  const lat = parseFloat(latSlider.value);
  const lng = parseFloat(lngSlider.value);
  latValue.textContent = lat.toFixed(5);
  lngValue.textContent = lng.toFixed(5);
  handleLocationUpdate(lat, lng);
}

/*// Активировать этот блок для фальшметки:
latSlider.addEventListener("input", syncSliders);
lngSlider.addEventListener("input", syncSliders);
syncSliders(); // первая отрисовка*/

// === Реальный режим (раскомментируй этот блок, если хочешь реальную геолокацию) ===
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      handleLocationUpdate(latitude, longitude);
    },
    (error) => {
      alert("Ошибка геолокации: " + error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
} else {
  alert("Геолокация не поддерживается в этом браузере.");
}

// === Кнопка "Поставить метку" (центр зоны) ===
document.getElementById("set-marker").addEventListener("click", () => {
  isPlacingMarker = true;
  alert("Поставьте маркер (кликните по карте)");
});

map.on("click", (e) => {
  if (!isPlacingMarker) return;

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  finalLatitude = lat;
  finalLongitude = lng;

  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    userMarker = L.marker([lat, lng]).addTo(map);
  }

  userMarker.bindPopup(`Центр зоны:<br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`).openPopup();

  if (targetCircle) {
    map.removeLayer(targetCircle);
  }

  targetCircle = L.circle([lat, lng], {
    radius: zoneRadius,
    color: "blue",
    fillColor: "#add8e6",
    fillOpacity: 0.3,
  }).addTo(map);

  hasEnteredZone = false;
  isPlacingMarker = false;
});

// === Радиус зоны ===
const radiusSlider = document.getElementById("radius-slider");
const radiusValue = document.getElementById("radius-value");

radiusSlider.addEventListener("input", () => {
  zoneRadius = parseInt(radiusSlider.value);
  radiusValue.textContent = zoneRadius;
  if (targetCircle) {
    targetCircle.setRadius(zoneRadius);
  }
});

// === Уведомление и звук: остановка ===
document.getElementById("stop-sound").addEventListener("click", () => {
  const audio = document.getElementById("ping-sound");
  audio.pause();
  audio.currentTime = 0;
  document.getElementById("zone-alert").style.display = "none";
});
