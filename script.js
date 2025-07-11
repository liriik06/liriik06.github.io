document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("geo-btn");
    const details = document.getElementById("details");
    let reqcount = 0;

    button.addEventListener("click", () => {
        if (!navigator.geolocation) {
            details.innerText = "Геолокация не поддерживается этим браузером.";
            return;
        }

        navigator.geolocation.watchPosition(successCallback, errorCallback, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });

    function successCallback(position) {
        const { accuracy, latitude, longitude, altitude, heading, speed } = position.coords;
        reqcount++;
        details.innerHTML = `
            ✅ Геолокация получена:<br>
            Accuracy: ${accuracy}<br>
            Latitude: ${latitude}<br>
            Longitude: ${longitude}<br>
            Altitude: ${altitude}<br>
            Heading: ${heading}<br>
            Speed: ${speed}<br>
            Запросов: ${reqcount}
        `;
    }

    function errorCallback(error) {
        details.innerHTML = `❌ Ошибка геолокации: ${error.message} (код ${error.code})`;
    }
});
