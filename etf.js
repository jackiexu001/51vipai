/*
 * 51VIPAI · ETF 研究模块
 * 当前为前端骨架：数据均为演示数据（dataMode: mock），尚未接入真实行情 API。
 * 数据模式与新鲜度标注遵循 wise-etf-ui 数据契约。
 */

const etfConfig = {
  dataMode: "mock",
  source: "演示数据 · 尚未接入真实行情",
  asOf: "2026.08.21",
  compareLimit: 4,
};

const etfMarket = {
  vix: { label: "VIX 恐慌指数", value: 15.1, change: "-5.8%", tone: "calm" },
  fearGreed: { label: "CNN 恐慌贪婪", value: 55.2, note: "贪婪", tone: "greed" },
  spxPe: { label: "标普500 PE", value: 29.6, note: "历史 91% 分位", tone: "high" },
  ndxPe: { label: "纳指100 PE", value: 30.0, note: "口径：加权调和", tone: "high" },
  fx: { label: "美元/人民币", value: 6.72, note: "≈ 7.30（演示）", tone: "flat" },
};

const etfData = {
  etf: [
    { code: "513100", name: "国泰纳斯达克100ETF(QDII)", trackingIndex: "纳斯达克100", scale: 305.2, feeRate: 0.8, rolling1y: 26.3, marketChangePct: 1.2, premium: 2.8, trackError: 0.9, volume: 18.6 },
    { code: "513110", name: "华安纳斯达克100ETF(QDII)", trackingIndex: "纳斯达克100", scale: 142.6, feeRate: 0.8, rolling1y: 26.1, marketChangePct: 1.3, premium: 1.9, trackError: 1.1, volume: 9.4 },
    { code: "513300", name: "华夏纳斯达克100ETF(QDII)", trackingIndex: "纳斯达克100", scale: 96.8, feeRate: 0.8, rolling1y: 26.0, marketChangePct: 1.1, premium: 1.5, trackError: 1.0, volume: 7.2 },
    { code: "159941", name: "广发纳斯达克100ETF(QDII)", trackingIndex: "纳斯达克100", scale: 221.4, feeRate: 0.8, rolling1y: 25.9, marketChangePct: 1.2, premium: 2.2, trackError: 0.8, volume: 12.8 },
    { code: "159509", name: "景顺长城纳斯达克科技ETF(QDII)", trackingIndex: "纳斯达克科技市值加权", scale: 151.3, feeRate: 1.0, rolling1y: 30.5, marketChangePct: 1.8, premium: 3.6, trackError: 1.4, volume: 8.1 },
    { code: "513500", name: "博时标普500ETF(QDII)", trackingIndex: "标普500", scale: 168.9, feeRate: 0.85, rolling1y: 19.4, marketChangePct: 0.7, premium: 1.2, trackError: 0.7, volume: 6.3 },
    { code: "513390", name: "博时标普500ETF(QDII)美元", trackingIndex: "标普500", scale: 42.5, feeRate: 0.85, rolling1y: 18.9, marketChangePct: 0.6, premium: 0.4, trackError: 0.8, volume: 1.2 },
    { code: "159655", name: "汇添富标普500ETF(QDII)", trackingIndex: "标普500", scale: 38.7, feeRate: 0.85, rolling1y: 19.1, marketChangePct: 0.7, premium: 0.9, trackError: 0.9, volume: 2.1 },
  ],
  nasdaq: [
    { code: "270042", name: "广发纳斯达克100ETF联接(QDII)A", codeC: "006479", feeRate: 0.8, scale: 63.2, rolling1y: 25.4, dayChange: 1.3, dailyLimit: "1000元", buyStatus: "open" },
    { code: "040046", name: "华安纳斯达克100ETF联接(QDII)A", codeC: "006276", feeRate: 0.8, scale: 41.8, rolling1y: 25.1, dayChange: 1.2, dailyLimit: "500元", buyStatus: "limited" },
    { code: "160213", name: "国泰纳斯达克100ETF联接(QDII)A", codeC: "006479", feeRate: 0.8, scale: 58.6, rolling1y: 25.6, dayChange: 1.3, dailyLimit: "3000元", buyStatus: "open" },
    { code: "017091", name: "景顺长城纳斯达克科技市值加权ETF联接A", codeC: "017093", feeRate: 1.0, scale: 49.9, rolling1y: 29.8, dayChange: 1.9, dailyLimit: "暂停申购", buyStatus: "suspended" },
    { code: "000834", name: "大成纳斯达克100指数(QDII)A", codeC: "008971", feeRate: 0.9, scale: 22.4, rolling1y: 25.0, dayChange: 1.2, dailyLimit: "不限额", buyStatus: "open" },
    { code: "015301", name: "华夏纳斯达克100ETF联接(QDII)A", codeC: "015302", feeRate: 0.8, scale: 31.7, rolling1y: 25.3, dayChange: 1.2, dailyLimit: "2000元", buyStatus: "open" },
  ],
  sp500: [
    { code: "050025", name: "博时标普500ETF联接(QDII)A", codeC: "006075", feeRate: 0.85, scale: 47.3, rolling1y: 19.0, dayChange: 0.7, dailyLimit: "1000元", buyStatus: "open" },
    { code: "000051", name: "华夏标普500ETF联接(QDII)A", codeC: "001052", feeRate: 0.85, scale: 36.5, rolling1y: 18.9, dayChange: 0.7, dailyLimit: "暂停申购", buyStatus: "suspended" },
    { code: "161125", name: "易方达标普500指数(QDII-LOF)A", codeC: null, feeRate: 1.0, scale: 52.8, rolling1y: 19.2, dayChange: 0.7, dailyLimit: "500元", buyStatus: "limited" },
    { code: "161128", name: "易方达标普信息科技指数(QDII-FOF)A", codeC: null, feeRate: 1.0, scale: 42.7, rolling1y: 22.8, dayChange: 0.9, dailyLimit: "暂停申购", buyStatus: "suspended" },
  ],
  active: [
    { code: "270023", name: "广发全球精选股票(QDII)A", codeC: "014995", feeRate: 1.4, scale: 28.6, rolling1y: 32.4, dayChange: 1.6, dailyLimit: "2000元", buyStatus: "open" },
    { code: "539002", name: "建信新兴市场优选混合(QDII)A", codeC: null, feeRate: 1.4, scale: 75.9, rolling1y: 102.4, dayChange: 2.4, dailyLimit: "500元", buyStatus: "limited" },
    { code: "006555", name: "浦银安盛全球智能科技股票(QDII)A", codeC: "014002", feeRate: 1.4, scale: 8.7, rolling1y: 45.6, dayChange: 1.8, dailyLimit: "1000元", buyStatus: "open" },
    { code: "486001", name: "工银瑞信全球精选股票(QDII)", codeC: null, feeRate: 1.5, scale: 12.3, rolling1y: 28.9, dayChange: 1.2, dailyLimit: "暂停申购", buyStatus: "suspended" },
    { code: "000041", name: "华夏全球股票(QDII)", codeC: null, feeRate: 1.5, scale: 19.8, rolling1y: 25.7, dayChange: 1.1, dailyLimit: "不限额", buyStatus: "open" },
    { code: "457001", name: "国海富兰克林全球科技互联混合(QDII)A", codeC: "014976", feeRate: 1.5, scale: 9.6, rolling1y: 38.2, dayChange: 1.7, dailyLimit: "3000元", buyStatus: "open" },
  ],
};

