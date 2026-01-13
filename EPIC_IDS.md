# Epic ID 定義

DogLife全リポジトリ共通のEpic ID体系。

## Epic一覧

### 機能Epic（Foundation）

| ID | 名称 | 対象 | GitHub Issue |
|----|------|------|--------------|
| AUTH-01 | 認証基盤 | user | #99 |
| PROFILE-01 | プロフィール管理 | user | #101 |

### 機能Epic（Travel）

| ID | 名称 | 対象 | GitHub Issue |
|----|------|------|--------------|
| DOG-01 | 愛犬登録 | user | #100 |
| SEARCH-01 | 施設検索 | user | #102 |
| FACILITY-01 | 施設詳細 | user | #103 |
| BOOKING-01 | 予約フロー | user | #105 |
| REVIEW-01 | レビュー | user | #106 |
| SUPPORT-01 | サポート | user | #107 |

### 機能Epic（Shared/基盤）

| ID | 名称 | 対象 | GitHub Issue |
|----|------|------|--------------|
| PAY-01 | 決済基盤 | all | #112 |
| NOTIF-01 | 通知基盤 | all | #113 |

### 非機能Epic

| ID | 名称 | 対象 | GitHub Issue |
|----|------|------|--------------|
| SEC-01 | セキュリティ | all | #108 |
| A11Y-01 | アクセシビリティ | all | #109 |
| PERF-01 | パフォーマンス | all | #110 |
| SEO-01 | SEO | user | #111 |

### TMS連携Epic

| ID | 名称 | GitHub Issue |
|----|------|--------------|
| TMS-01 | TMS連携（手間いらず.NET） | #104 |
| TMS-01-1 | TMS設計・認証 | #117 |
| TMS-01-2 | TMS在庫連携 | #118 |
| TMS-01-3 | TMS予約連携 | #119 |
| TMS-01-4 | TMS監視基盤 | #120 |
| TMS-02 | TMS連携（手間いらず.NET） | #123 |

### B2B/Admin Epic

| ID | 名称 | 対象 | 別名 | 状態 |
|----|------|------|------|------|
| PORTAL-01 | Facility Portal | partner | PARTNER-01 | Active |
| DASHBOARD-01 | Operations Dashboard | admin | OPS-01 | Active |
| INTEGRATION-01 | System Integration Layer | all | - | Planned |

**注**: ux-design/epics/では別名（PARTNER-01, OPS-01）で管理されています。

### ビジネスEpic

| ID | 名称 | GitHub Issue |
|----|------|--------------|
| B-LAW-01 | 利用規約 | #146 |
| B-LAW-02 | プライバシー・個人情報 | #147 |
| B-LAW-03 | 特定商取引法 | #148 |
| B-LAW-04 | 旅行業登録 | #149 |
| B-BIZ-01 | 予約ポリシー | #151 |
| B-CONTRACT-01 | 外部契約・API契約 | - |
| B-SALES-01 | 施設獲得・営業活動 | - |
| B-OPS-01 | カスタマーサポート準備 | #150 |
| B-OPS-02 | 運用・監視 | #152 |

## ID命名規則

```
[PREFIX]-[NUMBER]: [名称]
```

- **PREFIX**: 機能カテゴリ（大文字、2-10文字）
- **NUMBER**: 連番（01から）
- **名称**: 日本語または英語

### プレフィックス一覧

| プレフィックス | 領域 |
|---------------|------|
| AUTH | 認証基盤 |
| DOG | 愛犬登録・管理 |
| PROFILE | プロフィール管理 |
| SEARCH | 検索機能 |
| FACILITY | 施設情報 |
| TMS | TMS連携 |
| BOOKING | 予約関連 |
| REVIEW | レビュー機能 |
| SUPPORT | カスタマーサポート |
| PAY | 決済基盤 |
| NOTIF | 通知基盤 |
| PORTAL | 施設向けポータル |
| DASHBOARD | 運用ダッシュボード |
| INTEGRATION | システム連携基盤 |
| SEC | セキュリティ |
| A11Y | アクセシビリティ |
| PERF | パフォーマンス |
| SEO | SEO |
| B-LAW | 法務・コンプライアンス |
| B-BIZ | ビジネス要件 |
| B-CONTRACT | 外部契約 |
| B-SALES | 施設獲得・営業 |
| B-OPS | 運用準備 |

## 対象ロール

| ロール | 説明 |
|--------|------|
| user | 旅行者（B2C） |
| admin | DogLife社内（管理者・CS） |
| partner | 施設オーナー（B2B） |
| all | 全ロール共通 |

---

更新: 2026-01-13
