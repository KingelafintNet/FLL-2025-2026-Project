// Collections page logic

const collectionGrid = document.getElementById("collectionGrid");
const addMockBtn = document.getElementById("addMockBtn");
const clearBtn = document.getElementById("clearBtn");

let MyCollection = [];

function renderCollection() {
  collectionGrid.innerHTML = "";
  if (MyCollection.length === 0) {
    collectionGrid.innerHTML = `
      <div class="card">
        <h4>No items yet</h4>
        <p class="muted">Identify an artifact to add it to your virtual collection.</p>
      </div>`;
    return;
  }
  const frag = document.createDocumentFragment();
  MyCollection.forEach(item => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h4>${item.type} — ${item.culture}</h4>
      <p class="muted">${formatPeriod(item.startYear, item.endYear)}</p>
      <p>${item.location}</p>
      <p class="muted">${new Date(item.timestamp).toLocaleString()}</p>
    `;
    frag.appendChild(el);
  });
  collectionGrid.appendChild(frag);
}

function formatPeriod(start, end) {
  const fmt = y => (y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`);
  return `${fmt(start)} to ${fmt(end)}`;
}

function randomId() {
  return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}
function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

const TYPES = ["Arrowhead","Pottery shard","Scraper","Spear point","Bead"];
const CULTURES = ["Hopewell","Woodland","Mississippian","Clovis","Ancestral Puebloan"];

function makeMockArtifact() {
  return {
    id: randomId(),
    type: pick(TYPES),
    culture: pick(CULTURES),
    startYear: pick([-11000,-500,-200,900,1100]),
    endYear: pick([-10000,200,200,1200,1300]),
    location: "DRSS address, Beavercreek, OH",
    timestamp: Date.now()
  };
}

addMockBtn.addEventListener("click", () => {
  MyCollection.push(makeMockArtifact());
  renderCollection();
});

clearBtn.addEventListener("click", () => {
  MyCollection = [];
  renderCollection();
});

// Initial render
renderCollection();