const etfPortfolios = [
  { name: "哈利·布朗永久组合", style: "防御均衡", note: "股票/长债/黄金/现金各 25%，目标穿越不同经济周期。", tags: ["25% 股票", "25% 长债", "25% 黄金", "25% 现金"] },
  { name: "斯文森懒人组合", style: "机构化配置", note: "耶鲁捐赠基金简化版，以分散和再平衡为核心。", tags: ["30% 美股", "15% 海外", "15% 美债", "15% TIPS"] },
  { name: "60/40 股债平衡", style: "经典配置", note: "最简单持久的股债搭配，适合长期定投。", tags: ["60% 股票", "40% 债券"] },
  { name: "三基金组合", style: "极简配置", note: "只需三只基金：全市场股、国际股、债券。", tags: ["美股", "国际股", "债券"] },
  { name: "咖啡馆组合", style: "价值均衡", note: "引入小盘价值股，五类资产等权，攻守兼备。", tags: ["小盘价值", "大盘", "国际", "债券", "REITs"] },
  { name: "全球市场组合", style: "全球化", note: "按全球市值比例配置，最大化分散。", tags: ["全球股票", "全球债券"] },
  { name: "桥水全天候", style: "风险平价", note: "按经济环境分配风险，而非按资金比例。", tags: ["增长", "通胀", "衰退", "通缩"] },
  { name: "双基金组合", style: "极简", note: "一只全球股票 + 一只全球债券即可开始。", tags: ["股票", "债券"] },
  { name: "永久组合增强", style: "防御增强", note: "在永久组合基础上加入小盘价值，提高长期收益。", tags: ["永久组合", "小盘价值"] },
  { name: "60/40 全球版", style: "全球化平衡", note: "股债平衡思路的全球化版本。", tags: ["全球股", "全球债"] },
  { name: "保守型组合", style: "稳健", note: "债券为主、股票为辅，追求低波动。", tags: ["30% 股票", "70% 债券"] },
  { name: "平衡型组合", style: "稳健", note: "股债对半，适合大多数长期投资者。", tags: ["50% 股票", "50% 债券"] },
  { name: "进取型组合", style: "成长", note: "股票为主，承受更大波动换取长期收益。", tags: ["80% 股票", "20% 债券"] },
  { name: "股息收入组合", style: "现金流", note: "以高股息资产为重心，追求分红收入。", tags: ["高股息", "REITs", "债券"] },
  { name: "价值加权组合", style: "价值因子", note: "偏向低估值资产，等待均值回归。", tags: ["价值股", "小盘价值"] },
];

