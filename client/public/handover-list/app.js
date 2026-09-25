/* Praxis hand-over check: one job through the questions that decide what AI does with it.
   Plain browser script, no build step. State lives in localStorage only.
   The rules, thresholds and sources are all in the data blocks at the top so they can be
   tuned without touching the logic. Research notes: docs/handover-list-sources.md */

/* ---------- sources ---------- */
/* ev: academic | analyst | vendor | practitioner | regulation | synthesis */
const SRC={
  anthropic_agents:{t:'Anthropic, Building effective agents (2024)',u:'https://www.anthropic.com/engineering/building-effective-agents',ev:'vendor'},
  anthropic_evals:{t:'Anthropic, Demystifying evals for AI agents (2026)',u:'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents',ev:'vendor'},
  anthropic_versions:{t:'Anthropic, Model IDs and versions',u:'https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions',ev:'vendor'},
  openai_guide:{t:'OpenAI, A practical guide to building agents (2025)',u:'https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/',ev:'vendor'},
  ms_orch:{t:'Microsoft, AI agent orchestration patterns',u:'https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns',ev:'vendor'},
  salesforce:{t:'Salesforce Architects, Agentic vs traditional workflow automation',u:'https://architect.salesforce.com/docs/architect/decision-guides/guide/determining-agentic-vs-traditional-workflow-automation',ev:'vendor'},
  mckinsey_agentic:{t:'McKinsey, One year of agentic AI: six lessons (2025)',u:'https://www.mckinsey.com/capabilities/quantumblack/our-insights/one-year-of-agentic-ai-six-lessons-from-the-people-doing-the-work',ev:'analyst'},
  humanlayer:{t:'HumanLayer, 12-Factor Agents',u:'https://github.com/humanlayer/12-factor-agents',ev:'practitioner'},
  huyen:{t:'Chip Huyen, Agents (2025)',u:'https://huyenchip.com/2025/01/07/agents.html',ev:'practitioner'},
  husain:{t:'Hamel Husain, LLM evals FAQ',u:'https://hamel.dev/blog/posts/evals-faq/',ev:'practitioner'},
  chen_drift:{t:'Chen, Zaharia and Zou, How is ChatGPT’s behaviour changing over time? (2023)',u:'https://arxiv.org/abs/2307.09009',ev:'academic'},
  willison:{t:'Simon Willison, The lethal trifecta (2025)',u:'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/',ev:'practitioner'},
  owasp06:{t:'OWASP Top 10 for LLM apps, LLM06 Excessive agency',u:'https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html',ev:'practitioner'},
  vdaalst:{t:'van der Aalst, Bichler and Heinzl, Robotic Process Automation (BISE 2018)',u:'https://link.springer.com/article/10.1007/s12599-018-0542-4',ev:'academic'},
  wanner:{t:'Wanner et al., Process selection in RPA projects (ICIS 2019)',u:'https://aisel.aisnet.org/icis2019/business_models/business_models/6/',ev:'academic'},
  leshob:{t:'Leshob et al., RRPA: relevance and feasibility of RPA candidates (2024)',u:'https://onlinelibrary.wiley.com/doi/10.1002/smr.2709',ev:'academic'},
  forrester5:{t:'Forrester, Use the Rule of Five to find the right RPA process',u:'https://www.forrester.com/report/Use-The-Rule-Of-Five-To-Find-The-Right-RPA-Process/RES144074',ev:'analyst'},
  uipath:{t:'UiPath Automation Hub, detailed assessment',u:'https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/information-about-the-detailed-assessment-algorithm',ev:'vendor'},
  ey:{t:'EY, Get ready for robots (2016)',u:'https://eyfs.ie/wp-content/uploads/2016/11/ey-get-ready-for-robots.pdf',ev:'analyst'},
  essar:{t:'KPMG, Eliminate, Simplify, Standardise, Automate, Robotise',u:'https://kpmg.com/nl/en/home/insights/2025/07/ai-intelligent-document-automation.html',ev:'analyst'},
  hammer:{t:'Hammer, Reengineering work: don’t automate, obliterate (HBR 1990)',u:'https://hbr.org/1990/07/reengineering-work-dont-automate-obliterate',ev:'academic'},
  thoughtworks:{t:'Thoughtworks, Four bad ways to use RPA',u:'https://www.thoughtworks.com/insights/articles/four-bad-ways-use-rpa',ev:'practitioner'},
  practitioner_rpa:{t:'Practitioner RPA selection checklists (thresholds are rules of thumb)',u:'https://nordflux.de/en/guides/rpa-process-selection-criteria-catalog-for-automatable-processes',ev:'practitioner'},
  gdpr22:{t:'GDPR Article 22, automated individual decisions',u:'https://gdpr-info.eu/art-22-gdpr/',ev:'regulation'},
  ico22:{t:'ICO, Rights related to automated decision-making',u:'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/rights-related-to-automated-decision-making-including-profiling/',ev:'regulation'},
  aiact5:{t:'EU AI Act Article 5, prohibited practices',u:'https://artificialintelligenceact.eu/article/5/',ev:'regulation'},
  aiact_annex3:{t:'EU AI Act Annex III, high-risk uses',u:'https://artificialintelligenceact.eu/annex/3/',ev:'regulation'},
  aiact12:{t:'EU AI Act Article 12, record keeping',u:'https://artificialintelligenceact.eu/article/12/',ev:'regulation'},
  aiact14:{t:'EU AI Act Article 14, human oversight',u:'https://artificialintelligenceact.eu/article/14/',ev:'regulation'},
  nist600:{t:'NIST AI 600-1, Generative AI profile (2024)',u:'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',ev:'regulation'},
  tutto:{t:'Tutto synthesis of the sources above',u:'',ev:'synthesis'}
};

/* ---------- tuning ---------- */
const CONFIG={
  minHoursPerYear:25,   /* below this, building and upkeep usually cost more than the job */
  quadrantLine:50,      /* value and feasibility scores run 0 to 100 */
  examplesTarget:50     /* real cases with known right answers before it runs unattended */
};
const PER={day:250,week:52,month:12,year:1};

/* ---------- verdicts ---------- */
const VERDICTS={
  NONE:{name:'Plain automation',short:'Rules do it. No AI needed.',
    lead:'The rules can be written down and the work arrives in a form a system can read, so a script, an integration or screen automation does it more cheaply and more predictably than a model.'},
  EDGE:{name:'AI reads, rules decide',short:'AI fills in the fields, your rules do the rest.',
    lead:'A model does the one thing rules are bad at, reading messy input or making one judgement call, and hands back fixed fields. Your rules and systems take it from there and do anything that matters.'},
  AGENT:{name:'AI runs the job',short:'An AI agent works through it, with you signing off the big steps.',
    lead:'The steps change from case to case, so the model plans and uses tools to get the job done. You set the limits and it asks before anything risky. You watch the results.'},
  AUGMENT:{name:'AI helps, you decide',short:'AI drafts or checks. A person makes the call.',
    lead:'AI can speed the work up, but something about this job means a person has to own each result. AI prepares and a person decides. Every decision you make becomes an example for later.'},
  DONT:{name:'Leave it for now',short:'Don’t automate this yet.',
    lead:'Something has to change before this job is worth handing over.'}
};
const DONT_KIND={
  ban:{name:'Don’t build it',lead:'This use is banned in the EU. No amount of checking makes it allowed.'},
  skip:{name:'Leave it manual',lead:'It isn’t worth building. Look at it again if the volume grows or the systems change.'},
  fix:{name:'Fix it first',lead:'There is something to sort out first. Once it’s done, run this check again.'}
};
const RANK={NONE:1,EDGE:2,AGENT:3};

/* ---------- questions ---------- */
/* o: [value, label, detail]. why and src show in the admin view. */
const Q={
  'value.errors':{label:'How often does it go wrong today?',o:[['rare','Hardly ever',''],['some','Now and then','A few in every hundred come back for fixing'],['often','Often','Fixing mistakes is part of the job']],
    why:'Errors today add to the value of automating. A high error rate counts in its favour.',src:['ey','uipath']},
  'value.sla':{label:'Does timing matter?',o:[['no','Whenever is fine',''],['yes','Late costs us','A customer waits or a deadline slips']],
    why:'Turnaround time adds value, and it also raises the stakes if the automation stops.',src:['uipath']},
  'how.rules':{label:'Could you write the rules down?',o:[['written','Yes, and they rarely change','Someone new could follow them from a page'],['sprawling','Yes, but there are loads','They keep growing and get patched all the time'],['judgement','No, it takes judgement','You weigh things up each time']],
    why:'Rules you can write down point to plain automation. A rulebook that keeps growing, or real judgement, is where a model starts to pay.',src:['openai_guide','salesforce','wanner']},
  'how.input':{label:'What does the work arrive as?',o:[['structured','Fields in a system','A form, a spreadsheet, an export or an API'],['messy','Emails, PDFs or scans','But you pull out the same few things each time'],['open','Open requests','Each one needs reading around, research or pulling sources together']],
    why:'Structured input needs no model. Messy input with fixed fields out is the classic place for a model at the edge. Open-ended work needs one at the centre.',src:['openai_guide','uipath','wanner']},
  'how.path':{label:'Are the steps the same every time?',o:[['fixed','Same steps every time',''],['branches','A few known routes','For example refund, exchange or pass it on'],['open','Depends on what turns up','You can’t list the steps in advance']],
    why:'If you can draw the path in advance, a workflow is simpler and more predictable. Agents are for paths you can’t fix ahead of time.',src:['anthropic_agents','ms_orch']},
  'how.systems':{label:'How many systems does it touch?',o:[['one','1',''],['few','2 to 4',''],['many','5 or more','']],
    why:'Forrester’s Rule of Five: past 5 applications, screen automation gets fragile and an integration project fits better.',src:['forrester5','wanner']},
  'how.access':{label:'How do you get into those systems?',o:[['api','Through an API or an export',''],['ui','Only through the screen','Someone clicks through it'],['paper','Paper or phone calls','Nothing digital to start from']],
    why:'An API is cheaper to automate and to keep running. Screen automation breaks when the screens change. Paper needs a capture step before anything else.',src:['vdaalst','forrester5','wanner']},
  'how.standard':{label:'Does everyone do it the same way?',o:[['yes','Yes, one way',''],['mostly','Mostly','A few personal habits'],['no','No','Everyone has their own way']],
    why:'Automating a process with no standard way of working automates the mess. Eliminate, simplify and standardise first.',src:['essar','hammer','wanner']},
  'how.exceptions':{label:'How many cases are odd ones?',o:[['low','Fewer than 1 in 10',''],['mid','Up to 3 in 10',''],['high','More than 3 in 10','']],
    why:'Every odd case needs a route. Practitioners put the limit at about 3 in 10 before you should simplify the process first. That number is a rule of thumb.',src:['practitioner_rpa','ey','wanner']},
  'how.change':{label:'What happens to this job in the next 6 months?',o:[['stable','It stays as it is',''],['changing','We’re changing how it works',''],['retiring','The job or the system is going away','']],
    why:'A process about to change breaks what you build. One being retired is not worth building for.',src:['thoughtworks','wanner']},
  'risk.worst':{label:'If one comes out wrong, what’s the worst that happens?',o:[['trivial','Minor','We fix it internally and move on'],['moderate','It costs money or annoys a customer',''],['severe','Serious','Legal trouble, safety, big money or the press']],
    why:'The cost of one wrong result decides how much a person has to stay involved.',src:['openai_guide','nist600']},
  'risk.catch':{label:'How quickly can you spot a wrong one?',o:[['auto','A system catches it','It doesn’t reconcile, a check fails, a total is off'],['quick','A person can tell in a minute',''],['expert','Only an expert, slowly','Or not until much later']],
    why:'If a wrong answer is cheap to catch, you can let it run. If only an expert can tell, the expert is doing the work anyway.',src:['husain','anthropic_evals']},
  'risk.undo':{label:'Can the result be undone?',o:[['yes','Easily',''],['effort','With some effort',''],['no','No','A payment goes out, an email is sent, something is deleted']],
    why:'Steps that can’t be undone get a person’s approval.',src:['openai_guide','owasp06']},
  'risk.people':{label:'Does it decide something about a person?',o:[['no','No',''],['yes','Yes','Hiring, pay, credit, access, performance, ending a contract'],['banned','It reads staff emotions or scores people socially','']],
    why:'Decisions with legal or similar effects on a person need a person who can change them (GDPR Art. 22). Employment and credit uses are high-risk under the EU AI Act. Emotion recognition at work and social scoring are banned.',src:['gdpr22','ico22','aiact_annex3','aiact5']},
  'risk.explain':{label:'Do you have to show exactly why each result came out the way it did?',o:[['none','No',''],['rationale','A reason and a record are enough',''],['exact','Yes, exactly and every time','An auditor or regulator checks it']],
    why:'Exact reproducibility means the decision itself stays in rules. A model can read the input, and you log what it read.',src:['aiact12','ms_orch']},
  'data.kind':{label:'What sort of data is in it?',o:[['internal','Public or internal only',''],['personal','Personal or confidential','And we have an approved AI supplier for it'],['locked','It must stay in-house','And we have no approved model yet']],
    why:'Data rules decide which models you can use at all.',src:['nist600','gdpr22']},
  'data.fresh':{label:'Does it rely on facts that change often?',o:[['no','No',''],['system','Yes, and they’re kept in a system','A price list, policy pages, stock levels'],['scattered','Yes, and they’re in people’s heads','']],
    why:'A model can look up facts it can reach. Facts that live in people’s heads have to be written down first.',src:['tutto']},
  'run.owner':{label:'Who looks after it once it’s live?',o:[['yes','A named person, with time set aside',''],['part','Someone, when they get a minute',''],['none','Nobody yet','']],
    why:'Anything that runs without you needs someone who watches it, clears what it can’t do and owns changes.',src:['mckinsey_agentic','humanlayer']},
  'run.examples':{label:'Do you have real examples with the right answer?',o:[['yes',`Yes, ${CONFIG.examplesTarget} or more`,''],['some','A handful',''],['no','No, and people disagree on what right looks like','']],
    why:'You test an AI step against real cases with known answers. No examples means no way to know if it works or if an update broke it.',src:['husain','anthropic_evals']},
  'run.fallback':{label:'If it stopped tomorrow, what would you do?',o:[['yes','Go back to the manual way','It’s written down'],['partial','We’d manage','But it isn’t written down'],['no','We’d be stuck','']],
    why:'A written manual fallback is what makes switching it off safe.',src:['tutto']},
  'run.monitor':{label:'Would you know if it started getting things wrong?',o:[['yes','Yes, we’d see it in the numbers',''],['some','Eventually','When someone complains'],['no','Probably not','']],
    why:'Models change under you. One study saw accuracy on a task fall from 84% to 51% between two releases three months apart.',src:['chen_drift','anthropic_versions']}
};
const FLAGS={
  'data.untrusted':{label:'It reads content from outside the business',small:'Emails, web pages, uploaded files'},
  'data.private':{label:'It can see private or customer data',small:''},
  'data.outbound':{label:'It can send, post or pay outside the business',small:''}
};

const STEPS=[
  {id:'job',title:'The job',qs:[]},
  {id:'value',title:'Is it worth it',qs:['value.errors','value.sla']},
  {id:'how',title:'How it works today',qs:['how.rules','how.input','how.path','how.systems','how.access','how.standard','how.exceptions','how.change']},
  {id:'risk',title:'What goes wrong',qs:['risk.worst','risk.catch','risk.undo','risk.people','risk.explain']},
  {id:'data',title:'Data and safety',qs:['data.kind','data.fresh']},
  {id:'run',title:'Running without you',qs:['run.owner','run.examples','run.fallback','run.monitor']},
  {id:'card',title:'Your hand-over card',qs:[]}
];
const ALL_Q=STEPS.flatMap(s=>s.qs);

