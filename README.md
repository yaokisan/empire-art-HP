# Empire Art 株式会社 コーポレートサイト「ON AIR(白いスタジオ)」v2(社内検討用テスト版)

eahp_studio_test0709 の複製に以下の修正を加えたバージョンです(v1は無変更のまま残っています)。
コンテンツ(文言)は eahp_rich_test0708(白の美術館版)の最新版を継承しています。

## v2での変更点

1. **Vision(トップ2セクション目)**: 前回HP「白の美術館」のデザイン・動きを移植
   (明朝体 Zen Old Mincho / スクロール同期の文字点灯 / 藍の蛍光マーカー)
2. **Philosophy(企業情報)**: 同じく明朝+藍マーカーに変更(Mission / Vision)
3. **番組ザッピング(トップServices)**: タップに加えて**スクロールでもCHが進む**
   (PCはセクションをピン留めして進行度で切替。SPはタップ+モニター上のスワイプ)
4. **メンバーページ新設**(members.html): コアメンバー7名+パートナー3名。
   全ページのナビ・フッター・トップの企業情報ガイドにも「Members」を追加
5. **作品セクションの見切れ修正**: ノートPC(低い画面)でもpin中に必ず1画面へ収まるよう、
   モニターの映像部分が残り高さに追従するレイアウトに変更(高さ780px未満では情報部を圧縮)

## メンバー構成(2026-08-17時点)

| 画像ファイル | 人物 | 区分 | 写真 |
|---|---|---|---|
| member01.webp | 小林 弥起(代表取締役) | コアメンバー | ✓ |
| member02.webp | 芝田 晴信 | コアメンバー | ✓ |
| member03.webp | 小林 稜芽 | コアメンバー | ✓ |
| member04.webp | 長縄 規実生(組織戦略責任者) | コアメンバー | ✓ |
| member05.webp | 小山 愛歌 | コアメンバー | ✓ |
| member06.webp | 原田 泰輔 | コアメンバー | ✓ |
| partner02.webp | 長木 辰樹 | コアメンバー | ✓ |
| partner01.webp | 藤木 涼太 | パートナー | ✓ |
| partner03.svg | 武藤 絢人 | パートナー | 仮(プレースホルダ) |
| partner04.webp | 市川 里音 | パートナー | ✓ |

写真の原本はDriveの「01_個人プロフィール画像」フォルダ。加工せず保全し、
差し替え時は表示サイズの2倍(1200px四方以上)・quality 85 のWebPで
`assets/img/members/` に書き出し、members.html の `src` と `width/height` を更新する。

## メンバーの増やし方

members.html の人物用 `.cast` ブロック(モニター1台分)を複製し、
`CAST.11` / `MEMBER.08`(または `PARTNER.04`)の番号・名前・画像を差し替えます。
グリッドは自動で折り返します(パートナー欄も同じ)。写真が無い人は
`assets/img/members/` の既存SVGを参考に名前入りプレースホルダを作って仮置きします。
各リスト末尾の `.cast--more` は `REC / CAST.MORE` とカラーバーを備えた「AND MORE...」カードです。人物の連番には含めません。

## 見方

```bash
cd このフォルダ
npx serve .
# → 表示されたURLを開く
# ※ 本番はクリーンURL(/business 等)。python3 -m http.server は
#    拡張子なしURLに対応しないため、ローカル確認は serve を使うこと
```

## どこを触れば何が変わるか

| 変えたいもの | 場所 |
|---|---|
| 色(カラーバー・赤・ツイード) | `style.css` 冒頭 `:root` の `--bar-*` `--color-*` |
| 明朝セクションの藍 | `:root` の `--color-indigo*` |
| 文言 | 各HTMLに直書き |
| ザッピングのスクロール距離 | `studio.js` の `end: "+=" + chCount * 640` |
| ザッピングの速さ(タップ時) | `studio.js` の activate 内 setTimeout(120 / 380ms) |
| 文字点灯の速さ | `studio.js` の illuminate 節(start/end) |
| タイムコード | `studio.js` の §2(30fps実時間) |
| ローディングの文言 | `index.html` の `.loader__head` |

## 演出の仕様

- モーション停止: 「視差効果を減らす」環境にのみ右下に停止ボタン(既定は全員フル演出)
- ザッピング: PC(1024px以上)=スクロール連動+タップ / SP=タップ+スワイプ
- CDN依存: Google Fonts / GSAP / Lenis(オフラインでは演出なし)

## 本番公開時にやること(テスト版では未実施)

1. `og:url` / `canonical` の確認(https://empire-art.jp/ を仮置き)
2. `assets/img/common/ogp.png` は自動生成の仮画像 → 本番用に差し替え
3. sitemap.xml / robots.txt 生成、GA4/GTM(必要なら)
4. メンバー写真の本番画像への差し替え(上記)
