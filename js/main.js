/* ==========================================================================
   DevNotes · 站点交互脚本（原生 JavaScript，无依赖）
   功能：
   1. 明暗主题切换（localStorage 记忆 + 默认跟随系统）
   2. 文章实时搜索（首页，按标题 / 摘要 / 标签匹配）
   3. 返回顶部按钮
   4. 文章阅读时长估算（文章详情页）
   ========================================================================== */

/* ---------- 1. 明暗主题切换 ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', theme);
}

// 首次访问：采用本地记忆的值，否则跟随系统偏好
const savedTheme = localStorage.getItem('theme');
const initialTheme =
  savedTheme ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* ---------- 2. 文章实时搜索（仅首页有搜索框） ---------- */
const searchInput = document.getElementById('searchInput');
const searchEmpty = document.getElementById('searchEmpty');

if (searchInput) {
  const cards = document.querySelectorAll('#postList .post-card');

  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const hit =
        card.textContent.toLowerCase().includes(keyword) ||
        card.dataset.tags.toLowerCase().includes(keyword);
      card.hidden = !hit;
      if (hit) visibleCount++;
    });

    // 全部被过滤时提示无结果
    searchEmpty.hidden = visibleCount !== 0;
  });
}

/* ---------- 3. 返回顶部 ---------- */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 300);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- 4. 阅读时长估算（仅文章页有 #postContent） ---------- */
const postContent = document.getElementById('postContent');
const readTimeEl = document.getElementById('readTime');

if (postContent && readTimeEl) {
  const text = postContent.innerText;
  const cjkCount = (text.match(/[一-龥]/g) || []).length;   // 中文字数
  const wordCount = (text.match(/[a-zA-Z]+/g) || []).length;        // 英文单词数
  const minutes = Math.max(1, Math.round(cjkCount / 300 + wordCount / 200));
  readTimeEl.textContent = minutes;
}
