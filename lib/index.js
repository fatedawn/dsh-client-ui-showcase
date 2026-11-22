// lib/index.js
// Host 半侧入口：DSH 主进程（Cordis）加载。
// 纯标记性插件：仅日志确认加载链路，不注册任何 host 服务。
// 增强逻辑全在 client 半侧（lib/client.js），随页面注入生效。
export default function apply(ctx) {
  try {
    ctx?.logger?.('showcase')?.info?.('展示优化 host 半侧已加载（v0.5，配置驱动，无前台开关）')
  } catch (e) {
    try { console.info('[showcase] host 半侧已加载（v0.5，配置驱动，无前台开关）') } catch (e2) {}
  }
}
