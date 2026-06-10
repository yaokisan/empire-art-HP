// ========================================
// メインスクリプト
// ========================================

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initServicesDropdown();
    initBusinessSection();
});

// ========================================
// ヘッダー機能
// ========================================
function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    // スクロール時のヘッダー背景変更
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ハンバーガーメニューの開閉
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // メニュー外クリックで閉じる
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ========================================
// ナビ：事業紹介ドロップダウン
// ========================================
function initServicesDropdown() {
    const dropdown = document.getElementById('servicesDropdown');
    if (!dropdown) return;

    fetch('assets/data/business.json')
        .then(response => response.json())
        .then(data => {
            dropdown.innerHTML = data.map(business =>
                `<li><a href="business.html#${business.id}">${business.title}</a></li>`
            ).join('');
        })
        .catch(error => {
            console.error('事業データの読み込みに失敗しました:', error);
        });
}

// ========================================
// 事業紹介セクション
// ========================================
function initBusinessSection() {
    const businessGrid = document.getElementById('businessGrid');
    if (!businessGrid) return;

    // 事業データを読み込む
    fetch('assets/data/business.json')
        .then(response => response.json())
        .then(data => {
            displayBusinessCards(data);
        })
        .catch(error => {
            console.error('事業データの読み込みに失敗しました:', error);
            // エラー時はデフォルトデータを表示
            displayBusinessCards(getDefaultBusinessData());
        });
}

function displayBusinessCards(businesses) {
    const businessGrid = document.getElementById('businessGrid');
    if (!businessGrid) return;

    businessGrid.innerHTML = businesses.map((business, index) => {
        const featuresHtml = business.features ? business.features.map(feature => `<div class="business-card-feature-item">${feature}</div>`).join('') : '';
        return `
        <a href="business.html#${business.id}" class="business-card-item">
            <div class="business-card-image" style="background-image: url('${business.image || 'assets/images/business/default.jpg'}');"></div>
            <div class="business-card-overlay"></div>
            <div class="business-card-info">
                <div class="business-card-hover-content">
                    <p class="business-card-description">${business.description || ''}</p>
                    ${featuresHtml ? `<div class="business-card-features">${featuresHtml}</div>` : ''}
                </div>
                <div class="business-card-default-content">
                    <h3 class="business-card-title">${business.title}</h3>
                </div>
            </div>
        </a>
    `;
    }).join('');
}

function getDefaultBusinessData() {
    return [
        {
            id: 'service01',
            title: '事業01',
            subtitle: 'キャッチコピー',
            description: '事業01の説明がここに入ります。',
            image: 'assets/images/business/service01.jpg'
        },
        {
            id: 'service02',
            title: '事業02',
            subtitle: 'キャッチコピー',
            description: '事業02の説明がここに入ります。',
            image: 'assets/images/business/service02.jpg'
        },
        {
            id: 'service03',
            title: '事業03',
            subtitle: 'キャッチコピー',
            description: '事業03の説明がここに入ります。',
            image: 'assets/images/business/service03.jpg'
        },
        {
            id: 'service04',
            title: '事業04',
            subtitle: 'キャッチコピー',
            description: '事業04の説明がここに入ります。',
            image: 'assets/images/business/service04.jpg'
        },
        {
            id: 'service05',
            title: '事業05',
            subtitle: 'キャッチコピー',
            description: '事業05の説明がここに入ります。',
            image: 'assets/images/business/service05.jpg'
        }
    ];
}
