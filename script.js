
const API_KEY = "your api key";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://nominatim.openstreetmap.org";

const $ = (id) => document.getElementById(id);

const translations = {
  ar: {
    eyebrow: "اكتشف الطقس حول العالم", heading: "الطقس، أينما كنت",
    intro: "كل ما تحتاجه لمعرفة حالة الطقس في مكان واحد.",
    search: "بحث", myLocation: "موقعي الحالي", currentWeather: "الطقس الحالي",
    favorite: "إضافة للمفضلة", feelsLike: "المحسوسة", high: "العظمى",
    low: "الصغرى", humidity: "الرطوبة", wind: "سرعة الرياح",
    windUnit: "متر/ثانية", pressure: "الضغط الجوي", visibility: "مدى الرؤية",
    km: "كم", clouds: "الغيوم", sunrise: "الشروق", nextHours: "توقعات مستقبلية",
    forecastTitle: "توقعات الطقس", explore: "استكشف المكان",
    mapTitle: "الخريطة التفاعلية", mapExpand: "الانتقال إلى الخريطة",
    personal: "مساحتك الخاصة", recentTitle: "آخر عمليات البحث",
    clear: "مسح السجل", noHistory: "ستظهر المدن التي تبحث عنها هنا.",
    savedPlaces: "أماكنك المحفوظة", favoritesTitle: "المدن المفضلة",
    noFavorites: "أضف مدنك المفضلة للوصول إليها بسرعة.",
    footerText: "الطقس حول العالم، في تجربة واحدة بسيطة.",
    loading: "جارٍ جلب بيانات الطقس...", searchPlaceholder: "ابحث عن مدينة...",
    enterCity: "يرجى كتابة اسم المدينة أولاً.",
    apiMissing: "أضف مفتاح OpenWeatherMap API في ملف script.js لتفعيل بيانات الطقس.",
    notFound: "لم نعثر على المدينة. جرّب كتابة الاسم مع الدولة.",
    networkError: "تعذّر الاتصال بالخدمة. تحقق من الإنترنت وحاول مجددًا.",
    geoDenied: "لم يُسمح بالوصول إلى موقعك. يمكنك البحث عن المدينة يدويًا.",
    geoUnavailable: "تعذّر تحديد موقعك الحالي.",
    locationLoading: "جارٍ تحديد موقعك...",
    noForecast: "لا تتوفر توقعات لهذه المدينة حاليًا.",
    historyCleared: "تم مسح سجل البحث.",
    favoriteAdded: "أُضيفت المدينة إلى المفضلة.",
    favoriteRemoved: "أُزيلت المدينة من المفضلة.",
    loadingCity: "جارٍ تحميل الطقس...", today: "اليوم",
    tomorrow: "غدًا", remove: "حذف", mapUnavailable: "تعذّر تحميل الخريطة.",
    lastUpdated: "آخر تحديث", locationName: "موقعك الحالي",
    searchError: "حدث خطأ غير متوقع. حاول مرة أخرى.",
    apiError: "لم تقبل خدمة الطقس الطلب. تأكد من صحة المفتاح وتفعيله.",
    days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
  },
  en: {
    eyebrow: "Discover weather around the world", heading: "Weather, wherever you are",
    intro: "Everything you need to know about the weather in one place.",
    search: "Search", myLocation: "My location", currentWeather: "CURRENT WEATHER",
    favorite: "Add to favorites", feelsLike: "Feels like", high: "High",
    low: "Low", humidity: "Humidity", wind: "Wind speed",
    windUnit: "m/s", pressure: "Pressure", visibility: "Visibility",
    km: "km", clouds: "Cloud cover", sunrise: "Sunrise", nextHours: "UPCOMING DAYS",
    forecastTitle: "Weather forecast", explore: "EXPLORE THE AREA",
    mapTitle: "Interactive map", mapExpand: "Go to map",
    personal: "YOUR SPACE", recentTitle: "Recent searches",
    clear: "Clear history", noHistory: "Cities you search for will appear here.",
    savedPlaces: "YOUR SAVED PLACES", favoritesTitle: "Favorite cities",
    noFavorites: "Add favorite cities to access them quickly.",
    footerText: "Weather around the world, in one simple experience.",
    loading: "Loading weather data...", searchPlaceholder: "Search for a city...",
    enterCity: "Please enter a city name first.",
    apiMissing: "Add your OpenWeatherMap API key in script.js to enable live weather.",
    notFound: "City not found. Try including the country name.",
    networkError: "Could not connect. Check your internet and try again.",
    geoDenied: "Location permission was denied. You can search manually.",
    geoUnavailable: "Could not determine your current location.",
    locationLoading: "Finding your location...",
    noForecast: "No forecast is currently available for this city.",
    historyCleared: "Search history cleared.",
    favoriteAdded: "City added to favorites.",
    favoriteRemoved: "City removed from favorites.",
    loadingCity: "Loading weather...", today: "Today",
    tomorrow: "Tomorrow", remove: "Remove", mapUnavailable: "Map could not be loaded.",
    lastUpdated: "Last updated", locationName: "Your current location",
    searchError: "Something unexpected happened. Please try again.",
    apiError: "The weather service rejected the request. Check your API key.",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }
};

