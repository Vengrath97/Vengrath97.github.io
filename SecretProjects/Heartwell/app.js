/* =============================================================
   KOMPENDIUM HEARTWELL — wersja statyczna dla GitHub Pages
   Artykuły są osobnymi plikami HTML w katalogu articles/.
   Przy starcie katalog jest pobierany z GitHub Contents API, więc
   dodanie nowego pliku .html do folderu nie wymaga edycji indeksu.
   ============================================================= */
(function () {
    "use strict";

    var API = "https://api.github.com/repos/vengrath97/vengrath97.github.io/contents/SecretProjects/Heartwell/articles";
    var el = {
        rail: document.getElementById("rail"),
        index: document.getElementById("index"),
        head: document.getElementById("indexHead"),
        sheet: document.getElementById("sheet"),
        search: document.getElementById("q"),
        gm: document.getElementById("gmToggle")
    };
    var state = { section: null, entry: null, query: "" };
    var CATALOG = [], ARTICLES = Object.create(null), SECTIONS = [];

    function h(tag, cls, html) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (html != null) node.innerHTML = html;
        return node;
    }
    function store(key, value) {
        try { if (value === undefined) return window.localStorage.getItem(key); window.localStorage.setItem(key, value); }
        catch (e) {}
        return null;
    }
    function setMeter(name, value) {
        var node = document.querySelector('[data-count="' + name + '"]');
        if (node) node.textContent = value;
    }
    function findSection(id) { return SECTIONS.find(function (s) { return s.id === id; }) || null; }
    function findEntry(sectionId, entryId) {
        var row = CATALOG.find(function (r) { return r.section === sectionId && r.entry === entryId; });
        return row ? ARTICLES[row.key] : null;
    }
    function flatten(article) {
        var root = article.content;
        return (article.name + " " + (article.kicker || "") + " " + (article.sub || "") + " " + root.textContent)
            .toLocaleLowerCase("pl-PL");
    }
    function listKeys(container) {
        container.addEventListener("keydown", function (event) {
            var keys = ["ArrowDown", "ArrowUp", "Home", "End"];
            if (keys.indexOf(event.key) === -1) return;
            var items = Array.prototype.slice.call(container.querySelectorAll("button"));
            var at = items.indexOf(document.activeElement);
            if (at === -1 || !items.length) return;
            event.preventDefault();
            var next = at;
            if (event.key === "ArrowDown") next = (at + 1) % items.length;
            if (event.key === "ArrowUp") next = (at - 1 + items.length) % items.length;
            if (event.key === "Home") next = 0;
            if (event.key === "End") next = items.length - 1;
            items[next].focus();
        });
    }
    function makeArticle(url) {
        return fetch(url, { cache: "no-cache" }).then(function (r) {
            if (!r.ok) throw new Error("Nie można pobrać artykułu: " + r.status);
            return r.text();
        }).then(function (source) {
            var doc = new DOMParser().parseFromString(source, "text/html");
            var root = doc.querySelector("article.article-source");
            if (!root) throw new Error("Brak article-source w " + url);
            var key = root.dataset.section + "/" + root.dataset.id;
            return {
                key: key, section: root.dataset.section, entry: root.dataset.id,
                sectionLabel: root.dataset.sectionLabel || root.dataset.section,
                sectionHead: root.dataset.sectionHead || root.dataset.sectionLabel || root.dataset.section,
                order: Number(root.dataset.sectionOrder || 0),
                name: root.dataset.name || root.querySelector(".entry__title").textContent,
                kicker: root.dataset.kicker || "", sub: root.dataset.sub || "",
                content: root.querySelector(".article-content")
            };
        });
    }
    function rebuildCatalog() {
        CATALOG = Object.keys(ARTICLES).map(function (key) {
            var a = ARTICLES[key];
            return { key:key, section:a.section, sectionLabel:a.sectionLabel, entry:a.entry, name:a.name, kicker:a.kicker, haystack:flatten(a) };
        });
        CATALOG.sort(function(a,b){ return a.name.localeCompare(b.name,"pl"); });
        var map = Object.create(null);
        CATALOG.forEach(function(a){
            if (!map[a.section]) map[a.section] = {id:a.section,label:a.sectionLabel,head:(ARTICLES[a.key].sectionHead),entries:[]};
            map[a.section].entries.push(a);
        });
        SECTIONS = Object.keys(map).map(function(k){return map[k];});
        SECTIONS.sort(function(a,b){return a.order-b.order;});
        var rooms=0, quests=0;
        CATALOG.forEach(function(a){
            rooms += ARTICLES[a.key].content.querySelectorAll(".room").length;
            quests += ARTICLES[a.key].content.querySelectorAll(".quest").length;
        });
        setMeter("entries", CATALOG.length);
        setMeter("rooms", rooms);
        setMeter("quests", quests);
    }
    function renderRail() {
        el.rail.innerHTML = "";
        SECTIONS.forEach(function(section){
            var li=h("li"), btn=h("button","rail__btn",section.label+"<span class=\"rail__count\">"+section.entries.length+"</span>");
            btn.type="button"; btn.dataset.section=section.id;
            btn.addEventListener("click",function(){el.search.value="";state.query="";go(section.id,section.entries[0].entry);});
            li.appendChild(btn); el.rail.appendChild(li);
        });
        listKeys(el.rail);
    }
    function currentRows(){ return CATALOG.filter(function(r){return r.section===state.section;}); }
    function search(query){
        var needle=query.toLocaleLowerCase("pl-PL").trim();
        return CATALOG.filter(function(r){return r.haystack.indexOf(needle)!==-1;}).slice(0,60);
    }
    function renderIndex(){
        el.index.innerHTML="";
        var rows=state.query?search(state.query):currentRows();
        if(!rows.length){el.index.appendChild(h("li","index__empty","Nic nie pasuje do „"+state.query+"”. Spróbuj kodu pomieszczenia (A13), nazwiska albo nazwy frakcji."));return;}
        rows.forEach(function(row){
            var li=h("li"), label=row.name;
            if(state.query) label += "<small>"+row.sectionLabel+" · "+row.kicker+"</small>";
            var btn=h("button","index__btn",label); btn.type="button"; btn.dataset.entry=row.entry;
            if(row.section===state.section&&row.entry===state.entry) btn.setAttribute("aria-current","true");
            btn.addEventListener("click",function(){go(row.section,row.entry);});
            li.appendChild(btn);el.index.appendChild(li);
        });
        listKeys(el.index);
    }
    function markRail(){
        Array.prototype.forEach.call(el.rail.querySelectorAll(".rail__btn"),function(btn){
            if(btn.dataset.section===state.section&&!state.query)btn.setAttribute("aria-current","true");else btn.removeAttribute("aria-current");
        });
    }
    function wireXrefs(){
        Array.prototype.forEach.call(el.sheet.querySelectorAll("a.xref"),function(a){
            a.addEventListener("click",function(e){
                var m=(a.getAttribute("href")||"").match(/^#\/(.+)\/(.+)$/);
                if(!m)return; e.preventDefault(); go(m[1],m[2]);
            });
        });
    }
    function go(sectionId, entryId, skipHash){
        var article=findEntry(sectionId,entryId);
        if(!article){
            if(!CATALOG.length)return;
            article=findEntry(CATALOG[0].section,CATALOG[0].entry);sectionId=CATALOG[0].section;entryId=CATALOG[0].entry;
        }
        state.section=sectionId;state.entry=entryId;
        el.sheet.innerHTML="";
        var content=article.content.cloneNode(true);
        el.sheet.appendChild(content);
        document.title=article.name+" — Kompendium Heartwell";
        el.head.textContent=article.sectionHead;
        wireXrefs();renderIndex();markRail();
        if(!skipHash) history.replaceState(null,"", "#/"+sectionId+"/"+entryId);
        if(typeof el.sheet.scrollIntoView==="function")el.sheet.scrollIntoView({block:"start"});
    }
    function fromHash(){
        var m=location.hash.match(/^#\/(.+?)\/(.+)$/);
        if(m&&findEntry(m[1],m[2]))go(m[1],m[2],true);else if(CATALOG.length)go(CATALOG[0].section,CATALOG[0].entry,true);
    }
    function setGm(on){
        el.gm.setAttribute("aria-pressed",String(on));document.documentElement.classList.toggle("gm-off",!on);store("heartwell-gm",on?"1":"0");
    }
    function load(){
        fetch(API,{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error("GitHub API: "+r.status);return r.json();})
        .then(function(items){
            var files=items.filter(function(i){return i.type==="file"&&/\.html$/i.test(i.name);});
            return Promise.all(files.map(function(i){return makeArticle(i.download_url);}));
        }).then(function(articles){
            articles.forEach(function(a){ARTICLES[a.key]=a;});
            rebuildCatalog();renderRail();fromHash();
            var gm=store("heartwell-gm");setGm(gm!=="0");
        }).catch(function(err){
            el.index.innerHTML="";el.sheet.innerHTML="<p class=\"entry__lead\">Nie udało się wczytać artykułów z folderu <code>articles/</code>.</p><p>"+err.message+"</p><p>Na GitHub Pages odśwież stronę po chwili. Jeśli problem się powtarza, sprawdź dostęp publiczny repozytorium.</p>";
        });
    }
    el.search.addEventListener("input",function(){state.query=el.search.value;renderIndex();markRail();});
    el.search.addEventListener("keydown",function(event){
        if(event.key==="Escape"){el.search.value="";state.query="";renderIndex();markRail();}
        if(event.key==="Enter"){var first=el.index.querySelector("button");if(first)first.click();}
    });
    document.addEventListener("keydown",function(event){
        if(event.key==="/"&&document.activeElement!==el.search){event.preventDefault();el.search.focus();}
        if(event.key==="Escape"&&document.activeElement===el.search){el.search.value="";state.query="";renderIndex();markRail();el.search.blur();}
    });
    el.gm.addEventListener("click",function(){setGm(el.gm.getAttribute("aria-pressed")!=="true");});
    window.addEventListener("hashchange",fromHash);
    load();
})();
