# Laserfiche Form Tools

Personal toolkit for working with Laserfiche modern Forms inline JavaScript — capture/replay test data, accumulated API quirks, and per-form source backups.

## What this solves

You have a form that you need to test many times. Maybe it triggers a workflow and/or a document merge rule and you're tired of entering test data into the form to make downstream tweaks. 

Modern Laserfiche Forms have no built-in way to save test data. Filling out a 30-field form by hand every time you tweak a script is painful. This repo provides:

- **Capture/inject snippets** to record current form values as JSON and replay them on page load
- **API quirks documentation** — the not-obvious sandbox behaviors that took real time to figure out
- **Per-form source backups** — version-controlled copies of each form's inline JS

## tl;dr No Dev Tools Super Quick Start

1. Paste `capture-via-field.js` at the bottom of your form's inline JS.
2. If your form already has an `onFormSubmission` handler, comment it out temporarily.
3. Save the form. Open it, fill out fields with your desired test values.
4. Click Submit. Submission is blocked, and the bridge field on the page now contains pretty-printed JSON of every other field's value.
5. Copy that JSON out of the bridge field. Save it to `forms/<form-name>/test-data.json` for safekeeping.
6. Remove the capture snippet from inline JS, restore the original `onFormSubmission`.

Go here for the full instructions: [Integration guide](docs/integration-guide.md)

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
