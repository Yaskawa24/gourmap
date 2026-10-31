"use strict";
const OVERPASS=["https://overpass-api.de/api/interpreter","https://maps.mail.ru/osm/tools/overpass/api/interpreter","https://overpass.kumi.systems/api/interpreter","https://overpass.private.coffee/api/interpreter"];
// key, emoji, tr, fr, en, osm cuisine tags, nominatim (French) search term
const CUISINES=[
["turkish","🥙","Türk / Kebap","Turc / Kebab","Turkish / Kebab",["turkish","kebab","doner","döner","pide","lahmacun"],"kebab"],
["japanese","🍣","Japon","Japonais","Japanese",["japanese","sushi","ramen"],"sushi"],
["korean","🥘","Kore","Coréen","Korean",["korean"],"restaurant coréen"],
["thai","🍜","Tayland","Thaï","Thai",["thai"],"restaurant thaï"],
["chinese","🥡","Çin","Chinois","Chinese",["chinese","dim_sum","cantonese"],"restaurant chinois"],
["vietnamese","🍲","Vietnam","Vietnamien","Vietnamese",["vietnamese","pho"],"restaurant vietnamien"],
["asian","🥢","Asya","Asiatique","Asian",["asian"],"restaurant asiatique"],
["italian","🍕","İtalyan / Pizza","Italien / Pizza","Italian / Pizza",["italian","pizza","pasta"],"pizzeria"],
["indian","🍛","Hint","Indien","Indian",["indian","pakistani","nepalese"],"restaurant indien"],
["mexican","🌮","Meksika","Mexicain","Mexican",["mexican","tex-mex","tacos"],"tacos"],
["french","🥖","Fransız","Français","French",["french","regional","savoyard","lyonnais"],"bistrot"],
["lebanese","🧆","Lübnan / Orta Doğu","Libanais","Lebanese",["lebanese","syrian","middle_eastern","falafel"],"restaurant libanais"],
["greek","🫒","Yunan","Grec","Greek",["greek"],"restaurant grec"],
["moroccan","🍢","Mağrip","Maghrébin","Maghreb",["moroccan","tunisian","algerian","couscous","north_african"],"couscous"],
["african","🍗","Afrika","Africain","African",["african","senegalese","ethiopian"],"restaurant africain"],
["spanish","🥘","İspanyol","Espagnol","Spanish",["spanish","tapas"],"tapas"],
["portuguese","🐟","Portekiz","Portugais","Portuguese",["portuguese"],"restaurant portugais"],
["american","🍔","Burger","Burger","Burger",["american","burger"],"burger"],
["brazilian","🥩","Brezilya / Latin","Brésilien / Latino","Brazilian / Latin",["brazilian","peruvian","argentinian"],"restaurant brésilien"],
["eastern","🥟","Doğu Avrupa","Europe de l'Est","Eastern Europe",["russian","ukrainian","polish","georgian","armenian"],"restaurant russe"],
["seafood","🦐","Deniz ürünleri","Fruits de mer","Seafood",["seafood","fish"],"fruits de mer"],
["vegetarian","🥗","Vejetaryen","Végétarien","Vegetarian",["vegetarian","vegan"],"restaurant végétarien"],
["crepe","🥞","Krep","Crêperie","Crêpes",["crepe"],"crêperie"],
["sandwich","🥪","Sandviç","Sandwich","Sandwich",["sandwich","bagel"],"sandwicherie"]];
const OTHER=["other","🍽️","Diğer","Autre","Other",[],""];
const T={tr:{tagline:"Yakınındaki en iyi lezzetleri keşfet",likes:"Sevdiğin mutfaklar",likeshint:"Hiç seçmezsen tüm restoranlar",radius:"Arama yarıçapı",filters:"Filtreler",dislikes:"İstemediğin mutfaklar",diet:"Diyet",budget:"Bütçe",opennow:"Sadece şu an açık olanlar",max:"Sonuç",search:"Restoran bul",foot:"Puanlar Gourmap kullanıcı puanlarıdır (bu cihazda saklanır).",
pick:"Hangi konumu kastediyorsun?",locating:"Konum aranıyor…",searching:"Restoranlar aranıyor…",enriching:"Daha fazla restoran yükleniyor…",none:"Bu bölgede kriterlerine uyan restoran bulunamadı. Yarıçapı büyütmeyi veya filtreleri azaltmayı dene.",found:"restoran",nearby:"yakındaki restoran haritada",open:"Açık",closed:"Kapalı",hoursunk:"Çalışma saatleri bilinmiyor",
halal:"Helal",unk:"belirsiz",yes:"evet",norating:"Henüz puan yok",rate:"Puan ver & not yaz",note:"Kısa notun (ör. Adana çok iyi)…",save:"Kaydet",web:"Web",map:"Yol tarifi",call:"Ara",hours:"Çalışma saatleri",
err:"Restoran sunucularına şu an ulaşılamıyor. İnternet bağlantını kontrol edip tekrar dene.",retry:"Tekrar dene",votes:"oy",days:["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],raw:"Saat bilgisi",nogeo:"Konum bulunamadı. Şehir adını kontrol et.",gpserr:"GPS konumu alınamadı. Şehir adı yaz.",gps:"Mevcut konumum",ph:"Resmi tatillerde saatler değişebilir"},
fr:{tagline:"Découvrez les meilleures adresses près de vous",likes:"Cuisines préférées",likeshint:"Aucune = tous les restaurants",radius:"Rayon",filters:"Filtres",dislikes:"Cuisines à exclure",diet:"Régime",budget:"Budget",opennow:"Ouvert maintenant",max:"Résultats",search:"Trouver",foot:"Notes = avis des utilisateurs Gourmap (stockés sur cet appareil).",
pick:"Quel lieu ?",locating:"Recherche du lieu…",searching:"Recherche des restaurants…",enriching:"Chargement de plus de restaurants…",none:"Aucun restaurant trouvé. Augmentez le rayon ou retirez des filtres.",found:"restaurants",nearby:"restaurants à proximité sur la carte",open:"Ouvert",closed:"Fermé",hoursunk:"Horaires inconnus",halal:"Halal",unk:"inconnu",yes:"oui",norating:"Pas encore noté",rate:"Noter & commenter",note:"Petite note…",save:"Enregistrer",web:"Site",map:"Itinéraire",call:"Appeler",hours:"Horaires",
err:"Serveurs indisponibles pour le moment. Vérifiez votre connexion et réessayez.",retry:"Réessayer",votes:"avis",days:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],raw:"Horaires",nogeo:"Lieu introuvable.",gpserr:"GPS indisponible. Tapez une ville.",gps:"Ma position",ph:"Horaires différents les jours fériés"},
en:{tagline:"Discover the best food near you",likes:"Favourite cuisines",likeshint:"None = all restaurants",radius:"Radius",filters:"Filters",dislikes:"Excluded cuisines",diet:"Diet",budget:"Budget",opennow:"Open now only",max:"Results",search:"Find restaurants",foot:"Ratings are Gourmap user ratings (stored on this device).",
pick:"Which place?",locating:"Finding location…",searching:"Searching restaurants…",enriching:"Loading more restaurants…",none:"No matching restaurants. Try a bigger radius or fewer filters.",found:"restaurants",nearby:"nearby restaurants on the map",open:"Open",closed:"Closed",hoursunk:"Opening hours unknown",halal:"Halal",unk:"unknown",yes:"yes",norating:"Not rated yet",rate:"Rate & note",note:"Short note…",save:"Save",web:"Website",map:"Directions",call:"Call",hours:"Opening hours",
err:"Restaurant servers are unreachable right now. Check your connection and retry.",retry:"Retry",votes:"votes",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],raw:"Hours",nogeo:"Location not found.",gpserr:"Could not get GPS. Type a city.",gps:"My location",ph:"Hours may differ on public holidays"}};
let LG=localStorage.gm_lang||"tr";
let likes=new Set(JSON.parse(localStorage.gm_likes||'["turkish","japanese"]')),dislikes=new Set(),center=null,map=null,layer=null,lastAll=null,runId=0;
const $=id=>document.getElementById(id),t=k=>T[LG][k],esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cname=c=>c[LG=="tr"?2:LG=="fr"?3:4];
const ratings=()=>{try{return JSON.parse(localStorage.gm_ratings||"{}")}catch(e){return{}}};
function renderUI(){document.documentElement.lang=LG;$("lang").value=LG;document.querySelectorAll("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));
 $("cuisines").innerHTML=CUISINES.map(c=>`<span class="chip ${likes.has(c[0])?"on":""}" data-k="${c[0]}">${c[1]} ${cname(c)}</span>`).join("");
 $("nocuisines").innerHTML=CUISINES.map(c=>`<span class="chip ${dislikes.has(c[0])?"no":""}" data-k="${c[0]}">${c[1]} ${cname(c)}</span>`).join("");}
$("cuisines").onclick=e=>{const k=e.target.closest(".chip")?.dataset.k;if(!k)return;likes.has(k)?likes.delete(k):likes.add(k);dislikes.delete(k);localStorage.gm_likes=JSON.stringify([...likes]);renderUI()};
$("nocuisines").onclick=e=>{const k=e.target.closest(".chip")?.dataset.k;if(!k)return;dislikes.has(k)?dislikes.delete(k):(dislikes.add(k),likes.delete(k));renderUI()};
$("lang").onchange=e=>{LG=localStorage.gm_lang=e.target.value;renderUI();if(lastAll)show()};
$("radius").oninput=e=>$("rv").textContent=e.target.value;
$("city").oninput=()=>{center=null;$("places").innerHTML=""};
$("city").onkeydown=e=>{if(e.key=="Enter")$("go").click()};
$("geo").onclick=()=>{if(!navigator.geolocation)return setErr(t("gpserr"),false);setLoading(t("locating"));
 navigator.geolocation.getCurrentPosition(p=>{center={lat:p.coords.latitude,lon:p.coords.longitude,label:t("gps")};$("city").value="📍 "+t("gps");$("places").innerHTML="";search()},
 ()=>setErr(t("gpserr"),false),{enableHighAccuracy:true,timeout:15000,maximumAge:60000})};
function setLoading(msg){$("status").innerHTML=`<div class="loading"><div class="spin"></div>${esc(msg)}</div>`}
function setErr(msg,retry=true){$("status").innerHTML=`<div class="err">⚠️ ${esc(msg)}${retry?`<br><button id="retry">🔄 ${t("retry")}</button>`:""}</div>`;$("results").innerHTML="";if(retry)$("retry").onclick=()=>$("go").click()}
async function fetchT(url,opt={},ms=20000){const c=new AbortController(),id=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{...opt,signal:c.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(id)}}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
$("go").onclick=async()=>{if(center)return search();const q=$("city").value.trim();if(!q)return;setLoading(t("locating"));
 let g;try{g=await fetchT(`https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=fr&limit=6&accept-language=fr&q=${encodeURIComponent(q)}`,{},15000)}catch(e){return setErr(t("err"))}
 g=g.filter(p=>p.lat);if(!g.length)return setErr(t("nogeo"),false);
 const seen=new Set();g=g.filter(p=>{const k=p.display_name.split(",").slice(0,3).join();if(seen.has(k))return false;seen.add(k);return true});
 const pickc=p=>{center={lat:+p.lat,lon:+p.lon,label:p.display_name.split(",").slice(0,2).join(",")};$("places").innerHTML="";$("city").value=p.display_name.split(",").slice(0,2).join(",");search()};
 if(g.length==1)return pickc(g[0]);
 $("status").innerHTML="";$("places").innerHTML=`<div style="font-weight:600;margin:4px 2px">${t("pick")}</div>`+g.map((p,i)=>`<button class="place" data-i="${i}"><b>${esc(p.name||p.display_name.split(",")[0])} <small>(${esc(p.addresstype||p.type)})</small></b>${esc(p.display_name)}</button>`).join("");
 $("places").onclick=e=>{const b=e.target.closest(".place");if(b)pickc(g[b.dataset.i])}};
function dist(a,b,c,d){const r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 12742*Math.asin(Math.sqrt(x))}
// ---- data sources
function overpassAll(rad){const q=`[out:json][timeout:25];(node(around:${rad},${center.lat},${center.lon})[amenity~"^(restaurant|fast_food)$"][name];way(around:${rad},${center.lat},${center.lon})[amenity~"^(restaurant|fast_food)$"][name];);out center tags 600;`;
 return Promise.any(OVERPASS.map(u=>fetchT(u,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"data="+encodeURIComponent(q)},28000).then(j=>{if(!j.elements)throw Error("bad");return j.elements.map(e=>({id:e.type+"/"+e.id,lat:e.lat??e.center?.lat,lon:e.lon??e.center?.lon,tags:e.tags||{}}))})))}