/* ---------- rules ---------- */
/* Architecture: first match wins. The least complex option that fits. */
const ARCH=[
  {id:'arch_agent',to:'AGENT',when:s=>s.how.path==='open'||s.how.input==='open',
    text:()=>'The steps depend on what turns up, so nobody can fix the path in advance. That’s the case agents are for.',src:['anthropic_agents','openai_guide','ms_orch']},
  {id:'arch_none',to:'NONE',when:s=>s.how.rules==='written'&&s.how.input==='structured'&&s.how.access!=='paper',
    text:()=>'The rules can be written down and the work already arrives as fields, so plain automation does it cheaper and gives the same answer every time.',src:['anthropic_agents','ms_orch','salesforce']},
  {id:'arch_edge',to:'EDGE',when:()=>true,
    text:s=>s.how.input==='messy'||s.how.access==='paper'?'The work arrives as emails, PDFs or scans. A model reads each one into the same few fields and your rules take it from there.'
      :s.how.rules==='sprawling'?'The rulebook keeps growing. A model reading each case copes with that better, while your process stays fixed around it.'
      :'It takes a judgement call, but the steps are fixed, so the model makes one call inside a set process.',src:['openai_guide','salesforce','anthropic_agents']}
];
const usesAI=a=>a==='EDGE'||a==='AGENT';
const trifecta=s=>s.data.untrusted&&s.data.private&&s.data.outbound;
/* layer: knock (verdict becomes DONT), cap (verdict becomes AUGMENT), cond (a condition on the verdict). */
const RULES=[
  {id:'ko_banned',layer:'knock',kind:'ban',when:s=>s.risk.people==='banned',
    text:()=>'Reading staff emotions or scoring people socially is banned under the EU AI Act.',src:['aiact5']},
  {id:'ko_retiring',layer:'knock',kind:'skip',when:s=>s.how.change==='retiring',
    text:()=>'The job or the system is going away. Anything you build now gets switched off with it.',src:['thoughtworks']},
  {id:'ko_small',layer:'knock',kind:'skip',when:(s,c)=>c.hours>0&&c.hours<CONFIG.minHoursPerYear&&s.value.errors!=='often',
    text:(s,c)=>`At about ${fmtHours(c.hours)} a year, building it and looking after it costs more than it saves.`,src:['vdaalst','tutto']},
  {id:'ko_owner',layer:'knock',kind:'fix',when:s=>s.run.owner==='none',
    text:()=>'Nobody looks after it. Name an owner before anything runs on its own.',src:['mckinsey_agentic','tutto']},
  {id:'ko_mess',layer:'knock',kind:'fix',when:s=>s.how.standard==='no'||s.how.exceptions==='high',
    text:s=>s.how.standard==='no'?'Everyone does it their own way. Agree one way first or you automate the mess.':'More than 3 in 10 cases are odd ones. Simplify the process first or the odd cases swamp whatever you build.',src:['essar','hammer','ey','practitioner_rpa']},
  {id:'ko_data',layer:'knock',kind:'fix',when:(s,c)=>usesAI(c.arch)&&s.data.kind==='locked',
    text:()=>'This needs a model, but the data has to stay in-house and there’s no approved one. Get a model approved first, self-hosted or under a data agreement.',src:['nist600','gdpr22']},

  {id:'cap_people',layer:'cap',when:s=>s.risk.people==='yes',
    text:()=>'It decides something about a person. A person has to make that call and be able to change it. A rubber stamp doesn’t count.',src:['gdpr22','ico22','aiact_annex3','aiact14']},
  {id:'cap_severe',layer:'cap',when:s=>s.risk.worst==='severe'&&s.risk.catch!=='auto',
    text:()=>'A wrong one could be serious and nothing catches it automatically.',src:['openai_guide','nist600']},
  {id:'cap_expert',layer:'cap',when:(s,c)=>usesAI(c.arch)&&s.risk.catch==='expert',
    text:()=>'Only an expert can tell if the AI got it right, so the expert has to check every one anyway.',src:['husain','anthropic_evals']},
  {id:'cap_examples',layer:'cap',when:(s,c)=>usesAI(c.arch)&&s.run.examples==='no',
    text:()=>'There are no examples of the right answer, so there’s no way to test it. Start with AI helping and keep every decision as an example.',src:['husain','huyen']},
  {id:'cap_fresh',layer:'cap',when:(s,c)=>usesAI(c.arch)&&s.data.fresh==='scattered',
    text:()=>'The facts it needs are in people’s heads, so the AI can’t look them up.',src:['tutto']},
  {id:'cap_trifecta',layer:'cap',when:(s,c)=>c.arch==='AGENT'&&trifecta(s),
    text:()=>'It reads outside content, can see private data and can send things out. With all three, one hidden instruction in an email can leak your data. Take one of the three away.',src:['willison','owasp06']},
  {id:'cap_owner_part',layer:'cap',when:(s,c)=>c.arch==='AGENT'&&s.run.owner==='part',
    text:()=>'An agent needs someone watching it with time set aside. Part-time care works for simpler set-ups only.',src:['mckinsey_agentic','humanlayer']},
  {id:'cap_exact',layer:'cap',when:(s,c)=>c.arch==='AGENT'&&s.risk.explain==='exact',
    text:()=>'An agent can take a different path each run, so you can’t reproduce each result exactly.',src:['aiact12','ms_orch']},

  {id:'c_undo',layer:'cond',when:(s,c)=>usesAI(c.verdict)&&s.risk.undo==='no',
    text:()=>'A person approves the step that can’t be undone: the payment, the send, the delete.',src:['openai_guide','owasp06']},
  {id:'c_moderate',layer:'cond',when:(s,c)=>c.verdict==='AGENT'&&s.risk.worst==='moderate',
    text:()=>'It asks before anything that costs money or goes to a customer.',src:['openai_guide']},
  {id:'c_trifecta_edge',layer:'cond',when:(s,c)=>c.verdict==='EDGE'&&trifecta(s),
    text:()=>'Keep the model away from sending anything. It reads and fills in fields, your rules do the sending.',src:['willison','owasp06']},
  {id:'c_many',layer:'cond',when:(s,c)=>c.verdict==='NONE'&&s.how.systems==='many',
    text:()=>'Five or more systems is past the usual limit for screen automation. Look at an integration first.',src:['forrester5']},
  {id:'c_ui',layer:'cond',when:(s,c)=>c.verdict==='NONE'&&s.how.access==='ui',
    text:()=>'Screen automation works here, but budget time to fix it every time a screen changes.',src:['vdaalst','thoughtworks']},
  {id:'c_paper',layer:'cond',when:(s,c)=>c.verdict!=='DONT'&&s.how.access==='paper',
    text:()=>'Get it into a digital form first: a scan, a form or a shared inbox.',src:['wanner']},
  {id:'c_some_examples',layer:'cond',when:(s,c)=>usesAI(c.verdict)&&s.run.examples==='some',
    text:()=>`Collect ${CONFIG.examplesTarget} real cases with the right answer before it runs on its own.`,src:['husain','tutto']},
  {id:'c_personal',layer:'cond',when:(s,c)=>(usesAI(c.verdict)||c.verdict==='AUGMENT')&&s.data.kind==='personal',
    text:()=>'Check the supplier’s data agreement covers this data.',src:['gdpr22','nist600']},
  {id:'c_fallback',layer:'cond',when:(s,c)=>c.verdict!=='DONT'&&c.verdict!=='AUGMENT'&&s.run.fallback!=='yes'&&s.run.fallback!=='',
    text:()=>'Write down the manual way before it runs on its own.',src:['tutto']},
  {id:'c_monitor',layer:'cond',when:(s,c)=>c.verdict!=='DONT'&&(s.run.monitor==='some'||s.run.monitor==='no'),
    text:()=>'Check a sample every week so a drop in quality shows up before a customer notices.',src:['chen_drift','anthropic_versions']},
  {id:'c_change',layer:'cond',when:(s,c)=>c.verdict!=='DONT'&&s.how.change==='changing',
    text:()=>'Wait until the new way of working has settled, then build.',src:['wanner','thoughtworks']}
];

/* ---------- run-without-you checklist ---------- */
const READY=[
  {for:['NONE','EDGE','AGENT'],t:'An owner and a one-page runbook',d:'What it does, who to call and how to switch it off.',src:['mckinsey_agentic']},
  {for:['NONE','EDGE','AGENT'],t:'Nothing disappears',d:'Anything it can’t handle lands in a queue a person clears.',src:['tutto']},
  {for:['NONE','EDGE','AGENT'],t:'A written fallback',d:'The manual way, written down, so you can switch it off any day.',src:['tutto']},
  {for:['NONE'],t:'Tested on real past cases',d:'Run last month’s cases through it and compare with what people did.',src:['tutto']},
  {for:['NONE'],t:'An alert when it fails',d:'A failed run or an odd volume sends someone a message.',src:['tutto']},
  {for:['NONE','EDGE','AGENT'],t:'Only the access it needs',d:'Its own account, with rights to what this job touches and nothing else.',src:['owasp06']},
  {for:['EDGE','AGENT'],t:`${CONFIG.examplesTarget} or more real examples with the right answer`,d:'And a pass mark agreed with the owner before it goes live, for example 98 in 100 totals right.',src:['husain','anthropic_evals']},
  {for:['EDGE'],t:'Every answer checked against the fields',d:'Anything missing, malformed or low-confidence goes to a person.',src:['openai_guide']},
  {for:['EDGE'],t:'The model can’t act',d:'It reads and fills in fields. Your rules and systems do the sending, paying and updating.',src:['owasp06','humanlayer']},
  {for:['EDGE','AGENT'],t:'A fixed model version',d:'Use a dated model version, keep the prompts under version control and re-run the examples before any upgrade.',src:['anthropic_versions','chen_drift']},
  {for:['EDGE','AGENT'],t:'A weekly sample check',d:'Someone looks at a handful of results every week and logs what they find.',src:['chen_drift']},
  {for:['EDGE','AGENT'],t:'A record of every run',d:'What went in, what came out and which model version did it.',src:['aiact12']},
  {for:['AGENT'],t:'Tests graded on the end result',d:'Check the refund exists or the ticket is closed. What the agent says it did doesn\u2019t count.',src:['anthropic_evals']},
  {for:['AGENT'],t:'Approval gates',d:'It stops and asks before anything that can’t be undone or costs money.',src:['openai_guide','owasp06']},
  {for:['AGENT'],t:'Limits and an off switch',d:'A cap on steps and spend per run, and one switch that stops it.',src:['humanlayer','nist600']},
  {for:['AGENT'],t:'A safe place to try it',d:'A test copy of your systems, so its first mistakes cost nothing.',src:['anthropic_agents']},
  {for:['AUGMENT'],t:'A named person decides',d:'They can change or overrule the AI, and they do it often enough that it shows.',src:['aiact14','ico22']},
  {for:['AUGMENT'],t:'Keep the AI’s draft next to the final decision',d:'Those pairs become the examples that tell you if it can do more later.',src:['husain']},
  {for:['AUGMENT'],t:'Watch for rubber-stamping',d:'If people never change the AI’s draft, check they are still reading it.',src:['aiact14']},
  {for:['DONT:fix'],t:'Sort the process out',d:'Map the steps, drop what isn’t needed, agree one way of doing it, then run this check again.',src:['essar','hammer']},
  {for:['DONT:skip'],t:'Leave it manual',d:'Look again if the volume grows, the error rate climbs or the system changes.',src:['vdaalst']},
  {for:['DONT:ban'],t:'Don’t build it',d:'Talk to whoever handles legal before anyone goes further.',src:['aiact5']}
];

/* ---------- helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const num=v=>{if(v===''||v==null)return NaN;const s=String(v).replace(/[^0-9.\-]/g,'');return s===''?NaN:parseFloat(s);};
const getPath=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
function setPath(o,p,v){const ks=p.split('.');let a=o;for(let i=0;i<ks.length-1;i++)a=a[ks[i]];a[ks[ks.length-1]]=v;}
const fmtHours=h=>h>=100?`${(Math.round(h/10)*10).toLocaleString('en-GB')} hours`:`${Math.round(h)} hour${Math.round(h)===1?'':'s'}`;
const today=()=>new Date().toISOString().slice(0,10);
const fmtDate=d=>{const t=new Date(d+'T00:00:00');return isNaN(t)?d:t.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});};
const slug=s=>(s||'job').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'job';
const srcLinks=ids=>ids.map(id=>{const x=SRC[id];return x.u?`<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t)}</a><span class="ev">${x.ev}</span>`:`${esc(x.t)}<span class="ev">${x.ev}</span>`;}).join(' · ');

/* ---------- state ---------- */
function blank(){
  return {sample:false,
    job:{name:'',team:'',owner:'',inputs:'',output:'',rules:'',check:''},
    value:{volume:'',per:'month',minutes:'',errors:'',sla:''},
    how:{rules:'',input:'',path:'',systems:'',access:'',standard:'',exceptions:'',change:''},
    risk:{worst:'',catch:'',undo:'',people:'',explain:''},
    data:{kind:'',fresh:'',untrusted:false,private:false,outbound:false},
    run:{owner:'',examples:'',fallback:'',monitor:''}};
}
const EXAMPLES={
  invoice:{label:'Example: supplier invoice intake',
    job:{name:'Supplier invoice intake',team:'Finance',owner:'Accounts payable lead',inputs:'Supplier invoices arriving as PDFs in the invoices inbox',output:'A draft bill in the accounting system, matched to its purchase order',rules:'Match supplier, PO number and total. Anything over the PO by more than 2% goes to the lead.',check:'The bill reconciles against the PO before it is approved for payment'},
    value:{volume:'400',per:'month',minutes:'6',errors:'some',sla:'yes'},
    how:{rules:'written',input:'messy',path:'fixed',systems:'few',access:'api',standard:'yes',exceptions:'low',change:'stable'},
    risk:{worst:'moderate',catch:'auto',undo:'effort',people:'no',explain:'rationale'},
    data:{kind:'personal',fresh:'no',untrusted:true,private:true,outbound:false},
    run:{owner:'yes',examples:'yes',fallback:'yes',monitor:'some'}},
  report:{label:'Example: weekly sales report',
    job:{name:'Weekly sales report',team:'Sales operations',owner:'Sales ops manager',inputs:'CRM export and the finance booking sheet',output:'A one-page summary sent to the leadership team every Monday',rules:'Same tables and the same five numbers every week',check:'Totals match the finance system'},
    value:{volume:'1',per:'week',minutes:'90',errors:'some',sla:'yes'},
    how:{rules:'written',input:'structured',path:'fixed',systems:'few',access:'api',standard:'yes',exceptions:'low',change:'stable'},
    risk:{worst:'trivial',catch:'auto',undo:'yes',people:'no',explain:'none'},
    data:{kind:'internal',fresh:'no',untrusted:false,private:true,outbound:false},
    run:{owner:'yes',examples:'yes',fallback:'yes',monitor:'yes'}},
  support:{label:'Example: support inbox triage',
    job:{name:'Support inbox triage',team:'Customer support',owner:'Support team lead',inputs:'Customer emails to the support inbox',output:'Each email tagged, routed to the right queue and a draft reply attached',rules:'Refund, exchange, delivery question or pass to a person. The returns policy decides which.',check:'The agent picking up the ticket confirms the tag and the draft'},
    value:{volume:'60',per:'day',minutes:'4',errors:'some',sla:'yes'},
    how:{rules:'sprawling',input:'messy',path:'branches',systems:'few',access:'api',standard:'mostly',exceptions:'mid',change:'stable'},
    risk:{worst:'moderate',catch:'quick',undo:'no',people:'no',explain:'rationale'},
    data:{kind:'personal',fresh:'system',untrusted:true,private:true,outbound:true},
    run:{owner:'yes',examples:'some',fallback:'yes',monitor:'some'}},
  screening:{label:'Example: CV screening',
    job:{name:'First-round CV screening',team:'People',owner:'Talent partner',inputs:'CVs and cover letters from the careers page',output:'A shortlist for the hiring manager',rules:'Must-have skills from the job ad, right to work, notice period',check:'The hiring manager reads the shortlist'},
    value:{volume:'200',per:'month',minutes:'8',errors:'some',sla:'no'},
    how:{rules:'judgement',input:'messy',path:'fixed',systems:'one',access:'api',standard:'mostly',exceptions:'low',change:'stable'},
    risk:{worst:'severe',catch:'quick',undo:'effort',people:'yes',explain:'rationale'},
    data:{kind:'personal',fresh:'no',untrusted:true,private:true,outbound:false},
    run:{owner:'yes',examples:'some',fallback:'yes',monitor:'some'}},
  contract:{label:'Example: contract review',
    job:{name:'Customer contract review',team:'Legal',owner:'Head of legal',inputs:'Customer-paper contracts sent in by sales',output:'A marked-up contract with the risky clauses flagged',rules:'Our playbook, plus whatever the deal needs',check:'A lawyer signs off every contract'},
    value:{volume:'30',per:'month',minutes:'45',errors:'rare',sla:'yes'},
    how:{rules:'judgement',input:'open',path:'open',systems:'few',access:'api',standard:'mostly',exceptions:'mid',change:'stable'},
    risk:{worst:'severe',catch:'expert',undo:'effort',people:'no',explain:'rationale'},
    data:{kind:'personal',fresh:'scattered',untrusted:true,private:true,outbound:false},
    run:{owner:'yes',examples:'some',fallback:'yes',monitor:'some'}}
};
function example(k){const e=clone(EXAMPLES[k]);delete e.label;return Object.assign(blank(),e,{sample:true});}

/* ---------- assessment ---------- */
function assess(s){
  const vol=num(s.value.volume),min=num(s.value.minutes);
  const hours=isFinite(vol)&&isFinite(min)?vol*(PER[s.value.per]||12)*min/60:0;
  const answered=ALL_Q.filter(p=>getPath(s,p)!=='').length;
  const archReady=['how.rules','how.input','how.path'].every(p=>getPath(s,p)!=='');
  const c={hours,answered,total:ALL_Q.length,archReady,arch:null,archRule:null,verdict:null,kind:null};
  if(archReady){const r=ARCH.find(r=>r.when(s));c.arch=r.to;c.archRule=r;}
  const fired=l=>RULES.filter(r=>r.layer===l&&r.when(s,c));
  c.knock=fired('knock');
  c.caps=c.arch?fired('cap'):[];
  if(c.knock.length){c.verdict='DONT';c.kind=(['ban','skip','fix'].find(k=>c.knock.some(r=>r.kind===k)));}
  else if(c.caps.length)c.verdict='AUGMENT';
  else c.verdict=c.arch;
  c.conds=c.verdict?fired('cond'):[];
  /* reasons, most decisive first */
  c.reasons=[];
  if(c.verdict==='DONT')c.knock.forEach(r=>c.reasons.push({text:r.text(s,c),src:r.src,id:r.id}));
  else{
    if(c.verdict==='AUGMENT')c.caps.forEach(r=>c.reasons.push({text:r.text(s,c),src:r.src,id:r.id}));
    if(c.archRule)c.reasons.push({text:c.archRule.text(s,c),src:c.archRule.src,id:c.archRule.id});
    if(hours>0)c.reasons.push({text:`It takes about ${fmtHours(hours)} a year today.`,src:['uipath'],id:'hours'});
  }
  Object.assign(c,scores(s,c));
  return c;
}
/* Value and feasibility, 0 to 100, loosely after UiPath Automation Hub and Leshob’s relevance and feasibility split. */
function scores(s,c){
  const hp=c.hours>0?Math.min(60,60*Math.log10(1+c.hours)/Math.log10(1+2000)):0;
  const value=Math.round(hp+({rare:0,some:10,often:20}[s.value.errors]||0)+({no:0,yes:20}[s.value.sla]||0));
  const minus={
    'how.input':{messy:10,open:20},'how.access':{ui:15,paper:25},'how.systems':{few:5,many:20},
    'how.exceptions':{mid:10,high:25},'how.change':{changing:15,retiring:30},'how.standard':{mostly:5,no:20},
    'how.path':{branches:5,open:15},'risk.catch':{quick:5,expert:20}
  };
  if(usesAI(c.arch))minus['run.examples']={some:5,no:15};
  const feasTrace=[];let feas=100;
  Object.entries(minus).forEach(([p,m])=>{const d=m[getPath(s,p)]||0;if(d){feas-=d;feasTrace.push([p,d]);}});
  feas=Math.max(0,feas);
  const L=CONFIG.quadrantLine;
  const quad=value>=L&&feas>=L?'quick':value>=L?'big':feas>=L?'nice':'low';
  return {value,feas,quad,feasTrace,valueParts:{hours:Math.round(hp),errors:({rare:0,some:10,often:20}[s.value.errors]||0),sla:({no:0,yes:20}[s.value.sla]||0)}};
}
const QUAD={quick:['Quick win','Worth a lot and straightforward to build.'],big:['Big project','Worth a lot, but it takes real work. Plan it properly.'],
  nice:['Nice to have','Easy to build, but it won’t save much. Do it if you have time.'],low:['Not worth it yet','Low value and hard to build.']};