const etfState = {
  view: "overview",
  search: "",
  sortKey: null,
  sortDir: "desc",
  favorites: new Set(JSON.parse(localStorage.getItem("etf-favorites") || "[]")),
  compare: new Set(JSON.parse(localStorage.getItem("etf-compare") || "[]")),
};

const etfViews = [
  { id: "overview", label: "市场概览" },
  { id: "etf", label: "场内ETF" },
  { id: "nasdaq", label: "场外纳指" },
  { id: "sp500", label: "场外标普" },
  { id: "active", label: "美股主动" },
  { id: "watchlist", label: "自选" },
  { id: "lazy", label: "组合" },
  { id: "qdii", label: "估值" },
];

function etfSign(v, digits = 2) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
  const n = Number(v);
  return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

function etfNum(v, digits = 1) {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return "—";
  return Number(v).toFixed(digits);
}

function statusBadge(status) {
  const map = {
    open: { label: "可申购", cls: "ok" },
    limited: { label: "限额申购", cls: "warn" },
    suspended: { label: "暂停申购", cls: "bad" },
  };
  const item = map[status] || { label: "状态未知", cls: "dim" };
  return `<span class="etf-badge ${item.cls}">${item.label}</span>`;
}

function premiumBadge(premium) {
  if (premium === null || premium === undefined || Number.isNaN(Number(premium))) {
    return `<span class="etf-badge dim">—</span>`;
  }
  const v = Number(premium);
  const kind = v < 0 ? "折价" : v === 0 ? "平价" : "溢价";
  const cls = v < 0 ? "ok" : v >= 3 ? "bad" : v >= 1.5 ? "warn" : "dim";
  return `<span class="etf-badge ${cls}">${kind} ${Math.abs(v).toFixed(2)}%</span>`;
}

