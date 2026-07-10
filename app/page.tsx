"use client";

import { ChangeEvent, useState } from "react";

const categories = ["全部", "弹窗", "贴画", "特效文字", "空间按钮", "信息卡"];
const assets = [
  {id:"modal-welcome",cat:"弹窗",name:"欢迎弹窗",kind:"modal"},
  {id:"modal-choice",cat:"弹窗",name:"二选一弹窗",kind:"choice"},
  {id:"toast-success",cat:"弹窗",name:"成功提示",kind:"toast"},
  {id:"sticker-wow",cat:"贴画",name:"手写惊叹贴",kind:"wow"},
  {id:"sticker-note",cat:"贴画",name:"便利贴标签",kind:"note"},
  {id:"sticker-burst",cat:"贴画",name:"爆炸贴",kind:"burst"},
  {id:"type-room",cat:"特效文字",name:"空间大标题",kind:"room"},
  {id:"type-laugh",cat:"特效文字",name:"哈哈花字",kind:"laugh"},
  {id:"type-subtitle",cat:"特效文字",name:"重点字幕",kind:"subtitle"},
  {id:"button-enter",cat:"空间按钮",name:"进入空间",kind:"enter"},
  {id:"button-like",cat:"空间按钮",name:"悬浮喜欢",kind:"like"},
  {id:"button-nav",cat:"空间按钮",name:"方向锚点",kind:"nav"},
  {id:"card-profile",cat:"信息卡",name:"人物名片",kind:"profile"},
  {id:"card-progress",cat:"信息卡",name:"探索进度",kind:"progress"},
  {id:"card-caption",cat:"信息卡",name:"视频信息条",kind:"caption"},
];

function AssetVisual({kind,text,sub}:{kind:string;text?:string;sub?:string}) {
  switch(kind){
    case "modal": return <div className="v-modal"><i>✦</i><b>{text||"欢迎来我家"}</b><p>{sub||"准备好一起探索了吗？"}</p><button>开始参观　→</button></div>;
    case "choice": return <div className="v-choice"><span>QUICK CHOICE</span><b>{text||"你最喜欢哪个空间？"}</b><div><button>{sub||"客厅"}</button><button>卧室</button></div></div>;
    case "toast": return <div className="v-toast"><i>✓</i><span><b>{text||"收藏成功"}</b><small>{sub||"已加入「家的灵感」"}</small></span><em>×</em></div>;
    case "wow": return <div className="v-wow">{text||"WOW!"}<span>↗</span></div>;
    case "note": return <div className="v-note"><small>{sub||"ROOM NOTE 01"}</small><b>{text||"这里也太舒服了吧！"}</b><i>✦</i></div>;
    case "burst": return <div className="v-burst"><span>{sub||"新家"}<br/><b>{text||"开箱"}</b></span></div>;
    case "room": return <div className="v-room"><span>{sub||"ROOM"}</span><b>{text||"TOUR"}</b><i>新家漫游</i></div>;
    case "laugh": return <div className="v-laugh">{(text||"哈哈哈").slice(0,3).split("").map((x,i)=><span key={i}>{x}</span>)}</div>;
    case "subtitle": return <div className="v-subtitle"><span>{sub||"百万探家博主来我家"}</span><b>{text||"都聊了点啥？"}</b></div>;
    case "enter": return <div className="v-enter"><span>{text||"进入空间"}</span><i>→</i></div>;
    case "like": return <div className="v-like">♡<span>219</span></div>;
    case "nav": return <div className="v-nav"><i>⌃</i><span>{text||"向前探索"}</span><small>{sub||"2.4m"}</small></div>;
    case "profile": return <div className="v-profile"><div className="portrait"/><span><b>{text||"李小里"}</b><small>{sub||"生活方式创作者"}</small></span><button>＋ 关注</button></div>;
    case "progress": return <div className="v-progress"><span><b>{text||"探索进度"}</b><em>06 / 10</em></span><div><i/></div><small>{sub||"下一个：阳光客厅　→"}</small></div>;
    default: return <div className="v-caption"><b>{text||"新家 Room tour"}</b><p>{sub||"《超想逛你家》拍摄的一天"}</p><span>01–13　　♡ 219</span></div>;
  }
}

