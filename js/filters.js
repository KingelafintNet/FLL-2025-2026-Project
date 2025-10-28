// Example artifact dataset
const artifacts = [
    { name: "Earthenware Jug", type: "Pottery", period: "Bronze Age", region: "Europe", material: "Clay", color: "Brown" },
    { name: "Stone Arrowhead", type: "Weapon", period: "Neolithic", region: "North America", material: "Stone", color: "Gray" },
    { name: "Ancient Coin", type: "Currency", period: "Roman Empire", region: "Europe", material: "Bronze", color: "Gold" },
    { name: "Obsidian Blade", type: "Tool", period: "Mesoamerican", region: "Central America", material: "Obsidian", color: "Black" }
  ];
  
  const form = document.getElementById("filter-form");
  const resultsBox = document.getElementById("filter-results");
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const type = document.getElementById("type").value.toLowerCase();
    const period = document.getElementById("period").value.toLowerCase();
    const region = document.getElementById("region").value.toLowerCase();
    const material = document.getElementById("material").value.toLowerCase();
    const color = document.getElementById("color").value.toLowerCase();
  
    const filtered = artifacts.filter(a =>
      (!type || a.type.toLowerCase().includes(type)) &&
      (!period || a.period.toLowerCase().includes(period)) &&
      (!region || a.region.toLowerCase().includes(region)) &&
      (!material || a.material.toLowerCase().includes(material)) &&
      (!color || a.color.toLowerCase().includes(color))
    );
  
    if (filtered.length === 0) {
      resultsBox.innerHTML = "<p>No artifacts match your filters.</p>";
    } else {
      resultsBox.innerHTML = filtered.map(a =>
        `<p><strong>${a.name}</strong> — ${a.type}, ${a.period}, ${a.region}, ${a.material}, ${a.color}</p>`
      ).join("");
    }
  });
  