// The live split of a ticket, built from the ticket export and the desk notes. Components share it.
import reports from '#lib/data/reports-4471.json';
import notes from '#lib/data/desk-notes.json';
import type { Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';
import { splitTicket } from '#lib/kb/problems';

export const split = (ticket: number) => splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove);
