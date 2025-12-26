const NYT_API_KEY = "";
const NYT_URL =
  "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=" + NYT_API_KEY;

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");

// Exit button
let exitBtn = document.getElementById("exitBtn");
if (!exitBtn) {
  exitBtn = document.createElement("button");
  exitBtn.id = "exitBtn";
  exitBtn.textContent = "X";
  document.body.appendChild(exitBtn);
}
exitBtn.onclick = () => {
  document.body.classList.remove("wallpaper-mode");
};

/* ===================================== */
/* ========== IMAGE PERSISTENCE ========= */
/* ===================================== */

// Restore saved image on load
const savedImage = localStorage.getItem("nytWallpaperImage");
if (savedImage) {
  backgroundImage.src = savedImage;
  document.body.classList.add("wallpaper-mode"); // enter full-screen wallpaper mode
}

// Save image when user uploads one
imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;

    backgroundImage.src = dataUrl;
    document.body.classList.add("wallpaper-mode"); // full-screen

    // Persist image across reloads/tabs
    localStorage.setItem("nytWallpaperImage", dataUrl);
  };
  reader.readAsDataURL(file);
};

/* ===================================== */
/* ============== LOAD NEWS ============= */
/* ===================================== */

async function loadNews() {
  try {
    const res = await fetch(NYT_URL);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      console.warn("No articles found.");
      return;
    }

    tickerContent.innerHTML = "";

    data.results.slice(0, 6).forEach(article => {
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
    console.error("Failed to fetch NYT articles:", err);
  }
}

loadNews();

/* ===================================== */
/* ============ ANIMATION LOOP ========== */
/* ===================================== */

let tickerX = 0;
let tickerWidth = 0;

function animate() {
  tickerX -= 0.7;

  if (tickerX < -tickerWidth) {
    tickerX = canvas.offsetWidth;
  }

  tickerContent.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(animate);
}

animate();
