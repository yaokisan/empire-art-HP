// ========================================
// 企業情報ページのコンテンツ切り替え
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initCompanyContentSwitcher();
    initRevealOnScroll();
});

// ========================================
// スクロール出現アニメーション
// ========================================
function initRevealOnScroll() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    // IntersectionObserver 非対応環境では全要素を即時表示
    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
}

function initCompanyContentSwitcher() {
    const sidebarLinks = document.querySelectorAll('.company-sidebar-link');
    const contentAreas = document.querySelectorAll('.company-content');

    // URLハッシュから初期コンテンツを決定
    const hash = window.location.hash.replace('#', '');
    const validContents = ['overview', 'message', 'vision'];
    const initialContent = validContents.includes(hash) ? hash : 'overview';

    // 初期表示を設定
    showContent(initialContent);

    // ハッシュが無い場合は overview を設定
    if (!hash || !validContents.includes(hash)) {
        history.replaceState(null, '', '#overview');
    }

    // サイドバーリンクのクリックイベント
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const contentId = this.getAttribute('data-content');
            showContent(contentId);

            // URLハッシュを更新（履歴に追加しない）
            history.replaceState(null, '', `#${contentId}`);
        });
    });

    // ハッシュ変更時の処理（ブラウザの戻る/進むボタン対応）
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.replace('#', '');
        if (validContents.includes(hash)) {
            showContent(hash);
        } else {
            showContent('overview');
        }
    });
}

function showContent(contentId) {
    const sidebarLinks = document.querySelectorAll('.company-sidebar-link');
    const contentAreas = document.querySelectorAll('.company-content');

    // サイドバーリンクのアクティブ状態を更新
    sidebarLinks.forEach(link => {
        if (link.getAttribute('data-content') === contentId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // コンテンツエリアの表示/非表示を切り替え
    contentAreas.forEach(content => {
        const contentIdAttr = content.id.replace('content-', '');
        if (contentIdAttr === contentId) {
            content.classList.add('active');
            // スムーズスクロール（ページトップへ）
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        } else {
            content.classList.remove('active');
        }
    });
}
