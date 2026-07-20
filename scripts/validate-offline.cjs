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
  querySelectorAll() { return []; }
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
  if (typeof pngBlobFor !== 'function' || typeof pngBytesFor !== 'function') throw new Error('缺少 PNG 渲染函数');
  if (PNG_SCALE !== 2) throw new Error('PNG 高清倍率不是 2 倍');
  if (typeof $('#currentBatchBtn').onclick !== 'function') throw new Error('缺少当前元素库一键打包按钮');
  if (typeof $('#batchBtn').onclick !== 'function') throw new Error('缺少全部元素一键打包按钮');
  if (Object.keys(libraries).length !== 8) throw new Error('风格库数量不是 8');
  if (totalItems() !== 160) throw new Error('组件总数不是 160');
  if (typeof propertyCopy !== 'object' || Object.keys(propertyCopy).length !== 8) throw new Error('房产中文词库不完整');
  for (const [libraryKey, library] of Object.entries(libraries)) {
    if (library.items.length !== 20) throw new Error(library.name + ' 组件数不是 20');
    if (!propertyCopy[libraryKey] || propertyCopy[libraryKey].length !== 20) throw new Error(library.name + ' 房产中文词汇数量不是 20');
    if (libraryKey === 'groovy' && new Set(library.items.map(item => item[2])).size !== library.items.length) throw new Error(library.name + ' 存在重复组件键');
    if (libraryKey === 'planner' && new Set(library.items.map(item => item[2])).size !== library.items.length) throw new Error(library.name + ' 存在重复组件键');
    if (libraryKey === 'sweetheart' && new Set(library.items.map(item => item[2])).size !== library.items.length) throw new Error(library.name + ' 存在重复组件键');
    if (libraryKey === 'botanical' && new Set(library.items.map(item => item[2])).size !== library.items.length) throw new Error(library.name + ' 存在重复组件键');
    for (let i = 0; i < library.items.length; i++) {
      const svg = svgFor(i, libraryKey);
      if (!/[\u3400-\u9fff]/.test(library.items[i][3])) throw new Error(library.items[i][1] + ' 的默认主文字不是中文房产词汇');
      if (!svg.startsWith('<svg')) throw new Error(library.items[i][1] + ' 缺少 SVG 根节点');
      if (!/<(?:rect|circle|ellipse|path|text)\\b/.test(svg)) throw new Error(library.items[i][1] + ' 缺少可见图形');
      if (!/<text\\b/.test(svg)) throw new Error(library.items[i][1] + ' 缺少文字节点');
      if (/foreignObject/i.test(svg)) throw new Error(library.items[i][1] + ' 含 foreignObject');
      const renderedText = (svg.match(/<text\\b[^>]*>[\\s\\S]*?<\\/text>/g) || []).join('').replace(/<[^>]+>/g, '');
      if (/[A-Za-z]/.test(renderedText)) throw new Error(library.items[i][1] + ' 仍显示英文文字');
      if (libraryKey === 'fresh') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !/\\bfill="#fffdf5"/.test(tag))) throw new Error(library.items[i][1] + ' has an incorrect balanced text color');
        if (textTags.some(tag => !tag.includes('font-family="Microsoft YaHei UI,'))) throw new Error(library.items[i][1] + ' is not using the stable Chinese font stack');
        if (textTags.some(tag => !tag.includes('font-weight="700"'))) throw new Error(library.items[i][1] + ' is not using the stable font weight');
        if (textTags.some(tag => !tag.includes('stroke="#303540" stroke-width="3"'))) throw new Error(library.items[i][1] + ' is missing the crisp balanced outline');
        if (textTags.some(tag => !tag.includes('paint-order="stroke fill"'))) throw new Error(library.items[i][1] + ' has an incorrect text paint order');
        if (!svg.includes('<feColorMatrix type="saturate" values="0.78"/>')) throw new Error(library.items[i][1] + ' is missing the balanced saturation filter');
        if ((svg.match(/<feFunc[RGB] type="linear" slope="1.18"\\/>/g) || []).length !== 3) throw new Error(library.items[i][1] + ' is missing the balanced brightness setting');
        if (!svg.includes('<g id="fresh-crisp-text">')) throw new Error(library.items[i][1] + ' text is still inside the color filter');
        if (i === 0 && !/font-size="82"/.test(svg)) throw new Error('Fresh library text size is not balanced');
      }
      if (libraryKey === 'sketch') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !/\\bfill="#fff"/.test(tag))) throw new Error(library.items[i][1] + ' has non-white text');
        if (textTags.some(tag => !tag.includes('font-family="KaiTi,'))) throw new Error(library.items[i][1] + ' is not using the readable handwriting font stack');
        if (textTags.some(tag => !tag.includes('stroke="#19181d" stroke-width="8"'))) throw new Error(library.items[i][1] + ' is missing the readable text outline');
        if (textTags.some(tag => !tag.includes('paint-order="stroke fill"'))) throw new Error(library.items[i][1] + ' has an incorrect text paint order');
        if (textTags.some(tag => !tag.includes('text-rendering="geometricPrecision"'))) throw new Error(library.items[i][1] + ' is missing precise text rendering');
        if (i === 0 && !/stroke-width="30"/.test(svg)) throw new Error('Sketch strokes are not doubled');
      }
      if (libraryKey === 'groovy') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !tag.includes('font-family="Cooper Black,'))) throw new Error(library.items[i][1] + ' is not using the retro display font stack');
      }
      if (libraryKey === 'planner') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !/font-family="(?:Segoe Print|Arial Narrow),/.test(tag))) throw new Error(library.items[i][1] + ' is not using the planner handwriting font stack');
      }
      if (libraryKey === 'sweetheart') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !tag.includes('font-family="Cooper Black,'))) throw new Error(library.items[i][1] + ' is not using the sweetheart display font stack');
      }
      if (libraryKey === 'botanical') {
        const textTags = svg.match(/<text\\b[^>]*>/g) || [];
        if (textTags.some(tag => !/font-family="(?:Cooper Black|Segoe Script),/.test(tag))) throw new Error(library.items[i][1] + ' is not using the botanical display font stack');
      }
      const original = copies[libraryKey + ':' + i];
      copies[libraryKey + ':' + i] = { main: 'MARK_MAIN_' + i, sub: 'MARK_SUB_' + i };
      const edited = svgFor(i, libraryKey);
      if (!edited.includes('MARK_MAIN_' + i)) throw new Error(library.items[i][1] + ' 的可编辑主文字未进入导出 SVG');
      if (edited.includes('MARK_SUB_' + i)) throw new Error(library.items[i][1] + ' 的辅助文字仍出现在导出 SVG');
      if (!edited.includes('transform="translate(0 22)"')) throw new Error(library.items[i][1] + ' 的主文字位置未完成统一微调');
      if (original) copies[libraryKey + ':' + i] = original; else delete copies[libraryKey + ':' + i];
      total++;
    }
    results.push(library.name + ': ' + library.items.length + ' 款通过');
  }
  const files = [];
  for (const [libraryKey, library] of Object.entries(libraries)) {
    library.items.forEach((item, i) => files.push({ name: library.name + '/' + item[1] + '.png', data: new Uint8Array([137, 80, 78, 71, i, libraryKey.length]) }));
  }
  const zip = makeZip(files);
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const count = bytes[bytes.length - 12] | (bytes[bytes.length - 11] << 8);
  if (count !== total) throw new Error('ZIP 文件数量错误：' + count + '，应为 ' + total);
  results.push('ZIP: ' + count + ' 个独立 PNG 通过');
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
