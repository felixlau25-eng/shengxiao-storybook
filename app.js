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
            ? `<img class="panel-img" src="${p.image}" alt="第${LABELS[i]}格：${escapeHtml(p.caption)}">`
            : `<div class="hidden-panel">？</div>`
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
          <a class="btn btn-secondary" href="#/interview">模擬面試</a>
          <a class="btn btn-ghost" href="#/guide">怎樣說一段好故事</a>
        </div>
      </div>
      <div class="chars">
        <figure>
          <img class="panel-img" src="comics/chars/lele.jpg" alt="樂樂">
          <figcaption>樂樂</figcaption>
        </figure>
        <figure>
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
          ([n, t, d]) =>
            `<li class="step"><span class="kicker">第 ${n} 步</span><b>${t}</b><span class="muted">${d}</span></li>`,
        )
        .join("")}
    </ol>
    <div class="row" style="margin-top:3rem;align-items:end;justify-content:space-between">
      <h2 style="margin:0">六則四格故事</h2>
      <p class="muted">已練習 ${done.length} / ${window.STORIES.length}</p>
    </div>
    <ul class="cards" style="list-style:none;padding:0;margin-top:1rem">
      ${window.STORIES.map((s) => {
        const ok = done.includes(s.id);
        return `<li><a class="card" href="#/story/${s.id}">
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
                  <span class="ico" aria-hidden="true">${opt.icon}</span>
                  <span>${escapeHtml(opt.label)}</span>
                </button>`;
              })
              .join("")}
          </div>
          <p class="say" data-say ${chosen ? "" : "hidden"}>${chosen ? escapeHtml((chosen.good ? "這樣做很好。" : "再想一想。") + chosen.say) : ""}</p>
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
    box = `<h3>老師／家長評分</h3>
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
    playCorrect.audio = new Audio("sounds/cheer.mp3");
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

function render() {
  const route = parseHash();
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === (route.page === "story" ? "home" : route.page === "home" ? "home" : route.page));
  });
  const app = document.getElementById("app");
  if (route.page === "guide") app.innerHTML = guide();
  else if (route.page === "interview") {
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
