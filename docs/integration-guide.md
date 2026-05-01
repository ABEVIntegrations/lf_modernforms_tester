# Integration Guide

How to drop the capture/inject snippets into existing form inline JS without breaking what's already there.

## Two workflows: pick the one that matches your audience

This repo ships two pairs of snippets. They do the same job — capture and replay form values — but target different users.

| Workflow                | Snippets                                                       | Where the JSON lives                  | Best for                                                    |
|-------------------------|----------------------------------------------------------------|---------------------------------------|-------------------------------------------------------------|
| **Developer (console)** | `snippets/capture.js`, `snippets/inject.js`                    | Browser DevTools console + inline JS  | You're comfortable with DevTools and editing inline JS      |
| **End user (bridge field)** | `snippets/capture-via-field.js`, `snippets/inject-via-field.js` | A text field on the form itself       | Form designers / QA / business users who want zero DevTools |

The two workflows are independent — pick one per form. The rest of this guide covers placement and pre-deploy hygiene that applies to both.

## End-user workflow (no DevTools)

If you'd rather not touch DevTools, use the bridge-field variants. The idea is simple: a single text field on the form acts as the I/O surface. Capture writes JSON into it; inject reads JSON out of it.

### One-time setup per form

1. Add a **Multi Line text field** to your form. Label it "Test Data Bridge" (or anything memorable). Make it large enough to comfortably display a few hundred characters of JSON.
2. Note its `fieldId`. (In the form designer, click the field — the id is in its properties.)
3. Open `snippets/capture-via-field.js` and `snippets/inject-via-field.js`. In each, set `BRIDGE_FIELD_ID` to your field's id.

### Capturing

1. Paste `capture-via-field.js` at the bottom of your form's inline JS.
2. If your form already has an `onFormSubmission` handler, comment it out temporarily.
3. Save the form. Open it, fill out fields with your desired test values.
4. Click Submit. Submission is blocked, and the bridge field on the page now contains pretty-printed JSON of every other field's value.
5. Copy that JSON out of the bridge field. Save it to `forms/<form-name>/test-data.json` for safekeeping.
6. Remove the capture snippet from inline JS, restore the original `onFormSubmission`.

### Injecting

The inject snippet reads the bridge field's value as the form loads. Because Laserfiche clears all runtime values on reload, the JSON has to be present **before** the form opens — i.e. set as the bridge field's **default value** in the form designer.

1. Paste `inject-via-field.js` at the bottom of your form's inline JS.
2. In the form designer, open the Test Data Bridge field's properties and paste your saved JSON into its **Default Value**.
3. Save the form, then open it. The bridge field shows up pre-filled, the inject snippet reads it, and every other field populates.
4. To turn injection off temporarily, either flip `INJECT_TEST_DATA = false` in the snippet, or clear the field's Default Value in the designer.

> **Pasting into the field at runtime and reloading does not work** — Laserfiche resets the form on reload and the JSON is gone before inject runs. Default Value is the only place that survives a reload.

#### Live editing during testing

Once the form is open and inject has run from the Default Value, you can tweak the JSON directly in the bridge field on the page. As soon as you click out of the bridge field (blur), inject re-runs and re-populates the other fields with your edited values. No reload needed.

This is the fast feedback loop for iterating on test data: change a value, tab out, see the form update. When you've found a JSON shape you like, copy it back into the bridge field's Default Value in the designer so it persists across reloads.

### Size limits and the bridge field

Laserfiche's Default Value input has practical size limits (the exact ceiling depends on form version; multi-line text fields hold significantly more than single-line, but neither is unbounded). For larger forms:

- Capture defaults to **pretty-printed** JSON for readability. If your default value field can't hold it, set `MINIFY_OUTPUT = true` at the top of `capture-via-field.js` to emit single-line JSON instead — typically ~40% smaller.
- If even minified JSON is too large for the Default Value, fall back to the **developer (console) workflow** (`snippets/capture.js` + `snippets/inject.js`). It has no size limit because the JSON lives in inline JS, not on the form.
- Don't try to split JSON across multiple bridge fields — the snippets don't support that and the complexity isn't worth it. Switch workflows instead.

### Before deploy

- Set `INJECT_TEST_DATA = false` in the inject snippet (or remove the snippet entirely).
- Remove the bridge field from the form layout, or hide it from end users.
- Restore any commented-out `onFormSubmission` logic.

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
