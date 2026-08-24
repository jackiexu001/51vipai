(() => {
  const usLink = [...document.querySelectorAll(".etf-nav-links > a")].find((link) => link.textContent.trim() === "美股");
  if (usLink) {
    const menu = document.createElement("div");
    menu.className = "nav-us-menu";
    const dropdown = document.createElement("div");
    dropdown.className = "nav-us-dropdown";
    dropdown.id = "nav-us-dropdown";
    dropdown.hidden = true;
    dropdown.innerHTML = `
      <a class="nav-us-home" href="/categories/us-stocks.html"><span>美股研究首页</span><small>US EQUITIES →</small></a>
      <a href="/tools/coming-soon/?tool=bank"><span>01</span><b>开银行卡</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=broker"><span>02</span><b>开美股券商账户</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=remittance"><span>03</span><b>跨境汇款</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=funding"><span>04</span><b>券商出入金</b><small>待上线</small></a>
      <a class="ready" href="/tools/dca-calculator/"><span>05</span><b>定投 DCA 计算器</b><small>立即使用 →</small></a>`;
    usLink.parentNode.insertBefore(menu, usLink);
    menu.append(usLink, dropdown);
    usLink.setAttribute("aria-haspopup", "true");
    usLink.setAttribute("aria-expanded", "false");
    usLink.setAttribute("aria-controls", dropdown.id);
    usLink.insertAdjacentHTML("beforeend", '<i class="nav-us-caret" aria-hidden="true">⌄</i>');
    const closeMenu = () => { dropdown.hidden = true; usLink.setAttribute("aria-expanded", "false"); };
    usLink.addEventListener("click", (event) => {
      event.preventDefault();
      const opening = dropdown.hidden;
      dropdown.hidden = !opening;
      usLink.setAttribute("aria-expanded", String(opening));
    });
    menu.addEventListener("mouseenter", () => { dropdown.hidden = false; usLink.setAttribute("aria-expanded", "true"); });
    menu.addEventListener("mouseleave", closeMenu);
    document.addEventListener("click", (event) => { if (!menu.contains(event.target)) closeMenu(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); usLink.focus(); } });
  }

  const button = document.querySelector("#theme-button");
  if (!button) return;

  try {
    document.body.classList.toggle("dark", localStorage.getItem("51vipai-theme") === "dark");
  } catch { /* storage can be unavailable */ }

  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    try {
      localStorage.setItem("51vipai-theme", document.body.classList.contains("dark") ? "dark" : "light");
    } catch { /* storage can be unavailable */ }
  });
})();