function allFunds() {
  const map = new Map();
  Object.entries(etfData).forEach(([dataset, rows]) => {
    rows.forEach((row) => {
      if (!map.has(row.code)) {
        map.set(row.code, { ...row, dataset });
      }
    });
  });
  return map;
}

function etfTableColumns(viewId) {
  if (viewId === "etf") {
    return [
      { key: "code", label: "代码" },
      { key: "name", label: "ETF 名称" },
      { key: "trackingIndex", label: "跟踪指数" },
      { key: "scale", label: "规模(亿)", type: "num" },
      { key: "rolling1y", label: "近1年", type: "pct" },
      { key: "marketChangePct", label: "场内涨跌", type: "pct" },
      { key: "premium", label: "溢价率", type: "premium" },
      { key: "trackError", label: "跟踪误差", type: "num" },
      { key: "feeRate", label: "费率", type: "num" },
    ];
  }
  if (viewId === "qdii") {
    return [
      { key: "code", label: "代码" },
      { key: "name", label: "基金名称" },
      { key: "scale", label: "规模(亿)", type: "num" },
      { key: "ytdReturn", label: "年初至今", type: "pct" },
      { key: "liveValuation", label: "今日估值", type: "pct" },
      { key: "closeValuation", label: "收盘估值", type: "pct" },
      { key: "coverage", label: "覆盖率", type: "num" },
      { key: "buyStatus", label: "申购状态", type: "status" },
      { key: "dailyLimit", label: "申购上限" },
    ];
  }
  return [
    { key: "code", label: "代码" },
    { key: "name", label: "基金名称" },
    { key: "codeC", label: "C类代码" },
    { key: "feeRate", label: "费率", type: "num" },
    { key: "scale", label: "规模(亿)", type: "num" },
    { key: "rolling1y", label: "近1年", type: "pct" },
    { key: "dayChange", label: "昨日涨跌", type: "pct" },
    { key: "dailyLimit", label: "申购上限" },
    { key: "buyStatus", label: "申购状态", type: "status" },
  ];
}

function viewRows(viewId) {
  if (viewId === "watchlist") {
    const rows = [];
    allFunds().forEach((row) => {
      if (etfState.favorites.has(row.code)) rows.push(row);
    });
    return rows;
  }
  if (viewId === "etf" || viewId === "nasdaq" || viewId === "sp500" || viewId === "active") {
    return [...etfData[viewId]];
  }
  if (viewId === "qdii") {
    return qdiiRows();
  }
  return [];
}

function qdiiRows() {
  const base = [...etfData.nasdaq, ...etfData.sp500, ...etfData.active];
  const seeded = [0.8, 1.3, -0.4, 1.1, 0.6, -0.9, 1.7, 2.2, 0.2, -1.2, 0.9, 1.4, 0.3, -0.6];
  return base.map((row, idx) => ({
    ...row,
    ytdReturn: row.rolling1y != null ? row.rolling1y * 0.8 : null,
    liveValuation: seeded[idx % seeded.length],
    closeValuation: Number((seeded[idx % seeded.length] * 0.9).toFixed(2)),
    coverage: 78 + ((idx * 7) % 20),
    nav: Number((1.8 + (idx % 5) * 0.6).toFixed(4)),
    navDate: "2026.08.20",
  }));
}

function sortRows(rows, columns) {
  const { sortKey, sortDir } = etfState;
  if (!sortKey) return rows;
  const col = columns.find((c) => c.key === sortKey);
  if (!col) return rows;
  return [...rows].sort((a, b) => {
    let va = a[sortKey];
    let vb = b[sortKey];
    if (typeof va === "string" && typeof vb === "string") {
      return sortDir === "asc" ? va.localeCompare(vb, "zh-CN") : vb.localeCompare(va, "zh-CN");
    }
    va = Number(va);
    vb = Number(vb);
    if (Number.isNaN(va) && Number.isNaN(vb)) return 0;
    if (Number.isNaN(va)) return 1;
    if (Number.isNaN(vb)) return -1;
    return sortDir === "asc" ? va - vb : vb - va;
  });
}

