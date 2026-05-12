var STORAGE_KEY='wardrobe_data',RSS_CACHE_KEY='wardrobe_rss_cache',IMG_KEY='wardrobe_images'; var sampleData={clothing:[
{id:1,name:'白衬衫',category:'top',season:'summer',price:149,wears:12,gradient:'g2',added:'2026-03-01'},
{id:2,name:'卡其裤',category:'bottom',season:'autumn',price:299,wears:8,gradient:'g4',added:'2026-03-05'},
{id:3,name:'针织开衫',category:'outerwear',season:'winter',price:380,wears:5,gradient:'g1',added:'2026-02-15'},
{id:4,name:'帆布鞋',category:'shoes',season:'spring',price:239,wears:15,gradient:'g3',added:'2026-01-20'},
{id:5,name:'碎花裙',category:'dress',season:'summer',price:249,wears:3,gradient:'g1',added:'2026-04-01'},
{id:6,name:'托特包',category:'accessory',season:'spring',price:299,wears:10,gradient:'g5',added:'2026-02-28'},
{id:7,name:'羊毛大衣',category:'outerwear',season:'winter',price:899,wears:2,gradient:'g4',added:'2026-01-10'},
{id:8,name:'亚麻短裤',category:'bottom',season:'summer',price:149,wears:6,gradient:'g2',added:'2026-04-15'},
{id:9,name:'条纹T恤',category:'top',season:'spring',price:99,wears:9,gradient:'g3',added:'2026-03-20'},
{id:10,name:'牛仔外套',category:'outerwear',season:'autumn',price:359,wears:7,gradient:'g5',added:'2026-02-10'},
{id:11,name:'丝巾',category:'accessory',season:'spring',price:129,wears:4,gradient:'g1',added:'2026-04-05'},
{id:12,name:'乐福鞋',category:'shoes',season:'autumn',price:459,wears:6,gradient:'g4',added:'2026-03-15'} ],outfits:[
{id:1,date:'2026-05-09',items:['白衬衫','卡其裤','帆布鞋'],occasion:'',cost:26},
{id:2,date:'2026-05-08',items:['针织开衫','碎花裙'],occasion:'通勤',cost:112.7},
{id:3,date:'2026-05-07',items:['白衬衫','碎花裙','托特包'],occasion:'',cost:37.7},
{id:4,date:'2026-05-06',items:['条纹T恤','亚麻短裤','帆布鞋'],occasion:'周末',cost:16.1},
{id:5,date:'2026-05-05',items:['白衬衫','卡其裤','乐福鞋'],occasion:'通勤',cost:42.3} ]}; function loadData(){try{var
s=localStorage.getItem(STORAGE_KEY);if(s)return JSON.parse(s)}catch(e){}return sampleData} function
saveData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d))} function loadImages(){try{var
s=localStorage.getItem(IMG_KEY);if(s)return JSON.parse(s)}catch(e){}return{}} function
saveImages(d){try{localStorage.setItem(IMG_KEY,JSON.stringify(d))}catch(e){showToast('图片过大，仅保存当前会话')}} var
appData=loadData(); var allImages=loadImages(); var currentCategory='all',currentSeason='all',currentSort='date'; var
pageTitles={wardrobe:'衣橱',outfit:'穿搭',stats:'统计',insp:'灵感'}; var gradients=['g1','g2','g3','g4','g5']; var
editingId=null,currentImageData=null; function showToast(msg){var
t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},2000)}
function switchPage(page){ document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active')});
document.getElementById('page-'+page).classList.add('active');
document.querySelector('[data-page="'+page+'"]').classList.add('active');
document.getElementById('page-title').textContent=pageTitles[page]||'wear 穿'; } function updateQuickStats(){ var
t=appData.clothing.length,o=appData.outfits.length; var avg=o>0?(appData.outfits.reduce(function(s,x){return
s+x.cost},0)/o).toFixed(1):'0'; document.getElementById('stat-total').textContent=t;
document.getElementById('stat-outfits').textContent=o; document.getElementById('stat-avg').textContent='¥'+avg; }
function getClothingIcon(cat){ var icons={top:'
<path d="M8 4 L4 10 L4 20 L20 20 L20 10 L16 4 L12 8Z" />',bottom:'
<path d="M6 4 L18 4 L16 20 L12 14 L8 20Z" />',outerwear:'
<path d="M12 4 L4 10 L4 20 L10 20 L10 14 L14 14 L14 20 L20 20 L20 10Z" />',dress:'
<path d="M12 4 L8 4 L4 20 L20 20 L16 4Z" />',shoes:'
<path d="M4 16 L20 16 L20 20 L4 20Z M6 16 L8 10 L16 10 L18 16" />',accessory:'
<circle cx="12" cy="12" r="8" />'}; return icons[cat]||icons.top; } function getSeasonEmoji(s){var
e={spring:'🌸',summer:'☀️',autumn:'🍂',winter:'❄️'};return e[s]||''} function renderWardrobe(){ var
grid=document.getElementById('wardrobe-grid'); var items=appData.clothing.slice();
if(currentCategory!=='all')items=items.filter(function(c){return c.category===currentCategory});
if(currentSeason!=='all')items=items.filter(function(c){return c.season===currentSeason});
if(currentSort==='frequency')items.sort(function(a,b){return b.wears-a.wears}); else
if(currentSort==='cost')items.sort(function(a,b){return(a.price/Math.max(a.wears,1))-(b.price/Math.max(b.wears,1))});
else items.sort(function(a,b){return new Date(b.added)-new Date(a.added)}); if(items.length===0){grid.innerHTML='<div
  style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-light);font-size:13px">暂无衣物，点击右下角 + 添加</div>
';return} grid.innerHTML=items.map(function(c){ var avg=(c.price/Math.max(c.wears,1)).toFixed(0); var
imgHtml=c.imageId&&allImages[c.imageId]?'
<img src="'+allImages[c.imageId]+'" alt="'+c.name+'">':''; return '<div class="clothing-card"
  onclick="openEditModal('+c.id+')">
  <div class="clothing-img '+c.gradient+'">'+(imgHtml||'<svg viewBox="0 0 24 24">'+getClothingIcon(c.category)+'</svg>
    ')+'<span class="season-tag">'+getSeasonEmoji(c.season)+'</span>
  </div>
  <div class="clothing-info">
    <div class="clothing-name">'+c.name+'</div>
    <div class="clothing-stats">穿 '+c.wears+' 次 · ¥'+avg+'/次</div>
  </div>
</div>'; }).join(''); } function filterCategory(cat,el){currentCategory=cat;document.querySelectorAll('#category-filters
.filter-chip').forEach(function(c){c.classList.remove('active')});el.classList.add('active');renderWardrobe()} function
filterSeason(s,el){currentSeason=s;document.querySelectorAll('#season-filters
.season-chip').forEach(function(c){c.classList.remove('active')});el.classList.add('active');renderWardrobe()} function
toggleSort(btn){document.getElementById('sort-dropdown').classList.toggle('show')} function
setSort(el,type){currentSort=type;document.querySelectorAll('.sort-option').forEach(function(o){o.classList.remove('active')});el.classList.add('active');document.getElementById('sort-dropdown').classList.remove('show');renderWardrobe()}
function renderOutfits(){ var list=document.getElementById('outfit-list');
document.getElementById('outfit-count').textContent='共 '+appData.outfits.length+' 次';
if(appData.outfits.length===0){list.innerHTML='<div class="loading">暂无穿搭记录</div>';return}
list.innerHTML=appData.outfits.map(function(o){ var g=gradients[o.id%5],d=o.date.replace(/-/g,'.'),it=o.items.join(' ·
'),oc=o.occasion?' · '+o.occasion:''; var firstItem=appData.clothing.find(function(c){return c.name===o.items[0]}); var
imgHtml=firstItem&&firstItem.imageId&&allImages[firstItem.imageId]?'
<img src="'+allImages[firstItem.imageId]+'">':'<svg viewBox="0 0 24 24">
  <rect x="3" y="3" width="18" height="18" rx="3" />
  <circle cx="12" cy="12" r="4" />
</svg>'; return '<div class="outfit-card">
  <div class="outfit-thumb '+g+'">'+imgHtml+'</div>
  <div class="outfit-body">
    <div class="outfit-date">'+d+oc+'</div>
    <div class="outfit-items">'+it+'</div>
    <div class="outfit-cost">¥'+o.cost.toFixed(1)+'</div>
  </div>
</div>'; }).join(''); } function renderStats(){ var t=appData.clothing.length,o=appData.outfits.length; var
avg=o>0?(appData.outfits.reduce(function(s,x){return s+x.cost},0)/o).toFixed(1):'0'; var
tv=appData.clothing.reduce(function(s,c){return s+c.price},0); document.getElementById('stat2-total').textContent=t;
document.getElementById('stat2-outfits').textContent=o; document.getElementById('stat2-avg').textContent='¥'+avg;
document.getElementById('stat2-value').textContent='¥'+tv.toLocaleString(); var fl=document.getElementById('freq-list');
var sorted=appData.clothing.slice().sort(function(a,b){return b.wears-a.wears}).slice(0,6);
fl.innerHTML=sorted.map(function(c){var a=(c.price/Math.max(c.wears,1)).toFixed(0);return '<div class="freq-item">
  <div class="freq-name">'+c.name+'</div>
  <div class="freq-detail">'+c.wears+' 次 · ¥'+a+'/次</div>
</div>'}).join(''); var cg=document.getElementById('cat-grid'); var
cats={top:'上装',bottom:'下装',outerwear:'外套',dress:'连衣裙',shoes:'鞋',accessory:'其他'}; var
counts={};appData.clothing.forEach(function(c){var k=cats[c.category]||'其他';counts[k]=(counts[k]||0)+1});
cg.innerHTML=Object.keys(counts).map(function(k){return '<div class="cat-card">
  <div class="num">'+counts[k]+'</div>
  <div class="label">'+k+'</div>
</div>'}).join(''); } function refreshAll(){updateQuickStats();renderWardrobe();renderOutfits();renderStats()}
// ===== Modal =====
function openAddModal(){
editingId=null;currentImageData=null;
document.getElementById('modal-title').textContent='添加衣物';
document.getElementById('form-name').value='';
document.getElementById('form-price').value='';
document.getElementById('form-wears').value='0';
document.getElementById('form-category').value='top';
document.getElementById('form-season').value='spring';
document.getElementById('upload-preview').classList.remove('show');
document.getElementById('upload-area').style.display='';
document.getElementById('btn-delete').style.display='none';
document.getElementById('ai-cat-badge').classList.remove('show');
document.getElementById('ai-season-badge').classList.remove('show');
document.getElementById('add-modal').classList.add('show');
}

function openEditModal(id){
var item=appData.clothing.find(function(c){return c.id===id});
if(!item)return;
editingId=id;
document.getElementById('modal-title').textContent='编辑衣物';
document.getElementById('form-name').value=item.name;
document.getElementById('form-category').value=item.category;
document.getElementById('form-season').value=item.season;
document.getElementById('form-price').value=item.price;
document.getElementById('form-wears').value=item.wears;
document.getElementById('btn-delete').style.display='';
document.getElementById('ai-cat-badge').classList.remove('show');
document.getElementById('ai-season-badge').classList.remove('show');
if(item.imageId&&allImages[item.imageId]){
document.getElementById('preview-img').src=allImages[item.imageId];
document.getElementById('upload-preview').classList.add('show');
document.getElementById('upload-area').style.display='none';
currentImageData=allImages[item.imageId];
}else{
document.getElementById('upload-preview').classList.remove('show');
document.getElementById('upload-area').style.display='';
currentImageData=null;
}
document.getElementById('add-modal').classList.add('show');
}

function closeAddModal(){document.getElementById('add-modal').classList.remove('show')}
document.getElementById('add-modal').addEventListener('click',function(e){if(e.target===this)closeAddModal()});

// ===== Image Upload & AI =====
document.getElementById('file-input').addEventListener('change',function(e){
var file=e.target.files[0];if(!file)return;
var reader=new FileReader();
reader.onload=function(ev){
var img=new Image();
img.onload=function(){
document.getElementById('preview-img').src=ev.target.result;
document.getElementById('upload-preview').classList.add('show');
document.getElementById('upload-area').style.display='none';
currentImageData=ev.target.result;
showProcessing('正在分析图片...');
setTimeout(function(){
var result=analyzeImage(img);
document.getElementById('form-category').value=result.category;
document.getElementById('form-season').value=result.season;
document.getElementById('ai-cat-badge').classList.add('show');
document.getElementById('ai-season-badge').classList.add('show');
if(!document.getElementById('form-name').value){
var catNames={top:'上衣',bottom:'裤子',outerwear:'外套',dress:'连衣裙',shoes:'鞋子',accessory:'配饰'};
var colorName=getColorName(result.brightness);
document.getElementById('form-name').value=colorName+catNames[result.category];
}
hideProcessing();
},500);
};
img.src=ev.target.result;
};
reader.readAsDataURL(file);
});

function showProcessing(text){
document.getElementById('processing-text').textContent=text||'处理中...';
document.getElementById('processing-overlay').classList.add('show');
}
function hideProcessing(){document.getElementById('processing-overlay').classList.remove('show')}

function analyzeImage(img){
var canvas=document.createElement('canvas');
var ctx=canvas.getContext('2d');
var size=200;
canvas.width=size;canvas.height=size;
ctx.drawImage(img,0,0,size,size);
var data=ctx.getImageData(0,0,size,size).data;
var totalR=0,totalG=0,totalB=0,count=0;
for(var i=0;i<data.length;i+=4){ var r=data[i],g=data[i+1],b=data[i+2]; if((r>240&&g>240&&b>240)||(r
  <15&&g<15&&b<15))continue; totalR+=r;totalG+=g;totalB+=b;count++; }
    if(count===0)return{category:'top',season:'spring',brightness:128}; var
    avgR=Math.round(totalR/count),avgG=Math.round(totalG/count),avgB=Math.round(totalB/count); var
    brightness=avgR*0.299+avgG*0.587+avgB*0.114; var minX=size,maxX=0,minY=size,maxY=0; for(var y=0;y<size;y++){for(var
    x=0;x<size;x++){ var idx=(y*size+x)*4;var r=data[idx],g=data[idx+1],b=data[idx+2]; if(!((r>240&&g>240&&b>240)||(r
    <15&&g<15&&b<15))){ if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
        }
        }}
        var bw=maxX-minX,bh=maxY-minY;
        var aspectRatio=bh/Math.max(bw,1);
        var category='top';
        if(aspectRatio>2.0)category='dress';
        else if(aspectRatio>1.4)category='bottom';
        else if(aspectRatio<0.6)category='accessory'; else if(aspectRatio<0.8&&bh<size*0.5)category='shoes' ; else
          if(bh>size*0.7&&bw>size*0.5)category='outerwear';
          var season='spring';
          if(brightness>180)season='summer';
          else if(brightness<80)season='winter'; else if(avgR>avgG&&avgR>avgB)season='autumn';
            return{category:category,season:season,brightness:brightness};
            }

            function getColorName(b){
            if(b>200)return'白色';if(b>160)return'浅色';if(b>120)return'';if(b>80)return'深色';return'黑色';
            }
            function removeBackground(){
            if(!currentImageData)return;
            showProcessing('正在抠图...');
            var img=new Image();
            img.onload=function(){
            setTimeout(function(){
            var result=removeBackgroundSimple(img);
            document.getElementById('preview-img').src=result;
            currentImageData=result;
            hideProcessing();
            showToast('抠图完成');
            },300);
            };
            img.src=currentImageData;
            }

            function removeBackgroundSimple(img){
            var canvas=document.createElement('canvas');
            var ctx=canvas.getContext('2d');
            var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
            canvas.width=w;canvas.height=h;
            ctx.drawImage(img,0,0);
            var imageData=ctx.getImageData(0,0,w,h);
            var data=imageData.data;
            var corners=[],ss=Math.min(20,Math.floor(w/10));
            for(var y=0;y<ss;y++){for(var x=0;x<ss;x++){var
              idx=(y*w+x)*4;corners.push([data[idx],data[idx+1],data[idx+2]])}} for(var x=0;x<ss;x++){var
              idx=((h-ss)*w+x)*4;corners.push([data[idx],data[idx+1],data[idx+2]])} var bgR=0,bgG=0,bgB=0;
              corners.forEach(function(c){bgR+=c[0];bgG+=c[1];bgB+=c[2]});
              bgR=Math.round(bgR/corners.length);bgG=Math.round(bgG/corners.length);bgB=Math.round(bgB/corners.length);
              var threshold=50; var visited=new Uint8Array(w*h);var queue=[]; for(var
              x=0;x<w;x++){queue.push(x);queue.push((h-1)*w+x)} for(var
              y=0;y<h;y++){queue.push(y*w);queue.push(y*w+w-1)} while(queue.length>0){
              var pos=queue.shift();if(visited[pos])continue;
              var px=pos%w,py=Math.floor(pos/w);var idx=pos*4;
              var r=data[idx],g=data[idx+1],b=data[idx+2];
              var diff=Math.abs(r-bgR)+Math.abs(g-bgG)+Math.abs(b-bgB);
              if(diff<threshold*3){ visited[pos]=1;data[idx+3]=0; if(px>0&&!visited[pos-1])queue.push(pos-1);
                if(px<w-1&&!visited[pos+1])queue.push(pos+1); if(py>0&&!visited[pos-w])queue.push(pos-w);
                  if(py<h-1&&!visited[pos+w])queue.push(pos+w); } } ctx.putImageData(imageData,0,0); return
                    canvas.toDataURL('image/png'); } function saveClothing(){ var
                    name=document.getElementById('form-name').value.trim(); var
                    cat=document.getElementById('form-category').value; var
                    season=document.getElementById('form-season').value; var
                    price=parseInt(document.getElementById('form-price').value)||0; var
                    wears=parseInt(document.getElementById('form-wears').value)||0; if(!name){showToast('请输入名称');return}
                    if(editingId){ var item=appData.clothing.find(function(c){return c.id===editingId});
                    if(item){item.name=name;item.category=cat;item.season=season;item.price=price;item.wears=wears}
                    if(currentImageData){ if(!item.imageId)item.imageId='img_' +editingId;
                    allImages[item.imageId]=currentImageData; saveImages(allImages); } showToast('已更新'); }else{ var
                    maxId=0;appData.clothing.forEach(function(c){if(c.id>maxId)maxId=c.id});
                    var newId=maxId+1;
                    var
                    newItem={id:newId,name:name,category:cat,season:season,price:price,wears:wears,gradient:gradients[maxId%5],added:new
                    Date().toISOString().split('T')[0]};
                    if(currentImageData){
                    newItem.imageId='img_'+newId;
                    allImages[newItem.imageId]=currentImageData;
                    saveImages(allImages);
                    }
                    appData.clothing.push(newItem);
                    showToast('已添加');
                    }
                    saveData(appData);closeAddModal();refreshAll();
                    }

                    function deleteClothing(){
                    if(!editingId)return;
                    if(!confirm('确定删除这件衣物？'))return;
                    var idx=appData.clothing.findIndex(function(c){return c.id===editingId});
                    if(idx>=0){
                    var item=appData.clothing[idx];
                    if(item.imageId)delete allImages[item.imageId];
                    appData.clothing.splice(idx,1);
                    saveData(appData);saveImages(allImages);
                    }
                    closeAddModal();refreshAll();showToast('已删除');
                    }
                    // ===== RSS =====
                    var RSS_PRESETS={
                    vogue:{name:'Vogue',url:'https://www.vogue.com/feed',category:'fashion'},
                    elle:{name:'ELLE',url:'https://www.elle.com/rss/fashion/',category:'fashion'},
                    hypebeast:{name:'Hypebeast',url:'https://hypebeast.com/fashion/feed',category:'street'},
                    refinery29:{name:'Refinery29',url:'https://www.refinery29.com/style/feed.xml',category:'tips'}
                    };
                    var
                    CORS_PROXIES=['https://api.allorigins.win/raw?url=','https://corsproxy.io/?','https://api.codetabs.com/v1/proxy?quest='];
                    var allArticles=[];
                    var demoArticles=[
                    {title:'2026
                    春夏流行趋势：柔和色调回归',desc:'从莫兰迪色系到大地色，今年春夏的关键词是"克制"。用基础款打造高级感，少即是多。',date:'2026-05-08',category:'fashion',source:'Vogue',link:'https://www.vogue.com'},
                    {title:'一件白衬衫的 7
                    种穿法',desc:'衣橱里最百搭的单品，通勤、约会、周末都能穿。关键是搭配不同的下装和配饰。',date:'2026-05-07',category:'tips',source:'Refinery29',link:'https://www.refinery29.com'},
                    {title:'东京街拍：宽松廓形的魅力',desc:'东京街头的年轻人正在用 oversized 外套 +
                    修身内搭创造新的比例感。',date:'2026-05-06',category:'street',source:'Hypebeast',link:'https://hypebeast.com'},
                    {title:'衣橱断舍离：留下真正会穿的',desc:'统计显示，普通人只穿衣橱里 20%
                    的衣服。学会放手，才能更清晰地知道自己需要什么。',date:'2026-05-05',category:'tips',source:'ELLE',link:'https://www.elle.com'},
                    {title:'极简穿搭公式：3 件基础款 = 1 周不重样',desc:'白 T + 牛仔裤 +
                    一双好鞋，再加一件质感外套，就能应对所有场合。',date:'2026-05-04',category:'tips',source:'Vogue',link:'https://www.vogue.com'},
                    {title:'巴黎时装周：自然材质的回归',desc:'亚麻、棉麻混纺、有机棉——设计师们正在用更可持续的方式诠释优雅。',date:'2026-05-03',category:'fashion',source:'ELLE',link:'https://www.elle.com'},
                    {title:'纽约街头：复古运动风回潮',desc:'90
                    年代的运动夹克、老爹鞋、棒球帽，正在被新一代年轻人重新定义。',date:'2026-05-02',category:'street',source:'Hypebeast',link:'https://hypebeast.com'}
                    ];

                    function loadRSSCache(){try{var c=localStorage.getItem(RSS_CACHE_KEY);if(c){var
                    d=JSON.parse(c);if(Date.now()-d.timestamp
                    <3600000){allArticles=d.articles;renderArticles(allArticles);return true}}}catch(e){}return false}
                      function
                      saveRSSCache(a){try{localStorage.setItem(RSS_CACHE_KEY,JSON.stringify({timestamp:Date.now(),articles:a}))}catch(e){}}
                      function fetchRSSWithProxy(url){ function tryProxy(idx){ if(idx>=CORS_PROXIES.length)return
                      Promise.reject(new Error('All proxies failed'));
                      return
                      fetch(CORS_PROXIES[idx]+encodeURIComponent(url),{signal:AbortSignal.timeout(8000)}).then(function(r){
                      if(!r.ok)throw new Error('Network error');return r.text();
                      }).then(function(text){
                      var parser=new DOMParser();var xml=parser.parseFromString(text,'text/xml');
                      if(xml.querySelector('parsererror'))throw new Error('XML parse error');
                      var items=xml.querySelectorAll('item');var articles=[];
                      items.forEach(function(item){
                      var title=item.querySelector('title');title=title?title.textContent:'Untitled';
                      var link=item.querySelector('link');link=link?link.textContent:'#';
                      var desc=item.querySelector('description');desc=desc?desc.textContent:'';
                      var pubDate=item.querySelector('pubDate');pubDate=pubDate?pubDate.textContent:'';
                      var media=item.querySelector('media\\:content, enclosure');
                      var image=media?media.getAttribute('url'):'';
                      var cleanDesc=desc.replace(/<[^>]*>/g,'').substring(0,150);
                        var date=pubDate?new Date(pubDate).toLocaleDateString('zh-CN'):'';
                        articles.push({title:title,link:link,desc:cleanDesc,date:date,image:image});
                        });
                        return articles;
                        }).catch(function(e){return tryProxy(idx+1)});
                        }
                        return tryProxy(0);
                        }

                        function renderArticles(articles){
                        var feed=document.getElementById('insp-feed');
                        if(articles.length===0){
                        feed.innerHTML='<div class="error-state">
                          <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <p>无法加载内容</p>
                          <button class="retry-btn" onclick="loadPreset(\'all\')">重新加载</button>
                        </div>';
                        return;
                        }
                        var heights=['wide','tall','square'];
                        feed.innerHTML=articles.map(function(a,i){
                        var imgHtml=a.image?'
                        <img src="'+a.image+'" style="width:100%;height:100%;object-fit:cover;"
                          onerror="this.outerHTML=\'<svg class=\\\'cover-icon\\\' viewBox=\\\'0 0 40 40\\\'><path d=\\\'M20 4 L36 14 L36 30 L20 36 L4 30 L4 14Z\\\'/><circle cx=\\\'20\\\' cy=\\\'20\\\' r=\\\'6\\\'/></svg>\'">
                        ':'<svg class="cover-icon" viewBox="0 0 40 40">
                          <path d="M20 4 L36 14 L36 30 L20 36 L4 30 L4 14Z" />
                          <circle cx="20" cy="20" r="6" />
                        </svg>';
                        return '<div class="insp-card" onclick="window.open(\''+a.link+'\',\'_blank\')">
                          <div class="cover '+heights[i%3]+' '+gradients[i%5]+'">'+imgHtml+'<div class="cover-plant">
                              <svg viewBox="0 0 40 40">
                                <path d="M20 36 Q20 28 20 20" />
                                <path d="M20 28 Q14 24 10 20" />
                                <path d="M20 24 Q26 20 30 16" />
                                <circle cx="10" cy="20" r="3" />
                                <circle cx="30" cy="16" r="3" />
                              </svg>
                            </div>
                          </div>
                          <div class="body">
                            <div class="title">'+a.title+'</div>
                            <div class="desc">'+a.desc+'</div>
                            <div class="meta">
                              <span class="source">'+(a.source||'RSS')+'</span>
                              <div class="likes">
                                <svg viewBox="0 0 24 24">
                                  <path
                                    d="M12 21C12 21 3 13.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 13.5 12 21 12 21Z" />
                                </svg> '+Math.floor(Math.random()*200+20)+'
                              </div>
                            </div>
                          </div>
                        </div>';
                        }).join('');
                        }

                        function loadPreset(key){
                        if(key==='all'&&loadRSSCache())return;
                        var feed=document.getElementById('insp-feed');
                        feed.innerHTML='<div class="loading">
                          <div class="loading-spinner"></div>
                          <div>正在加载内容...</div>
                        </div>';
                        var sources=key==='all'?Object.values(RSS_PRESETS):[RSS_PRESETS[key]];
                        allArticles=[];
                        var promises=sources.map(function(src){
                        return fetchRSSWithProxy(src.url).then(function(articles){
                        return
                        articles.map(function(a){return{title:a.title,link:a.link,desc:a.desc,date:a.date,image:a.image,category:src.category,source:src.name}});
                        });
                        });
                        Promise.all(promises).then(function(results){
                        results.forEach(function(arts){allArticles=allArticles.concat(arts)});
                        if(allArticles.length===0){allArticles=demoArticles.slice();showToast('RSS 加载失败，已加载演示内容')}
                        allArticles.sort(function(a,b){return new Date(b.date)-new Date(a.date)});
                        saveRSSCache(allArticles);renderArticles(allArticles);
                        }).catch(function(){
                        allArticles=demoArticles.slice();showToast('网络不可用，已加载演示内容');renderArticles(allArticles);
                        });
                        }

                        function addCustomRSS(){
                        var input=document.getElementById('rss-url-input');var url=input.value.trim();if(!url)return;
                        var name=prompt('给这个订阅源起个名字：','自定义源');if(!name)return;
                        RSS_PRESETS['custom_'+Date.now()]={name:name,url:url,category:'fashion'};
                        var container=document.querySelector('.rss-presets');
                        var btn=document.createElement('button');btn.className='rss-preset';btn.textContent='📌 '+name;
                        btn.onclick=function(){loadRSS(url,'fashion',name)};container.appendChild(btn);
                        input.value='';loadRSS(url,'fashion',name);
                        }

                        function loadRSS(url,cat,name){
                        var feed=document.getElementById('insp-feed');
                        feed.innerHTML='<div class="loading">
                          <div class="loading-spinner"></div>
                          <div>正在加载 '+name+'...</div>
                        </div>';
                        fetchRSSWithProxy(url).then(function(articles){
                        allArticles=articles.map(function(a){return{title:a.title,link:a.link,desc:a.desc,date:a.date,image:a.image,category:cat,source:name}});
                        if(allArticles.length===0){allArticles=demoArticles.slice();showToast('加载失败，显示演示内容')}
                        renderArticles(allArticles);
                        }).catch(function(){
                        allArticles=demoArticles.slice();showToast('网络不可用，已加载演示内容');renderArticles(allArticles);
                        });
                        }

                        function switchInspTab(cat,el){
                        document.querySelectorAll('.insp-cat').forEach(function(c){c.classList.remove('active')});
                        el.classList.add('active');
                        if(cat==='all')renderArticles(allArticles);
                        else renderArticles(allArticles.filter(function(a){return a.category===cat}));
                        }

                        // Install
                        var deferredPrompt;
                        window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredPrompt=e;document.getElementById('install-banner').classList.add('show')});
                        function dismissInstall(){document.getElementById('install-banner').classList.remove('show')}
                        function
                        doInstall(){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.then(function(r){if(r.outcome==='accepted')dismissInstall()});deferredPrompt=null}}

                        document.addEventListener('click',function(e){
                        if(!e.target.closest('.sort-btn')&&!e.target.closest('.sort-dropdown')){
                        document.getElementById('sort-dropdown').classList.remove('show');
                        }
                        });

                        refreshAll();
                        if('serviceWorker'in navigator){navigator.serviceWorker.register('./sw.js').catch(function(){})}
