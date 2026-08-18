const grid = document.querySelector("#article-grid");
const title = document.querySelector("#category-title");
const brandLink = document.querySelector("#brand-link");
const tabs = document.querySelectorAll(".nav-tab");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const topSocialLinks = document.querySelector("#top-social-links");
const sidebarSocialLinks = document.querySelector("#sidebar-social-links");
const quickLinks = document.querySelector("#quick-links");
const categoryAllLink = document.querySelector("#category-all-link");

function socialIcon(link) {
  const icons = {
    x: `<span>X</span>`,
    youtube: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2c-.2-.8-.8-1.4-1.6-1.6C18.6 5.2 12 5.2 12 5.2s-6.6 0-8 .4c-.8.2-1.4.8-1.6 1.6C2 8.6 2 12 2 12s0 3.4.4 4.8c.2.8.8 1.4 1.6 1.6 1.4.4 8 .4 8 .4s6.6 0 8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.8.4-4.8s0-3.4-.4-4.8ZM10 14.8V9.2l5 2.8-5 2.8Z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.7 3.7 18.3 20c-.2 1-.8 1.2-1.6.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.3L6 13.6l-4.8-1.5c-1-.3-1-1 .2-1.5L20.2 3.4c.9-.3 1.7.2 1.5.3Z"/></svg>`,
    email: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2Zm8 8 8-5H4l8 5Zm0 2L4 10v7h16v-7l-8 5Z"/></svg>`,
  };

  return icons[link.icon] ?? `<span>${link.shortLabel}</span>`;
}

function renderBrand() {
  if (siteConfig.brand.logoImage) {
    brandLink.innerHTML = `
      <img class="brand-logo" src="${siteConfig.brand.logoImage}" alt="${siteConfig.brand.name} Logo" />
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
    return `<img class="article-image" src="${article.image}" alt="${article.title}" />`;
  }

  return `
    <div class="article-placeholder" aria-hidden="true">
      <span>${article.tag}</span>
    </div>
  `;
}

function renderCategory(categoryKey) {
  const category = categories[categoryKey];

  title.textContent = category.title;
  categoryAllLink.href = `categories/${categoryKey}.html`;
  grid.innerHTML = category.articles
    .map(
      (article) => `
        <a class="article-card ${article.large ? "large" : ""}" href="${article.url}">
          ${articleVisual(article)}
          <div class="article-meta">
            <span class="tag">${article.tag}</span>
            <span>${article.date}</span>
          </div>
          <div>
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
          </div>
        </a>
      `,
    )
    .join("");
}

function renderSiteLinks() {
  topSocialLinks.innerHTML = siteConfig.socialLinks
    .slice(0, 4)
    .map(
      (link) =>
        `<a class="social-icon" href="${link.url}" aria-label="${link.label}">${socialIcon(link)}</a>`,
    )
    .join("");

  sidebarSocialLinks.innerHTML = siteConfig.socialLinks
    .map(
      (link) =>
        `<li><a href="${link.url}"><span class="social-icon small">${socialIcon(link)}</span>${link.label}</a></li>`,
    )
    .join("");

  quickLinks.innerHTML = [
    "<span>快捷入口</span>",
    ...siteConfig.quickLinks.map(
      (link) => `<a href="${link.url}">${link.label}</a>`,
    ),
  ].join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderCategory(tab.dataset.category);
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

renderBrand();
renderSiteLinks();
renderCategory("us-stocks");
