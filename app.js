const LABELS = ["一", "二", "三", "四"];
const KEY = "storybook-progress-v1";

function practiced() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{"practiced":[]}').practiced || [];
  } catch {
    return [];
  }
}
function mark(id) {
  const data = { practiced: practiced() };
  if (!data.practiced.includes(id)) {
    data.practiced.push(id);
    localStorage.setItem(KEY, JSON.stringify(data));
  }
}

function storyById(id) {
  return window.STORIES.find((s) => s.id === id);
}
function nextId(id) {
  const i = window.STORIES.findIndex((s) => s.id === id);
  return window.STORIES[(i + 1) % window.STORIES.length].id;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

function parseHash() {
  const raw = (location.hash || "#/").replace(/^#/, "") || "/";
  const parts = raw.split("/").filter(Boolean);
  if (parts[0] === "guide") return { page: "guide" };
  if (parts[0] === "intro") return { page: "intro" };
  if (parts[0] === "interview") return { page: "interview" };
  if (parts[0] === "story" && parts[1]) return { page: "story", id: parts[1] };
  return { page: "home" };
}

function comic(story, revealed, hints, compact) {
  return `<div class="comic${compact ? " compact" : ""}">${story.panels
    .map((p, i) => {
      const vis = i < revealed;
      return `<button class="cell" data-zoom="${i}" ${vis ? "" : "disabled"}>
        <span class="stamp">${LABELS[i]}</span>
        ${
          vis
            ? `<img class="panel-img pop-in" src="${p.image}" alt="第${LABELS[i]}格：${escapeHtml(p.caption)}">`
            : `<div class="hidden-panel"><span class="pulse-q">？</span></div>`
        }
        ${vis && hints ? `<span class="hint">${escapeHtml(p.hint)}</span>` : ""}
      </button>`;
    })
    .join("")}</div>`;
}

function home() {
  const done = practiced();
  return `<main class="wrap">
    <section class="hero">
      <div>
        <p class="kicker">K3 升小面試練習</p>
        <h1>看圖說故事<span>四格漫畫練習簿</span></h1>
        <p class="muted">六則日常生活故事，對應香港升小面試最常見的看圖說故事。學生按格觀察、按順序說，老師可即時用範文和提問來帶。</p>
        <div class="row" style="margin-top:1.25rem">
          <a class="btn btn-primary" href="#/story/${window.STORIES[0].id}">開始第一則</a>
          <a class="btn btn-secondary" href="#/intro">練習自我介紹</a>
          <a class="btn btn-secondary" href="#/interview">模擬面試</a>
          <a class="btn btn-ghost" href="#/guide">怎樣說一段好故事</a>
        </div>
      </div>
      <div class="chars">
        <figure class="floaty">
          <img class="panel-img" src="comics/chars/lele.jpg" alt="樂樂">
          <figcaption>樂樂</figcaption>
        </figure>
        <figure class="floaty" style="animation-delay:.6s">
          <img class="panel-img" src="comics/chars/anan.jpg" alt="安安">
          <figcaption>安安</figcaption>
        </figure>
      </div>
    </section>
    <h2 style="margin-top:3rem">說故事四步</h2>
    <ol class="grid-4" style="list-style:none;padding:0">
      ${[
        ["1", "看清楚", "誰、在哪裏、發生什麼事"],
        ["2", "想一想", "用「忽然、然後、最後」排順序"],
        ["3", "大聲說", "一句一格，說出做法和原因"],
        ["4", "答提問", "對不對？如果是你，你會怎樣？"],
      ]
        .map(
          ([n, t, d], i) =>
            `<li class="step rise" style="animation-delay:${i * 80}ms"><span class="kicker">第 ${n} 步</span><b>${t}</b><span class="muted">${d}</span></li>`,
        )
        .join("")}
    </ol>
    <div class="row" style="margin-top:3rem;align-items:end;justify-content:space-between">
      <h2 style="margin:0">六則四格故事</h2>
      <p class="muted">已練習 ${done.length} / ${window.STORIES.length}</p>
    </div>
    <ul class="cards" style="list-style:none;padding:0;margin-top:1rem">
      ${window.STORIES.map((s, i) => {
        const ok = done.includes(s.id);
        return `<li class="rise" style="animation-delay:${i * 70}ms"><a class="card card-lift" href="#/story/${s.id}">
          <div class="thumbs">${s.panels.map((p) => `<img class="panel-img" src="${p.image}" alt="">`).join("")}</div>
          <div class="card-body">
            <p class="meta">${s.value} · ${s.level} · ${s.setting}${ok ? " · 已練習" : ""}</p>
            <h3>${s.title}</h3>
            <p class="muted">${s.summary}</p>
          </div>
        </a></li>`;
      }).join("")}
    </ul>
  </main>`;
}

function guide() {
  return `<main class="wrap narrow">
    <p class="kicker">給學生、家長和老師</p>
    <h1>怎樣說好四格故事</h1>
    <p class="muted">香港升小面試很常拿出四張圖，請孩子「看圖說故事」。考的不是背誦，而是觀察、順序、口語和價值觀。</p>
    <h2>一句公式</h2>
    <p class="step" style="font-family:var(--font-display);font-size:1.15rem">誰　＋　在哪裏　＋　發生什麼　＋　然後怎樣做　＋　結果　＋　道理</p>
    <h2>連接詞小庫</h2>
    <ul class="cards" style="list-style:none;padding:0">
      ${[
        ["有一天／小息時", "開場"],
        ["忽然／這時候", "問題出現"],
        ["他想／她覺得", "內心"],
        ["於是／所以", "行動"],
        ["後來／最後", "結果"],
        ["這個故事教我們", "道理"],
      ]
        .map(([w, u]) => `<li class="step" style="display:flex;justify-content:space-between"><span>${w}</span><span class="muted">${u}</span></li>`)
        .join("")}
    </ul>
    <h2>面試官常問</h2>
    <ol>
      <li>圖中有誰？他們在做什麼？</li>
      <li>後來怎樣？為什麼要這樣做？</li>
      <li>你覺得他做得對不對？</li>
      <li>如果是你，你會怎樣做？</li>
      <li>這個故事告訴我們什麼？</li>
    </ol>
    <p class="muted">答「如果是你」時，請孩子用「我會……因為……」。</p>
    <h2>禮貌小句</h2>
    <ul>
      <li>開始：老師好，我準備好了。</li>
      <li>提醒別人：唔好意思，請你去後面排隊。</li>
      <li>認錯：對不起，是我不小心。</li>
      <li>結束：我說完了，謝謝老師。</li>
    </ul>
    <h2>老師怎麼帶</h2>
    <ol>
      <li><b>先看後說。</b> 給 20–30 秒看四格。</li>
      <li><b>一格一句。</b> 卡殼時只問「這一格有誰？」</li>
      <li><b>價值觀要孩子自己講。</b> 不要代說最後一句。</li>
      <li><b>粵語口語即可。</b> 書面語留給寫作練習。</li>
    </ol>
    <div class="row" style="margin-top:2rem">
      <a class="btn btn-primary" href="#/story/${window.STORIES[0].id}">由第一則練習</a>
      <a class="btn btn-secondary" href="#/interview">進入模擬面試</a>
    </div>
  </main>`;
}

const state = {
  revealed: 4,
  hints: false,
  tab: "guide",
  picks: {},
  interview: { phase: "pick", story: null, seconds: 30, q: 0, checks: [] },
  intro: {
    name: "",
    age: 5,
    school: "",
    family: ["爸爸", "媽媽"],
    hobbies: [],
    step: 0,
    picks: {},
  },
  timer: null,
};

function thinkHtml(story) {
  if (!story.think) return "";
  return `<section class="think no-print">
    <p class="kicker">想一想</p>
    <h2>你會怎樣做？</h2>
    <p class="muted">點一點圖示來選擇。可以改選，再說出原因。</p>
    ${story.think
      .map((item, i) => {
        const picked = state.picks[story.id + ":" + item.id];
        const chosen = item.options.find((opt) => opt.id === picked);
        return `<div class="think-q" data-think="${item.id}">
          <p class="think-ask"><b class="kicker">${i + 1}.</b> ${escapeHtml(item.q)}</p>
          <div class="choice-grid${item.options.length > 2 ? " cols-3" : ""}">
            ${item.options
              .map((opt) => {
                const on = picked === opt.id;
                const cls = on ? (opt.good ? "on-good" : "on-think") : "";
                return `<button type="button" class="choice ${cls}" data-pick="${item.id}:${opt.id}" aria-pressed="${on ? "true" : "false"}">
                  ${on && opt.good ? `<span class="cheer-stars" aria-hidden="true"><span>★</span><span>✦</span><span>★</span></span>` : ""}
                  <span class="ico" aria-hidden="true">${opt.icon}</span>
                  <span>${escapeHtml(opt.label)}</span>
                </button>`;
              })
              .join("")}
          </div>
          <p class="say rise" data-say ${chosen ? "" : "hidden"}>${chosen ? escapeHtml((chosen.good ? "這樣做很好。" : "再想一想。") + chosen.say) : ""}</p>
        </div>`;
      })
      .join("")}
  </section>`;
}

function storyPage(id) {
  const story = storyById(id);
  if (!story) {
    return `<main class="wrap"><h1>找不到這則故事</h1><a href="#/">返回目錄</a></main>`;
  }
  mark(id);
  const tabs = [
    ["guide", "引導說"],
    ["model", "範文"],
    ["ask", "面試提問"],
    ["teacher", "老師備課"],
  ];
  let body = "";
  if (state.tab === "guide") {
    body = `<div style="display:grid;gap:1.5rem;margin-top:1rem" class="cards">
      <div><h2>開口句</h2>${story.starters.map((s, i) => `<div class="starter"><b class="kicker">${i + 1}</b>${escapeHtml(s)}</div>`).join("")}</div>
      <div><h2>詞彙</h2>${story.vocab.map((v) => `<div class="starter" style="justify-content:space-between"><b>${escapeHtml(v.word)}</b><span class="muted">${escapeHtml(v.speak)}</span></div>`).join("")}</div>
    </div>`;
  } else if (state.tab === "model") {
    body = `<article><h2>口語基礎版</h2><p>${escapeHtml(story.spokenBasic)}</p></article>
      <article><h2>口語進階版</h2><p>${escapeHtml(story.spokenPlus)}</p></article>
      <article><h2>書面語（可作寫作範文）</h2><p>${escapeHtml(story.written)}</p></article>`;
  } else if (state.tab === "ask") {
    body = story.questions
      .map(
        (item, i) =>
          `<div class="qa"><p><b class="kicker">${i + 1}.</b> ${escapeHtml(item.q)}</p><p class="muted">建議答法：${escapeHtml(item.a)}</p></div>`,
      )
      .join("");
  } else {
    body = `<h2>評分重點</h2><ul>${story.scoring.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      <h2>課堂提示</h2><p class="muted">${escapeHtml(story.teacherNote)}</p>`;
  }
  return `<main class="wrap">
    <div class="row no-print" style="justify-content:space-between">
      <a class="muted" href="#/">← 全部故事</a>
      <div class="row">
        <button class="btn btn-secondary btn-sm" id="printBtn">列印四格</button>
        <a class="btn btn-ghost btn-sm" href="#/story/${nextId(story.id)}">下一則</a>
      </div>
    </div>
    <p class="kicker">${story.value} · ${story.level} · ${story.setting}</p>
    <h1>${story.title}</h1>
    <p class="muted">${story.summary}</p>
    <div class="row no-print" style="margin:0.75rem 0">
      <button class="btn btn-sm ${state.revealed < 4 ? "btn-primary" : "btn-secondary"}" data-act="one">一格一格揭</button>
      <button class="btn btn-sm ${state.revealed === 4 ? "btn-primary" : "btn-secondary"}" data-act="all">一次看四格</button>
      ${state.revealed < 4 ? `<button class="btn btn-sm btn-secondary" data-act="next">揭下一格（${state.revealed}/4）</button>` : ""}
      <button class="btn btn-sm btn-ghost" data-act="hints">${state.hints ? "隱藏提示" : "顯示觀察提示"}</button>
    </div>
    ${comic(story, state.revealed, state.hints, false)}
    ${thinkHtml(story)}
    <section class="panel no-print">
      <div class="tabs">${tabs.map(([id, label]) => `<button data-tab="${id}" class="${state.tab === id ? "on" : ""}">${label}</button>`).join("")}</div>
      ${body}
    </section>
    <nav class="story-nav no-print">${window.STORIES.map((s) => `<a class="chip ${s.id === story.id ? "on" : ""}" href="#/story/${s.id}">${s.title}</a>`).join("")}</nav>
  </main>`;
}

function interviewPage() {
  const iv = state.interview;
  if (iv.phase === "pick") {
    return `<main class="wrap">
      <p class="kicker">課堂／家長模擬</p>
      <h1>模擬面試</h1>
      <p class="muted">像真正面試一樣：先看圖三十秒，再按順序說故事，最後回答老師提問。建議孩子面向大人，不要讀螢幕上的字。</p>
      <button class="btn btn-primary" data-iv="random">隨機一則（更像面試）</button>
      <div class="pick-list" style="margin-top:1.25rem">
        ${window.STORIES.map(
          (s) => `<button class="pick" data-start="${s.id}">
            <img class="panel-img" src="${s.panels[0].image}" alt="">
            <span><span class="meta">${s.value} · ${s.level}</span><br><b style="font-family:var(--font-display);font-size:1.15rem">${s.title}</b></span>
          </button>`,
        ).join("")}
      </div>
    </main>`;
  }
  const story = iv.story;
  const compact = iv.phase === "ask" || iv.phase === "done";
  let box = "";
  if (iv.phase === "think") {
    box = `<p class="muted">請用這三十秒看清楚四格。時間到了就開始說故事。也可以提早開始。</p>
      <button class="btn btn-primary" data-iv="tell">我看完了，開始說</button>`;
  } else if (iv.phase === "tell") {
    box = `<p style="font-family:var(--font-display);font-size:1.15rem">請由第一格說到第四格。說完按下面的按鈕。</p>
      <button class="btn btn-primary" data-iv="ask">我說完了</button>`;
  } else if (iv.phase === "ask") {
    const item = story.questions[iv.q];
    box = `<p class="kicker">提問 ${iv.q + 1} / ${story.questions.length}</p>
      <p style="font-family:var(--font-display);font-size:1.35rem">${escapeHtml(item.q)}</p>
      <button class="btn btn-primary" data-iv="nextq">${iv.q + 1 >= story.questions.length ? "提問結束，去評分" : "下一題"}</button>`;
  } else {
    box = `<p class="kicker pop-in" style="font-size:1.6rem">說完了，做得好！</p><h3>老師／家長評分</h3>
      ${story.scoring
        .map(
          (s, i) =>
            `<label style="display:flex;gap:.6rem;margin:.4rem 0"><input type="checkbox" data-check="${i}" ${iv.checks[i] ? "checked" : ""}>${escapeHtml(s)}</label>`,
        )
        .join("")}
      <p class="muted"><a href="#/story/${story.id}">查看這則的範文與提問</a></p>
      <button class="btn btn-secondary" data-iv="random">再隨機一則</button>`;
  }
  return `<main class="wrap">
    <div class="row" style="justify-content:space-between;align-items:center">
      <div>
        <p class="kicker">${story.value}</p>
        <h2>${iv.phase === "think" ? "請仔細看圖" : story.title}</h2>
      </div>
      <div class="row">
        ${iv.phase === "think" ? `<span class="step" style="padding:.4rem .8rem;font-variant-numeric:tabular-nums">${iv.seconds}s</span>` : ""}
        <button class="btn btn-ghost btn-sm" data-iv="reset">重選</button>
      </div>
    </div>
    ${comic(story, 4, false, compact)}
    <div class="panel">${box}</div>
  </main>`;
}

function bindStory(story) {
  document.getElementById("printBtn")?.addEventListener("click", () => window.print());
  document.querySelector("[data-act=one]")?.addEventListener("click", () => {
    state.revealed = 1;
    render();
  });
  document.querySelector("[data-act=all]")?.addEventListener("click", () => {
    state.revealed = 4;
    render();
  });
  document.querySelector("[data-act=next]")?.addEventListener("click", () => {
    state.revealed = Math.min(4, state.revealed + 1);
    render();
  });
  document.querySelector("[data-act=hints]")?.addEventListener("click", () => {
    state.hints = !state.hints;
    render();
  });
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.getAttribute("data-tab");
      render();
    });
  });
  bindZoom(story);
  bindThink(story);
}

