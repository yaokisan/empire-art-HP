// ========================================
// タイプライター演出
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initTypewriter();
});

function initTypewriter() {
    const title = document.getElementById('heroTitle');
    const subtitle = document.getElementById('heroSubtitle');
    if (!title || !subtitle) return;

    const titleText = 'アートがビジネスを';
    const subtitleText = '超越する世界へ';
    const charDelay = 140;

    function typeText(element, text, onComplete) {
        let index = 0;
        element.innerHTML = '<span class="tw-cursor"></span>';

        const interval = setInterval(function() {
            if (index < text.length) {
                element.innerHTML = text.slice(0, index + 1) + '<span class="tw-cursor"></span>';
                index++;
            } else {
                clearInterval(interval);
                element.innerHTML = text;
                if (onComplete) onComplete();
            }
        }, charDelay);
    }

    // hero-leftのfadeInアニメーション完了後に開始（0.3s delay + 1s animation）
    setTimeout(function() {
        typeText(title, titleText, function() {
            setTimeout(function() {
                typeText(subtitle, subtitleText, null);
            }, 150);
        });
    }, 1400);
}