function checklist(c){
  const key=c.verdict==='DONT'?'DONT:'+c.kind:c.verdict;
  return READY.filter(r=>r.for.includes(key));
}

/* ---------- field builders ---------- */
const pid=p=>'f-'+p.replace(/\./g,'-');
function inp(p,label,o={}){const v=getPath(S,p)??'';return `<div class="field ${o.cls||''}"><label for="${pid(p)}">${label}</label><input id="${pid(p)}" type="${o.type||'text'}" ${o.mode?`inputmode="${o.mode}"`:''} data-bind="${p}" value="${esc(v)}" placeholder="${esc(o.ph||'')}">${o.hint?`<div class="hint">${o.hint}</div>`:''}</div>`;}
function ta(p,label,o={}){const v=getPath(S,p)??'';return `<div class="field ${o.cls||''}"><label for="${pid(p)}">${label}</label><textarea id="${pid(p)}" rows="${o.rows||2}" data-bind="${p}" placeholder="${esc(o.ph||'')}">${esc(v)}</textarea>${o.hint?`<div class="hint">${o.hint}</div>`:''}</div>`;}
function sel(p,label,opts){const v=getPath(S,p)??'';return `<div class="field"><label for="${pid(p)}">${label}</label><select id="${pid(p)}" data-bind="${p}">${opts.map(([k,l])=>`<option value="${esc(k)}"${String(k)===String(v)?' selected':''}>${esc(l)}</option>`).join('')}</select></div>`;}
function cbx(p){const f=FLAGS[p];return `<label class="cbx" for="${pid(p)}"><input type="checkbox" id="${pid(p)}" data-bind="${p}"${getPath(S,p)?' checked':''}><span>${f.label}${f.small?`<small>${f.small}</small>`:''}</span></label>`;}
function choice(p){
  const q=Q[p],v=getPath(S,p);
  return `<div class="q" id="q-${pid(p)}"><h3 id="l-${pid(p)}">${q.label}</h3>
    ${view==='admin'?`<p class="qhint">${esc(q.why)}<br><span class="src">${srcLinks(q.src)}</span></p>`:''}
    <div class="opts" role="group" aria-labelledby="l-${pid(p)}">${q.o.map(([k,l,d])=>`<button class="opt" data-act="pick" data-path="${p}" data-val="${k}" aria-pressed="${v===k}"><b>${esc(l)}</b>${d?`<span>${esc(d)}</span>`:''}</button>`).join('')}</div></div>`;
}
const tip=h=>`<p class="tip">${h}</p>`;

/* ---------- steps ---------- */
const E={};
E.job=()=>`
  <h2>The job</h2>
  <p class="lead">Pick one job your team does again and again. Describe it the way you’d explain it to someone covering for you.</p>
  <div class="grid2">
    ${inp('job.name','What’s the job called?',{ph:'e.g. Supplier invoice intake'})}
    ${inp('job.team','Which team does it?',{ph:'e.g. Finance'})}
    ${inp('job.owner','Who owns it today?',{ph:'e.g. Accounts payable lead',hint:'The person who’d answer for it if it went wrong.'})}
    ${ta('job.inputs','What comes in?',{cls:'wide',ph:'e.g. Supplier invoices arriving as PDFs in the invoices inbox'})}
    ${ta('job.output','What goes out when it’s done?',{cls:'wide',ph:'e.g. A draft bill in the accounting system, matched to its purchase order'})}
    ${ta('job.rules','What rules does it follow?',{cls:'wide',ph:'e.g. Match supplier, PO number and total. Anything over the PO by more than 2% goes to the lead.',hint:'The ones you’d tell a new starter. If you can’t write them down, say so.'})}
    ${ta('job.check','How do you check it at the end?',{cls:'wide',ph:'e.g. The bill reconciles against the PO before it is approved'})}
  </div>`;
E.value=()=>{
  const c=last;
  return `<h2>Is it worth it</h2>
  <p class="lead">Rough numbers are fine. We use them to work out how much time this job takes each year.</p>
  <div class="grid4" style="margin-bottom:var(--space-6)">
    ${inp('value.volume','How many?',{mode:'decimal',ph:'e.g. 400'})}
    ${sel('value.per','Per',[['day','working day'],['week','week'],['month','month'],['year','year']])}
    ${inp('value.minutes','Minutes each',{mode:'decimal',ph:'e.g. 6',hint:'Hands-on time, including checking.'})}
  </div>
  <div class="calc" id="calc">${calcHtml(c)}</div>
  ${choice('value.errors')}${choice('value.sla')}`;
};
const calcHtml=c=>c.hours>0?`<b>${fmtHours(c.hours)}</b><span>a year, about ${Math.round(c.hours/1650*10)/10} of a full-time person</span>`:'<span>Fill in how many and how long to see the hours a year.</span>';
E.how=()=>`<h2>How it works today</h2>
  <p class="lead">These answers decide what kind of automation fits, from plain rules to an AI agent.</p>
  ${tip('Answer for the job as it is now, including the messy parts.')}
  ${STEPS[2].qs.map(choice).join('')}`;
E.risk=()=>`<h2>What goes wrong</h2>
  <p class="lead">What happens when it gets one wrong decides how much a person stays involved.</p>
  ${STEPS[3].qs.map(choice).join('')}`;
E.data=()=>`<h2>Data and safety</h2>
  <p class="lead">What the job can see and what it can do outside the business.</p>
  ${choice('data.kind')}
  <div class="q"><h3>Tick all that apply</h3>
    ${view==='admin'?`<p class="qhint">All three together is the lethal trifecta: a hidden instruction in outside content can make an AI leak private data. Remove one of the three.<br><span class="src">${srcLinks(['willison','owasp06'])}</span></p>`:''}
    <div class="list">${Object.keys(FLAGS).map(cbx).join('')}</div></div>
  ${choice('data.fresh')}`;
E.run=()=>`<h2>Running without you</h2>
  <p class="lead">Anything that runs on its own needs someone who looks after it and a way to tell when it slips.</p>
  ${STEPS[5].qs.map(choice).join('')}`;