function filterRows(rows) {
  const q = etfState.search.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (row) =>
      String(row.name || "").toLowerCase().includes(q) ||
      String(row.code || "").toLowerCase().includes(q) ||
      String(row.trackingIndex || "").toLowerCase().includes(q),
  );
}

function cellValue(row, col) {
  const v = row[col.key];
  if (col.type === "pct") return etfSign(v);
  if (col.type === "num") return etfNum(v);
  if (col.type === "premium") return premiumBadge(v);
  if (col.type === "status") return statusBadge(v);
  return v === null || v === undefined || v === "" ? "—" : v;
}

function renderTableView(viewId) {
  const columns = etfTableColumns(viewId);
  let rows = filterRows(sortRows(viewRows(viewId), columns));
  const titleMap = {
    etf: "场内 ETF 对比",
    nasdaq: "场外 · 纳斯达克100 被动型基金",
    sp500: "场外 · 标普500 被动型基金",
    active: "场外 · 美股主动型基金",
    watchlist: "我的自选",
    qdii: "QDII 基金估值",
  };
  const showSearch = viewId !== "lazy" && viewId !== "overview";
  const hasStatus = viewId === "nasdaq" || viewId === "sp500" || viewId === "active" || viewId === "qdii";
  const statusFilter = hasStatus
    ? `
      <label class="etf-tool">
        <span>状态</span>
        <select data-status-filter>
          <option value="all">全部</option>
          <option value="open">可申购</option>
          <option value="limited">限额申购</option>
          <option value="suspended">暂停申购</option>
        </select>
      </label>`
    : "";

  if (etfState.status && hasStatus) {
    rows = rows.filter((r) => (etfState.status === "all" ? true : r.buyStatus === etfState.status));
  }

  const emptyText =
    viewId === "watchlist"
      ? "自选还是空的，去各板块点击 ☆ 加入自选。"
      : rows.length
        ? ""
        : "没有匹配的内容，试试调整关键词或状态筛选。";

  return `
    <div class="etf-panel">
      <div class="etf-panel-head">
        <div>
          <h3>${titleMap[viewId] || ""}</h3>
          <p class="etf-meta">${rows.length} 条 · 数据模式 mock · ${etfConfig.source} · ${etfConfig.asOf}</p>
        </div>
        <div class="etf-tools">
          ${showSearch ? `<label class="etf-tool"><span>搜索</span><input type="search" class="etf-search" value="${etfState.search}" placeholder="代码 / 名称 / 指数" /></label>` : ""}
          ${statusFilter}
          ${rows.length ? `<button class="etf-btn" data-csv="${viewId}">导出 CSV</button>` : ""}
        </div>
      </div>

      ${
        rows.length
          ? `<div class="etf-table-wrap">
              <table class="etf-table">
                <thead>
                  <tr>
                    <th class="etf-fav-col">☆</th>
                    <th class="etf-cmp-col">对比</th>
                    ${columns
                      .map(
                        (col) => `
                          <th data-sort="${col.key}" class="${col.type === "num" || col.type === "pct" || col.type === "premium" ? "is-num" : ""}">
                            ${col.label}${etfState.sortKey === col.key ? (etfState.sortDir === "asc" ? " ↑" : " ↓") : ""}
                          </th>`,
                      )
                      .join("")}
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map((row) => {
                      const fav = etfState.favorites.has(row.code);
                      const cmp = etfState.compare.has(row.code);
                      return `
                        <tr class="${fav ? "is-fav" : ""}">
                          <td class="etf-fav-col">
                            <button class="etf-icon-btn ${fav ? "on" : ""}" data-fav="${row.code}" aria-label="${fav ? "取消自选" : "加入自选"}" title="${fav ? "取消自选" : "加入自选"}">${fav ? "★" : "☆"}</button>
                          </td>
                          <td class="etf-cmp-col">
                            <input type="checkbox" data-cmp="${row.code}" ${cmp ? "checked" : ""} aria-label="加入对比" />
                          </td>
                          ${columns.map((col) => `<td class="${col.type === "num" || col.type === "pct" || col.type === "premium" ? "is-num" : ""}">${cellValue(row, col)}</td>`).join("")}
                        </tr>`;
                    })
                    .join("")}
                </tbody>
              </table>
            </div>`
          : `<div class="etf-empty">${emptyText}</div>`
      }
    </div>
  `;
}

