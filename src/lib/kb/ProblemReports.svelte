<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // Every report of one problem, so nobody has to trust the count.
  let { ticket, problem }: { ticket: number; problem: Problem } = $props();

  const rs = $derived(split(ticket).groups.find((g) => g.problem === problem)?.reports ?? []);
</script>

<table>
  <thead><tr><th>report</th><th>received</th><th>tenant</th><th>by</th><th>what they wrote</th></tr></thead>
  <tbody>
    {#each rs as r (r.id)}
      <tr><td><code>{r.id}</code></td><td>{r.receivedAt.slice(0, 10)}</td><td>{r.tenant}</td><td>{r.channel}</td><td>{r.body}</td></tr>
    {/each}
  </tbody>
</table>
