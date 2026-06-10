// ========================================
// 事業紹介ページのコンテンツ切り替え
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initBusinessPage();
});

function initBusinessPage() {
    // 事業データを読み込む
    fetch('assets/data/business.json')
        .then(response => response.json())
        .then(data => {
            renderBusinessSidebar(data);
            renderBusinessContent(data);
            initBusinessContentSwitcher(data);
            initRevealOnScroll();
        })
        .catch(error => {
            console.error('事業データの読み込みに失敗しました:', error);
        });
}

// ========================================
// スクロール出現アニメーション
// ========================================
function initRevealOnScroll() {
    const targets = document.querySelectorAll('.reveal:not([data-reveal-bound])');
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

    targets.forEach(el => {
        el.setAttribute('data-reveal-bound', '');
        observer.observe(el);
    });
}

function renderBusinessSidebar(businesses) {
    const sidebarList = document.getElementById('businessSidebarList');
    if (!sidebarList) return;

    sidebarList.innerHTML = businesses.map((business, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `
            <li>
                <a href="#${business.id}" class="company-sidebar-link ${isActive}" data-content="${business.id}">
                    <span class="sidebar-link-text">${business.title}</span>
                </a>
            </li>
        `;
    }).join('');
}

function renderBusinessContent(businesses) {
    const contentArea = document.getElementById('businessContentArea');
    if (!contentArea) return;

    contentArea.innerHTML = businesses.map((business, index) => {
        const isActive = index === 0 ? 'active' : '';
        const num = String(index + 1).padStart(2, '0');
        // 詳細ページの本文は explanation を優先（無ければ description にフォールバック）
        const explanationSource = business.explanation || business.description || '';
        const explanationParas = Array.isArray(explanationSource) ? explanationSource : [explanationSource];
        const explanationHtml = explanationParas
            .map(paragraph => `<p class="business-detail-description">${paragraph}</p>`)
            .join('');
        return `
            <div id="content-${business.id}" class="company-content ${isActive}">
                <h2 class="content-title">${business.title}</h2>
                ${business.features && business.features.length > 0 ? `
                    <div class="business-tags business-tags-top">
                        ${business.features.map(feature => `<span class="business-tag">${feature}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="business-detail-content reveal">
                    <div class="business-detail-media">
                        <div class="business-detail-image">
                            <img src="${business.image || 'assets/images/business/default.jpg'}" alt="${business.title}" onerror="this.src='assets/images/business/default.jpg'">
                        </div>
                    </div>
                    <div class="business-detail-text">
                        <span class="business-detail-num">${num}</span>
                        ${business.subtitle ? `<span class="business-detail-eyebrow">${business.subtitle}</span>` : ''}
                        ${explanationHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function initBusinessContentSwitcher(businesses) {
    const sidebarLinks = document.querySelectorAll('.company-sidebar-link[data-content]');
    const contentAreas = document.querySelectorAll('.company-content');

    // URLハッシュから初期コンテンツを決定
    const hash = window.location.hash.replace('#', '');
    const validContents = businesses.map(b => b.id);
    const initialContent = validContents.includes(hash) ? hash : businesses[0].id;

    // 初期表示を設定
    showBusinessContent(initialContent);

    // ハッシュが無い場合は最初の事業を設定
    if (!hash || !validContents.includes(hash)) {
        history.replaceState(null, '', `#${initialContent}`);
    }

    // サイドバーリンクのクリックイベント
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const contentId = this.getAttribute('data-content');
            showBusinessContent(contentId);

            // URLハッシュを更新（履歴に追加しない）
            history.replaceState(null, '', `#${contentId}`);
        });
    });

    // ハッシュ変更時の処理（ブラウザの戻る/進むボタン対応）
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.replace('#', '');
        if (validContents.includes(hash)) {
            showBusinessContent(hash);
        } else {
            showBusinessContent(businesses[0].id);
        }
    });
}

function showBusinessContent(contentId) {
    const sidebarLinks = document.querySelectorAll('.company-sidebar-link[data-content]');
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