function playCorrect() {
  if (!playCorrect.audio) {
    playCorrect.audio = new Audio("sounds/daak.mp3");
    playCorrect.audio.preload = "auto";
  }
  const audio = playCorrect.audio;
  audio.volume = 0.9;
  audio.currentTime = 0;
  const pending = audio.play();
  if (pending) pending.catch(() => {});
}

function bindThink(story) {
  if (!story.think) return;
  document.querySelectorAll("[data-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.getAttribute("data-pick");
      const [qid, oid] = raw.split(":");
      state.picks[story.id + ":" + qid] = oid;
      const item = story.think.find((t) => t.id === qid);
      const opt = item.options.find((o) => o.id === oid);
      const block = btn.closest("[data-think]");
      block.querySelectorAll("[data-pick]").forEach((b) => {
        const selected = b.getAttribute("data-pick") === raw;
        const id = b.getAttribute("data-pick").split(":")[1];
        const option = item.options.find((x) => x.id === id);
        b.classList.remove("on-good", "on-think");
        b.setAttribute("aria-pressed", selected ? "true" : "false");
        if (selected) b.classList.add(option.good ? "on-good" : "on-think");
      });
      const say = block.querySelector("[data-say]");
      say.hidden = false;
      say.textContent = (opt.good ? "這樣做很好。" : "再想一想。") + opt.say;
      if (opt.good) playCorrect();
    });
  });
}

