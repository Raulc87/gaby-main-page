// Screening-based routing after a successful save (US-023 AC4, AC5;
// UX_UI_DIRECTION.md section 6.4). Pure decision only: the screens and the
// scheduler are rendered elsewhere. Qualified visitors get the thank-you and
// the scheduler; everyone else gets the not-ready screen, without a scheduler.
import type { ScreeningAnswerCode } from './types';

export type LeadRoute = 'qualified' | 'not_ready';

const ROUTE_BY_ANSWER: Record<ScreeningAnswerCode, LeadRoute> = {
  ready_to_invest: 'qualified',
  needs_investment_info: 'qualified',
  no_capacity_now: 'not_ready',
  exploring: 'not_ready',
};

export function routeForScreeningAnswer(answer: ScreeningAnswerCode): LeadRoute {
  return ROUTE_BY_ANSWER[answer];
}
