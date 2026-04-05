let WORDS = [];

async function loadAllWords() {
  const url = "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/inclusive/old/4.min.json";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load HSK 4 words");
  }

  const raw = await response.json();

  WORDS = raw
    .map((item) => {
      const form = Array.isArray(item.f) && item.f.length ? item.f[0] : {};
      const info = form.i || {};
      const meanings = Array.isArray(form.m) ? form.m : [];

      const hanzi = item.s || "";
      const pinyin = info.y || "";
      const arabic = meanings.length ? meanings[0] : "—";

      return {
        hanzi,
        pinyin,
        arabic,
        exampleZh: `我正在学习“${hanzi}”。`,
        exampleAr: `أنا أراجع كلمة: ${hanzi}.`
      };
    })
    .filter((word) => word.hanzi);

  return WORDS;
}
