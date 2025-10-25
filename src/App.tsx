import React, { useEffect, useMemo, useRef, useState } from "react";
import Footer from "./components/Footer";

type LayerBase = {
  id: string;
  name: string;
  type: "face" | "text" | "image";
  x: number; y: number;
  scale: number; opacity: number;
  rotation?: number; visible?: boolean;
};
type FaceLayer = LayerBase & { type: "face" };
type TextLayer = LayerBase & { type: "text"; text: string; fontSize: number; strokePx: number; letterSpacing: number; allCaps: boolean; };
type ImageLayer = LayerBase & { type: "image"; src: string };
type Layer = FaceLayer | TextLayer | ImageLayer;

type PredefItem = { name: string; url: string };

const MOG_FACE_SVG = encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'>
    <g stroke='black' stroke-width='8' fill='none' stroke-linecap='round' stroke-linejoin='round'>
      <path d='M150 400c0-140 120-250 250-250s250 110 250 250-120 250-250 250S150 540 150 400z' fill='white'/>
      <ellipse cx='340' cy='370' rx='60' ry='38' fill='white'/>
      <ellipse cx='490' cy='370' rx='60' ry='38' fill='white'/>
      <circle cx='355' cy='375' r='10' fill='black'/>
      <circle cx='475' cy='372' r='10' fill='black'/>
      <path d='M280 340l120 -25' />
      <path d='M420 315l130 25' />
      <path d='M410 410q-10 20 -5 40' />
      <path d='M370 470q40 20 80 0' />
      <path d='M300 500q-30 -40 -60 -40' />
      <path d='M520 500q30 -40 60 -40' />
      <rect x='310' y='435' width='180' height='28' rx='6' />
      <rect x='310' y='435' width='90' height='28' rx='6' fill='black' />
    </g>
  </svg>
