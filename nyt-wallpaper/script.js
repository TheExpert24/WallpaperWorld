const NYT_API_KEY = "";
const NYT_URL =
  "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=" + NYT_API_KEY;

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");

let tickerX = 0;
let tickerWidth = 0;

// ---------------- IMAGE UPLOAD ----------------
imageInput.onchange = () => {
  const reader = new FileReader();
  reader.onload = () => backgroundImage.src = reader.result;
  reader.readAsDataURL(imageInput.files[0]);
};

// ---------------- FETCH NEWS ----------------
async function loadNews() {
  try {
    const res = await fetch(NYT_URL);
    const data = await res.json();

    tickerContent.innerHTML = "";
    data.results.slice(0, 10).forEach(a => {
      const span = document.createElement("span");
      span.className = "headline";
      span.textContent = a.title;
      tickerContent.appendChild(span);
    });

    tickerWidth = tickerContent.offsetWidth;
    tickerX = canvas.offsetWidth;
  } catch (err) {
    console.error("Failed to fetch NYT news:", err);
  }
}

// Initial load
loadNews();

// Refresh headlines every 6 hours
setInterval(loadNews, 6 * 60 * 60 * 1000);

// ---------------- TICKER ANIMATION ----------------
function animate() {
  tickerX -= 1.5; // pixels per frame
  if (tickerX < -tickerWidth) {
    tickerX = canvas.offsetWidth;
  }
  tickerContent.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(animate);
}
animate();
