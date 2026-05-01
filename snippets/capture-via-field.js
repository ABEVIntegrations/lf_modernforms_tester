/**
 * Laserfiche Forms — Test Data Capture (Bridge Field, no DevTools)
 *
 * Purpose:
 *   Capture all current field values as JSON into a designated "bridge"
 *   field on the form itself, so a non-developer end user can copy the
 *   JSON straight from the page without opening browser DevTools.
 *
 * Setup:
 *   1. Add a Multi Line text field to your form. Label it "Test Data
 *      Bridge" (or anything you like). Note its fieldId.
 *   2. Set BRIDGE_FIELD_ID below to that fieldId.
 *   3. Paste this snippet at the BOTTOM of your form's inline JavaScript.
 *      (If your form has an existing onFormSubmission handler, comment it
 *      out temporarily so capture runs cleanly. Restore it after.)
 *
 * Usage:
 *   1. Open the form, fill out all fields with desired test values.
 *   2. Click Submit. Submission is blocked.
 *   3. The bridge field on the page now contains the pretty-printed JSON
 *      of every other field's value. Copy it out.
 *   4. Save it to forms/<form-name>/test-data.json AND/OR paste it into
 *      the bridge field whenever you want to re-inject those values.
 *   5. Remove this snippet from the form when done capturing.
 *
 * Notes:
 *   - The bridge field itself is excluded from the capture, so the JSON
 *     does not accidentally include a previous capture's contents.
 *   - CustomHTML, Page, and Form components have no value and are skipped.
 *   - Each capture overwrites the bridge field. Copy the JSON out before
 *     re-capturing if you want to keep the previous version.
 *   - For inject to actually apply the captured JSON on next load, paste
 *     it into the bridge field's *Default Value* in the form designer.
 *     Pasting into the field at runtime does not survive a reload.
 *   - If your form has too many fields for the captured JSON to fit as a
 *     Default Value, set MINIFY_OUTPUT = true to emit single-line JSON
 *     (~40% smaller). For very large forms, switch to the console-based
 *     snippets/capture.js + snippets/inject.js workflow instead.
 */

const BRIDGE_FIELD_ID = 0;     // <-- replace with your bridge field's fieldId
const MINIFY_OUTPUT = false;   // <-- set true for compact single-line JSON

LFForm.onFormSubmission(() => {
  if (!BRIDGE_FIELD_ID) {
    return { error: "capture-via-field: BRIDGE_FIELD_ID is not set. Edit the snippet and set it to your bridge field's id." };
  }

  const fields = LFForm.findFields(f =>
    f.componentType !== 'CustomHTML' &&
    f.componentType !== 'Page' &&
    f.componentType !== 'Form' &&
    f.fieldId !== BRIDGE_FIELD_ID
  );

  const captured = {};
  fields.forEach(f => {
    captured[f.fieldId] = LFForm.getFieldValues(f);
  });

  const json = MINIFY_OUTPUT
    ? JSON.stringify(captured)
    : JSON.stringify(captured, null, 2);
  LFForm.setFieldValues({ fieldId: BRIDGE_FIELD_ID }, json);

  return { error: "Test data captured. Copy the JSON from the bridge field, then paste it into that field's Default Value in the form designer for inject to use it." };
});