`);

function useImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) { setImg(null); return; }
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);
  return img;
}
function uid(prefix="layer"){ return `${prefix}_${Math.random().toString(36).slice(2,9)}` }
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
const isSecure = typeof window !== "undefined" && (window as any).isSecureContext === true;
async function copyTextToClipboardSafe(text: string){ try{
  if(isSecure && "clipboard" in navigator && (navigator as any).clipboard?.writeText){ await (navigator as any).clipboard.writeText(text); return {ok:true}; }
}catch{} try{
  const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.opacity="0";
  document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok?{ok:true}:{ok:false};
}catch(e:any){ return {ok:false, reason:String(e?.message||e)} } }

/* ---------------- Glitch Header ---------------- */

function GlitchHeader(props: {
  onShare: () => void;
  onDownload: () => void;
  bgSrc?: string;             // e.g. "/headers/mog-loop.mp4" or "/headers/mog-bg.gif"
  bgType?: "gif" | "video";   // default: "gif"
}) {
  const { bgSrc = "/headers/mog-bg.gif", bgType = "gif" } = props;

  return (
    <header className="relative mb-6 overflow-hidden">
      {/* Background media */}
      {bgType === "video" ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bgSrc}
          autoPlay
          muted
          loop
          playsInline
          // If the user prefers reduced motion, the video won't auto-play
          // Tailwind's motion-safe: utility helps here
          // (We still render a poster/frame if you set it on the video)
        />
      ) : (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={bgSrc}
          alt=""
          aria-hidden
        />
      )}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Optional subtle noise/scanlines on top (keeps the glitch vibe) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [background:linear-gradient(#fff0_0,#fff0_30%,#fff1_30%,#fff1_31%,#fff0_31%),linear-gradient(90deg,#fff0_0,#fff0_30%,#fff1_30%,#fff1_31%,#fff0_31%)] bg-[size:20px_20px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="flex flex-col items-center gap-4">
          {/* Glitch title */}
          <h1 className="relative inline-block text-4xl md:text-6xl font-black tracking-[0.18em] uppercase text-center leading-tight">
            <span className="text-neutral-50 select-none">MOTHER OF GOD ($MOG)</span>
            <span className="absolute inset-0 translate-x-[2px] -translate-y-[2px] text-cyan-400 mix-blend-screen blur-[0.6px] pointer-events-none select-none">
              MOTHER OF GOD ($MOG)
            </span>
            <span className="absolute inset-0 -translate-x-[2px] translate-y-[2px] text-fuchsia-400 mix-blend-screen blur-[0.6px] pointer-events-none select-none">
              MOTHER OF GOD ($MOG)
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] md:text-xs tracking-[0.32em] text-neutral-300 uppercase text-center">
            CA : 2BTgyeau8AFVL6bJvVksLLAaoVUyPLEo4osYNKQMjxVP
          </p>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={props.onShare}
              className="px-4 py-2 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 backdrop-blur-sm"
            >
              Share link
            </button>
            <button
              type="button"
              onClick={props.onDownload}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


/* ---------------- App ---------------- */

export default function App(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [width,setWidth]=useState(1024); const [height,setHeight]=useState(1024);
  const minDim = Math.min(width,height);
  const [template,setTemplate]=useState<"classic"|"dark"|"blank">("blank");
  const [bgTemplateURL,setBgTemplateURL]=useState<string|undefined>(undefined);
  const [bgUploadURL,setBgUploadURL]=useState<string|undefined>(undefined);
  const activeBgURL = bgUploadURL || bgTemplateURL;
  const bgImg = useImage(activeBgURL);
  const faceImg = useImage(`data:image/svg+xml;charset=utf-8,${MOG_FACE_SVG}`);

  const [layers,setLayers]=useState<Layer[]>([]);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const selected = useMemo(()=>layers.find(l=>l.id===selectedId)||null,[layers,selectedId]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); if(!ctx) return;
    canvas.width=width; canvas.height=height;
    if(template==="dark"){
      const g=ctx.createLinearGradient(0,0,0,height); g.addColorStop(0,"#111"); g.addColorStop(1,"#000"); ctx.fillStyle=g; ctx.fillRect(0,0,width,height);
    }else{
      ctx.fillStyle="#fff"; ctx.fillRect(0,0,width,height);
      if(template==="classic"){ ctx.fillStyle="rgba(0,0,0,0.03)"; for(let i=0;i<4000;i++){ const x=Math.random()*width, y=Math.random()*height, s=Math.random()*1.2; ctx.fillRect(x,y,s,s); } }
    }
    if(bgImg && activeBgURL){
      const iw=bgImg.width, ih=bgImg.height, r=Math.max(width/iw,height/ih), dw=iw*r, dh=ih*r, dx=(width-dw)/2, dy=(height-dh)/2;
      ctx.drawImage(bgImg,dx,dy,dw,dh);
    }
    for(const layer of layers){
      if(layer.visible===false) continue;
      const rot=(layer.rotation||0)*Math.PI/180, cx=width*layer.x, cy=height*layer.y, size=minDim*(layer.scale||1);
      ctx.save(); ctx.globalAlpha=layer.opacity??1; ctx.translate(cx,cy); ctx.rotate(rot);
      if(layer.type==="face" && faceImg){ ctx.drawImage(faceImg,-size/2,-size/2,size,size); }
      else if(layer.type==="image"){ const img=new Image(); img.crossOrigin="anonymous"; img.src=(layer as ImageLayer).src;
        if(img.complete){ ctx.drawImage(img,-size/2,-size/2,size,size); } else { img.onload=()=>requestAnimationFrame(()=>setLayers(p=>[...p])); } }
      else if(layer.type==="text"){ const L=layer as TextLayer, scaleFactor=Math.min(width,height)/1024, fontPx=Math.max(10,L.fontSize*scaleFactor), letter=L.letterSpacing, txt=L.allCaps?L.text.toUpperCase():L.text;
        ctx.font=`${fontPx}px Impact, 'Anton', 'Arial Black', system-ui, sans-serif`; ctx.lineWidth=L.strokePx*scaleFactor; ctx.strokeStyle="#000"; ctx.fillStyle="#fff"; ctx.textAlign="center"; ctx.textBaseline="middle";
        const chars=[...txt]; let x=- (ctx.measureText(txt).width + (chars.length-1)*letter)/2; const y=0;
        for(const ch of chars){ const w=ctx.measureText(ch).width; ctx.lineJoin="round"; ctx.miterLimit=2; ctx.strokeText(ch,x+w/2,y); ctx.fillText(ch,x+w/2,y); x+=w+letter; }
      }
      ctx.restore();
    }
    if(selected && selected.visible!==false){
      ctx.save(); ctx.strokeStyle="rgba(0,200,255,0.95)"; ctx.setLineDash([6,6]); ctx.lineWidth=2;
      let w=0,h=0; const rot=selected.rotation||0;
      if(selected.type==="text"){ const L=selected as TextLayer, scaleFactor=Math.min(width,height)/1024, fontPx=Math.max(10,L.fontSize*scaleFactor), txt=L.allCaps?L.text.toUpperCase():L.text;
        ctx.save(); ctx.font=`${fontPx}px Impact, 'Anton', 'Arial Black', system-ui, sans-serif`; const baseW=ctx.measureText(txt).width + (txt.length-1)*L.letterSpacing; w=baseW; h=fontPx*1.35; ctx.restore();
      }else{ const size=minDim*(selected.scale||1); w=size; h=size; }
      const a=(rot||0)*Math.PI/180, cos=Math.cos(a), sin=Math.sin(a), hw=w/2, hh=h/2, Cx=width*(selected.x), Cy=height*(selected.y);
      const pts=[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]].map(([x,y])=>({x:Cx+x*cos-y*sin,y:Cy+x*sin+y*cos}));
      const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
      const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
      ctx.strokeRect(minX,minY,maxX-minX,maxY-minY); ctx.restore();
    }
  },[width,height,template,bgImg,activeBgURL,layers,selected,minDim]);

  const dragState = useRef<{id:string|null; offX:number; offY:number}|null>(null);
  const onPointerDown: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    const rect=e.currentTarget.getBoundingClientRect(), cx=e.clientX-rect.left, cy=e.clientY-rect.top;
    for(let i=layers.length-1;i>=0;i--){
      const l=layers[i]; if(l.visible===false) continue;
      const size=minDim*(l.scale||1); let w=size, h=size;
      if(l.type==="text"){ const ctx=e.currentTarget.getContext("2d"); if(!ctx) break; const L=l as TextLayer; const scaleFactor=Math.min(width,height)/1024; const fontPx=Math.max(10,L.fontSize*scaleFactor); const txt=L.allCaps?L.text.toUpperCase():L.text;
        ctx.save(); ctx.font=`${fontPx}px Impact, 'Anton', 'Arial Black', system-ui, sans-serif`; const baseW=ctx.measureText(txt).width + (txt.length-1)*L.letterSpacing; w=baseW; h=fontPx*1.35; ctx.restore(); }
      const a=(l.rotation||0)*Math.PI/180, cos=Math.cos(a), sin=Math.sin(a), hw=w/2, hh=h/2, Cx=width*l.x, Cy=height*l.y;
      const pts=[[-hw,-hh],[hw,-hh],[hw,hh],[-hw,hh]].map(([x,y])=>({x:Cx+x*cos-y*sin,y:Cy+x*sin+y*cos}));
      const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
      const box={x:Math.min(...xs), y:Math.min(...ys), w:Math.max(...xs)-Math.min(...xs), h:Math.max(...ys)-Math.min(...ys)};
      if(cx>=box.x && cx<=box.x+box.w && cy>=box.y && cy<=box.y+box.h){
        setSelectedId(l.id); dragState.current={id:l.id, offX:cx-(box.x+box.w/2), offY:cy-(box.y+box.h/2)};
        (e.currentTarget as any).setPointerCapture?.(e.pointerId); return;
      }
    }
    setSelectedId(null);
  };
  const onPointerMove: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    if(!dragState.current || !dragState.current.id) return;
    const rect=e.currentTarget.getBoundingClientRect(), cx=e.clientX-rect.left, cy=e.clientY-rect.top, id=dragState.current.id;
    setLayers(prev=>prev.map(l=>l.id!==id? l : ({...l, x:Math.max(0,Math.min(1,(cx-dragState.current!.offX)/width)), y:Math.max(0,Math.min(1,(cy-dragState.current!.offY)/height))})));
  };
  const onPointerUp: React.PointerEventHandler<HTMLCanvasElement> = (e) => { dragState.current=null; (e.currentTarget as any).releasePointerCapture?.(e.pointerId); };

  const [toast,setToast]=useState<string|null>(null);

  const templatesList = [
    { name: "Paper",          url: "/templates/paper.jpg" },
    { name: "Noise",          url: "/templates/noise.jpg" },
    { name: "Halftone",       url: "/templates/halftone.jpg" },
    { name: "Black",          url: "/templates/black.jpg" },
    { name: "Template 1", url: "/templates/mogtemplate1.jpg" },
    { name: "Template 2", url: "/templates/mogtemplate2.png" },
    { name: "Template 3", url: "/templates/mogtemplate3.jpg" },
    { name: "Template 4", url: "/templates/mogtemplate4.png" },
    { name: "Template 5", url: "/templates/mogtemplate5.png" },
    { name: "Template 6", url: "/templates/mogtemplate6.png" },
  ];

  const predefinedImages: PredefItem[] = [
    { name: "pic1",  url: "/predefined/pic1.png"  },
    { name: "pic2",  url: "/predefined/pic2.png"  },
    { name: "pic3",  url: "/predefined/pic3.png"  },
    { name: "pic4",  url: "/predefined/pic4.png"  },
    { name: "pic5",  url: "/predefined/pic5.png"  },
    { name: "pic6",  url: "/predefined/pic6.png"  },
    { name: "pic7",  url: "/predefined/pic7.png"  },
    { name: "pic8",  url: "/predefined/pic8.png"  },
    { name: "pic9",  url: "/predefined/pic9.png"  },
    { name: "pic10", url: "/predefined/pic10.png" },
    { name: "pic11", url: "/predefined/pic11.png" },
    { name: "pic12", url: "/predefined/pic12.png" },
    { name: "pic13", url: "/predefined/pic13.jpg" },
    { name: "pic14", url: "/predefined/pic14.png" },
    { name: "pic15", url: "/predefined/pic15.png" },
    { name: "pic17", url: "/predefined/pic17.png" },
  ];

  const addTextLayer=()=>{ const l:TextLayer={id:uid("text"),type:"text",name:"Text",x:0.5,y:0.5,scale:1,opacity:1,text:"NEW TEXT",fontSize:72,strokePx:12,letterSpacing:0,allCaps:true,visible:true}; setLayers(p=>[...p,l]); setSelectedId(l.id); };
  const addImageSticker=(file:File)=>{ if(!file?.type.startsWith("image/")) return; const url=URL.createObjectURL(file); const l:ImageLayer={id:uid("img"),type:"image",name:file.name||"Sticker",src:url,x:0.5,y:0.5,scale:0.6,opacity:1,visible:true}; setLayers(p=>[...p,l]); setSelectedId(l.id); };
  const addImageStickerFromURL = (url: string, name: string) => { const l:ImageLayer={id:uid("img"),type:"image",name,src:url,x:0.5,y:0.5,scale:0.6,opacity:1,visible:true}; setLayers(p=>[...p,l]); setSelectedId(l.id); };
  const replaceSelectedImage=(file?:File)=>{ if(!selected || selected.type!=="image" || !file) return; setLayers(prev=>prev.map(l=>l.id===selected.id? ({...(l as ImageLayer), src: URL.createObjectURL(file)}) as ImageLayer : l)); };
  const clearStickers = ()=>{
    setLayers(prev=>{
      const next = prev.filter(l=>l.type!=="image");
      if(selectedId && prev.some(l=>l.id===selectedId && l.type==="image")) setSelectedId(null);
      return next;
    });
  };
  const setSelectedProp = <K extends keyof (FaceLayer & TextLayer & ImageLayer)>(key:K, value:any)=>{ if(!selected) return; setLayers(prev=>prev.map(l=>l.id===selected.id? ({...l,[key]:value}) as any : l)); };

  const toShareURL=()=>{ const state={width,height,template,bgTemplateURL,bgUploadURL,layers}; const b64=btoa(unescape(encodeURIComponent(JSON.stringify(state)))); return `${location.origin}${location.pathname}#s=${b64}`; };
  const onShare=async()=>{ const url=toShareURL(); const {ok}=await copyTextToClipboardSafe(url); setToast(ok? "Sharable link copied" : url); };
  const onDownload=()=>{ const c=canvasRef.current; if(!c) return; c.toBlob(b=>b&&downloadBlob(b,`mother-of-god-${Date.now()}.png`)); };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Glitch Header */}
      <GlitchHeader
        onShare={onShare}
        onDownload={onDownload}
        bgType="gif"                 // "video" or "gif"
        bgSrc="/mog.gif"  // or "/headers/mog-bg.gif"
      />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <aside className="lg:col-span-2 space-y-6">
            <section className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
              <h2 className="font-semibold mb-3">Canvas</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm opacity-80">Width
                  <input type="number" value={width} onChange={e=>setWidth(Math.max(256, Number(e.target.value)||0))} className="w-full mt-1 bg-neutral-800 rounded-xl p-2"/>
                </label>
                <label className="text-sm opacity-80">Height
                  <input type="number" value={height} onChange={e=>setHeight(Math.max(256, Number(e.target.value)||0))} className="w-full mt-1 bg-neutral-800 rounded-xl p-2"/>
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  {label:"1:1", w:1024, h:1024},
                  {label:"16:9", w:1600, h:900},
                  {label:"9:16", w:1080, h:1920},
                  {label:"3:1", w:1800, h:600},
                ].map(p=>(
                  <button key={p.label} type="button" onClick={()=>{setWidth(p.w); setHeight(p.h);}} className="text-xs px-3 py-1 rounded-2xl border border-neutral-700 hover:bg-neutral-800">{p.label}</button>
                ))}
              </div>
            </section>

            <section className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800 space-y-3">
              <h2 className="font-semibold">Background</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {templatesList.map(t=>(
                  <button key={t.name} type="button" onClick={()=>setBgTemplateURL(t.url)} className={`relative rounded-xl overflow-hidden border ${bgTemplateURL===t.url?'border-emerald-600':'border-neutral-800'} hover:border-neutral-600`}>
                    <div className="aspect-video bg-neutral-800" style={{backgroundImage:`url(${t.url})`, backgroundSize:'cover', backgroundPosition:'center'}}/>
                    <div className="absolute bottom-0 left-0 right-0 text-xs bg-black/50 px-2 py-1">{t.name}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                <label className="block text-sm opacity-80">Upload background
                  <input type="file" accept="image/*" onChange={e=>setBgUploadURL(e.target.files?.[0]? URL.createObjectURL(e.target.files![0]) : undefined)} className="w-full text-sm"/>
                </label>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={()=>setBgUploadURL(undefined)} className="px-2 py-1 rounded-xl bg-neutral-800">Clear upload</button>
                  <button type="button" onClick={()=>setBgTemplateURL(undefined)} className="px-2 py-1 rounded-xl bg-neutral-800">Clear template</button>
                </div>
                <div className="text-xs opacity-60">Active background: {bgUploadURL ? 'upload' : (bgTemplateURL ? 'template' : 'none')}</div>
              </div>
            </section>

            <section className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Stickers & Text</h2>
                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={addTextLayer} className="px-2 py-1 rounded-xl bg-neutral-800">Add text</button>
                  <label className="px-2 py-1 rounded-xl bg-neutral-800 cursor-pointer">Add image
                    <input type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) addImageSticker(f); }}/>
                  </label>
                  <button type="button" onClick={clearStickers} className="px-2 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700">Clear stickers</button>
                </div>
              </div>

              {/* Predefined images gallery */}
              {predefinedImages.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium mb-2">
                    Predefined images <span className="opacity-60">({predefinedImages.length})</span>
                  </h3>
                  <div className="max-h-72 md:max-h-96 overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {predefinedImages.map(p => (
                        <button key={p.url} type="button" onClick={()=>addImageStickerFromURL(p.url, p.name)}
                          className="rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600" title={p.name}>
                          <div className="aspect-square bg-neutral-800" style={{backgroundImage:`url(${p.url})`, backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} />
                          <div className="text-xs px-2 py-1 truncate">{p.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <ul className="space-y-2 mt-3">
                {layers.map(l=>(
                  <li key={l.id} className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${selectedId===l.id?'border-emerald-600 bg-neutral-800':'border-neutral-800 bg-neutral-900'}`}>
                    <button type="button" className="text-left flex-1" onClick={()=>setSelectedId(l.id)}>
                      <div className="text-sm font-medium">{l.name}</div>
                      <div className="text-xs opacity-70">{l.type} · x{l.x.toFixed(2)} y{l.y.toFixed(2)} · scale {(l.scale??1).toFixed(2)}</div>
                    </button>
                    <div className="flex items-center gap-1">
                      <button type="button" title={l.visible===false? 'Show' : 'Hide'} onClick={()=>setLayers(prev=>prev.map(x=>x.id===l.id? {...x, visible: x.visible===false? true:false} : x))} className="text-xs px-2 py-1 rounded-lg bg-neutral-800">{l.visible===false? '👁️‍🗨️' : '👁️'}</button>
                      <button type="button" title="Delete" onClick={()=>setLayers(prev=>prev.filter(x=>x.id!==l.id))} className="text-xs px-2 py-1 rounded-lg bg-red-600">✕</button>
                    </div>
                  </li>
                ))}
              </ul>

              {selected && (
                <div className="mt-3 space-y-3">
                  <h3 className="font-medium">Selected Layer</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm opacity-80">X
                      <input type="range" min={0} max={1} step={0.001} value={selected.x} onChange={e=>setSelectedProp('x' as any, Number(e.target.value))} className="w-full"/>
                    </label>
                    <label className="text-sm opacity-80">Y
                      <input type="range" min={0} max={1} step={0.001} value={selected.y} onChange={e=>setSelectedProp('y' as any, Number(e.target.value))} className="w-full"/>
                    </label>
                    <label className="text-sm opacity-80">Scale
                      <input type="range" min={0.2} max={2} step={0.01} value={selected.scale} onChange={e=>setSelectedProp('scale' as any, Number(e.target.value))} className="w-full"/>
                    </label>
                    <label className="text-sm opacity-80">Opacity
                      <input type="range" min={0.2} max={1} step={0.01} value={selected.opacity} onChange={e=>setSelectedProp('opacity' as any, Number(e.target.value))} className="w-full"/>
                    </label>
                  </div>
                  {selected.type==="text" && (
                    <div className="space-y-3">
                      <label className="text-sm opacity-80">Text
                        <input value={(selected as TextLayer).text} onChange={e=>setSelectedProp('text' as any, e.target.value)} className="w-full mt-1 bg-neutral-800 rounded-xl p-2"/>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-sm opacity-80">Font size
                          <input type="range" min={24} max={200} step={1} value={(selected as TextLayer).fontSize} onChange={e=>setSelectedProp('fontSize' as any, Number(e.target.value))} className="w-full"/>
                        </label>
                        <label className="text-sm opacity-80">Stroke
                          <input type="range" min={2} max={32} step={1} value={(selected as TextLayer).strokePx} onChange={e=>setSelectedProp('strokePx' as any, Number(e.target.value))} className="w-full"/>
                        </label>
                        <label className="text-sm opacity-80">Letter spacing
                          <input type="range" min={-2} max={30} step={0.5} value={(selected as TextLayer).letterSpacing} onChange={e=>setSelectedProp('letterSpacing' as any, Number(e.target.value))} className="w-full"/>
                        </label>
                        <label className="text-sm opacity-80 flex items-center gap-2">All caps
                          <input type="checkbox" checked={(selected as TextLayer).allCaps} onChange={e=>setSelectedProp('allCaps' as any, e.target.checked)}/>
                        </label>
                      </div>
                    </div>
                  )}
                  {selected.type==="image" && (
                    <div className="space-y-2">
                      <label className="text-sm opacity-80">Replace image
                        <input type="file" accept="image/*" onChange={e=>replaceSelectedImage(e.target.files?.[0]||undefined)} className="w-full mt-1 text-sm"/>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </section>
          </aside>

          <main className="lg:col-span-3 bg-neutral-900 rounded-2xl p-4 border border-neutral-800 flex flex-col gap-3 items-center justify-center">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="max-w-full h-auto rounded-xl shadow-2xl touch-none"
            />
            <div className="text-xs opacity-70">
              Tip: drag layers on the canvas. Upload background overrides template; use Clear buttons to switch.
            </div>
          </main>
        </div>

        <Footer />

        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-neutral-800 text-xs px-3 py-2 rounded-xl border border-neutral-700 shadow-lg" role="status">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
