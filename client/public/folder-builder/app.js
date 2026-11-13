/* Praxis Folder Builder: six questions build the rules an AI reads every time, laid out the way
   each AI keeps them (Claude, ChatGPT, Mistral, Copilot, Gemini), plus a scorecard and a first message.
   Work stays in localStorage (praxis-data.js applies the data policy). A colleague link carries the
   answers in the URL fragment, which browsers never send to the server.
   The AI-assistant version of this tool is praxis-folder-builder.md: keep the two in step. */
(function(){
"use strict";
var KEY="praxis-folder-builder-v2";
var BOOK="https://cal.com/tuttoone/30min";
var JSZIP="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";

var JOBS={
  report:{ic:"chart",label:"The monthly client report",sub:"Numbers in, a report out",slug:"monthly-client-report",out:"the monthly client report",inputs:["xlsx","pdf"],check:["Totals add up","Click three totals","Each one is a formula and matches the source"]},
  proposal:{ic:"quote",label:"Quotes and proposals",sub:"A brief in, a priced proposal out",slug:"proposals",out:"the proposal",inputs:["email","notes"],check:["Prices are ours","Compare every price with the price list","All match, none made up"]},
  minutes:{ic:"people",label:"Meeting notes into actions",sub:"Notes in, who does what by when",slug:"meeting-actions",out:"the action list",inputs:["notes","docx"],check:["Every action has an owner","Read down the action list","Each one has a name and a date"]},
  invoices:{ic:"receipt",label:"Supplier invoices into a sheet",sub:"PDFs and photos in, one tidy sheet",slug:"supplier-invoices",out:"the invoice sheet",inputs:["pdf","photo"],check:["Net plus VAT equals gross","Check every row","Every row adds up, odd ones flagged"]},
  letters:{ic:"mail",label:"Client letters and emails",sub:"Their question in, your answer out",slug:"client-letters",out:"the client letter",inputs:["email","docx"],check:["Answers what they asked","Put it next to their email","Every question has an answer"]},
  pack:{ic:"layers",label:"The board or management pack",sub:"Updates in, one pack to decide from",slug:"board-pack",out:"the board pack",inputs:["xlsx","docx"],check:["Decision first","Read the first line of each section","Each starts with what needs deciding"]}
};
var READERS={
  client:{ic:"person",label:"A client",sub:"It goes out under my name",who:"a client",strict:true},
  board:{ic:"people",label:"The board or a partner",sub:"Senior people, short on time",who:"the board",strict:true},
  regulator:{ic:"shield",label:"A regulator or auditor",sub:"Every line has to stand up",who:"a regulator or auditor",strict:true},
  team:{ic:"people",label:"My team",sub:"Good enough to act on",who:"my team",strict:false},
  me:{ic:"pen",label:"Just me",sub:"A first draft I finish",who:"me, as a first draft",strict:false}
};
var INPUTS={pdf:["PDFs","file"],xlsx:["Spreadsheets","grid"],email:["Emails","mail"],docx:["Word documents","doc"],notes:["My own notes","pen"],photo:["Photos of paper","camera"]};
var FIXES={
  long:{ic:"long",label:"It's far too long",rule:"Keep it short. Summary first, three sentences at most. Detail only if I ask.",check:["Short","Count the summary","Three sentences or fewer"]},
  ai:{ic:"spark",label:"It sounds like AI",rule:"Write like our past pieces in examples/. No 'I hope this finds you well', no filler openings, no big words where small ones work.",check:["Sounds like us","Read the first paragraph aloud","You'd send it without rewording"]},
  facts:{ic:"hash",label:"It makes things up",rule:"Every number and fact says the file and page it came from. If it isn't in the sources, write [NOT IN SOURCE]. Never fill the gap.",check:null},
  point:{ic:"target",label:"It misses the point",rule:"Start with the answer or the decision. Background comes after, if at all.",check:["Answer first","Read the first sentence","It's the answer and not background"]},
  format:{ic:"layout",label:"The layout is wrong every time",rule:"Follow the template in templates/ exactly: same headings, same order, same styles.",check:["Our format","Put it next to a past one","Same headings, same order"]},
  guess:{ic:"question",label:"It guesses instead of asking",rule:"If you're not sure, write [CHECK] and carry on. Ask me before you assume anything about a client.",check:null}
};
var FIRM={long:"Hard limit: if the summary runs past three sentences, cut it before you show me.",ai:"Before you hand it back, reread it against examples/ and rewrite any sentence we'd never say.",facts:"Check every number against its page before you hand it back. List the ones you couldn't check.",point:"The first sentence must contain the answer. If it doesn't, start again.",format:"Open the template and compare heading by heading before you hand it back.",guess:"Stop and ask before any assumption about a client, a price or a date."};

var AIS={
  claude:{mono:"C",label:"Claude",setups:["claude-project","claude-skill","claude-folder"]},
  chatgpt:{mono:"G",label:"ChatGPT",setups:["gpt-project","gpt-custom","codex"]},
  mistral:{mono:"M",label:"Mistral",sub:"Vibe, once Le Chat",setups:["vibe-folder","mistral-agent","paste"]},
  copilot:{mono:"CP",label:"Microsoft Copilot",setups:["copilot-agent","paste"]},
  gemini:{mono:"GM",label:"Gemini",setups:["gemini-skill","gemini-gem"]},
  unsure:{mono:"?",label:"Not sure yet",setups:["paste"]}
};
var FOLDER={score:"SCORECARD.md",ex:"examples/",tpl:"templates/",src:"in sources/",save:"Never write over anything in sources/. Save drafts in output/.",head:"Read this before every piece of work in this folder."};
var PROJ={score:"the SCORECARD file",ex:"the project files",tpl:"the project files",src:"which I attach",save:"Never change my files. Give me the draft in the chat, ready to paste.",head:"Follow this for every piece of work."};
var KNOW={score:"the SCORECARD file in your knowledge",ex:"your knowledge files",tpl:"your knowledge files",src:"which I attach",save:"Never change my files. Give me the draft in the chat, ready to paste.",head:"Follow this for every piece of work."};
var SKILL={score:"SCORECARD.md in this skill",ex:"examples/ in this skill",tpl:"templates/ in this skill",src:"which I attach",save:"Never change my files. Give me the draft ready to paste.",head:"Use this skill whenever I ask for this job."};

var STEPS=["intro","job","reader","inputs","fixes","voice","ai","build","result","loop"];
var Q_STEPS=["job","reader","inputs","fixes","voice","ai"];
var ANSWERS=["job","jobOther","reader","readerOther","inputs","inputsOther","fixes","ownFix","spelling","length","we","ownVoice","ai","aiOther","setup","extra","removed"];

function fresh(){return{step:"intro",job:null,jobOther:"",reader:null,readerOther:"",inputs:[],inputsOther:[],fixes:[],ownFix:[],spelling:"uk",length:"short",we:true,ownVoice:[],ai:null,aiOther:"",setup:{},tab:0,runs:[],extra:[],removed:[],draftFix:[],draftOwn:[],draftMin:null,shared:false}}
function load(){try{var o=JSON.parse(localStorage.getItem(KEY));return o?Object.assign(fresh(),o):null}catch(e){return null}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
var S=load()||fresh();

/* a colleague link: #f=<answers>, read once and then cleared from the address bar */
(function(){
  var m=/^#f=([A-Za-z0-9_-]+)$/.exec(location.hash||""); if(!m)return;
  try{
    var b=m[1].replace(/-/g,"+").replace(/_/g,"/"); while(b.length%4)b+="=";
    var bin=atob(b), bytes=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    var a=JSON.parse(new TextDecoder().decode(bytes)), n=fresh();
    ANSWERS.forEach(function(k){if(a[k]!==undefined)n[k]=a[k]});
    if(n.job&&(n.job==="other"||JOBS[n.job])){n.step="result";n.shared=true;S=n;save()}
  }catch(e){}
  try{history.replaceState(null,"",location.pathname+location.search)}catch(e){}
})();
window.addEventListener("hashchange",function(){if(/^#f=/.test(location.hash))location.reload()});
function shareLink(){
  var a={}; ANSWERS.forEach(function(k){a[k]=S[k]});
  var bytes=new TextEncoder().encode(JSON.stringify(a)), bin="";
  bytes.forEach(function(x){bin+=String.fromCharCode(x)});
  return location.origin+location.pathname+"#f="+btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}

var $=function(s){return document.querySelector(s)};
var app=$("#app");
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function ico(n){return '<svg class="ico" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function tidy(s){s=s.trim().replace(/\s+/g," ").slice(0,220);if(!s)return s;s=s[0].toUpperCase()+s.slice(1);return /[.!?)"']$/.test(s)?s:s+"."}
function clip(s,n){if(s.length<=n)return s;var c=s.slice(0,n-1);return c.slice(0,c.lastIndexOf(" "))+"…"}

function job(){
  if(S.job!=="other")return JOBS[S.job];
  var t=S.jobOther.trim()||"My job";
  return{ic:"file",label:t,slug:t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,28)||"my-job",out:t[0].toLowerCase()+t.slice(1),check:["Nothing missing","Compare with the last good one","Every section there"],inputs:[]};
}
function reader(){if(!S.reader)return null;if(S.reader==="other"){var t=S.readerOther.trim()||"Someone else";return{label:t,who:t,strict:true}}return READERS[S.reader]}
function ai(){return S.ai==="other"?{mono:"…",label:S.aiOther.trim()||"your AI",setups:["paste"]}:AIS[S.ai||"unsure"]}
function setupKey(){var a=ai(),k=S.setup[S.ai];return a.setups.indexOf(k)>=0?k:a.setups[0]}
function setup(){return SETUPS[setupKey()]}
function inLabel(i){var l=INPUTS[i][0];return /^([A-Z]{2}|Word)/.test(l)?l:l.toLowerCase()}
function allInputs(){return S.inputs.map(inLabel).concat(S.inputsOther.map(function(x){return x.replace(/\.$/,"")}))}
function list(a){return a.length<2?a.join(""):a.slice(0,-1).join(", ")+" and "+a[a.length-1]}
function version(){return 1+S.runs.filter(function(r){return r.added>0}).length}
function loc(t,c){return t.replace(/examples\//g,c.ex).replace(/templates\//g,c.tpl)}

function rawRules(){
  var r=[];
  S.fixes.forEach(function(f){r.push(FIXES[f].rule)});
  if(S.fixes.indexOf("facts")<0)r.push(FIXES.facts.rule);
  S.ownFix.forEach(function(x){r.push(x)});
  var we=S.we?(S.spelling==="fr"?" \"Nous\" for the firm.":" Say \"we\" for the firm."):"";
  if(S.spelling==="uk")r.push("British spelling."+we);
  if(S.spelling==="us")r.push("American spelling."+we);
  if(S.spelling==="fr")r.push("Write in French. Vouvoiement for clients."+we);
  if(S.length==="full")r.push("Full sentences and a formal tone. Still no padding.");
  S.ownVoice.forEach(function(x){r.push(x)});
  S.extra.forEach(function(x){r.push(x)});
  return r.filter(function(x){return S.removed.indexOf(x)<0});
}
function rules(c){return rawRules().map(function(x){return c?loc(x,c):x})}

function body(c){
  var j=S.job?job():null, rd=reader(), ins=allInputs();
  var t="<h>## The job</h>\n";
  t+=j?"You draft "+j.out+(rd?" for "+rd.who:"")+".\n":"<c>(pick a job)</c>\n";
  if(ins.length)t+="It starts from "+list(ins)+", "+c.src+".\n";
  if(rd)t+=rd.strict?"It goes out under my name, so it passes every check in "+c.score+", every time.\n":"It has to be good enough to act on after a five-minute read.\n";
  t+="\n<h>## Rules</h> <c>v"+version()+"</c>\n";
  var rs=rules(c);
  t+=rs.length?rs.map(function(x,i){return (i+1)+". "+x}).join("\n")+"\n":"<c>(your fixes become rules here)</c>\n";
  t+="\n<h>## Always</h>\n- "+c.save+"\n- Before you hand anything back, score it against "+c.score+" and tell me which checks you're unsure of.\n- No client personal data unless our AI policy allows it.";
  return t;
}
function instr(c){var j=S.job?job():null;return "# "+(j?j.label:"Your job")+"\n<c>"+c.head+"</c>\n\n"+body(c)}
function checks(){
  var j=S.job?job():null, c=[["No invented facts","Open three cited pages and find the number","All three match"]];
  if(j)c.push(j.check);
  c.push(["Complete","Compare with the last good one","Every section there, gaps marked [NOT IN SOURCE]"]);
  S.fixes.forEach(function(f){if(FIXES[f].check&&c.length<5)c.push(FIXES[f].check)});
  if(c.length<5)c.push(["Would I send it?","Read it as the reader would","Yes, with my name on it"]);
  return c.slice(0,5);
}
function scorecard(){
  var rd=reader(), t="# Scorecard\n<c>Each check is something a colleague could tick without asking me.</c>\n\n";
  checks().forEach(function(k,i){t+="<h>"+(i+1)+". "+k[0]+"</h>\n   Test: "+k[1]+"\n   Pass: "+k[2]+"\n"});
  return t+"\n"+(rd&&rd.strict?"Four out of five is a fail.":"Fix anything that fails before you use it.")+" Fix the rules, then run it again.";
}
function ask(lead,c){
  return (lead?lead+" ":"")+"Here are "+(list(allInputs())||"the files")+" for "+job().out+". Make the draft.\n\nThen score your own draft against each check in "+c.score+". For each one say pass, fail or unsure and why. List anything you marked [NOT IN SOURCE] or [CHECK].";
}
function startFile(lead,c){return "# Your first run\n<c>Paste this with this month's files.</c>\n\n\""+ask(lead,c)+"\"\n\n<h>## After the run</h>\nNote what you changed and how long it took.\nCome back to the builder and tell it: every fix becomes a rule."}
function desc(extra){var j=job(),rd=reader();return clip("Drafts "+j.out+(rd?" for "+rd.who:"")+" from "+(list(allInputs())||"my files")+" following our rules and scores each draft against our scorecard."+(extra||""),200)}
function firstMsg(lead,c){return{name:"First message",file:"FIRST-MESSAGE.md",text:"<c>Attach this month's files, then send:</c>\n\n"+ask(lead,c)}}
function sc(){return{name:"SCORECARD.md",text:scorecard()}}

/* tree rows: [name, note, icon, depth, isFolder] */
function folderTree(main){var j=job();return[[j.slug+"/","","folder",0,1],[main,"the rules, v"+version(),"file",1],["SCORECARD.md","5 checks","check",1],["START.md","your first prompt","chat",1],["sources/","this month's files","inbox",1,1],["examples/","2 or 3 past pieces you're proud of","star",1,1],["templates/","your layout","layout",1,1],["output/","where drafts land","download",1,1]]}
function skillTree(){var j=job();return[[j.slug+"/","the skill","layers",0,1],["SKILL.md","the rules, v"+version(),"file",1],["SCORECARD.md","5 checks","check",1],["examples/","2 or 3 past pieces","star",1,1],["templates/","your layout","layout",1,1]]}
function boxTree(kind,label,know){return[[kind+": "+label,"","person",0,1],["Instructions","the rules, v"+version(),"file",1],[know,"","folder",1,1],["SCORECARD.md","5 checks","check",2],["2 or 3 past pieces","you're proud of","star",2]]}
function folderSteps(open){return[["download","Save the folder","Download it and put it where you keep work. Add two or three past pieces to examples/."],["folder","Open it",open],["chat","Paste START.md","Put this month's "+(list(allInputs())||"files")+" in sources/ (redacted until your AI policy is agreed), then paste START.md."]]}
function boxSteps(make,fill){return[["plus","Make it",make],["copy","Fill in each box",fill],["chat","Try it","Open it, attach this month's files (redacted until your AI policy is agreed) and send the first message."]]}

var SETUPS={
  "claude-project":{ic:"window",kind:"project",label:"A Project in the Claude app",sub:"Phone, web or desktop. The easiest start.",main:"Project instructions",
    files:function(){return[{name:"Project instructions",file:"INSTRUCTIONS.md",text:instr(PROJ)},sc(),firstMsg("Use the project instructions and the SCORECARD file.",PROJ)]},
    tree:function(){return boxTree("Project",job().label,"Files")},
    steps:function(){return[["plus","Make the project","In Claude, open Projects and make a new one called \""+job().label+"\"."],["copy","Paste the instructions","Copy Project instructions below into the project's instructions. Add SCORECARD.md and two or three past pieces to the project files."],["chat","Send the first message","Start a chat in the project, attach this month's files (redacted until your AI policy is agreed) and send it."]]}},
  "claude-skill":{ic:"layers",kind:"skill",label:"A Claude skill",sub:"Works in any chat. Call it by name.",main:"SKILL.md",
    files:function(){var j=job();return[{name:"SKILL.md",text:"---\nname: "+j.slug+"\ndescription: "+desc(" Use whenever I ask for "+j.out+".")+"\n---\n\n"+instr(SKILL)},sc(),firstMsg("Use the "+j.slug+" skill.",SKILL)]},
    tree:skillTree,
    steps:function(){var j=job();return[["download","Download the skill","One zip with the "+j.slug+"/ folder inside. Add two or three past pieces to examples/ first."],["plus","Upload it","In Claude's settings, open Skills and upload the zip. Skills need code execution switched on."],["chat","Ask for it by name","In any chat, attach this month's files and send the first message."]]}},
  "claude-folder":{ic:"folder",kind:"folder",label:"A folder, in Cowork or Claude Code",sub:"On your computer. Claude reads CLAUDE.md by itself.",main:"CLAUDE.md",
    files:function(){return[{name:"CLAUDE.md",text:instr(FOLDER)},sc(),{name:"START.md",text:startFile("Read CLAUDE.md and SCORECARD.md first.",FOLDER)}]},
    tree:function(){return folderTree("CLAUDE.md")},
    steps:function(){return folderSteps("Open the folder in Cowork or Claude Code. It reads CLAUDE.md before it does anything.")}},
  "gpt-project":{ic:"window",kind:"project",label:"A Project in ChatGPT",sub:"Instructions and files that stay with every chat in it.",main:"Project instructions",
    files:function(){return[{name:"Project instructions",file:"INSTRUCTIONS.md",text:instr(PROJ)},sc(),firstMsg("Use the project instructions and the SCORECARD file.",PROJ)]},
    tree:function(){return boxTree("Project",job().label,"Files")},
    steps:function(){return[["plus","Make the project","In ChatGPT, make a new project called \""+job().label+"\"."],["copy","Paste the instructions","Open the project's settings and paste Project instructions. Add SCORECARD.md and two or three past pieces as project files."],["chat","Send the first message","Start a chat in the project, attach this month's files (redacted until your AI policy is agreed) and send it."]]}},
  "gpt-custom":{ic:"person",kind:"boxes",label:"A custom GPT",sub:"A named assistant your team can share. Depends on your plan.",main:"GPT setup",
    files:function(){var j=job();return[{name:"GPT setup",file:"GPT-SETUP.md",fields:[{label:"Name",text:j.label},{label:"Description",text:desc()},{label:"Instructions",text:instr(KNOW),limit:8000},{label:"Conversation starter",text:"Here are this month's files for "+j.out+"."},{label:"Knowledge",text:"Upload SCORECARD.md, two or three past pieces and your template. Up to 20 files.",info:1}]},sc(),firstMsg("",KNOW)]},
    tree:function(){return boxTree("GPT",job().label,"Knowledge")},
    steps:function(){return boxSteps("In ChatGPT, open GPTs, then Create, then Configure.","Copy each box from GPT setup below into the box with the same name. Upload the knowledge files.")}},
  "codex":{ic:"code",kind:"folder",label:"A folder, in Codex",sub:"On your computer. Codex reads AGENTS.md by itself.",main:"AGENTS.md",
    files:function(){return[{name:"AGENTS.md",text:instr(FOLDER)},sc(),{name:"START.md",text:startFile("Read AGENTS.md and SCORECARD.md first.",FOLDER)}]},
    tree:function(){return folderTree("AGENTS.md")},
    steps:function(){return folderSteps("Open the folder in Codex. It reads AGENTS.md before it does anything.")}},
  "vibe-folder":{ic:"folder",kind:"folder",label:"A folder, in Mistral Vibe",sub:"On your computer. Vibe reads AGENTS.md in folders you trust.",main:"AGENTS.md",
    files:function(){return[{name:"AGENTS.md",text:instr(FOLDER)},sc(),{name:"START.md",text:startFile("Read AGENTS.md and SCORECARD.md first.",FOLDER)}]},
    tree:function(){return folderTree("AGENTS.md")},
    steps:function(){return folderSteps("Open the folder in Vibe and say yes when it asks to trust it. From then on it reads AGENTS.md every time.")}},
  "mistral-agent":{ic:"person",kind:"boxes",label:"An agent in Mistral's chat",sub:"Instructions plus a library of your files. Mistral is moving these into Vibe.",main:"Agent setup",
    files:function(){var j=job();return[{name:"Agent setup",file:"AGENT-SETUP.md",fields:[{label:"Name",text:j.label},{label:"Description",text:desc()},{label:"Instructions",text:instr(KNOW)},{label:"Library",text:"Make a library with SCORECARD.md, two or three past pieces and your template, and attach it to the agent.",info:1}]},sc(),firstMsg("",KNOW)]},
    tree:function(){return boxTree("Agent",job().label,"Library")},
    steps:function(){return boxSteps("In Mistral's chat, open Agents and create one.","Copy each box from Agent setup below. Attach the library.")}},
  "copilot-agent":{ic:"person",kind:"boxes",label:"A Copilot agent",sub:"Built in Microsoft 365. Can read a SharePoint folder of past work.",main:"Agent setup",
    files:function(){var j=job();return[{name:"Agent setup",file:"AGENT-SETUP.md",fields:[{label:"Name",text:clip(j.label,30),limit:30},{label:"Description",text:desc()},{label:"Instructions",text:instr(KNOW),limit:8000},{label:"Starter prompt",text:"Draft "+j.out+" from the files I attach."},{label:"Knowledge",text:"Upload SCORECARD.md, or point it at a SharePoint folder with the scorecard, two or three past pieces and your template.",info:1}]},sc(),firstMsg("",KNOW)]},
    tree:function(){return boxTree("Agent",clip(job().label,30),"Knowledge")},
    steps:function(){return boxSteps("In Microsoft 365 Copilot, choose New agent, then Configure.","Copy each box from Agent setup below. Add the knowledge.")}},
  "gemini-skill":{ic:"layers",kind:"skill",label:"A Gemini skill",sub:"Google's replacement for Gems. Call it with @ in any chat.",main:"SKILL.md",
    files:function(){var j=job();return[{name:"SKILL.md",text:"---\nname: "+j.slug+"\ndescription: "+desc()+"\n---\n\n"+instr(SKILL)},sc(),firstMsg("@"+j.slug,SKILL)]},
    tree:skillTree,
    steps:function(){var j=job();return[["download","Download the skill","One zip with the "+j.slug+"/ folder inside. The folder name has to match the skill name."],["plus","Upload it","On gemini.google.com or the Mac app, open Settings, then Skills, then Upload."],["chat","Call it by name","In any chat, attach this month's files and send the first message, starting with @"+j.slug+"."]]}},
  "gemini-gem":{ic:"person",kind:"boxes",label:"A Gem",sub:"For work and school accounts, until Google moves them to skills in 2027.",main:"Gem setup",
    files:function(){return[{name:"Gem setup",file:"GEM-SETUP.md",fields:[{label:"Name",text:job().label},{label:"Instructions",text:instr(KNOW)},{label:"Knowledge",text:"Add SCORECARD.md, two or three past pieces and your template. Up to 10 files.",info:1}]},sc(),firstMsg("",KNOW)]},
    tree:function(){return boxTree("Gem",job().label,"Knowledge")},
    steps:function(){return boxSteps("In Gemini, open Gems and make a new one.","Copy each box from Gem setup below. Add the knowledge files.")}},
  "paste":{ic:"chat",kind:"folder",label:"Paste it into a chat",sub:"Works in any AI. Paste the rules at the top of each new chat.",main:"INSTRUCTIONS.md",
    files:function(){return[{name:"INSTRUCTIONS.md",text:instr(PROJ)},sc(),{name:"START.md",text:startFile("Follow the instructions above and the SCORECARD file.",PROJ)}]},
    tree:function(){return folderTree("INSTRUCTIONS.md")},
    steps:function(){return[["copy","Paste the rules","Open a new chat in "+ai().label+". Paste INSTRUCTIONS.md and attach SCORECARD.md."],["shield","Add real files, safely","This month's "+(list(allInputs())||"files")+". Redacted or dummy until your AI policy is agreed."],["chat","Paste START.md","It drafts, then marks its own work against your scorecard. Once it works, set it up properly so you stop pasting."]]}}
};

function renderTree(rows){
  return '<div class="tree">'+rows.map(function(r){return '<div class="r'+(r[4]?" d":"")+'" style="padding-left:'+(r[3]*20)+'px">'+ico(r[2])+'<b>'+esc(r[0])+'</b>'+(r[1]?'<span class="m">'+esc(r[1])+'</span>':"")+'</div>'}).join("")+'</div>';
}
function paint(t){return esc(t).replace(/&lt;h&gt;(.*?)&lt;\/h&gt;/g,'<span class="h">$1</span>').replace(/&lt;c&gt;(.*?)&lt;\/c&gt;/g,'<span class="c">$1</span>').replace(/^(#+ .*)$/gm,'<span class="h">$1</span>')}
function plain(t){return t.replace(/<\/?[hc]>/g,"")}
function strength(){
  var s=10; if(S.job)s+=20; if(S.reader)s+=15; if(S.inputs.length||S.inputsOther.length)s+=10; s+=Math.min(S.fixes.length+S.ownFix.length,3)*10; if(STEPS.indexOf(S.step)>STEPS.indexOf("voice"))s+=7; if(S.ai)s+=8; return Math.min(s,100);
}

/* files out: copy, one file, or the whole thing as a zip laid out for the setup */
function fileText(f){
  if(!f.fields)return plain(f.text);
  return "# "+f.name+": "+job().label+"\n\n"+f.fields.map(function(x){return "## "+x.label+(x.limit?" (up to "+x.limit.toLocaleString("en-GB")+" characters)":"")+"\n\n"+plain(x.text)}).join("\n\n")+"\n";
}
function fileName(f){return f.file||f.name}
function saveBlob(blob,name){
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
}
var zipLib=null;
function getZip(){
  if(window.JSZip)return Promise.resolve(window.JSZip);
  if(zipLib)return zipLib;
  zipLib=new Promise(function(ok,no){var s=document.createElement("script");s.src=JSZIP;s.onload=function(){ok(window.JSZip)};s.onerror=function(){zipLib=null;no(new Error("zip"))};document.head.appendChild(s)});
  return zipLib;
}
var README={
  "sources/README.md":"# sources\n\nPut this month's files here. Redacted or dummy until your AI policy is agreed.\nThe AI reads them and never writes over them.\n",
  "examples/README.md":"# examples\n\nAdd two or three past pieces you're proud of. The AI copies how they sound and how they're laid out.\nThis one step does more than any rule.\n",
  "templates/README.md":"# templates\n\nIf you have a template or a layout you always use, put it here.\n",
  "output/README.md":"# output\n\nDrafts land here. Check them against SCORECARD.md before anything goes out.\n"
};
function downloadAll(){
  var s=setup(), j=job(), files=s.files(), root=j.slug+"/";
  getZip().then(function(JSZip){
    var z=new JSZip();
    files.forEach(function(f){z.file(root+fileName(f),fileText(f))});
    var dirs=s.kind==="folder"?["sources/","examples/","templates/","output/"]:s.kind==="skill"?["examples/","templates/"]:["examples/"];
    dirs.forEach(function(d){z.file(root+d+"README.md",README[d+"README.md"])});
    if(s.kind==="skill"){z.remove(root+"FIRST-MESSAGE.md")}
    return z.generateAsync({type:"blob"});
  }).then(function(blob){saveBlob(blob,j.slug+".zip");toast(s.kind==="skill"?"Downloaded. Upload the zip as it is.":"Downloaded "+j.slug+".zip")})
  .catch(function(){toast("The download didn't start. Copy each file instead.")});
}
function downloadOne(){var f=setup().files()[S.tab];saveBlob(new Blob([fileText(f)],{type:"text/markdown;charset=utf-8"}),fileName(f).replace(/\.md$/,"")+".md")}
function invite(){
  var url=shareLink(), text="Here's the folder I use for "+job().out+" with "+ai().label+". Open it, change what you like and it's yours.";
  if(navigator.share){navigator.share({title:"Folder: "+job().label,text:text,url:url}).catch(function(){})}
  else copy(text+"\n"+url,"Link copied. It opens this folder for them.");
}

/* bottom sheet */
var sheet=$("#sheet"), head=$("#sheetHead");
head.onclick=function(){var o=!sheet.classList.contains("open");sheet.classList.toggle("open",o);head.setAttribute("aria-expanded",o)};
var lastRules=-1;
function updateSheet(){
  var show=Q_STEPS.indexOf(S.step)>=0;
  sheet.hidden=!show; document.body.classList.toggle("has-sheet",show); if(!show)return;
  var j=S.job?job():null, n=rules().length;
  $("#sheetTitle").textContent=(j?j.slug:"your-folder")+"/";
  $("#sheetSub").textContent=n+" rule"+(n===1?"":"s")+" · "+checks().length+" checks · "+(S.ai?"as "+setup().main:"set up for your AI at the end");
  $("#sheetPre").innerHTML=paint(instr(FOLDER));
  var st=strength(); $("#ringNum").textContent=st; $("#ringArc").style.strokeDashoffset=94.2*(1-st/100);
  if(n!==lastRules&&lastRules!==-1){var si=sheet.querySelector(".sheet-in");si.classList.remove("pulse");void sheet.offsetWidth;si.classList.add("pulse")}
  lastRules=n;
}

function toast(m){var t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2800)}
function copy(text,msg){
  var done=function(){toast(msg||"Copied. Paste it into "+ai().label+".")};
  function fallback(t){var a=document.createElement("textarea");a.value=t;a.setAttribute("readonly","");a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");done()}catch(e){toast("Select the text and copy it")}a.remove()}
  try{navigator.clipboard.writeText(text).then(done,function(){fallback(text)})}catch(e){fallback(text)}
}
function go(step){S.step=step;save();render();window.scrollTo({top:0,behavior:reduced()?"auto":"smooth"})}

function topBar(){
  var qi=Q_STEPS.indexOf(S.step);
  var pct=S.step==="intro"?0:qi>=0?Math.round((qi+1)/(Q_STEPS.length+1)*100):100;
  return '<div class="top"><a class="brand" href="/">Praxis<i>.</i></a><div class="top-actions"><button class="ghost" data-act="how">'+ico("question")+'How it works</button>'+(S.step!=="intro"?'<button class="ghost" data-act="restart" aria-label="Start again">'+ico("repeat")+'</button>':"")+'</div></div>'+
    (S.step!=="intro"?'<div class="progress" aria-hidden="true"><span style="width:'+pct+'%"></span></div>':"");
}
function choice(key,o,pressed,multi){
  var icon=o.mono?'<span class="ic mono-ic">'+esc(o.mono)+'</span>':'<span class="ic">'+ico(o.ic)+'</span>';
  return '<button class="choice" data-key="'+key+'" aria-pressed="'+pressed+'">'+icon+'<span class="t"><b>'+esc(o.label)+'</b>'+(o.sub?'<small>'+esc(o.sub)+'</small>':"")+'</span>'+(multi?'<span class="tick">'+ico("check")+'</span>':"")+'</button>';
}
function nav(ok,label){return '<div class="row navrow"><button class="back" data-act="back" aria-label="Back">'+ico("back")+'</button><button class="cta" data-act="next" '+(ok?"":"disabled")+'>'+(label||"Next")+ico("next")+'</button></div>'}
function freeLabel(icon,t,sub){return '<p class="free-label">'+ico(icon)+t+(sub?' <span>'+sub+'</span>':"")+'</p>'}
function otherBox(k,label,ph){return '<div class="free">'+freeLabel("pen",label)+'<input class="field-in" data-other="'+k+'" placeholder="'+esc(ph)+'" value="'+esc(S[k+"Other"])+'" aria-label="'+esc(label)+'" enterkeyhint="next" autocomplete="off"></div>'}
function addBox(f,ph,chips){
  return '<div class="addrow"><input class="field-in addin" id="add-'+f+'" data-f="'+f+'" placeholder="'+esc(ph)+'" aria-label="'+esc(ph)+'" enterkeyhint="done" autocomplete="off"><button class="addbtn" data-add="'+f+'">'+ico("plus")+'Add</button></div>'+
  (chips!==false&&S[f].length?'<div class="mine">'+S[f].map(function(x,i){return '<div class="mychip">'+ico("pen")+'<span>'+esc(x)+'</span><button data-del="'+f+'" data-i="'+i+'" aria-label="Remove '+esc(x)+'">'+ico("x")+'</button></div>'}).join("")+'</div>':"");
}

var R={
intro:function(){
  return '<div class="screen">'+
  '<span class="eyebrow">Free · 4 minutes · works with the AI you already use</span>'+
  '<h1>Stop rewriting what AI gives you.</h1>'+
  '<p class="lead">Tell us one job and what you keep fixing. You get the rules your AI reads every time, set up the way your AI works, with a scorecard that says when the work is good enough to send.</p>'+
  '<button class="cta" data-act="start">Build my folder'+ico("next")+'</button>'+
  '<ol class="how3"><li>'+ico("chat")+'Answer 6 questions</li><li>'+ico("folder")+'Get your folder</li><li>'+ico("copy")+'Paste it into your AI</li></ol>'+
  '<div class="twice">'+
    '<figure class="bad"><figcaption>'+ico("x")+'Without it</figcaption><p><span class="strike">I hope this finds you well.</span> Revenue was strong this quarter at around €410k, and debtor days improved…</p></figure>'+
    '<figure class="good"><figcaption>'+ico("check")+'With your folder</figcaption><p><b>Revenue €412,300</b> (accounts p. 2). Margin 38.4% (p. 3). Debtor days <b>[NOT IN SOURCE]</b>, ask the client.</p></figure>'+
  '</div>'+
  '<div class="file" data-name="your rules"><pre><span class="h"># The monthly client report</span>\n1. Summary first, three sentences.\n2. Every number says its file and page.\n3. Not in the sources? Write [NOT IN SOURCE].\n4. Write like our past pieces.<span class="cursor"></span></pre></div>'+
  '<div class="ais">'+["claude","chatgpt","mistral","copilot","gemini"].map(function(k){return '<span><i class="mono">'+AIS[k].mono+'</i>'+AIS[k].label.replace("Microsoft ","")+'</span>'}).join("")+'</div>'+
  '<div class="badges"><span class="badge">'+ico("lock")+'Your answers stay on this device</span><span class="badge">'+ico("pen")+'Tap or type at every step</span></div>'+
  '<p class="small" style="margin-top:20px">Built from the Praxis programme: real firms, real reports, the same method.</p>'+
  '</div>';
},
job:function(){
  return '<div class="screen"><span class="eyebrow">1 of 6 · The job</span><h2>Which job eats your week?</h2><p class="hint">Pick the one you\'d hand over first. One job, done properly, beats ten done badly.</p>'+
  '<div class="choices">'+Object.keys(JOBS).map(function(k){return choice(k,JOBS[k],S.job===k)}).join("")+'</div>'+
  otherBox("job","Something else?","Type the job, like \"VAT returns\"")+nav(!!S.job)+'</div>';
},
reader:function(){
  return '<div class="screen"><span class="eyebrow">2 of 6 · Who reads it</span><h2>Who reads '+esc(job().out)+'?</h2><p class="hint">This sets how strict the checks are.</p>'+
  '<div class="choices">'+Object.keys(READERS).map(function(k){return choice(k,READERS[k],S.reader===k)}).join("")+'</div>'+
  otherBox("reader","Someone else?","Say who, like \"the bank\"")+nav(!!S.reader)+'</div>';
},
inputs:function(){
  return '<div class="screen"><span class="eyebrow">3 of 6 · What goes in</span><h2>What do you start from?</h2><p class="hint">Pick all that apply, and add anything we\'ve missed.</p>'+
  '<div class="choices two">'+Object.keys(INPUTS).map(function(k){return choice(k,{ic:INPUTS[k][1],label:INPUTS[k][0]},S.inputs.indexOf(k)>=0,true)}).join("")+'</div>'+
  '<div class="free">'+freeLabel("plus","Add your own")+addBox("inputsOther","Like \"the Xero export\"")+'</div>'+nav(S.inputs.length+S.inputsOther.length>0)+'</div>';
},
fixes:function(){
  var last=S.ownFix.length?S.ownFix[S.ownFix.length-1]:S.fixes.length?FIXES[S.fixes[S.fixes.length-1]].rule:null;
  return '<div class="screen"><span class="eyebrow">4 of 6 · The important one</span><h2>What do you keep fixing by hand?</h2><p class="hint">Pick everything that\'s annoyed you. Each one becomes a rule your AI follows from now on.</p>'+
  '<div class="choices">'+Object.keys(FIXES).map(function(k){return choice(k,FIXES[k],S.fixes.indexOf(k)>=0,true)}).join("")+'</div>'+
  '<div class="free">'+freeLabel("pen","In your own words","Say it the way you\'d tell a new hire.")+addBox("ownFix","Like \"No bullet points in the summary\"")+'</div>'+
  '<p class="becomes">'+ico("file")+'<span>'+(last?'New rule: <code>'+esc(last.split(".")[0])+'.</code>':'Your first rule appears in the folder below.')+'</span></p>'+nav(S.fixes.length+S.ownFix.length>0)+'</div>';
},
voice:function(){
  var p=function(k,v,l){return '<button class="pill" data-set="'+k+'" data-val="'+v+'" aria-pressed="'+(S[k]===v)+'">'+l+'</button>'};
  return '<div class="screen"><span class="eyebrow">5 of 6 · How you write</span><h2>How should it sound?</h2><p class="hint">Later you add two or three of your own past pieces. That does most of the work.</p>'+
  '<div class="group"><h3>'+ico("book")+'Language</h3><div class="pills">'+p("spelling","uk","British English")+p("spelling","us","American English")+p("spelling","fr","Français")+'</div></div>'+
  '<div class="group"><h3>'+ico("long")+'Style</h3><div class="pills">'+p("length","short","Short and direct")+p("length","full","Full and formal")+'</div></div>'+
  '<div class="group"><h3>'+ico("people")+'The firm</h3><div class="pills"><button class="pill" data-act="we" aria-pressed="'+S.we+'">'+(S.we?ico("check"):"")+'We speak as "we"</button></div></div>'+
  '<div class="group"><h3>'+ico("pen")+'Anything else?</h3>'+addBox("ownVoice","Like \"Sign off as Daniel\"")+'</div>'+nav(true)+'</div>';
},
ai:function(){
  return '<div class="screen"><span class="eyebrow">6 of 6 · Your AI</span><h2>Which AI do you use?</h2><p class="hint">Each one keeps its rules in a different place. We set yours up the way it works.</p>'+
  '<div class="choices two">'+Object.keys(AIS).map(function(k){return choice(k,AIS[k],S.ai===k)}).join("")+'</div>'+
  otherBox("ai","Another one?","Type its name")+nav(!!S.ai,"Build my folder")+'</div>';
},
build:function(){
  setTimeout(function(){if(S.step==="build")go("result")},reduced()?50:2300);
  var s=setup(), lines=["Reading your answers","Writing "+rules().length+" rules","Setting it up for "+ai().label+": "+s.main,"Building a 5-check scorecard","Writing your first message","Done"];
  return '<div class="screen" style="padding-top:10vh"><span class="eyebrow">Building</span><h2>'+esc(job().slug)+'/</h2>'+
  '<div class="file" data-name="praxis"><pre>'+lines.map(function(l,i){return '<span class="new" style="animation-delay:'+(i*.36)+'s;display:block">'+(i<lines.length-1?'<span class="c">✓</span> ':'<span class="h">›</span> ')+esc(l)+'</span>'}).join("")+'</pre></div></div>';
},
result:function(){
  var j=job(), a=ai(), s=setup(), files=s.files();
  if(S.tab>=files.length)S.tab=0;
  var f=files[S.tab], st=strength(), back=S.runs.length>0, removed=S.removed.length;
  var panel=f.fields?f.fields.map(function(x,i){
      var len=plain(x.text).length, pct=x.limit?Math.min(100,Math.round(len/x.limit*100)):0;
      return '<div class="field"><div class="field-h"><span>'+esc(x.label)+'</span>'+(x.limit?'<span class="lim'+(len>x.limit?" over":"")+'"><i><b style="width:'+pct+'%"></b></i>'+len.toLocaleString("en-GB")+' / '+x.limit.toLocaleString("en-GB")+'</span>':"")+'</div>'+
      (x.info?'<p class="field-info">'+ico("folder")+'<span>'+esc(x.text)+'</span></p>':'<pre>'+paint(x.text)+'</pre><button class="chip-btn solid" data-copyf="'+i+'">'+ico("copy")+'Copy '+esc(x.label.toLowerCase())+'</button>')+'</div>'}).join("")+
      '<div class="panel-actions"><button class="chip-btn" data-act="one">'+ico("download")+'Download the setup sheet</button></div>'
    :'<pre>'+paint(f.text)+'</pre><div class="panel-actions"><button class="chip-btn solid" data-act="copy">'+ico("copy")+'Copy '+esc(f.name)+'</button><button class="chip-btn" data-act="one">'+ico("download")+'Download</button></div>';
  return '<div class="screen">'+
  (S.shared&&!back?'<div class="banner">'+ico("link")+'<span><b>A colleague shared this folder with you.</b> It\'s yours now: change anything and it saves on this device.</span></div>':"")+
  '<span class="eyebrow">'+(back?"Welcome back · rules v"+version():"Ready")+'</span>'+
  '<h2>'+(back?"Your folder, getting better.":"Your folder is ready.")+'</h2>'+
  '<p class="lead">'+rules().length+' rules from your own fixes, a scorecard for '+esc(j.out)+' and a first message to send tonight, set up for '+esc(a.label)+'.</p>'+
  '<button class="cta" data-act="zip">'+ico("download")+'Download it all (.zip)</button>'+

  '<div class="setups"><div class="setups-h"><h3>How do you use '+esc(a.label)+'?</h3><button class="ghost" data-act="changeai">Change AI</button></div>'+
  a.setups.map(function(k){var x=SETUPS[k];return '<button class="setup" data-setup="'+k+'" aria-pressed="'+(setupKey()===k)+'"><span class="ic">'+ico(x.ic)+'</span><span><b>'+esc(x.label)+'</b><small>'+esc(x.sub)+'</small></span><span class="tick">'+ico("check")+'</span></button>'}).join("")+
  (S.ai==="other"||S.ai==="unsure"?'<p class="small" style="margin:4px 2px 0">Tell us which AI later and we\'ll set it up the way it works.</p>':"")+'</div>'+

  '<div class="strength"><strong>'+st+'</strong><span class="small"><b style="color:var(--fg)">Brief strength.</b> Add two past pieces to reach 100. That one step does more than any rule.</span></div>'+
  renderTree(s.tree())+
  '<div class="tabs" role="tablist">'+files.map(function(x,i){return '<button class="tab" role="tab" data-tab="'+i+'" aria-selected="'+(S.tab===i)+'">'+esc(x.name)+'</button>'}).join("")+'</div>'+
  '<div class="panel" role="tabpanel">'+panel+'</div>'+

  '<div class="section"><span class="eyebrow">Tonight</span><h3>Your first run, in '+esc(a.label)+'</h3>'+
  '<ol class="steps">'+s.steps().map(function(x,i){return '<li><span class="n">'+ico(x[0])+'<em>'+(i+1)+'</em></span><div><b>'+esc(x[1])+'</b><span>'+esc(x[2])+'</span></div></li>'}).join("")+'</ol>'+
  '<p class="callout">'+ico("repeat")+'<span>The first run is slow. Every fix you make becomes a rule, so the next one needs less checking.</span></p>'+
  '<div class="stack"><button class="cta" data-act="toloop">I\'ve done a run, make it better'+ico("next")+'</button>'+
  '<button class="cta alt" data-act="invite">'+ico("share")+'Send the folder to a colleague</button></div>'+
  '<p class="small" style="margin-top:12px">Nothing you typed has left this device. The colleague link carries the folder inside the link itself.</p></div>'+

  '<div class="section"><span class="eyebrow">Your rules</span><h3>Change anything</h3><p class="hint" style="margin-bottom:0">Take out what doesn\'t fit, or add one in your own words. Every setup above updates.</p>'+
  '<ul class="rules-edit">'+rawRules().map(function(x){var lock=x===FIXES.facts.rule;return '<li><span>'+esc(x)+'</span>'+(lock?'<span class="lock">'+ico("lock")+'Always on</span>':'<button data-rm="'+esc(x)+'" aria-label="Take this rule out">'+ico("x")+'</button>')+'</li>'}).join("")+'</ul>'+
  addBox("ownFix","Add a rule",false)+
  (removed?'<button class="ghost" data-act="unremove" style="margin-top:12px">'+ico("repeat")+'Bring back '+removed+' rule'+(removed>1?"s":"")+'</button>':"")+
  '</div>'+
  (back?pathCard():teamCard())+
  '</div>';
},
loop:function(){
  var n=S.runs.length+1, opts=Object.assign({none:{ic:"check",label:"Nothing. It was right first time"}},FIXES), mins=[5,15,30,60];
  return '<div class="screen"><span class="eyebrow">Run '+n+' · '+esc(job().label)+'</span><h2>What did you have to change?</h2><p class="hint">Tell it like you\'d brief a subcontractor. Each fix becomes a rule, so you don\'t make it twice.</p>'+
  '<div class="choices">'+Object.keys(opts).map(function(k){return choice(k,opts[k],S.draftFix.indexOf(k)>=0,true)}).join("")+'</div>'+
  '<div class="free">'+freeLabel("pen","Something else?")+addBox("draftOwn","Say it as a rule, like \"Put the fee on page one\"")+'</div>'+
  '<div class="group" style="margin-top:24px"><h3>'+ico("clock")+'How long did it take, checking included?</h3><div class="pills">'+mins.map(function(m){return '<button class="pill" data-min="'+m+'" aria-pressed="'+(S.draftMin===m)+'">'+(m===60?"An hour or more":m+" min")+'</button>'}).join("")+'</div></div>'+
  nav(S.draftFix.length+S.draftOwn.length>0&&S.draftMin!==null,"Update my folder")+
  (S.runs.length?chartCard():"")+'</div>';
}
};

function chartCard(){
  var runs=S.runs.slice(-5), max=Math.max.apply(null,[3].concat(runs.map(function(r){return r.fixes})));
  return '<div class="chart"><h3>Fixes per run</h3><p class="small" style="margin:0">Fewer fixes each run means the rules are working.</p>'+
  '<div class="bars">'+runs.map(function(r,i){return '<div class="bar '+(i===runs.length-1?"you":"")+'"><em>'+r.fixes+'</em><i style="height:'+Math.max(4,r.fixes/max*80)+'%"></i></div>'}).join("")+'</div>'+
  '<div class="bar-labels">'+runs.map(function(r){return '<span>Run '+r.n+'<br>'+(r.min===60?"60+":r.min)+' min</span>'}).join("")+'</div></div>';
}
function teamCard(){return '<div class="teamcard">'+ico("people").replace('class="ico"','class="ico big"')+'<b>Want this for the whole team?</b><p class="small" style="margin:0">Praxis takes a team of up to 4 through the path on their own work, with a trainer, until the scorecard passes on real jobs.</p><a class="cta" href="'+BOOK+'" target="_blank" rel="noopener">Book a free 30-minute call</a></div>'}
function pathCard(){
  var steps=[["Pick one job","done"],["Rules first: your AI policy","later"],["Define good: the scorecard","done"],["Write it down once: "+setup().main,"done"],["Run, check, correct","now"],["Hand it over","next"],["Prove it on ten real cases","next"],["Share it, schedule it","next"]];
  var lab={done:"Done",now:"Run "+(S.runs.length+1)+" next",next:"",later:'<a href="/ai-charter" target="_blank" rel="noopener">Before real client files</a>'};
  return '<div class="section"><span class="eyebrow">The Praxis path</span><h3>Where you are</h3>'+
  '<ul class="path">'+steps.map(function(x){return '<li class="'+x[1]+'"><span class="dot">'+(x[1]==="done"?ico("check"):"")+'</span><span>'+esc(x[0])+'</span><span class="tag">'+lab[x[1]]+'</span></li>'}).join("")+'</ul>'+
  chartCard()+teamCard()+'</div>';
}
function reduced(){return window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}

function render(){
  app.innerHTML=topBar()+R[S.step]();
  updateSheet();
  app.querySelectorAll("[data-other]").forEach(function(inp){inp.oninput=function(e){
    var k=inp.dataset.other, v=e.target.value, nx=app.querySelector('[data-act="next"]');
    S[k+"Other"]=v;
    if(v.trim()){S[k]="other";app.querySelectorAll(".choice").forEach(function(b){b.setAttribute("aria-pressed","false")});nx.disabled=false}
    else if(S[k]==="other"){S[k]=null;nx.disabled=true}
    save();updateSheet();
  }});
}
function doAdd(f){
  var inp=$("#add-"+f); if(!inp)return;
  var v=inp.value; if(!v.trim())return inp.focus();
  v=f==="inputsOther"?v.trim().slice(0,60):tidy(v);
  if(S[f].indexOf(v)<0)S[f].push(v);
  if(f==="draftOwn")S.draftFix=S.draftFix.filter(function(x){return x!=="none"});
  if(f==="ownFix")S.removed=S.removed.filter(function(x){return x!==v});
  save();render();
  var again=$("#add-"+f); if(again)again.focus({preventScroll:true});
  if(f==="ownFix"&&S.step==="result")toast("Rule added. Every setup is updated.");
}

app.addEventListener("keydown",function(e){
  if(e.key!=="Enter")return;
  if(e.target.classList.contains("addin")){e.preventDefault();doAdd(e.target.dataset.f)}
  else if(e.target.dataset.other){var nx=app.querySelector('[data-act="next"]');if(nx&&!nx.disabled){e.preventDefault();nx.click()}}
});
app.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b)return;
  var act=b.dataset.act, key=b.dataset.key;
  if(act==="start")return go("job");
  if(act==="how")return openHow();
  if(act==="restart"){if(!confirm("Start again? This clears your answers on this device."))return;S=fresh();save();lastRules=-1;return go("intro")}
  if(act==="back"){var i=STEPS.indexOf(S.step);return go(S.step==="loop"?"result":S.step==="result"?"ai":STEPS[Math.max(0,i-1)])}
  if(act==="next"){if(S.step==="loop")return finishRun();return go(STEPS[STEPS.indexOf(S.step)+1])}
  if(b.dataset.add)return doAdd(b.dataset.add);
  if(b.dataset.del){S[b.dataset.del].splice(+b.dataset.i,1);save();return render()}
  if(b.dataset.rm){var r=b.dataset.rm;["ownFix","ownVoice","extra"].forEach(function(k){var x=S[k].indexOf(r);if(x>=0)S[k].splice(x,1)});if(rawRules().indexOf(r)>=0)S.removed.push(r);save();render();return toast("Rule taken out. Every setup is updated.")}
  if(act==="unremove"){S.removed=[];save();return render()}
  if(act==="changeai")return go("ai");
  if(b.dataset.setup){S.setup[S.ai]=b.dataset.setup;S.tab=0;save();return render()}
  if(act==="copy")return copy(plain(setup().files()[S.tab].text));
  if(b.dataset.copyf)return copy(plain(setup().files()[S.tab].fields[+b.dataset.copyf].text));
  if(act==="zip")return downloadAll();
  if(act==="one")return downloadOne();
  if(act==="invite")return invite();
  if(act==="toloop"){S.draftFix=[];S.draftOwn=[];S.draftMin=null;return go("loop")}
  if(act==="we"){S.we=!S.we;save();return render()}
  if(b.dataset.tab){S.tab=+b.dataset.tab;save();return render()}
  if(b.dataset.set){S[b.dataset.set]=b.dataset.val;save();return render()}
  if(b.dataset.min){S.draftMin=+b.dataset.min;save();return render()}
  if(key){
    var st=S.step;
    if(st==="job"){S.job=key;S.jobOther="";if(!S.inputs.length&&!S.inputsOther.length)S.inputs=JOBS[key].inputs.slice()}
    else if(st==="reader"){S.reader=key;S.readerOther=""}
    else if(st==="ai"){S.ai=key;S.aiOther=""}
    else if(st==="inputs")toggle(S.inputs,key);
    else if(st==="fixes")toggle(S.fixes,key);
    else if(st==="loop"){if(key==="none"){S.draftFix=S.draftFix.indexOf("none")>=0?[]:["none"];S.draftOwn=[]}else{S.draftFix=S.draftFix.filter(function(x){return x!=="none"});toggle(S.draftFix,key)}}
    save();render();
    if(["job","reader","ai"].indexOf(st)>=0)setTimeout(function(){if(S.step===st)go(STEPS[STEPS.indexOf(st)+1])},260);
  }
});
function toggle(arr,k){var i=arr.indexOf(k);i<0?arr.push(k):arr.splice(i,1)}
function finishRun(){
  var fixes=S.draftFix.filter(function(x){return x!=="none"}), added=[];
  fixes.forEach(function(f){
    if(S.fixes.indexOf(f)<0){S.fixes.push(f);added.push(FIXES[f].rule)}
    else if(S.extra.indexOf(FIRM[f])<0){S.extra.push(FIRM[f]);added.push(FIRM[f])}
  });
  S.draftOwn.forEach(function(x){if(S.ownFix.indexOf(x)<0){S.ownFix.push(x);added.push(x)}});
  S.removed=S.removed.filter(function(x){return added.indexOf(x)<0});
  S.runs.push({n:S.runs.length+1,fixes:fixes.length+S.draftOwn.length,min:S.draftMin,added:added.length});
  S.draftOwn=[]; S.tab=0; save();
  go("result");
  setTimeout(function(){toast(added.length?"Rules v"+version()+": "+added.length+" new rule"+(added.length>1?"s":"")+" added":"Right first time. No new rules needed.")},400);
}

var how=$("#how"), lastFocus=null;
function openHow(){lastFocus=document.activeElement;how.hidden=false;$("#closeHow").focus()}
function closeHow(){how.hidden=true;if(lastFocus)lastFocus.focus()}
$("#closeHow").onclick=closeHow;
how.onclick=function(e){if(e.target===how)closeHow()};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!how.hidden)closeHow()});

render();
})();
