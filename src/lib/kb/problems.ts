// The problems inside a merged ticket, one per fix. causes.ts says why a date flips (parser or hint);
// a report the desk read as a one-day move (desk-notes.json) is not a flip at all, so it is its own
// problem here, not a footnote under the tenant's cause.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, { name: string; fix: string }> = {
  parser: {
    name: 'Shared parser reads day-first dates month first',
    fix: 'Parse with the tenant locale, not month first.',
  },
  hint: {
    name: 'booking-v3 form tells day-first tenants to type MM/DD',
    fix: "Print the tenant's own date order under the field, or read the form the way its hint says.",
  },
  shift: {
    name: 'Booking moves by one day (time zone), not a month flip',
    fix: 'Store and send bookings with their time zone; do not convert the calendar day.',
  },
  unplaced: {
    name: 'No tenant on file, or tenant writes the month first',
    fix: 'Find the tenant before filing.',
  },
};

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  taggedAs: Record<string, number>;
  tenants: string[];
  channels: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

// Reports merged into `ticket`, each counted once (the export repeats some), split by problem.
export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; reports: Report[]; groups: ProblemGroup[] } {
  const merged = all.filter((r) => r.mergedInto === ticket);
  const reports = uniqueById(merged);
  const by = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const count = (rs: Report[], key: (r: Report) => string) =>
    rs.reduce<Record<string, number>>((n, r) => ({ ...n, [key(r)]: (n[key(r)] ?? 0) + 1 }), {});
  const groups = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        taggedAs: count(rs, (r) => r.meta.intakeTag),
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        channels: count(rs, (r) => r.channel),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { rows: merged.length, reports, groups };
}

// How many reports intake tagged with a cause other than the one their tenant gives them.
export function mistagged(g: ProblemGroup): number {
  if (g.problem !== 'parser' && g.problem !== 'hint') return 0;
  return g.reports.length - (g.taggedAs[g.problem] ?? 0);
}
