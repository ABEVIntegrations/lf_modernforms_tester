# Forms

Per-form artifacts live here. Each subdirectory represents one Laserfiche form you're working on.

## Layout

```
forms/
└── <form-name>/
    ├── inline.js        Backup of the form's inline JavaScript
    ├── test-data.json   Captured test data (output from snippets/capture.js)
    └── notes.md         Anything form-specific worth remembering
```

## Why per-form folders?

- **`inline.js`** — Laserfiche's form editor has no version history. Keeping a copy here means you can diff, revert, and code-review changes the same way you would any other code.
- **`test-data.json`** — paired with `snippets/inject.js` so anyone working on the form can reload it pre-filled.
- **`notes.md`** — quirks specific to this form: which department lookups it depends on, which fields require special handling, known issues, etc.

## Privacy

Before committing test data publicly, **redact PII**: names, emails, internal usernames, phone numbers, addresses. The `example-form/` directory shows the expected shape with placeholder data.
