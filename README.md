# dsh-client-ui-showcase · 展示优化

**版本：0.5.0** | 许可证：MIT | 零运行时依赖 | Mermaid 已内联，零外链请求

把对话里的代码围栏升级成富组件：内联 SVG/HTML、Mermaid 图表、KaTeX 公式、Artifact 文件卡片、可折叠推理块、代码块复制与主题美化。

> 设计取向：**安静**。不在界面上加任何按钮，开关只存在于配置里，不占屏幕、不打断视线。

---

## 一、能力一览

| 能力 | 触发写法（模型输出） | 效果 |
|---|---|---|
| 内联 SVG 组件 | ```` ```svg ```` 围栏或 `<dsh-svg>` | 原始 SVG 直接渲染进对话气泡，带「复制 SVG」 |
| 内联 HTML 组件 | ```` ```html ```` 围栏或 `<dsh-html>` | 渲染净化后的 HTML 片段，可做卡片、表格、布局 |
| Mermaid 图表 | ```` ```mermaid ```` 围栏 | **内联 UMD 渲染**为 SVG，断网可用，失败降级为代码块 |
| 数学公式 | ```` ```math ```` 围栏 | KaTeX 渲染，失败降级 |
| Artifact 卡片 | ```` ```artifact ````（JSON 或 key: value） | 可点击的文件/链接卡片，按类型显示图标 |
| 可折叠块 | ```` ```reasoning ```` / ```` ```tool ```` / ```` ```thinking ```` | 收进 `<details>`，标题显示字符数，默认收起 |
| 代码块增强 | 任意普通代码块 | 悬浮复制按钮 + 语言徽章 |
| 主题美化 | 全局 | 表格斑马纹、引用条、圆角卡片、玫瑰棕主色 |

所有增强作用域限定在 `html[data-wb-mode="on"]`。

---

## 二、开关（只在配置里，不在界面上）

本插件**没有前台开关按钮**。启用/停用走 profile 的 `cordis.patch.yml`：

```yaml
# 启用
- insert:
    - id: showcase
      name: dsh-client-ui-showcase

# 临时停用（不删条目，改一行）
- insert:
    - id: showcase
      name: dsh-client-ui-showcase
      disabled: true
```

`patchReload=live`，保存后约 1 秒自动重组，不用重启 DSH，也不用刷新页面。

**为什么不做按钮**：按钮是常驻 UI，为了一个几乎不切换的开关，在每屏右下角长期占位不划算；而且它要读 `localStorage` 存状态，容易和配置文件打架（配置说开、localStorage 说关，到底听谁的）。改成纯配置后只有一个真相来源。

---

## 三、安装

### 方式 A：cordis.patch.yml（推荐）

把插件目录放入 profile 的 `node_modules/`（复制或 Windows Junction），然后在 profile 根目录的 `cordis.patch.yml` 追加：

```yaml
- insert:
    - id: showcase
      name: dsh-client-ui-showcase
```

### 方式 B：渲染进程直引

```js
import { startShowcase } from 'dsh-client-ui-showcase'
startShowcase({ enabled: true, mermaid: true })
```

### 方式 C：npm 市场安装（发布后）

```bash
dsh plugin --profile <name> add dsh-client-ui-showcase
```

---

## 四、让模型召唤这些组件

在 system prompt 里交代即可：

> 渲染图表、架构图、流程图时用 ```` ```mermaid ```` 或 ```` ```svg ```` 围栏输出；
> 需要可下载文件时用 ```` ```artifact ````，内容为 JSON：`{"title":"...","path":"...","type":"pdf"}`；
> 长推理过程用 ```` ```reasoning ```` 包裹以便折叠。

模型无需理解任何 slot 协议，照常输出围栏代码块，引擎自动升级。

---

## 五、配置项

| 字段 | 默认 | 说明 |
|---|---|---|
| `enabled` | `true` | 是否启用整套增强 |
| `svg` / `html` | `true` | 内联 SVG / HTML 组件 |
| `mermaid` | `true` | Mermaid 图表（**内联，不走 CDN**） |
| `artifact` | `true` | Artifact 卡片 |
| `math` | `true` | 数学公式（KaTeX，懒加载） |
| `collapsible` | `true` | reasoning/tool/thinking 折叠 |
| `codeCopy` | `true` | 代码块复制 + 语言徽章 |
| `theme` | `true` | 主题 CSS |
| `katexUrl` / `katexCss` | jsDelivr CDN | 懒加载地址（mermaid 已内联，不在此列） |
| `collapsibleOpen` | `{reasoning:false, thinking:false, tool:true}` | 各类折叠块默认展开与否 |

