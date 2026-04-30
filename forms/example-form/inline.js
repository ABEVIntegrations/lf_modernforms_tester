/**
 * Example form inline JS — illustrative only.
 *
 * Demonstrates:
 *   - A small department lookup table
 *   - onFieldChange populating dependent fields
 *   - onFormSubmission with a simple validation guard
 *
 * Real forms in your own forms/<form-name>/inline.js will be larger and
 * organization-specific. This file exists so newcomers can see the expected
 * shape before adding their own.
 */

const DEPT_LOOKUP = {
  "Assessor":  { deptHead: "Jane Smith",   email: "jsmith@example.gov",  lfUsername: "DOMAIN\\jsmith" },
  "Building":  { deptHead: "Mark Lee",     email: "mlee@example.gov",    lfUsername: "DOMAIN\\mlee"   },
  "Planning":  { deptHead: "Pat Rivera",   email: "privera@example.gov", lfUsername: "DOMAIN\\privera"},
};

// When the user picks a department, fill in the head/email/username fields.
LFForm.onFieldChange(() => {
  const raw = LFForm.getFieldValues({ fieldId: 6 });
  const dept = Array.isArray(raw) ? raw[0] : raw;
  const row = DEPT_LOOKUP[dept];
  if (!row) return;

  LFForm.setFieldValues({ fieldId: 35 }, row.deptHead);
  LFForm.setFieldValues({ fieldId: 36 }, row.email);
  LFForm.setFieldValues({ fieldId: 37 }, row.lfUsername);
}, { fieldId: 6 });

// Block submission if the requested date is in the past.
LFForm.onFormSubmission(() => {
  const raw = LFForm.getFieldValues({ fieldId: 42 });
  const dateStr = (Array.isArray(raw) ? raw[0] : raw)?.dateStr;
  if (!dateStr) return;

  const picked = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (picked < today) {
    return { error: "Requested date cannot be in the past." };
  }
});
