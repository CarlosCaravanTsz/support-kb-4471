<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // A count from the live split, for use inside a sentence.
  // of: a problem, 'reports' (unique reports), 'rows' (export rows), 'repeats' or 'problems'.
  let { ticket, of }: { ticket: number; of: Problem | 'reports' | 'rows' | 'repeats' | 'problems' } = $props();

  const s = $derived(split(ticket));
  const n = $derived(
    of === 'reports' ? s.reports.length
    : of === 'rows' ? s.rows
    : of === 'repeats' ? s.rows - s.reports.length
    : of === 'problems' ? s.groups.length
    : (s.groups.find((g) => g.problem === of)?.reports.length ?? 0),
  );
</script>

<strong>{n}</strong>
