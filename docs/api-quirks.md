# LFForm API Quirks

Hard-won knowledge about the Laserfiche modern Forms sandbox. Official docs can be limited on some of these — they were figured out by trial and `console.log`.

## Event handler signatures

### `onFieldBlur` and `onFieldChange`

Handler comes **first**, options **second**. Always wrap the handler in an arrow function — passing a direct function reference does not fire.

```javascript
// ✓ Correct
LFForm.onFieldBlur(() => myFn(), { fieldId: 1 });
LFForm.onFieldChange(() => myFn(), { fieldId: 1 });

// ✗ Does not fire
LFForm.onFieldBlur(myFn, { fieldId: 1 });
```

### Date pickers don't fire `onFieldBlur`

Use `onFieldChange` instead for any date field. `onFieldBlur` will never fire on the date picker control.

## Field value access

### `getFieldValues` return type varies

Sometimes returns an array (use `[0]` index), sometimes a direct value. Always `console.log` first to verify the shape.

```javascript
const raw = LFForm.getFieldValues({ fieldId: 6 });
const value = Array.isArray(raw) ? raw[0] : raw;
```

### Date fields return an object

Shape: `{ dateStr, timeStr, dateTimeObj }`. Extract `.dateStr` for the formatted date string.

### `setFieldValues` syntax

Value is the **second argument**, not a property of the options object.

```javascript
// ✓ Correct
LFForm.setFieldValues({ fieldId: 35 }, "Jane Doe");

// ✗ Wrong — value is silently ignored
LFForm.setFieldValues({ fieldId: 35, value: "Jane Doe" });
```

## URL encoding

`encodeURIComponent()` handles everything (`%20`, `%2F`, `%3A`, etc.). No manual character replacement needed when building query strings.

## Form submission control

Return `{ error: '...' }` from `LFForm.onFormSubmission()` to block submission with a popup message.

```javascript
LFForm.onFormSubmission(() => {
  if (someCondition) return { error: "Cannot submit because..." };
});
```

## Sandbox limitations

These are intentional — Laserfiche runs your inline JS in an isolated sandbox iframe.

- **No jQuery** — `$` is undefined.
- **No direct DOM manipulation** — sandbox cannot reach the form DOM.
- **`alert()` is blocked.**
- **Date picker `beforeShowDay` is inaccessible** — cannot grey out specific calendar days visually.
- **Submit button cannot be hidden** via the API.
- **`LFForm` is not exposed to the parent page's `window`** — you cannot call it from the DevTools console directly. All scripting must go through the inline JS editor.

## Weekend / date range blocking pattern

Without `beforeShowDay`, blocking specific dates is layered:

1. `LFForm.changeFieldSettings({ fieldId: N }, { min: '...', max: '...' })` for hard min/max.
2. `onFieldChange` + `{ subtext: '...' }` for live validation feedback when user picks an invalid date.
3. `onFormSubmission` returning `{ error: ... }` as a backstop in case validation is bypassed.

## Backslash escaping in string literals

JavaScript silently corrupts strings like `"DOMAIN\username"` because `\u`, `\r`, `\n`, etc. are valid escape sequences. **Always double the backslash:**

```javascript
// ✓ Correct
"CORTLAND\\jyecker"

// ✗ Silently wrong — \r becomes a carriage return character
"CORTLAND\jyecker"
```

If generating these literals from a SQL query, the SQL output must produce doubled backslashes too — use `REPLACE()` to escape them in the result string.

## Lookup table style

Prefer named object properties over positional arrays for lookup tables — much more readable when fields are added later:

```javascript
// ✓ Readable
const DEPT_LOOKUP = {
  "Assessor": { deptHead: "Jane Smith", email: "jsmith@x.gov", lfUsername: "DOMAIN\\jsmith" },
};

// ✗ Positional — easy to swap by accident
const DEPT_LOOKUP = {
  "Assessor": ["Jane Smith", "jsmith@x.gov", "DOMAIN\\jsmith"],
};
```
