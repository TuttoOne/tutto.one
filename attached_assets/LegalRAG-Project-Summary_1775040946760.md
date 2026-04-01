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
Optical character recognition for scanned PDFs and image files, with intelligent DPI management and low-content detection. Documents that are redacted or contain minimal text are automatically tagged rather than lost.

## What Makes It Different

**Complete Privacy by Design**
Every component runs on a single device. OCR, text extraction, AI inference, vector search, and storage — all on-premise. No cloud APIs, no external model providers, no data transmission. The system satisfies Legal Professional Privilege requirements by architectural design, not by policy promise.

**Built for Legal Workflows**
The system understands disclosure structure — it tracks which side produced each document, preserves document reference IDs from eDiscovery platforms, and maintains the chain of custody from production to search result.

**Scale Without Compromise**
Handles 150,000+ documents with millions of searchable chunks. Checkpoint-based processing means ingestion can run overnight and survive interruptions. Resource monitoring prevents the system from overloading the hardware.

**Transparency Over Trust**
Every search result cites its source. Every timeline event links to its document. The AI assists the lawyer's review — it doesn't replace the lawyer's judgment.

## Planned Features

**Custom Taxonomies**
A taxonomy builder that allows the legal team to define case-specific classification frameworks — allegations, issues, parties, transaction types. The AI classifies every document against the lawyer's own framework, creating bespoke searchable categories that reflect how the case is actually structured.

**Knowledge Map**
An interactive visual graph showing connections between documents — shared parties, overlapping dates, cross-references, related transactions. Documents as nodes, relationships as edges, rendered as a navigable hub-and-spoke visualisation. Surfaces patterns across large document sets that linear review would miss.

## Technology Stack

- **Hardware:** NVIDIA DGX Spark (GB10 Superchip, 128GB unified memory, NVMe storage)
- **AI Models:** Open-weight models running locally via Ollama (reasoning + embeddings)
- **Database:** PostgreSQL with pgvector for hybrid text and vector search
- **Security:** ClamAV, AppArmor, UFW, Fail2ban, AIDE, auditd — hardened Linux with daily scanning
- **Access:** Tailscale peer-to-peer VPN for secure remote access without port forwarding

## Who It's For

- Barristers and chambers handling document-heavy commercial litigation
- Law firms with privacy-sensitive practices (fraud, family, regulatory)
- Any legal team that needs AI-powered document review but cannot use cloud platforms
- Mid-market firms (10–100 lawyers) priced out of enterprise platforms like Harvey

## Deployment Model

Each client gets their own DGX Spark unit, configured and deployed at their premises. The system is self-contained — no ongoing cloud dependency. Setup, ingestion, and training are handled as a managed service by Humanity³.

---

*Built by Humanity³ (H³) — a division of Tutto Products and Services*