async function nominatimAll(rad){const dl=rad/111000,dn=dl/Math.cos(center.lat*Math.PI/180),vb=[center.lon-dn,center.lat+dl,center.lon+dn,center.lat-dl].map(x=>x.toFixed(5)).join(",");
 const terms=["restaurant","fast food",...CUISINES.filter(c=>likes.has(c[0])).map(c=>c[6])].slice(0,6),out=[];let ok=0;
 for(const q of terms){try{const d=await fetchT(`https://nominatim.openstreetmap.org/search?format=jsonv2&bounded=1&limit=50&extratags=1&addressdetails=1&viewbox=${vb}&q=${encodeURIComponent(q)}`,{},12000);ok++;
  for(const p of d){if(p.category!="amenity"||!["restaurant","fast_food"].includes(p.type)||!p.name)continue;const a=p.address||{};
   out.push({id:p.osm_type+"/"+p.osm_id,lat:+p.lat,lon:+p.lon,tags:{...(p.extratags||{}),name:p.name,amenity:p.type,"addr:housenumber":a.house_number,"addr:street":a.road,"addr:postcode":a.postcode,"addr:city":a.city||a.town||a.village||a.municipality}})}}catch(e){}
  await sleep(1100)}
 if(!ok)throw Error("nominatim");return out}
