// lib/styles.js
// 展示优化：主题与展示增强样式。
// 全部作用域限定在 html[data-wb-mode="on"]，关闭模式即完全不影响原界面。

export const WB_CSS = `
html[data-wb-mode="on"] {
  --wb-bg: #fbfaf7;
  --wb-card: #ffffff;
  --wb-border: #ece7df;
  --wb-accent: #c0392b;        /* 玫瑰棕主色 */
  --wb-accent-soft: #f6e7e3;
  --wb-text: #2c2c2a;
  --wb-muted: #8a857d;
  --wb-code-bg: #f6f4f0;
  --wb-radius: 14px;
  --wb-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
             "Hiragino Sans GB", "Microsoft YaHei", Roboto, Helvetica, Arial, sans-serif;
  --wb-mono: "SF Mono", "JetBrains Mono", "Fira Code", "Cascadia Code",
             Consolas, "Liberation Mono", Menlo, monospace;
}

/* ---------- 基础排版美化 ---------- */
html[data-wb-mode="on"] .wb-content,
html[data-wb-mode="on"] [data-wb-scope] {
  font-family: var(--wb-font);
  color: var(--wb-text);
  line-height: 1.7;
}
html[data-wb-mode="on"] .wb-content h1,
html[data-wb-mode="on"] .wb-content h2,
html[data-wb-mode="on"] .wb-content h3 {
  font-weight: 650;
  line-height: 1.35;
  margin: 1.1em 0 0.5em;
  color: var(--wb-text);
}
html[data-wb-mode="on"] .wb-content h1 { font-size: 1.5em; }
html[data-wb-mode="on"] .wb-content h2 { font-size: 1.28em; }
html[data-wb-mode="on"] .wb-content h3 { font-size: 1.12em; }
html[data-wb-mode="on"] .wb-content p { margin: 0.6em 0; }
html[data-wb-mode="on"] .wb-content ul,
html[data-wb-mode="on"] .wb-content ol { padding-left: 1.4em; margin: 0.5em 0; }
html[data-wb-mode="on"] .wb-content li { margin: 0.25em 0; }
html[data-wb-mode="on"] .wb-content a { color: var(--wb-accent); text-decoration: none; border-bottom: 1px solid var(--wb-accent-soft); }
html[data-wb-mode="on"] .wb-content a:hover { border-bottom-color: var(--wb-accent); }
html[data-wb-mode="on"] .wb-content blockquote {
  margin: 0.8em 0; padding: 0.5em 1em;
  border-left: 3px solid var(--wb-accent); background: var(--wb-accent-soft);
  border-radius: 0 8px 8px 0; color: #5a544d;
}
html[data-wb-mode="on"] .wb-content hr { border: none; border-top: 1px solid var(--wb-border); margin: 1.2em 0; }
html[data-wb-mode="on"] .wb-content img { max-width: 100%; border-radius: 10px; }

/* 表格：斑马纹 + 圆角 */
html[data-wb-mode="on"] .wb-content table {
  border-collapse: separate; border-spacing: 0; width: 100%; margin: 0.8em 0;
  border: 1px solid var(--wb-border); border-radius: 10px; overflow: hidden;
  font-size: 0.92em;
}
html[data-wb-mode="on"] .wb-content th,
html[data-wb-mode="on"] .wb-content td { padding: 8px 12px; border-bottom: 1px solid var(--wb-border); text-align: left; }
html[data-wb-mode="on"] .wb-content th { background: var(--wb-accent-soft); font-weight: 600; }
html[data-wb-mode="on"] .wb-content tr:nth-child(even) td { background: #faf8f5; }
html[data-wb-mode="on"] .wb-content tr:last-child td { border-bottom: none; }

/* ---------- 代码块：语言徽章 + 复制按钮 ---------- */
html[data-wb-mode="on"] pre.wb-code {
  position: relative; background: var(--wb-code-bg);
  border: 1px solid var(--wb-border); border-radius: 10px;
  padding: 14px 14px 12px; margin: 0.8em 0; overflow: auto;
  font-family: var(--wb-mono); font-size: 0.86em; line-height: 1.55;
}
html[data-wb-mode="on"] pre.wb-code code { background: none; padding: 0; }
html[data-wb-mode="on"] .wb-lang-badge {
  position: absolute; top: 0; right: 0; font-size: 11px; letter-spacing: .04em;
  color: var(--wb-muted); background: #efeae2; padding: 2px 8px;
  border-bottom-left-radius: 8px; text-transform: uppercase;
}
html[data-wb-mode="on"] .wb-copy-btn {
  position: absolute; top: 6px; right: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
  font-size: 11px; color: var(--wb-muted); background: #fff;
  border: 1px solid var(--wb-border); border-radius: 6px; padding: 3px 8px;
  transition: all .15s ease; opacity: 0;
}
html[data-wb-mode="on"] pre.wb-code:hover .wb-copy-btn { opacity: 1; }
html[data-wb-mode="on"] .wb-copy-btn:hover { color: var(--wb-accent); border-color: var(--wb-accent); }
html[data-wb-mode="on"] .wb-copy-btn.copied { color: #1a7f37; border-color: #1a7f37; }

/* ---------- 内联 SVG / HTML 组件 ---------- */
html[data-wb-mode="on"] .wb-widget {
  margin: 0.9em 0; border: 1px solid var(--wb-border); border-radius: var(--wb-radius);
  background: var(--wb-card); overflow: hidden;
}
html[data-wb-mode="on"] .wb-widget-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 12px; background: var(--wb-accent-soft);
  font-size: 12px; color: var(--wb-accent); font-weight: 600;
}
html[data-wb-mode="on"] .wb-widget-head .wb-widget-title { display: flex; align-items: center; gap: 6px; }
html[data-wb-mode="on"] .wb-widget-body { padding: 12px; overflow: auto; }
html[data-wb-mode="on"] .wb-widget-body svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
html[data-wb-mode="on"] .wb-svg-copy {
  cursor: pointer; font-size: 11px; color: var(--wb-muted);
  background: #fff; border: 1px solid var(--wb-border); border-radius: 6px; padding: 2px 8px;
}
html[data-wb-mode="on"] .wb-svg-copy:hover { color: var(--wb-accent); border-color: var(--wb-accent); }

/* ---------- Mermaid ---------- */
html[data-wb-mode="on"] .wb-mermaid {
  margin: 0.9em 0; padding: 12px; border: 1px solid var(--wb-border);
  border-radius: var(--wb-radius); background: var(--wb-card); text-align: center;
}
html[data-wb-mode="on"] .wb-mermaid svg { max-width: 100%; height: auto; }

/* ---------- Artifact 卡片 ---------- */
html[data-wb-mode="on"] .wb-artifact-grid { display: flex; flex-wrap: wrap; gap: 10px; margin: 0.8em 0; }
html[data-wb-mode="on"] .wb-artifact {
  display: flex; align-items: center; gap: 12px; min-width: 240px; max-width: 360px;
  padding: 12px 14px; background: var(--wb-card); border: 1px solid var(--wb-border);
  border-radius: 12px; text-decoration: none; color: var(--wb-text);
  transition: all .15s ease;
}
html[data-wb-mode="on"] .wb-artifact:hover { border-color: var(--wb-accent); box-shadow: 0 4px 14px rgba(192,57,43,.10); transform: translateY(-1px); }
html[data-wb-mode="on"] .wb-artifact-icon {
  width: 38px; height: 38px; flex: 0 0 38px; border-radius: 9px;
  display: grid; place-items: center; font-size: 18px; background: var(--wb-accent-soft); color: var(--wb-accent);
}
html[data-wb-mode="on"] .wb-artifact-meta { overflow: hidden; }
html[data-wb-mode="on"] .wb-artifact-title { font-weight: 600; font-size: 0.94em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-wb-mode="on"] .wb-artifact-desc { font-size: 0.8em; color: var(--wb-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
html[data-wb-mode="on"] .wb-artifact-type { font-size: 10px; color: var(--wb-muted); text-transform: uppercase; letter-spacing: .05em; }

/* ---------- 可折叠推理 / 工具块 ---------- */
html[data-wb-mode="on"] details.wb-collapsible {
  margin: 0.7em 0; border: 1px solid var(--wb-border); border-radius: 10px;
  background: var(--wb-card); overflow: hidden;
}
html[data-wb-mode="on"] details.wb-collapsible > summary {
  cursor: pointer; list-style: none; padding: 8px 12px; font-size: 0.85em; font-weight: 600;
  color: var(--wb-muted); background: #faf8f5; display: flex; align-items: center; gap: 8px;
  user-select: none;
}
html[data-wb-mode="on"] details.wb-collapsible > summary::-webkit-details-marker { display: none; }
html[data-wb-mode="on"] details.wb-collapsible > summary::before { content: "▸"; transition: transform .15s; color: var(--wb-accent); }
html[data-wb-mode="on"] details.wb-collapsible[open] > summary::before { transform: rotate(90deg); }
html[data-wb-mode="on"] details.wb-collapsible > .wb-collapsible-body { padding: 10px 12px; border-top: 1px solid var(--wb-border); }
html[data-wb-mode="on"] details.wb-collapsible.wb-tool > summary { color: #1a7f37; }
html[data-wb-mode="on"] details.wb-collapsible.wb-tool > summary::before { color: #1a7f37; }

/* ---------- 浮动开关 ---------- */
html[data-wb-mode="on"] .wb-toggle {
  position: fixed; right: 16px; bottom: 16px; z-index: 99999;
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  font-size: 12px; font-family: var(--wb-font); color: #fff;
  background: var(--wb-accent); border: none; border-radius: 20px;
  padding: 7px 14px; box-shadow: 0 4px 14px rgba(192,57,43,.35);
}
html[data-wb-mode="on"] .wb-toggle:hover { filter: brightness(1.05); }
html[data-wb-mode="on"] .wb-toggle.off { background: #b9b3aa; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
`

export default WB_CSS
