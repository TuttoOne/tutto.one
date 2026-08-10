/**
 * French article bodies, one file per post, keyed by slug.
 *
 * Posts live in the database, so their text cannot be translated the way page
 * copy is. Rather than adding locale columns and a second editing surface in
 * the admin, the French body is overlaid at render.
 *
 * The markdown is preserved exactly: headings, links, bold, lists and the
 * [VISUAL:...] markers the renderer uses to place diagrams. URLs are never
 * translated — only the link text around them.
 *
 * A post with no entry here falls back to the English body, so publishing a new
 * article cannot leave the French reader with a blank page.
 */
export type PostFr = {
  content: string;
  introCard?: { tagline?: string; headline?: string; sub?: string };
};

import { post as theBestCombination } from "./the-best-combination";
import { post as machineReadableKnowledge } from "./machine-readable-knowledge";
import { post as praxisClosedLoop } from "./praxis-closed-loop";
import { post as glasswingSecurityThreshold } from "./glasswing-security-threshold";
import { post as importantStepsAiJourney } from "./important-steps-ai-journey";
import { post as legalragOnPremiseAi } from "./legalrag-on-premise-ai";
import { post as mcpBridgeSharepoint } from "./mcp-bridge-sharepoint";
import { post as anthropicLaborMarketResearch } from "./anthropic-labor-market-research";

export const POST_FR: Record<string, PostFr> = {
  "the-best-combination": theBestCombination,
  "machine-readable-knowledge": machineReadableKnowledge,
  "praxis-closed-loop": praxisClosedLoop,
  "glasswing-security-threshold": glasswingSecurityThreshold,
  "important-steps-ai-journey": importantStepsAiJourney,
  "legalrag-on-premise-ai": legalragOnPremiseAi,
  "mcp-bridge-sharepoint": mcpBridgeSharepoint,
  "anthropic-labor-market-research": anthropicLaborMarketResearch,
};
