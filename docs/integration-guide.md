# Integration Guide

How to drop the capture/inject snippets into existing form inline JS without breaking what's already there.

## Where to place the snippet

### Option A — Bottom of file (recommended default)

Place the snippet **after** all your `onFieldChange`, `onFieldBlur`, and `onFormSubmission` registrations.

When `setFieldValues` runs from inject, your registered handlers fire — lookups execute, dependent fields populate, validations run. This simulates real user input and tests end-to-end form behavior.

### Option B — Top of file

Values populate **before** handlers register, so cascading logic does not run.

Use this when:
- Option A causes infinite loops between mutually-dependent fields
- Lookups in your form fail with test data and you want to skip them
- You only need fields visually populated for layout/screenshot work

## Existing `onFormSubmission` handler?

If your form already has an `onFormSubmission`, the capture snippet's handler will register as an additional one. Order matters: the first one registered fires first.

**Safest approach during capture:** temporarily comment out your real `onFormSubmission` so only the capture handler runs. Restore it after capture is complete.

The inject snippet does not add an `onFormSubmission` handler, so it can coexist safely with existing submission logic.

## The toggle flag

Wrap the inject block in a flag and grep for it before deploying:

```javascript
const INJECT_TEST_DATA = true;  // ← flip to false for production

if (INJECT_TEST_DATA) {
  // ... injection logic
}
```

Before deploying, either:
- Search-and-replace `INJECT_TEST_DATA = true` → `INJECT_TEST_DATA = false`
- Strip the entire block out of the form's inline JS

A pre-deploy `git grep "INJECT_TEST_DATA = true"` will catch any forms you forgot.

## Workflow summary

### Initial capture (one time per form)

1. Add `capture.js` snippet to the form.
2. Comment out existing `onFormSubmission` if present.
3. Save form, fill it out manually with realistic test data.
4. Open DevTools console → click Submit.
5. Copy JSON output → save to `forms/<form-name>/test-data.json`.
6. Remove capture snippet, restore commented-out code.

### Daily testing

1. Add `inject.js` snippet at the bottom of the form's inline JS.
2. Set `INJECT_TEST_DATA = true`.
3. Paste the captured JSON into `TEST_DATA`.
4. Reload form — fields auto-populate. Iterate.

### Updating test data

1. Re-add capture snippet temporarily (or keep it commented out and uncomment when needed).
2. Modify form values manually as needed.
3. Submit, capture new JSON, paste into inject's `TEST_DATA`.

### Pre-deploy checklist

- [ ] `INJECT_TEST_DATA = false` (or block removed)
- [ ] Capture snippet removed
- [ ] Original `onFormSubmission` (if any) uncommented and intact
- [ ] Form's `inline.js` committed to repo

## Field type considerations

Most field types are scalar strings/numbers and Just Work. Some need attention:

- **Date fields**: Capture returns `{ dateStr, timeStr, dateTimeObj }` — inject sets the same object back. See [api-quirks.md](api-quirks.md) for details.
- **Lookup-driven dropdowns**: If injection happens before the lookup data loads, values may not stick. Bump the `setTimeout` delay in inject.js — try 500, then 1000.
- **Repeating sections / collections**: Not currently supported by these snippets. TODO.
- **File attachments**: Cannot be programmatically populated. Skip these in your test data and re-attach manually.
