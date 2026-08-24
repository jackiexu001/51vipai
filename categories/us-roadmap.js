(() => {
  const track = document.querySelector("#roadmap-track");
  const detail = document.querySelector("#roadmap-detail");
  if (!track || !detail) return;

  const steps = [
    {
      number: "01", short: "认知启蒙", icon: "◉", kicker: "FOUNDATION",
      title: "第一步：认知启蒙",
      summary: "先理解指数、公司、ETF、收益与风险的关系，再决定使用什么工具。目标不是立刻交易，而是建立一张不会轻易迷路的市场地图。",
      points: ["看懂标普500、纳斯达克100与主要市场角色", "区分股票、ETF、基金与现金类资产", "建立波动、回撤、汇率和集中度意识"],
      article: "美股新手第一课：先看懂指数、公司和 ETF", href: "../articles/us-stocks-beginner.html", cta: "阅读入门文章",
    },
    {
      number: "02", short: "香港银行卡", icon: "▣", kicker: "BANKING",
      title: "第二步：开香港银行卡",
      summary: "梳理开户资格、所需材料、账户费用和日常维护要求。银行账户是资金路径的一环，重点是信息真实、用途清晰与长期可维护。",
      points: ["提前核对银行最新开户条件与预约方式", "准备真实有效的身份、地址及资金用途资料", "关注账户管理费、转账限额和安全设置"],
      article: "香港银行账户准备清单", href: "#", cta: "文章准备中",
    },
    {
      number: "03", short: "跨境汇款", icon: "↗", kicker: "REMITTANCE",
      title: "第三步：跨境汇款",
      summary: "理解购汇、汇出行、中间行与收款行之间的完整链路，提前核对姓名、账号、币种、用途和费用承担方式。",
      points: ["只使用合法合规、与本人用途一致的资金路径", "核对中英文姓名、SWIFT、账号和收款币种", "记录手续费、到账时间、退汇条件与汇率成本"],
      article: "跨境汇款路径与费用说明", href: "#", cta: "文章准备中",
    },
    {
      number: "04", short: "券商账户", icon: "◇", kicker: "BROKERAGE",
      title: "第四步：开美股券商账户",
      summary: "从监管辖区、资产托管、交易费用、税务文件、入金方式和账户安全六个维度比较券商，不以单一优惠作为决定依据。",
      points: ["核对券商牌照、服务地区与资产托管安排", "理解佣金、平台费、换汇费和行情费用", "完成税务文件并启用双重验证与安全提醒"],
      article: "美股券商账户选择框架", href: "#", cta: "文章准备中",
    },
    {
      number: "05", short: "投研与配置", icon: "◎", kicker: "PORTFOLIO",
      title: "第五步：投研及资产配置",
      summary: "把宏观、指数、行业、公司与估值放进统一研究流程，并通过仓位、分散、再平衡和现金管理控制组合风险。",
      points: ["先确定目标、期限和最大可承受回撤", "建立核心资产、卫星策略与现金缓冲", "用研究日志和定期再平衡代替情绪化交易"],
      article: "从指数工具开始搭建资产配置", href: "../etf/", cta: "进入 ETF 研究台",
    },
  ];

  let activeIndex = 0;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]);

  function renderTrack() {
    track.style.setProperty("--roadmap-progress", `${(activeIndex / (steps.length - 1)) * 100}%`);
    track.innerHTML = steps.map((step, index) => `
      <button type="button" role="tab" aria-selected="${index === activeIndex}" data-step="${index}" class="${index < activeIndex ? "completed" : ""}">
        <span class="roadmap-node"><i>${step.icon}</i><b>${step.number}</b></span>
        <strong>${step.short}</strong>
      </button>`).join("");
  }

  function renderDetail() {
    const step = steps[activeIndex];
    const hasLink = step.href !== "#";
    detail.innerHTML = `
      <div class="roadmap-detail-number">${step.number}</div>
      <div class="roadmap-detail-copy">
        <p class="eyebrow">${escapeHtml(step.kicker)}</p>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.summary)}</p>
        <ul>${step.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
      </div>
      <aside class="roadmap-article-card">
        <span>推荐阅读</span><h4>${escapeHtml(step.article)}</h4>
        ${hasLink ? `<a href="${step.href}">${escapeHtml(step.cta)} →</a>` : `<b>${escapeHtml(step.cta)}</b>`}
      </aside>`;
    detail.classList.remove("is-changing");
    void detail.offsetWidth;
    detail.classList.add("is-changing");
  }

  track.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    activeIndex = Number(button.dataset.step);
    renderTrack();
    renderDetail();
  });

  renderTrack();
  renderDetail();
})();