---

## 六、离线与降级

- **Mermaid：完全离线。** 3.4MB 的 UMD 已 base64 内联进 `lib/client.js`，首次用到时解码 → Blob → 注入，实测 448ms 出图，零网络请求。
- **KaTeX：仍走 CDN。** 不可达时公式降级为原始文本，不白屏、不报错。
- 为什么 mermaid 要内联：DSH 宿主只服务 `client.*.js` 形式的 bundle 文件（带 rev 哈希），`vendor/` 下的独立文件会被 404，所以「把库放本地再改路径指过去」这条路在插件机制下不成立，只能内联。

---

## 七、安全说明

引擎会把模型输出直接注入对话界面，净化是硬性要求：

- `lib/sanitize.js` 用 allowlist（元素 + 属性）加危险 URI 过滤，剥离 `<script>`、全部 `on*` 事件处理器、`javascript:` 与危险 `data:` URI、`<foreignObject>`、`<iframe>` 等。
- 结果是提示注入也无法在客户端执行 JS，模型或被注入的内容只能产出静态可视化。
- 如需更强保障，可把 `sanitizeMarkup` 整体替换为 DOMPurify。当前实现是零依赖基线，足以挡住常规 XSS。

---

## 八、技术架构

```
┌─────────────────────────────────────────────────┐
│              DSH Desktop (Electron)              │
│                                                   │
│  ┌─────────────────────────────────────────┐     │
│  │  Host 半侧 (Cordis 插件)                │     │
│  │  lib/index.js → no-op                   │     │
│  │  仅日志确认加载链路                      │     │
│  └──────────────┬──────────────────────────┘     │
│                 │ dsh-client-modules 加载          │
│                 ▼                                  │
│  ┌─────────────────────────────────────────┐     │
│  │  Client 半侧 (渲染进程)                  │     │
│  │  lib/client.js（自包含，含内联 mermaid） │     │
│  │  MutationObserver 监听 DOM 变化          │     │
│  │  代码块升级为富组件                       │     │
│  └─────────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### 核心设计原则

1. **旁挂式增强**：隐藏原代码块（`wb-hidden-src`），组件挂到它旁边。React 卸载原节点时，孤儿回收器清掉残留组件，不触发白屏。
2. **零耦合**：不依赖 DSH slot 协议、不注入 React 组件、不改 DSH 源码。
3. **自包含**：client bundle 把 sanitize、engine、styles、mermaid 全内联进工厂闭包。
4. **惰性启动**：`requestIdleCallback` 加 DOM ready 延迟，不阻塞首屏。

---

## 九、排错

| 现象 | 排查 |
|---|---|
| 完全没反应 | 检查 `cordis.patch.yml` 是否插入；确认 junction 指向正确。看控制台 `[showcase]` 日志 |
| SVG 没渲染 | 检查代码块语言类是否为 `language-svg` |
| Mermaid 显示原始文本 | 内联 mermaid 解码失败，看控制台错误；确认 `lib/client.js` 完整（约 4.6MB） |
| 想临时关掉 | `cordis.patch.yml` 里给 `showcase` 加 `disabled: true` |
| 右下角想看按钮 | 本插件不提供按钮，见第二节 |

---

## 十、文件结构

```
dsh-client-ui-showcase/
├── package.json                     # ESM，dsh 描述符，零运行时依赖
├── cordis.patch.yml                 # 接入示例
├── README.md
└── lib/
    ├── index.js                     # host 半侧 Cordis 入口（no-op）
    ├── client.js                    # renderer 半侧（自包含，内联 mermaid）
    ├── client.d.ts
    ├── engine.js                    # 核心 DOM 升级引擎（ESM 直引）
    ├── sanitize.js                  # SVG/HTML 净化器
    ├── styles.js                    # 主题样式
    └── index.d.ts                   # 类型声明
```

---

## 十一、许可证

MIT License，可自由使用、修改、分发。