let language = localStorage.getItem("wm-language") || "ar";
let darkMode = localStorage.getItem("wm-theme") === "dark";
let fahrenheit = localStorage.getItem("wm-unit") === "fahrenheit";
let currentPlace = null;
let currentWeather = null;
let map = null;
let mapMarker = null;
let mapInitialized = false;
let searchSequence = 0;

// convert data "string" to javascript  
function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

// save user data localy 
function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showStatus(language === "ar" ? "تعذّر حفظ البيانات في المتصفح." : "Could not save browser data.", "error");
  }
}
// 
function t(key) {
  return translations[language][key] ?? key;
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  $("languageBtn").textContent = language === "ar" ? "EN" : "ع";
  $("cityInput").placeholder = t("searchPlaceholder");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.textContent = t(key);
  });

  $("themeBtn").textContent = darkMode ? "☀️" : "🌙";
  $("unitBtn").textContent = fahrenheit ? "°F" : "°C";
  $("favoriteBtn").setAttribute("aria-label", t("favorite"));

  renderHistory();
  renderFavorites();

  if (currentWeather && currentPlace) {
    renderWeather(currentWeather, currentPlace);
  }
}

function applyTheme() {
  document.body.classList.toggle("dark", darkMode);
  document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  $("themeBtn").textContent = darkMode ? "☀️" : "🌙";
}

// message for user 
function showStatus(message, type = "") {
  const box = $("statusMessage");
  box.textContent = message;
  box.className = `status-message ${type}`;
}

// loading status 
function setLoading(active, message = t("loading")) {
  $("loadingOverlay").hidden = !active;
  $("loadingOverlay").querySelector("p").textContent = message;
  $("searchBtn").disabled = active;
  $("locationBtn").disabled = active;
  $("searchBtn").style.opacity = active ? ".7" : "1";
}

function temperatureValue(celsius) {
  return Math.round(fahrenheit ? celsius * 9 / 5 + 32 : celsius);
}

function formatTemperature(celsius) {
  return `${temperatureValue(celsius)}°`;
}

function formatDate(timestamp, options = {}) {
  return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", {
    weekday: options.weekday || "long",
    day: options.day || "numeric",
    month: options.month || "long"
  }).format(new Date(timestamp * 1000));
}

function formatClock(timestamp, timezoneOffset = 0) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}


async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("API_ERROR");
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function checkApiKey() {
  if (!API_KEY || API_KEY === "PASTE_YOUR_OPENWEATHERMAP_API_KEY_HERE") {
    showStatus(t("apiMissing"), "error");
    return false;
  }
  return true;
}
// search place 
async function geocodeCity(query) {
  const url = `${GEO_URL}/search?format=jsonv2&limit=1&accept-language=${language}&q=${encodeURIComponent(query)}`;
  const results = await fetchJSON(url);
  if (!results.length) throw new Error("CITY_NOT_FOUND");

  const place = results[0];
  return {
    name: place.name || query,
    displayName: place.display_name || place.name || query,
    lat: Number(place.lat),
    lon: Number(place.lon),
    country: place.address?.country || "",
    key: `${Number(place.lat).toFixed(3)},${Number(place.lon).toFixed(3)}`
  };
}

async function reverseGeocode(lat, lon) {
  try {
    const place = await fetchJSON(
      `${GEO_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=${language}`
    );
    const address = place.address || {};
    return {
      name: address.city || address.town || address.village || address.county || t("locationName"),
      displayName: place.display_name || t("locationName"),
      lat, lon, country: address.country || "",
      key: `${lat.toFixed(3)},${lon.toFixed(3)}`
    };
  } catch {
    return {
      name: t("locationName"), displayName: t("locationName"),
      lat, lon, country: "", key: `${lat.toFixed(3)},${lon.toFixed(3)}`
    };
  }
}

