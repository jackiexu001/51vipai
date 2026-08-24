(() => {
  const tools = {
    learning: ["01", "认知提升", "将从市场基础、风险与收益、指数与个股、资产配置和常见认知误区开始，建立进入美股投资前的知识框架。"],
    bank: ["02", "开银行卡", "将整理开户条件、材料清单、费用、安全设置与账户维护注意事项。"],
    broker: ["03", "开美股券商账户", "将从监管、托管、费用、税务资料、入金路径和账户安全等维度提供选择框架。"],
    remittance: ["04", "跨境汇款", "将梳理合规汇款链路、必要信息、到账时间、中间行费用和常见退汇原因。"],
    funding: ["05", "券商出入金", "将整理不同券商的入金与出金流程、币种、费用、到账时间和信息核对清单。"],
  };
  const key = new URLSearchParams(location.search).get("tool");
  const item = tools[key] || ["—", "功能准备中", "这项工具正在规划中。"];
  document.querySelector("#tool-number").textContent = item[0];
  document.querySelector("#tool-title").textContent = item[1];
  document.querySelector("#tool-description").textContent = item[2];
  document.title = `${item[1]} | 51VIPAI`;
})();
