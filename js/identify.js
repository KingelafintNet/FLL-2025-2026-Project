// Identify page logic — upload, preview, mock AI, summary modal

const choosePhoto = document.getElementById("choosePhoto");
const artifactFile = document.getElementById("artifactFile");
const uploadZone = document.getElementById("uploadZone");
const previewImg = document.getElementById("previewImg");
const previewCaption = document.getElementById("previewCaption");
const runAiBtn = document.getElementById("runAiBtn");
const clearBtn = document.getElementById("clearBtn");
const aiResult = document.getElementById("aiResult");

// Modal elements
const summaryModal = document.getElementById("summaryModal");
const summaryBody = document.getElementById("summaryBody");
const closeSummaryBtn = document.getElementById("closeSummaryBtn");
const addToCollectionBtn = document.getElementById("addToCollectionBtn");

// Mock collection for demo
const MyCollection = [];

const TYPES = ["Arrowhead","Pottery shard","Scraper","Spear point","Bead"];
const CULTURES = ["Hopewell","Woodland","Mississippian","Clovis","Ancestral Puebloan"];
const BG_TEXT = {
  "Arrowhead": "Commonly shaped via flintknapping; used for hunting and sometimes ceremonial contexts.",
  "Pottery shard": "Fragments of ceramic vessels revealing stylistic motifs and firing techniques.",
  "Scraper": "Used for hide processing or woodworking; edge wear patterns indicate use.",
  "Spear point": "Larger points hafted to spears; can predate smaller arrow points.",
  "Bead": "Adornment pieces; material and craftsmanship show trade networks."
};

function fmtPeriod(y){ return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`; }
function formatPeriod(start, end){ return `${fmtPeriod(start)} to ${fmtPeriod(end)}`; }
function safeText(str){
  const div = document.createElement("div");
  div.textContent = String(str || "");
  return div.innerHTML;
}

choosePhoto.addEventListener("click", () => artifactFile.click());
artifactFile.addEventListener("change", onFileSelected);

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.style.borderColor = "#90BE6D";
});
uploadZone.addEventListener("dragleave", () => {
  uploadZone.style.borderColor = "var(--border)";
});
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files?.[0];
  if (file) {
    artifactFile.files = e.dataTransfer.files;
    onFileSelected();
  }
});

function onFileSelected(){
  const file = artifactFile.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.style.display = "block";
    previewCaption.textContent = `${file.name} • ${(file.size/1024/1024).toFixed(2)} MB`;
  };
  reader.readAsDataURL(file);
}

runAiBtn.addEventListener("click", () => {
  if (!artifactFile.files?.[0]) {
    aiResult.innerHTML = `<div class="card"><p>Please select an image first.</p></div>`;
    return;
  }
  const guess = mockAiIdentify(previewImg.src);

  aiResult.innerHTML = `
    <div class="card">
      <h3>Probable ID: ${safeText(guess.type)}</h3>
      <p class="muted">Confidence: ${Math.floor(70 + Math.random()*25)}%</p>
      <p><strong>Time period:</strong> ${formatPeriod(guess.startYear, guess.endYear)}</p>
      <p><strong>Culture:</strong> ${safeText(guess.culture)}</p>
      <p><strong>Background:</strong> ${safeText(guess.background)}</p>
      <p class="muted">Note: Always leave artifacts in situ. Removing artifacts from protected lands is illegal and can result in prosecution.</p>
      <div class="actions">
        <button class="btn secondary" id="viewSummaryBtn">View summary</button>
      </div>
    </div>
  `;
  document.getElementById("viewSummaryBtn").addEventListener("click", () => openSummary(guess));
});

clearBtn.addEventListener("click", () => {
  artifactFile.value = "";
  previewImg.src = "";
  previewImg.style.display = "none";
  previewCaption.textContent = "";
  aiResult.innerHTML = "";
});

// Mock AI inference
function mockAiIdentify(imgSrc){
  const type = pick(TYPES);
  const culture = pick(CULTURES);
  const startYear = pick([-11000, -500, -200, 900, 1100]);
  const endYear = pick([-10000, 200, 200, 1200, 1300]);
  const background = BG_TEXT[type];
  return {
    id: randomId(),
    type, culture, startYear, endYear,
    location: "Unspecified",
    timestamp: Date.now(),
    img: imgSrc,
    background
  };
}

function openSummary(guess){
  summaryBody.innerHTML = `
    <p><strong>Type:</strong> ${safeText(guess.type)}</p>
    <p><strong>Culture:</strong> ${safeText(guess.culture)}</p>
    <p><strong>Time period:</strong> ${formatPeriod(guess.startYear, guess.endYear)}</p>
    <p><strong>Background:</strong> ${safeText(guess.background)}</p>
    <p><strong>Legal warning:</strong> Do not remove artifacts from private or federal property. Report the location and leave the item in place.</p>
  `;
  summaryModal.style.display = "flex";

  addToCollectionBtn.onclick = () => {
    MyCollection.push({
      ...guess,
      location: "DRSS address, Beavercreek, OH"
    });
    summaryModal.style.display = "none";
    aiResult.innerHTML = `
      <div class="card">
        <p>Added to your collection (mock). Total items: <strong>${MyCollection.length}</strong>.</p>
      </div>
    `;
  };
}

closeSummaryBtn.addEventListener("click", () => {
  summaryModal.style.display = "none";
});

/* Helpers */
function randomId(){ return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }