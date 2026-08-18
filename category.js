const pageCategory = document.body.dataset.category;
const category = categories[pageCategory];
const categoryTitle = document.querySelector("#category-page-title");
const categoryIntro = document.querySelector("#category-page-intro");
const categoryGrid = document.querySelector("#category-page-grid");
const brandLink = document.querySelector("#brand-link");

const categoryIntros = {
  "us-stocks": "整理美股新手入门、市场观察、公司研究、ETF 和财报笔记。",
  ai: "记录 AI 工具、Agent、产业链、模型应用和 AI 投资观察。",
};

function prefixUrl(url) {
  if (!url || url === "#") {
    return "#";
  }

  if (url.startsWith("http") || url.startsWith("mailto:")) {
    return url;
  }

  return `../${url}`;
}

function renderBrand() {
  if (siteConfig.brand.logoImage) {
    brandLink.innerHTML = `
      <img class="brand-logo" src="${prefixUrl(siteConfig.brand.logoImage)}" alt="${siteConfig.brand.name} Logo" />
      <span class="brand-subtitle">${siteConfig.brand.subtitle}</span>
    `;
    return;
  }

  brandLink.innerHTML = `
    <span class="brand-title">${siteConfig.brand.name}</span>
    <span class="brand-subtitle">${siteConfig.brand.subtitle}</span>
  `;
}

function articleVisual(article) {
  if (article.image) {
    return `<img class="article-image" src="${prefixUrl(article.image)}" alt="${article.title}" />`;
  }

  return `
    <div class="article-placeholder" aria-hidden="true">
      <span>${article.tag}</span>
      <small>${article.large ? "Featured" : "Planned"}</small>
    </div>
  `;
}

function renderCategoryPage() {
  document.title = `${category.title} | 51VIPAI`;
  categoryTitle.textContent = category.title;
  categoryIntro.textContent = categoryIntros[pageCategory];
  categoryGrid.innerHTML = category.articles
    .map((article) => {
      const hasUrl = article.url && article.url !== "#";
      const tagName = hasUrl ? "a" : "article";
      const href = hasUrl ? ` href="${prefixUrl(article.url)}"` : "";

      return `
        <${tagName} class="article-card ${article.large ? "large" : ""} ${hasUrl ? "" : "is-planned"}"${href}>
          ${articleVisual(article)}
          <div class="article-meta">
            <span class="tag">${article.tag}</span>
            <span>${article.date}</span>
          </div>
          <div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
          </div>
        </${tagName}>
      `;
    })
    .join("");
}

renderBrand();
renderCategoryPage();
