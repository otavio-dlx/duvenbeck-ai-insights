# Central Solution Design - AI Workshop Ideas

## Overview

The Central Solution Design department participated in the Duvenbeck AI Workshop on October 7, 2025.

**Workshop Details:**

- Date: October 7, 2025
- Department: Central Solution Design
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/TOM6Ub03s6szHeDwbxKHug)

## AI Initiatives Summary

The Central Solution Design department identified 3 key AI initiatives:

| Priority | Initiative                    | Owner                                 | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ----------------------------- | ------------------------------------- | -------------- | ---------- | ---- | --- | ---- | --------- |
| 1        | 9 AM Process                  | Elias Stadtler / Jonas Ostendorf      | A              | 3/5        | 4/5  | 4/5 | 5/5  | 4/5       |
| 2        | Automated FTL Pre-calculation | Martin Kemper / Tender documents Elias | A              | 3/5        | 4/5  | 4/5 | 4/5  | 4/5       |
| 3        | Subcontractor Database        | Sofie Prem                            | A              | 2/5        | 3/5  | 3/5 | 5/5  | 4/5       |

## Detailed Initiative Analysis

### 1. 9 AM Process (Priority: 1)

**Owner:** Elias Stadtler / Jonas Ostendorf

**Problem Statement:**
9 AM process requires many resources (personnel, time)

**Proposed Solution:**
Workflow for retrieving RFQs / RFIs, summarizing and filling fields in CRM via an AI agent (Tool: Dynamics) / Automatic data download

**Project Metrics:**

- Complexity: 3/5 - Support from CRM team, agent must write to CRM / Workflow tool needs access to Outlook
- Cost: 4/5 - Number of tokens is manageable <1000 Euro per year / Purchase of workflow manager 600 Euro
- ROI: 4/5 - Productivity increase of employees, approx. 3 hours per day, but measurable effect on offer volume because more can be processed
- Risk: 5/5 - Data protection? Should be clarified
- Strategic Alignment: 4/5 - Correlates with growth goals

**Project Brief:**

- **Project Sponsor:** Elias Stadtler / Jonas Ostendorf
- **Involved Teams:** Tender management, CRM team, IT
- **Potential Conflicts:** Synergies between 9 am process and precalculation; no (potential) conflicts known
- **Required Resources:** Personnel: 
  - one FTE Tender management / Business Analytics
  Budget:
  - < 1,000 € AI agent, ~600 € Workflow platform (per year)
  Technologies:
  - CRM
  - n8n
  - Claude (Anthropic)
  - Outlook
- **Data Availability:** No data needs to be provided, historical tenders are available.
- **GenAI Considerations:** Prototype milestone: Test in CRM Sandbox
  Pilot design: POC in Sandbox by Sales employees
  Ethics and data protection: To be clarified whether customer information may be processed
  Scalability: n8n possible for other processes, otherwise: Process could be extended to include additional sub-processes
  Change Management: Training for workflow management and solution usage, possibly imanSys eLearning
- **Timeline:** MVP by end of October / early November 2025 (depending on authorizations from IT / CRM), POC end of 2025 / early 2026, Implementation Q1 2026
- **Additional Comments:** Very strong synergies with precalculation project, major effect on strategic goals such as bid volume

### 2. Automated FTL Pre-calculation (Priority: 2)

**Owner:** Martin Kemper / Tenderdokumente Elias

**Problem Statement:**
Time-consuming

**Proposed Solution:**
- Which loads are a perfect fit for this?
- Current costs / Provision of cost KPIs from actual figures / Own data
- Automatic capture of transport information from tender documents
- Automated creation of factsheets for companies / NDA extraction
- Correction of incorrect ZIP code entries / Plausibility check
- Automatic scheduling for calculation alignment in Outlook
- Pre-calculation on SharePoint

**Project Metrics:**

- Complexity: 3/5 - Depends heavily on the design and scope of functionality
- Cost: 4/5 - Processing of actual data and cost KPIs must be done independently of AI. This should build on the existing or planned reporting system
- ROI: 4/5 - Increases calculation reliability and improves probability of contract award
- Risk: 4/5 - Predominantly internal process / But data protection topic
- Strategic Alignment: 4/5 - Correlates with growth goals

**Project Brief:**

- **Project Sponsor:** Martin Kemper / Tenderdokumente Elias
- **Involved Teams:** Tender management, Road Sales, CRM, Legal, IT-BI
- **Potential Conflicts:** Synergies between 9 am process and precalculation; no (potential) conflicts known
- **Required Resources:** Personnel: 
  - one FTE Tender management
  Budget:
  - < 1,000 € AI agent, ~600 € Workflow platform (per year)
  Technologies:
  - CRM (+ SharePoint)
  - n8n
  - Claude (Anthropic)
  - IDL / CarO (Reporting system)
  - Excel
  - Outlook
- **Data Availability:** Transport data in CarO is available, historical NDAs are available
- **GenAI Considerations:** Prototype milestones: Focus on controlled experiments to validate feasibility.
  Pilot design: User-centered tests and iterations based on feedback.
  Ethics and data protection: e.g. anonymized data
  Scalability: Process could be extended to include additional sub-processes
  Change Management: Planning for user training and acceptance.
- **Timeline:** tbd, following the 9 am process (approx. 4 - 6 months)
- **Additional Comments:** Very strong synergies with precalculation project, major effect on strategic goals such as bid volume

### 3. Subcontractor Database (Priority: 3)

**Owner:** Sofie Prem

**Problem Statement:**
Information missing

**Proposed Solution:**
Structured provision of information / Automated transport requests to subcontractors / Price structure etc.

**Project Metrics:**

- Complexity: 2/5 - Building a new table in the database, creating a new report in the reporting system
- Cost: 3/5 - Development costs in data preparation and provision / Ongoing AI costs manageable
- ROI: 3/5 - Reduction of empty runs, thereby better utilization of equipment
- Risk: 5/5 - Internal POC
- Strategic Alignment: 4/5 - Correlates with growth goals

**Project Brief:**

- **Project Sponsor:** Sofie Prem
- **Involved Teams:** Road Sales, IT-BI, Business Analytics, Dispo
- **Potential Conflicts:** not known
- **Required Resources:** Personnel: 
  - IT personnel must be determined by IT, other areas only consulted (not a core task)
  Budget:
  - one-time development costs, estimation by IT-BI; AI costs + Workflow (<2,000 € p.a.)
  Technologies:
  - n8n
  - Claude (Anthropic)
  - IDL / CarO (Reporting system)
  - Excel (+ VBA)
- **Data Availability:** Transport data is available in CarO, Timocom and Transporeon connection
- **GenAI Considerations:** Prototype milestones: Focus on controlled experiments to validate feasibility.
  Pilot design: User-centered tests and iterations based on feedback.
  Ethics and data protection: Early protective measures (e.g., anonymized data, fairness audits).
  Scalability: Evaluation of infrastructure for larger implementations.
  Change Management: Planning for user training and acceptance.
- **Timeline:** Highly dependent on IT-BI schedule, during 2026
- **Additional Comments:** 
