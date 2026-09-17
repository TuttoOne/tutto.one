import { defineTool } from "@nekuda/webmcp-sdk";
import { SITE_OFFERINGS } from "../site-index";

export const browseOfferings = defineTool({
  stableKey: "tutto.browse_offerings",
  name: "browse_offerings",
  title: "Browse Tutto's services and programmes",
  description:
    "List Tutto's services and programmes — Praxis client training, the Praxis trainer track, Pythia, LegalRAG, the GTM Orchestrator and the second-brain approach — with a one-line summary and the page path for each. Use this first when a visitor asks what Tutto offers or which programme fits them, then use ask_site for detail on one of them. Returns a list of offerings with name, summary and path.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute() {
    const offerings = SITE_OFFERINGS.filter((o) => o.path !== "/about" && o.path !== "/blog").map(
      ({ name, summary, path }) => ({ name, summary, path }),
    );
    if (offerings.length === 0) {
      throw new Error("browse_offerings found no offerings in the site index");
    }
    return {
      offerings,
      note: "Use ask_site for detail on any of these, or book_intro_call to talk it through with Daniel.",
    };
  },
});
