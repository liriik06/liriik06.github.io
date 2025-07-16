
const map = L.map("map").setView([0, 0], 15); // Стартовая позиция

// Добавим слой OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Добавим маркер
const marker = L.marker([0, 0]).addTo(map).bindPopup('currentZoom').openPopup();

// Обновляем координаты при движении
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        marker.setLatLng([latitude, longitude]);

        const currentZoom = map.getZoom(); // сохранить текущий масштаб
        map.setView([latitude, longitude], currentZoom); // не сбрасывать!

        marker.getPopup().setContent('Вы здесь').openOn(map);
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