function bindZoom(story) {
  document.querySelectorAll("[data-zoom]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-zoom"));
      const overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.innerHTML = `<img class="panel-img" src="${story.panels[i].image}" alt="${escapeHtml(story.panels[i].caption)}">`;
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
}

function startInterview(story) {
  clearInterval(state.timer);
  state.interview = { phase: "think", story, seconds: 30, q: 0, checks: story.scoring.map(() => false) };
  state.timer = setInterval(() => {
    if (state.interview.phase !== "think") return;
    state.interview.seconds -= 1;
    if (state.interview.seconds <= 0) {
      clearInterval(state.timer);
      state.interview.phase = "tell";
    }
    render();
  }, 1000);
  render();
}

function bindInterview() {
  document.querySelector("[data-iv=random]")?.addEventListener("click", () => {
    startInterview(window.STORIES[Math.floor(Math.random() * window.STORIES.length)]);
  });
  document.querySelector("[data-iv=reset]")?.addEventListener("click", () => {
    clearInterval(state.timer);
    state.interview = { phase: "pick", story: null, seconds: 30, q: 0, checks: [] };
    render();
  });
  document.querySelector("[data-iv=tell]")?.addEventListener("click", () => {
    clearInterval(state.timer);
    state.interview.phase = "tell";
    render();
  });
  document.querySelector("[data-iv=ask]")?.addEventListener("click", () => {
    state.interview.phase = "ask";
    state.interview.q = 0;
    render();
  });
  document.querySelector("[data-iv=nextq]")?.addEventListener("click", () => {
    const iv = state.interview;
    if (iv.q + 1 >= iv.story.questions.length) iv.phase = "done";
    else iv.q += 1;
    render();
  });
  document.querySelectorAll("[data-start]").forEach((btn) => {
    btn.addEventListener("click", () => startInterview(storyById(btn.getAttribute("data-start"))));
  });
  document.querySelectorAll("[data-check]").forEach((box) => {
    box.addEventListener("change", () => {
      state.interview.checks[Number(box.getAttribute("data-check"))] = box.checked;
    });
  });
  if (state.interview.story) bindZoom(state.interview.story);
}

