(() => {
  "use strict";

  const years = Array.from({ length: 9 }, (_, index) => 2017 + index);
  const colors = ["#6366f1", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#a855f7", "#06b6d4", "#f97316", "#84cc16", "#0284c7", "#e11d48"];
  const dataUrl = "/etf/lazy-portfolios.json";
  const isDetail = location.pathname.includes("/lazy/portfolio");

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  function growth(returns) {
    let value = 100;
    return returns.map((item, index) => {
      value *= 1 + item / 100;
      return { year: years[index], value: Math.round(value * 10) / 10, return: item };
    });
  }

  function detailHref(id) {
    return `portfolio/?id=${encodeURIComponent(id)}`;
  }

  function miniLine(portfolio) {
    const points = growth(portfolio.returns);
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const path = smoothPath(points.map((point, index) => {
      const x = (index / (points.length - 1)) * 260;
      const y = 72 - ((point.value - min) / (max - min || 1)) * 70;
      return [x, y];
    }));
    return `<svg viewBox="0 0 260 74" class="mini"><path d="${path}" style="stroke:${esc(portfolio.color)}"></path></svg>`;
  }

  function renderList(portfolios) {
    const best = [...portfolios].sort((a, b) => b.cagr - a.cagr)[0];
    const safest = [...portfolios].sort((a, b) => b.maxDrawdown - a.maxDrawdown)[0];
    const sharpe = [...portfolios].sort((a, b) => b.sharpe - a.sharpe)[0];
    document.querySelector("#summary-grid").innerHTML = [
      ["最高年化", best.name, `${best.cagr}%`],
      ["最小回撤", safest.name, `${safest.maxDrawdown}%`],
      ["最高夏普", sharpe.name, sharpe.sharpe],
    ].map(([label, name, value]) => `<article><span>${label}</span><b>${esc(name)}</b><strong>${esc(value)}</strong></article>`).join("");

    document.querySelector("#portfolio-grid").innerHTML = portfolios.map((portfolio) => `
      <a class="portfolio-card" href="${detailHref(portfolio.id)}" style="--c:${esc(portfolio.color)}">
        <i></i>
        <div class="card-head"><span>${portfolio.id}</span><div><h2>${esc(portfolio.name)}</h2><p>${esc(portfolio.nameEn)}</p></div></div>
        <small>by ${esc(portfolio.author)}</small>
        <p>${esc(portfolio.description)}</p>
        <div class="kpis"><div><b class="good">${portfolio.cagr}%</b><span>年化收益</span></div><div><b class="bad">${portfolio.maxDrawdown}%</b><span>最大回撤</span></div><div><b>${portfolio.sharpe}</b><span>夏普</span></div></div>
        ${miniLine(portfolio)}
        <div class="tags">${portfolio.allocs.map(([ticker, weight]) => `<em>${esc(ticker)} ${esc(weight)}%</em>`).join("")}</div>
        <button type="button">查看完整分析 →</button>
      </a>`).join("");

    renderGrowthChart(portfolios.slice(0, 8));
    document.querySelector("#ranking-body").innerHTML = [...portfolios].sort((a, b) => b.cagr - a.cagr).map((portfolio) => `
      <tr onclick="location.href='${detailHref(portfolio.id)}'">
        <td><i style="background:${esc(portfolio.color)}"></i><b>${esc(portfolio.name)}</b><small>${esc(portfolio.author)}</small></td>
        <td class="good">${portfolio.cagr}%</td><td class="bad">${portfolio.maxDrawdown}%</td><td>${portfolio.sharpe}</td><td>${portfolio.sortino}</td><td>${portfolio.volatility}%</td><td>${portfolio.beta}</td><td>${portfolio.alpha}</td>
      </tr>`).join("");
  }

  function renderGrowthChart(portfolios) {
    const allValues = portfolios.flatMap((item) => growth(item.returns).map((point) => point.value));
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const paths = portfolios.map((portfolio) => {
      const path = smoothPath(growth(portfolio.returns).map((point, index) => {
        const x = 54 + (index / 8) * 820;
        const y = 320 - ((point.value - min) / (max - min || 1)) * 280;
        return [x, y];
      }));
      return `<path d="${path}" style="stroke:${esc(portfolio.color)}"></path>`;
    }).join("");
    document.querySelector("#growth-chart").innerHTML = `
      <svg viewBox="0 0 900 360">${[0,1,2,3,4].map((i) => `<line x1="54" x2="874" y1="${40 + i * 70}" y2="${40 + i * 70}"></line>`).join("")}${paths}${years.map((year, index) => `<text x="${54 + (index / 8) * 820}" y="350">${year}</text>`).join("")}</svg>
      <div class="legend">${portfolios.map((portfolio) => `<a href="${detailHref(portfolio.id)}"><i style="background:${esc(portfolio.color)}"></i>${esc(portfolio.name)}</a>`).join("")}</div>`;
  }

  function renderDetail(portfolios) {
    const id = new URLSearchParams(location.search).get("id") || "1";
    const portfolio = portfolios.find((item) => String(item.id) === String(id)) || portfolios[0];
    document.title = `${portfolio.name} | 懒人组合 | 51VIPAI`;
    const g = growth(portfolio.returns);
    const finalValue = g[g.length - 1].value;
    const best = Math.max(...portfolio.returns);
    const worst = Math.min(...portfolio.returns);
    document.querySelector("#detail-root").innerHTML = `
      <header class="detail-hero" style="--c:${esc(portfolio.color)}">
        <nav><a href="../">← 返回懒人组合</a><a href="../../etf/">ETF</a></nav>
        <section><span>LAZY PORTFOLIO #${portfolio.id}</span><h1>${esc(portfolio.name)}</h1><p>${esc(portfolio.nameEn)} · by ${esc(portfolio.author)}</p>
        <div class="hero-kpis"><b>${portfolio.cagr}%<small>年化收益</small></b><b>${portfolio.maxDrawdown}%<small>最大回撤</small></b><b>${portfolio.sharpe}<small>夏普比率</small></b><b>${portfolio.sortino}<small>索提诺比率</small></b><b>${portfolio.volatility}%<small>年化波动率</small></b><b>+${best.toFixed(1)}%<small>最佳年份</small></b><b>${worst.toFixed(1)}%<small>最差年份</small></b></div></section>
      </header>
      <main class="detail-shell">
        <section class="detail-grid">
          <article class="story"><h2>策略详解</h2>${portfolio.longDescription.map((item) => `<p>${esc(item)}</p>`).join("")}<div class="chips"><span>正收益年份 ${portfolio.returns.filter((item) => item > 0).length}/9</span><span>最佳年份 +${best.toFixed(2)}%</span><span>最差年份 ${worst.toFixed(2)}%</span></div></article>
          <article class="alloc"><h2>资产配置</h2>${donut(portfolio)}${portfolio.allocs.map(([ticker, weight], index) => `<div><i style="background:${colors[index % colors.length]}"></i><b>${esc(ticker)}</b><em>${esc(portfolio.allocLabels[ticker] || ticker)}</em><span><u style="width:${weight * 2}%"></u></span><strong>${weight}%</strong></div>`).join("")}</article>
        </section>
        <section class="panel"><div class="panel-head"><div><p>GROWTH</p><h2>累计净值增长</h2></div><small>初始 $100 → $${finalValue}</small></div>${detailLine(portfolio)}</section>
        <section class="panel"><div class="panel-head"><div><p>RETURNS</p><h2>历年年度收益率</h2></div><small>绿色为正收益，红色为负收益</small></div>${barChart(portfolio)}</section>
        <section class="panel"><div class="panel-head"><div><p>DETAILS</p><h2>逐年回报明细</h2></div><small>2017—2025</small></div><div class="return-table"><table><thead><tr><th>年份</th><th>年度收益率</th><th>累计净值</th><th>较上年变化</th></tr></thead><tbody>${g.map((point, index) => {
          const prev = index === 0 ? 100 : g[index - 1].value;
          const diff = point.value - prev;
          return `<tr><td>${point.year}</td><td><span class="${point.return >= 0 ? "pill-good" : "pill-bad"}">${point.return > 0 ? "+" : ""}${point.return.toFixed(2)}%</span></td><td>$${point.value.toFixed(1)}</td><td class="${diff >= 0 ? "good" : "bad"}">${diff >= 0 ? "+" : ""}${diff.toFixed(1)}</td></tr>`;
        }).join("")}</tbody></table></div></section>
        <p class="source">数据来源：Portfolio Visualizer / lazyportfolioetf.com · 回测区间：2017–2025 · 口径：美元 · 年度再平衡。历史回测不代表未来表现。</p>
      </main>`;
  }

  function smoothPath(points) {
    if (!points.length) return "";
    if (points.length === 1) return `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    let path = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const [x0, y0] = points[index];
      const [x1, y1] = points[index + 1];
      const dx = (x1 - x0) / 2;
      path += ` C${(x0 + dx).toFixed(1)},${y0.toFixed(1)} ${(x1 - dx).toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return path;
  }

  function donut(portfolio) {
    const total = portfolio.allocs.reduce((sum, [, weight]) => sum + Number(weight), 0);
    let offset = 0;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const circles = portfolio.allocs.map(([, weight], index) => {
      const length = Number(weight) / total * circumference;
      const circle = `<circle r="${radius}" cx="60" cy="60" stroke="${colors[index % colors.length]}" stroke-width="20" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" />`;
      offset += length;
      return circle;
    }).join("");
    return `<svg class="donut" viewBox="0 0 120 120" aria-label="资产配置环形图"><g transform="rotate(-90 60 60)">${circles}</g><circle r="24" cx="60" cy="60" fill="#fff"/></svg>`;
  }

  function detailLine(portfolio) {
    const points = growth(portfolio.returns);
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const path = smoothPath(points.map((point, index) => {
      const x = 60 + (index / 8) * 800;
      const y = 300 - ((point.value - min) / (max - min || 1)) * 260;
      return [x, y];
    }));
    return `<svg class="detail-line" viewBox="0 0 900 330"><defs><pattern id="dotgrid" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#e8eef7"/></pattern></defs><rect width="900" height="330" fill="url(#dotgrid)"/><path d="${path}" style="stroke:${esc(portfolio.color)}"></path>${points.map((point, index) => {
      const x = 60 + (index / 8) * 800;
      const y = 300 - ((point.value - min) / (max - min || 1)) * 260;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${esc(portfolio.color)}"/>`;
    }).join("")}${years.map((year, index) => `<text x="${60 + (index / 8) * 800}" y="320">${year}</text>`).join("")}</svg>`;
  }

  function barChart(portfolio) {
    const maxAbs = Math.max(...portfolio.returns.map((item) => Math.abs(item)), 30);
    return `<svg class="bar-chart" viewBox="0 0 900 320" aria-label="历年年度收益率"><defs><pattern id="bardots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#e8eef7"/></pattern></defs><rect width="900" height="320" fill="url(#bardots)"/><line x1="56" x2="870" y1="160" y2="160" />${portfolio.returns.map((ret, index) => {
      const slot = 814 / portfolio.returns.length;
      const x = 70 + index * slot;
      const h = Math.abs(ret) / maxAbs * 125;
      const y = ret >= 0 ? 160 - h : 160;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.min(slot * .78, 76).toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${ret >= 0 ? "#22c55e" : "#ef4444"}" opacity=".78"/><text x="${(x + slot * .39).toFixed(1)}" y="300">${years[index]}</text>`;
    }).join("")}<text x="28" y="44">30%</text><text x="30" y="164">0%</text><text x="22" y="286">-30%</text></svg>`;
  }

  fetch(dataUrl)
    .then((response) => response.json())
    .then((portfolios) => isDetail ? renderDetail(portfolios) : renderList(portfolios))
    .catch((error) => {
      document.body.innerHTML = `<main class="shell"><p class="source">懒人组合数据加载失败：${esc(error.message)}</p></main>`;
    });
})();
