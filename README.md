# Laserfiche Form Tools

Personal toolkit for working with Laserfiche modern Forms inline JavaScript — capture/replay test data, accumulated API quirks, and per-form source backups.

## What this solves

Modern Laserfiche Forms have no built-in way to save test data. Filling out a 30-field form by hand every time you tweak a script is painful. This repo provides:

- **Capture/inject snippets** to record current form values as JSON and replay them on page load
- **API quirks documentation** — the not-obvious sandbox behaviors that took real time to figure out
- **Per-form source backups** — version-controlled copies of each form's inline JS

## Quick start

1. **Capture test data** from a manually-filled form:
   - Paste `snippets/capture.js` at the bottom of your form's inline JS
   - Save, fill out the form, click Submit
   - Copy the JSON from the browser console
   - Save to `forms/<form-name>/test-data.json`

2. **Inject on reload**:
   - Paste `snippets/inject.js` at the bottom of your inline JS
   - Replace the `TEST_DATA` placeholder with your captured JSON
   - Reload the form — fields auto-populate

3. **Toggle off for production** by flipping `INJECT_TEST_DATA = false`.

## Project structure

```
laserfiche-form-tools/
├── snippets/         Reusable capture/inject templates
├── docs/             API quirks, integration guide
└── forms/            Per-form: inline.js, test-data.json, notes.md
```

## Documentation

- [Integration guide](docs/integration-guide.md) — how to add snippets to existing inline JS
- [API quirks](docs/api-quirks.md) — sandbox behaviors and gotchas

## Environment

- Laserfiche modern Forms (sandboxed JS environment)
- No jQuery, no direct DOM manipulation, no `alert()`
- All work flows through the `LFForm.*` API
- Portal: https://portal.laserfiche.com/p4167/forms/