const INTRO_FAMILY = ["爸爸", "媽媽", "哥哥", "姐姐", "弟弟", "妹妹", "爺爺", "嫲嫲"];
const INTRO_HOBBIES = [
  ["🎨", "畫畫"],
  ["⚽", "踢球"],
  ["🎵", "唱歌"],
  ["📚", "睇書"],
  ["🧩", "砌積木"],
  ["🏊", "游泳"],
];
const INTRO_CHECKS = [
  ["hi", "見到老師，你會先說什麼？", [["👋", "老師好", true, "要先打招呼，再介紹自己。"], ["🙅", "喂", false, "「喂」不夠禮貌。請說「老師好」。"], ["😶", "不說話", false, "見到老師要開口打招呼。"]]],
  ["eye", "說話的時候，眼睛看哪裏？", [["👀", "看着老師", true, "看着老師，聲音要清楚。"], ["👇", "看着地下", false, "可以勇敢望一望老師。"], ["🪟", "看着窗外", false, "要專心，眼睛看着老師。"]]],
  ["bye", "說完了，你會說什麼？", [["🙏", "多謝老師", true, "說完要多謝老師。"], ["🏃", "我走了", false, "先說「我講完喇，多謝老師」。"], ["🤐", "不說", false, "結束時也要有禮貌。"]]],
];

