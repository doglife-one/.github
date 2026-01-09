# ID命名規則

DogLife全リポジトリ共通のID体系。

## 階層構造

```
Epic (EPIC_IDS.md)
  └─ Story (S###)
       └─ Issue/Task
```

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
J[CATEGORY][##]
```

| カテゴリ | 範囲 | 対象 |
|---------|------|------|
| J001-J099 | user | 旅行者向け |
| J200-J299 | admin | 管理者向け |
| J300-J399 | partner | パートナー向け |

例: `J001`, `J202`, `J301`

### Blueprint ID

**場所**: ux-design/blueprints/

```
BP[CATEGORY][##]
```

| カテゴリ | 範囲 | 対象 |
|---------|------|------|
| BP001-BP099 | user | 旅行者向け |
| BP200-BP299 | admin | 管理者向け |
| BP300-BP399 | partner | パートナー向け |

例: `BP001`, `BP201`, `BP301`

### Story ID

**場所**: ux-design/stories/

```
S[CATEGORY][##]
```

| カテゴリ | 範囲 | 対象 |
|---------|------|------|
| S001-S099 | user | 旅行者向け |
| S200-S299 | admin | 管理者向け |
| S300-S399 | partner | パートナー向け |

例: `S010`, `S201`, `S305`

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
  ├─ Journey (J001)
  ├─ Blueprint (BP001)
  ├─ Story (S010)
  │    └─ GitHub Issue (#123)
  └─ Feature (BDD)
```

## リポジトリ別の管理対象

| リポジトリ | 管理するID |
|-----------|-----------|
| ux-design | J###, BP###, S###, INT###, RUN### |
| project-management | Epic (PREFIX-##), Issue |
| app | 実装タスク（Issue参照） |

---

更新: 2026-01-09
