const OVERPASS=["https://overpass-api.de/api/interpreter","https://maps.mail.ru/osm/tools/overpass/api/interpreter","https://overpass.private.coffee/api/interpreter"];
const CUISINES=[
["turkish","Türk / Kebap","Turc / Kebab","Turkish / Kebab",["turkish","kebab","doner","pide","lahmacun"]],
["japanese","Japon","Japonais","Japanese",["japanese","sushi","ramen"]],
["korean","Kore","Coréen","Korean",["korean"]],["thai","Tayland","Thaï","Thai",["thai"]],
["chinese","Çin","Chinois","Chinese",["chinese","dim_sum","cantonese"]],["vietnamese","Vietnam","Vietnamien","Vietnamese",["vietnamese","pho"]],
["asian","Asya (genel)","Asiatique","Asian",["asian"]],["italian","İtalyan / Pizza","Italien / Pizza","Italian / Pizza",["italian","pizza","pasta"]],
["indian","Hint","Indien","Indian",["indian"]],["pakistani","Pakistan","Pakistanais","Pakistani",["pakistani"]],
["mexican","Meksika","Mexicain","Mexican",["mexican","tex-mex","tacos"]],["french","Fransız","Français","French",["french","regional","crepe","savoyard"]],
["lebanese","Lübnan","Libanais","Lebanese",["lebanese","syrian","middle_eastern","falafel"]],["greek","Yunan","Grec","Greek",["greek"]],
["moroccan","Fas / Mağrip","Marocain / Maghrébin","Moroccan / Maghreb",["moroccan","tunisian","algerian","couscous","north_african"]],
["african","Afrika","Africain","African",["african","senegalese","ethiopian"]],["spanish","İspanyol","Espagnol","Spanish",["spanish","tapas"]],
["portuguese","Portekiz","Portugais","Portuguese",["portuguese"]],["american","Amerikan / Burger","Américain / Burger","American / Burger",["american","burger"]],
["brazilian","Brezilya","Brésilien","Brazilian",["brazilian"]],["peruvian","Peru","Péruvien","Peruvian",["peruvian"]],
["indonesian","Endonezya / Malezya","Indonésien","Indonesian",["indonesian","malaysian"]],["russian","Rus / Doğu Avrupa","Russe / Europe de l'Est","Russian / E. Europe",["russian","ukrainian","polish","georgian"]],
["german","Alman","Allemand","German",["german"]],["seafood","Deniz ürünleri","Fruits de mer","Seafood",["seafood","fish"]],
["vegetarian","Vejetaryen mutfak","Végétarien","Vegetarian",["vegetarian","vegan"]],["crepe","Krep","Crêperie","Crêpes",["crepe"]],
["sandwich","Sandviç","Sandwich","Sandwich",["sandwich"]]];
const T={tr:{loc:"Konum (şehir)",radius:"Yarıçap",likes:"Sevdiğin mutfaklar",filters:"Filtreler",dislikes:"İstemediğin mutfaklar",diet:"Diyet",budget:"Bütçe",opennow:"Şimdi açık olsun",max:"En fazla sonuç",search:"Restoran bul",foot:"Puanlar Gourmap kullanıcı puanlarıdır (bu cihazda saklanır).",
pick:"Hangi konumu kastediyorsun?",searching:"Aranıyor…",none:"Sonuç bulunamadı.",found:"sonuç",open:"Şu an açık",closed:"Şu an kapalı",hoursunk:"Çalışma saatleri bilinmiyor",
halal:"Helal",unk:"belirsiz",yes:"evet",norating:"Henüz Gourmap puanı yok",rate:"Puan ver",note:"Kısa not yaz…",save:"Kaydet",phone:"Telefon",web:"Web sitesi",map:"Haritada aç",selectc:"En az bir mutfak seç.",err:"Sunucu hatası, tekrar dene.",votes:"oy",days:["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"],raw:"Ham saat bilgisi",nogeo:"Konum bulunamadı."},
fr:{loc:"Lieu (ville)",radius:"Rayon",likes:"Cuisines préférées",filters:"Filtres",dislikes:"Cuisines à exclure",diet:"Régime",budget:"Budget",opennow:"Ouvert maintenant",max:"Résultats max",search:"Trouver",foot:"Notes = notes des utilisateurs Gourmap (stockées sur cet appareil).",
pick:"Quel lieu ?",searching:"Recherche…",none:"Aucun résultat.",found:"résultats",open:"Ouvert",closed:"Fermé",hoursunk:"Horaires inconnus",halal:"Halal",unk:"inconnu",yes:"oui",norating:"Pas encore de note Gourmap",rate:"Noter",note:"Petite note…",save:"Enregistrer",phone:"Téléphone",web:"Site web",map:"Ouvrir la carte",selectc:"Choisissez une cuisine.",err:"Erreur serveur, réessayez.",votes:"avis",days:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],raw:"Horaires bruts",nogeo:"Lieu introuvable."},
en:{loc:"Location (city)",radius:"Radius",likes:"Favourite cuisines",filters:"Filters",dislikes:"Excluded cuisines",diet:"Diet",budget:"Budget",opennow:"Open now",max:"Max results",search:"Find restaurants",foot:"Ratings are Gourmap user ratings (stored on this device).",
pick:"Which place?",searching:"Searching…",none:"No results.",found:"results",open:"Open now",closed:"Closed now",hoursunk:"Opening hours unknown",halal:"Halal",unk:"unknown",yes:"yes",norating:"No Gourmap rating yet",rate:"Rate",note:"Short note…",save:"Save",phone:"Phone",web:"Website",map:"Open map",selectc:"Pick at least one cuisine.",err:"Server error, retry.",votes:"votes",days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],raw:"Raw hours",nogeo:"Location not found."}};
let L=localStorage.gm_lang||"tr",likes=new Set(JSON.parse(localStorage.gm_likes||'["turkish","japanese"]')),dislikes=new Set(),center=null,map,layer;
const $=id=>document.getElementById(id),t=k=>T[L][k],esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function ratings(){return JSON.parse(localStorage.gm_ratings||"{}")}
function renderUI(){document.documentElement.lang=L;$("lang").value=L;document.querySelectorAll("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));
 const ci=L=="tr"?1:L=="fr"?2:3;
 $("cuisines").innerHTML=CUISINES.map(c=>`<span class="chip ${likes.has(c[0])?"on":""}" data-k="${c[0]}">${c[ci]}</span>`).join("");
 $("nocuisines").innerHTML=CUISINES.map(c=>`<span class="chip ${dislikes.has(c[0])?"no":""}" data-k="${c[0]}">${c[ci]}</span>`).join("");}
$("cuisines").onclick=e=>{const k=e.target.dataset.k;if(!k)return;likes.has(k)?likes.delete(k):likes.add(k);localStorage.gm_likes=JSON.stringify([...likes]);renderUI()};
$("nocuisines").onclick=e=>{const k=e.target.dataset.k;if(!k)return;dislikes.has(k)?dislikes.delete(k):dislikes.add(k);renderUI()};
$("lang").onchange=e=>{L=localStorage.gm_lang=e.target.value;renderUI();if(lastRes)show(lastRes)};
$("radius").oninput=e=>$("rv").textContent=e.target.value;
$("geo").onclick=()=>navigator.geolocation.getCurrentPosition(p=>{center={lat:p.coords.latitude,lon:p.coords.longitude,label:"📍 GPS"};$("city").value="📍 GPS";$("places").innerHTML=""},e=>alert(e.message));
$("city").oninput=()=>center=null;
async function geocode(q){const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&limit=6&addressdetails=1&q=${encodeURIComponent(q)}`);return r.json()}
$("go").onclick=async()=>{if(!likes.size)return status(t("selectc"));
 if(!center){status(t("searching"));let g;try{g=await geocode($("city").value)}catch(e){return status(t("err"))}
  if(!g.length)return status(t("nogeo"));
  if(g.length>1&&!$("places").dataset.chosen){$("places").innerHTML=`<label>${t("pick")}</label>`+g.map((p,i)=>`<button class="place" data-i="${i}">${esc(p.display_name)} (${esc(p.addresstype)})</button>`).join("");
   $("places").onclick=e=>{const p=g[e.target.dataset.i];if(!p)return;center={lat:+p.lat,lon:+p.lon,label:p.display_name};$("places").innerHTML="";$("go").click()};return status(t("pick"))}
  center={lat:+g[0].lat,lon:+g[0].lon,label:g[0].display_name}}
 search()};
function status(s){$("status").textContent=s}
function tagsFor(keys){return keys.flatMap(k=>CUISINES.find(c=>c[0]==k)[4])}
async function overpass(q){for(const u of OVERPASS){try{const r=await fetch(u,{method:"POST",body:"data="+encodeURIComponent(q)});if(r.ok)return (await r.json()).elements}catch(e){}}throw Error("overpass")}
function dist(a,b,c,d){const R=6371,r=x=>x*Math.PI/180,x=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
let lastRes=null;
async function search(){status(t("searching"));const rad=+$("radius").value*1000,tags=tagsFor([...likes]);
 const re=tags.map(s=>s.replace(/[-]/g,"\\-")).join("|");
 const q=`[out:json][timeout:50];nwr(around:${rad},${center.lat},${center.lon})["amenity"~"^(restaurant|fast_food)$"]["cuisine"~"(^|;)\\s*(${re})\\s*($|;)",i];out center tags;`;
 let els;try{els=await overpass(q)}catch(e){return status(t("err"))}
 const bad=new Set(tagsFor([...dislikes])),diet=$("diet").value,budget=$("budget").value,openNow=$("opennow").checked;
 let list=els.filter(e=>e.tags&&e.tags.name&&!e.tags["disused:amenity"]).map(e=>{const g=e.tags,lat=e.lat??e.center.lat,lon=e.lon??e.center.lon,cs=g.cuisine.toLowerCase().split(/\s*;\s*/);
  const key=(CUISINES.find(c=>likes.has(c[0])&&c[4].some(x=>cs.includes(x)))||[])[0];
  let oh=null,open=null;if(g.opening_hours){try{oh=new opening_hours(g.opening_hours,{address:{country_code:"fr",state:"Auvergne-Rhône-Alpes"}},{tag_key:"opening_hours"});open=oh.getState()}catch(x){oh=null}}
  return {id:e.type+"/"+e.id,t:g,lat,lon,cs,key,oh,open,d:dist(center.lat,center.lon,lat,lon)}})
  .filter(r=>r.key&&!r.cs.some(c=>bad.has(c)));
 if(diet)list=list.filter(r=>["yes","only"].includes(r.t["diet:"+diet]));
 if(budget){const m={"€":1,"€€":2,"€€€":3}[budget];list=list.filter(r=>{const p=r.t.price_level||r.t["price:range"];return !p||(String(p).match(/€/g)||[]).length<=m})}
 if(openNow)list=list.filter(r=>r.open===true);
 rank(list);lastRes=list;show(list)}
function rank(list){const R=ratings(),m=5,rated=list.map(r=>R[r.id]).filter(x=>x&&x.v.length);
 const C=rated.length?rated.reduce((s,x)=>s+avg(x.v),0)/rated.length:0;
 list.forEach(r=>{const x=R[r.id];if(x&&x.v.length){const v=x.v.length,a=avg(x.v);r.avg=a;r.n=v;r.w=(v/(v+m))*a+(m/(v+m))*C}else{r.avg=null;r.n=0;r.w=null}
  r.comp=["opening_hours","phone","contact:phone","website","contact:website","addr:street"].filter(k=>r.t[k]).length});
 list.sort((a,b)=>(b.w??-1)-(a.w??-1)||(a.d-b.d)-(b.comp-a.comp)*0.3)}
const avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
function hoursTable(r){if(!r.oh)return r.t.opening_hours?`<small>${t("raw")}: ${esc(r.t.opening_hours)}</small>`:`<small>${t("hoursunk")}</small>`;
 const now=new Date(),mon=new Date(now);mon.setHours(0,0,0,0);mon.setDate(mon.getDate()-((mon.getDay()+6)%7));let rows="";
 for(let i=0;i<7;i++){const s=new Date(mon);s.setDate(s.getDate()+i);const e=new Date(s);e.setDate(e.getDate()+1);
  const iv=r.oh.getOpenIntervals(s,e).map(([a,b])=>`${fmt(a)}–${fmt(b)}`);rows+=`<tr><td>${t("days")[i]}</td><td>${iv.join(", ")||"—"}</td></tr>`}
 return `<table>${rows}</table>`+(r.t.opening_hours.match(/PH|SH/)?`<small>${esc(r.t.opening_hours)}</small>`:"")}
const fmt=d=>d.toTimeString().slice(0,5).replace("00:00","24:00");
function show(all){const max=+$("max").value||10,per={},out=[];
 for(const r of all){per[r.key]=(per[r.key]||0)+1;if(per[r.key]<=3&&out.length<max)out.push(r)}
 status(`${out.length} ${t("found")} — ${center.label}`);if(!out.length)status(t("none"));
 const ci=L=="tr"?1:L=="fr"?2:3,R=ratings();
 $("results").innerHTML=out.map((r,i)=>{const g=r.t,ph=g.phone||g["contact:phone"],web=g.website||g["contact:website"],x=R[r.id]||{v:[],n:[]};
  const addr=[g["addr:housenumber"],g["addr:street"],g["addr:postcode"],g["addr:city"]].filter(Boolean).join(" ");
  const halal=["yes","only"].includes(g["diet:halal"])?t("yes"):t("unk");
  const tags=[g.takeaway=="yes"&&"🥡",g.outdoor_seating=="yes"&&"☀️",g.delivery=="yes"&&"🛵",g.wheelchair=="yes"&&"♿",g["diet:vegetarian"]=="yes"&&"🥗",g["diet:vegan"]=="yes"&&"🌱"].filter(Boolean).join(" ");
  return `<div class="card"><h3>${i+1}. ${esc(g.name)}</h3>
  <div><span class="tag">${CUISINES.find(c=>c[0]==r.key)[ci]}</span> <span class="tag">${esc(g.cuisine)}</span> ${tags}</div>
  <div>⭐ ${r.avg!=null?`${r.avg.toFixed(1)} (${r.n} ${t("votes")}) · ${r.w.toFixed(2)}`:t("norating")}</div>
  <div>📍 ${esc(addr)||"—"} · ${r.d.toFixed(1)} km</div>
  ${ph?`<div>📞 <a href="tel:${esc(ph)}">${esc(ph)}</a></div>`:""}${web?`<div>🌐 <a href="${esc(web)}" target="_blank">${t("web")}</a></div>`:""}
  <div>🗺️ <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.name+" "+r.lat+","+r.lon)}">${t("map")}</a> · <a target="_blank" href="https://www.openstreetmap.org/${r.id}">OSM</a></div>
  <div>${t("halal")}: ${halal}</div>
  <div>${r.open===true?`<span class="open">${t("open")}</span>`:r.open===false?`<span class="closed">${t("closed")}</span>`:""}</div>${hoursTable(r)}
  <details><summary>${t("rate")}</summary><div class="stars" data-id="${r.id}">${[1,2,3,4,5].map(s=>`<span data-s="${s}">★</span>`).join("")}</div>
  <textarea maxlength="280" placeholder="${t("note")}" id="n_${i}"></textarea><button data-save="${r.id}" data-i="${i}">${t("save")}</button></details>
  ${x.n.length?`<div class="notes">${x.n.map(n=>"📝 "+esc(n)).join("<br>")}</div>`:""}</div>`}).join("");
 document.querySelectorAll(".stars").forEach(el=>el.onclick=e=>{const s=+e.target.dataset.s;if(!s)return;el.dataset.v=s;[...el.children].forEach((c,j)=>c.classList.toggle("on",j<s))});
 document.querySelectorAll("[data-save]").forEach(b=>b.onclick=()=>{const id=b.dataset.save,st=b.parentNode.querySelector(".stars").dataset.v,note=$("n_"+b.dataset.i).value.trim();if(!st&&!note)return;
  const R=ratings(),x=R[id]||{v:[],n:[]};if(st)x.v.push(+st);if(note)x.n.push(note);R[id]=x;localStorage.gm_ratings=JSON.stringify(R);rank(all);show(all)});
 $("map").style.display="block";if(!map){map=L_map()}layer.clearLayers();
 out.forEach((r,i)=>window.L.marker([r.lat,r.lon]).addTo(layer).bindPopup(`${i+1}. ${esc(r.t.name)}`));
 window.L.circleMarker([center.lat,center.lon],{radius:7,color:"#e4572e"}).addTo(layer);
 map.setView([center.lat,center.lon],13);setTimeout(()=>map.invalidateSize(),100)}
function L_map(){const m=window.L.map("map");window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(m);layer=window.L.layerGroup().addTo(m);return m}
renderUI();
