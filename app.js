let currentIndex = 0;
let currentFilter = "all";
let currentQuizIndex = 0;
let currentQuizScore = 0;
let currentQuizQuestions = [];

const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
const weakWords = JSON.parse(localStorage.getItem("weakWords") || "[]");

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const writingTabs = document.querySelectorAll(".writing-tab");

const fcHanzi = document.getElementById("fcHanzi");
const fcMeaning = document.getElementById("fcMeaning");
const fcPinyin = document.getElementById("fcPinyin");
const fcExample = document.getElementById("fcExample");

const togglePinyinBtn = document.getElementById("togglePinyinBtn");
const toggleExampleBtn = document.getElementById("toggleExampleBtn");
const speakBtn = document.getElementById("speakBtn");
const markLearnedBtn = document.getElementById("markLearnedBtn");
const nextWordBtn = document.getElementById("nextWordBtn");

const statTotal = document.getElementById("statTotal");
const statLearned = document.getElementById("statLearned");
const statRemaining = document.getElementById("statRemaining");
const statWeak = document.getElementById("statWeak");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const wordsGrid = document.getElementById("wordsGrid");
const searchInput = document.getElementById("searchInput");

const startQuizBtn = document.getElementById("startQuizBtn");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizScore = document.getElementById("quizScore");

const writingContainer = document.getElementById("writingContainer");

const resetDataBtn = document.getElementById("resetDataBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");

function saveData() {
  localStorage.setItem("learnedWords", JSON.stringify(learnedWords));
  localStorage.setItem("weakWords", JSON.stringify(weakWords));
}

function showPage(pageId) {
  pages.forEach(page => page.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

function getCurrentWord() {
  return WORDS[currentIndex];
}

function renderFlashcard() {
  const word = getCurrentWord();
  if (!word) return;

  fcHanzi.textContent = word.hanzi;
  fcMeaning.textContent = word.arabic;
  fcPinyin.textContent = word.pinyin;
  fcPinyin.style.display = "none";

  fcExample.innerHTML = `
    <strong>${word.exampleZh}</strong>
    <br>
    ${word.exampleAr}
  `;
  fcExample.style.display = "none";
}

function updateStats() {
  const total = WORDS.length;
  const learned = learnedWords.filter(word => WORDS.some(w => w.hanzi === word)).length;
  const weak = weakWords.filter(word => WORDS.some(w => w.hanzi === word)).length;
  const remaining = total - learned;
  const percent = total === 0 ? 0 : Math.round((learned / total) * 100);

  statTotal.textContent = total;
  statLearned.textContent = learned;
  statRemaining.textContent = remaining;
  statWeak.textContent = weak;
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

togglePinyinBtn.addEventListener("click", () => {
  fcPinyin.style.display = fcPinyin.style.display === "block" ? "none" : "block";
});

toggleExampleBtn.addEventListener("click", () => {
  fcExample.style.display = fcExample.style.display === "block" ? "none" : "block";
});

speakBtn.addEventListener("click", () => {
  const word = getCurrentWord();
  if (!word) return;
  if (!("speechSynthesis" in window)) {
    alert("الصوت غير مدعوم في هذا المتصفح");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(word.hanzi);
  utterance.lang = "zh-CN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
});

markLearnedBtn.addEventListener("click", () => {
  const word = getCurrentWord();
  if (!word) return;

  if (!learnedWords.includes(word.hanzi)) {
    learnedWords.push(word.hanzi);
    saveData();
    updateStats();
    renderWordsGrid();
  }

  currentIndex = (currentIndex + 1) % WORDS.length;
  renderFlashcard();
});

nextWordBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % WORDS.length;
  renderFlashcard();
});

function renderWordsGrid() {
  const searchValue = searchInput.value.trim().toLowerCase();

  let filteredWords = WORDS.filter(word => {
    const matchesSearch =
      word.hanzi.toLowerCase().includes(searchValue) ||
      word.pinyin.toLowerCase().includes(searchValue) ||
      word.arabic.toLowerCase().includes(searchValue);

    if (!matchesSearch) return false;

    if (currentFilter === "learned") {
      return learnedWords.includes(word.hanzi);
    }

    if (currentFilter === "unlearned") {
      return !learnedWords.includes(word.hanzi);
    }

    if (currentFilter === "weak") {
      return weakWords.includes(word.hanzi);
    }

    return true;
  });

  wordsGrid.innerHTML = "";

  if (filteredWords.length === 0) {
    wordsGrid.innerHTML = `<div class="muted">لا توجد نتائج</div>`;
    return;
  }

  filteredWords.forEach(word => {
    const card = document.createElement("div");
    card.className = "word-card";

    if (learnedWords.includes(word.hanzi)) {
      card.classList.add("learned");
    }

    card.innerHTML = `
      <div class="word-hanzi">${word.hanzi}</div>
      <div class="word-arabic">${word.arabic}</div>
      <div class="word-pinyin">${word.pinyin}</div>
    `;

    card.addEventListener("click", () => {
      const index = WORDS.findIndex(item => item.hanzi === word.hanzi);
      if (index !== -1) {
        currentIndex = index;
        renderFlashcard();
        showPage("flashcards");
      }
    });

    wordsGrid.appendChild(card);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(button => button.classList.remove("active"));
    btn.classList.add("active");

    renderWordsGrid();
  });
});

searchInput.addEventListener("input", renderWordsGrid);

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function buildQuizQuestions() {
  const shuffled = shuffleArray(WORDS);
  const selected = shuffled.slice(0, Math.min(10, WORDS.length));

  return selected.map(word => {
    const wrongOptions = shuffleArray(
      WORDS.filter(item => item.hanzi !== word.hanzi)
    )
      .slice(0, 3)
      .map(item => item.arabic);

    const options = shuffleArray([word.arabic, ...wrongOptions]);

    return {
      hanzi: word.hanzi,
      correctAnswer: word.arabic,
      options
    };
  });
}

function renderQuizQuestion() {
  if (currentQuizQuestions.length === 0) {
    quizQuestion.textContent = "اضغط ابدأ الكويز";
    quizOptions.innerHTML = "";
    quizScore.textContent = "0";
    return;
  }

  if (currentQuizIndex >= currentQuizQuestions.length) {
    quizQuestion.textContent = `انتهى الكويز - نتيجتك ${currentQuizScore} من ${currentQuizQuestions.length}`;
    quizOptions.innerHTML = "";
    return;
  }

  const question = currentQuizQuestions[currentQuizIndex];
  quizQuestion.textContent = `ما معنى: ${question.hanzi} ؟`;
  quizOptions.innerHTML = "";

  question.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = option;

    btn.addEventListener("click", () => {
      const allOptions = quizOptions.querySelectorAll(".quiz-option");
      allOptions.forEach(item => item.disabled = true);

      if (option === question.correctAnswer) {
        btn.classList.add("correct");
        currentQuizScore++;
      } else {
        btn.classList.add("wrong");

        const wrongWord = question.hanzi;
        if (!weakWords.includes(wrongWord)) {
          weakWords.push(wrongWord);
          saveData();
          updateStats();
          renderWordsGrid();
        }

        allOptions.forEach(item => {
          if (item.textContent === question.correctAnswer) {
            item.classList.add("correct");
          }
        });
      }

      quizScore.textContent = String(currentQuizScore);

      setTimeout(() => {
        currentQuizIndex++;
        renderQuizQuestion();
      }, 900);
    });

    quizOptions.appendChild(btn);
  });
}

