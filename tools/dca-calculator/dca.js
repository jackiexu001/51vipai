(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 });
  const knownNames = { VOO: "Vanguard 标普500 ETF", SPY: "SPDR 标普500 ETF", QQQ: "Invesco 纳斯达克100 ETF", BND: "Vanguard 美国债券 ETF", VTI: "Vanguard 美国全市场 ETF", VXUS: "Vanguard 全球除美国 ETF", GLD: "SPDR 黄金 ETF", BTC: "比特币", "BTC-USD": "比特币" };
  const historyKey = "51vipai-dca-history-v1";
  let assets = [
    { type: "美股", symbol: "VOO", name: knownNames.VOO, weight: 60 },
    { type: "美股", symbol: "QQQ", name: knownNames.QQQ, weight: 25 },
    { type: "债券", symbol: "BND", name: knownNames.BND, weight: 15 },
  ];

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const pct = (value) => `${Number(value || 0) >= 0 ? "+" : ""}${number.format(value || 0)}%`;

  function renderAssets() {
    $("#asset-list").innerHTML = assets.map((asset, index) => `<div class="asset-row" data-index="${index}">
      <label>类型<select data-field="type"><option${asset.type === "美股" ? " selected" : ""}>美股</option><option${asset.type === "债券" ? " selected" : ""}>债券</option><option${asset.type === "商品" ? " selected" : ""}>商品</option><option${asset.type === "加密资产" ? " selected" : ""}>加密资产</option></select></label>
      <label>代码<input data-field="symbol" maxlength="20" value="${escapeHtml(asset.symbol)}" placeholder="如 VOO"/></label>
      <label>名称<input data-field="name" value="${escapeHtml(asset.name)}" placeholder="资产名称"/></label>
      <label>权重 (%)<input data-field="weight" type="number" min="0" max="100" step="0.1" value="${asset.weight}"/></label>
      <button type="button" data-remove aria-label="删除资产">×</button></div>`).join("");
    updateWeight();
  }

  function updateWeight() {
    const total = assets.reduce((sum, asset) => sum + Number(asset.weight || 0), 0);
    const node = $("#weight-total");
    node.textContent = `合计 ${total.toFixed(1)}%`;
    node.style.color = Math.abs(total - 100) < .05 ? "var(--green)" : "var(--red)";
  }

  $("#asset-list").addEventListener("input", (event) => {
    const row = event.target.closest(".asset-row");
    if (!row || !event.target.dataset.field) return;
    const asset = assets[Number(row.dataset.index)];
    const field = event.target.dataset.field;
    asset[field] = field === "weight" ? Number(event.target.value) : event.target.value;
    if (field === "symbol") {
      asset.symbol = asset.symbol.toUpperCase().trim();
      if (knownNames[asset.symbol]) asset.name = knownNames[asset.symbol];
    }
    updateWeight();
  });
  $("#asset-list").addEventListener("change", (event) => {
    if (event.target.dataset.field === "symbol") renderAssets();
  });
  $("#asset-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    assets.splice(Number(button.closest(".asset-row").dataset.index), 1);
    renderAssets();
  });
  $("#add-asset").addEventListener("click", () => { if (assets.length < 8) { assets.push({ type: "美股", symbol: "", name: "", weight: 0 }); renderAssets(); } });
  $("#equal-weight").addEventListener("click", () => { if (!assets.length) return; const weight = 100 / assets.length; assets.forEach((asset) => { asset.weight = Number(weight.toFixed(2)); }); assets[assets.length - 1].weight += 100 - assets.reduce((s, a) => s + a.weight, 0); renderAssets(); });
  $("#clear-assets").addEventListener("click", () => { assets = []; renderAssets(); });

  $$(".dca-tabs button").forEach((button) => button.addEventListener("click", () => {
    $$(".dca-tabs button").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
    $$('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== button.dataset.mode; });
  }));

  function chart(points, series) {
    if (!points?.length) return "";
    const width = 900, height = 280, pad = 34;
    const values = points.flatMap((point) => series.map((item) => Number(point[item.key] || 0)));
    const min = Math.min(0, ...values), max = Math.max(...values, 1), range = max - min || 1;
    const x = (index) => pad + index * (width - pad * 2) / Math.max(1, points.length - 1);
    const y = (value) => height - pad - (value - min) * (height - pad * 2) / range;
    const paths = series.map((item) => `<path stroke="${item.color}" d="${points.map((point, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(point[item.key]).toFixed(1)}`).join(" ")}"/>`).join("");
    return `<div class="result-chart"><div class="chart-legend">${series.map((item) => `<span><i style="background:${item.color}"></i>${item.label}</span>`).join("")}</div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="资产增长曲线"><line x1="${pad}" y1="${y(max)}" x2="${width-pad}" y2="${y(max)}"/><line x1="${pad}" y1="${y((max+min)/2)}" x2="${width-pad}" y2="${y((max+min)/2)}"/><line x1="${pad}" y1="${y(min)}" x2="${width-pad}" y2="${y(min)}"/>${paths}<text x="${pad}" y="${height-8}">${escapeHtml(points[0].date)}</text><text x="${width-pad}" y="${height-8}" text-anchor="end">${escapeHtml(points.at(-1).date)}</text></svg></div>`;
  }

  function saveHistory(entry) {
    const list = JSON.parse(localStorage.getItem(historyKey) || "[]");
    list.unshift({ ...entry, at: new Date().toISOString() });
    localStorage.setItem(historyKey, JSON.stringify(list.slice(0, 20)));
  }

  $("#portfolio-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const result = $("#portfolio-result");
    const total = assets.reduce((sum, asset) => sum + Number(asset.weight || 0), 0);
    if (!assets.length || assets.some((asset) => !asset.symbol) || Math.abs(total - 100) > .05) { result.innerHTML = '<p class="result-placeholder">请填写资产代码，并确保权重合计为 100%</p>'; return; }
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.initial = Number(payload.initial); payload.recurring = Number(payload.recurring); payload.assets = assets.map(({ symbol, name, weight }) => ({ symbol, name, weight: Number(weight) }));
    result.innerHTML = '<p class="result-placeholder">正在获取历史行情并运行回测…</p>';
    try {
      const response = await fetch("/api/v1/dca/backtest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.error?.message || body?.message || "回测请求失败");
      const data = body.data;
      result.innerHTML = `<div class="result-kpis"><article><span>最终资产</span><b>${money.format(data.finalValue)}</b><small>累计投入 ${money.format(data.invested)}</small></article><article><span>累计收益</span><b>${money.format(data.profit)}</b><small>${pct(data.returnPct)}</small></article><article><span>年化收益率</span><b>${pct(data.annualizedPct)}</b><small>现金流简化估算</small></article><article><span>最大回撤</span><b>${pct(data.maxDrawdownPct)}</b><small>基准 ${data.benchmark} ${pct(data.benchmarkReturnPct)}</small></article></div>${chart(data.timeline, [{ key: "portfolio", label: "组合市值", color: "#c44d28" }, { key: "benchmark", label: data.benchmark, color: "#277c5d" }, { key: "invested", label: "累计投入", color: "#7c8490" }])}<p class="dca-disclaimer">行情来源：${escapeHtml(body.meta.source)} · 数据截至 ${escapeHtml(body.meta.asOf)}</p>`;
      saveHistory({ type: "组合回测", title: assets.map((asset) => `${asset.symbol} ${asset.weight}%`).join(" · "), summary: `${money.format(data.finalValue)} / ${pct(data.returnPct)}` });
    } catch (error) { result.innerHTML = `<p class="result-placeholder">${escapeHtml(error.message)}。请稍后重试。</p>`; }
  });

  $("#fixed-form").addEventListener("submit", (event) => {
    event.preventDefault(); const form = Object.fromEntries(new FormData(event.currentTarget));
    const periods = { monthly: 12, weekly: 52, yearly: 1 }[form.frequency];
    const years = Number(form.years), count = years * periods, rate = (Number(form.annualRate) / 100 + 1) ** (1 / periods) - 1;
    let value = Number(form.initial), invested = value; const timeline = [{ date: "第 0 年", value, invested }];
    for (let i = 1; i <= count; i += 1) { value = value * (1 + rate) + Number(form.recurring); invested += Number(form.recurring); if (i % periods === 0) timeline.push({ date: `第 ${i / periods} 年`, value, invested }); }
    const profit = value - invested;
    $("#fixed-result").innerHTML = `<div class="result-kpis"><article><span>最终资产</span><b>${money.format(value)}</b><small>${years} 年后</small></article><article><span>累计投入</span><b>${money.format(invested)}</b><small>本金合计</small></article><article><span>预估收益</span><b>${money.format(profit)}</b><small>${pct(invested ? profit / invested * 100 : 0)}</small></article><article><span>预期年化</span><b>${pct(Number(form.annualRate))}</b><small>固定收益率假设</small></article></div>${chart(timeline, [{ key: "value", label: "预估资产", color: "#c44d28" }, { key: "invested", label: "累计投入", color: "#7c8490" }])}`;
    saveHistory({ type: "固定收益估算", title: `${years} 年 · 每期 ${money.format(Number(form.recurring))}`, summary: money.format(value) });
  });

  const cases = [
    { id: "sp500", name: "标普 500", sub: "长期核心资产", symbol: "SPY", intro: "用宽基指数理解长期定投：上涨阶段持续参与，下跌阶段同样金额可买到更多份额。", metrics: [["示例周期", "20 年"], ["定投频率", "每月"], ["主要特征", "行业分散"], ["波动水平", "中高"]] },
    { id: "nasdaq", name: "纳斯达克 100", sub: "成长与高波动", symbol: "QQQ", intro: "成长型指数可能拥有更高的长期回报，也会经历更深的回撤。定投不能消除风险，但能减少择时依赖。", metrics: [["示例周期", "15 年"], ["定投频率", "每月"], ["主要特征", "科技集中"], ["波动水平", "高"]] },
    { id: "bitcoin", name: "比特币", sub: "极高波动案例", symbol: "BTC-USD", intro: "加密资产案例用于展示极端波动中的现金流纪律；它不适合作为所有人的核心资产，也不代表收益承诺。", metrics: [["示例周期", "8 年"], ["定投频率", "每月"], ["主要特征", "周期显著"], ["波动水平", "极高"]] },
  ];
  function showCase(id) { const item = cases.find((value) => value.id === id) || cases[0]; $$("#case-switcher button").forEach((button) => button.classList.toggle("active", button.dataset.id === item.id)); $("#case-detail").innerHTML = `<article class="case-detail"><p class="eyebrow">${item.symbol} · EDUCATION CASE</p><h3>${item.name} 定投观察</h3><p>${item.intro}</p><div class="case-metrics">${item.metrics.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join("")}</div><p>你可以切换到“投资组合测算”，输入 ${item.symbol} 和具体日期，调用历史行情进行个性化回测。</p></article>`; }
  $("#case-switcher").innerHTML = cases.map((item, index) => `<button type="button" data-id="${item.id}" class="${index ? "" : "active"}"><b>${item.name}</b><small>${item.sub}</small></button>`).join("");
  $("#case-switcher").addEventListener("click", (event) => { const button = event.target.closest("button"); if (button) showCase(button.dataset.id); });
  showCase(cases[0].id);

  function renderHistory() { const list = JSON.parse(localStorage.getItem(historyKey) || "[]"); $("#history-list").innerHTML = list.length ? list.map((item) => `<div class="history-entry"><b>${escapeHtml(item.type)} · ${escapeHtml(item.summary)}</b><span>${escapeHtml(item.title)} · ${new Date(item.at).toLocaleString("zh-CN")}</span></div>`).join("") : '<p class="result-placeholder">还没有计算记录</p>'; }
  $("#history-button").addEventListener("click", () => { renderHistory(); $("#history-dialog").showModal(); });
  $("#close-history").addEventListener("click", () => $("#history-dialog").close());
  renderAssets();
})();