function joinSpoken(items) {
  if (items.length <= 1) return items[0] || "";
  if (items.length === 2) return items[0] + "同" + items[1];
  return items.slice(0, -1).join("、") + "同" + items[items.length - 1];
}

function introLines() {
  const info = state.intro;
  const who = info.name.trim() || "＿＿＿";
  const kg = info.school.trim();
  const fam = info.family.length ? joinSpoken(info.family.concat("我")) : "爸爸、媽媽同我";
  const likes = info.hobbies.length ? "我鍾意" + joinSpoken(info.hobbies) + "。" : "我鍾意＿＿＿。";
  return [
    ["你可以介紹一下自己嗎？", "老師好，我叫" + who + "。"],
    ["你幾歲？讀邊間幼稚園？", kg ? "我今年" + info.age + "歲，喺" + kg + "讀書。" : "我今年" + info.age + "歲。"],
    ["你屋企有邊個？", "我家有" + fam + "。"],
    ["你有什麼興趣？", likes],
    ["你上小學，想做個怎樣的學生？", "我上小學之後會聽老師話，同同學做好朋友。"],
    ["你說完了嗎？", "我講完喇，多謝老師。"],
  ];
}

function introPage() {
  const info = state.intro;
  const lines = introLines();
  const current = lines[info.step];
  return `<main class="wrap narrow">
    <p class="kicker">升小面試 · 開口第一題</p>
    <h1>練習自我介紹</h1>
    <p class="muted">先填自己的資料，再一句一句大聲說。用廣東話就好，不用背長文。</p>
    <section class="think">
      <h2>我的資料</h2>
      <label class="kicker">我叫</label>
      <input id="intro-name" class="intro-field" value="${escapeHtml(info.name)}" placeholder="例如：陳樂樂" autocomplete="off">
      <p class="kicker" style="margin-top:1rem">我今年</p>
      <div class="row">
        ${[4, 5, 6].map((n) => `<button type="button" class="choice ${info.age === n ? "on-good" : ""}" data-age="${n}" style="min-height:3.5rem">${n} 歲</button>`).join("")}
      </div>
      <label class="kicker">我讀的幼稚園</label>
      <input id="intro-school" class="intro-field" value="${escapeHtml(info.school)}" placeholder="例如：樂樂幼稚園" autocomplete="off">
      <p class="kicker" style="margin-top:1rem">屋企有</p>
      <div class="row">
        ${INTRO_FAMILY.map((person) => `<button type="button" class="choice ${info.family.includes(person) ? "on-good" : ""}" data-family="${person}" style="min-height:3rem">${person}</button>`).join("")}
      </div>
      <p class="kicker" style="margin-top:1rem">我鍾意（最多兩樣）</p>
      <div class="choice-grid cols-3">
        ${INTRO_HOBBIES.map(([icon, label]) => `<button type="button" class="choice ${info.hobbies.includes(label) ? "on-good" : ""}" data-hobby="${label}"><span class="ico">${icon}</span><span>${label}</span></button>`).join("")}
      </div>
    </section>
    <section class="think">
      <p class="kicker">跟着說 ${info.step + 1} / ${lines.length}</p>
      <p class="muted">面試官問：${escapeHtml(current[0])}</p>
      <p class="pop-in" style="font-family:var(--font-display);font-size:2rem;line-height:1.45">${escapeHtml(current[1])}</p>
      <div class="row" style="margin-top:1rem">
        <button class="btn btn-secondary" data-intro="prev" ${info.step === 0 ? "disabled" : ""}>上一句</button>
        <button class="btn btn-primary" data-intro="${info.step < lines.length - 1 ? "next" : "restart"}">${info.step < lines.length - 1 ? "我說完了，下一句" : "再由第一句說"}</button>
      </div>
    </section>
    <section class="think">
      <h2>完整自我介紹</h2>
      <ol style="padding:0;list-style:none">
        ${lines.map((line, i) => `<li class="${i === info.step ? "choice on-good" : "say"}" style="margin-top:.5rem">${escapeHtml(line[1])}</li>`).join("")}
      </ol>
    </section>
    <section class="think no-print">
      <p class="kicker">想一想</p>
      <h2>有禮貌的自我介紹</h2>
      ${INTRO_CHECKS.map((item, index) => {
        const chosen = item[2].find((opt) => opt[1] === info.picks[item[0]]);
        return `<div class="think-q">
          <p class="think-ask"><b class="kicker">${index + 1}.</b> ${item[1]}</p>
          <div class="choice-grid cols-3">
            ${item[2].map((opt) => {
              const on = info.picks[item[0]] === opt[1];
              return `<button type="button" class="choice ${on ? (opt[2] ? "on-good" : "on-think") : ""}" data-intro-pick="${item[0]}:${opt[1]}:${opt[2] ? "1" : "0"}">
                ${on && opt[2] ? `<span class="cheer-stars" aria-hidden="true"><span>★</span><span>✦</span><span>★</span></span>` : ""}
                <span class="ico">${opt[0]}</span><span>${opt[1]}</span>
              </button>`;
            }).join("")}
          </div>
          <p class="say rise" ${chosen ? "" : "hidden"}>${chosen ? escapeHtml((chosen[2] ? "這樣做很好。" : "再想一想。") + chosen[3]) : ""}</p>
        </div>`;
      }).join("")}
    </section>
  </main>`;
}

