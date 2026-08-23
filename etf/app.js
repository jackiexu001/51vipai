(() => {
  "use strict";

  const config = window.ETF_APP_CONFIG;
  const views = [
    { id: "guide", label: "先弄清指数", title: "纳斯达克 100 与标普 500：先弄清指数，再选择工具" },
    { id: "onExchange", label: "场内 ETF", title: "场内 ETF 溢价与流动性" },
    { id: "nasdaq", label: "场外纳指", title: "纳斯达克指数基金" },
    { id: "sp500", label: "场外标普", title: "标普 500 指数基金" },
    { id: "active", label: "美股主动", title: "主动型美股 QDII" },
    { id: "lazy", label: "懒人组合", title: "经典懒人组合回测与资产配置" },
    { id: "watchlist", label: "我的自选", title: "我的自选基金" },
  ];

  const commonColumns = [
    { key: "code", label: "代码", className: "fund-code" },
    { key: "name", label: "基金名称", className: "fund-name" },
    { key: "nav", label: "最新净值", format: "price", numeric: true },
    { key: "dayChangePct", label: "净值日涨跌", format: "pct", numeric: true },
    { key: "returnYtdPct", label: "今年以来", format: "pct", numeric: true },
    { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
    { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
    { key: "feeRatePct", label: "综合费率", format: "pct", numeric: true },
    { key: "trackingErrorPct", label: "跟踪误差", format: "pct", numeric: true },
    { key: "dailyLimit", label: "每日限额" },
    { key: "purchaseStatus", label: "申购状态", format: "status" },
    { key: "navDate", label: "净值日期", format: "date" },
  ];
  const activeColumns = commonColumns.filter((column) => column.key !== "trackingErrorPct");
  const columnsByView = {
    onExchange: [
      { key: "code", label: "代码", className: "fund-code" },
      { key: "name", label: "ETF 名称", className: "fund-name" },
      { key: "trackingIndex", label: "跟踪指数" },
      { key: "marketPrice", label: "场内价格", format: "price", numeric: true },
      { key: "nav", label: "最新净值", format: "price", numeric: true },
      { key: "marketChangePct", label: "场内涨跌", format: "pct", numeric: true },
      { key: "premiumPct", label: "溢价率", format: "premium", numeric: true },
      { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
      { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
      { key: "turnoverCny100m", label: "成交额(亿)", format: "number", numeric: true },
      { key: "feeRatePct", label: "综合费率", format: "pct", numeric: true },
      { key: "trackingErrorPct", label: "跟踪误差", format: "pct", numeric: true },
      { key: "quoteAsOf", label: "报价时间", format: "shortDateTime" },
      { key: "navDate", label: "净值日期", format: "date" },
    ],
    nasdaq: commonColumns,
    sp500: commonColumns,
    active: activeColumns,
    watchlist: [
      { key: "code", label: "代码", className: "fund-code" },
      { key: "name", label: "基金名称", className: "fund-name" },
      { key: "dataset", label: "分类", format: "dataset" },
      { key: "trackingIndex", label: "跟踪指数" },
      { key: "nav", label: "净值/价格", format: "price", numeric: true },
      { key: "scaleCny100m", label: "规模(亿)", format: "number", numeric: true },
      { key: "returnYtdPct", label: "今年以来", format: "pct", numeric: true },
      { key: "return1yPct", label: "近1年", format: "pct", numeric: true },
      { key: "marketChangePct", label: "场内涨跌", format: "pct", numeric: true },
      { key: "premiumPct", label: "溢价率", format: "premium", numeric: true },
      { key: "trackingErrorPct", label: "跟踪误差", format: "pct", numeric: true },
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
    guidePanel: document.querySelector("#guide-panel"),
    toolbar: document.querySelector(".toolbar"),
    tableSummary: document.querySelector(".table-summary"),
    tableWrap: document.querySelector(".table-wrap"),
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
    lazy: [],
    view: "guide",
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

  async function requestFallbackDashboard() {
    const response = await fetch("fallback-data.json", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`fallback HTTP ${response.status}`);
    const data = await response.json();
    validateDashboard(data);
    return data;
  }

  async function requestLazyPortfolios() {
    const response = await fetch("lazy-portfolios.json", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`lazy HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("lazy-portfolios 必须是数组");
    return data;
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
      const [dashboard, lazy] = await Promise.all([requestDashboard(), requestLazyPortfolios()]);
      state.data = dashboard;
      state.lazy = lazy;
      renderFreshness();
      renderMetrics();
      hideNotice();
    } catch (error) {
      try {
        const [dashboard, lazy] = await Promise.all([requestFallbackDashboard(), requestLazyPortfolios().catch(() => [])]);
        state.data = dashboard;
        state.lazy = lazy;
        renderFreshness();
        renderMetrics();
        const reason = error?.name === "AbortError" ? "ETF API 请求超时" : "ETF API 暂时不可用";
        showNotice(`${reason}，当前使用源头公开数据生成的本地快照。`);
      } catch (fallbackError) {
        state.data = null;
        renderUnavailable(error || fallbackError);
      }
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
    elements.freshness.innerHTML = '<span class="status-dot error"></span><div><b>数据服务尚未连接</b><small>本地快照也未读取成功</small></div>';
    elements.metricGrid.innerHTML = Array.from({ length: 5 }, (_, index) => `<article class="metric-card"><span>${["VIX", "恐慌贪婪", "标普 500 PE", "纳指 100 PE", "美元/人民币"][index]}</span><b>—</b><small>等待真实 API</small></article>`).join("");
    const reason = error?.name === "AbortError" ? "数据请求超时" : "ETF API 尚未部署或暂时不可用";
    showNotice(`${reason}。请确认本地服务器从 ETF 目录启动，并且 fallback-data.json 存在。`, "error");
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
    if (state.view === "guide" || state.view === "lazy") return [];
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
    return columnsByView[state.view] || [];
  }

  function formatCell(value, column) {
    if (value == null || value === "") return "—";
    if (column.format === "number") return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
    if (column.format === "price") return new Intl.NumberFormat("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value);
    if (column.format === "date") return escapeHtml(value);
    if (column.format === "shortDateTime") return escapeHtml(String(value).slice(0, 16).replace("T", " "));
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
    const isPanel = state.view === "guide" || state.view === "lazy";
    elements.guidePanel.hidden = !isPanel;
    elements.toolbar.hidden = isPanel;
    elements.tableSummary.hidden = isPanel;
    elements.tableWrap.hidden = isPanel;
    if (isPanel) {
      elements.guidePanel.innerHTML = state.view === "lazy" ? renderLazyPanel() : renderGuidePanel();
      elements.exportButton.disabled = true;
      renderCompareTray();
      return;
    }
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

  function lazyGrowth(returns) {
    let value = 100;
    return returns.map((item, index) => {
      value *= 1 + item / 100;
      return { year: 2017 + index, value: Math.round(value * 10) / 10, return: item };
    });
  }

  function renderMiniLine(portfolio) {
    const points = lazyGrowth(portfolio.returns);
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const width = 260;
    const height = 70;
    const path = points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.value - min) / (max - min || 1)) * height;
      return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return `<svg viewBox="0 0 ${width} ${height}" class="lazy-mini-line" aria-hidden="true"><path d="${path}" style="stroke:${escapeHtml(portfolio.color)}"></path></svg>`;
  }

  function renderAllocationBars(portfolio) {
    return portfolio.allocs.map(([ticker, weight], index) => `
      <div class="lazy-allocation-row">
        <span class="lazy-dot" style="background:${escapeHtml(lazyColors[index % lazyColors.length])}"></span>
        <b>${escapeHtml(ticker)}</b>
        <em>${escapeHtml(portfolio.allocLabels?.[ticker] || ticker)}</em>
        <i><span style="width:${Number(weight) * 2}%"></span></i>
        <strong>${escapeHtml(weight)}%</strong>
      </div>`).join("");
  }

  const lazyColors = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#a855f7", "#06b6d4", "#f97316", "#84cc16", "#0284c7", "#e11d48"];

  function renderLazyPanel() {
    const portfolios = [...state.lazy];
    if (!portfolios.length) return '<section class="lazy-panel"><div class="empty-state"><strong>懒人组合数据未读取成功</strong><p>请确认 lazy-portfolios.json 已部署。</p></div></section>';
    const best = [...portfolios].sort((a, b) => b.cagr - a.cagr)[0];
    const safest = [...portfolios].sort((a, b) => b.maxDrawdown - a.maxDrawdown)[0];
    const sharpe = [...portfolios].sort((a, b) => b.sharpe - a.sharpe)[0];
    const selected = portfolios.slice(0, 8);
    const years = Array.from({ length: 9 }, (_, index) => 2017 + index);
    return `
      <section class="lazy-panel">
        <div class="lazy-hero">
          <p class="eyebrow">LAZY PORTFOLIOS</p>
          <h2>懒人组合：15 个经典资产配置回测</h2>
          <p>复刻 WiseETF 的懒人组合模块：用 VTI、SPY、BND、TLT、GLD、VNQ、VXUS 等 ETF 组合，比较 2017—2025 年美元口径、年度再平衡后的收益、回撤、夏普与资产配置。</p>
          <div class="lazy-stats">
            <article><span>最高年化</span><b>${escapeHtml(best.name)}</b><strong>${best.cagr}%</strong></article>
            <article><span>最小回撤</span><b>${escapeHtml(safest.name)}</b><strong>${safest.maxDrawdown}%</strong></article>
            <article><span>最高夏普</span><b>${escapeHtml(sharpe.name)}</b><strong>${sharpe.sharpe}</strong></article>
          </div>
        </div>

        <div class="lazy-card-grid">
          ${portfolios.map((portfolio) => `
            <a class="lazy-card" href="../lazy/portfolio/?id=${encodeURIComponent(portfolio.id)}" style="--lazy-color:${escapeHtml(portfolio.color)}">
              <div class="lazy-card-top"></div>
              <div class="lazy-card-head"><span>${portfolio.id}</span><div><h3>${escapeHtml(portfolio.name)}</h3><p>${escapeHtml(portfolio.nameEn)}</p></div></div>
              <small>by ${escapeHtml(portfolio.author)}</small>
              <p>${escapeHtml(portfolio.description)}</p>
              <div class="lazy-kpis">
                <div><b class="positive">${portfolio.cagr}%</b><span>年化收益</span></div>
                <div><b class="negative">${portfolio.maxDrawdown}%</b><span>最大回撤</span></div>
                <div><b>${portfolio.sharpe}</b><span>夏普</span></div>
              </div>
              ${renderMiniLine(portfolio)}
              <div class="lazy-tags">${portfolio.allocs.map(([ticker, weight]) => `<span>${escapeHtml(ticker)} ${escapeHtml(weight)}%</span>`).join("")}</div>
              <button type="button">查看完整分析 →</button>
            </a>`).join("")}
        </div>

        <div class="lazy-section">
          <div class="lazy-section-head"><h3>组合增长曲线对比</h3><p>初始 $100，年度再平衡。下图展示前 8 个组合的累计增长轨迹。</p></div>
          <div class="lazy-growth-chart">
            <svg viewBox="0 0 900 360" role="img" aria-label="组合增长曲线">
              ${[0, 1, 2, 3, 4].map((i) => `<line x1="52" x2="880" y1="${40 + i * 68}" y2="${40 + i * 68}"></line>`).join("")}
              ${selected.map((portfolio) => {
                const points = lazyGrowth(portfolio.returns);
                const allValues = selected.flatMap((item) => lazyGrowth(item.returns).map((point) => point.value));
                const min = Math.min(...allValues);
                const max = Math.max(...allValues);
                const path = points.map((point, index) => {
                  const x = 52 + (index / (points.length - 1)) * 828;
                  const y = 320 - ((point.value - min) / (max - min || 1)) * 280;
                  return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(" ");
                return `<path d="${path}" style="stroke:${escapeHtml(portfolio.color)}"></path>`;
              }).join("")}
              ${years.map((year, index) => `<text x="${52 + (index / (years.length - 1)) * 828}" y="350">${year}</text>`).join("")}
            </svg>
            <div class="lazy-legend">${selected.map((portfolio) => `<a href="../lazy/portfolio/?id=${encodeURIComponent(portfolio.id)}"><i style="background:${escapeHtml(portfolio.color)}"></i>${escapeHtml(portfolio.name)}</a>`).join("")}</div>
          </div>
        </div>

        <div class="lazy-section">
          <div class="lazy-section-head"><h3>指标排序表</h3><p>点击任意行查看组合详情。表格包含 WiseETF 同款核心指标。</p></div>
          <div class="lazy-table-wrap"><table class="lazy-table"><thead><tr><th>组合名称</th><th>年化收益</th><th>最大回撤</th><th>夏普</th><th>Sortino</th><th>波动率</th><th>Beta</th><th>Alpha</th></tr></thead><tbody>
            ${[...portfolios].sort((a, b) => b.cagr - a.cagr).map((portfolio) => `<tr onclick="location.href='../lazy/portfolio/?id=${encodeURIComponent(portfolio.id)}'"><td><i style="background:${escapeHtml(portfolio.color)}"></i><b>${escapeHtml(portfolio.name)}</b><small>${escapeHtml(portfolio.author)}</small></td><td class="positive">${portfolio.cagr}%</td><td class="negative">${portfolio.maxDrawdown}%</td><td>${portfolio.sharpe}</td><td>${portfolio.sortino}</td><td>${portfolio.volatility}%</td><td>${portfolio.beta}</td><td>${portfolio.alpha}</td></tr>`).join("")}
          </tbody></table></div>
        </div>

        <p class="source-note lazy-source">数据来源：Portfolio Visualizer / lazyportfolioetf.com · 回测区间：2017–2025 · 口径：美元 · 年度再平衡。仅供信息参考，不构成投资建议。</p>
      </section>`;
  }

  function renderLazyDetail(portfolio) {
    const growth = lazyGrowth(portfolio.returns);
    const finalValue = growth[growth.length - 1].value;
    const bestYear = Math.max(...portfolio.returns);
    const worstYear = Math.min(...portfolio.returns);
    return `
      <article class="lazy-detail" style="--lazy-color:${escapeHtml(portfolio.color)}">
        <div class="lazy-detail-head">
          <div><span>LAZY PORTFOLIO #${portfolio.id}</span><h3>${escapeHtml(portfolio.name)}</h3><p>${escapeHtml(portfolio.nameEn)} · by ${escapeHtml(portfolio.author)}</p></div>
          <div class="lazy-detail-kpis"><b>${portfolio.cagr}%<small>年化</small></b><b>${portfolio.maxDrawdown}%<small>最大回撤</small></b><b>$${finalValue}<small>$100 终值</small></b></div>
        </div>
        <div class="lazy-detail-grid">
          <div class="lazy-story">
            <h4>策略详解</h4>
            ${portfolio.longDescription.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
            <div class="lazy-chip-row"><span>正收益年份 ${portfolio.returns.filter((item) => item > 0).length}/9</span><span>最佳年份 +${bestYear.toFixed(2)}%</span><span>最差年份 ${worstYear.toFixed(2)}%</span></div>
          </div>
          <div class="lazy-alloc">
            <h4>资产配置</h4>
            ${renderAllocationBars(portfolio)}
          </div>
        </div>
        <div class="lazy-year-grid">
          ${growth.map((point) => `<div><span>${point.year}</span><b class="${point.return >= 0 ? "positive" : "negative"}">${point.return > 0 ? "+" : ""}${point.return.toFixed(2)}%</b><small>$${point.value}</small></div>`).join("")}
        </div>
      </article>`;
  }

  function holdingRows(items) {
    const max = Math.max(...items.map((item) => item.weight));
    return items.map((item) => `
      <div class="holding-row">
        <div><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.ticker)}</span></div>
        <div class="holding-bar" aria-hidden="true"><i style="width:${Math.round((item.weight / max) * 100)}%"></i></div>
        <strong>${item.weight.toFixed(2)}%</strong>
      </div>`).join("");
  }

  function renderGuidePanel() {
    const qqq = [
      { ticker: "NVDA", name: "NVIDIA", weight: 10.15 },
      { ticker: "MSFT", name: "Microsoft", weight: 8.55 },
      { ticker: "AAPL", name: "Apple", weight: 7.87 },
      { ticker: "AMZN", name: "Amazon", weight: 5.37 },
      { ticker: "AVGO", name: "Broadcom", weight: 4.69 },
      { ticker: "META", name: "Meta Platforms", weight: 3.74 },
      { ticker: "GOOGL", name: "Alphabet A", weight: 3.17 },
      { ticker: "GOOG", name: "Alphabet C", weight: 2.94 },
    ];
    const voo = [
      { ticker: "NVDA", name: "NVIDIA", weight: 8.06 },
      { ticker: "MSFT", name: "Microsoft", weight: 6.73 },
      { ticker: "AAPL", name: "Apple", weight: 5.97 },
      { ticker: "AMZN", name: "Amazon", weight: 3.92 },
      { ticker: "META", name: "Meta Platforms", weight: 3.02 },
      { ticker: "AVGO", name: "Broadcom", weight: 2.70 },
      { ticker: "GOOGL", name: "Alphabet A", weight: 2.24 },
      { ticker: "GOOG", name: "Alphabet C", weight: 1.85 },
    ];
    return `
      <section class="guide-section" id="etf-guide" aria-label="纳指与标普投资指南">
        <div class="guide-head">
          <p class="eyebrow">ETF GUIDE</p>
          <h2>纳斯达克 100 与标普 500：先弄清指数，再选择工具</h2>
          <p>先回答“我到底买了什么”，再比较“通过哪种工具买”。这一页按 WiseETF 的信息结构重做：指数差异、核心持仓、三种投资路径、开户动作和风险提醒放在同一个工作台里。</p>
        </div>

        <div class="index-compare-grid">
          <article class="index-card lift-card">
            <span class="index-tag">NASDAQ-100 · QQQ</span>
            <h3>纳斯达克 100：科技成长浓度更高</h3>
            <p>由纳斯达克上市的大型非金融公司组成，修正市值加权。它不是“全市场”，更像美国大型科技、互联网、半导体和创新公司的集中组合。</p>
            <ul>
              <li>风格：成长、科技、头部权重集中。</li>
              <li>优点：长期弹性强，AI/云/半导体暴露更直接。</li>
              <li>代价：估值和波动通常更高，回撤可能更猛。</li>
            </ul>
          </article>
          <article class="index-card lift-card">
            <span class="index-tag">S&amp;P 500 · VOO</span>
            <h3>标普 500：美国大盘核心底仓</h3>
            <p>覆盖美国 500 家大型上市公司，行业更分散。科技仍然重要，但金融、医疗、消费、工业也会分摊组合风险。</p>
            <ul>
              <li>风格：大盘、分散、美国经济 Beta。</li>
              <li>优点：行业覆盖更完整，更适合做核心仓位。</li>
              <li>代价：爆发力通常低于纳指，仍需承受权益波动。</li>
            </ul>
          </article>
        </div>

        <div class="holdings-panel">
          <div>
            <p class="eyebrow">CORE HOLDINGS</p>
            <h3>两个指数的核心持仓占比</h3>
            <p>纳指 100 与标普 500 都绕不开美国超级大盘股；真正的差异在于权重集中度。纳指的前几大科技股更“重”，标普则把更多权重分散给其他行业。</p>
            <p class="source-note">QQQ 截至 2026-04-16 · VOO 截至 2026-03-31 · 来源 stockanalysis.com；权重会随基金披露与指数调整变化。</p>
          </div>
          <div class="holding-columns">
            <article>
              <h4>QQQ / 纳斯达克 100 头部</h4>
              ${holdingRows(qqq)}
            </article>
            <article>
              <h4>VOO / 标普 500 头部</h4>
              ${holdingRows(voo)}
            </article>
          </div>
        </div>

        <div class="ways-intro">
          <p class="eyebrow">THREE ROUTES</p>
          <h3>三种投资方式对比</h3>
          <p>同样是买美股指数，不同路径的“价格、额度、到账、账户、费率、溢价”完全不同。下面这三张卡片可以直接作为选择入口。</p>
        </div>
        <div class="ways-grid dynamic-cards">
          <article class="route-card">
            <span>方式一</span>
            <h3>场外 QDII / 联接基金</h3>
            <p>适合基金平台定投、小额买入、暂时不想开股票账户的人。</p>
            <ul><li>按基金净值申购</li><li>通常不需要证券账户</li><li>容易遇到限额或暂停申购</li></ul>
            <a href="#" data-view-link="nasdaq">查看场外基金页 →</a>
          </article>
          <article class="route-card featured">
            <span>方式二</span>
            <h3>A 股场内 ETF</h3>
            <p>适合已经有证券账户、希望盘中交易的人；重点盯溢价率和成交额。</p>
            <ul><li>人民币场内交易</li><li>交易时段可成交</li><li>价格可能偏离参考净值</li></ul>
            <a href="#" data-view-link="onExchange">查看场内 ETF 页 →</a>
          </article>
          <article class="route-card">
            <span>方式三</span>
            <h3>海外券商直买 QQQ / VOO</h3>
            <p>适合能处理入金、换汇和海外账户操作的人；产品费率通常更低。</p>
            <ul><li>直接持有美国 ETF</li><li>产品选择更丰富</li><li>需了解换汇、税务与合规</li></ul>
            <a href="https://www.wise-invest.org/articles/broker/sQSbLRe8" target="_blank" rel="noopener">查看开户教程 →</a>
          </article>
        </div>

        <div class="account-guide lift-card">
          <div>
            <p class="eyebrow">ACCOUNT GUIDE</p>
            <h3>开户引导：先选路径，再准备账户</h3>
            <p>如果你只是定投，场外基金平台可能最省心；如果你看重盘中价格，优先证券账户；如果想直接买 QQQ / VOO，再考虑海外券商。</p>
          </div>
          <ol>
            <li><b>国内证券账户：</b>用于场内 ETF，重点看交易佣金、ETF 申赎/交易权限和行情报价。</li>
            <li><b>基金销售平台：</b>用于场外 QDII，重点看每日限额、暂停申购、申购费和确认时间。</li>
            <li><b>海外券商账户：</b>用于直接买美股 ETF，重点看入金通道、换汇成本、税务资料和英文操作。</li>
            <li><b>最后再买：</b>先看估值、溢价、额度和自己的回撤承受能力，别把“能买到”误认为“值得现在买”。</li>
          </ol>
        </div>
      </section>`;
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
  elements.guidePanel.addEventListener("click", (event) => {
    const link = event.target.closest("[data-view-link]");
    if (!link) return;
    event.preventDefault();
    state.view = link.dataset.viewLink;
    state.sortKey = null;
    renderTable();
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
