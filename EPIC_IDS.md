# Epic ID 定義

DogLife全リポジトリ共通のEpic ID体系。

## Epic一覧

### 機能Epic

| ID | 名称 | 対象 | 状態 |
|----|------|------|------|
| AUTH-01 | 認証基盤 | user | Active |
| SEC-01 | セキュリティ | all | Active |
| SEARCH-01 | 施設検索 | user | Active |
| FACILITY-01 | 施設詳細 | user | Active |
| BOOK-01 | 予約フロー | user | Active |
| PAY-01 | 決済基盤 | user | Active |
| DOG-01 | 愛犬登録 | user | Active |
| USER-01 | マイページ | user | Active |
| NOTIFY-01 | 通知基盤 | all | Active |
| SEO-01 | SEO | user | Active |
| SUPPORT-01 | サポート | user | Active |
| PARTNER-01 | Facility Portal (B2B) | partner | Active |
| OPS-01 | Operations Dashboard | admin | Active |

### TMS連携Epic

| ID | 名称 | 状態 |
|----|------|------|
| TMS-01 | TMS基本連携 | Active |
| TMS-02 | TMS在庫・料金 | Active |
| TMS-03 | TMS予約連携 | Active |
| TMS-04 | TMS通知連携 | Active |

### ビジネスEpic

| ID | 名称 | 状態 |
|----|------|------|
| B01 | 法務・コンプライアンス | Active |
| B02 | 外部契約（TMS/Stripe） | Active |
| B03 | 施設獲得・パートナーシップ | Active |
| B04 | 運用準備 | Active |

## ID命名規則

```
[PREFIX]-[NUMBER]: [名称]
```

- **PREFIX**: 機能カテゴリ（大文字、2-8文字）
- **NUMBER**: 連番（01から）
- **名称**: 日本語または英語

## 対象ロール

| ロール | 説明 |
|--------|------|
| user | 旅行者（B2C） |
| admin | DogLife社内（管理者・CS） |
| partner | 施設オーナー（B2B） |
| all | 全ロール共通 |

---

更新: 2026-01-09
