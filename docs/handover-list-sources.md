# Hand-over check: where the rules come from

The hand-over check (`/handover-list`) is the session three tool in Praxis. It takes one job and decides which of five things should happen to it, then lists what it needs to run without you. This file records where each rule comes from, so a consultant can explain or change a verdict in front of a client.

The rules, thresholds and sources all live in data blocks at the top of `client/public/handover-list/app.js` (`SRC`, `CONFIG`, `Q`, `ARCH`, `RULES`, `READY`). The admin view shows the source for every question and every rule that fired.

## How the research was done

Two research passes in September 2026. One covered process selection for plain automation (RPA, integrations, scripts). The other covered when to put a language model at the centre, at the edge or nowhere. It also covered what each needs to run unattended.

The sandbox proxy blocked full-text access to several sources (OpenAI, arXiv, Springer, UiPath docs, Forrester). For those we worked from search summaries. **Check these before quoting them to a client:**

- OpenAI's guide: the three signals for an agent (judgement calls, rules that are hard to keep up, unstructured data) come from search summaries. The tool risk ratings and the two human hand-off triggers are from memory.
- EU AI Act Annex III dates: the high-risk duties were reported as applying from 2 December 2027 after the delay. Confirm the current date.
- Chip Huyen's compounding error example (95% a step gives about 60% over 10 steps) is from memory.
- The Forrester Rule of Five (fewer than 5 decisions, 5 applications, 500 clicks) is from secondary write-ups of a paywalled report.

## The five verdicts

| Verdict | In the tool | When |
|---|---|---|
| NONE | Plain automation | Rules can be written down, input is already fields, path is fixed |
| EDGE | AI reads, rules decide | Messy input with fixed fields out, a growing rulebook or one judgement call inside a fixed process |
| AGENT | AI runs the job | The steps depend on what turns up |
| AUGMENT | AI helps, you decide | Any cap fires (see below) |
| DONT | Leave it for now | Any knock-out fires (banned, leave it manual or fix it first) |

We pick the least complex option that fits. Anthropic ("Building effective agents") and Microsoft (agent orchestration patterns) both say to start with the simplest thing and add a model or an agent only when it clearly does better. Microsoft names "an agent running a path you could have written down" as an anti-pattern. McKinsey's 2025 review of agent projects says the same from the client side.

## Layer 1: architecture

First match wins.

1. Path depends on what turns up, or the input is open-ended, then AGENT. Anthropic, OpenAI, Microsoft.
2. Rules written and stable, input already structured and digital, then NONE. Anthropic, Microsoft, Salesforce.
3. Everything else, then EDGE. OpenAI's signals for when a model pays, and Salesforce's split of each decision into rule-resolvable or judgement-resolvable.

## Layer 2: knock-outs (verdict becomes "Leave it for now")

| Rule | Source | Evidence |
|---|---|---|
| Banned use: emotion recognition at work, social scoring | EU AI Act Art. 5 | Regulation |
| Job or system going away in 6 months | Thoughtworks, "Four bad ways to use RPA" | Practitioner |
| Under 25 hours a year and errors not frequent | van der Aalst's long tail: rare, varied work stays manual. The 25 hours is ours (`CONFIG.minHoursPerYear`) | Academic plus synthesis |
| No owner | McKinsey 2025, practitioner consensus | Analyst |
| No standard way of working, or more than 3 in 10 odd cases | KPMG ESSAR, Hammer 1990, EY. The 30% line is a practitioner rule of thumb | Analyst, practitioner |
| Needs a model but data must stay in-house and none is approved | NIST AI 600-1, GDPR | Regulation |

EY puts early RPA failures at 30 to 50%, mostly down to picking the wrong process. That's the case for the fix-first knock-out.

## Layer 3: caps (verdict drops to "AI helps, you decide")

| Rule | Applies to | Source |
|---|---|---|
| Decides something about a person | All | GDPR Art. 22 and ICO guidance (a rubber stamp is still "solely automated"), AI Act Annex III and Art. 14 |
| Severe worst case and nothing catches errors automatically | All | OpenAI guide, NIST AI 600-1 |
| Only an expert can tell if it's right | EDGE, AGENT | Hamel Husain on evals, Anthropic on agent evals |
| No examples with known answers | EDGE, AGENT | Husain, Huyen |
| Facts it needs are in people's heads | EDGE, AGENT | Synthesis |
| Lethal trifecta: outside content, private data and a way to send out | AGENT | Simon Willison, OWASP LLM06 |
| Owner only part-time | AGENT | McKinsey, HumanLayer 12-factor agents |
| Must reproduce each result exactly | AGENT | AI Act Art. 12, Microsoft |

## Layer 4: conditions

These don't change the verdict. They go on the card as "Must" items: approval before anything that can't be undone (OpenAI, OWASP), keep the model away from sending when the trifecta applies to EDGE (Willison), the Rule of Five warning for screen automation across 5 or more systems (Forrester), budget for screen changes (van der Aalst, Thoughtworks), 50 examples before going unattended (Husain, our number), a data agreement for personal data, a written fallback and a weekly sample check. The sample check is there because models drift: Chen, Zaharia and Zou (2023) measured one task falling from 84% to 51% between two releases three months apart. Anthropic recommends pinning dated model versions in production for the same reason.