async function loadWeather(place) {
  if (!checkApiKey()) return;

  const sequence = ++searchSequence;
  setLoading(true);
  showStatus("");

  try {
    const params = `lat=${place.lat}&lon=${place.lon}&appid=${encodeURIComponent(API_KEY)}&units=metric&lang=${language}`;
    const [weather, forecast] = await Promise.all([
      fetchJSON(`${WEATHER_URL}/weather?${params}`),
      fetchJSON(`${WEATHER_URL}/forecast?${params}`)
    ]);

    if (sequence !== searchSequence) return;

    currentPlace = place;
    currentWeather = weather;

    renderWeather(weather, place);
    renderForecast(forecast);
    $("weatherSection").hidden = false;

    saveHistory(place);
    renderHistory();
    renderFavorites();
    updateFavoriteButton();
    updateMap(place);
    showStatus(`${t("lastUpdated")}: ${new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", { hour: "2-digit", minute: "2-digit" }).format(new Date())}`, "success");

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 150);
  } catch (error) {
    if (sequence !== searchSequence) return;
    if (error.status === 401) showStatus(t("apiError"), "error");
    else if (error.message === "CITY_NOT_FOUND") showStatus(t("notFound"), "error");
    else if (error.message === "API_ERROR" && error.status === 404) showStatus(t("notFound"), "error");
    else showStatus(t("networkError"), "error");
  } finally {
    if (sequence === searchSequence) setLoading(false);
  }
}

function renderWeather(data, place) {
  const condition = data.weather?.[0] || {};
  const main = data.main || {};

  $("cityName").textContent = `${data.name || place.name}${data.sys?.country ? `, ${data.sys.country}` : ""}`;
  $("currentDate").textContent = `${formatDate(data.dt)} · ${formatClock(data.dt, data.timezone || 0)}`;
  $("temperature").textContent = temperatureValue(main.temp);
  $("weatherDescription").textContent = condition.description || "--";
  $("weatherIcon").src = `https://openweathermap.org/img/wn/${condition.icon || "01d"}@2x.png`;
  $("weatherIcon").alt = condition.description || "Weather";
  $("feelsLike").textContent = temperatureValue(main.feels_like);
  $("tempMax").textContent = temperatureValue(main.temp_max);
  $("tempMin").textContent = temperatureValue(main.temp_min);
  $("humidity").textContent = `${main.humidity ?? "--"}%`;
  $("wind").textContent = data.wind?.speed ?? "--";
  $("pressure").textContent = main.pressure ?? "--";
  $("visibility").textContent = data.visibility == null ? "--" : (data.visibility / 1000).toFixed(1);
  $("clouds").textContent = `${data.clouds?.all ?? "--"}%`;
  $("sunrise").textContent = data.sys?.sunrise ? formatClock(data.sys.sunrise, data.timezone || 0) : "--:--";
}

function renderForecast(data) {
  const grid = $("forecastGrid");
  grid.replaceChildren();

  const groups = new Map();

  for (const item of data.list || []) {
    const dateKey = item.dt_txt.slice(0, 10);
    if (!groups.has(dateKey)) groups.set(dateKey, []);
    groups.get(dateKey).push(item);
  }

  const days = [...groups.entries()].slice(0, 5);

  if (!days.length) {
    grid.innerHTML = `<p class="empty-state">${t("noForecast")}</p>`;
    return;
  }

  days.forEach(([dateKey, items], index) => {
    const midday = items.reduce((best, item) =>
      Math.abs(Number(item.dt_txt.slice(11, 13)) - 12) <
      Math.abs(Number(best.dt_txt.slice(11, 13)) - 12) ? item : best
    , items[0]);

    const min = Math.min(...items.map(item => item.main.temp_min));
    const max = Math.max(...items.map(item => item.main.temp_max));
    const date = new Date(`${dateKey}T12:00:00`);
    const dayName = index === 0 ? t("today") :
      index === 1 ? t("tomorrow") :
      new Intl.DateTimeFormat(language === "ar" ? "ar" : "en", { weekday: "short" }).format(date);

    const card = document.createElement("article");
    card.className = "forecast-card";

    const day = document.createElement("div");
    day.className = "forecast-day";
    day.textContent = dayName;

    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${midday.weather[0].icon}.png`;
    icon.alt = midday.weather[0].description;
    icon.loading = "lazy";

    const temp = document.createElement("div");
    temp.className = "forecast-temp";
    temp.textContent = formatTemperature(midday.main.temp);

    const desc = document.createElement("div");
    desc.className = "forecast-description";
    desc.textContent = midday.weather[0].description;

    const range = document.createElement("div");
    range.className = "forecast-min";
    range.textContent = `${temperatureValue(max)}° / ${temperatureValue(min)}°`;

    card.append(day, icon, temp, desc, range);
    grid.append(card);
  });
}

function saveHistory(place) {
  let history = readStorage("wm-history");
  history = history.filter(item => item.key !== place.key);
  history.unshift({
    key: place.key, name: place.name, displayName: place.displayName,
    lat: place.lat, lon: place.lon, country: place.country || ""
  });
  saveStorage("wm-history", history.slice(0, 6));
}

function renderHistory() {
  renderSavedList("historyList", readStorage("wm-history"), "noHistory", false);
}

function renderFavorites() {
  renderSavedList("favoritesList", readStorage("wm-favorites"), "noFavorites", true);
}

function renderSavedList(containerId, items, emptyKey, isFavorite) {
  const container = $(containerId);
  container.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t(emptyKey);
    container.append(empty);
    return;
  }

  items.forEach(place => {
    const row = document.createElement("div");
    row.className = "saved-place";

    const open = document.createElement("button");
    open.className = "saved-place-main";
    open.type = "button";

    const name = document.createElement("strong");
    name.textContent = place.name;

    const details = document.createElement("small");
    details.textContent = place.country || place.displayName || "";

    open.append(name, details);
    open.addEventListener("click", () => loadWeather(place));

    const remove = document.createElement("button");
    remove.className = "remove-place";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${t("remove")} ${place.name}`);
    remove.addEventListener("click", () => {
      const key = isFavorite ? "wm-favorites" : "wm-history";
      saveStorage(key, readStorage(key).filter(item => item.key !== place.key));
      isFavorite ? renderFavorites() : renderHistory();
      if (isFavorite) updateFavoriteButton();
    });

    row.append(open, remove);
    container.append(row);
  });
}

