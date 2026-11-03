<script lang="ts">
  import { PROBLEMS, mistagged, type Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // issues: where each problem is filed now, problem → issue URL.
  let { ticket, issues = {} }: { ticket: number; issues?: Partial<Record<Problem, string>> } = $props();

  const s = $derived(split(ticket));
  const list = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
  const issueNo = (url: string) => '#' + url.split('/').pop();
</script>

<p class="sum">
  <strong>{s.reports.length}</strong> reports merged into #{ticket} ({s.rows} rows in the export, {s.rows - s.reports.length} of them repeats) ·
  <strong>{s.groups.length}</strong>
  {s.groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>came in by</th><th>intake tagged</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each s.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code> {PROBLEMS[g.problem].name}</td>
        <td><strong>{g.reports.length}</strong></td>
        <td>{g.tenants.length}</td>
        <td class="tags">{list(g.channels)}</td>
        <td class="tags">{list(g.taggedAs)}{#if mistagged(g)}<br /><span class="off">{mistagged(g)} tagged wrong</span>{/if}</td>
        <td class="tags">{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if issues[g.problem]}<a href={issues[g.problem]}>{issueNo(issues[g.problem] ?? '')}</a>{:else}<span class="off">none yet</span>{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
  .off { color: var(--warn); font-weight: 600; }
</style>
