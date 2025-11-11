const opportunities = [
    { name: "Archaeological Institute of America", url: "https://www.archaeological.org/programs/public/volunteer/" },
    { name: "American Historical Association – Careers In History", url: "https://www.historians.org/jobs-and-volunteering" },
    { name: "Archaeological Conservancy – Volunteer Opportunities", url: "https://www.archaeologicalconservancy.org/volunteer/" },
    { name: "National Park Service – Heritage Volunteering", url: "https://www.nps.gov/getinvolved/volunteer.htm" }
  ];
  
  const listEl = document.getElementById("volunteer-list");
  const searchInput = document.getElementById("search-input");
  const signupBtn = document.getElementById("signup-btn");
  const leaderboardList = document.getElementById("leaderboard-list");
  
  function renderList(items) {
    listEl.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.textContent = item.name;
      li.appendChild(a);
      listEl.appendChild(li);
    });
  }
  
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = opportunities.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    renderList(filtered);
  });
  
  // Fake leaderboard data
  const leaderboard = [
    { name: "Alice", hours: 120 },
    { name: "Bob", hours: 95 },
    { name: "Charlie", hours: 80 }
  ];
  
  function renderLeaderboard() {
    leaderboardList.innerHTML = "";
    leaderboard.forEach(vol => {
      const li = document.createElement("li");
      li.textContent = `${vol.name} — ${vol.hours} hrs`;
      leaderboardList.appendChild(li);
    });
  }
  
  // Sign-up form handler
  signupBtn.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim