// Build-time configuration of the calculator (docs/specs/PROJECT_SPEC.md FR-034).
import { parseCrcPerUsd } from './currency';

/** Colones per US dollar: `PUBLIC_CRC_PER_USD`, default 500. */
export const CRC_PER_USD: number = parseCrcPerUsd(import.meta.env.PUBLIC_CRC_PER_USD);
