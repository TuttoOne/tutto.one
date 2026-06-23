# LegalRAG — On-Premise AI Document Intelligence for Legal

## What It Is

LegalRAG is a self-hosted document intelligence platform built for litigation and legal review. It runs entirely on-premise using NVIDIA DGX Spark hardware, ensuring that all document processing, AI inference, and data storage stays within the physical control of the instructing legal team. No data ever leaves the device.

## The Problem It Solves

Legal teams handling large-scale disclosure face a fundamental tension: cloud AI platforms offer powerful document analysis, but sending privileged case material to external servers creates unacceptable risks under Legal Professional Privilege, GDPR, and professional conduct rules. The alternative — manual review of tens or hundreds of thousands of documents — is prohibitively slow and expensive.

LegalRAG eliminates this tension. It brings the AI to the data, not the data to the AI.

## What It Does

**Document Ingestion at Scale**
Processes entire disclosure sets — hundreds of thousands of files across all common formats: PDF, DOCX, XLSX, MSG, EML, PPTX, HTML, CSV, XML, TIF, JPG, and more. Each document is extracted, chunked into searchable passages, and embedded as vectors for semantic search. A checkpoint system allows ingestion to be paused and resumed at any point.

**Semantic Search**
Natural language search across the entire corpus using vector similarity. Ask a question in plain English and retrieve the most relevant passages with citations to specific source documents and page numbers. Filter by disclosure side, document type, date range, or custom categories.

**Conversational Q&A (RAG)**
A chat interface grounded in the document corpus. Questions are answered with citations to source material — the AI synthesises answers from retrieved passages rather than generating from its own knowledge. Every answer is traceable back to the original documents.

**Interactive Timeline**
A collapsible chronological view of case events extracted from document metadata — email dates, creation dates, contractual deadlines. Drill down from year to month to individual events. Filter by event type and disclosure side. Provides an immediate chronological overview without manual review.

**OCR for Scanned Documents**
Optical character recognition for scanned PDFs and image files, with intelligent DPI management and low-content detection. Documents that are redacted or contain minimal text are automatically tagged rather than lost. An overnight vision re-extraction pass recovers text from scans that defeat conventional OCR.

**Entity Extraction**
Every document is scanned for the people, organisations, and places it mentions, using on-device named-entity recognition. Browse the corpus by entity, see every document a party appears in, and jump straight to the relevant material. Extraction runs in seconds per document, allowing the entire corpus to be entity-indexed.

**Knowledge Graph**
An interactive visual graph showing connections between documents and the parties that link them — shared people, organisations, and references rendered as a navigable network. Click any node to expand its neighbours, search the graph, and surface patterns across large document sets that linear review would miss.

**Custom Taxonomies & Classification**
The system classifies every document against case-specific categories — document types, parties, issues, and bespoke tags defined by the legal team. Suggested tags can be reviewed and accepted in bulk, building a searchable, lawyer-defined structure over the whole corpus.

**Disclosure Audit**
Statistical and pattern checks across the disclosure set that surface exactly what an opposing solicitor will probe at trial: gaps in disclosure numbering, document-type droughts, and month-over-month volume cliffs. Each anomaly is flagged for review, turning completeness from a hope into a checkable property — on a 200,000-document corpus the checks run in seconds.

**Junior-Lawyer Orchestrator**
A task-driven assistant that takes a plain-English legal instruction, selects the appropriate junior-lawyer skill(s), runs each against the corpus, and synthesises a single cited work product. All reasoning runs on the local model — nothing leaves the device. Long-running research agents can build complete chronologies for an entity or cross-reference accounts across documents to flag contradictions.

**Limitation Calculator**
A rule-based Limitation Act 1980 calculator for England & Wales civil litigation. Given an accrual date and cause of action, it returns the cut-off date, days remaining or expired, the governing statutory section, and any arguable extensions or exceptions.

**Document Preview & Summaries**
Each document carries an at-a-glance summary and a first-page image preview, shown consistently across search results, the file browser, entity views, and the graph. A full-screen preview mode renders the original file alongside its extracted text.

**Quality & Citation Controls**
A second-stage cross-encoder reranker sharpens retrieval relevance, while citation-verification and critic passes check that generated answers are actually grounded in the cited sources before they reach the lawyer.

## What Makes It Different

**Complete Privacy by Design**
Every component runs on a single device. OCR, text extraction, AI inference, vector search, and storage — all on-premise. No cloud APIs, no external model providers, no data transmission. The system satisfies Legal Professional Privilege requirements by architectural design, not by policy promise.

**Built for Legal Workflows**
The system understands disclosure structure — it tracks which side produced each document, preserves document reference IDs from eDiscovery platforms, and maintains the chain of custody from production to search result.

**Scale Without Compromise**
Handles 150,000+ documents with millions of searchable chunks. Checkpoint-based processing means ingestion can run overnight and survive interruptions. Resource monitoring prevents the system from overloading the hardware.

**Transparency Over Trust**
Every search result cites its source. Every timeline event links to its document. The AI assists the lawyer's review — it doesn't replace the lawyer's judgment.

**Completeness First**
Most tools help you find what is there. LegalRAG also tells you what may be missing — flagging gaps in the disclosure record and probing the corpus the way opposing counsel will. The goal is not just answers, but defensible coverage.

## Roadmap

The platform is moving from single-device deployments toward a managed fleet: a private high-capacity reasoning hub paired with per-client DGX Spark units, so each firm keeps its own data on its own device while sharing centrally-maintained skills, models, and updates. Continued work focuses on deeper case-theory tooling, richer cross-document analysis, and multi-firm operation with strict per-client isolation.

## Technology Stack

- **Hardware:** NVIDIA DGX Spark (GB10 Superchip, 128GB unified memory, NVMe storage)
- **AI Models:** Open-weight models running locally via Ollama — large reasoning model for Q&A and orchestration, fast models for ingestion, plus on-device named-entity recognition and a cross-encoder reranker
- **Retrieval:** Hybrid vector + keyword search with reciprocal-rank fusion, second-stage reranking, and agentic multi-round retrieval for complex questions
- **Database:** PostgreSQL with pgvector for hybrid text and vector search
- **Security:** Hardened Linux with ClamAV, AppArmor, UFW, Fail2ban, AIDE and auditd; TOTP-gated administrative controls and a least-privilege read-only role for analysis tooling
- **Access:** Tailscale peer-to-peer VPN for secure remote access without port forwarding

## Who It's For

- Barristers and chambers handling document-heavy commercial litigation
- Law firms with privacy-sensitive practices (fraud, family, regulatory)
- Any legal team that needs AI-powered document review but cannot use cloud platforms
- Mid-market firms (10–100 lawyers) priced out of enterprise platforms like Harvey

## Deployment Model

Each client gets their own DGX Spark unit, configured and deployed at their premises. The system is self-contained — no ongoing cloud dependency, and each firm's data never leaves its own device. Setup, ingestion, and training are handled as a managed service by Humanity³, with skills, models, and updates maintained centrally and pushed to each deployment.

---

*Built by Humanity³ (H³) — a division of Tutto Products and Services*
