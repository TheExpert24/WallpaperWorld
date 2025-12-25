const NYT_API_KEY = "";
const NYT_URL =
  "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=" + NYT_API_KEY;

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");

let tickerX = 0;
let tickerWidth = 0;

/* IMAGE UPLOAD */
imageInput.onchange = () => {
  const reader = new FileReader();
  reader.onload = () => {
    backgroundImage.src = reader.result;
  };
  reader.readAsDataURL(imageInput.files[0]);
};

/* LOAD NEWS WITH DEBUG */
async function loadNews() {
  try {
    const res = await fetch(NYT_URL);
    const data = await res.json();

    console.log("NYT API Response:", data); // 🔥 debug: see the full API response

    if (!data.results || data.results.length === 0) {
      console.warn("No articles found in API response.");
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

      // Debug: log each article link
      console.log("Adding article link:", article.title, article.url);

      tickerContent.appendChild(link);
    });

    tickerWidth = tickerContent.scrollWidth;
    tickerX = canvas.offsetWidth;

  } catch (err) {
    console.error("Failed to fetch NYT articles:", err);
  }
}

loadNews();

/* ANIMATION LOOP */
function animate() {
  tickerX -= 0.7;

  if (tickerX < -tickerWidth) {
    tickerX = canvas.offsetWidth;
  }

  tickerContent.style.transform = `translateX(${tickerX}px)`;
  requestAnimationFrame(animate);
}

animate();
