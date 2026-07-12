/* main.js — スターター基盤
   構成: reveal / ヘッダー状態 / ハンバーガー / モーション停止
   (お問い合わせはmailto運用のためフォーム検証は未使用。GSAP系の演出は motion.js) */

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initHeader();
  initNav();
  initMotionStop();
});

/* ---- スクロールリビール(.js-reveal に .is-inview を付与) ---- */
function initReveal() {
  const targets = document.querySelectorAll(".js-reveal");
  if (!targets.length) return;
  if (!("IntersectionObserver" in window) || document.documentElement.classList.contains("is-motion-off")) {
    targets.forEach((el) => el.classList.add("is-inview"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target); // 一度きり。繰り返すならこの行を消す
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* ---- ヘッダー: スクロールで背景を付ける ---- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- ハンバーガー(aria-expanded連動。a11y構造は削除禁止) ---- */
function initNav() {
  const btn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".global-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    })
  );
}

/* ---- モーション停止(SKILL.mdのポリシー実装。削除禁止) ----
   reduced-motion環境にのみボタンが表示され(CSS側)、押した場合だけ
   sessionStorage+リロードで完全に静的なページとして開き直す(pitfalls.md準拠)。
   初期クラス付与は各HTML headのインラインスニペットが行う */
function initMotionStop() {
  const btn = document.querySelector(".motion-stop");
  if (!btn) return;
  let off = false;
  try { off = sessionStorage.getItem("ea-motion") === "off"; } catch (e) {}
  if (off) btn.textContent = "アニメーションを再生する";
  btn.addEventListener("click", () => {
    try { sessionStorage.setItem("ea-motion", off ? "on" : "off"); } catch (e) {}
    location.reload();
  });
}
