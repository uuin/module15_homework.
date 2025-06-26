const wsUri = "wss://ws.ifelse.io/";

const output = document.querySelector(".output");
const btnSend = document.querySelector(".send");
const mess = document.querySelector(".mess");
const btnGps = document.querySelector(".gps");

let websocket = new WebSocket(wsUri);

function writeToScreen(message) {
  let pre = document.createElement("p");
  pre.innerHTML = message;
  output.appendChild(pre);
}

// Обработка события отправки сообщения
btnSend.addEventListener("click", () => {
  const message = mess.value;
  writeToScreen("SENT: " + message);
  websocket.send(message);

  // Обработка сообщений с сервера
  websocket.onmessage = function (evt) {
    writeToScreen(`<span style="color: blue;">RESPONSE: ` + evt.data + `</span>`);
  };
});

// Обработка ошибок при получении геолокации
const error = () => {
  writeToScreen("Невозможно получить местоположение");
};

// Обработка успешного получения геолокации
const success = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Создаем ссылку на карту
  const link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;

  // Отображаем ссылку на экране
  writeToScreen(`<a href="${link}" target="_blank">Геопозиция</a>`);

  // Отправляем ссылку через WebSocket
  websocket.send(link);

  // Обработка сообщений с сервера
  websocket.onmessage = function (evt) {
    writeToScreen(`<span></span>`);
  };
};

// Обработка нажатия на кнопку получения геолокации
btnGps.addEventListener("click", () => {
  if (!navigator.geolocation) {
    writeToScreen("Геолокация не поддерживается вашим браузером");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});
