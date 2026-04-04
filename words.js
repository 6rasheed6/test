function loadHSK4WordsSync() {
  const fallback = [
    {
      hanzi: "爱好",
      pinyin: "ài hào",
      arabic: "interest; hobby",
      exampleZh: "我的爱好是看书。",
      exampleAr: "هوايتي هي قراءة الكتب."
    },
    {
      hanzi: "帮助",
      pinyin: "bāng zhù",
      arabic: "to help; help",
      exampleZh: "谢谢你的帮助。",
      exampleAr: "شكرًا على مساعدتك."
    },
    {
      hanzi: "必须",
      pinyin: "bì xū",
      arabic: "must; have to",
      exampleZh: "你必须认真学习。",
      exampleAr: "يجب أن تدرس بجد."
    }
  ];

  try {
    const url =
      "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/wordlists/inclusive/old/4.min.json";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      const raw = JSON.parse(xhr.responseText);

      const mapped = raw
        .map((item) => {
          const form = Array.isArray(item.f) && item.f.length ? item.f[0] : {};
          const transcription = form.i || {};
          const meanings = Array.isArray(form.m) ? form.m : [];

          const hanzi = item.s || "";
          const pinyin = transcription.y || "";
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

      if (mapped.length) {
        return mapped;
      }
    }

    return fallback;
  } catch (error) {
    return fallback;
  }
}

const WORDS = loadHSK4WordsSync();
