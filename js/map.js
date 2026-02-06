// Digscord GPS + Camera System

let map, marker, circle;
let savedPhotos = JSON.parse(localStorage.getItem("digscordPhotos") || "[]");

// Initialize map
map = L.map("map").setView([39.7, -84.1], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// Marker + 100m circle
marker = L.marker([39.7, -84.1]).addTo(map);
circle = L.circle([39.7, -84.1], { radius: 100, color: "blue" }).addTo(map);

// Update coordinates display
function updateCoords(lat, lon) {
  document.getElementById("liveCoords").textContent =
    `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
}

// GPS tracking
navigator.geolocation.watchPosition(pos => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  marker.setLatLng([lat, lon]);
  circle.setLatLng([lat, lon]);
  updateCoords(lat, lon);
});

// CAMERA SYSTEM
const cameraOverlay = document.getElementById("cameraOverlay");
const cameraPopup = document.getElementById("cameraPopup");
const cameraStream = document.getElementById("cameraStream");
const cameraCanvas = document.getElementById("cameraCanvas");

// Open camera
document.getElementById("takePhotoBtn").addEventListener("click", async () => {
  cameraOverlay.classList.remove("hidden");
  cameraPopup.classList.remove("hidden");

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  cameraStream.srcObject = stream;
});

// Capture photo
document.getElementById("captureBtn").addEventListener("click", () => {
  const ctx = cameraCanvas.getContext("2d");
  cameraCanvas.width = cameraStream.videoWidth;
  cameraCanvas.height = cameraStream.videoHeight;

  ctx.drawImage(cameraStream, 0, 0);

  const imageData = cameraCanvas.toDataURL("image/png");

  let title = "";

  while (!title) {
    title = prompt("Enter a title (required):");
    if (title === null) return; // user cancelled
  }
  
  const description = prompt("Enter a description (optional):") || "No description";
  
  const { lat, lng } = marker.getLatLng();
  
  const entry = {
    title,
    description,
    image: imageData,
    lat,
    lon: lng
  };
  

  savedPhotos.push(entry);
  localStorage.setItem("digscordPhotos", JSON.stringify(savedPhotos));

  renderPhotos();
  closeCamera();
});

// Close camera
function closeCamera() {
  cameraOverlay.classList.add("hidden");
  cameraPopup.classList.add("hidden");

  const stream = cameraStream.srcObject;
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
}

document.getElementById("closeCameraBtn").addEventListener("click", closeCamera);

// Render sidebar
function renderPhotos() {
  const list = document.getElementById("photoList");
  list.innerHTML = "";

  savedPhotos.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "photo-item";

    div.innerHTML = `
    <img src="${p.image}">
    <strong>${p.title}</strong><br>
    <em>${p.description}</em><br>
    <small>${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</small><br>
    <button class="delete-btn" data-index="${i}">Delete</button>
`;
  
    div.addEventListener("click", () => {
      map.setView([p.lat, p.lon], 16);

      L.popup()
        .setLatLng([p.lat, p.lon])
        .setContent(`<img src="${p.image}" style="width:150px;border-radius:10px;"><br>${p.title}`)
        .openOn(map);
    });

    list.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const index = btn.dataset.index;
      savedPhotos.splice(index, 1);
      localStorage.setItem("digscordPhotos", JSON.stringify(savedPhotos));
      renderPhotos();
    });
  });
}

renderPhotos();
