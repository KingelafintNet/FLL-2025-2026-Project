// Navigation helper
function movePage(url) {
  window.location.href = url;
}

const fileInput = document.getElementById("file-input");
const uploadArea = document.getElementById("upload-area");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyze-btn");
const resultBox = document.getElementById("result");
const cameraBtn = document.getElementById("camera-btn");

let stream;

// Drag & drop support
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.style.background = "#ddd";
});
uploadArea.addEventListener("dragleave", () => {
  uploadArea.style.background = "var(--cream)";
});
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
  showPreview();
});

// Show preview for uploaded file
fileInput.addEventListener("change", showPreview);

function showPreview() {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.innerHTML = `<img src="${e.target.result}" alt="Artifact preview">`;
  };
  reader.readAsDataURL(file);
}

// Start camera when button is clicked
cameraBtn.addEventListener("click", startCamera);

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.style.maxWidth = "100%";
    video.style.borderRadius = "8px";
    preview.innerHTML = "";
    preview.appendChild(video);
    video.srcObject = stream;

    // Add capture button
    const snapBtn = document.createElement("button");
    snapBtn.textContent = "📸 Capture Photo";
    preview.appendChild(snapBtn);

    snapBtn.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image")