## Scores

Value and ease run from 0 to 100 and place the job on a 2 by 2 (quick win, big project, nice to have, not worth it yet). The two-axis idea is common to UiPath Automation Hub (automation potential against ease), Blue Prism (readiness against value) and Leshob et al.'s RRPA method (relevance against feasibility). The weights are ours:

- **Value:** hours a year (up to 60 points, log scale, 2,000 hours tops out), errors today (0, 10 or 20), timing matters (0 or 20).
- **Ease:** 100 minus points for messy or open input, screen-only or paper access, more systems, odd cases, planned change, no standard way, an open path, slow checking and, for AI options, missing examples.

Wanner et al. (ICIS 2019) list the measures most used in the literature: frequency, task duration, standardisation, stability, failure rate, handoffs, data structure and application stability. The questions cover all of them apart from handoffs.

## Where sources disagree

- **Fix first or automate now.** Vendors and Lacity and Willcocks sell RPA as quick and non-invasive. Hammer, KPMG and McKinsey say redesign first. We automate if the process is mostly standard with fewer than 3 in 10 odd cases, and send it to "fix it first" otherwise.
- **Upkeep cost of screen automation.** Estimates run from 15% to over 50% of build cost a year. The high figures mostly come from AI-agent vendors competing with RPA.
- **How solid any of this is.** Syed et al. (2020) call RPA suitability criteria vague, and no criteria set has been validated across many organisations. Treat the thresholds as starting points and tune them in `CONFIG`.
- **Exposure studies.** "GPTs are GPTs" (Eloundou et al.) and McKinsey's generative AI estimates say which tasks a model *could* speed up. They don't say whether it's safe to run a task unattended, so the tool doesn't use them.

## Source list

Plain automation and process selection:
- van der Aalst, Bichler and Heinzl, Robotic Process Automation, BISE 2018: https://link.springer.com/article/10.1007/s12599-018-0542-4
- Wanner et al., Process selection in RPA projects, ICIS 2019: https://aisel.aisnet.org/icis2019/business_models/business_models/6/
- Leshob et al., RRPA, 2024: https://onlinelibrary.wiley.com/doi/10.1002/smr.2709
- Syed et al., Robotic Process Automation: contemporary themes and challenges, 2020: https://www.sciencedirect.com/science/article/abs/pii/S0166361519304609
- Lacity and Willcocks, Telefónica O2 case: https://aisel.aisnet.org/misqe/vol15/iss1/4/
- Forrester, Rule of Five: https://www.forrester.com/report/Use-The-Rule-Of-Five-To-Find-The-Right-RPA-Process/RES144074
- EY, Get ready for robots: https://eyfs.ie/wp-content/uploads/2016/11/ey-get-ready-for-robots.pdf
- KPMG, ESSAR: https://kpmg.com/nl/en/home/insights/2025/07/ai-intelligent-document-automation.html
- Hammer, Don't automate, obliterate, HBR 1990: https://hbr.org/1990/07/reengineering-work-dont-automate-obliterate
- Thoughtworks, Four bad ways to use RPA: https://www.thoughtworks.com/insights/articles/four-bad-ways-use-rpa
- UiPath Automation Hub assessment: https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/information-about-the-detailed-assessment-algorithm
- Blue Prism Process Assessment Tool: https://www.blueprism.com/products/process-assessment-tool/
- Practitioner thresholds (rules of thumb): https://nordflux.de/en/guides/rpa-process-selection-criteria-catalog-for-automatable-processes

Language models and agents:
- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, Demystifying evals for AI agents: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- Anthropic, Model IDs and versions: https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
- OpenAI, A practical guide to building agents: https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
- Microsoft, AI agent orchestration patterns: https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
- Salesforce Architects, agentic vs traditional workflow automation: https://architect.salesforce.com/docs/architect/decision-guides/guide/determining-agentic-vs-traditional-workflow-automation
- McKinsey, One year of agentic AI: https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work
- HumanLayer, 12-Factor Agents: https://github.com/humanlayer/12-factor-agents
- Chip Huyen, Agents: https://huyenchip.com/2025/01/07/agents.html
- Hamel Husain, evals FAQ: https://hamel.dev/blog/posts/evals-faq/
- Chen, Zaharia and Zou, 2023: https://arxiv.org/abs/2307.09009
- Simon Willison, The lethal trifecta: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- OWASP LLM06 Excessive agency: https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html
- Feng, McDonald and Zhang, Levels of autonomy for AI agents: https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1
- Eloundou et al., GPTs are GPTs: https://arxiv.org/abs/2303.10130

Regulation:
- GDPR Art. 22: https://gdpr-info.eu/art-22-gdpr/
- ICO on automated decision-making: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/rights-related-to-automated-decision-making-including-profiling/
- EU AI Act Art. 5, 12 and 14, Annex III: https://artificialintelligenceact.eu/
- NIST AI 600-1: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