// ---- opening hours (common OSM syntax); returns {days:[[ [s,e],..] x7 ], ph} or null
const DN=["Mo","Tu","We","Th","Fr","Sa","Su"];
function parseOH(s){if(!s)return null;s=s.trim();if(s=="24/7")return{days:DN.map(()=>[[0,1440]]),ph:false};
 const days=DN.map(()=>[]);let ph=false,any=false;
 for(let rule of s.split(";")){rule=rule.trim();if(!rule)continue;
  if(/^PH|^SH/.test(rule)){ph=true;continue}
  const m=rule.match(/^((?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?(?:\s*,\s*(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(?:Mo|Tu|We|Th|Fr|Sa|Su))?)*)?\s*(?:,\s*PH)?\s*(.*)$/);if(!m)return null;
  let set=[];if(m[1]){for(const part of m[1].split(",")){const [a,b]=part.split("-").map(x=>DN.indexOf(x.trim()));if(b===undefined)set.push(a);else for(let i=a;;i=(i+1)%7){set.push(i);if(i==b)break}}}else set=[0,1,2,3,4,5,6];
  const rest=m[2].trim();if(/PH/.test(rule))ph=true;
  if(/^(off|closed)$/i.test(rest)){set.forEach(d=>days[d]=[]);any=true;continue}
  const iv=[];for(const r of rest.split(",")){const x=r.trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\+?$/);if(!x)return null;let st=+x[1]*60+ +x[2],en=+x[3]*60+ +x[4];if(en<=st)en+=1440;iv.push([st,en])}
  if(!iv.length)return null;set.forEach(d=>days[d]=iv);any=true}
 return any?{days,ph}:null}
