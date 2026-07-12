# デプロイ手順(GitHub → Vercel)

リポジトリ: https://github.com/yaokisan/empire-art-HP
本番: https://empire-art.jp/ (Vercel接続済み。empire-art.vercel.app も同一デプロイ)

ローカルクローン `~/ローカル開発/empire-art-HP` に **renewal-v2ブランチ**として
新サイト一式をコミット済み。以下を順に実行するだけで公開できます。

## 1. プレビューで確認(本番はまだ変わらない)

```bash
cd ~/ローカル開発/empire-art-HP
git push -u origin renewal-v2
```

push するとVercelが自動で**プレビューURL**(empire-art-hp-git-renewal-v2-xxxx.vercel.app)を発行します。
GitHubのブランチページ or Vercelダッシュボード → Deployments で確認できます。

プレビューで見るポイント:
- [ ] ローディング → ヒーロー(明朝コピー)が正常に開演する
- [ ] 作品セクション: PCスクロール連動 / SPスワイプでCH切替
- [ ] メンバーページの写真・並び
- [ ] スマホ実機(Safari / LINE内ブラウザ)でスクロールが滑らか
- [ ] 存在しないURL(/xxx)で404ページが出る

## 2. 本番公開(マージ)

```bash
git checkout main
git merge renewal-v2
git push origin main
```

pushで本番(empire-art.jp)が自動更新されます。GitHub上でPRを作ってマージしてもOK。

## 3. 公開後チェック(当日中)

- [ ] https://empire-art.jp/ をスーパーリロード(Cmd+Shift+R)して新デザイン表示
- [ ] Vercelダッシュボード → Deployments が「Ready」(ビルド失敗していないか)
  ※ 更新前の本番はリポジトリ最新と違う内容が出ていた形跡があるので、
     デプロイ元が main ブランチになっているか Settings → Git も一度確認
- [ ] **Vercel → Settings → Domains で empire-art.jp を「Primary」に**
  (vercel.app 側アクセスが empire-art.jp へ308リダイレクトされ、重複インデックスを防げる)
- [ ] Search Console (https://search.google.com/search-console) で
  サイトマップ `https://empire-art.jp/sitemap.xml` を送信
  (認証タグは旧サイトから引き継ぎ済みなので所有権はそのまま)
- [ ] OGPの見え方確認: https://cards-dev.twitter.com/validator や
  LINEで自分宛にURLを送って画像・タイトルを確認
- [ ] スマホ実機で主要導線(ナビ・ザッピング・メール)を一周

## 4. 今回未設定のもの(必要になったら)

- GA4/GTM計測: 未導入。測定IDをもらえれば全ページに追加します
- OGP画像はブランド版を生成済み(assets/img/common/ogp.png)。
  撮影写真ベースに差し替えたい場合は1200×630で上書き

## 巻き戻し(もし問題が起きたら)

Vercelダッシュボード → Deployments → 直前のデプロイの「…」→ **Instant Rollback**。
コード側は `git revert` で戻せます。
