// Basic state
const state = {
    questions: [],
    currentIndex: 0,
    score: 0,
    total: 0,
    difficulty: 'easy',
    answered: false
  };
  
  // Question bank (Archaeology-themed) with three difficulty levels
  const QUESTION_BANK = {
    easy: [
      {
        q: "What do archaeologists primarily study?",
        choices: ["Ancient plants", "Human history through material remains", "Astronomical objects", "Marine biology"],
        correctIndex: 1,
        note: "Archaeology focuses on human history and prehistory via artifacts, features, and sites."
      },
      {
        q: "Which tool is famously associated with careful excavation?",
        choices: ["Jackhammer", "Paintbrush", "Bulldozer", "Chainsaw"],
        correctIndex: 1,
        note: "Soft brushes help gently remove soil from delicate artifacts."
      },
      {
        q: "A shard of ancient pottery is commonly called a…",
        choices: ["Flake", "Shard", "Sherd", "Pebble"],
        correctIndex: 2,
        note: "In archaeology, ‘sherd’ refers to broken pottery fragments."
      },
      {
        q: "What is carbon-14 dating used for?",
        choices: ["Measuring metal purity", "Dating organic remains", "Mapping trade routes", "Polishing artifacts"],
        correctIndex: 1,
        note: "Radiocarbon dating estimates ages of organic materials up to ~50,000 years."
      },
      {
        q: "Where are the famous pyramids of Giza?",
        choices: ["Mexico", "Peru", "Egypt", "China"],
        correctIndex: 2,
        note: "The Giza Plateau in Egypt holds three major pyramids and the Sphinx."
      }
    ],
    medium: [
      {
        q: "Which layer is the oldest in a typical undisturbed stratigraphic sequence?",
        choices: ["Top layer", "Middle layer", "Bottom layer", "All layers are same age"],
        correctIndex: 2,
        note: "Law of superposition: deeper undisturbed layers are older."
      },
      {
        q: "What term describes a man-made feature like a wall or pit at a site?",
        choices: ["Ecofact", "Feature", "Artifact", "Lithic"],
        correctIndex: 1,
        note: "Features are non-portable evidence of human activity."
      },
      {
        q: "‘Lithics’ in archaeology refers to the study of…",
        choices: ["Bones", "Stone tools and debris", "Textiles", "Metals"],
        correctIndex: 1,
        note: "Lithic analysis focuses on stone artifacts like flakes and blades."
      },
      {
        q: "Which civilization built Machu Picchu?",
        choices: ["Aztec", "Inca", "Maya", "Olmec"],
        correctIndex: 1,
        note: "Machu Picchu sits in the Peruvian Andes and is attributed to the Inca."
      },
      {
        q: "Dendrochronology is dating based on…",
        choices: ["Volcanic ash layers", "Tree-ring patterns", "Ice cores", "Stellar positions"],
        correctIndex: 1,
        note: "Tree rings record annual growth, enabling precise dating in some contexts."
      }
    ],
    hard: [
      {
        q: "The ‘Clovis-first’ model proposed what about the peopling of the Americas?",
        choices: [
          "Multiple migrations beginning 30,000 years ago",
          "Earliest widespread culture around 13,000 years ago",
          "Settlement exclusively via Pacific boat routes",
          "Peopling only during the Medieval Warm Period"
        ],
        correctIndex: 1,
        note: "Clovis culture was once thought the earliest widespread evidence ~13,000 years BP."
      },
      {
        q: "What is the primary advantage of Bayesian calibration in radiocarbon dating?",
        choices: [
          "Ignoring measurement error",
          "Combining prior stratigraphic info with radiocarbon data",
          "Faster lab processing",
          "Eliminates calibration curves"
        ],
        correctIndex: 1,
        note: "Bayesian models incorporate stratigraphic/phase info to refine calibrated age estimates."
      },
      {
        q: "Gobekli Tepe is notable for being…",
        choices: [
          "A Bronze Age palace",
          "An early Neolithic monumental site with T-shaped pillars",
          "A Roman amphitheater",
          "A Viking longhouse"
        ],
        correctIndex: 1,
        note: "Gobekli Tepe (Turkey) dates to the PPNA/PPNB with monumental enclosures."
      },
      {
        q: "In zooarchaeology, NISP refers to…",
        choices: [
          "Number of Identified Skeletal Parts",
          "Net Inventory of Sampled Pieces",
          "Number of Identified Specimens",
          "Normalized Index of Species Presence"
        ],
        correctIndex: 2,
        note: "NISP counts identified specimens; often contrasted with MNI."
      },
      {
        q: "The ‘Uluburun’ shipwreck yielded extensive evidence of…",
        choices: [
          "Iron Age trans-Saharan trade",
          "Late Bronze Age Mediterranean exchange networks",
          "Viking-era Baltic commerce",
          "Neolithic riverine transport"
        ],
        correctIndex: 1,
        note: "Uluburun (14th c. BCE) carried copper ingots, glass, resins, and luxury goods."
      }
    ]
  };
  
  // DOM refs
  const els = {
    nav: document.querySelector('.app-nav'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    difficulty: document.getElementById('difficulty'),
    questionCount: document.getElementById('questionCount'),
    game: document.getElementById('game'),
    qIndex: document.getElementById('qIndex'),
    qTotal: document.getElementById('qTotal'),
    score: document.getElementById('score'),
    diffLabel: document.getElementById('diffLabel'),
    questionText: document.getElementById('questionText'),
    answers: document.getElementById('answers'),
    feedback: document.getElementById('feedback'),
    nextBtn: document.getElementById('nextBtn'),
    finishBtn: document.getElementById('finishBtn'),
    summary: document.getElementById('summary'),
    sumTotal: document.getElementById('sumTotal'),
    sumCorrect: document.getElementById('sumCorrect'),
    sumAccuracy: document.getElementById('sumAccuracy'),
    playAgainBtn: document.getElementById('playAgainBtn')
  };
  
  function shuffle(arr) {
    return arr
      .map((x) => ({ x, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(({ x }) => x);
  }
  
  function selectQuestions(level, count) {
    const bank = QUESTION_BANK[level];
    const pool = shuffle(bank);
    // If requested more than available, cycle through shuffled pool
    const out = [];
    while (out.length < count) {
      out.push(pool[out.length % pool.length]);
    }
    return out;
  }
  
  function startGame() {
    state.difficulty = els.difficulty.value;
    const count = parseInt(els.questionCount.value, 10);
  
    state.questions = selectQuestions(state.difficulty, count);
    state.currentIndex = 0;
    state.score = 0;
    state.total = count;
    state.answered = false;
  
    els.diffLabel.textContent = capitalize(state.difficulty);
    els.qIndex.textContent = 1;
    els.qTotal.textContent = state.total;
    els.score.textContent = 0;
  
    els.game.classList.remove('hidden');
    els.summary.classList.add('hidden');
    els.resetBtn.disabled = false;
    els.nextBtn.disabled = true;
    els.finishBtn.classList.add('hidden');
    els.feedback.textContent = '';
  
    renderQuestion();
  }
  
  function renderQuestion() {
    const q = state.questions[state.currentIndex];
    els.questionText.textContent = q.q;
  
    // Build answer buttons
    els.answers.innerHTML = '';
    const indices = shuffle([0,1,2,3]);
    indices.forEach((i) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = q.choices[i];
      btn.addEventListener('click', () => onAnswer(i));
      els.answers.appendChild(btn);
    });
  
    state.answered = false;
    els.nextBtn.disabled = true;
    els.feedback.textContent = '';
  }
  
  function onAnswer(selectedIndex) {
    if (state.answered) return;
    state.answered = true;
  
    const q = state.questions[state.currentIndex];
    const buttons = Array.from(document.querySelectorAll('.answer-btn'));
  
    buttons.forEach((btn, idx) => {
      const actualIndex = mapButtonIndexToChoiceIndex(idx);
      // We need to compare displayed text to choice because we shuffled buttons
      const isCorrect = btn.textContent === q.choices[q.correctIndex];
      if (isCorrect) btn.classList.add('correct');
      if (!isCorrect && btn.textContent === q.choices[selectedIndex]) {
        btn.classList.add('incorrect');
      }
    });
  
    const correctText = q.choices[q.correctIndex];
    const pickedText = q.choices[selectedIndex];
  
    if (pickedText === correctText) {
      state.score++;
      els.score.textContent = state.score;
      els.feedback.textContent = `Correct! ${q.note}`;
    } else {
      els.feedback.textContent = `Not quite. Correct answer: "${correctText}". ${q.note}`;
    }
  
    const isLast = state.currentIndex === state.total - 1;
    els.nextBtn.disabled = isLast;
    els.finishBtn.classList.toggle('hidden', !isLast);
    if (!isLast) {
      els.nextBtn.focus();
    }
  }
  
  // Helper to align visual index to choice index (not strictly needed with text comparison)
  function mapButtonIndexToChoiceIndex(idx) {
    return idx;
  }
  
  function nextQuestion() {
    if (state.currentIndex < state.total - 1) {
      state.currentIndex++;
      els.qIndex.textContent = state.currentIndex + 1;
      renderQuestion();
    }
  }
  
  function finishGame() {
    els.game.classList.add('hidden');
    els.summary.classList.remove('hidden');
  
    els.sumTotal.textContent = state.total;
    els.sumCorrect.textContent = state.score;
    const accuracy = Math.round((state.score / state.total) * 100);
    els.sumAccuracy.textContent = `${accuracy}%`;
  }
  
  function resetGame() {
    state.questions = [];
    state.currentIndex = 0;
    state.score = 0;
    state.total = 0;
    state.answered = false;
  
    els.qIndex.textContent = 0;
    els.qTotal.textContent = 0;
    els.score.textContent = 0;
    els.feedback.textContent = '';
  
    els.game.classList.add('hidden');
    els.summary.classList.add('hidden');
    els.resetBtn.disabled = true;
    els.finishBtn.classList.add('hidden');
    els.nextBtn.disabled = true;
  }
  
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  
  // Event wiring
  els.startBtn.addEventListener('click', startGame);
  els.resetBtn.addEventListener('click', resetGame);
  els.nextBtn.addEventListener('click', nextQuestion);
  els.finishBtn.addEventListener('click', finishGame);
  els.playAgainBtn.addEventListener('click', () => {
    resetGame();
    startGame();
  });