function renderOverview() {
  const cards = [
    { key: "vix", label: "VIX 恐慌指数", value: "15.1", note: "日 -5.8%", cls: "calm" },
    { key: "fearGreed", label: "恐慌贪婪指数", value: "55.2", note: "贪婪", cls: "greed" },
    { key: "spxPe", label: "标普500 PE", value: "29.6", note: "历史 91% 分位", cls: "high" },
    { key: "ndxPe", label: "纳指100 PE", value: "30.0", note: "加权调和口径", cls: "high" },
    { key: "fx", label: "美元/人民币", value: "6.72", note: "近期窄幅波动", cls: "flat" },
  ];
  return `
    <div class="etf-overview">
      <div class="etf-stat-grid">
        ${cards
          .map(
            (c) => `
              <div class="etf-stat ${c.cls}">
                <span>${c.label}</span>
                <b>${c.value}</b>
                <small>${c.note}</small>
              </div>`,
          )
          .join("")}
      </div>
      <p class="etf-meta">以上为演示数据（mock），接入 API 后展示真实行情并标注来源与时间。</p>
      <div class="etf-card-grid">
        <a class="etf-card" href="#etf" data-etf-tab="etf">
          <span class="etf-card-kicker">场内</span>
          <h4>场内 ETF 溢价监控</h4>
          <p>现价、溢价率、成交量与跟踪误差，点开可看溢价历史。</p>
          <span class="etf-card-link">进入 →</span>
        </a>
        <a class="etf-card" href="#etf" data-etf-tab="nasdaq">
          <span class="etf-card-kicker">场外</span>
          <h4>纳指100 被动基金</h4>
          <p>费率、规模、近1年涨幅与每日申购上限。</p>
          <span class="etf-card-link">进入 →</span>
        </a>
        <a class="etf-card" href="#etf" data-etf-tab="qdii">
          <span class="etf-card-kicker">估值</span>
          <h4>QDII 基金估值</h4>
          <p>今日盘中估值、收盘估值与持仓覆盖率。</p>
          <span class="etf-card-link">进入 →</span>
        </a>
        <a class="etf-card" href="#etf" data-etf-tab="lazy">
          <span class="etf-card-kicker">配置</span>
          <h4>懒人组合指南</h4>
          <p>15 款经典资产配置组合，买入持有、定期再平衡。</p>
          <span class="etf-card-link">进入 →</span>
        </a>
      </div>
    </div>
  `;
}

function renderWatchlist() {
  return renderTableView("watchlist");
}

