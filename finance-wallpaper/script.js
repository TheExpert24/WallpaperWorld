/* ================= CONFIG ================= */

const FINNHUB_API_KEY = "";

const TRENDING_SYMBOLS = [
  "AAPL", "MSFT", "NVDA", "AMZN", "META",
  "TSLA", "GOOGL", "AMD", "NFLX", "INTC",
  "MU","DJT","ONDS","CORT","SIDU","NKE"
];

/* ================= ELEMENTS ================= */

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");

/* ================= GOOGLE LOGO ================= */

let googleLogo = document.getElementById("googleLogo");
if (!googleLogo) {
  googleLogo = document.createElement("img");
  googleLogo.id = "googleLogo";
  googleLogo.src = "google-logo.png";
  googleLogo.style.display = "none";
  googleLogo.style.opacity = 0;
  canvas.appendChild(googleLogo);
}

/* ================= GOOGLE SEARCH ================= */

let googleSearch = document.getElementById("googleSearch");
if (!googleSearch) {
  googleSearch = document.createElement("input");
  googleSearch.id = "googleSearch";
  googleSearch.type = "text";
  googleSearch.placeholder = "Search Google";
  googleSearch.style.display = "none";
  canvas.appendChild(googleSearch);

  googleSearch.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const q = encodeURIComponent(googleSearch.value.trim());
      if (q) {
        window.open(`https://www.google.com/search?q=${q}`, "_blank");
      }
    }
  });
}

/* ================= EXIT BUTTON ================= */

let exitBtn = document.getElementById("exitBtn");
if (!exitBtn) {
  exitBtn = document.createElement("button");
  exitBtn.id = "exitBtn";
  exitBtn.textContent = "X";
  document.body.appendChild(exitBtn);
}

exitBtn.onclick = () => {
  document.body.classList.remove("wallpaper-mode");
  googleLogo.style.display = "none";
  googleSearch.style.display = "none";
};

/* ================= WALLPAPER ================= */

function setWallpaper(dataUrl) {
  backgroundImage.src = dataUrl;
  document.body.classList.add("wallpaper-mode");
  googleLogo.style.display = "block";
  googleLogo.style.opacity = 1;
  googleSearch.style.display = "block";
}

const savedImage = localStorage.getItem("nytWallpaperImage");
if (savedImage) setWallpaper(savedImage);

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setWallpaper(reader.result);
    localStorage.setItem("nytWallpaperImage", reader.result);
  };
  reader.readAsDataURL(file);
};

/* ================= LOAD STOCKS ================= */

async function loadStocks() {
  tickerContent.innerHTML = "";

  for (const symbol of TRENDING_SYMBOLS) {
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const data = await res.json();

      if (!data.c) continue;

      const price = data.c.toFixed(2);
      const change = data.dp.toFixed(2);
      const up = change >= 0;

      const link = document.createElement("a");
      link.className = "headline";
      link.href = `https://finance.yahoo.com/quote/${symbol}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      link.innerHTML = `
        <strong>${symbol}</strong>
        $${price}
        <span style="color:${up ? "#2ecc71" : "#e74c3c"}">
          ${up ? "▲" : "▼"} ${Math.abs(change)}%
        </span>
      `;

      tickerContent.appendChild(link);
    } catch (err) {
      console.error("Stock load error:", err);
    }
  }

  tickerWidth = tickerContent.scrollWidth;
  tickerX = canvas.offsetWidth;
}

loadStocks();

/* ================= TICKER ANIMATION ================= */

let tickerX = 0;
let tickerWidth = 0;

function animate() {
  tickerX -= 2.7;

  if (tickerX < -tickerWidth) {
    tickerX = canvas.offsetWidth;
  }

  tickerContent.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(animate);
}

animate();
