# QEHS - AI Workshop Ideas

## Overview

The QEHS (Quality, Environment, Health & Safety) department participated in the Duvenbeck AI Workshop on October 7, 2025. This document outlines the AI initiatives proposed by the QEHS team, including detailed problem statements, solutions, and project analysis.

**Workshop Details:**

- Date: October 7, 2025
- Department: QEHS
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/koYmYdx7nV8b3xk3Tgfm8w)

## AI Initiatives Summary

The QEHS department identified 3 key AI initiatives, prioritized based on complexity, cost, ROI, risk, and strategic alignment:

| Priority | Initiative                     | Owner | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ------------------------------ | ----- | -------------- | ---------- | ---- | --- | ---- | --------- |
| 1        | Document and Audit Automation  | QEHS  | A              | 3/5        | 2/5  | 3/5 | 3/5  | 4/5       |
| 1        | Training and Course Management | QEHS  | A              | 3/5        | 3/5  | 3/5 | 2/5  | 5/5       |
| 2        | Fake Carrier Detection         | QEHS  | A              | 4/5        | 4/5  | 5/5 | 4/5  | 5/5       |

## Detailed Initiative Analysis

### 1. Document and Audit Automation (Priority: 1)

**Owner:** QEHS

**Problem Statement:**
Preparation for audits and certifications is time-consuming and paper-intensive.

**Proposed Solution:**
AI organizes, updates and verifies documents automatically for completeness and compliance. AI evaluates past internal & external audit deviations, recognizes patterns (e.g., error clustering in processes) and reveals systematic weaknesses. This is then subsequently considered in audit planning (creation of checklist with planning etc.) AI checks whether local documents use the correct template, are content-compliant and complete – including formal & content analysis (upstream document audit)

**Project Metrics:**

- Complexity: 3/5 - Higher complexity due to many document types & standard references
- Cost: 2/5 - Medium to higher costs for AI verification & audit data connection (DMS, Imansys etc.)
- ROI: 3/5 - Very high benefit: better audit preparation, time savings, systematic risk analysis
- Risk: 3/5 - Medium risk with analysis errors – but internally well controllable
- Strategic Alignment: 4/5 - Actively supports certifications, IMS quality & standardization

**Project Brief:**

- **Project Sponsor:** CXO
- **Involved Teams:** QEHS, ISD, Security, possibly Legal (for Legal Compliance Audits)
- **Potential Conflicts:** Interface problems between local and central documentation, different audit approaches, missing standardization
- **Required Resources:** Personnel, Budget, Technology
- **Data Availability:** Available, standard references and audits centrally available, local data would need to be stored centrally (DMS) if necessary
- **GenAI Considerations:** Prototype: Pilot for 1–2 locations/standards with defined document set
  Pilot design: Test run with auditor team (before/after comparison)
  Ethics & Data Protection: No sensitive personal data – possibly anonymize revision notes
  Scalability: t.b.d
  Change Management: Training of auditors & locations for new working method
- **Timeline:** Piloting within 3-6 months followed by implementation of all standards
- **Additional Comments:** DUV wide

### 2. Training and Course Management (Priority: 1)

**Owner:** QEHS

**Problem Statement:**
Mandatory training is difficult to track, and content is often not delivered in a personalized manner.

**Proposed Solution:**
AI systems manage training schedules, automatically remind about deadlines and adapt content to risk profiles. AI creates target-group-specific training (e.g., avatars, videos) automatically based on standard requirements & company-specific content (possibly also from legal requirements)

**Project Metrics:**

- Complexity: 3/5 - Training systems partially implemented in companies, not yet comprehensive. Content must sometimes first be created and standardized. Company structure/hierarchy must be available
- Cost: 3/5 - Medium investment for AI-based content & learning paths
- ROI: 3/5 - Less effort, better effectiveness, secure evidence chain for audits
- Risk: 2/5 - Moderate risk, content can be tested and adjusted internally
- Strategic Alignment: 5/5 - Directly standard-relevant (e.g., ISO, Legal Compliance), improves professional competence in the company and compliance with legal requirements

**Project Brief:**

- **Project Sponsor:** CXO, CPO
- **Involved Teams:** HR, QEHS, ISD, Security, operative branches that create training
- **Potential Conflicts:** Inconsistent training content/standards, local vs. central responsibilities, language barriers - translations
- **Required Resources:** Personnel, Budget, Technology
- **Data Availability:** Existing training documents (Excel, PowerPoint etc.) available, must be partially newly generated, employee profiles and roles partially not entirely clear - hierarchy etc.
- **GenAI Considerations:** Prototype: Test with 1 training (e.g., subcontractor deployment) for one target group
  Pilot design: Feedback round after first training module
  Ethics & Data Protection: Role-based data only anonymized, AI feedback without personal tracking
  Scalability: Content scalable per location & role
  Change Management: Involve training creators & specialist departments, test early
- **Timeline:** Piloting within 1-3 months followed by implementation for additional training
- **Additional Comments:**

### 3. Fake Carrier Detection (Priority: 2)

**Owner:** QEHS

**Problem Statement:**
Submitted subcontractor documents (e.g., EU license, insurance) are often incorrect, outdated, or forged

**Proposed Solution:**
AI checks subcontractor documentation for plausibility, irregularities and formal correctness – actively supporting fake carrier prevention and stopping their deployment (via TMS). Background checks, fraud detection, etc.

**Project Metrics:**

- Complexity: 4/5 - Technically demanding due to TMS integration & external data reconciliation and various TMS systems in the DUV world
- Cost: 4/5 - Higher costs for tools, databases, possibly government interfaces
- ROI: 5/5 - Enormous risk minimization (fraud, fines, reputation damage)
- Risk: 4/5 - Risk of false detection (e.g., legitimate carrier gets blocked), legal safeguarding necessary, damage regulation risk
- Strategic Alignment: 5/5 - Highly relevant for Supply Chain Security, TAPA/ISO 28000, customer requirements

**Project Brief:**

- **Project Sponsor:** COO
- **Involved Teams:** IMS-Carrier, Corporate Security, operative branches
- **Potential Conflicts:** Data exchange with external parties (data protection), blocking legitimate carriers, legal clarification for false positives, conflict with operative locations because central overrides subcontractor deployment
- **Required Resources:** Personnel, Budget, IT resources for programming TMS integration
- **Data Availability:** Subcontractor data, partially available, many manual → must be made automatically usable and must be current
- **GenAI Considerations:** Prototype: Comparison with known fake carriers from the past (blacklist model)
  Pilot design: Live test in one region or location
  Ethics & Data Protection: Clear rules for handling false detection, no personal data without protective measures
  Scalability: Fully scalable with stable TMS integration considering different TMS systems
  Change Management: Transparent communication to dispatch/locations, escalation levels for blocking
- **Timeline:** Piloting within 3-6 months followed by implementation at all locations/TMS systems
- **Additional Comments:** Complex interactions with many DUV central areas/operative locations

## Implementation Notes

The QEHS initiatives focus on improving compliance, safety, and quality management through AI-powered automation. The Fake Carrier Detection initiative is prioritized highest due to its potential for significant risk minimization and supply chain security improvements.

## Contact

For questions or additional information about these initiatives, please contact the QEHS department leadership.
