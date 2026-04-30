/**
 * Laserfiche Forms — Test Data Injection Snippet
 *
 * Purpose:
 *   Auto-populate form fields with captured test data on page load,
 *   so you don't have to manually re-fill every test cycle.
 *
 * Placement:
 *   - BOTTOM of your inline JS (default, recommended): values trigger your
 *     existing onFieldChange/onFieldBlur handlers, simulating real user
 *     input. Lookups, dependent fields, and validations all fire.
 *   - TOP of your inline JS: values populate before any handlers register,
 *     so cascading logic does not run. Use only if Option A causes problems
 *     (e.g. infinite loops between mutually-dependent fields).
 *
 * Usage:
 *   1. Capture your test data first using snippets/capture.js.
 *   2. Paste the captured JSON object contents into TEST_DATA below.
 *   3. Set INJECT_TEST_DATA = true while testing.
 *   4. Set INJECT_TEST_DATA = false (or remove this block entirely)
 *      before deploying to production.
 *
 * Tuning:
 *   - The setTimeout delay gives the form time to fully render before
 *     injection. Bump it higher (500, 1000) if some fields don't populate
 *     — common with date pickers, lookup-driven dropdowns, etc.
 */

const INJECT_TEST_DATA = true;

const TEST_DATA = {
  // Paste captured JSON object contents here.
  // Keys are fieldId (as numbers or strings — both work).
  // Examples:
  //
  //   1: "John Smith",
  //   2: "jsmith@example.com",
  //   6: "Assessor",
  //   35: "Jane Doe",
  //   42: { dateStr: "2025-12-15", timeStr: "", dateTimeObj: null },
};

if (INJECT_TEST_DATA) {
  setTimeout(() => {
    let injected = 0;
    let failed = 0;
    Object.entries(TEST_DATA).forEach(([fieldId, value]) => {
      try {
        LFForm.setFieldValues({ fieldId: parseInt(fieldId, 10) }, value);
        injected++;
      } catch (e) {
        console.warn(`Could not inject field ${fieldId}:`, e.message);
        failed++;
      }
    });
    console.log(`✓ Test data injected: ${injected} fields`
      + (failed ? ` (${failed} failed — see warnings above)` : ''));
  }, 250);
}
