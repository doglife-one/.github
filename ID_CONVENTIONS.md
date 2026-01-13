# ID命名規則

DogLife全リポジトリ共通のID体系。

## 階層構造

```
Epic (EPIC_IDS.md)
  └─ Story (S###)
       └─ Issue/Task
```

## ドメインプレフィックス

Journey、Blueprint、Storyにはドメインプレフィックスをつけてグローバルにユニークにする。

| プレフィックス | ドメイン | 例 |
|--------------|---------|-----|
| T- | Travel (OTA) | T-J001, T-BP001, T-S010 |
| C- | Column (コラム) | C-J001, C-BP001 |
| BR- | Branding (ブランド) | BR-J001, BR-BP001 |

## ID体系一覧

### Epic ID

**場所**: project-management (GitHub Issues)

```
[PREFIX]-[##]: [名称]
例: AUTH-01: 認証基盤
```

詳細は [EPIC_IDS.md](EPIC_IDS.md) 参照。

### Journey ID

**場所**: ux-design/journeys/

```
[DOMAIN]-J[ROLE][##]
```

| ロール | 範囲 | 対象 |
|--------|------|------|
| 001-099 | user | 旅行者向け |
| 200-299 | admin | 管理者向け |
| 300-399 | partner | パートナー向け |

例: `T-J001`, `T-J202`, `C-J001`, `BR-J001`

### Blueprint ID

**場所**: ux-design/blueprints/

```
[DOMAIN]-BP[ROLE][##]
```

| ロール | 範囲 | 対象 |
|--------|------|------|
| 001-099 | user | 旅行者向け |
| 200-299 | admin | 管理者向け |
| 300-399 | partner | パートナー向け |

例: `T-BP001`, `T-BP201`, `C-BP001`, `BR-BP001`

### Story ID

**場所**: ux-design/stories/

```
[DOMAIN]-S[ROLE][##]
```

| ロール | 範囲 | 対象 |
|--------|------|------|
| 001-099 | user | 旅行者向け |
| 200-299 | admin | 管理者向け |
| 300-399 | partner | パートナー向け |

例: `T-S010`, `T-S201`, `C-S001`

### Integration Flow ID

**場所**: ux-design/architecture/integration-flows/

```
INT[###]
```

例: `INT001`, `INT002`

### Runbook ID

**場所**: ux-design/docs/runbooks/

```
RUN[###]
```

例: `RUN001`, `RUN002`

## トレーサビリティ

```
Epic (AUTH-01)
  ├─ Journey (T-J001)
  ├─ Blueprint (T-BP001)
  ├─ Story (T-S010)
  │    └─ GitHub Issue (#123)
  └─ Feature (BDD)
```

## リポジトリ別の管理対象

| リポジトリ | 管理するID |
|-----------|-----------|
| ux-design | [DOMAIN]-J###, [DOMAIN]-BP###, [DOMAIN]-S###, INT###, RUN### |
| project-management | Epic (PREFIX-##), Issue |
| app | 実装タスク（Issue参照） |

---

更新: 2026-01-14
