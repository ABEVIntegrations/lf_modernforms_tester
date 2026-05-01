/**
 * Laserfiche Forms — Test Data Injection (Bridge Field, no DevTools)
 *
 * Purpose:
 *   Read JSON from a designated "bridge" field on the form and
 *   auto-populate every other field with those values. Runs once on
 *   page load (initial inject) and again whenever the user edits the
 *   bridge field and blurs out of it (live re-inject).
 *
 * Setup:
 *   1. Add a Multi Line text field to your form, labeled "Test Data
 *      Bridge". Note its fieldId.
 *   2. Set BRIDGE_FIELD_ID below to that fieldId.
 *   3. Paste this snippet at the BOTTOM of your form's inline JavaScript.
 *   4. To pre-fill the form on every reload, paste your saved JSON into
 *      the bridge field's *Default Value* in the form designer.
 *
 * Usage:
 *   - On load: snippet reads the bridge field's value (typically its
 *     Default Value) and populates all other fields from the JSON.
 *   - Live editing: tweak the JSON in the bridge field on the page, click
 *     out of it (blur), and the other fields re-populate from the new JSON.
 *     Lets you iterate on test data without going back to the designer.
 *   - Empty bridge: snippet no-ops silently. Safe to leave the snippet
 *     active even when you're not actively testing.
 *
 * Tuning:
 *   - The setTimeout delay gives the form time to fully render before the
 *     initial injection. Bump it higher (500, 1000) if some fields don't
 *     populate — common with date pickers, lookup-driven dropdowns, etc.
 *
 * Production:
 *   - Set INJECT_TEST_DATA = false (or remove this snippet entirely)
 *     before deploying. Also remove the bridge field from the form, or
 *     hide it.
 */

const INJECT_TEST_DATA = true;
const BRIDGE_FIELD_ID = 0; // <-- replace with your bridge field's fieldId

function injectFromBridge(trigger) {
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
    console.warn(`inject-via-field (${trigger}): bridge field contents are not valid JSON. No fields injected.`, e.message);
    return;
  }

  if (!testData || typeof testData !== 'object') {
    console.warn(`inject-via-field (${trigger}): bridge JSON did not parse to an object. No fields injected.`);
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
      console.warn(`inject-via-field (${trigger}): could not inject field ${fieldId}:`, e.message);
      failed++;
    }
  });
  console.log(`✓ inject-via-field (${trigger}): ${injected} fields populated`
    + (failed ? ` (${failed} failed — see warnings above)` : ''));
}

if (INJECT_TEST_DATA) {
  // Initial inject on page load.
  setTimeout(() => injectFromBridge('load'), 250);

  // Live re-inject whenever the user edits the bridge field and blurs out.
  if (BRIDGE_FIELD_ID) {
    LFForm.onFieldBlur(() => injectFromBridge('blur'), { fieldId: BRIDGE_FIELD_ID });
  }
}
