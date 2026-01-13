# DogLife Organization - Claude Code 共通指示

全リポジトリで継承される共通ルール。

## ID体系

必ず [ID_CONVENTIONS.md](ID_CONVENTIONS.md) に従うこと。

- Epic: `PREFIX-##` (例: AUTH-01)
- Journey: `[DOMAIN]-J###` (例: T-J001, C-J002, BR-J001)
- Blueprint: `[DOMAIN]-BP###` (例: T-BP001, C-BP005)
- Story: `[DOMAIN]-S###` (例: T-S010, C-S001)

### ドメインプレフィックス
| プレフィックス | ドメイン |
|--------------|---------|
| T- | Travel (OTA) |
| C- | Column (コラム) |
| BR- | Branding (ブランド) |

## リポジトリ階層

```
ux-design (最上層)     ← UX設計・WBS定義
    ↓
project-management     ← Epic・Issue管理
    ↓
app (最下層)           ← 実装
```

## ロール命名

| ディレクトリ | 対象 |
|-------------|------|
| user/ | 旅行者（B2C） |
| admin/ | DogLife社内 |
| partner/ | 施設オーナー（B2B） |

## 禁止事項

- 本番環境への接続禁止
- mainブランチへの直接push禁止
- ID体系を無視した命名禁止

## 参照ドキュメント

- [EPIC_IDS.md](EPIC_IDS.md) - Epic ID定義
- [ID_CONVENTIONS.md](ID_CONVENTIONS.md) - 全ID命名規則
- [GLOSSARY.md](GLOSSARY.md) - 用語集

---

更新: 2026-01-14
