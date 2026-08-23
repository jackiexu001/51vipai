(() => {
  "use strict";

  const config = window.ETF_APP_CONFIG;
  const views = [
    { id: "onExchange", label: "场内 ETF", title: "场内 ETF 溢价与流动性" },
    { id: "nasdaq", label: "场外纳指", title: "纳斯达克指数基金" },
    { id: "sp500", label: "场外标普", title: "标普 500 指数基金" },
    { id: "active", label: "美股主动", title: "主动型美股 QDII" },
    { id: "watchlist", label: "我的自选", title: "我的自选基金" },
  ];

  const commonColumns = [
    { key: "code", label: "代码", className: "fund-code" },
    { key: "name", label: "基金名称", className: "fund-name" },
    { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
    { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
    { key: "feeRatePct", label: "综合费率", format: "pct", numeric: true },
    { key: "dailyLimit", label: "每日限额" },
    { key: "purchaseStatus", label: "申购状态", format: "status" },
  ];
  const columnsByView = {
    onExchange: [
      { key: "code", label: "代码", className: "fund-code" },
      { key: "name", label: "ETF 名称", className: "fund-name" },
      { key: "trackingIndex", label: "跟踪指数" },
      { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
      { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
      { key: "marketChangePct", label: "场内涨跌", format: "pct", numeric: true },
      { key: "premiumPct", label: "溢价率", format: "premium", numeric: true },
      { key: "turnoverCny100m", label: "成交额(亿)", format: "number", numeric: true },
      { key: "trackingErrorPct", label: "跟踪误差", format: "pct", numeric: true },
      { key: "feeRatePct", label: "综合费率", format: "pct", numeric: true },
    ],
    nasdaq: commonColumns,
    sp500: commonColumns,
    active: commonColumns,
    watchlist: [
      { key: "code", label: "代码", className: "fund-code" },
      { key: "name", label: "基金名称", className: "fund-name" },
      { key: "dataset", label: "分类", format: "dataset" },
      { key: "trackingIndex", label: "跟踪指数" },
      { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
      { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
      { key: "marketChangePct", label: "场内涨跌", format: "pct", numeric: true },
      { key: "premiumPct", label: "溢价率", format: "premium", numeric: true },
      { key: "feeRatePct", label: "综合费率", format: "pct", numeric: true },
      { key: "dailyLimit", label: "每日限额" },
      { key: "purchaseStatus", label: "申购状态", format: "status" },
    ],
  };

  const elements = {
    metricGrid: document.querySelector("#metric-grid"),
    freshness: document.querySelector("#freshness"),
    notice: document.querySelector("#data-notice"),
    tabs: document.querySelector("#view-tabs"),
    search: document.querySelector("#fund-search"),
    status: document.querySelector("#status-filter"),
    exportButton: document.querySelector("#export-button"),
    title: document.querySelector("#view-title"),
    count: document.querySelector("#result-count"),
    head: document.querySelector("#fund-head"),
    body: document.querySelector("#fund-body"),
    empty: document.querySelector("#empty-state"),
    retry: document.querySelector("#retry-button"),
    compareTray: document.querySelector("#compare-tray"),
    compareCount: document.querySelector("#compare-count"),
    compareItems: document.querySelector("#compare-items"),
    clearCompare: document.querySelector("#clear-compare"),
    openCompare: document.querySelector("#open-compare"),
    compareDialog: document.querySelector("#compare-dialog"),
    compareContent: document.querySelector("#compare-content"),
    themeButton: document.querySelector("#theme-button"),
  };

  const state = {
    data: null,
    view: "onExchange",
    query: "",
    status: "all",
    sortKey: null,
    sortDirection: "desc",
    favorites: readStoredSet("51vipai-etf-favorites"),
    compare: readStoredSet("51vipai-etf-compare"),
  };

  function readStoredSet(key) {
    try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
    catch { return new Set(); }
  }

  function persistSet(key, values) {
    try { localStorage.setItem(key, JSON.stringify([...values])); } catch { /* storage can be unavailable */ }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function endpoint() {
    return `${config.apiBaseUrl}${config.dashboardEndpoint}`;
  }

  async function requestDashboard() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);
    try {
      const response = await fetch(endpoint(), { headers: { Accept: "application/json" }, signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      validateDashboard(data);
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  function validateDashboard(data) {
    if (!data || typeof data !== "object") throw new Error("响应不是对象");
    if (!data.meta?.source || !data.meta?.asOf) throw new Error("缺少 source 或 asOf 元数据");
    if (!Array.isArray(data.metrics)) throw new Error("metrics 必须是数组");
    if (!data.datasets || typeof data.datasets !== "object") throw new Error("缺少 datasets");
    ["onExchange", "nasdaq", "sp500", "active"].forEach((key) => {
      if (!Array.isArray(data.datasets[key])) throw new Error(`datasets.${key} 必须是数组`);
    });
  }

  async function loadData() {
    setLoading();
    try {
      state.data = await requestDashboard();
      renderFreshness();
      renderMetrics();
      hideNotice();
    } catch (error) {
      state.data = null;
      renderUnavailable(error);
    }
    renderTable();
  }

  function setLoading() {
    elements.freshness.innerHTML = '<span class="status-dot loading"></span><div><b>正在连接数据服务</b><small>正在验证数据来源与时间</small></div>';
    elements.metricGrid.innerHTML = Array.from({ length: 5 }, () => '<div class="metric-card skeleton" aria-hidden="true"></div>').join("");
    elements.count.textContent = "正在加载数据…";
  }

  function isStale(asOf) {
    const timestamp = Date.parse(asOf);
    if (!Number.isFinite(timestamp)) return true;
    return Date.now() - timestamp > config.staleAfterMinutes * 60 * 1000;
  }

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || "未知");
    return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(date);
  }

  function renderFreshness() {
    const { meta } = state.data;
    const stale = isStale(meta.asOf);
    elements.freshness.innerHTML = `<span class="status-dot ${stale ? "error" : ""}"></span><div><b>${stale ? "数据快照已过期" : "数据服务正常"}</b><small>${escapeHtml(meta.source)} · ${escapeHtml(formatDateTime(meta.asOf))}</small></div>`;
    if (stale) showNotice("当前展示的是过期数据快照，请结合更新时间谨慎使用。", "error");
  }

  function renderMetrics() {
    const metrics = state.data.metrics;
    if (!metrics.length) {
      elements.metricGrid.innerHTML = '<div class="metric-card"><span>市场指标</span><b>—</b><small>数据源暂未返回指标</small></div>';
      return;
    }
    elements.metricGrid.innerHTML = metrics.slice(0, 5).map((metric) => `
      <article class="metric-card">
        <span>${escapeHtml(metric.label)}</span>
        <b class="${Number(metric.changePct) > 0 ? "positive" : Number(metric.changePct) < 0 ? "negative" : ""}">${escapeHtml(metric.displayValue ?? metric.value ?? "—")}</b>
        <small>${escapeHtml(metric.note || metric.asOf || "口径见数据源说明")}</small>
      </article>`).join("");
  }

  function renderUnavailable(error) {
    elements.freshness.innerHTML = '<span class="status-dot error"></span><div><b>数据服务尚未连接</b><small>未展示任何演示行情</small></div>';
    elements.metricGrid.innerHTML = Array.from({ length: 5 }, (_, index) => `<article class="metric-card"><span>${["VIX", "恐慌贪婪", "标普 500 PE", "纳指 100 PE", "美元/人民币"][index]}</span><b>—</b><small>等待真实 API</small></article>`).join("");
    const reason = error?.name === "AbortError" ? "数据请求超时" : "ETF API 尚未部署或暂时不可用";
    showNotice(`${reason}。本页面已停止使用旧版演示数据，第二阶段接入后端后会自动显示真实数据。`, "error");
  }

  function showNotice(message, type = "") {
    elements.notice.textContent = message;
    elements.notice.className = `notice ${type}`.trim();
    elements.notice.hidden = false;
  }
  function hideNotice() { elements.notice.hidden = true; }

  function allFunds() {
    if (!state.data) return [];
    return Object.entries(state.data.datasets).flatMap(([dataset, rows]) => rows.map((row) => ({ ...row, dataset })));
  }

  function currentRows() {
    let rows = state.view === "watchlist"
      ? allFunds().filter((row) => state.favorites.has(row.code))
      : [...(state.data?.datasets?.[state.view] || [])];
    const query = state.query.trim().toLocaleLowerCase("zh-CN");
    if (query) rows = rows.filter((row) => [row.code, row.name, row.trackingIndex].some((value) => String(value || "").toLocaleLowerCase("zh-CN").includes(query)));
    if (state.status !== "all") rows = rows.filter((row) => row.purchaseStatus === state.status);
    if (state.sortKey) rows.sort((a, b) => compareValues(a[state.sortKey], b[state.sortKey]) * (state.sortDirection === "asc" ? 1 : -1));
    return rows;
  }

  function compareValues(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), "zh-CN", { numeric: true });
  }

  function viewColumns() {
    return columnsByView[state.view];
  }

  function formatCell(value, column) {
    if (value == null || value === "") return "—";
    if (column.format === "number") return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
    if (column.format === "pct" || column.format === "premium") {
      const number = Number(value);
      const text = `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
      const className = number > 0 ? "positive" : number < 0 ? "negative" : "";
      return `<span class="${className}">${text}</span>`;
    }
    if (column.format === "status") {
      const labels = { open: "可申购", limited: "限额申购", suspended: "暂停申购" };
      return `<span class="badge ${escapeHtml(value)}">${labels[value] || "状态未知"}</span>`;
    }
    if (column.format === "dataset") {
      const labels = { onExchange: "场内 ETF", nasdaq: "场外纳指", sp500: "场外标普", active: "美股主动" };
      return `<span class="dataset-pill">${labels[value] || "其他"}</span>`;
    }
    return escapeHtml(value);
  }

  function renderTabs() {
    elements.tabs.innerHTML = views.map((view) => `<button type="button" role="tab" data-view="${view.id}" aria-selected="${state.view === view.id}">${view.label}${view.id === "watchlist" ? ` (${state.favorites.size})` : ""}</button>`).join("");
  }

  function renderTable() {
    renderTabs();
    const view = views.find((item) => item.id === state.view);
    const rows = currentRows();
    const columns = viewColumns();
    elements.title.textContent = view.title;
    elements.count.textContent = state.data ? `${rows.length} 条结果 · ${state.data.meta.source}` : "0 条结果 · 等待数据服务";
    elements.exportButton.disabled = rows.length === 0;
    elements.status.disabled = !state.data;
    elements.head.innerHTML = `<tr><th>自选</th><th>对比</th>${columns.map((column) => `<th class="${column.numeric ? "is-number " : ""}sortable" data-sort="${column.key}">${column.label}${state.sortKey === column.key ? (state.sortDirection === "asc" ? " ↑" : " ↓") : ""}</th>`).join("")}</tr>`;
    elements.body.innerHTML = rows.map((row) => `
      <tr>
        <td><button class="icon-button ${state.favorites.has(row.code) ? "on" : ""}" type="button" data-favorite="${escapeHtml(row.code)}" aria-label="${state.favorites.has(row.code) ? "取消自选" : "加入自选"}">${state.favorites.has(row.code) ? "★" : "☆"}</button></td>
        <td><input type="checkbox" data-compare="${escapeHtml(row.code)}" aria-label="加入基金对比" ${state.compare.has(row.code) ? "checked" : ""}></td>
        ${columns.map((column) => `<td class="${column.numeric ? "is-number " : ""}${column.className || ""}">${formatCell(row[column.key], column)}</td>`).join("")}
      </tr>`).join("");
    if (state.view === "watchlist") {
      elements.empty.querySelector("strong").textContent = "还没有加入自选";
      elements.empty.querySelector("p").textContent = "点击任意基金左侧的星标即可加入；自选会保存在当前浏览器本地，方便你把场内、场外和主动 QDII 放在同一张表里观察。";
    } else {
      elements.empty.querySelector("strong").textContent = "暂时没有可展示的数据";
      elements.empty.querySelector("p").textContent = "数据接口未连接或当前筛选没有结果。页面不会用演示数字代替真实行情。";
    }
    elements.empty.hidden = rows.length > 0;
    document.querySelector(".fund-table").hidden = rows.length === 0;
    renderCompareTray();
  }

  function findFund(code) { return allFunds().find((row) => String(row.code) === String(code)); }

  function toggleFavorite(code) {
    state.favorites.has(code) ? state.favorites.delete(code) : state.favorites.add(code);
    persistSet("51vipai-etf-favorites", state.favorites);
    renderTable();
  }

  function toggleCompare(code, checked) {
    if (checked && state.compare.size >= config.compareLimit) {
      showNotice(`最多同时比较 ${config.compareLimit} 只基金。`, "error");
      renderTable();
      return;
    }
    checked ? state.compare.add(code) : state.compare.delete(code);
    persistSet("51vipai-etf-compare", state.compare);
    renderTable();
  }

  function renderCompareTray() {
    const funds = [...state.compare].map(findFund).filter(Boolean);
    elements.compareTray.hidden = funds.length === 0;
    elements.compareCount.textContent = `${funds.length} / ${config.compareLimit}`;
    elements.compareItems.innerHTML = funds.map((fund) => `<span class="compare-chip">${escapeHtml(fund.code)} · ${escapeHtml(fund.name)}</span>`).join("");
    elements.openCompare.disabled = funds.length < 2;
  }

  function openComparison() {
    const funds = [...state.compare].map(findFund).filter(Boolean);
    const fields = [
      ["基金代码", "code"], ["基金名称", "name"], ["跟踪指数", "trackingIndex"],
      ["规模(亿元)", "scaleCny100m"], ["近1年", "return1yPct", "pct"],
      ["综合费率", "feeRatePct", "pct"], ["溢价率", "premiumPct", "pct"],
      ["每日限额", "dailyLimit"], ["申购状态", "purchaseStatus", "status"],
    ];
    elements.compareContent.innerHTML = `<div class="table-wrap"><table class="compare-table"><thead><tr><th>指标</th>${funds.map((fund) => `<th>${escapeHtml(fund.code)}</th>`).join("")}</tr></thead><tbody>${fields.map(([label, key, format]) => `<tr><th>${label}</th>${funds.map((fund) => `<td>${formatCell(fund[key], { format })}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    elements.compareDialog.showModal();
  }

  function exportCsv() {
    const rows = currentRows();
    const columns = viewColumns();
    if (!rows.length) return;
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const lines = [columns.map((column) => quote(column.label)).join(","), ...rows.map((row) => columns.map((column) => quote(row[column.key])).join(","))];
    const blob = new Blob(["\ufeff", lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `51vipai-etf-${state.view}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  elements.tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-view]");
    if (!tab) return;
    state.view = tab.dataset.view; state.sortKey = null; state.query = ""; state.status = "all";
    elements.search.value = ""; elements.status.value = "all"; renderTable();
  });
  elements.search.addEventListener("input", (event) => { state.query = event.target.value; renderTable(); });
  elements.status.addEventListener("change", (event) => { state.status = event.target.value; renderTable(); });
  elements.head.addEventListener("click", (event) => {
    const header = event.target.closest("[data-sort]"); if (!header) return;
    if (state.sortKey === header.dataset.sort) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    else { state.sortKey = header.dataset.sort; state.sortDirection = "desc"; }
    renderTable();
  });
  elements.body.addEventListener("click", (event) => { const button = event.target.closest("[data-favorite]"); if (button) toggleFavorite(button.dataset.favorite); });
  elements.body.addEventListener("change", (event) => { const checkbox = event.target.closest("[data-compare]"); if (checkbox) toggleCompare(checkbox.dataset.compare, checkbox.checked); });
  elements.retry.addEventListener("click", loadData);
  elements.exportButton.addEventListener("click", exportCsv);
  elements.clearCompare.addEventListener("click", () => { state.compare.clear(); persistSet("51vipai-etf-compare", state.compare); renderTable(); });
  elements.openCompare.addEventListener("click", openComparison);
  elements.themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    try { localStorage.setItem("51vipai-theme", document.body.classList.contains("dark") ? "dark" : "light"); } catch { /* ignore */ }
  });

  try { document.body.classList.toggle("dark", localStorage.getItem("51vipai-theme") === "dark"); } catch { /* ignore */ }
  renderTabs();
  loadData();
})();