startQuizBtn.addEventListener("click", () => {
  currentQuizQuestions = buildQuizQuestions();
  currentQuizIndex = 0;
  currentQuizScore = 0;
  quizScore.textContent = "0";
  renderQuizQuestion();
});

function renderWritingModel(modelKey) {
  const model = WRITING_MODELS[modelKey];
  if (!model) return;

  writingContainer.innerHTML = "";

  model.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "writing-item";

    box.innerHTML = `
      <div><strong>${index + 1}.</strong> ${item.question}</div>
      <button class="secondary-btn show-answer-btn" style="margin-top:10px;">إظهار الحل</button>
      <div class="writing-answer">${item.answer}</div>
    `;

    const showBtn = box.querySelector(".show-answer-btn");
    const answerBox = box.querySelector(".writing-answer");

    showBtn.addEventListener("click", () => {
      const isVisible = answerBox.style.display === "block";
      answerBox.style.display = isVisible ? "none" : "block";
      showBtn.textContent = isVisible ? "إظهار الحل" : "إخفاء الحل";
    });

    writingContainer.appendChild(box);
  });
}

writingTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    writingTabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    renderWritingModel(tab.dataset.model);
  });
});

resetDataBtn.addEventListener("click", () => {
  const ok = confirm("هل تريد مسح جميع بيانات التقدم؟");
  if (!ok) return;

  learnedWords.length = 0;
  weakWords.length = 0;
  saveData();
  updateStats();
  renderWordsGrid();
  alert("تم مسح التقدم");
});

exportDataBtn.addEventListener("click", async () => {
  const data = JSON.stringify({
    learnedWords,
    weakWords
  });

  try {
    await navigator.clipboard.writeText(data);
    alert("تم نسخ البيانات");
  } catch (error) {
    alert("لم يتم النسخ");
  }
});

importDataBtn.addEventListener("click", () => {
  const raw = prompt("الصق البيانات هنا");
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);

    learnedWords.length = 0;
    weakWords.length = 0;

    if (Array.isArray(parsed.learnedWords)) {
      parsed.learnedWords.forEach(item => learnedWords.push(item));
    }

    if (Array.isArray(parsed.weakWords)) {
      parsed.weakWords.forEach(item => weakWords.push(item));
    }

    saveData();
    updateStats();
    renderWordsGrid();
    alert("تم الاستيراد");
  } catch (error) {
    alert("البيانات غير صحيحة");
  }
});

renderFlashcard();
renderWordsGrid();
renderWritingModel("H41001");
updateStats();
