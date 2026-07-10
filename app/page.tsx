"use client";

import { ChangeEvent, useMemo, useState } from "react";

const palettes = [
  { name: "暖粉木质", colors: ["#ef93b4", "#ffe5dc", "#8b4b34", "#191820"] },
  { name: "奶油可可", colors: ["#d5a47d", "#fff2df", "#714434", "#28221f"] },
  { name: "莓果夜色", colors: ["#ff5c96", "#ffd8e6", "#6b3155", "#191420"] },
];

const templateCopy = [
  ["欢迎回家", "让每一个小空间，都有自己的故事。"],
  ["理想生活样本", "从一张封面，延展出完整的视觉体验。"],
  ["今天，住进喜欢里", "把松弛感藏进每一个细节。"],
];

export default function Home() {
  const [cover, setCover] = useState("/cover-reference.png");
  const [palette, setPalette] = useState(0);
  const [strength, setStrength] = useState(82);
  const [roundness, setRoundness] = useState(18);
  const [generation, setGeneration] = useState(0);
  const [activeScreen, setActiveScreen] = useState("首页");
  const copy = templateCopy[generation % templateCopy.length];
  const theme = useMemo(() => palettes[palette], [palette]);

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setCover(URL.createObjectURL(file));
  }

  return (
    <main style={{ "--accent": theme.colors[0], "--soft": theme.colors[1], "--brown": theme.colors[2], "--ink": theme.colors[3], "--radius": `${roundness}px` } as React.CSSProperties}>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">U</span><span>UI STYLE LAB</span><em>封面 → UI</em></div>
        <div className="top-actions"><button className="ghost">项目草稿 <span className="dot" /></button><button className="avatar">LM</button></div>
      </header>

      <section className="workspace">
        <aside className="control-panel">
          <div className="eyebrow">STYLE GENERATOR · 01</div>
          <h1>把封面风格，<br/><span>长成一套 UI。</span></h1>
          <p className="intro">上传一张封面，自动提取色彩、字形与情绪，生成风格统一的界面模板。</p>

          <div className="step">
            <div className="step-title"><b>01</b><span>风格源</span><i>已识别</i></div>
            <label className="upload-card">
              <input type="file" accept="image/*" onChange={upload}/>
              <img src={cover} alt="当前封面参考"/>
              <span className="replace">↻ 替换封面</span>
              <span className="scan" />
            </label>
            <div className="tags"><span>短视频封面</span><span>活力人像</span><span>大字排版</span></div>
          </div>

          <div className="step">
            <div className="step-title"><b>02</b><span>视觉基因</span></div>
            <div className="palette-row">
              {palettes.map((item, index) => <button key={item.name} className={palette === index ? "palette active" : "palette"} onClick={() => setPalette(index)} aria-label={item.name}>{item.colors.map(c => <span key={c} style={{background:c}} />)}</button>)}
            </div>
            <div className="range-label"><span>风格相似度</span><strong>{strength}%</strong></div>
            <input className="range" type="range" min="30" max="100" value={strength} onChange={e => setStrength(+e.target.value)}/>
            <div className="range-label"><span>组件圆角</span><strong>{roundness}px</strong></div>
            <input className="range" type="range" min="0" max="32" value={roundness} onChange={e => setRoundness(+e.target.value)}/>
          </div>

          <button className="generate" onClick={() => setGeneration(g => g + 1)}><span>✦</span> 重新生成 UI <kbd>G</kbd></button>
        </aside>

        <section className="canvas">
          <div className="canvas-head">
            <div><span className="live-dot"/>生成完成 · {strength}% 风格匹配</div>
            <div className="view-actions"><button>−</button><span>74%</span><button>＋</button><button className="export">导出模板 ↗</button></div>
          </div>

          <div className="artboard">
            <div className="style-note note-a">暖木质感<br/><b>WARM / HOME</b></div>
            <div className="style-note note-b">高冲击标题<br/><b>HEAVY TYPE</b></div>

            <article className="phone phone-main">
              <div className="phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
              <div className="hero-photo" style={{backgroundImage:`linear-gradient(180deg, transparent 35%, rgba(18,14,14,.74) 100%), url(${cover})`}}>
                <div className="mini-nav"><b>ROOMIE</b><button>☰</button></div>
                <div className="hero-copy"><small>NEW HOME · 2026</small><h2>{copy[0]}<br/><em>ROOM TOUR</em></h2><p>{copy[1]}</p></div>
              </div>
              <nav className="phone-tabs">{["首页","灵感","收藏","我的"].map((x,i)=><button key={x} className={activeScreen === x ? "selected" : ""} onClick={()=>setActiveScreen(x)}><span>{["⌂","◇","♡","○"][i]}</span>{x}</button>)}</nav>
            </article>

            <article className="phone phone-detail">
              <div className="phone-status"><span>9:41</span><span>● ◔ ▰</span></div>
              <div className="detail-top"><button>←</button><b>{activeScreen === "首页" ? "空间灵感" : activeScreen}</b><button>•••</button></div>
              <div className="detail-image" style={{backgroundImage:`url(${cover})`}}><span>本周精选</span></div>
              <div className="detail-body"><div className="meta">ROOM TOUR <span>6 MIN</span></div><h3>把周末，<br/>过成理想生活。</h3><p>阳光穿过百叶窗，木色与柔粉让家变得松弛又鲜活。</p><div className="author"><span className="author-pic"/><div><b>李小里</b><small>生活方式创作者</small></div><button>＋ 关注</button></div></div>
            </article>

            <article className="component-board">
              <div className="board-head"><span>COMPONENT KIT</span><b>视觉组件</b><em>12 ITEMS</em></div>
              <div className="component-grid">
                <div className="component-card wide"><small>DISPLAY TYPE</small><strong>住进<br/><i>喜欢</i>里</strong><span>Aa 64 / 72</span></div>
                <div className="component-card colors"><small>COLOR TOKENS</small><div>{theme.colors.map((c,i)=><span key={c} style={{background:c}}><em>0{i+1}</em></span>)}</div></div>
                <div className="component-card buttons"><small>BUTTONS</small><button>开始探索 <b>→</b></button><button className="outline">收藏灵感 ♡</button></div>
                <div className="component-card card-sample"><small>CONTENT CARD</small><div className="sample-photo" style={{backgroundImage:`url(${cover})`}}/><b>新家开箱日记</b><span>暖调生活 · 6.2k</span></div>
                <div className="component-card quote"><small>EDITORIAL</small><b>“家，是可以<br/>慢慢完成的。”</b><span>— ROOMIE NOTES</span></div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
