// Navigation handler
function movePage(url) {
  console.log("Navigating to:", url);
  // For demo purposes, just log. In production:
  window.location.href = url;
}

// Animate counters
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-count");
    let count = 0;
    const step = Math.ceil(target / 100); // smooth increments
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.innerText = target;
        clearInterval(interval);
      } else {
        counter.innerText = count;
      }
    }, 30);
  });
}

// Smooth scroll fallback (if staying on same page)
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Highlight active nav button
function highlightActive() {
  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    const target = btn.getAttribute("data-target");
    if (window.location.href.includes(target)) {
      btn.classList.add("active");
    }
  });
}

// Accessibility: keyboard support
function enableKeyboardNav() {
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("keyup", e => {
      if (e.key === "Enter" || e.key === " ") {
        btn.click();
      }
    });
  });
}
