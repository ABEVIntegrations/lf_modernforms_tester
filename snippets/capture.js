/**
 * Laserfiche Forms — Test Data Capture Snippet
 *
 * Purpose:
 *   Capture all current field values from a form as JSON for later replay
 *   via snippets/inject.js.
 *
 * Usage:
 *   1. Paste this snippet at the BOTTOM of your form's inline JavaScript.
 *      (If your form has an existing onFormSubmission handler, comment it
 *      out temporarily so capture runs cleanly. Restore it after.)
 *   2. Save the form.
 *   3. Open the form in a browser, fill out fields with desired test values.
 *   4. Open DevTools console (F12 → Console).
 *   5. Click Submit on the form.
 *   6. Submission is blocked; the JSON output prints between the
 *      "=== CAPTURED TEST DATA ===" markers.
 *   7. Copy the JSON object, save it to forms/<form-name>/test-data.json
 *      AND/OR paste it into snippets/inject.js → TEST_DATA.
 *   8. Remove this snippet from the form when done.
 *
 * Notes:
 *   - Filters out CustomHTML, Page, and Form components — they have no value.
 *   - Date fields capture as { dateStr, timeStr, dateTimeObj }; inject sets
 *     the same object back, so they round-trip cleanly.
 *   - The captured object is also dropped on window.__capturedTestData so you
 *     can right-click → "Copy object" in the console if preferred.
 */

const SKIP_TYPES = new Set(['CustomHTML', 'Page', 'Form']);

LFForm.onFormSubmission(() => {
  // findFields predicate is unreliable across LF versions; filter post-hoc.
  const fields = LFForm.findFields(() => true)
    .filter(f => !SKIP_TYPES.has(f.componentType));

  const captured = {};
  fields.forEach(f => {
    captured[f.fieldId] = LFForm.getFieldValues(f);
  });

  const json = JSON.stringify(captured, null, 2);
  console.log("=== CAPTURED TEST DATA ===");
  console.log(json);
  console.log("=== END CAPTURED TEST DATA ===");

  window.__capturedTestData = captured;
  console.log("Also available as: window.__capturedTestData");

  return { error: "Capture mode active — submission blocked. JSON printed to console." };
});