function bindIntro() {
  const focusId = document.activeElement && document.activeElement.id;
  const keep = (id, value) => {
    state.intro[id === "intro-name" ? "name" : "school"] = value;
    const say = document.querySelector(".pop-in");
    if (say) say.textContent = introLines()[state.intro.step][1];
  };
  const name = document.getElementById("intro-name");
  const school = document.getElementById("intro-school");
  name?.addEventListener("input", () => keep("intro-name", name.value));
  school?.addEventListener("input", () => keep("intro-school", school.value));
  document.querySelectorAll("[data-age]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.intro.age = Number(btn.getAttribute("data-age"));
      rerenderIntro(focusId);
    });
  });
  document.querySelectorAll("[data-family]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const person = btn.getAttribute("data-family");
      const list = state.intro.family;
      state.intro.family = list.includes(person)
        ? list.filter((item) => item !== person)
        : list.length >= 4 ? list.slice(1).concat(person) : list.concat(person);
      rerenderIntro(focusId);
    });
  });
  document.querySelectorAll("[data-hobby]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hobby = btn.getAttribute("data-hobby");
      const list = state.intro.hobbies;
      state.intro.hobbies = list.includes(hobby)
        ? list.filter((item) => item !== hobby)
        : list.length >= 2 ? list.slice(1).concat(hobby) : list.concat(hobby);
      rerenderIntro(focusId);
    });
  });
  document.querySelectorAll("[data-intro]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const act = btn.getAttribute("data-intro");
      if (act === "prev") state.intro.step = Math.max(0, state.intro.step - 1);
      else if (act === "next") state.intro.step += 1;
      else state.intro.step = 0;
      rerenderIntro();
    });
  });
  document.querySelectorAll("[data-intro-pick]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [id, label, good] = btn.getAttribute("data-intro-pick").split(":");
      if (good === "1") playCorrect();
      state.intro.picks[id] = label;
      rerenderIntro();
    });
  });
}

function rerenderIntro(focusId) {
  const app = document.getElementById("app");
  app.innerHTML = introPage();
  bindIntro();
  if (focusId) document.getElementById(focusId)?.focus();
}

function render() {
  const route = parseHash();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === (route.page === "story" ? "home" : route.page === "home" ? "home" : route.page));
  });
  const app = document.getElementById("app");
  if (route.page === "guide") app.innerHTML = guide();
  else if (route.page === "intro") {
    app.innerHTML = introPage();
    bindIntro();
  } else if (route.page === "interview") {
    app.innerHTML = interviewPage();
    bindInterview();
  } else if (route.page === "story") {
    if (state._storyId !== route.id) {
      state.revealed = 4;
      state.hints = false;
      state.tab = "guide";
      state._storyId = route.id;
    }
    const story = storyById(route.id);
    app.innerHTML = storyPage(route.id);
    if (story) bindStory(story);
  } else app.innerHTML = home();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelector(".lightbox")?.remove();
});
render();
