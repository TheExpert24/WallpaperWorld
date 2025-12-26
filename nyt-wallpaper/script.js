const NYT_API_KEY = "";
const NYT_URL =
  "https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=" + NYT_API_KEY;

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");

// ================= GOOGLE LOGO =================
let googleLogo = document.getElementById("googleLogo");
if (!googleLogo) {
  googleLogo = document.createElement("img");
  googleLogo.id = "googleLogo";
  googleLogo.src = "google-logo.png";
  googleLogo.style.display = "none";
  googleLogo.style.opacity = 0;
  canvas.appendChild(googleLogo);
}

// ================= GOOGLE SEARCH =================
let googleSearch = document.getElementById("googleSearch");
if (!googleSearch) {
  googleSearch = document.createElement("input");
  googleSearch.id = "googleSearch";
  googleSearch.type = "text";
  googleSearch.placeholder = "Search Google";
  googleSearch.style.display = "none";
  canvas.appendChild(googleSearch);

  googleSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = encodeURIComponent(googleSearch.value.trim());
      if (query) {
        window.open(
          `https://www.google.com/search?q=${query}`,
          "_blank"
        );
      }
    }
  });
}

// ================= EXIT BUTTON =================
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
  googleLogo.style.opacity = 0;
  googleSearch.style.display = "none";
};

// ================= WALLPAPER =================
function setWallpaper(dataUrl) {
  backgroundImage.src = dataUrl;
  document.body.classList.add("wallpaper-mode");

  googleLogo.style.display = "block";
  googleLogo.style.opacity = 1;

  googleSearch.style.display = "block";
}

// Restore saved image
const savedImage = localStorage.getItem("nytWallpaperImage");
if (savedImage) setWallpaper(savedImage);

// Image upload
imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    setWallpaper(dataUrl);
    localStorage.setItem("nytWallpaperImage", dataUrl);
  };
  reader.readAsDataURL(file);
};

// ================= LOAD MOST INTERESTING NEWS =================
let headlines = [];

async function loadNews() {
  try {
    const res = await fetch(NYT_URL);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      console.warn("No popular NYT articles found.");
      return;
    }

    headlines = data.results;
    tickerContent.innerHTML = "";

    headlines.forEach(article => {
      const link = document.createElement("a");
      link.className = "headline";
      link.textContent = article.title;
      link.href = article.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      tickerContent.appendChild(link);
    });

    tickerWidth = tickerContent.scrollWidth;
    tickerX = canvas.offsetWidth;

  } catch (err) {
    console.error("Failed to load NYT popular news:", err);
  }
}

loadNews();

// ================= TICKER ANIMATION =================
let tickerX = 0;
let tickerWidth = 0;

function animate() {
  tickerX -= 2; 

  if (tickerX < -tickerWidth) {
    tickerX = canvas.offsetWidth;
  }

  tickerContent.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(animate);
}

animate();
