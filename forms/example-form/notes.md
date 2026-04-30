# Example form

Reference form showing the expected per-form layout. Not connected to a real Laserfiche deployment.

## What it demonstrates

- A department lookup that populates head / email / LF username when the user picks a department (`fieldId: 6`).
- An `onFormSubmission` guard that rejects dates in the past (`fieldId: 42`).
- The shape of `test-data.json` produced by `snippets/capture.js`, including how date fields serialize as `{ dateStr, timeStr, dateTimeObj }`.

## Field IDs used

| fieldId | Purpose                          |
|---------|----------------------------------|
| 1       | Requester name                   |
| 2       | Requester email                  |
| 6       | Department (drives lookup)       |
| 35      | Department head (auto-filled)    |
| 36      | Department head email (auto)     |
| 37      | LF username (auto)               |
| 42      | Requested date                   |

## Trying it

1. Create a form in Laserfiche with the field IDs above.
2. Paste `inline.js` into the form's inline JS editor.
3. Paste `snippets/inject.js` at the bottom and copy the `test-data.json` contents into its `TEST_DATA` block.
4. Reload the form — fields populate, the lookup fires, and the date guard runs on submit.