export default function Home(){
  const [category,setCategory]=useState("全部");
  const [selected,setSelected]=useState(assets[0]);
  const [cover,setCover]=useState("/cover-reference.png");
  const [accent,setAccent]=useState("#ef93b4");
  const [toast,setToast]=useState("");
  const [texts,setTexts]=useState<Record<string,string>>({});
  const [subs,setSubs]=useState<Record<string,string>>({});
  const visible=category==="全部"?assets:assets.filter(a=>a.cat===category);

  function upload(e:ChangeEvent<HTMLInputElement>){const f=e.target.files?.[0];if(f)setCover(URL.createObjectURL(f));}
  function download(type:"png"|"svg"){
    const visual=document.querySelector(".preview>div")?.firstElementChild?.outerHTML ?? `<b>${selected.name}</b>`;
    const css=Array.from(document.styleSheets).flatMap(sheet=>{try{return Array.from(sheet.cssRules).map(rule=>rule.cssText)}catch{return[]}}).join("\n");
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="--accent:${accent};--cover:url('/cover-reference.png');width:1000px;height:600px;display:grid;place-items:center;background:transparent;font-family:Arial,'Microsoft YaHei',sans-serif;color:#17171d"><style>${css}</style>${visual}</div></foreignObject></svg>`;
    if(type==="svg"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));a.download=`${selected.id}.svg`;a.click();}
    else {const img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=1000;c.height=600;const ctx=c.getContext("2d")!;ctx.drawImage(img,0,0);c.toBlob(b=>{if(!b)return;const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${selected.id}.png`;a.click()},"image/png")};img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)}
    setToast(`${selected.name} · ${type.toUpperCase()} 已导出`);setTimeout(()=>setToast(""),2200);
  }

  return <main style={{"--accent":accent,"--cover":`url(${cover})`} as React.CSSProperties}>
    <header><div className="logo"><b>ELEMENT<span>LAB</span></b><em>视频视觉组件库</em></div><div className="head-actions"><button>保存方案</button><button className="primary" onClick={()=>download("png")}>批量导出 ↗</button></div></header>
    <div className="app-shell">
      <aside className="sidebar">
        <div className="side-intro"><small>VIDEO UI ASSET LIBRARY</small><h1>从封面，提取一套<br/><i>视觉元素库。</i></h1><p>独立透明素材，可用于剪辑软件、AE、空间高斯与交互原型。</p></div>
        <label className="source-cover"><input type="file" accept="image/*" onChange={upload}/><img src={cover} alt="风格源封面"/><span><b>当前风格源</b><small>点击替换封面</small></span><em>↻</em></label>
        <div className="style-block"><div className="block-title"><b>风格基因</b><span>已提取</span></div><div className="swatches">{["#ef93b4","#ff8b9e","#f7dfd4","#8a4f37","#17171d"].map(c=><button key={c} onClick={()=>setAccent(c)} className={accent===c?"on":""} style={{background:c}} aria-label={`使用颜色 ${c}`}/>)}</div><div className="traits"><span>粗体描边</span><span>杂志排版</span><span>暖木质感</span><span>手绘贴纸</span></div></div>
        <nav><small>素材分类</small>{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}><span>{["⊞","▣","✦","Aa","◉","▤"][categories.indexOf(c)]}</span>{c}<em>{c==="全部"?assets.length:assets.filter(a=>a.cat===c).length}</em></button>)}</nav>
        <div className="usage"><b>适用场景</b><p><span>PR / AE</span><span>剪映</span><span>高斯空间</span><span>Unity</span></p></div>
      </aside>

      <section className="library">
        <div className="library-head"><div><small>ASSET COLLECTION / 01</small><h2>{category}视觉组件</h2><p>从参考中的弹窗、社交卡片、拼贴文字与交互控件提炼而来</p></div><div className="layout-switch"><button className="on">▦</button><button>☷</button></div></div>
        <div className="asset-grid">{visible.map(a=><article key={a.id} className={selected.id===a.id?"asset-card selected":"asset-card"} onClick={()=>setSelected(a)}><div className={`asset-stage stage-${a.cat}`}><span className="asset-no">0{assets.indexOf(a)+1}</span><AssetVisual kind={a.kind} text={texts[a.id]} sub={subs[a.id]}/></div><footer><span><b>{a.name}</b><small>{a.cat} · 文字可编辑</small></span><button aria-label={`选择 ${a.name}`}>↗</button></footer></article>)}</div>
      </section>

      <aside className="inspector">
        <div className="inspect-head"><span>元素属性</span><button>×</button></div>
        <div className="preview"><small>LIVE PREVIEW</small><div><AssetVisual kind={selected.kind} text={texts[selected.id]} sub={subs[selected.id]}/></div></div>
        <div className="field"><label>主文字（实时编辑）</label><input value={texts[selected.id]??""} placeholder="输入主标题；留空使用示例文字" onChange={e=>setTexts({...texts,[selected.id]:e.target.value})}/></div>
        <div className="field"><label>辅助文字</label><textarea value={subs[selected.id]??""} placeholder="输入说明、距离或副标题" onChange={e=>setSubs({...subs,[selected.id]:e.target.value})}/></div>
        <div className="field"><label>主色</label><div className="color-field"><input type="color" value={accent} onChange={e=>setAccent(e.target.value)}/><span>{accent.toUpperCase()}</span></div></div>
        <div className="field two"><span><label>画布</label><button>透明 ▾</button></span><span><label>倍率</label><button>2× ▾</button></span></div>
        <div className="spec"><span><b>用途</b><em>视频叠加 / 空间交互</em></span><span><b>安全区</b><em>48 px</em></span><span><b>动效建议</b><em>弹性缩放 · 320ms</em></span></div>
        <div className="export-group"><button className="export-main" onClick={()=>download("png")}>导出透明 PNG <b>↗</b></button><button onClick={()=>download("svg")}>SVG</button><button onClick={()=>download("png")}>2× PNG</button></div>
        <p className="hint">导出素材为独立透明图层，可直接拖入剪辑时间线或作为空间锚点按钮。</p>
      </aside>
    </div>{toast&&<div className="download-toast">✓ {toast}</div>}
  </main>
}
