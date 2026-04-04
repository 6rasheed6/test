let currentIndex = 0;
let currentFilter = "all";
let currentExamType = "listening";
let currentExamModel = "H41001";

const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
const weakWords = JSON.parse(localStorage.getItem("weakWords") || "[]");

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const examTypeButtons = document.querySelectorAll(".exam-type-btn");
const examModelButtons = document.querySelectorAll(".exam-model-btn");

const heroTotalWords = document.getElementById("heroTotalWords");
const heroLearnedWords = document.getElementById("heroLearnedWords");

const statTotal = document.getElementById("statTotal");
const statLearned = document.getElementById("statLearned");
const statRemaining = document.getElementById("statRemaining");
const statWeak = document.getElementById("statWeak");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const goFlashcardsBtn = document.getElementById("goFlashcardsBtn");
const goWordsBtn = document.getElementById("goWordsBtn");
const goExamsBtn = document.getElementById("goExamsBtn");

const fcHanzi = document.getElementById("fcHanzi");
const fcMeaning = document.getElementById("fcMeaning");
const fcPinyin = document.getElementById("fcPinyin");
const fcExampleBox = document.getElementById("fcExampleBox");
const fcExampleZh = document.getElementById("fcExampleZh");
const fcExampleAr = document.getElementById("fcExampleAr");
const flashcardOrder = document.getElementById("flashcardOrder");
const flashcardState = document.getElementById("flashcardState");

const togglePinyinBtn = document.getElementById("togglePinyinBtn");
const toggleExampleBtn = document.getElementById("toggleExampleBtn");
const speakWordBtn = document.getElementById("speakWordBtn");
const speakExampleBtn = document.getElementById("speakExampleBtn");
const markLearnedBtn = document.getElementById("markLearnedBtn");
const prevWordBtn = document.getElementById("prevWordBtn");
const nextWordBtn = document.getElementById("nextWordBtn");

const searchInput = document.getElementById("searchInput");
const wordsList = document.getElementById("wordsList");

const examContent = document.getElementById("examContent");

const resetDataBtn = document.getElementById("resetDataBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");

function saveData() {
  localStorage.setItem("learnedWords", JSON.stringify(learnedWords));
  localStorage.setItem("weakWords", JSON.stringify(weakWords));
}

function isLearned(hanzi) {
  return learnedWords.includes(hanzi);
}

function isWeak(hanzi) {
  return weakWords.includes(hanzi);
}

function updateStats() {
  const total = WORDS.length;
  const learned = learnedWords.filter((item) => WORDS.some((w) => w.hanzi === item)).length;
  const weak = weakWords.filter((item) => WORDS.some((w) => w.hanzi === item)).length;
  const remaining = total - learned;
  const percent = total ? Math.round((learned / total) * 100) : 0;

  heroTotalWords.textContent = total;
  heroLearnedWords.textContent = learned;

  statTotal.textContent = total;
  statLearned.textContent = learned;
  statRemaining.textContent = remaining;
  statWeak.textContent = weak;
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

function showPage(pageId) {
  pages.forEach((page) => page.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});

goFlashcardsBtn.addEventListener("click", () => showPage("flashcards"));
goWordsBtn.addEventListener("click", () => showPage("words"));
goExamsBtn.addEventListener("click", () => showPage("exams"));

function currentWord() {
  return WORDS[currentIndex];
}

function updateFlashcardState() {
  const word = currentWord();
  if (!word) return;

  flashcardOrder.textContent = `#${currentIndex + 1}`;
  flashcardState.textContent = isLearned(word.hanzi) ? "تعلمتها" : "جديدة";
}

function renderFlashcard() {
  const word = currentWord();
  if (!word) return;

  fcHanzi.textContent = word.hanzi;
  fcMeaning.textContent = word.arabic;
  fcPinyin.textContent = word.pinyin;
  fcPinyin.style.display = "none";

  fcExampleZh.textContent = word.exampleZh;
  fcExampleAr.textContent = word.exampleAr;
  fcExampleBox.style.display = "none";

  updateFlashcardState();
  updateStats();
}

togglePinyinBtn.addEventListener("click", () => {
  fcPinyin.style.display = fcPinyin.style.display === "block" ? "none" : "block";
});

toggleExampleBtn.addEventListener("click", () => {
  fcExampleBox.style.display = fcExampleBox.style.display === "block" ? "none" : "block";
});

function speakText(text, lang = "zh-CN") {
  if (!("speechSynthesis" in window)) {
    alert("الصوت غير مدعوم في هذا المتصفح");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

speakWordBtn.addEventListener("click", () => {
  const word = currentWord();
  if (!word) return;
  speakText(word.hanzi, "zh-CN");
});

speakExampleBtn.addEventListener("click", () => {
  const word = currentWord();
  if (!word) return;
  speakText(word.exampleZh, "zh-CN");
});

markLearnedBtn.addEventListener("click", () => {
  const word = currentWord();
  if (!word) return;

  if (!learnedWords.includes(word.hanzi)) {
    learnedWords.push(word.hanzi);
    saveData();
  }

  updateStats();
  renderWordsList();

  currentIndex = (currentIndex + 1) % WORDS.length;
  renderFlashcard();
});

prevWordBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + WORDS.length) % WORDS.length;
  renderFlashcard();
});

nextWordBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % WORDS.length;
  renderFlashcard();
});

function renderWordsList() {
  const searchValue = searchInput.value.trim().toLowerCase();

  const filteredWords = WORDS.filter((word) => {
    const matchesSearch =
      word.hanzi.toLowerCase().includes(searchValue) ||
      word.pinyin.toLowerCase().includes(searchValue) ||
      word.arabic.toLowerCase().includes(searchValue);

    if (!matchesSearch) return false;

    if (currentFilter === "learned") return isLearned(word.hanzi);
    if (currentFilter === "unlearned") return !isLearned(word.hanzi);
    if (currentFilter === "weak") return isWeak(word.hanzi);

    return true;
  });

  wordsList.innerHTML = "";

  if (filteredWords.length === 0) {
    wordsList.innerHTML = `<div class="muted">لا توجد نتائج</div>`;
    return;
  }

  filteredWords.forEach((word) => {
    const realIndex = WORDS.findIndex((item) => item.hanzi === word.hanzi);

    const box = document.createElement("div");
    box.className = "word-detail-card";
    if (isLearned(word.hanzi)) {
      box.classList.add("learned");
    }

    box.innerHTML = `
      <div class="word-number-box">
        <div class="word-number">#${realIndex + 1}</div>
        <div class="word-hanzi-big">${word.hanzi}</div>
      </div>

      <div>
        <div class="word-content-top">
          <div class="word-main-info">
            <h3>${word.hanzi}</h3>
            <p class="word-pinyin">${word.pinyin}</p>
            <p class="word-meaning">${word.arabic}</p>
          </div>
        </div>

        <div class="word-example">
          <div class="word-example-zh">${word.exampleZh}</div>
          <div class="word-example-ar">${word.exampleAr}</div>
        </div>

        <div class="word-actions">
          <button class="small-btn primary go-flash-btn">فتح في الفلاش كارد</button>
          <button class="small-btn" data-speak-word>صوت الكلمة</button>
          <button class="small-btn" data-speak-example>صوت الجملة</button>
          <button class="small-btn success mark-learned-list-btn">تعلمتها</button>
          <button class="small-btn warning mark-weak-btn">ضعيفة</button>
        </div>
      </div>
    `;

    box.querySelector(".go-flash-btn").addEventListener("click", () => {
      currentIndex = realIndex;
      renderFlashcard();
      showPage("flashcards");
    });

    box.querySelector("[data-speak-word]").addEventListener("click", () => {
      speakText(word.hanzi, "zh-CN");
    });

    box.querySelector("[data-speak-example]").addEventListener("click", () => {
      speakText(word.exampleZh, "zh-CN");
    });

    box.querySelector(".mark-learned-list-btn").addEventListener("click", () => {
      if (!learnedWords.includes(word.hanzi)) {
        learnedWords.push(word.hanzi);
        saveData();
        updateStats();
        renderWordsList();
        renderFlashcard();
      }
    });

    box.querySelector(".mark-weak-btn").addEventListener("click", () => {
      if (!weakWords.includes(word.hanzi)) {
        weakWords.push(word.hanzi);
        saveData();
        updateStats();
        renderWordsList();
      }
    });

    wordsList.appendChild(box);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    renderWordsList();
  });
});

