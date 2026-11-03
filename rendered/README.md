# rendered

`kb/incidents/4471/problems.html` is the page `src/routes/kb/incidents/4471/problems/+page.svx`
as the desk sees it: built with SvelteKit 2, Svelte 5 and mdsvex (layout `runbook`), prerendered,
with its CSS inlined and its scripts removed. Every count on it comes from `src/lib/kb/problems.ts`
run over `src/lib/data/reports-4471.json` and `desk-notes.json` at build time.