function renderLazy() {
  return `
    <div class="etf-panel">
      <div class="etf-panel-head">
        <div>
          <h3>懒人组合指南</h3>
          <p class="etf-meta">15 款经典组合 · 回测曲线与净值数据待接入（mock）</p>
        </div>
      </div>
      <div class="etf-portfolio-grid">
        ${etfPortfolios
          .map(
            (p, i) => `
              <div class="etf-portfolio">
                <div class="etf-portfolio-head">
                  <span>${String(i + 1).padStart(2, "0")}</span>
                  <em>${p.style}</em>
                </div>
                <h4>${p.name}</h4>
                <p>${p.note}</p>
                <div class="etf-tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
              </div>`,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderQdii() {
  return renderTableView("qdii");
}

function renderBody() {
  const body = document.querySelector("#etf-body");
  if (!body) return;
  if (etfState.view === "overview") body.innerHTML = renderOverview();
  else if (etfState.view === "lazy") body.innerHTML = renderLazy();
  else if (etfState.view === "watchlist") body.innerHTML = renderWatchlist();
  else if (etfState.view === "qdii") body.innerHTML = renderQdii();
  else body.innerHTML = renderTableView(etfState.view);
  renderCompareTray();
}

function renderCompareTray() {
  let tray = document.querySelector("#etf-compare-tray");
  const count = etfState.compare.size;
  if (!count) {
    if (tray) tray.remove();
    return;
  }
  if (!tray) {
    tray = document.createElement("div");
    tray.id = "etf-compare-tray";
    tray.className = "etf-compare-tray";
    document.querySelector("#etf-module").appendChild(tray);
  }
  const funds = allFunds();
  const names = [...etfState.compare]
    .map((code) => (funds.get(code) || {}).name || code)
    .join("、");
  tray.innerHTML = `
    <span>已选 ${count} / ${etfConfig.compareLimit} 只</span>
    <b title="${names}">${names.slice(0, 40)}${names.length > 40 ? "…" : ""}</b>
    <button class="etf-btn" data-compare-open>对比</button>
    <button class="etf-btn ghost" data-compare-clear>清空</button>
  `;
}

function renderCompareModal() {
  const funds = allFunds();
  const rows = [...etfState.compare].map((code) => funds.get(code)).filter(Boolean);
  if (!rows.length) return;
  const fields = [
    { key: "name", label: "名称" },
    { key: "code", label: "代码" },
    { key: "dataset", label: "板块" },
    { key: "feeRate", label: "费率", fmt: (v) => (v == null ? "—" : `${v}%`) },
    { key: "scale", label: "规模(亿)", fmt: (v) => etfNum(v) },
    { key: "rolling1y", label: "近1年", fmt: (v) => etfSign(v) },
    { key: "premium", label: "溢价率", fmt: (v) => (v == null ? "—" : premiumBadge(v)) },
    { key: "buyStatus", label: "申购状态", fmt: (v) => statusBadge(v) },
  ];
  const datasetLabel = { etf: "场内ETF", nasdaq: "场外纳指", sp500: "场外标普", active: "美股主动" };
  const overlay = document.createElement("div");
  overlay.className = "etf-modal-overlay";
  overlay.innerHTML = `
    <div class="etf-modal" role="dialog" aria-modal="true" aria-label="基金对比">
      <div class="etf-modal-head">
        <h3>基金横向对比</h3>
        <button class="etf-icon-btn" data-modal-close aria-label="关闭">×</button>
      </div>
      <div class="etf-table-wrap">
        <table class="etf-table compare-table">
          <tbody>
            ${fields
              .map(
                (f) => `
                  <tr>
                    <th>${f.label}</th>
                    ${rows
                      .map((row) => {
                        const v = row[f.key];
                        const display = f.fmt ? f.fmt(v) : v === null || v === undefined ? "—" : f.key === "dataset" ? datasetLabel[v] || v : v;
                        return `<td>${display}</td>`;
                      })
                      .join("")}
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <p class="etf-meta">数据模式 mock，仅用于前端联调；真实对比需接入 API 后按统一口径计算。</p>
    </div>
  `;
  const module = document.querySelector("#etf-module");
  (module || document.body).appendChild(overlay);
}

function exportCsv(viewId) {
  const columns = etfTableColumns(viewId);
  let rows = viewRows(viewId);
  if (etfState.status && viewId !== "qdii" && viewId !== "etf") {
    rows = rows.filter((r) => (etfState.status === "all" ? true : r.buyStatus === etfState.status));
  }
  const head = ["代码", "名称", ...columns.filter((c) => c.key !== "code" && c.key !== "name").map((c) => c.label)];
  const lines = [
    head.join(","),
    ...rows.map((row) =>
      [
        row.code,
        `"${String(row.name || "").replace(/"/g, '""')}"`,
        ...columns.filter((c) => c.key !== "code" && c.key !== "name").map((c) => cellValue(row, c).replace(/<[^>]+>/g, "")),
      ].join(","),
    ),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `51vipai-${viewId}-${etfConfig.asOf.replace(/\./g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function setView(viewId) {
  etfState.view = viewId;
  etfState.search = "";
  etfState.sortKey = null;
  etfState.status = "all";
  document.querySelectorAll("[data-etf-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.etfTab === viewId);
  });
  renderBody();
}

function renderEtfModule() {
  const module = document.querySelector("#etf-module");
  if (!module) return;
  module.innerHTML = `
    <div class="etf-head">
      <div>
        <p class="eyebrow">ETF Research · 第三个模块</p>
        <h2>ETF / QDII 研究</h2>
        <p class="etf-meta">数据模式 mock · 尚未接入真实行情 API · 来源与时间会在接入后标注</p>
      </div>
    </div>
    <nav class="etf-tabs" aria-label="ETF 子栏目">
      ${etfViews.map((v) => `<button class="etf-tab" type="button" data-etf-tab="${v.id}">${v.label}</button>`).join("")}
    </nav>
    <div class="etf-body" id="etf-body"></div>
  `;
  const activeTab = etfViews.find((v) => v.id === etfState.view);
  document.querySelectorAll("[data-etf-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab === activeTab);
  });
  renderBody();
}

document.querySelector("#etf-module")?.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-etf-tab]");
  const sort = event.target.closest("[data-sort]");
  const fav = event.target.closest("[data-fav]");
  const cmp = event.target.closest("[data-cmp]");
  const csv = event.target.closest("[data-csv]");
  const openCompare = event.target.closest("[data-compare-open]");
  const clearCompare = event.target.closest("[data-compare-clear]");
  const closeModal = event.target.closest("[data-modal-close]");

  if (tab) {
    event.preventDefault();
    setView(tab.dataset.etfTab);
    return;
  }
  if (sort) {
    const key = sort.dataset.sort;
    if (etfState.sortKey === key) {
      etfState.sortDir = etfState.sortDir === "asc" ? "desc" : "asc";
    } else {
      etfState.sortKey = key;
      etfState.sortDir = "desc";
    }
    renderBody();
    return;
  }
  if (fav) {
    const code = fav.dataset.fav;
    if (etfState.favorites.has(code)) etfState.favorites.delete(code);
    else etfState.favorites.add(code);
    localStorage.setItem("etf-favorites", JSON.stringify([...etfState.favorites]));
    renderBody();
    return;
  }
  if (cmp) {
    const code = cmp.dataset.cmp;
    if (etfState.compare.has(code)) {
      etfState.compare.delete(code);
    } else if (etfState.compare.size < etfConfig.compareLimit) {
      etfState.compare.add(code);
    }
    localStorage.setItem("etf-compare", JSON.stringify([...etfState.compare]));
    renderBody();
    return;
  }
  if (csv) {
    exportCsv(csv.dataset.csv);
    return;
  }
  if (openCompare) {
    renderCompareModal();
    return;
  }
  if (clearCompare) {
    etfState.compare.clear();
    localStorage.setItem("etf-compare", JSON.stringify([]));
    renderBody();
    return;
  }
  if (closeModal) {
    event.target.closest(".etf-modal-overlay")?.remove();
  }
});

document.querySelector("#etf-module")?.addEventListener("input", (event) => {
  const search = event.target.closest(".etf-search");
  if (search) {
    etfState.search = search.value;
    renderBody();
  }
});

document.querySelector("#etf-module")?.addEventListener("change", (event) => {
  const status = event.target.closest("[data-status-filter]");
  if (status) {
    etfState.status = status.value;
    renderBody();
  }
});

document.querySelector("#etf-module")?.addEventListener("click", (event) => {
  if (event.target.classList.contains("etf-modal-overlay")) {
    event.target.remove();
  }
});

// 如果页面以 #etf 打开且脚本加载完成时 tab 已激活，则补渲染
if (document.querySelector(".nav-tab.active")?.dataset.category === "etf") {
  renderEtfModule();
}
