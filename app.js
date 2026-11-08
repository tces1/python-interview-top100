(() => {
  "use strict";

  const questions = Array.isArray(window.QUESTIONS) ? window.QUESTIONS : [];
  const STORAGE = {
    mastered: "py100-mastered",
    saved: "py100-saved",
    theme: "py100-theme",
  };

  const elements = {
    list: document.querySelector("#question-list"),
    empty: document.querySelector("#empty-state"),
    search: document.querySelector("#question-search"),
    level: document.querySelector("#level-filter"),
    status: document.querySelector("#status-filter"),
    savedFilter: document.querySelector("#saved-filter"),
    categoryTabs: document.querySelector("#category-tabs"),
    visibleCount: document.querySelector("#visible-count"),
    resetFilters: document.querySelector("#reset-filters"),
    emptyReset: document.querySelector("#empty-reset"),
    random: document.querySelector("#random-question"),
    continueLearning: document.querySelector("#continue-learning"),
    nextQuestionLabel: document.querySelector("#next-question-label"),
    masteredCount: document.querySelector("#mastered-count"),
    progressPercent: document.querySelector("#progress-percent"),
    progressMessage: document.querySelector("#progress-message"),
    progressRing: document.querySelector(".progress-ring"),
    progressBar: document.querySelector("#progress-bar"),
    themeToggle: document.querySelector(".theme-toggle"),
    toast: document.querySelector("#toast"),
  };

  const state = {
    query: "",
    category: "全部",
    level: "all",
    status: "all",
    savedOnly: false,
    mastered: loadIdSet(STORAGE.mastered),
    saved: loadIdSet(STORAGE.saved),
  };

  let toastTimer;
  let searchTimer;

  function loadIdSet(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return new Set(
        Array.isArray(value)
          ? value.map(Number).filter((id) => Number.isInteger(id))
          : [],
      );
    } catch {
      return new Set();
    }
  }

  function saveIdSet(key, values) {
    localStorage.setItem(key, JSON.stringify([...values].sort((a, b) => a - b)));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function inlineCode(value) {
    return escapeHtml(value).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function padId(id) {
    return String(id).padStart(3, "0");
  }

  function icon(name) {
    const paths = {
      bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"></path>',
      chevron: '<path d="m6 9 6 6 6-6"></path>',
      check: '<path d="m5 12 4 4L19 6"></path>',
      copy: '<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"></path>',
      flame: '<path d="M12 22c4 0 7-2.7 7-6.5 0-2.4-1.2-4.5-3.1-6.1.1 2.2-.9 3.5-2.1 4.2.2-4.1-2.1-7.6-5.5-10.6.2 3.6-3.3 5.7-3.3 10.7C5 18.5 7.8 22 12 22Z"></path>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }

  function getCodeLabel(question) {
    if (question.id === 61) return "TOML";
    if ([60, 62, 92].includes(question.id)) return "TERMINAL";
    return "PYTHON";
  }

  function renderCategories() {
    const categories = [...new Set(questions.map((question) => question.category))];
    const tabs = ["全部", ...categories];

    elements.categoryTabs.innerHTML = tabs
      .map((category) => {
        const count =
          category === "全部"
            ? questions.length
            : questions.filter((question) => question.category === category).length;
        const active = state.category === category;
        return `
          <button
            class="category-tab"
            type="button"
            data-category="${escapeHtml(category)}"
            aria-pressed="${active}"
          >
            ${escapeHtml(category)}
            <span>${String(count).padStart(2, "0")}</span>
          </button>
        `;
      })
      .join("");
  }

  function getFilteredQuestions() {
    const query = state.query.trim().toLocaleLowerCase("zh-CN");

    return questions.filter((question) => {
      if (state.category !== "全部" && question.category !== state.category) {
        return false;
      }

      if (state.level !== "all" && question.level !== state.level) {
        return false;
      }

      if (state.status === "mastered" && !state.mastered.has(question.id)) {
        return false;
      }

      if (state.status === "unread" && state.mastered.has(question.id)) {
        return false;
      }

      if (state.savedOnly && !state.saved.has(question.id)) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        question.title,
        question.category,
        question.level,
        question.summary,
        ...question.points,
        question.followUp,
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN");

      return haystack.includes(query);
    });
  }

  function questionTemplate(question) {
    const id = padId(question.id);
    const isSaved = state.saved.has(question.id);
    const isMastered = state.mastered.has(question.id);
    const frequencyText = question.frequency >= 5 ? "高频 TOP" : "常考";

    return `
      <article class="question-card" id="q-${id}">
        <button
          class="bookmark-button"
          type="button"
          data-action="bookmark"
          data-id="${question.id}"
          aria-label="${isSaved ? "取消收藏" : "收藏"}：${escapeHtml(question.title)}"
          aria-pressed="${isSaved}"
          title="${isSaved ? "取消收藏" : "收藏题目"}"
        >
          ${icon("bookmark")}
        </button>

        <details data-question-id="${question.id}">
          <summary class="question-summary">
            <span class="question-rank">#${id}</span>
            <div class="question-main">
              <div class="question-meta">
                <span class="category-label">${escapeHtml(question.category)}</span>
                <span class="level-label" data-level="${escapeHtml(question.level)}">
                  ${escapeHtml(question.level)}
                </span>
                <span class="frequency-label">
                  ${icon("flame")}
                  ${frequencyText}
                </span>
              </div>
              <h3>${inlineCode(question.title)}</h3>
            </div>
            <span class="question-chevron" aria-hidden="true">
              ${icon("chevron")}
            </span>
          </summary>

          <div class="question-answer">
            <p class="answer-label">QUICK ANSWER</p>
            <p class="answer-summary">${inlineCode(question.summary)}</p>

            <ul class="key-points">
              ${question.points
                .map((point) => `<li>${inlineCode(point)}</li>`)
                .join("")}
            </ul>

            ${
              question.code
                ? `
                  <div class="code-block">
                    <div class="code-header">
                      <span>${getCodeLabel(question)}</span>
                      <button
                        class="copy-code"
                        type="button"
                        data-action="copy"
                        data-id="${question.id}"
                        aria-label="复制第 ${question.id} 题代码"
                      >
                        ${icon("copy")}
                        <span>复制</span>
                      </button>
                    </div>
                    <pre><code>${escapeHtml(question.code)}</code></pre>
                  </div>
                `
                : ""
            }

            <div class="follow-up">
              <strong>可能追问</strong>
              <p>${inlineCode(question.followUp)}</p>
            </div>

            <div class="answer-actions">
              <button
                class="master-button"
                type="button"
                data-action="master"
                data-id="${question.id}"
                aria-pressed="${isMastered}"
              >
                ${icon("check")}
                <span>${isMastered ? "已掌握" : "标记为已掌握"}</span>
              </button>
              <a class="question-anchor" href="#q-${id}" aria-label="复制本题定位链接">
                #${id} · PERMALINK
              </a>
            </div>
          </div>
        </details>
      </article>
    `;
  }

  function renderQuestions() {
    const openIds = new Set(
      [...elements.list.querySelectorAll("details[open]")].map((details) =>
        Number(details.dataset.questionId),
      ),
    );
    const filtered = getFilteredQuestions();

    elements.list.innerHTML = filtered.map(questionTemplate).join("");
    elements.visibleCount.textContent = String(filtered.length);
    elements.empty.hidden = filtered.length !== 0;
    elements.list.hidden = filtered.length === 0;

    for (const id of openIds) {
      const details = elements.list.querySelector(
        `details[data-question-id="${id}"]`,
      );
      if (details) details.open = true;
    }

    renderCategories();
    updateProgress();
  }

  function updateProgress() {
    const validIds = new Set(questions.map((question) => question.id));
    const complete = [...state.mastered].filter((id) => validIds.has(id)).length;
    const total = questions.length || 100;
    const percent = Math.round((complete / total) * 100);
    const next = questions.find((question) => !state.mastered.has(question.id));

    elements.masteredCount.textContent = String(complete);
    elements.progressPercent.textContent = `${percent}%`;
    elements.progressRing.style.setProperty(
      "--progress",
      `${(complete / total) * 360}deg`,
    );
    elements.progressBar.style.width = `${percent}%`;

    const message =
      complete === total
        ? "100 题全部掌握"
        : complete >= 75
          ? "最后冲刺，稳住"
          : complete >= 40
            ? "已经进入深水区"
            : complete >= 10
              ? "节奏不错，继续"
              : "今天先拿下一题";

    elements.progressMessage.textContent = message;
    elements.nextQuestionLabel.textContent = next
      ? `#${padId(next.id)} ${next.title}`
      : "已完成全部题目";
    elements.continueLearning.disabled = !next;
  }

  function resetFilters() {
    state.query = "";
    state.category = "全部";
    state.level = "all";
    state.status = "all";
    state.savedOnly = false;

    elements.search.value = "";
    elements.level.value = "all";
    elements.status.value = "all";
    elements.savedFilter.setAttribute("aria-pressed", "false");

    renderQuestions();
  }

  function openQuestion(id, { reset = false } = {}) {
    if (reset) resetFilters();

    requestAnimationFrame(() => {
      const card = document.querySelector(`#q-${padId(id)}`);
      if (!card) return;
      const details = card.querySelector("details");
      details.open = true;
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.replaceState(null, "", `#q-${padId(id)}`);
    });
  }

  function toggleId(set, id) {
    if (set.has(id)) {
      set.delete(id);
      return false;
    }
    set.add(id);
    return true;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove("is-visible");
    }, 2200);
  }

  elements.categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderQuestions();
  });

  elements.search.addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = event.target.value;
      renderQuestions();
    }, 80);
  });

  elements.level.addEventListener("change", (event) => {
    state.level = event.target.value;
    renderQuestions();
  });

  elements.status.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderQuestions();
  });

  elements.savedFilter.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    elements.savedFilter.setAttribute("aria-pressed", String(state.savedOnly));
    renderQuestions();
  });

  elements.resetFilters.addEventListener("click", resetFilters);
  elements.emptyReset.addEventListener("click", resetFilters);

  elements.list.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const question = questions.find((item) => item.id === id);
    if (!question) return;

    if (button.dataset.action === "bookmark") {
      const saved = toggleId(state.saved, id);
      saveIdSet(STORAGE.saved, state.saved);
      showToast(saved ? `已收藏 #${padId(id)}` : `已取消收藏 #${padId(id)}`);
      renderQuestions();
      return;
    }

    if (button.dataset.action === "master") {
      const mastered = toggleId(state.mastered, id);
      saveIdSet(STORAGE.mastered, state.mastered);
      showToast(
        mastered ? `#${padId(id)} 已标记为掌握` : `#${padId(id)} 已移回待学习`,
      );
      renderQuestions();
      return;
    }

    if (button.dataset.action === "copy") {
      try {
        await copyText(question.code);
        const label = button.querySelector("span");
        label.textContent = "已复制";
        showToast(`已复制 #${padId(id)} 的代码`);
        window.setTimeout(() => {
          if (label.isConnected) label.textContent = "复制";
        }, 1600);
      } catch {
        showToast("复制失败，请手动选择代码");
      }
    }
  });

  elements.list.addEventListener("click", async (event) => {
    const link = event.target.closest(".question-anchor");
    if (!link) return;
    event.preventDefault();

    const url = new URL(link.href, window.location.href).href;
    window.history.replaceState(null, "", link.getAttribute("href"));

    try {
      await copyText(url);
      showToast("本题链接已复制");
    } catch {
      showToast("已定位到本题");
    }
  });

  elements.random.addEventListener("click", () => {
    const pool = questions.filter((question) => !state.mastered.has(question.id));
    const candidates = pool.length ? pool : questions;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (picked) openQuestion(picked.id, { reset: true });
  });

  elements.continueLearning.addEventListener("click", () => {
    const next = questions.find((question) => !state.mastered.has(question.id));
    if (next) openQuestion(next.id, { reset: true });
  });

  elements.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE.theme, next);
    elements.themeToggle.setAttribute(
      "aria-label",
      next === "dark" ? "切换浅色模式" : "切换深色模式",
    );
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable;

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      elements.search.focus();
    }

    if (event.key === "Escape" && document.activeElement === elements.search) {
      elements.search.value = "";
      state.query = "";
      renderQuestions();
      elements.search.blur();
    }
  });

  renderQuestions();

  const initialMatch = window.location.hash.match(/^#q-(\d{3})$/);
  if (initialMatch) {
    const id = Number(initialMatch[1]);
    if (questions.some((question) => question.id === id)) {
      requestAnimationFrame(() => openQuestion(id));
    }
  }
})();
