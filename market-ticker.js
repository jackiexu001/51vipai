(() => {
  const header = document.querySelector(".etf-header");
  const nav = header?.querySelector(".etf-nav");
  if (!header || !nav) return;

  const fallbackMetrics = [
    { label: "标普500", displayValue: "—", changePct: null },
    { label: "纳斯达克100", displayValue: "—", changePct: null },
    { label: "VIX 恐慌指数", displayValue: "—", changePct: null },
    { label: "美元/人民币", displayValue: "—", changePct: null },
  ];

  const ticker = document.createElement("section");
  ticker.className = "market-ticker";
  ticker.setAttribute("aria-label", "市场行情滚动播报");
  ticker.innerHTML = '<div class="market-ticker-track" aria-live="polite"></div>';
  nav.insertAdjacentElement("afterend", ticker);

  const track = ticker.querySelector(".market-ticker-track");
  const escapeHtml = (value) => String(value ?? "—").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  function itemMarkup(metric) {
    const hasChange = metric.changePct !== null && metric.changePct !== undefined && metric.changePct !== "";
    const change = Number(metric.changePct);
    const validChange = hasChange && Number.isFinite(change);
    const changeText = validChange ? `${change > 0 ? "+" : ""}${change.toFixed(2)}%` : "等待行情";
    const tone = validChange ? (change > 0 ? "positive" : change < 0 ? "negative" : "flat") : "flat";
    return `<span class="market-ticker-item"><b>${escapeHtml(metric.label)}</b><strong>${escapeHtml(metric.displayValue ?? metric.value)}</strong><em class="${tone}">${escapeHtml(changeText)}</em></span>`;
  }

  function render(metrics) {
    const chosen = metrics?.length ? metrics.slice(0, 6) : fallbackMetrics;
    const group = `<span class="market-ticker-group">${chosen.map(itemMarkup).join("")}</span>`;
    track.innerHTML = group + group;
  }

  render(fallbackMetrics);
  fetch("/api/v1/etf/dashboard", { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => render(data.metrics))
    .catch(() => render(fallbackMetrics));
})();