function updateFavoriteButton() {
  if (!currentPlace) return;
  const exists = readStorage("wm-favorites").some(item => item.key === currentPlace.key);
  $("favoriteBtn").classList.toggle("active", exists);
  $("favoriteBtn").innerHTML = exists ? `★ <span>${t("favorite")}</span>` : `☆ <span>${t("favorite")}</span>`;
}

function toggleFavorite() {
  if (!currentPlace) return;

  let favorites = readStorage("wm-favorites");
  const exists = favorites.some(item => item.key === currentPlace.key);

  favorites = exists
    ? favorites.filter(item => item.key !== currentPlace.key)
    : [{ ...currentPlace }, ...favorites].slice(0, 12);

  saveStorage("wm-favorites", favorites);
  renderFavorites();
  updateFavoriteButton();
  showStatus(exists ? t("favoriteRemoved") : t("favoriteAdded"), "success");
}

function initializeMap() {
  if (mapInitialized || typeof L === "undefined") return;

  map = L.map("weatherMap", { scrollWheelZoom: false }).setView([15.5, 32.5], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  mapInitialized = true;
}

function updateMap(place) {
  initializeMap();
  if (!map) {
    showStatus(t("mapUnavailable"), "error");
    return;
  }

  const coords = [place.lat, place.lon];
  map.setView(coords, 10);

  if (mapMarker) map.removeLayer(mapMarker);
  mapMarker = L.marker(coords).addTo(map).bindPopup(place.displayName || place.name);
}

async function searchCity(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    showStatus(t("enterCity"), "error");
    return;
  }

  if (!checkApiKey()) return;

  setLoading(true, t("loadingCity"));
  try {
    const place = await geocodeCity(trimmed);
    await loadWeather(place);
  } catch (error) {
    showStatus(error.message === "CITY_NOT_FOUND" ? t("notFound") : t("networkError"), "error");
    setLoading(false);
  }
}

function findMyLocation() {
  if (!navigator.geolocation) {
    showStatus(t("geoUnavailable"), "error");
    return;
  }

  if (!checkApiKey()) return;

  setLoading(true, t("locationLoading"));

  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      await loadWeather(place);
    } catch {
      showStatus(t("geoUnavailable"), "error");
      setLoading(false);
    }
  }, (error) => {
    showStatus(error.code === error.PERMISSION_DENIED ? t("geoDenied") : t("geoUnavailable"), "error");
    setLoading(false);
  }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
}

$("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchCity($("cityInput").value);
});

$("languageBtn").addEventListener("click", () => {
  language = language === "ar" ? "en" : "ar";
  localStorage.setItem("wm-language", language);
  applyLanguage();
});

$("themeBtn").addEventListener("click", () => {
  darkMode = !darkMode;
  localStorage.setItem("wm-theme", darkMode ? "dark" : "light");
  applyTheme();
});

$("unitBtn").addEventListener("click", () => {
  fahrenheit = !fahrenheit;
  localStorage.setItem("wm-unit", fahrenheit ? "fahrenheit" : "celsius");
  applyLanguage();
});

$("favoriteBtn").addEventListener("click", toggleFavorite);
$("locationBtn").addEventListener("click", findMyLocation);

$("clearHistoryBtn").addEventListener("click", () => {
  saveStorage("wm-history", []);
  renderHistory();
  showStatus(t("historyCleared"), "success");
});

$("mapExpandBtn").addEventListener("click", () => {
  $("weatherMap").scrollIntoView({ behavior: "smooth", block: "center" });
  if (map) setTimeout(() => map.invalidateSize(), 300);
});

$("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  $("backToTop").classList.toggle("visible", window.scrollY > 350);
}, { passive: true });

applyTheme();
applyLanguage();
