window.addEventListener("DOMContentLoaded", () => {
    const photoList = document.getElementById("photoList");
    const liveCoords = document.getElementById("liveCoords");
    const takePhotoBtn = document.getElementById("takePhotoBtn");
    // ...rest of your code...
});

    // ---------------- MAP SETUP ----------------
    const map = L.map("map").setView([40, -82], 6);

    const baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
    }).addTo(map);

    // ---------------- LIVE GPS UPDATES ----------------
    function updateLiveCoords() {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            liveCoords.textContent = `Lat: ${lat.toFixed(5)} | Lon: ${lon.toFixed(5)}`;
        });
    }

    updateLiveCoords();
    setInterval(updateLiveCoords, 5000);

    // ---------------- LOAD SAVED PHOTOS ----------------
    function loadPhotos() {
        photoList.innerHTML = "";

        const photos = JSON.parse(localStorage.getItem("photos") || "[]");

        // Clear all markers/circles except base layer
        map.eachLayer(layer => {
            if (layer !== baseLayer) {
                map.removeLayer(layer);
            }
        });

        photos.forEach(photo => {
            // Marker
            const marker = L.marker([photo.lat, photo.lon]).addTo(map);

            // 100m circle
            const circle = L.circle([photo.lat, photo.lon], {
                radius: 100,
                color: "blue",
                fillColor: "#a0c4ff",
                fillOpacity: 0.3
            }).addTo(map);

            // Popup
            marker.bindPopup(`
                <strong>${photo.title}</strong><br>
                <em>${photo.description}</em><br><br>
                <img src="${photo.image}" width="150"><br>
                <small>${photo.lat.toFixed(5)}, ${photo.lon.toFixed(5)}</small>
            `);

            // Sidebar item
            const item = document.createElement("div");
            item.className = "photo-item";
            item.innerHTML = `
                <strong>${photo.title}</strong><br>
                <small>${photo.description}</small><br>
                <small>${photo.lat.toFixed(5)}, ${photo.lon.toFixed(5)}</small>
                <br>
                <button class="deleteBtn" data-id="${photo.id}">Delete</button>
            `;

            // Click item → focus map
            item.addEventListener("click", () => {
                map.setView([photo.lat, photo.lon], 17);
                marker.openPopup();
            });

            // Delete button
            const deleteBtn = item.querySelector(".deleteBtn");
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // don’t trigger map focus

                if (confirm("Delete this photo?")) {
                    let saved = JSON.parse(localStorage.getItem("photos") || "[]");
                    saved = saved.filter(p => p.id !== photo.id);
                    localStorage.setItem("photos", JSON.stringify(saved));

                    loadPhotos();
                }
            });

            photoList.appendChild(item);
        });
    }

    loadPhotos();

    // ---------------- CAMERA BUTTON ----------------
    takePhotoBtn.addEventListener("click", async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Camera not supported in this browser.");
            return;
        }

        // Open camera popup
        const camWin = window.open("", "", "width=400,height=500");

        camWin.document.write(`
            <h2>Camera</h2>
            <video id="cam" autoplay playsinline style="width:100%;border-radius:10px;"></video>
            <button id="snapBtn" style="
                width:100%;padding:12px;margin-top:10px;
                background:#0066ff;color:white;border:none;border-radius:8px;font-size:18px;
            ">Capture</button>
            <canvas id="canvas" style="display:none;"></canvas>
        `);

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const camVideo = camWin.document.getElementById("cam");
        const snapBtn = camWin.document.getElementById("snapBtn");

        // Disable capture until video is ready
        snapBtn.disabled = true;

        camVideo.srcObject = stream;

        camVideo.onloadeddata = () => {
            snapBtn.disabled = false;
        };

        await camVideo.play();

        const canvas = camWin.document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        snapBtn.onclick = () => {
            // Capture frame
            canvas.width = camVideo.videoWidth;
            canvas.height = camVideo.videoHeight;
            ctx.drawImage(camVideo, 0, 0);

            const imageData = canvas.toDataURL("image/png");

            // Stop camera
            stream.getTracks().forEach(t => t.stop());
            camWin.close();

            // Get GPS
            if (!navigator.geolocation) {
                alert("Geolocation not supported.");
                return;
            }

            navigator.geolocation.getCurrentPosition(pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                // Force non-empty title
                let title = "";
                while (!title || title.trim() === "") {
                    title = prompt("Enter a title for this photo:");
                    if (!title || title.trim() === "") {
                        alert("You must enter a title.");
                    }
                }

                // Optional description
                let description = prompt("Enter a description:");
                if (!description || description.trim() === "") {
                    description = "No description";
                }

                const photo = {
                    id: Date.now(),
                    title: title,
                    description: description,
                    image: imageData,
                    lat,
                    lon,
                    time: Date.now()
                };

                const saved = JSON.parse(localStorage.getItem("photos") || "[]");
                saved.push(photo);
                localStorage.setItem("photos", JSON.stringify(saved));

                loadPhotos();
                alert("Photo saved!");
            }, err => {
                alert("GPS error: " + err.message);
            });
        };
    });