function isOpen(oh){if(!oh)return null;const n=new Date(),d=(n.getDay()+6)%7,mn=n.getHours()*60+n.getMinutes(),y=(d+6)%7;
 return oh.days[d].some(([a,b])=>mn>=a&&mn<b)||oh.days[y].some(([a,b])=>b>1440&&mn<b-1440)}
const hm=m=>{m%=1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0")};
// ---- search
async function search(){const my=++runId,rad=+$("radius").value*1000;lastAll=null;setLoading(t("searching"));
 $("results").innerHTML='<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
 const pool=new Map();let done=0,failed=0;
 const merge=(list,rich)=>{for(const r of list){if(!r.lat)continue;const o=pool.get(r.id);pool.set(r.id,o&&!rich?{...r,tags:{...r.tags,...o.tags}}:{...(o||{}),...r,tags:{...(o?.tags||{}),...r.tags}})}};
 const finish=()=>{if(my!=runId)return;done++;
  if(pool.size){lastAll=build([...pool.values()]);show(done<2?t("enriching"):null)}
  else if(done==2)failed==2?setErr(t("err")):(setErr(t("none"),false))};
 overpassAll(rad).then(l=>merge(l,true)).catch(()=>failed++).finally(finish);
 nominatimAll(rad).then(l=>merge(l,false)).catch(()=>failed++).finally(finish)}
function build(els){return els.map(e=>{const g=e.tags,cs=(g.cuisine||"").toLowerCase().split(/\s*[;,]\s*/).filter(Boolean);
 const cat=CUISINES.find(c=>c[5].some(x=>cs.includes(x)))||OTHER;const oh=parseOH(g.opening_hours);
 return{id:e.id,t:g,lat:e.lat,lon:e.lon,cs,cat,oh,open:isOpen(oh),d:dist(center.lat,center.lon,e.lat,e.lon)}})}
function filtered(){const bad=new Set(CUISINES.filter(c=>dislikes.has(c[0])).flatMap(c=>c[5])),diet=$("diet").value,budget=$("budget").value;
 let list=lastAll.filter(r=>r.d<=+$("radius").value+0.3&&!r.cs.some(c=>bad.has(c)));
 if(likes.size)list=list.filter(r=>likes.has(r.cat[0]));
 if(diet)list=list.filter(r=>["yes","only"].includes(r.t["diet:"+diet])||(diet!="halal"&&diet!="gluten_free"&&r.cs.includes(diet)));
 if(budget){const m={"€":1,"€€":2,"€€€":3}[budget];list=list.filter(r=>{const p=r.t.price_level||r.t["price:range"];return !p||(String(p).match(/€/g)||[]).length<=m})}
 if($("opennow").checked)list=list.filter(r=>r.open===true);
 const R=ratings(),m=5,rated=list.map(r=>R[r.id]).filter(x=>x&&x.v.length),avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
 const C=rated.length?rated.reduce((s,x)=>s+avg(x.v),0)/rated.length:0;
 list.forEach(r=>{const x=R[r.id];if(x&&x.v.length){const v=x.v.length,a=avg(x.v);r.avg=a;r.n=v;r.w=(v/(v+m))*a+(m/(v+m))*C}else{r.avg=null;r.n=0;r.w=null}
  r.comp=["opening_hours","phone","contact:phone","website","contact:website","addr:street","cuisine"].filter(k=>r.t[k]).length;r.score=r.d-r.comp*0.25});
 list.sort((a,b)=>(b.w??-1)-(a.w??-1)||a.score-b.score);
 const max=+$("max").value||10,per={},out=[];
 for(const r of list){per[r.cat[0]]=(per[r.cat[0]]||0)+1;if((!likes.size||per[r.cat[0]]<=3)&&out.length<max)out.push(r)}
 return out}
function hoursHTML(r){if(!r.oh)return r.t.opening_hours?`<div class="info">🕒 ${t("raw")}: ${esc(r.t.opening_hours)}</div>`:`<div class="info">🕒 ${t("hoursunk")}</div>`;
 const td=(new Date().getDay()+6)%7;
 return `<table>${r.oh.days.map((iv,i)=>`<tr class="${i==td?"today":""}"><td>${t("days")[i]}</td><td>${iv.length?iv.map(([a,b])=>hm(a)+"–"+(b==1440?"24:00":hm(b))).join(", "):"—"}</td></tr>`).join("")}</table>${r.oh.ph?`<div class="info">ℹ️ ${t("ph")}</div>`:""}`}
function show(note){const out=filtered(),R=ratings();
 $("status").innerHTML=(note?`<div class="loading"><div class="spin"></div>${esc(note)}</div>`:"")+`<div><b>${out.length} ${t("found")}</b> · ${esc(center.label)} · ${lastAll.length} ${t("nearby")}</div>`;
 if(!out.length){$("results").innerHTML=`<div class="err" style="background:#fff7e0;color:#92400e">🔎 ${t("none")}</div>`}
 else $("results").innerHTML=out.map((r,i)=>{const g=r.t,ph=g.phone||g["contact:phone"],web=g.website||g["contact:website"],x=R[r.id]||{v:[],n:[]};
  const addr=[[g["addr:housenumber"],g["addr:street"]].filter(Boolean).join(" "),[g["addr:postcode"],g["addr:city"]].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const halal=["yes","only"].includes(g["diet:halal"]);
  const extras=[g.takeaway=="yes"&&"🥡",g.outdoor_seating=="yes"&&"☀️",g.delivery=="yes"&&"🛵",g.wheelchair=="yes"&&"♿",g["diet:vegetarian"]=="yes"&&"🥗",g["diet:vegan"]=="yes"&&"🌱"].filter(Boolean).join(" ");
  const today=r.oh?r.oh.days[(new Date().getDay()+6)%7].map(([a,b])=>hm(a)+"–"+hm(b)).join(", "):"";
  return `<article class="card"><div class="av">${r.cat[1]}<i>${i+1}</i></div><div>
  <h3>${esc(g.name)}</h3><div class="sub">${cname(r.cat)}${g.cuisine?" · "+esc(g.cuisine.replace(/;/g,", ")):""} · ${r.d.toFixed(1)} km</div>
  <div class="row">${r.avg!=null?`<span class="pill rate">⭐ ${r.avg.toFixed(1)} · ${r.n} ${t("votes")}</span>`:`<span class="pill">☆ ${t("norating")}</span>`}
  ${r.open===true?`<span class="pill open">● ${t("open")}</span>`:r.open===false?`<span class="pill closed">● ${t("closed")}</span>`:""}
  <span class="pill">${t("halal")}: ${halal?"✅ "+t("yes"):t("unk")}</span>${extras?`<span class="pill">${extras}</span>`:""}</div>
  ${addr?`<div class="info">📍 ${esc(addr)}</div>`:""}${today?`<div class="info">🕒 ${esc(today)}</div>`:!r.oh?`<div class="info">🕒 ${g.opening_hours?esc(g.opening_hours):t("hoursunk")}</div>`:""}
  <div class="actions"><a class="main" target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lon}">🧭 ${t("map")}</a>${ph?`<a href="tel:${esc(ph.split(";")[0].replace(/\s/g,""))}">📞 ${t("call")}</a>`:""}${web?`<a target="_blank" href="${esc(web.split(";")[0])}">🌐 ${t("web")}</a>`:""}</div></div>
  <details class="more"><summary>🕒 ${t("hours")} · ⭐ ${t("rate")}</summary>${hoursHTML(r)}
  <div class="stars" data-id="${r.id}">${[1,2,3,4,5].map(s=>`<span data-s="${s}">★</span>`).join("")}</div>
  <textarea maxlength="280" placeholder="${t("note")}" id="n_${i}"></textarea><button class="save" data-save="${r.id}" data-i="${i}">${t("save")}</button>
  ${x.n.length?`<div class="notes">${x.n.map(n=>"📝 "+esc(n)).join("<br>")}</div>`:""}</details></article>`}).join("");
 document.querySelectorAll(".stars").forEach(el=>el.onclick=e=>{const s=+e.target.dataset.s;if(!s)return;el.dataset.v=s;[...el.children].forEach((c,j)=>c.classList.toggle("on",j<s))});
 document.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{const id=b.dataset.save,st=b.parentNode.querySelector(".stars").dataset.v,note=$("n_"+b.dataset.i).value.trim();if(!st&&!note)return;
  const R=ratings(),x=R[id]||{v:[],n:[]};if(st)x.v.push(+st);if(note)x.n.push(note);R[id]=x;localStorage.gm_ratings=JSON.stringify(R);show()});
 drawMap(out)}
function drawMap(out){if(typeof L=="undefined")return;$("map").style.display="block";
 if(!map){map=L.map("map",{zoomControl:false});L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(map);layer=L.layerGroup().addTo(map)}
 layer.clearLayers();const top=new Set(out.map(r=>r.id));
 for(const r of lastAll)if(!top.has(r.id))L.circleMarker([r.lat,r.lon],{radius:5,color:"#fff",weight:1,fillColor:"#9ca3af",fillOpacity:.9}).bindPopup(`${r.cat[1]} ${esc(r.t.name)}`).addTo(layer);
 out.forEach((r,i)=>L.marker([r.lat,r.lon],{icon:L.divIcon({className:"",html:`<div style="background:#ff5a36;color:#fff;border-radius:50%;width:28px;height:28px;display:grid;place-items:center;font:700 13px Poppins;border:2px solid #fff;box-shadow:0 2px 6px #0005">${i+1}</div>`,iconSize:[28,28],iconAnchor:[14,14]})}).bindPopup(`<b>${i+1}. ${esc(r.t.name)}</b><br>${r.cat[1]} ${cname(r.cat)}`).addTo(layer));
 L.circleMarker([center.lat,center.lon],{radius:8,color:"#fff",weight:3,fillColor:"#2563eb",fillOpacity:1}).addTo(layer);
 const pts=out.map(r=>[r.lat,r.lon]).concat([[center.lat,center.lon]]);pts.length>1?map.fitBounds(pts,{padding:[30,30],maxZoom:15}):map.setView(pts[0],13);setTimeout(()=>map.invalidateSize(),150)}
["diet","budget","opennow","max"].forEach(id=>$(id).onchange=()=>{if(lastAll)show()});
renderUI();
