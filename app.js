let currentIndex = 0;
let currentFilter = "all";
let currentExamType = "listening";
let currentExamModel = "H41001";

const learnedWords = JSON.parse(localStorage.getItem("learnedWords") || "[]");
const weakWords = JSON.parse(localStorage.getItem("weakWords") || "[]");

const EXAM_LIBRARY = {
  listening: {
    H41001: {
      title: "H41001 Listening",
      status: "free",
      duration: "45 سؤال / حوالي 30 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41001-listening/"
    },
    H41002: {
      title: "H41002 Listening",
      status: "free",
      duration: "45 سؤال / حوالي 30 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41002-listening/"
    },
    H41003: {
      title: "H41003 Listening",
      status: "free",
      duration: "45 سؤال / حوالي 30 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41003-listening/"
    },
    H41004: {
      title: "H41004 Listening",
      status: "locked",
      duration: "HSK 4 Listening",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    },
    H41005: {
      title: "H41005 Listening",
      status: "locked",
      duration: "HSK 4 Listening",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    }
  },
  reading: {
    H41001: {
      title: "H41001 Reading",
      status: "free",
      duration: "40 سؤال / حوالي 40 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41001-reading/"
    },
    H41002: {
      title: "H41002 Reading",
      status: "free",
      duration: "40 سؤال / حوالي 40 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41002-reading/"
    },
    H41003: {
      title: "H41003 Reading",
      status: "free",
      duration: "40 سؤال / حوالي 40 دقيقة",
      sections: "3 أقسام",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41003-reading/"
    },
    H41004: {
      title: "H41004 Reading",
      status: "locked",
      duration: "HSK 4 Reading",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    },
    H41005: {
      title: "H41005 Reading",
      status: "locked",
      duration: "HSK 4 Reading",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    }
  },
  writing: {
    H41001: {
      title: "H41001 Writing",
      status: "free",
      duration: "15 سؤال / 25 دقيقة",
      sections: "ترتيب كلمات + صور",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41001-writing/"
    },
    H41002: {
      title: "H41002 Writing",
      status: "free",
      duration: "15 سؤال / 25 دقيقة",
      sections: "ترتيب كلمات + صور",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41002-writing/"
    },
    H41003: {
      title: "H41003 Writing",
      status: "free",
      duration: "15 سؤال / 25 دقيقة",
      sections: "ترتيب كلمات + صور",
      source: "Mandarin Bean",
      url: "https://mandarinbean.com/h41003-writing/"
    },
    H41004: {
      title: "H41004 Writing",
      status: "locked",
      duration: "HSK 4 Writing",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    },
    H41005: {
      title: "H41005 Writing",
      status: "locked",
      duration: "HSK 4 Writing",
      sections: "ظاهر في القائمة",
      source: "Mandarin Bean",
      url: null
    }
  }
};

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

function renderExamCards(examType) {
  const library = EXAM_LIBRARY[examType];
  const models = ["H41001", "H41002", "H41003", "H41004", "H41005"];

  examContent.innerHTML = `
    <div class="exam-note-box">
      ${
        examType === "listening"
          ? "قسم الاستماع مرتب هنا كنماذج خارجية جاهزة. اضغط فتح النموذج إذا كان متاحًا."
          : examType === "reading"
          ? "قسم القراءة مرتب هنا كنماذج خارجية جاهزة. اضغط فتح النموذج إذا كان متاحًا."
          : "قسم الكتابة يجمع النماذج المتاحة علنًا مع إمكانية عرض الحل داخل الموقع للنماذج المدعومة."
      }
    </div>
    <div class="exam-cards-grid" id="dynamicExamCards"></div>
  `;

  const grid = document.getElementById("dynamicExamCards");

  models.forEach((model) => {
    const item = library[model];
    const card = document.createElement("div");
    card.className = "exam-card" + (item.status === "locked" ? " locked" : "");

    const badgeClass = item.status === "locked" ? "exam-badge locked" : "exam-badge";
    const badgeText = item.status === "locked" ? "غير متاح مجانًا" : "متاح";

    let actions = "";

    if (item.url) {
      actions += `
        <a class="primary-btn" href="${item.url}" target="_blank" rel="noopener noreferrer">فتح النموذج</a>
      `;
    }

    if (examType === "writing" && WRITING_MODELS[model]) {
      actions += `
        <button class="secondary-btn open-local-writing-btn" data-model="${model}">عرض الحل داخل الموقع</button>
      `;
    }

    if (!actions) {
      actions = `
        <button class="secondary-btn" disabled>غير متاح الآن</button>
      `;
    }

    card.innerHTML = `
      <div class="exam-card-top">
        <h3>${item.title}</h3>
        <span class="${badgeClass}">${badgeText}</span>
      </div>

      <div class="exam-meta">
        <span>${item.duration}</span>
        <span>${item.sections}</span>
        <span>${item.source}</span>
      </div>

      <p class="muted">
        ${
          item.status === "locked"
            ? "هذا النموذج ظاهر في قائمة HSK 4 لكنه ليس مفتوحًا هنا في النسخة المجانية."
            : "هذا النموذج متاح علنًا، ويمكنك فتحه مباشرة من المصدر."
        }
      </p>

      <div class="exam-actions">
        ${actions}
      </div>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".open-local-writing-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentExamType = "writing";
      currentExamModel = btn.dataset.model;

      examTypeButtons.forEach((item) => {
        item.classList.toggle("active", item.dataset.examType === "writing");
      });

      examModelButtons.forEach((item) => {
        item.classList.toggle("active", item.dataset.model === currentExamModel);
      });

      renderWritingExam(currentExamModel);
    });
  });
}

function renderWritingExam(model) {
  const items = WRITING_MODELS[model];

  if (!items || items.length === 0) {
    examContent.innerHTML = `
      <div class="exam-placeholder">
        <h3>${model} - Writing</h3>
        <p>هذا النموذج غير مضاف محليًا بعد.</p>
      </div>
    `;
    return;
  }

  examContent.innerHTML = `
    <div class="exam-note-box">
      هذا العرض الداخلي يركز على مراجعة قسم الكتابة بسرعة، ويمكنك أيضًا فتح المصدر الأصلي من تبويب Writing إذا كان متاحًا.
    </div>
  `;

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
  if (currentExamType === "writing" && WRITING_MODELS[currentExamModel]) {
    renderExamCards("writing");
    return;
  }

  renderExamCards(currentExamType);
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

    if (currentExamType === "writing" && WRITING_MODELS[currentExamModel]) {
      renderWritingExam(currentExamModel);
    } else {
      renderExamContent();
    }
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
async function initApp() {
  try {
    await loadAllWords();
  } catch (error) {
    alert("فشل تحميل جميع كلمات HSK 4");
  }

  renderFlashcard();
  renderWordsList();
  renderExamContent();
  updateStats();
}

initApp();
