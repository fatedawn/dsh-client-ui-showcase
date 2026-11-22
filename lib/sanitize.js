// lib/sanitize.js
// 轻量、零依赖的 SVG/HTML 净化器（运行在浏览器渲染进程）。
//
// 设计目标：在不引入 DOMPurify 的前提下，把模型（或提示注入）产出的
// SVG/HTML 片段净化到「可安全 innerHTML」的程度。
//
// 净化策略 = allowlist（元素 + 属性）+ 危险 URI 过滤。
// 注意：这里只做基线防护。生产环境若需更强保障，可在 engine.js 里
// 把 sanitizeMarkup 整个替换为 DOMPurify（USE_PROFILES: { svg:true }）。

const SVG_TAGS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'line', 'polyline', 'polygon',
  'ellipse', 'text', 'tspan', 'defs', 'linearGradient', 'radialGradient',
  'stop', 'marker', 'use', 'symbol', 'pattern', 'clipPath', 'filter',
  'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode', 'feColorMatrix',
  'feBlend', 'image', 'switch', 'title', 'desc', 'metadata', 'style',
  'mask',
])

const HTML_TAGS = new Set([
  'div', 'span', 'p', 'b', 'i', 'em', 'strong', 'u', 's', 'br', 'hr',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'ul', 'ol', 'li',
  'a', 'img', 'code', 'pre', 'blockquote', 'section', 'article', 'header',
  'footer', 'small', 'sub', 'sup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'details', 'summary', 'figure', 'figcaption', 'mark', 'abbr', 'time',
  'ruby', 'rt', 'wbr',
])

// 允许的属性（按元素宽松匹配；事件处理器一律删除）
const SAFE_ATTRS = new Set([
  // 通用
  'id', 'class', 'lang', 'dir', 'title', 'role', 'tabindex', 'aria-hidden',
  'aria-label', 'aria-labelledby', 'aria-describedby', 'transform', 'viewBox',
  'preserveAspectRatio', 'width', 'height', 'x', 'y', 'cx', 'cy', 'r', 'rx',
  'ry', 'x1', 'y1', 'x2', 'y2', 'dx', 'dy', 'points', 'd', 'fill', 'stroke',
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity',
  'stroke-opacity', 'fill-rule', 'stroke-dasharray', 'stroke-dashoffset',
  'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline',
  'letter-spacing', 'word-spacing', 'text-decoration', 'clip-path', 'mask',
  'gradientUnits', 'gradientTransform', 'offset', 'stop-color', 'stop-opacity',
  'markerWidth', 'markerHeight', 'markerUnits', 'orient', 'refX', 'refY',
  'patternUnits', 'patternContentUnits', 'patternTransform', 'fx', 'fy',
  'xlink:href', 'href', 'target', 'rel', 'alt', 'src', 'xmlns',
  'xmlns:xlink', 'version', 'baseProfile', 'overflow', 'visibility', 'display',
  'cursor', 'pointer-events', 'vector-effect', 'color-interpolation',
  'color-interpolation-filters', 'filter', 'mix-blend-mode',
])

// 高危标签：直接移除（及其子树）
const FORBIDDEN_TAGS = new Set([
  'script', 'iframe', 'object', 'embed', 'link', 'meta', 'base', 'form',
  'input', 'button', 'textarea', 'select', 'option', 'frame', 'frameset',
  'applet', 'math', 'audio', 'video', 'source', 'track', 'portal',
  'foreignObject',
])

function isAllowedTag(tag) {
  const t = tag.toLowerCase()
  return SVG_TAGS.has(t) || HTML_TAGS.has(t)
}

function safeUri(value) {
  if (typeof value !== 'string') return false
  const v = value.trim().toLowerCase()
  if (v === '' || v === '#') return true
  if (v.startsWith('http://') || v.startsWith('https://')) return true
  if (v.startsWith('mailto:') || v.startsWith('tel:')) return true
  if (v.startsWith('/') || v.startsWith('./') || v.startsWith('../')) return true
  // SVG 内嵌图片允许常见安全图像 data URI
  if (v.startsWith('data:image/') &&
      !/(base64,)?\s*[^;]*script|base64,?[^\n]*<\s*script/i.test(value)) return true
  return false
}

function cleanAttributes(el) {
  const toRemove = []
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase()
    // 事件处理器
    if (name.startsWith('on')) { toRemove.push(attr.name); continue }
    // 不允许的属性
    if (!SAFE_ATTRS.has(name)) { toRemove.push(attr.name); continue }
    // 危险 URI
    if ((name === 'href' || name === 'xlink:href' || name === 'src') &&
        !safeUri(attr.value)) {
      toRemove.push(attr.name); continue
    }
    // style 属性：剥离可能外发/执行的内容
    if (name === 'style') {
      const cleaned = attr.value
        .replace(/url\s*\([^)]*\)/gi, '')
        .replace(/@import[^;]*;?/gi, '')
        .replace(/expression\s*\([^)]*\)/gi, '')
        .replace(/javascript:/gi, '')
      if (cleaned.trim() === '') { toRemove.push(attr.name); continue }
      attr.value = cleaned
    }
  }
  for (const n of toRemove) el.removeAttribute(n)
}

function sanitizeNode(node) {
  const children = Array.from(node.childNodes)
  for (const child of children) {
    if (child.nodeType === 1) {
      const tag = child.tagName.toLowerCase()
      if (FORBIDDEN_TAGS.has(tag)) {
        child.remove()
        continue
      }
      if (!isAllowedTag(tag)) {
        // 未知标签：保留其文本内容，移除标签本身（防御性）
        const text = document.createTextNode(child.textContent || '')
        child.replaceWith(text)
        continue
      }
      cleanAttributes(child)
      sanitizeNode(child)
    } else if (child.nodeType === 8) {
      // 注释节点移除
      child.remove()
    }
  }
}

/**
 * 净化 SVG / HTML 片段。
 * @param {string} markup 原始标记字符串
 * @returns {string} 净化后的 HTML 字符串
 */
export function sanitizeMarkup(markup) {
  if (typeof document === 'undefined') {
    // 非浏览器环境（如 Node 主进程）：原样返回，由调用方判断
    return markup
  }
  const doc = new DOMParser().parseFromString(
    `<div xmlns="http://www.w3.org/1999/xhtml">${markup}</div>`,
    'text/html'
  )
  const root = doc.body.firstElementChild
  if (!root) return ''
  sanitizeNode(root)
  return root.innerHTML
}

export { SVG_TAGS, HTML_TAGS, FORBIDDEN_TAGS, safeUri }
