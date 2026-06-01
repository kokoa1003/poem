const STORAGE_KEY = "poetry-moment-saved";

const emotions = [
  {
    id: "calm",
    label: "落ち着いてる",
    hint: "静かな呼吸",
    tone: "#76a99b",
    nouns: ["湯気", "窓辺", "白い皿", "朝の水", "遠い鐘"],
    verbs: ["ほどける", "沈んでいく", "並んでいる", "待っている", "息をする"],
    endings: ["急がなくていいと、机が言う", "何も起きない時間が、少し光る"],
  },
  {
    id: "bright",
    label: "明るい",
    hint: "光が増える",
    tone: "#f3b33d",
    nouns: ["自転車", "レモン", "昼の雲", "笑い声", "開いたドア"],
    verbs: ["跳ねる", "走りだす", "まぶしくなる", "手を振る", "転がる"],
    endings: ["今日はまだ、何にでもなれる", "名前を呼ばれる前に、心が返事をする"],
  },
  {
    id: "dark",
    label: "暗い",
    hint: "影の奥",
    tone: "#53617c",
    nouns: ["帰り道", "消えた電灯", "濡れた靴", "夜の壁", "閉じた本"],
    verbs: ["黙っている", "重くなる", "沈む", "にじむ", "ほどけない"],
    endings: ["それでも小さな音だけは、まだ残っている", "暗さは、見えないものを隠してくれる"],
  },
  {
    id: "sad",
    label: "悲しい",
    hint: "こぼれそう",
    tone: "#d8647f",
    nouns: ["空席", "雨粒", "古い写真", "言えなかった言葉", "冷めた紅茶"],
    verbs: ["こぼれる", "遠ざかる", "揺れている", "戻らない", "滲んでいく"],
    endings: ["泣かなかったぶんだけ、空が低くなる", "なくしたものの形で、手のひらが静かになる"],
  },
  {
    id: "fun",
    label: "楽しい",
    hint: "弾む足音",
    tone: "#4f8d6b",
    nouns: ["紙吹雪", "坂道", "アイスの棒", "音楽", "色鉛筆"],
    verbs: ["はみ出す", "歌いだす", "回る", "笑いころげる", "ほどける"],
    endings: ["理由なんて、あとから追いつけばいい", "世界が少しだけ、こちらへ身を乗り出す"],
  },
  {
    id: "young",
    label: "幼い",
    hint: "小さな発見",
    tone: "#8db9e6",
    nouns: ["ポケット", "ビー玉", "給食袋", "小さな石", "昼寝のあと"],
    verbs: ["光る", "ころがる", "ふくらむ", "隠れる", "見つかる"],
    endings: ["知らないことが、宝物みたいに増えていく", "小さな声でも、ちゃんと空まで届く"],
  },
  {
    id: "adult",
    label: "大人",
    hint: "静かな判断",
    tone: "#8b7563",
    nouns: ["鍵束", "午後の会議", "革靴", "二杯目の珈琲", "未送信のメール"],
    verbs: ["選び直す", "黙って置く", "折り合う", "見送る", "ほどく"],
    endings: ["正しさより先に、やさしさを置く日もある", "飲み込んだ言葉が、明日の輪郭になる"],
  },
  {
    id: "pale",
    label: "淡い",
    hint: "消えそうな色",
    tone: "#b6a8d8",
    nouns: ["薄い月", "洗いたてのシャツ", "春の端", "透明な封筒", "朝焼け"],
    verbs: ["透ける", "ほどける", "漂う", "かすれる", "混ざる"],
    endings: ["強くない光でも、部屋はちゃんと明るくなる", "消えそうなものほど、目が離せない"],
  },
];

const voiceWords = {
  neutral: ["そっと", "ゆっくり", "ふいに", "まだ", "すこし"],
  young: ["きらきら", "こっそり", "なんでかな", "ちいさく", "もういっかい"],
  adult: ["静かに", "たしかに", "それでも", "ふと", "今日も"],
};

const middleImages = {
  calm: ["空気の角が丸くなる", "時計の音までやわらかい"],
  bright: ["光が靴ひもを結び直す", "胸の窓が大きく開く"],
  dark: ["影が言葉の背中をなでる", "見えない場所で火が小さく残る"],
  sad: ["涙になる前の水が揺れる", "名前のない寂しさが座っている"],
  fun: ["足音が先に笑っている", "世界の端が少し跳ねる"],
  young: ["知らない色がふえる", "秘密が手の中であたたかい"],
  adult: ["言えなかった気持ちを置いてみる", "選ばなかった道にも灯りがある"],
  pale: ["消えそうな色が息をする", "うすい光が手紙になる"],
};

const state = {
  selectedEmotionId: "calm",
  currentPoem: "",
  savedPoems: loadSavedPoems(),
};

const elements = {
  emotionGrid: document.querySelector("#emotion-grid"),
  intensityRange: document.querySelector("#intensity-range"),
  voiceSelect: document.querySelector("#voice-select"),
  topicInput: document.querySelector("#topic-input"),
  poemCard: document.querySelector("#poem-card"),
  poemEmotionLabel: document.querySelector("#poem-emotion-label"),
  poemText: document.querySelector("#poem-text"),
  generateButton: document.querySelector("#generate-button"),
  randomButton: document.querySelector("#random-button"),
  saveButton: document.querySelector("#save-button"),
  copyButton: document.querySelector("#copy-button"),
  clearButton: document.querySelector("#clear-button"),
  savedList: document.querySelector("#saved-list"),
};

