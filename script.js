const url =
  "https://api.weatherapi.com/v1/forecast.json?key=5d3dabed1d754a5e999103359232408&days=7&aqi=no&alerts=no&q=";
const searchUrl =
  "http://api.weatherapi.com/v1/search.json?key=5d3dabed1d754a5e999103359232408&q=";

let unitChoice = "metric";
let place = "tel aviv";

let info = {
  forecast: [
    {
      country: "",
      city: "",
      degree: "",
      unit: "",
      conditionText: "",
      conditionIcon: "",
    },
    {
      day: "",
      degree: "",
      conditionIcon: "",
    },
    {
      day: "",
      degree: "",
      conditionIcon: "",
    },
  ],
};

async function getWeather() {
  const response = await fetch(url + place);
  const json = await response.json();
  saveData(json);
}

function saveData(data) {
  info.forecast[0].city = data.location.name;
  info.forecast[0].country = data.location.country;
  if (unitChoice === "metric") {
    info.forecast[0].degree = data.current.temp_c;
    info.forecast[0].unit = "°C";
  } else if (unitChoice === "imperial") {
    info.forecast[0].degree = data.current.temp_f;
    info.forecast[0].unit = "°F";
  }
  info.forecast[0].conditionIcon = data.current.condition.icon;
  info.forecast[0].conditionText = data.current.condition.text;
  for (let i = 1; i < info.forecast.length; i++) {
    info.forecast[i].day = dayInWeek(data.forecast.forecastday[i].date);
    if (unitChoice === "metric") {
      info.forecast[i].degree = data.forecast.forecastday[i].day.avgtemp_c;
    } else if (unitChoice === "imperial") {
      info.forecast[i].degree = data.forecast.forecastday[i].day.avgtemp_f;
    }
    info.forecast[i].conditionIcon =
      data.forecast.forecastday[i].day.condition.icon;
  }
  console.log(data);
}

function dayInWeek(date) {
  date = new Date(date);
  const dayNum = date.getDay();
  let day;

  switch (dayNum) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
      break;
    default:
      day = "Invalid Day";
  }

  return day;
}

function displayMain() {
  if (!document.querySelector(".main").classList.value.includes("active")) {
    document.querySelector(".main").classList.add("active");
    document.querySelector(".error").classList.remove("active");
  }
  const degree = document.querySelector(".main .degree");
  const unit = document.querySelector(".main .unit");
  const conditionIcon = document.querySelector(".main .icon");
  const conditionText = document.querySelector(".main .text");
  const city = document.querySelector(".main .city");

  const country = document.querySelector(".main .country");

  degree.textContent = info.forecast[0].degree;
  unit.textContent = info.forecast[0].unit;
  conditionIcon.src = info.forecast[0].conditionIcon;
  conditionText.textContent = info.forecast[0].conditionText;
  city.textContent = `${info.forecast[0].city},`;
  country.textContent = info.forecast[0].country;
}

function displayForecast() {
  const cells = Array.from(document.querySelectorAll(".cell"));
  for (let i = 0; i < cells.length; i++) {
    console.log(info.forecast[i]);
    cells[i].querySelector(".day").textContent = info.forecast[i + 1].day;
    cells[i].querySelector(".icon").src = info.forecast[i + 1].conditionIcon;
    cells[i].querySelector(".degree").textContent = `${
      info.forecast[i + 1].degree
    }°`;
  }
}

function start() {
  const error = document.querySelector(".error");
  if (error.classList.value.includes("active")) {
    error.classList.remove("active");
  }
  const loader = document.querySelector(".loader");
  const main = document.querySelector(".main");
  if (info.forecast[0].city !== place) {
    main.classList.remove("active");
    loader.classList.add("active");
  }
  getWeather()
    .then(displayMain)
    .then(displayForecast)
    .then(function () {
      main.classList.add("active");
      loader.classList.remove("active");
    })
    .catch((error) => {
      displayError();
      loader.classList.remove("active");
      console.log(error);
    });
}

const search = document.querySelector(".search");
search.addEventListener("focus", () => {
  search.placeholder = "";
});
search.addEventListener("blur", () => {
  search.placeholder = "Search";
});
search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    place = search.value;
    start();
  }
});

// add autocomplete :
// search.addEventListener("keyup", (e) => {
//   if (e.key.match(/[a-zA-Z]/) && search.value.length > 2) {
//     let string = search.value;
//     console.log(search.value);
//     autoCompleteData(string);
//   }
// });
// async function autoCompleteData(string) {
//   const response = await fetch(searchUrl + string);
//   const json = await response.json();
//   console.log(json);
// }

const unitInput = document.querySelector('input[type="checkbox"]');
unitInput.addEventListener("change", function () {
  if (unitInput.checked) {
    unitChoice = "imperial";
    getWeather()
      .then(displayMain)
      .then(displayForecast)
      .catch((error) => {
        displayError();
      });
    document.querySelector(".unit-text").textContent = "Imperial";
  } else {
    unitChoice = "metric";
    getWeather()
      .then(displayMain)
      .then(displayForecast)
      .catch((error) => {
        displayError();
      });
    document.querySelector(".unit-text").textContent = "Metric";
  }
});

function displayError() {
  document.querySelector(".main").classList.remove("active");
  document.querySelector(".error").classList.add("active");
}

async function weather() {
  const response = await fetch(url + place);
  const json = await response.json();
  console.log(json);
}

start();
