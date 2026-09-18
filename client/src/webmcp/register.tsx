import { useEffect } from "react";
import { registerTools } from "@nekuda/webmcp-sdk";
import { askSite } from "./tools/ask-site";
import { browseOfferings } from "./tools/browse-offerings";
import { browsePraxisCourses } from "./tools/browse-praxis-courses";
import { submitEnquiry } from "./tools/submit-enquiry";
import { bookIntroCall } from "./tools/book-intro-call";

/**
 * Registers Tutto's WebMCP tools for the whole SPA. Mounted once at the app
 * root, so the tools survive client-side navigation. No-ops gracefully in
 * browsers without a WebMCP surface.
 */
export function WebmcpProvider() {
  useEffect(() => {
    const reg = registerTools([
      askSite,
      browseOfferings,
      browsePraxisCourses,
      submitEnquiry,
      bookIntroCall,
    ]);
    return () => reg.unregister();
  }, []);

  return null;
}