E.card=()=>{
  const c=last;
  const missing=STEPS.filter(st=>st.qs.some(p=>getPath(S,p)===''));
  if(!c.verdict)return `<h2>Your hand-over card</h2><p class="lead">A few answers are still missing. The card fills in once you’ve said how the job works today.</p>
    <ul class="todo">${missing.map(st=>`<li><button data-act="goto" data-step="${STEPS.indexOf(st)}"><span class="mk"></span><span>${st.title}</span></button></li>`).join('')}</ul>`;
  const tabs=[['card','Hand-over card'],['checklist','Checklist'],...(view==='admin'?[['evidence','Evidence']]:[])];
  if(!tabs.some(t=>t[0]===cardTab))cardTab='card';
  const bar={card:'Share it with the job’s owner, or keep it with your hand-over list.',checklist:'Work through it before the job runs without you.',evidence:'Every rule we checked, what fired and where each one comes from.'}[cardTab];
  return `<h2>Your hand-over card</h2>
  <p class="lead">Two things to take away: a card that says what happens to this job and why, and the checklist to work through before it runs without you.</p>
  ${missing.length?tip(`Still unanswered: ${missing.map(st=>st.title.toLowerCase()).join(', ')}. The card may change when you fill them in.`):''}
  <div class="download"><div><h3>Download your hand-over card</h3><p>One PDF: the card, the checklist${view==='admin'?' and the evidence behind the verdict':''}.</p></div><button class="btn btn-primary" data-act="download">Download PDF</button></div>
  <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button role="tab" aria-selected="${cardTab===k}" data-act="cardtab" data-tab="${k}">${l}</button>`).join('')}</div>
  <div class="out-bar"><p>${bar}</p><div class="btns"><button class="btn btn-primary btn-sm" data-act="copy">Copy</button></div></div>
  <div class="paper" id="print-area">${cardTab==='card'?cardHtml(c):cardTab==='checklist'?checklistHtml(c):evidenceHtml(c)}</div>
  <div class="out-bar"><p>Save your answers to come back to this job later, or to keep one file per job.</p><div class="btns"><button class="btn btn-ghost btn-sm" data-act="export">Save answers</button><button class="btn btn-ghost btn-sm" data-act="import">Load answers</button></div></div>`;
};
const vName=c=>c.verdict==='DONT'?DONT_KIND[c.kind].name:VERDICTS[c.verdict].name;
const vLead=c=>c.verdict==='DONT'?DONT_KIND[c.kind].lead:VERDICTS[c.verdict].lead;
const head=(n,l)=>`<div class="section-head"><span class="num">${String(n).padStart(2,'0')}</span><span class="label">${l}</span><span class="rule"></span></div>`;
const srcLine=ids=>view==='admin'?`<span class="src">${srcLinks(ids)}</span>`:'';
const dashList=items=>items.length?`<ul class="dash">${items.map(([t,src])=>`<li>${esc(t)}${src?srcLine(src):''}</li>`).join('')}</ul>`:'<p class="text-muted">None yet.</p>';
const docHead=kind=>`<header class="doc-header"><span class="brand">Tutto<span class="dot">.</span></span><span class="meta">${kind} · ${esc(fmtDate(today()))}</span></header>
  <span class="eyebrow">${kind}${S.sample?' · example':''}</span><h2 class="brief-title">${esc(S.job.name||'Unnamed job')}</h2>`;
const docFoot=`<footer class="doc-footer"><span>Praxis · Hand-over check</span><span>Session three</span></footer>`;
const orNA=v=>v?esc(v):'<span class="text-muted">Not filled in yet</span>';
function cardHtml(c){
  const J=S.job,Qd=QUAD[c.quad];let n=0;
  return `${docHead('Hand-over card')}
  <div class="callout verdict-call ${c.verdict==='DONT'?'v-dont':c.verdict==='AUGMENT'?'v-augment':''}"><p class="v-name">${esc(vName(c))}</p><p>${esc(vLead(c))}</p></div>
  <div class="facts">
    <div><b>Team</b>${orNA(J.team)}</div><div><b>Owner</b>${orNA(J.owner)}</div>
    <div><b>What comes in</b>${orNA(J.inputs)}</div><div><b>What goes out</b>${orNA(J.output)}</div>
  </div>
  ${head(++n,'Why')}${dashList(c.reasons.slice(0,view==='admin'?9:3).map(r=>[r.text,r.src]))}
  ${c.conds.length?`${head(++n,'On these conditions')}${dashList(c.conds.map(r=>[r.text(S,c),r.src]))}`:''}
  ${head(++n,'Worth it against effort')}
  <div class="matrix">${matrixSvg(c)}<div>
    <p><strong>${Qd[0]}.</strong> ${Qd[1]}</p>
    ${bar('Value',c.value)}${bar('Ease',c.feas)}
    ${c.hours>0?`<p class="text-muted" style="font-size:var(--text-sm);margin-top:var(--space-3)">About ${fmtHours(c.hours)} a year today.</p>`:''}</div></div>
  ${head(++n,'How it runs')}
  <p><strong>The rules.</strong> ${orNA(J.rules)}</p>
  <p><strong>The check at the end.</strong> ${orNA(J.check)}</p>
  <p class="text-muted" style="font-size:var(--text-sm)">What it needs before it runs without you is on the Checklist tab.</p>
  ${docFoot}`;
}
const bar=(l,v)=>`<div class="scorebar"><span>${l}</span><i><b style="width:${v}%"></b></i><span>${v}</span></div>`;
function matrixSvg(c){
  const P=20,W=220,x=P+c.feas/100*W,y=P+(1-c.value/100)*W,h=W/2,L=CONFIG.quadrantLine/100*W;
  const hi=q=>c.quad===q?' hi':'';
  return `<svg viewBox="0 0 260 270" role="img" aria-label="Value ${c.value} out of 100, ease ${c.feas} out of 100: ${QUAD[c.quad][0]}">
    <rect class="box${hi('big')}" x="${P}" y="${P}" width="${L}" height="${W-L}"/><rect class="box${hi('quick')}" x="${P+L}" y="${P}" width="${W-L}" height="${W-L}"/>
    <rect class="box${hi('low')}" x="${P}" y="${P+W-L}" width="${L}" height="${L}"/><rect class="box${hi('nice')}" x="${P+L}" y="${P+W-L}" width="${W-L}" height="${L}"/>
    <line class="ax" x1="${P+L}" y1="${P}" x2="${P+L}" y2="${P+W}"/><line class="ax" x1="${P}" y1="${P+W-L}" x2="${P+W}" y2="${P+W-L}"/>
    <text class="ql" x="${P+6}" y="${P+16}">Big project</text><text class="ql" x="${P+W-6}" y="${P+16}" text-anchor="end">Quick win</text>
    <text class="ql" x="${P+6}" y="${P+W-8}">Not worth it</text><text class="ql" x="${P+W-6}" y="${P+W-8}" text-anchor="end">Nice to have</text>
    <text x="${P}" y="${P+W+18}">Harder</text><text x="${P+W}" y="${P+W+18}" text-anchor="end">Easier</text>
    <text x="10" y="${P+h}" transform="rotate(-90 10 ${P+h})" text-anchor="middle">Value</text>
    <circle class="dot" cx="${x}" cy="${y}" r="8"/></svg>`;
}
const checkList=items=>`<ul class="checklist">${items.map(([t,d,src])=>`<li><div><b>${esc(t)}</b>${d?`<span>${esc(d)}</span>`:''}${src?srcLine(src):''}</div></li>`).join('')}</ul>`;
function checklistHtml(c){
  let n=0;
  return `${docHead('Checklist')}
  <p class="lead">${c.verdict==='DONT'?'What to do instead.':`Before it runs without you. Verdict: ${esc(vName(c))}.`}</p>
  ${c.conds.length?`${head(++n,'From your answers')}${checkList(c.conds.map(r=>[r.text(S,c),'',r.src]))}`:''}
  ${head(++n,c.verdict==='DONT'?'Next step':'For every job like this')}${checkList(checklist(c).map(r=>[r.t,r.d,r.src]))}
  ${docFoot}`;
}
function evidenceHtml(c){
  const fired=new Set([...c.knock,...c.caps,...c.conds].map(r=>r.id));
  const eff=r=>r.layer==='knock'?`Leave it for now (${DONT_KIND[r.kind].name.toLowerCase()})`:r.layer==='cap'?'Drops to AI helps, you decide':'Condition';
  const row=(state,cls,id,effect,why,src)=>`<tr><td><span class="pill ${cls}">${state}</span></td><td><code>${id}</code></td><td>${effect}</td><td>${why?esc(why):''}<div class="src">${srcLinks(src)}</div></td></tr>`;
  const used=new Set([...ARCH,...RULES,...READY].flatMap(r=>r.src).concat(ALL_Q.flatMap(p=>Q[p].src)));
  return `${docHead('Evidence')}
  <p class="lead">Architecture: ${c.arch?`<strong>${esc(VERDICTS[c.arch].name)}</strong>`:'not decided yet'}. ${c.knock.length?`${c.knock.length} knock-out${c.knock.length>1?'s':''}, so the verdict is <strong>${esc(vName(c))}</strong>.`:c.caps.length?`${c.caps.length} cap${c.caps.length>1?'s':''}, so the verdict drops to <strong>${esc(VERDICTS.AUGMENT.name)}</strong>.`:'No knock-outs or caps.'} We pick the least complex option that fits.</p>
  <p class="src">${srcLinks(['anthropic_agents','ms_orch'])}</p>
  ${head(1,'Every rule we checked')}
  <div class="tablewrap"><table><thead><tr><th></th><th>Rule</th><th>Effect</th><th>Why</th></tr></thead><tbody>
  ${ARCH.map(r=>row(r===c.archRule?'Chosen':'Skipped',r===c.archRule?'warn':'good',r.id,`Architecture: ${esc(VERDICTS[r.to].name)}`,r===c.archRule?r.text(S,c):'',r.src)).join('')}
  ${RULES.map(r=>{const on=fired.has(r.id);return row(on?'Fired':'Clear',on?(r.layer==='knock'?'bad':'warn'):'good',r.id,eff(r),on?r.text(S,c):'',r.src);}).join('')}</tbody></table></div>
  ${head(2,'Scores')}
  <p>Value ${c.value}: hours a year ${c.valueParts.hours} of 60 (log scale, 2,000 hours tops out), errors today ${c.valueParts.errors} of 20, timing ${c.valueParts.sla} of 20.</p>
  <p>Ease ${c.feas}: 100 minus ${c.feasTrace.length?c.feasTrace.map(([p,d])=>`${d} for ${Q[p].label.toLowerCase().replace(/\?$/,'')}`).join(', '):'nothing'}.</p>
  <p>The line between quadrants is ${CONFIG.quadrantLine}. The weights are ours, loosely after these two.</p>
  <p class="src">${srcLinks(['uipath','leshob'])}</p>
  ${head(3,'Sources')}
  <ul class="dash">${Object.keys(SRC).filter(k=>used.has(k)).map(k=>`<li>${srcLinks([k])}</li>`).join('')}</ul>
  <p class="text-muted" style="font-size:var(--text-sm)">Vendor guides sell the thing they describe, so weigh them with that in mind. Practitioner thresholds are rules of thumb, and the settings at the top of the script let you change them.</p>
  ${docFoot}`;
}
/* ---------- text export ---------- */
function toText(c){
  const J=S.job,L=[];
  L.push(`HAND-OVER CARD: ${J.name||'This job'}`,`${J.team?J.team+'. ':''}Owner: ${J.owner||'not named'}. ${fmtDate(today())}`,'');
  L.push(`Verdict: ${vName(c)}`,vLead(c),'','Why:');
  c.reasons.forEach(r=>L.push(`- ${r.text}`));
  if(c.conds.length){L.push('','On these conditions:');c.conds.forEach(r=>L.push(`- ${r.text(S,c)}`));}
  L.push('',`Worth it against effort: ${QUAD[c.quad][0]} (value ${c.value}, ease ${c.feas}).${c.hours>0?` About ${fmtHours(c.hours)} a year today.`:''}`);
  L.push('','What comes in: '+(J.inputs||'-'),'What goes out: '+(J.output||'-'),'The rules: '+(J.rules||'-'),'The check at the end: '+(J.check||'-'));
  L.push('','Checklist:');checklist(c).forEach(r=>L.push(`[ ] ${r.t}. ${r.d}`));
  if(view==='admin'){L.push('','Sources:');[...new Set([...c.reasons,...c.conds].flatMap(r=>r.src))].forEach(k=>L.push(`- ${SRC[k].t}${SRC[k].u?' '+SRC[k].u:''}`));}
  L.push('','Praxis · Hand-over check · tutto.one');
  return L.join('\n');
}

/* ---------- PDF ---------- */
const PDF_LIBS=['https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js','https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.4/dist/jspdf.plugin.autotable.min.js'];
const loadScript=src=>new Promise((ok,fail)=>{if($(`script[src="${src}"]`))return ok();const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>fail(new Error(src));document.head.appendChild(s);});
async function loadPdfLibs(){for(const src of PDF_LIBS)await loadScript(src);return window.jspdf.jsPDF;}
/* The built-in PDF fonts cover Latin-1 only, so typographic punctuation is flattened. */
const pdfText=v=>String(v??'').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[–—]/g,'-').replace(/…/g,'...').replace(/[^\n\x20-\xff]/g,'');
function buildPdf(jsPDF,c){
  const doc=new jsPDF({unit:'pt',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),M=48,CW=W-2*M;
  const INK=[31,31,31],MUTED=[107,114,128],AMBER=[219,116,0],RULE=[226,228,233];
  let y=M;
  const need=h=>{if(y+h>H-M){doc.addPage();y=M;}};
  const masthead=kind=>{
    doc.setFont('helvetica','bold');doc.setFontSize(13);doc.setTextColor(...INK);doc.text('Tutto',M,M);
    doc.setTextColor(...AMBER);doc.text('.',M+doc.getTextWidth('Tutto'),M);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...MUTED);doc.text(pdfText(kind),W-M,M,{align:'right'});
    doc.setDrawColor(...RULE);doc.setLineWidth(.75);doc.line(M,M+10,W-M,M+10);y=M+44;
  };
  const eyebrow=t=>{doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...AMBER);doc.text(pdfText(t).toUpperCase(),M,y);y+=24;};
  const title=t=>{doc.setFont('helvetica','bold');doc.setFontSize(24);doc.setTextColor(...INK);const L=doc.splitTextToSize(pdfText(t),CW);doc.text(L,M,y);y+=L.length*28;};
  const para=(t,o={})=>{if(!t)return;doc.setFont('helvetica',o.bold?'bold':'normal');doc.setFontSize(o.size||10.5);doc.setTextColor(...(o.muted?MUTED:INK));
    const L=doc.splitTextToSize(pdfText(t),CW),lh=(o.size||10.5)*1.45;need(L.length*lh);doc.text(L,M,y);y+=L.length*lh+(o.after??8);};
  const section=(n,l)=>{need(46);y+=14;doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...MUTED);doc.text(n,M,y);
    doc.setTextColor(...INK);doc.text(pdfText(l).toUpperCase(),M+22,y);const x=M+30+doc.getTextWidth(pdfText(l).toUpperCase());doc.setDrawColor(...RULE);doc.line(x,y-3,W-M,y-3);y+=18;};
  const bullets=(a,mark='-')=>{a.forEach(x=>{const L=doc.splitTextToSize(pdfText(x),CW-16),lh=15.2;need(L.length*lh);
    doc.setFont('helvetica','normal');doc.setFontSize(10.5);doc.setTextColor(...AMBER);doc.text(mark,M,y);doc.setTextColor(...INK);doc.text(L,M+16,y);y+=L.length*lh+3;});y+=5;};
  const table=(head,body,opts={})=>{need(60);doc.autoTable(Object.assign({startY:y,head:[head.map(pdfText)],body:body.map(r=>r.map(pdfText)),
    margin:{left:M,right:M},theme:'grid',styles:{font:'helvetica',fontSize:9,textColor:INK,lineColor:RULE,lineWidth:.5,cellPadding:6,valign:'top'},
    headStyles:{fillColor:[245,243,238],textColor:INK,fontStyle:'bold'}},opts));y=doc.lastAutoTable.finalY+16;};
  const J=S.job;

  masthead(`Hand-over card · ${fmtDate(today())}`);eyebrow(J.name||'This job');title(vName(c));
  para(vLead(c),{size:12,after:12});
  table(['Team','Owner','Worth it against effort','Time a year'],[[J.team||'-',J.owner||'-',`${QUAD[c.quad][0]} (value ${c.value}, ease ${c.feas})`,c.hours>0?fmtHours(c.hours):'-']],{theme:'plain',headStyles:{textColor:MUTED,fontSize:7.5,fontStyle:'bold'}});
  section('01','Why');bullets(c.reasons.map(r=>r.text));
  if(c.conds.length){section('02','On these conditions');bullets(c.conds.map(r=>r.text(S,c)));}
  section(c.conds.length?'03':'02','What it needs to run without you');
  table(['',''],[['What comes in',J.inputs||'-'],['What goes out',J.output||'-'],['The rules',J.rules||'-'],['The check at the end',J.check||'-']],{showHead:false,columnStyles:{0:{cellWidth:130,fontStyle:'bold'}}});

  doc.addPage();masthead('Checklist');eyebrow('Before it runs without you');title(J.name||'This job');
  if(c.conds.length){section('01','From your answers');bullets(c.conds.map(r=>r.text(S,c)),'[ ]');}
  section(c.conds.length?'02':'01',c.verdict==='DONT'?'Next step':'For every job like this');bullets(checklist(c).map(r=>`${r.t}. ${r.d}`),'[ ]');

  if(view==='admin'){
    doc.addPage();masthead('Evidence');eyebrow('How the verdict was reached');title(vName(c));
    const fired=[...c.knock,...c.caps,...c.conds];
    table(['Rule','Effect','Sources'],[...(c.archRule?[[c.archRule.id,`Architecture: ${VERDICTS[c.arch].name}`,c.archRule.src.map(k=>SRC[k].t).join('; ')]]:[]),
      ...fired.map(r=>[r.id,r.layer==='knock'?'Knock-out':r.layer==='cap'?'Cap':'Condition',r.src.map(k=>SRC[k].t).join('; ')])],{columnStyles:{0:{cellWidth:100},1:{cellWidth:120}}});
    para(`Value ${c.value}: hours ${c.valueParts.hours}/60, errors ${c.valueParts.errors}/20, timing ${c.valueParts.sla}/20. Ease ${c.feas}: 100 minus ${c.feasTrace.map(([p,d])=>d).join(' + ')||'0'}.`,{muted:true});
    section('·','Sources');bullets([...new Set([c.archRule,...fired].filter(Boolean).flatMap(r=>r.src))].map(k=>`${SRC[k].t} (${SRC[k].ev})${SRC[k].u?' '+SRC[k].u:''}`));
  }
  const n=doc.getNumberOfPages();
  for(let i=1;i<=n;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...MUTED);
    doc.text('Praxis · Hand-over check · tutto.one',M,H-24);doc.text(`${i} / ${n}`,W-M,H-24,{align:'right'});}
  return doc;
}
async function downloadPdf(btn){
  btn.disabled=true;const was=btn.textContent;btn.textContent='Preparing…';
  try{const jsPDF=await loadPdfLibs();buildPdf(jsPDF,last).save(`${slug(S.job.name)}-handover.pdf`);toast('Card downloaded.');}
  catch(e){console.error(e);toast('The download didn’t work. Check your connection and try again, or use Copy as text.');}
  finally{btn.disabled=false;btn.textContent=was;}
}

/* ---------- app ---------- */
const KEY='praxis-handover-list-v1';
let S,cur=0,view='employee',cardTab='card',last=null,undoState=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify({S,cur,view,cardTab}))}catch(e){}}
function restore(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&d.S&&d.S.how)return d;}catch(e){}return null;}
function merge(d){const b=blank();Object.keys(b).forEach(k=>{if(typeof b[k]==='object'&&d&&typeof d[k]==='object')Object.assign(b[k],d[k]);else if(d&&k in d)b[k]=d[k];});return b;}

function renderHero(){
  $('#hero').innerHTML=view==='employee'
    ?`<span class="eyebrow">Session three · Your hand-over list</span><h1>One job at a time.<br><em>Decide what AI takes over.</em></h1><p class="lead">Six short steps about one job your team does again and again. You finish with a hand-over card that says what does the job and why, plus what to tick off before it runs on its own.</p>${S.sample?`<div class="admin-banner"><span class="tag tag-primary">Example</span><span>You are looking at a worked example. Change anything, or choose a blank job from “Start from”.</span></div>`:''}`
    :`<span class="eyebrow">Admin view</span><h1>The same check.<br><em>With the working shown.</em></h1><p class="lead">Every question shows why it’s asked and where that comes from. The card shows every rule that fired, the scores and the sources.</p>`;
  $('#ex-select').innerHTML=`<option value="">Choose…</option>`+Object.entries(EXAMPLES).map(([k,e])=>`<option value="${k}">${esc(e.label)}</option>`).join('')+'<option value="blank">A blank job</option>';
  $$('.seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
function stepDone(st){return st.id==='job'?!!S.job.name.trim():st.id==='value'?last.hours>0&&st.qs.every(p=>getPath(S,p)!==''):st.qs.length?st.qs.every(p=>getPath(S,p)!==''):false;}
function renderNav(){
  $('#nav').innerHTML=STEPS.map((st,i)=>`<li><button data-act="goto" data-step="${i}"${i===cur?' aria-current="step"':''}><span class="num">${String(i+1).padStart(2,'0')}</span><span class="t">${st.title}</span>${st.id==='card'?'':`<span class="ok${stepDone(st)?' on':''}" title="${stepDone(st)?'Done':'Still to do'}"></span>`}</button></li>`).join('');
}
const STEP_TODO={job:'Name the job and say what comes in',value:'Rough numbers for how many and how long',how:'Say how it works today',risk:'Say what happens when it goes wrong',data:'Say what data it touches',run:'Say who looks after it'};
function renderAside(){
  const c=last,todo=STEPS.filter(st=>STEP_TODO[st.id]),done=todo.filter(stepDone).length;
  const gates=[...c.knock.map(r=>['block','Stops it',r]),...c.caps.map(r=>['warn','Keeps a person in',r]),...(view==='admin'?c.conds.map(r=>['','Condition',r]):[])];
  $('#aside').innerHTML=`<div class="card"><span class="eyebrow">Verdict so far</span>
    <div class="strength"><b>${c.verdict?esc(vName(c)):'Not yet'}</b><span>${done} of ${todo.length}</span></div>
    <div class="meter" style="grid-template-columns:repeat(${todo.length},1fr)">${todo.map(st=>`<i class="${stepDone(st)?'on':''}"></i>`).join('')}</div>
    <ul class="todo">${todo.map(st=>`<li><button class="${stepDone(st)?'done':''}" data-act="goto" data-step="${STEPS.indexOf(st)}"><span class="mk"></span><span>${STEP_TODO[st.id]}</span></button></li>`).join('')}</ul></div>
    ${gates.length?`<div class="card"><h3>What shapes the verdict</h3><ul class="todo issues">${gates.map(([k,l,r])=>`<li><button data-act="goto" data-step="${STEPS.length-1}"><span class="mk ${k}"></span><span>${esc(r.text(S,c))}<em>${l}</em></span></button></li>`).join('')}</ul></div>`:''}
    ${view==='admin'&&c.arch?`<div class="card"><h3>Scores</h3>${bar('Value',c.value)}${bar('Ease',c.feas)}<p class="src" style="margin:6px 0 0">${QUAD[c.quad][0]}. Architecture before caps: ${esc(VERDICTS[c.arch].name)}.</p></div>`:''}`;
}
function renderPanel(){
  const st=STEPS[cur];
  $('#panel').innerHTML=E[st.id]()+`<div class="panel-foot">${cur>0?`<button class="btn btn-ghost" data-act="prev">Back: ${STEPS[cur-1].title}</button>`:'<span></span>'}${cur<STEPS.length-1?`<button class="btn btn-primary" data-act="next">Next: ${STEPS[cur+1].title}</button>`:''}</div>`;
}
function updateLive(){last=assess(S);renderNav();renderAside();const k=$('#calc');if(k)k.innerHTML=calcHtml(last);save();}
function render(){last=assess(S);renderHero();renderPanel();renderNav();renderAside();save();}
const smooth=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function go(i){cur=Math.max(0,Math.min(STEPS.length-1,i));render();$('#layout').scrollIntoView({block:'start',behavior:smooth()});}
function toast(msg,undo){const t=$('#toast');t.innerHTML=`<span>${esc(msg)}</span>${undo?'<button data-act="undo">Undo</button>':''}`;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>{t.hidden=true},undo?7000:2600);}
function loadState(next,msg){undoState={S:clone(S),cur};S=next;cur=0;render();toast(msg,true);}
async function copyText(txt,label){
  let ok=false;try{await navigator.clipboard.writeText(txt);ok=true;}catch(e){
    try{const t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();ok=document.execCommand('copy');t.remove();}catch(e2){}}
  toast(ok?`Copied ${label}.`:'Your browser blocked copying here. Select the text and copy it by hand.');
}
function exportJson(){
  const blob=new Blob([JSON.stringify({tool:'praxis-handover-list',version:1,saved:today(),answers:S},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${slug(S.job.name)}-handover.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

/* ---------- events ---------- */
document.addEventListener('input',e=>{
  const t=e.target,p=t.dataset&&t.dataset.bind;if(!p)return;
  setPath(S,p,t.type==='checkbox'?t.checked:t.value);
  if(S.sample&&p.startsWith('job.')){S.sample=false;renderHero();}
  updateLive();
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='ex-select'){const v=t.value;t.value='';if(!v)return;
    loadState(v==='blank'?blank():example(v),v==='blank'?'Started a blank job.':'Loaded the example. Replace anything with your own.');return;}
  if(t.id==='import-file'){const f=t.files&&t.files[0];t.value='';if(!f)return;
    f.text().then(txt=>{const d=JSON.parse(txt);if(!d||!d.answers||!d.answers.how)throw new Error('shape');loadState(merge(d.answers),'Loaded your saved answers.');})
      .catch(()=>toast('That file isn’t a saved hand-over check.'));return;}
  if(t.dataset&&t.dataset.bind){setPath(S,t.dataset.bind,t.type==='checkbox'?t.checked:t.value);updateLive();}
});
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='view'){view=b.dataset.view;render();}
  else if(a==='goto')go(+b.dataset.step);
  else if(a==='next')go(cur+1);
  else if(a==='prev')go(cur-1);
  else if(a==='pick'){const p=b.dataset.path,v=b.dataset.val;setPath(S,p,getPath(S,p)===v?'':v);
    $$(`.opt[data-path="${p}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.val===getPath(S,p))));updateLive();}
  else if(a==='cardtab'){cardTab=b.dataset.tab;renderPanel();save();}
  else if(a==='download')downloadPdf(b);
  else if(a==='copy')copyText(cardTab==='card'?toText(last):($('#print-area')?.innerText||''),({card:'the card',checklist:'the checklist',evidence:'the evidence'})[cardTab]);
  else if(a==='export')exportJson();
  else if(a==='import')$('#import-file').click();
  else if(a==='undo'&&undoState){S=undoState.S;cur=undoState.cur;undoState=null;render();$('#toast').hidden=true;}
});

/* ---------- boot ---------- */
(function boot(){
  const d=restore();
  if(d){S=merge(d.S);cur=Math.min(d.cur||0,STEPS.length-1);view=d.view==='admin'?'admin':'employee';cardTab=d.cardTab||'card';}
  else S=example('invoice');
  render();
})();
