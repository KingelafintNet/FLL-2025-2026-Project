// -----------------------------
// START CAMERA
// -----------------------------
const video = document.getElementById("camera-stream");
const canvas = document.getElementById("photo-canvas");
const captureBtn = document.getElementById("capture-btn");

// Turn on the camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Camera access denied or unavailable.");
  }
}

startCamera();

// -----------------------------
// CAPTURE PHOTO
// -----------------------------
captureBtn.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Optional: show a message or do something with the image
  console.log("Photo captured!");
});
