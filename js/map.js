// Initialize map centered on Ohio
const map = L.map('map').setView([40.3, -82.8], 7);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Helper to create emoji markers
function emojiMarker(lat, lng, emoji, tooltip) {
  const icon = L.divIcon({
    className: "emoji-icon",
    html: `<span style="font-size:24px;">${emoji}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  return L.marker([lat, lng], { icon }).bindTooltip(tooltip, { direction: "top" }).addTo(map);
}

// Example artifact markers across Ohio
emojiMarker(41.65, -83.54, "🏺", "Earthenware Jug — Found near Toledo<br>Material: Clay<br>Period: Bronze Age");
emojiMarker(41.50, -81.69, "🪙", "Ancient Coin — Found near Cleveland<br>Material: Bronze<br>Period: Roman Influence");
emojiMarker(41.08, -81.52, "🧿", "Amulet — Found near Akron<br>Material: Stone<br>Period: Mesoamerican Trade");
emojiMarker(39.96, -82.99, "🗡️", "Stone Arrowhead — Found near Columbus<br>Material: Flint<br>Period: Neolithic");
emojiMarker(39.41, -81.45, "🍲", "Ceremonial Bowl — Found near Marietta<br>Material: Clay<br>Period: Woodland Culture");
emojiMarker(38.73, -82.99, "💎", "Obsidian Arrowhead — Found near Portsmouth<br>Material: Volcanic Glass<br>Sharper than steel");
