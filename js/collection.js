// Navigation helper
function movePage(url) {
  window.location.href = url;
}

// Example artifact data
const artifacts = [
  { name: "Earthenware Jug", img: "images/jug.webp" },
  { name: "Stone Arrowhead", img: "images/arrowhead.png" },
  { name: "Ceremonial Pot", img: "images/pot.png" },
  { name: "Ceremonial Bowl", img: "images/bowl.png" },
  { name: "Ancient Coin", img: "images/coin.png" },
  { name: "Amulet", img: "images/amulet.png" }
];

const grid = document.getElementById("artifact-grid");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Render artifacts
function renderArtifacts(list) {
  grid.innerHTML = "";
  list.forEach(a => {
    const card = document.createElement("div");
    card.classList.add("artifact-card");
    card.innerHTML = `
      <img src="${a.img}" alt="${a.name}">
      <h3>${a.name}</h3>
    `;
    grid.appendChild(card);
  });
}

// Initial render
renderArtifacts(artifacts);

// Search functionality
searchBtn.addEventListener("click", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = artifacts.filter(a => a.name.toLowerCase().includes(term));
  renderArtifacts(filtered);
});
