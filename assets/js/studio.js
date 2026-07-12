/* studio.js — 「ON AIR(白いスタジオ)」の演出台本
   ローディング(カラーバー→ON AIR→カットイン) / 実時間タイムコード
   / チャンネルザッピング / カラーバー下線スイープ / RECカーソル / Lenis
   罠対策は references/pitfalls.md 準拠(5秒保険・停止ポリシー) */

(function () {
  "use strict";

  if (document.documentElement.classList.contains("is-motion-off")) return;

  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    // SPでスクロール方向を変えるとURLバーの出入りでresizeが発火し、
    // ScrollTriggerの全再計算が走ってガタつく。モバイルのリサイズは無視する
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- 1. Lenis スムーズスクロール ---- */
  // モバイルはネイティブスクロールに任せる(Lenisの毎フレーム介入がガタつきの原因になる)
  var lenis = null;
  var wantLenis = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
  if (window.Lenis && hasGsap && wantLenis) {
    lenis = new Lenis({ lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  window.EA_MOTION = { lenis: lenis };

  // ページ内アンカーはLenisで滑らかに
  if (lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -68 });
      });
    });
  }

  /* ---- 2. 実時間タイムコード(全ての[data-tc]) ---- */
  var tcEls = Array.prototype.slice.call(document.querySelectorAll("[data-tc]"));
  if (tcEls.length) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    // 画面内にあるTCだけ更新する(画面外への毎秒30回のDOM書き込みはスクロールを重くする)
    var tcActive = tcEls.map(function () { return true; });
    if ("IntersectionObserver" in window) {
      tcActive = tcEls.map(function () { return false; });
      var tcIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          tcActive[tcEls.indexOf(en.target)] = en.isIntersecting;
        });
      });
      tcEls.forEach(function (el) { tcIO.observe(el); });
    }
    // スクロール中はDOM更新を完全に止める(非力なWebViewでのガタつき対策)
    var tcScrolling = false, tcScrollTimer = null;
    window.addEventListener("scroll", function () {
      tcScrolling = true;
      clearTimeout(tcScrollTimer);
      tcScrollTimer = setTimeout(function () { tcScrolling = false; }, 160);
    }, { passive: true });
    var tcFps = window.matchMedia("(pointer: coarse)").matches ? 12 : 30;
    setInterval(function () {
      if (tcScrolling) return;
      var d = new Date();
      var f = Math.floor(d.getMilliseconds() * 30 / 1000);
      var s = "TC " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + ":" + pad(f);
      tcEls.forEach(function (el, i) { if (tcActive[i]) el.textContent = s; });
    }, 1000 / tcFps);
  }

  /* ---- 3. ローディング(カラーバー → ON AIR → カットイン) ---- */
  var loader = document.querySelector(".loader");
  var loaderDone = false;
  var loaderStart = Date.now();
  var MIN_SHOW = 1600;

  function finishLoader() {
    if (loaderDone || !loader) return;
    loaderDone = true;
    // スタンバイ(黒)→ ON AIR点灯 → ハードカットで開演
    loader.classList.add("is-standby");
    setTimeout(function () { loader.classList.add("is-onair"); }, 320);
    setTimeout(function () {
      loader.classList.add("is-done");
      document.body.classList.add("is-onair");
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    }, 1150);
  }

  if (loader) {
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";

    var signalEl = loader.querySelector("[data-loader-signal]");
    var progress = 0;
    var timer = setInterval(function () {
      progress = Math.min(92, progress + 4 + Math.random() * 10);
      if (signalEl) signalEl.textContent = "SIGNAL " + String(Math.floor(progress)).padStart(3, "0");
      if (progress >= 92) clearInterval(timer);
    }, 110);

    var requestFinish = function () {
      clearInterval(timer);
      if (signalEl) signalEl.textContent = "SIGNAL 100";
      var wait = Math.max(0, MIN_SHOW - (Date.now() - loaderStart));
      setTimeout(finishLoader, wait);
    };
    if (document.readyState === "complete") requestFinish();
    else window.addEventListener("load", requestFinish);
    setTimeout(finishLoader, 5000); // 開かない事故の保険(pitfalls.md #6)
  } else {
    document.body.classList.add("is-onair");
  }

  /* ---- 3.5. Vision: 文字点灯スクラブ(前回HPから移植。禁則を守る行ボックス分割) ---- */
  var ill = document.querySelector("[data-illuminate]");
  if (ill && hasGsap) {
    var plain = ill.textContent;
    var sentences = ill.innerHTML.split(/<br[^>]*>/i);
    ill.innerHTML = "";
    ill.setAttribute("aria-label", plain);
    sentences.forEach(function (sentence) {
      var clean = sentence.replace(/<[^>]*>/g, "").trim();
      if (!clean) return;
      var line = document.createElement("span");
      line.className = "vision__line";
      line.setAttribute("aria-hidden", "true");
      clean.split("").forEach(function (c) {
        var sp = document.createElement("span");
        sp.className = "ch";
        sp.textContent = c;
        line.appendChild(sp);
      });
      ill.appendChild(line);
    });
    gsap.to(".vision__text .ch", {
      opacity: 1,
      ease: "none",
      stagger: 1,
      scrollTrigger: { trigger: ".vision", start: "top 45%", end: "bottom 95%", scrub: true }
    });
  }

  /* ---- 4. チャンネルザッピング(見せ場) ----
     タップに加えて、PCではスクロールでもCHが進む(前回HPの横スクロール展開の代替。pin+scrub) */
  var zapScreen = document.querySelector("[data-zap-screen]");
  if (zapScreen) {
    var chButtons = document.querySelectorAll("[data-zap]");
    var panels = document.querySelectorAll("[data-zap-panel]");
    var infos = document.querySelectorAll("[data-zap-info]");
    var chCount = panels.length;
    var current = 0;
    var zapLock = false;

    // SP: タブのレールをアクティブCHへ流す(独立スクロールはさせない)
    var zapTrack = document.querySelector(".zap-track");
    var railMQ = window.matchMedia("(max-width: 1023px)");
    var updateTabRail = function () {
      if (!zapTrack) return;
      if (!railMQ.matches) { zapTrack.style.transform = ""; return; }
      var btn = chButtons[current];
      var listW = zapTrack.parentElement.clientWidth;
      var trackW = zapTrack.scrollWidth;
      // アクティブなタブをセンターに(端では余白が出ないようクランプ)
      var x = (listW - btn.offsetWidth) / 2 - btn.offsetLeft;
      x = Math.min(0, Math.max(listW - trackW, x));
      zapTrack.style.transform = "translateX(" + x + "px)";
    };
    window.addEventListener("resize", updateTabRail);

    var activate = function (index, force) {
      index = Math.max(0, Math.min(chCount - 1, index));
      if (index === current || (zapLock && !force)) return;
      zapLock = true;
      zapScreen.classList.add("is-zapping");
      // カラーバーのフラッシュ中に切り替える(カットの瞬間を隠す)
      setTimeout(function () {
        chButtons.forEach(function (b, i) {
          b.classList.toggle("is-live", i === index);
          b.setAttribute("aria-selected", String(i === index));
        });
        panels.forEach(function (p, i) { p.classList.toggle("is-live", i === index); });
        infos.forEach(function (f, i) { f.classList.toggle("is-live", i === index); });
        current = index;
        updateTabRail();
      }, 120);
      setTimeout(function () {
        zapScreen.classList.remove("is-zapping");
        zapLock = false;
      }, 380);
    };
    updateTabRail();

    // スクロール連動(PCのみ): #servicesをpinし、進行度でCHが切り替わる
    var zapST = null;
    if (hasGsap) {
      var mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", function () {
        zapST = ScrollTrigger.create({
          trigger: "#services",
          start: "top top",
          end: "+=" + chCount * 640,
          pin: true,
          anticipatePin: 1,
          onUpdate: function (self) {
            var idx = Math.min(chCount - 1, Math.floor(self.progress * chCount));
            if (idx !== current) activate(idx, true);
          }
        });
        return function () { zapST = null; };
      });
    }

    chButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-zap"), 10);
        // pin中はスクロール位置がCHを支配するため、該当CHの位置へ滑らかに移動する
        if (zapST) {
          var target = zapST.start + ((idx + 0.5) / chCount) * (zapST.end - zapST.start);
          if (lenis) lenis.scrollTo(target);
          else window.scrollTo({ top: target, behavior: "smooth" });
        } else {
          activate(idx);
        }
      });
    });

    // SP: モニター上の横スワイプでザッピング(タブも連動して切り替わる)
    // CSS側の touch-action: pan-y とセットで、横ジェスチャーがpointercancelで
    // 握り潰されないようにしている
    var swipeX = null, swipeY = null;
    var zapMonitor = zapScreen.closest(".monitor") || zapScreen; // カード全体で拾う
    zapMonitor.addEventListener("pointerdown", function (e) {
      swipeX = e.clientX; swipeY = e.clientY;
    }, { passive: true });
    zapMonitor.addEventListener("pointerup", function (e) {
      if (swipeX === null) return;
      var dx = e.clientX - swipeX;
      var dy = e.clientY - swipeY;
      swipeX = swipeY = null;
      if (zapST) return; // PCのpin中はスクロールに委ねる
      // 横成分が主で36px以上動いたらスワイプとみなす
      if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      activate(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    zapMonitor.addEventListener("pointercancel", function () { swipeX = swipeY = null; }, { passive: true });
  }

  /* ---- 5. マーカー(カラーバー下線 .marker-bar / 藍ハイライト .marker) ---- */
  var markers = document.querySelectorAll(".marker-bar, .marker");
  if (markers.length && "IntersectionObserver" in window) {
    var markerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-marked");
          markerIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.6 });
    markers.forEach(function (m) { markerIO.observe(m); });
  } else {
    markers.forEach(function (m) { m.classList.add("is-marked"); });
  }

  /* ---- 6. カスタムカーソル(REC) ---- */
  if (finePointer) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var frame = document.createElement("div");
    frame.className = "cursor-frame";
    document.body.appendChild(dot);
    document.body.appendChild(frame);
    document.body.classList.add("has-cursor");

    var mx = -100, my = -100, fx = -100, fy = -100;
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
    }, { passive: true });

    (function cursorLoop() {
      fx += (mx - fx) * 0.18;
      fy += (my - fy) * 0.18;
      frame.style.transform = "translate3d(" + fx + "px," + fy + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(cursorLoop);
    })();

    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest('[data-cursor="view"]')) frame.classList.add("is-view");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest('[data-cursor="view"]')) frame.classList.remove("is-view");
    });
    document.documentElement.addEventListener("mouseleave", function () {
      dot.style.opacity = "0"; frame.style.opacity = "0";
    });
    document.documentElement.addEventListener("mouseenter", function () {
      dot.style.opacity = "1"; frame.style.opacity = "1";
    });
  }

  /* ---- 7. CHリストのスクロールスパイ(下層) ---- */
  var spyLinks = document.querySelectorAll(".floor-guide a[data-spy]");
  if (spyLinks.length && "IntersectionObserver" in window) {
    var spyMap = {};
    spyLinks.forEach(function (a) { spyMap[a.getAttribute("data-spy")] = a; });
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = spyMap[en.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    spyLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("data-spy"));
      if (sec) spyIO.observe(sec);
    });
  }
})();
