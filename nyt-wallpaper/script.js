const NYT_API_KEY = "";
const NYT_URL =
  "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=" + NYT_API_KEY;

const canvas = document.getElementById("canvas");
const tickerContent = document.getElementById("tickerContent");
const backgroundImage = document.getElementById("backgroundImage");
const imageInput = document.getElementById("imageInput");
const exitBtn = document.getElementById("exitBtn");

let tickerX = 0;
let tickerWidth = 0;

/* IMAGE UPLOAD */
imageInput.onchange = () => {
  const reader = new FileReader();
  reader.onload = () => {
    backgroundImage.src = reader.result;
    document.body.classList.add("wallpaper-mode"); 
  };
  reader.readAsDataURL(imageInput.files[0]);
};

/* EXIT WALLPAPER MODE */
exitBtn.onclick = () => {
  document.body.classList.remove("wallpaper-mode");
};

/* LOAD NEWS */
async function loadNews() {
  const res = await fetch(NYT_URL);
  const data = await res.json();

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
