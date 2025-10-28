// Grab elements
const cameraBtn = document.getElementById("camera-btn");
const uploadBtn = document.getElementById("upload-btn");
const cameraInput = document.getElementById("camera-input");
const fileInput = document.getElementById("file-input");
const preview = document.getElementById("preview");
const resultBox = document.getElementById("result");

// Trigger hidden inputs
cameraBtn.addEventListener("click", () => cameraInput.click());
uploadBtn.addEventListener("click", () => fileInput.click());

// Handle file selection (camera or upload)
[cameraInput, fileInput].forEach(input => {
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";

      // Analyze with backend
      analyzeImage(file);
    }
  });
});

// Send image to backend for Google Vision analysis
async function analyzeImage(file) {
  resultBox.innerHTML = "<p>🔎 Analyzing artifact...</p>";

  try {
    // Convert file to base64
    const base64Data = await toBase64(file);

    // Send to backend
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Data })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    if (data.labels && data.labels.length > 0) {
      resultBox.innerHTML = `
        <h3>Results:</h3>
        <ul>
          ${data.labels.map(label => `<li>${label}</li>`).join("")}
        </ul>
      `;
    } else {
      resultBox.innerHTML = "<p>No labels detected.</p>";
    }
  } catch (err) {
    console.error(err);
    resultBox.innerHTML = "<p>❌ Error analyzing image. Check backend connection.</p>";
  }
}

// Helper: convert file to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
  });
}
