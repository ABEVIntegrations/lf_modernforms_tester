# Contributing

Thanks for your interest in improving this toolkit. It's a small project, so the contribution process is light.

## Reporting bugs or quirks

Found a Laserfiche Forms behavior that the snippets don't handle, or an API quirk not yet documented? Open an issue with:

- Laserfiche Forms version (Cloud / self-hosted, and version if known)
- The field type or scenario involved (date picker, lookup dropdown, repeating section, etc.)
- A minimal reproduction — ideally a stripped-down form with just the fields needed to trigger the issue
- What you expected vs. what happened
- Any console output

## Pull requests

1. Fork and branch from `main`.
2. Keep changes focused — one fix or feature per PR.
3. If you're adding a snippet or changing snippet behavior, update `docs/integration-guide.md` so it stays in sync.
4. If you discover a new sandbox quirk, add it to `docs/api-quirks.md` with a short reproduction.
5. Snippets should stay self-contained — no external dependencies, no build step. They get pasted directly into a Laserfiche form's inline JS editor, so they need to run as-is.

## Adding example forms

The `forms/` directory holds per-form artifacts. If you want to share an example:

- Create `forms/<descriptive-name>/`
- Include `inline.js` (the form's full inline JS, with secrets/PII removed)
- Include `test-data.json` (captured test data, with PII removed)
- Include `notes.md` describing what the form demonstrates

## Code style

- 2-space indentation
- Comments explain *why*, not *what*
- Prefer named object properties over positional arrays in lookup tables (see `docs/api-quirks.md`)

## License

By contributing, you agree your contributions will be licensed under the MIT License.
