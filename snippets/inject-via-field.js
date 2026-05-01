/**
 * Laserfiche Forms — Test Data Injection (Bridge Field, no DevTools)
 *
 * Purpose:
 *   On page load, read JSON from a designated "bridge" field on the
 *   form and auto-populate every other field with those values. The
 *   end user pastes their saved JSON into the bridge field — no
 *   editing of inline JS or use of DevTools required.
 *
 * Setup:
 *   1. Add a Multi Line text field to your form, labeled "Test Data
 *      Bridge". Note its fieldId.
 *   2. Set BRIDGE_FIELD_ID below to that fieldId.
 *   3. Paste this snippet at the BOTTOM of your form's inline JavaScript.
 *
 * Usage:
 *   - Paste your saved test-data JSON into the bridge field.
 *   - Reload the form. Every other field auto-populates from the JSON.
 *   - Leave the bridge field empty and reload — nothing happens, the
 *     form behaves normally. (Safe to leave the snippet active.)
 *
 * Tuning:
 *   - The setTimeout delay gives the form time to fully render before
 *     injection. Bump it higher (500, 1000) if some fields don't populate
 *     — common with date pickers, lookup-driven dropdowns, etc.
 *
 * Production:
 *   - Set INJECT_TEST_DATA = false (or remove this snippet entirely)
 *     before deploying. Also remove the bridge field from the form, or
 *     hide it.
 */

const INJECT_TEST_DATA = true;
const BRIDGE_FIELD_ID = 0; // <-- replace with your bridge field's fieldId

if (INJECT_TEST_DATA) {
  setTimeout(() => {
    if (!BRIDGE_FIELD_ID) {
      console.warn("inject-via-field: BRIDGE_FIELD_ID is not set. Edit the snippet and set it to your bridge field's id.");
      return;
    }

    const raw = LFForm.getFieldValues({ fieldId: BRIDGE_FIELD_ID });
    const json = Array.isArray(raw) ? raw[0] : raw;
    if (!json || typeof json !== 'string' || !json.trim()) {
      return; // bridge empty — silent no-op
    }

    let testData;
    try {
      testData = JSON.parse(json);
    } catch (e) {
      console.warn("inject-via-field: bridge field contents are not valid JSON. No fields injected.", e.message);
      return;
    }

    if (!testData || typeof testData !== 'object') {
      console.warn("inject-via-field: bridge JSON did not parse to an object. No fields injected.");
      return;
    }

    let injected = 0;
    let failed = 0;
    Object.entries(testData).forEach(([fieldId, value]) => {
      const id = parseInt(fieldId, 10);
      if (id === BRIDGE_FIELD_ID) return; // never overwrite the bridge itself
      try {
        LFForm.setFieldValues({ fieldId: id }, value);
        injected++;
      } catch (e) {
        console.warn(`inject-via-field: could not inject field ${fieldId}:`, e.message);
        failed++;
      }
    });
    console.log(`✓ Test data injected from bridge field: ${injected} fields`
      + (failed ? ` (${failed} failed — see warnings above)` : ''));
  }, 250);
}
