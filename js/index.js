/* ============================================================
   Digscord – Archeology AI & Crowdsourcing
   Part 3: app.js (extended)
   - Single-file front-end logic
   - Router, state, mock services, data generation
   - Identification flow (mock), collection, filters, map
   - Chat, notifications, funding, volunteer, auth
   - Large trivia bank and helper modules
   - Performance-minded DOM helpers
   ============================================================ */

/* ===========================
   App boot and simple router
   =========================== */

   const views = [...document.querySelectorAll(".view")];
   const navButtons = [...document.querySelectorAll("[data-target]")];
   navButtons.forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.target)));
   
   function showView(id) {
     views.forEach(v => v.classList.toggle("active", v.id === id));
     window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
   }
   
   /* ================
      Global state
      ================ */
   
   const AppState = {
     stats: {
       artifacts: 18, // narrative from brief
       sites: 5,
       users: 124,
     },
     artifacts: [],
     myCollection: [],
     chat: {
       members: new Set(["Archeologist (verified)"]),
       messages: [
         { from: "System", text: "Room created for DRSS region — Arrowheads (500 BCE–1200 CE)." },
         { from: "Archeologist (verified)", text: "Thanks for contributing these finds. Could you describe soil context and depth?" },
       ],
     },
     auth: {
       verified: false,
       name: null,
       school: null,
       startYear: null,
       endYear: null,
     },
     funding: {
       campaigns: [],
     },
     volunteers: [],
     trivia: {
       score: 0,
       questions: [],
     },
   };
   
   /* =======================
      Utility & helper funcs
      ======================= */
   
   function randInt(min, max) {
     return Math.floor(Math.random() * (max - min + 1)) + min;
   }
   function pick(arr) {
     return arr[Math.floor(Math.random() * arr.length)];
   }
   function cryptoRandomId() {
     return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
   }
   function clamp(val, min, max) {
     return Math.max(min, Math.min(max, val));
   }
   function fmtPeriod(y) {
     return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
   }
   function formatPeriod(start, end) {
     return `${fmtPeriod(start)} to ${fmtPeriod(end)}`;
   }
   function safeText(str) {
     const div = document.createElement("div");
     div.textContent = str;
     return div.innerHTML;
   }
   
   /* ======================
      Seed data generation
      ====================== */
   
   const TYPES = ["Arrowhead", "Pottery shard", "Scraper", "Spear point", "Bead"];
   const CULTURES = ["Hopewell", "Woodland", "Mississippian", "Clovis", "Ancestral Puebloan"];
   const BG_TEXT = {
     "Arrowhead": "Commonly shaped via flintknapping; used for hunting and sometimes ceremonial contexts.",
     "Pottery shard": "Fragments of ceramic vessels revealing stylistic motifs and firing techniques.",
     "Scraper": "Used for hide processing or woodworking; edge wear patterns indicate use.",
     "Spear point": "Larger points hafted to spears; can predate smaller arrow points.",
     "Bead": "Adornment pieces; material and craftsmanship show trade networks.",
   };
   const NAMES = ["Alex", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Sam", "Avery", "Quinn", "Jamie", "Devin", "Sky", "Harper", "Cameron", "Parker", "Rowan", "Sawyer", "River", "Elliot", "Blake"];
   
   function placeholderImage(type) {
     const map = { "Arrowhead": "🗡️", "Pottery shard": "🏺", "Scraper": "🪓", "Spear point": "🏹", "Bead": "📿" };
     return `data:text/plain,${map[type] || "🗿"}`;
   }
   
   function makeArtifact(type, culture, startYear, endYear, location, latlon) {
     return {
       id: cryptoRandomId(),
       type,
       culture,
       startYear,
       endYear,
       location,
       latlon,
       timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 3600 * 1000), // within last week
       img: placeholderImage(type),
       contributor: pick(NAMES),
       status: Math.random() > 0.7 ? "Under review" : "Match",
     };
   }
   
   // Seed a realistic set of artifacts clustered around Beavercreek, OH (DRSS address narrative)
   function generateSeedArtifacts(count = 50) {
     const baseLat = 39.7589;
     const baseLon = -84.0580;
     const res = [];
     const timeRanges = [
       [-11000, -10000],
       [-500, 200],
       [-200, 200],
       [900, 1200],
       [1100, 1300],
     ];
   
     for (let i = 0; i < count; i++) {
       const t = pick(TYPES);
       const c = pick(CULTURES);
       const [start, end] = pick(timeRanges);
       const jitterLat = baseLat + (Math.random() - 0.5) * 0.02;
       const jitterLon = baseLon + (Math.random() - 0.5) * 0.02;
       const loc = "DRSS address, Beavercreek, OH";
       res.push(makeArtifact(t, c, start, end, loc, [jitterLat, jitterLon]));
     }
     return res;
   }
   
   AppState.artifacts = generateSeedArtifacts(120);
   
   /* ======================
      Stats rendering
      ====================== */
   
   document.getElementById("stat-artifacts").textContent = AppState.stats.artifacts.toString();
   document.getElementById("stat-sites").textContent = AppState.stats.sites.toString();
   document.getElementById("stat-users").textContent = AppState.stats.users.toString();
   
   /* ======================
      Collection rendering
      ====================== */
   
   const collectionGrid = document.getElementById("collectionGrid");
   
   function renderCollection() {
     collectionGrid.innerHTML = "";
     if (AppState.myCollection.length === 0) {
       collectionGrid.innerHTML = `
         <div class="card">
           <h4>No items yet</h4>
           <p class="muted">Identify an artifact to add it to your virtual collection.</p>
         </div>
       `;
       return;
     }
     const frag = document.createDocumentFragment();
     AppState.myCollection.forEach(item => {
       const el = document.createElement("div");
       el.className = "card";
       el.innerHTML = `
         <h4>${safeText(item.type)} — ${safeText(item.culture)}</h4>
         <p class="muted">${formatPeriod(item.startYear, item.endYear)}</p>
         <p>${safeText(item.location)}</p>
         <p class="muted">${new Date(item.timestamp).toLocaleString()}</p>
       `;
       frag.appendChild(el);
     });
     collectionGrid.appendChild(frag);
   }
   renderCollection();
   
   /* ======================
      Identify flow (mock)
      ====================== */
   
   const choosePhoto = document.getElementById("choosePhoto");
   const artifactFile = document.getElementById("artifactFile");
   const uploadZone = document.getElementById("uploadZone");
   const previewImg = document.getElementById("previewImg");
   const runAiBtn = document.getElementById("runAiBtn");
   const aiResult = document.getElementById("aiResult");
   
   choosePhoto.addEventListener("click", () => artifactFile.click());
   artifactFile.addEventListener("change", onFileSelected);
   
   uploadZone.addEventListener("dragover", e => {
     e.preventDefault();
     uploadZone.style.borderColor = "#90BE6D";
   });
   uploadZone.addEventListener("dragleave", () => {
     uploadZone.style.borderColor = "var(--color-border)";
   });
   uploadZone.addEventListener("drop", e => {
     e.preventDefault();
     const file = e.dataTransfer.files?.[0];
     if (file) {
       artifactFile.files = e.dataTransfer.files;
       onFileSelected();
     }
   });
   
   function onFileSelected() {
     const file = artifactFile.files?.[0];
     if (!file) return;
     const reader = new FileReader();
     reader.onload = e => {
       previewImg.src = e.target.result;
       previewImg.style.display = "block";
     };
     reader.readAsDataURL(file);
   }
   
   runAiBtn.addEventListener("click", () => {
     if (!artifactFile.files?.[0]) {
       aiResult.innerHTML = `<div class="card"><p>Please select an image first.</p></div>`;
       return;
     }
     const guess = mockAiIdentify();
     aiResult.innerHTML = `
       <div class="card">
         <h4>Probable ID: ${safeText(guess.type)}</h4>
         <p class="muted">Confidence: ${Math.floor(70 + Math.random() * 25)}%</p>
         <p><strong>Time period:</strong> ${formatPeriod(guess.startYear, guess.endYear)}</p>
         <p><strong>Culture:</strong> ${safeText(guess.culture)}</p>
         <p><strong>Background:</strong> ${safeText(guess.background)}</p>
         <p class="muted">Note: Always leave artifacts in situ. Removing artifacts from protected lands is illegal and can result in prosecution.</p>
         <div class="cta-row">
           <button class="secondary" id="viewSummaryBtn">View summary</button>
         </div>
       </div>
     `;
     document.getElementById("viewSummaryBtn").addEventListener("click", () => openSummary(guess));
   });
   
   function mockAiIdentify() {
     const type = pick(TYPES);
     const culture = pick(CULTURES);
     const starts = [-11000, -500, -200, 900, 1100];
     const ends = [-10000, 200, 200, 1200, 1300];
     const startYear = pick(starts);
     const endYear = pick(ends);
     const background = BG_TEXT[type];
     return {
       id: cryptoRandomId(),
       type,
       culture,
       startYear,
       endYear,
       location: "Unspecified location",
       timestamp: Date.now(),
       img: previewImg.src,
       background,
     };
   }
   
   /* ======================
      Summary modal
      ====================== */
   
   const summaryModal = document.getElementById("summaryModal");
   const summaryBody = document.getElementById("summaryBody");
   const closeSummaryBtn = document.getElementById("closeSummaryBtn");
   const addToCollectionBtn = document.getElementById("addToCollectionBtn");
   
   function openSummary(guess) {
     summaryBody.innerHTML = `
       <p><strong>Type:</strong> ${safeText(guess.type)}</p>
       <p><strong>Culture:</strong> ${safeText(guess.culture)}</p>
       <p><strong>Time period:</strong> ${formatPeriod(guess.startYear, guess.endYear)}</p>
       <p><strong>Background:</strong> ${safeText(guess.background)}</p>
       <p><strong>Legal warning:</strong> Do not remove artifacts from private or federal property. Report the location and leave the item in place.</p>
     `;
     summaryModal.style.display = "flex";
     addToCollectionBtn.onclick = () => {
       AppState.myCollection.push({
         ...guess,
         location: "DRSS address, Beavercreek, OH",
       });
       summaryModal.style.display = "none";
       renderCollection();
       showView("collection");
     };
   }
   closeSummaryBtn.addEventListener("click", () => (summaryModal.style.display = "none"));
   
   /* ======================
      Filters
      ====================== */
   
   const filterForm = document.getElementById("filterForm");
   const filterMeta = document.getElementById("filterMeta");
   const filterResults = document.getElementById("filterResults");
   
   filterForm.addEventListener("submit", e => {
     e.preventDefault();
     const type = document.getElementById("typeSelect").value;
     const culture = document.getElementById("cultureSelect").value;
     const startVal = document.getElementById("timeStart").value;
     const endVal = document.getElementById("timeEnd").value;
     const start = startVal !== "" ? parseInt(startVal, 10) : -Infinity;
     const end = endVal !== "" ? parseInt(endVal, 10) : Infinity;
     const locQ = document.getElementById("locationQuery").value.toLowerCase();
   
     const results = AppState.artifacts.filter(a => {
       const typeOk = !type || a.type === type;
       const cultureOk = !culture || a.culture === culture;
       const timeOk = a.startYear >= start && a.endYear <= end;
       const locOk = !locQ || a.location.toLowerCase().includes(locQ);
       return typeOk && cultureOk && timeOk && locOk;
     });
   
     // Simulate “at least 18” narrative
     const padded = results.slice();
     while (padded.length < 18 && AppState.artifacts.length) {
       const clone = { ...pick(AppState.artifacts) };
       clone.id = cryptoRandomId();
       padded.push(clone);
     }
   
     renderFilterResults(padded);
     filterMeta.textContent = `${padded.length} artifacts matched your criteria in the last week (including nearby analogs).`;
   
     // Update map
     renderMap(padded);
     renderMapList(padded);
   });
   
   function renderFilterResults(items) {
     filterResults.innerHTML = "";
     const frag = document.createDocumentFragment();
     items.forEach(a => {
       const card = document.createElement("div");
       card.className = "card";
       card.innerHTML = `
         <h4>${safeText(a.type)} — ${safeText(a.culture)}</h4>
         <p class="muted">${formatPeriod(a.startYear, a.endYear)}</p>
         <p>${safeText(a.location)}</p>
         <p class="muted">Timestamp: ${new Date(a.timestamp).toLocaleString()}</p>
         <div class="cta-row">
           <button class="secondary" data-art="${a.id}">Add to chat room</button>
         </div>
       `;
       card.querySelector("button").addEventListener("click", () => addToChatRoom(a));
       frag.appendChild(card);
     });
     filterResults.appendChild(frag);
   }
   
   /* ======================
      Map rendering (mock)
      ====================== */
   
   const mapCanvas = document.getElementById("mapCanvas");
   const mapList = document.getElementById("mapList");
   
   function renderMap(items = AppState.artifacts) {
     mapCanvas.innerHTML = "";
     const width = mapCanvas.clientWidth || 600;
     const height = mapCanvas.clientHeight || 380;
   
     items.forEach(a => {
       const pin = document.createElement("div");
       pin.className = "map-pin";
       pin.style.background = a.status === "Under review" ? "#EA9010" : "#90BE6D";
       const [lat, lon] = a.latlon || [39.7589, -84.0580];
       // Simple linear mapping (demo, not geospatially accurate)
       const x = 20 + ((lon + 180) / 360) * (width - 40);
       const y = 20 + ((90 - lat) / 180) * (height - 40);
       pin.style.left = `${clamp(x, 10, width - 10)}px`;
       pin.style.top = `${clamp(y, 10, height - 10)}px`;
       pin.title = `${a.type} — ${a.culture}\n${a.location}`;
       pin.addEventListener("click", () => addToChatRoom(a));
       mapCanvas.appendChild(pin);
     });
   
     // Reference historical site dot
     const ref = document.createElement("div");
     ref.className = "map-pin";
     ref.style.background = "#37371F";
     ref.style.left = "50%";
     ref.style.top = "40%";
     ref.title = "Known historical site";
     mapCanvas.appendChild(ref);
   }
   
   function renderMapList(items) {
     mapList.innerHTML = "";
     const frag = document.createDocumentFragment();
     items.forEach(a => {
       const el = document.createElement("div");
       el.className = "map-item";
       el.innerHTML = `
         <div><strong>${safeText(a.type)}</strong> — ${safeText(a.culture)}</div>
         <div class="muted">${formatPeriod(a.startYear, a.endYear)}</div>
         <div>${safeText(a.location)}</div>
         <div class="muted">${new Date(a.timestamp).toLocaleString()}</div>
       `;
       frag.appendChild(el);
     });
     mapList.appendChild(frag);
   }
   
   // Initial render
   renderMap(AppState.artifacts);
   renderMapList(AppState.artifacts);
   
   /* ======================
      Chat room
      ====================== */
   
   const chatLog = document.getElementById("chatLog");
   const chatMessage = document.getElementById("chatMessage");
   const sendChatBtn = document.getElementById("sendChatBtn");
   const notifyBtn = document.getElementById("notifyBtn");
   const exportChatBtn = document.getElementById("exportChatBtn");
   const notifyModal = document.getElementById("notifyModal");
   const notifyList = document.getElementById("notifyList");
   const closeNotifyBtn = document.getElementById("closeNotifyBtn");
   const exportModal = document.getElementById("exportModal");
   const exportText = document.getElementById("exportText");
   const closeExportBtn = document.getElementById("closeExportBtn");
   const copyExportBtn = document.getElementById("copyExportBtn");
   
   function renderChat() {
     chatLog.innerHTML = "";
     const frag = document.createDocumentFragment();
     AppState.chat.messages.slice(-300).forEach(msg => {
       const el = document.createElement("div");
       el.className = "chat-msg";
       el.innerHTML = `<strong>${safeText(msg.from)}:</strong> ${safeText(msg.text)}`;
       frag.appendChild(el);
     });
     chatLog.appendChild(frag);
     chatLog.scrollTop = chatLog.scrollHeight;
   }
   renderChat();
   
   sendChatBtn.addEventListener("click", () => {
     const text = chatMessage.value.trim();
     if (!text) return;
     AppState.chat.messages.push({ from: "You", text });
     chatMessage.value = "";
     renderChat();
   });
   
   function addToChatRoom(artifact) {
     AppState.chat.members.add(artifact.contributor);
     AppState.chat.messages.push({ from: "System", text: `Added ${artifact.contributor} (artifact: ${artifact.type}, ${artifact.culture}).` });
     renderChat();
     showView("chat");
   }
   
   notifyBtn.addEventListener("click", () => {
     notifyList.innerHTML = "";
     const frag = document.createDocumentFragment();
     [...AppState.chat.members]
       .filter(m => m !== "Archeologist (verified)")
       .forEach(m => {
         const el = document.createElement("div");
         el.className = "card";
         el.innerHTML = `<strong>${safeText(m)}</strong> was notified and invited to the chat.`;
         frag.appendChild(el);
       });
     notifyList.appendChild(frag);
     notifyModal.style.display = "flex";
   });
   closeNotifyBtn.addEventListener("click", () => (notifyModal.style.display = "none"));
   
   exportChatBtn.addEventListener("click", () => {
     exportText.value = AppState.chat.messages.map(m => `${m.from}: ${m.text}`).join("\n");
     exportModal.style.display = "flex";
   });
   closeExportBtn.addEventListener("click", () => (exportModal.style.display = "none"));
   copyExportBtn.addEventListener("click", async () => {
     try {
       await navigator.clipboard.writeText(exportText.value);
       copyExportBtn.textContent = "Copied!";
       setTimeout(() => (copyExportBtn.textContent = "Copy"), 1200);
     } catch {
       alert("Copy failed, select all and copy manually.");
     }
   });
   
   /* ======================
      Funding (simulated)
      ====================== */
   
   const fundForm = document.getElementById("fundForm");
   const fundLinkWrap = document.getElementById("fundLinkWrap");
   
   fundForm.addEventListener("submit", e => {
     e.preventDefault();
     const title = document.getElementById("fundTitle").value || "Community Excavation";
     const goalStr = document.getElementById("fundGoal").value || "10000";
     const goal = parseFloat(goalStr);
     const desc = document.getElementById("fundDesc").value || "Help fund a community-backed dig.";
   
     const slug = encodeURIComponent(title.replace(/\s+/g, "-").toLowerCase());
     const link = `https://gofundme.example/${slug}-${cryptoRandomId().slice(0, 6)}`;
   
     const campaign = {
       id: cryptoRandomId(),
       title,
       goal,
       desc,
       link,
       owner: AppState.auth.verified ? AppState.auth.name : "Archeologist (unverified)",
       createdAt: Date.now(),
     };
     AppState.funding.campaigns.push(campaign);
   
     fundLinkWrap.innerHTML = `
       <div class="card">
         <h4>${safeText(campaign.title)}</h4>
         <p><strong>Goal:</strong> $${campaign.goal.toLocaleString()}</p>
         <p>${safeText(campaign.desc)}</p>
         <p class="muted">Shareable link (simulated):</p>
         <input type="text" value="${campaign.link}" style="width:100%;" />
         <p class="muted">Owner: ${safeText(campaign.owner)} • ${new Date(campaign.createdAt).toLocaleString()}</p>
       </div>
     `;
   });
   
   /* ======================
      Volunteer interest
      ====================== */
   
   const volForm = document.getElementById("volForm");
   const volThanks = document.getElementById("volThanks");
   
   volForm.addEventListener("submit", e => {
     e.preventDefault();
     const name = document.getElementById("volName").value.trim();
     const email = document.getElementById("volEmail").value.trim();
     const availability = document.getElementById("volAvailability").value;
   
     if (!name || !email) {
       volThanks.textContent = "Please enter your name and email.";
       return;
     }
     const entry = {
       id: cryptoRandomId(),
       name,
       email,
       availability,
       createdAt: Date.now(),
     };
     AppState.volunteers.push(entry);
   
     volThanks.innerHTML = `
       <div class="card">
         <p>Thanks, <strong>${safeText(name)}</strong>! We’ve recorded your interest (${safeText(availability)}). We’ll reach out with details if the site is selected.</p>
         <p class="muted">${new Date(entry.createdAt).toLocaleString()}</p>
       </div>
     `;
     volForm.reset();
   });
   
   /* ======================
      Auth (Archeologist)
      ====================== */
   
   const authForm = document.getElementById("authForm");
   const authStatus = document.getElementById("authStatus");
   
   authForm.addEventListener("submit", e => {
     e.preventDefault();
     const name = document.getElementById("authName").value.trim();
     const school = document.getElementById("authSchool").value.trim();
     const startYearStr = document.getElementById("authGradStart").value.trim();
     const endYearStr = document.getElementById("authGradEnd").value.trim();
   
     const start = parseInt(startYearStr, 10);
     const end = parseInt(endYearStr, 10);
   
     if (!name || !school || !start || !end) {
       authStatus.textContent = "Please complete all fields.";
       return;
     }
     if (isNaN(start) || isNaN(end) || end < start) {
       authStatus.textContent = "Check your program dates.";
       return;
     }
     AppState.auth = { verified: true, name, school, startYear: start, endYear: end };
     AppState.chat.members.add("Archeologist (verified)");
     authStatus.innerHTML = `
       <div class="card">
         <p><strong>${safeText(name)}</strong> verified as Archeologist from <strong>${safeText(school)}</strong> (${start}–${end}).</p>
         <p class="muted">You can now create chat rooms, notify contributors, and set funding goals.</p>
       </div>
     `;
   });
   
   /* ======================
      Trivia game
      ====================== */
   
   const triviaWrap = document.getElementById("triviaWrap");
   const triviaScoreEl = document.getElementById("triviaScore");
   const restartTriviaBtn = document.getElementById("restartTriviaBtn");
   
   const TRIVIA_BASE = [
     {
       q: "Which process was commonly used to shape stone tools like arrowheads?",
       options: ["Smelting", "Flintknapping", "Casting", "Lathe turning"],
       answer: 1, expl: "Flintknapping involves striking or pressing to shape stone flakes and edges.",
     },
     {
       q: "A pottery shard can reveal which of the following?",
       options: ["Metal alloy composition", "Firing technique and motifs", "DNA of the potter", "Age of the clay quarry"],
       answer: 1, expl: "Surface motifs and temper/firing evidence reveal the vessel’s cultural style and technique.",
     },
     { q: "‘In situ’ means:", options: ["In museum storage", "In original place", "Under water", "Under review"], answer: 1, expl: "In situ means left in the original context, crucial for archeological integrity." },
     { q: "Clovis points are generally associated with which approximate time range?", options: ["1100–1300 CE", "900–1200 CE", "11000–10000 BCE", "500–200 BCE"], answer: 2, expl: "Clovis culture is early Paleoindian, roughly 11,000–10,000 BCE." },
     { q: "Which best describes a scraper?", options: ["Ceremonial cup", "Tool for hides/wood", "Projectile tip", "Musical instrument"], answer: 1, expl: "Scrapers were used to process hides or for woodworking; wear patterns indicate function." },
     { q: "Why avoid removing artifacts from protected lands?", options: ["It’s noisy", "It’s illegal and harms context", "It’s heavy", "It’s unlucky"], answer: 1, expl: "Removing artifacts is illegal and destroys contextual information vital to research." },
     { q: "Which culture is linked with mound-building in parts of North America?", options: ["Hopewell", "Viking", "Mycenaean", "Han"], answer: 0, expl: "Hopewell traditions include earthworks and mounds across the Midwest." },
     { q: "What does geolocation data help archeologists understand?", options: ["Mineral rights", "Contextual relationships", "Museum ticket sales", "Satellite age"], answer: 1, expl: "Coordinates help relate finds to known sites, waterways, trade routes, and construction." },
     { q: "Which material is commonly found in beads indicating trade networks?", options: ["Obsidian", "Plastic", "Aluminum", "Concrete"], answer: 0, expl: "Obsidian sourcing (and other materials) can show long-distance exchange networks." },
     { q: "Which term refers to the visible wear on a tool’s edge from use?", options: ["Patina", "Use-wear", "Luster", "Corrosion"], answer: 1, expl: "Use-wear tells how a tool was used and for what materials." },
     { q: "Mississippian culture is generally later than:", options: ["Woodland", "Industrial Revolution", "Neolithic Near East", "Roman Empire"], answer: 0, expl: "Mississippian follows Woodland; complex chiefdoms and large settlements." },
     { q: "Which mapping approach helps visualize clusters of finds?", options: ["Random walk", "Kernel density or clustering", "Analog TV plotting", "Single-point projection"], answer: 1, expl: "Density mapping and clustering visualize spatial patterns for potential sites." },
     { q: "Why is timestamp data useful?", options: ["To determine color", "To sequence finds", "To improve battery life", "To remove artifacts faster"], answer: 1, expl: "Temporal sequences help compare with known site phases and construction timelines." },
     { q: "Ancestral Puebloan sites are often associated with:", options: ["Cliff dwellings and kivas", "Moats", "Step pyramids", "Longships"], answer: 0, expl: "Distinct architecture includes cliff dwellings, kivas, and masonry structures." },
     { q: "Beavercreek, OH lies within a region historically rich in:", options: ["Hopewell earthworks", "Roman villas", "Samurai castles", "Phoenician ports"], answer: 0, expl: "The Ohio Valley features prominent Hopewell earthworks and related traditions." },
     { q: "What’s the ethical principle emphasized for civilians?", options: ["Collect aggressively", "Sell finds online", "Leave items in situ and report", "Avoid documentation"], answer: 2, expl: "Leave artifacts in place and report responsibly." },
     { q: "Pottery temper refers to:", options: ["A mood swing", "Material added to clay", "Firing temperature complaint", "Glaze pigment"], answer: 1, expl: "Temper—sand, shell, grog—changes clay properties and reveals cultural techniques." },
     { q: "Which is a common projectile point material in North America?", options: ["Basalt fiber", "Flint/chert", "Titanium", "PVC"], answer: 1, expl: "Chert and flint are knappable stones ideal for toolmaking." },
     { q: "What’s a primary benefit of crowdsourcing finds?", options: ["Higher throughput data", "Guaranteed gold", "Replace experts", "Avoid laws"], answer: 0, expl: "Crowdsourcing expands initial survey coverage while experts verify authenticity." },
     { q: "Why integrate funding and volunteering?", options: ["To bypass permits", "To engage community and offset costs", "To sell artifacts", "To avoid experts"], answer: 1, expl: "Community support helps resource digs legally and ethically." },
   ];
   
   // Generate more questions by varying structures (to build a large bank)
   function expandTrivia(base, extraCount = 80) {
     const extras = [];
     const templates = [
       (culture) => ({
         q: `Which region is commonly associated with ${culture} cultural finds?`,
         options: ["Ohio Valley", "Sahara Desert", "Antarctica", "Pacific Ocean"],
         answer: 0,
         expl: `${culture} finds are frequently documented in the Ohio Valley and surrounding areas.`,
       }),
       (type) => ({
         q: `Which toolmaking indicator helps identify a ${type}?`,
         options: ["Edge retouch", "Battery capacity", "Signal bars", "GPS lag"],
         answer: 0,
         expl: "Edge retouch and flake scars are key indicators in lithic analysis.",
       }),
       (type) => ({
         q: `Best practice when photographing a ${type}?`,
         options: ["Include scale", "Use flash only", "Crop out context", "Tilt camera heavily"],
         answer: 0,
         expl: "Include a scale and multiple angles to preserve context.",
       }),
       () => ({
         q: "Which data pair strengthens site hypotheses?",
         options: ["Timestamp + Geolocation", "Font + Color", "Screen size + Battery", "Ringtone + Volume"],
         answer: 0,
         expl: "Spatial and temporal data work together to reveal patterns.",
       }),
       () => ({
         q: "What should civilians do upon finding an artifact?",
         options: ["Leave it in situ and report", "Pocket it quickly", "Sell it online", "Bury it deeper"],
         answer: 0,
         expl: "Leaving artifacts in place preserves context and complies with laws.",
       }),
     ];
   
     for (let i = 0; i < extraCount; i++) {
       const t = pick(templates);
       const arg = Math.random() > 0.5 ? pick(CULTURES) : pick(TYPES);
       extras.push(t(arg));
     }
   
     // Add some numeric/time questions
     const timeQs = [
       {
         q: "Approximate range for many Woodland artifacts in the Midwest?",
         options: ["5000–4000 BCE", "500 BCE–200 CE", "1700–1900 CE", "15,000–14,000 BCE"],
         answer: 1,
         expl: "A common range observed is roughly 500 BCE to 200 CE, depending on context.",
       },
       {
         q: "Clovis culture timeline is best described as:",
         options: ["Holocene only", "Early Paleoindian", "Middle Ages", "Industrial era"],
         answer: 1,
         expl: "Clovis is typically early Paleoindian in North America.",
       },
       {
         q: "What is a key sign of use-wear on stone tools?",
         options: ["Micro-chipping and polish", "Brand logo", "Serial number", "Modern paint"],
         answer: 0,
         expl: "Micro-chipping and edge polish can indicate repeated use.",
       },
       {
         q: "Ethical excavation requires:",
         options: ["Permits and consultation", "Speed only", "Breaking bedrock", "Ignoring neighbors"],
         answer: 0,
         expl: "Legal permits and consultation (including with indigenous communities) are essential.",
       },
     ];
   
     return base.concat(extras).concat(timeQs);
   }
   
   AppState.trivia.questions = expandTrivia(TRIVIA_BASE, 120);
   
   function renderTrivia() {
     triviaWrap.innerHTML = "";
     AppState.trivia.score = 0;
     const frag = document.createDocumentFragment();
   
     AppState.trivia.questions.forEach((t, idx) => {
       const card = document.createElement("div");
       card.className = "trivia-q";
       card.innerHTML = `
         <div><strong>Q${idx + 1}:</strong> ${safeText(t.q)}</div>
         <div class="trivia-answers"></div>
         <div class="muted" style="margin-top:6px;">Tap an answer to reveal feedback.</div>
       `;
       const answers = card.querySelector(".trivia-answers");
   
       t.options.forEach((opt, i) => {
         const btn = document.createElement("button");
         btn.className = "answer-btn";
         btn.textContent = opt;
         btn.addEventListener("click", () => {
           const correct = i === t.answer;
           if (correct) {
             btn.classList.add("correct");
             AppState.trivia.score++;
           } else {
             btn.classList.add("wrong");
             const correctBtn = answers.querySelectorAll("button")[t.answer];
             correctBtn.classList.add("correct");
           }
           answers.querySelectorAll("button").forEach(b => (b.disabled = true));
           triviaScoreEl.textContent = `Score: ${AppState.trivia.score} / ${AppState.trivia.questions.length}`;
   
           const expl = document.createElement("div");
           expl.className = "muted";
           expl.textContent = t.expl;
           card.appendChild(expl);
         });
         answers.appendChild(btn);
       });
   
       frag.appendChild(card);
     });
   
     triviaWrap.appendChild(frag);
     triviaScoreEl.textContent = `Score: ${AppState.trivia.score} / ${AppState.trivia.questions.length}`;
   }
   renderTrivia();
   
   restartTriviaBtn.addEventListener("click", renderTrivia);
   
   /* ======================
      Navigation shortcuts
      ====================== */
   
   document.querySelectorAll(".primary, .secondary").forEach(btn => {
     const target = btn.dataset?.target;
     if (target) btn.addEventListener("click", () => showView(target));
   });
   
   // Initial view
   showView("home");
   
   /* ======================
      Presentation extras
      - Non-functional helpers to support large demo
      ====================== */
   
   // “Performance” helper to batch DOM updates (simple microtask batching)
   const DomBatch = (() => {
     let queue = [];
     let scheduled = false;
     function schedule() {
       if (scheduled) return;
       scheduled = true;
       Promise.resolve().then(() => {
         queue.forEach(fn => {
           try { fn(); } catch (e) { /* swallow for demo */ }
         });
         queue = [];
         scheduled = false;
       });
     }
     return {
       enqueue(fn) {
         queue.push(fn);
         schedule();
       },
       flush() {
         queue.forEach(fn => fn());
         queue = [];
         scheduled = false;
       },
     };
   })();
   
   // Example: enqueue a small cosmetic update for demo
   DomBatch.enqueue(() => {
     // no-op visible change; reserved for future animations
   });
   
   // “Analytics” mock (no network, just logging to console)
   const Analytics = {
     log(event, payload = {}) {
       // In a real app, this would send to an analytics endpoint
       // For demo, we keep it silent or enable console logging if needed
       // console.log(`[Analytics] ${event}`, payload);
     },
   };
   
   Analytics.log("app_init", { artifacts: AppState.artifacts.length });
   
   /* ======================
      Extended mock map interactions
      ====================== */
   
   function highlightPins(count = 5) {
     const pins = [...mapCanvas.querySelectorAll(".map-pin")];
     pins.slice(0, count).forEach(pin => {
       pin.style.outline = "2px solid rgba(234,144,16,0.8)";
       pin.style.transition = "outline 0.4s";
       setTimeout(() => (pin.style.outline = "none"), 2000);
     });
   }
   highlightPins(6);
   
   /* ======================
      Accessibility helpers
      ====================== */
   
   function focusMain() {
     const main = document.getElementById("main");
     if (main) {
       main.setAttribute("tabindex", "-1");
       main.focus();
     }
   }
   document.querySelector(".skip-link")?.addEventListener("click", focusMain);
   
   /* ======================
      Exportable presentation data (optional)
      ====================== */
   
   const Presentation = {
     userJourneys: {
       civilian: ["Discovery", "Capture", "AI assist", "Ethics", "Contribution"],
       archeologist: ["Verification", "Filtering", "Mapping", "Engagement", "Planning"],
     },
     outcomes: ["Data (crowdsourced survey)", "Community (ethical learning)", "Sites (efficient verification)"],
   };
   
   Analytics.log("presentation_ready", Presentation);
   
   /* ======================
      End of Part 3 (app.js)
      ====================== */
function movePage(place) {
  let a = document.createElement('a');
  a.href = "http://127.0.0.1:5500/"+place;
  a.click();
}