searchInput.addEventListener("input", renderWordsList);

function renderListeningExam(model) {
  examContent.innerHTML = `
    <div class="exam-placeholder">
      <h3>${model} - Listening</h3>
      <p>
        ضع هنا لاحقًا روابط ملفات الاستماع وأسئلة كل نموذج.
        الصفحة الآن مهيأة ومقسمة بشكل صحيح للاستماع.
      </p>
    </div>
  `;
}

function renderReadingExam(model) {
  examContent.innerHTML = `
    <div class="exam-placeholder">
      <h3>${model} - Reading</h3>
      <p>
        ضع هنا لاحقًا أسئلة القراءة الكاملة لكل نموذج.
        الصفحة الآن مهيأة ومقسمة بشكل صحيح للقراءة.
      </p>
    </div>
  `;
}

function renderWritingExam(model) {
  const items = WRITING_MODELS[model];

  if (!items || items.length === 0) {
    examContent.innerHTML = `
      <div class="exam-placeholder">
        <h3>${model} - Writing</h3>
        <p>هذا النموذج غير مضاف بعد في الملف الحالي.</p>
      </div>
    `;
    return;
  }

  examContent.innerHTML = "";

  items.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "exam-writing-item";

    box.innerHTML = `
      <h3>السؤال ${index + 1}</h3>
      <p>${item.question}</p>
      <button class="secondary-btn show-answer-btn">إظهار الحل</button>
      <div class="writing-answer">${item.answer}</div>
    `;

    const answerBtn = box.querySelector(".show-answer-btn");
    const answerBox = box.querySelector(".writing-answer");

    answerBtn.addEventListener("click", () => {
      const isVisible = answerBox.style.display === "block";
      answerBox.style.display = isVisible ? "none" : "block";
      answerBtn.textContent = isVisible ? "إظهار الحل" : "إخفاء الحل";
    });

    examContent.appendChild(box);
  });
}

function renderExamContent() {
  if (currentExamType === "listening") {
    renderListeningExam(currentExamModel);
    return;
  }

  if (currentExamType === "reading") {
    renderReadingExam(currentExamModel);
    return;
  }

  renderWritingExam(currentExamModel);
}

examTypeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentExamType = btn.dataset.examType;
    examTypeButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    renderExamContent();
  });
});

examModelButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentExamModel = btn.dataset.model;
    examModelButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    renderExamContent();
  });
});

resetDataBtn.addEventListener("click", () => {
  const ok = confirm("هل تريد مسح التقدم؟");
  if (!ok) return;

  learnedWords.length = 0;
  weakWords.length = 0;
  saveData();
  updateStats();
  renderWordsList();
  renderFlashcard();
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
    alert("فشل النسخ");
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
      parsed.learnedWords.forEach((item) => learnedWords.push(item));
    }

    if (Array.isArray(parsed.weakWords)) {
      parsed.weakWords.forEach((item) => weakWords.push(item));
    }

    saveData();
    updateStats();
    renderWordsList();
    renderFlashcard();
    alert("تم الاستيراد");
  } catch (error) {
    alert("البيانات غير صحيحة");
  }
});

renderFlashcard();
renderWordsList();
renderExamContent();
updateStats();
