(() => {
  const menuItems = {
    美股: `
      <a href="/tools/coming-soon/?tool=bank"><span>01</span><b>开银行卡</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=broker"><span>02</span><b>开美股券商账户</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=remittance"><span>03</span><b>跨境汇款</b><small>待上线</small></a>
      <a href="/tools/coming-soon/?tool=funding"><span>04</span><b>券商出入金</b><small>待上线</small></a>
      <a class="ready" href="/tools/dca-calculator/"><span>05</span><b>定投 DCA 计算器</b><small>立即使用 →</small></a>`,
    AI: '<div class="nav-menu-pending"><b>AI 功能入口规划中</b><small>COMING SOON</small></div>',
    ETF: '<div class="nav-menu-pending"><b>ETF 功能入口规划中</b><small>COMING SOON</small></div>',
  };
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  [...document.querySelectorAll(".etf-nav-links > a")].forEach((link) => {
    const label = link.textContent.trim();
    if (!menuItems[label]) return;
    const menu = document.createElement("div");
    menu.className = "nav-us-menu";
    const dropdown = document.createElement("div");
    dropdown.className = "nav-us-dropdown";
    dropdown.id = `nav-${label.toLowerCase()}-dropdown`;
    dropdown.hidden = true;
    dropdown.innerHTML = menuItems[label];
    link.parentNode.insertBefore(menu, link);
    menu.append(link, dropdown);
    link.setAttribute("aria-haspopup", "true");
    link.setAttribute("aria-expanded", "false");
    link.setAttribute("aria-controls", dropdown.id);
    const closeMenu = () => { dropdown.hidden = true; link.setAttribute("aria-expanded", "false"); };
    const openMenu = () => { dropdown.hidden = false; link.setAttribute("aria-expanded", "true"); };
    link.addEventListener("click", (event) => {
      if (finePointer.matches) return;
      event.preventDefault();
      const opening = dropdown.hidden;
      dropdown.hidden = !opening;
      link.setAttribute("aria-expanded", String(opening));
    });
    menu.addEventListener("mouseenter", openMenu);
    menu.addEventListener("mouseleave", closeMenu);
    menu.addEventListener("focusin", openMenu);
    menu.addEventListener("focusout", () => setTimeout(() => { if (!menu.contains(document.activeElement)) closeMenu(); }, 0));
    document.addEventListener("click", (event) => { if (!menu.contains(event.target)) closeMenu(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !dropdown.hidden) { closeMenu(); link.focus(); } });
  });

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