initialize();

function initialize() {
  renderEmotionButtons();
  attachEventListeners();
  generatePoem();
  renderSavedPoems();
}

function attachEventListeners() {
  elements.generateButton.addEventListener("click", generatePoem);
  elements.randomButton.addEventListener("click", selectRandomEmotion);
  elements.saveButton.addEventListener("click", saveCurrentPoem);
  elements.copyButton.addEventListener("click", copyCurrentPoem);
  elements.clearButton.addEventListener("click", clearSavedPoems);
  elements.intensityRange.addEventListener("input", generatePoem);
  elements.voiceSelect.addEventListener("change", generatePoem);
  elements.topicInput.addEventListener("input", debounce(generatePoem, 250));
}

function renderEmotionButtons() {
  elements.emotionGrid.innerHTML = "";

  for (const emotion of emotions) {
    const button = document.createElement("button");
    button.className = "emotion-button";
    button.type = "button";
    button.style.setProperty("--tone", emotion.tone);
    button.setAttribute("aria-pressed", String(emotion.id === state.selectedEmotionId));
    button.innerHTML = `<strong>${emotion.label}</strong><span>${emotion.hint}</span>`;
    button.addEventListener("click", () => {
      state.selectedEmotionId = emotion.id;
      renderEmotionButtons();
      generatePoem();
    });
    elements.emotionGrid.append(button);
  }
}

function generatePoem() {
  const emotion = getSelectedEmotion();
  const intensity = Number(elements.intensityRange.value);
  const topic = elements.topicInput.value.trim();
  const voice = elements.voiceSelect.value;
  const seed = Date.now() + Math.floor(Math.random() * 9999);
  const word = topic || pick(emotion.nouns, seed);
  const noun = pick(emotion.nouns, seed + intensity);
  const verb = pick(emotion.verbs, seed + intensity * 3);
  const voiceWord = pick(voiceWords[voice], seed + intensity * 5);
  const ending = pick(emotion.endings, seed + intensity * 7);
  const lineCount = Math.min(5, Math.max(3, intensity));
  const lines = [
    `${voiceWord}、${word}が${verb}`,
    `${noun}のそばで`,
    buildMiddleLine(emotion, intensity, voice, seed),
    ending,
  ];

  if (lineCount === 5) {
    lines.splice(3, 0, buildExtraLine(emotion, voice, seed));
  }

  state.currentPoem = lines.slice(0, lineCount).join("\n");
  elements.poemText.textContent = state.currentPoem;
  elements.poemEmotionLabel.textContent = emotion.label;
  elements.poemCard.style.setProperty("--tone", emotion.tone);
}

function buildMiddleLine(emotion, intensity, voice, seed) {
  const scales = ["ほんの少し", "指先ほど", "胸の奥まで", "空いっぱいに", "言葉になる前から"];
  const scale = scales[intensity - 1] || scales[2];

  if (voice === "young") {
    return `${scale}、まだ知らない色がふえる`;
  }

  if (voice === "adult") {
    return `${scale}、言えなかった気持ちを置いてみる`;
  }

  return `${scale}、${pick(middleImages[emotion.id], seed)}`;
}

function buildExtraLine(emotion, voice, seed) {
  if (voice === "young") {
    return `ポケットの中で、${pick(emotion.nouns, seed + 11)}が返事をする`;
  }

  if (voice === "adult") {
    return `予定表の外で、${pick(emotion.nouns, seed + 13)}が深呼吸する`;
  }

  return `${pick(emotion.nouns, seed + 17)}だけが、今日の秘密を知っている`;
}

function selectRandomEmotion() {
  const currentIndex = emotions.findIndex((emotion) => emotion.id === state.selectedEmotionId);
  const nextEmotions = emotions.filter((_, index) => index !== currentIndex);
  state.selectedEmotionId = pick(nextEmotions, Date.now()).id;
  renderEmotionButtons();
  generatePoem();
}

function saveCurrentPoem() {
  const emotion = getSelectedEmotion();
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    emotion: emotion.label,
    text: state.currentPoem,
  };

  state.savedPoems = [item, ...state.savedPoems].slice(0, 6);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedPoems));
  renderSavedPoems();
}

async function copyCurrentPoem() {
  try {
    await navigator.clipboard.writeText(state.currentPoem);
    elements.copyButton.textContent = "✓";
    window.setTimeout(() => {
      elements.copyButton.textContent = "□";
    }, 900);
  } catch (error) {
    window.alert("コピーできませんでした。詩を選択してコピーしてください。");
  }
}

function clearSavedPoems() {
  state.savedPoems = [];
  window.localStorage.removeItem(STORAGE_KEY);
  renderSavedPoems();
}

function renderSavedPoems() {
  elements.savedList.innerHTML = "";

  if (state.savedPoems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "気に入った詩を「残す」と、ここに並びます。";
    elements.savedList.append(empty);
    return;
  }

  for (const item of state.savedPoems) {
    const article = document.createElement("article");
    article.className = "saved-poem";
    const label = document.createElement("small");
    const poem = document.createElement("p");
    label.textContent = item.emotion;
    poem.textContent = item.text;
    article.append(label, poem);
    elements.savedList.append(article);
  }
}

function getSelectedEmotion() {
  return emotions.find((emotion) => emotion.id === state.selectedEmotionId) || emotions[0];
}

function loadSavedPoems() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function pick(items, seed) {
  return items[Math.abs(seed) % items.length];
}

function debounce(callback, delay) {
  let timerId = null;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
}
