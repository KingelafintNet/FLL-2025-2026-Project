const fundingSources = [
  { name: "Federal Archaeology Program", url: "https://www.nps.gov/archeology/tools/funding.htm" },
  { name: "Preservation Technology & Training Grants", url: "https://www.ncptt.nps.gov/" },
  { name: "Save the History Campaign", url: "https://www.savingplaces.org/" },
  { name: "Archaeological Institute of America Donations", url: "https://www.archaeological.org/programs/public/donations/" },
  { name: "Native Land Preservation Fund", url: "https://www.nativelandfund.org/" },
  { name: "Cultural Survival Grants", url: "https://www.culturalsurvival.org/" },
  { name: "Preserve America Grants", url: "https://www.preserveamerica.gov/" },
  { name: "Terrainous Research Trust", url: "https://www.terrainous.org/funding" },
  { name: "Archealloy Support Network", url: "https://www.archealloy.org/support" },
  { name: "Justicia Regional Foundation", url: "https://www.justiciaregional.org/grants" }
];

const listEl = document.getElementById("funding-list");
const searchInput = document.getElementById("search-input");
const suggestInput = document.getElementById("suggest-input");
const suggestBtn = document.getElementById("suggest-btn");

function renderList(sources) {
  listEl.innerHTML = "";
  sources.forEach(source => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = source.url;
    a.target = "_blank";
    a.textContent = source.name;
    li.appendChild(a);
    listEl.appendChild(li);
  });
}

// Search filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = fundingSources.filter(source =>
    source.name.toLowerCase().includes(query)
  );
  renderList(filtered);
});

// Suggest new link
suggestBtn.addEventListener("click", () => {
  const text = suggestInput.value.trim();
  if (text) {
    fundingSources.push({ name: text, url: "#" });
    suggestInput.value = "";
    renderList(fundingSources);
  }
});

// Initial render
renderList(fundingSources);
