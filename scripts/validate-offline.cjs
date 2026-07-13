const fs = require('fs');
const vm = require('vm');

const file = process.argv[2] || 'outputs/ElementLab-offline.html';
const html = fs.readFileSync(file, 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error('未找到页面脚本');

class FakeElement {
  constructor() {
    this.style = { setProperty() {} };
    this.children = [];
    this.value = '';
    this.innerHTML = '';
    this.textContent = '';
  }
  appendChild(child) { this.children.push(child); return child; }
  querySelector() { return new FakeElement(); }
  remove() {}
  click() {}
}

const nodes = new Map();
const document = {
  body: new FakeElement(),
  querySelector(selector) {
    if (!nodes.has(selector)) nodes.set(selector, new FakeElement());
    return nodes.get(selector);
  },
  createElement() { return new FakeElement(); }
};

const context = {
  document,
  window: {},
  Blob,
  TextEncoder,
  URL,
  setTimeout,
  console
};
context.globalThis = context;

const checks = `
globalThis.__validation = (async () => {
  const results = [];
  let total = 0;
  for (const [libraryKey, library] of Object.entries(libraries)) {
    if (library.items.length !== 20) throw new Error(library.name + ' 组件数不是 20');
    for (let i = 0; i < library.items.length; i++) {
      const svg = svgFor(i, libraryKey);
      if (!svg.startsWith('<svg')) throw new Error(library.items[i][1] + ' 缺少 SVG 根节点');
      if (!/<(?:rect|circle|ellipse|path|text)\\b/.test(svg)) throw new Error(library.items[i][1] + ' 缺少可见图形');
      if (!/<text\\b/.test(svg)) throw new Error(library.items[i][1] + ' 缺少文字节点');
      if (/foreignObject/i.test(svg)) throw new Error(library.items[i][1] + ' 含 foreignObject');
      const original = copies[libraryKey + ':' + i];
      copies[libraryKey + ':' + i] = { main: 'MARK_MAIN_' + i, sub: 'MARK_SUB_' + i };
      const edited = svgFor(i, libraryKey);
      if (!edited.includes('MARK_MAIN_' + i) || !edited.includes('MARK_SUB_' + i)) {
        throw new Error(library.items[i][1] + ' 的可编辑文字未进入导出 SVG');
      }
      if (original) copies[libraryKey + ':' + i] = original; else delete copies[libraryKey + ':' + i];
      total++;
    }
    results.push(library.name + ': ' + library.items.length + ' 款通过');
  }
  const files = [];
  for (const [libraryKey, library] of Object.entries(libraries)) {
    library.items.forEach((item, i) => files.push({ name: library.name + '/' + item[1] + '.svg', text: svgFor(i, libraryKey) }));
  }
  const zip = makeZip(files);
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const count = bytes[bytes.length - 12] | (bytes[bytes.length - 11] << 8);
  if (count !== total) throw new Error('ZIP 文件数量错误：' + count + '，应为 ' + total);
  results.push('ZIP: ' + count + ' 个独立 SVG 通过');
  return results;
})();`;

vm.runInNewContext(match[1] + checks, context, { filename: file });
context.__validation.then(lines => {
  console.log(lines.join('\n'));
  console.log('离线组件库验证通过');
}).catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
