# Strategic KAM Department - AI Workshop Ideas

## Overview

The Strategic KAM department participated in the Duvenbeck AI Workshop on October 7, 2025. This document outlines the AI initiatives proposed by the Strategic Key Account Management team, including detailed problem statements, solutions, and project analysis.

**Workshop Details:**

- Date: October 7, 2025
- Department: Strategic KAM
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/ZD9KFNqil-LmaJEc-47WtQ)

## AI Initiatives Summary

The Strategic KAM department identified 3 key AI initiatives, prioritized based on complexity, cost, ROI, risk, and strategic alignment:

| Priority | Initiative                    | Owner | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ----------------------------- | ----- | -------------- | ---------- | ---- | --- | ---- | --------- |
| 1        | Automated News Procurement    | MGE   | A              | 4/5        | 4/5  | 4/5 | 4/5  | 5/5       |
| 2        | Automated CRM Recommendations | -     | A              | 4/5        | 4/5  | 4/5 | 2/5  | 4/5       |
| -        | AI Contract Review            | -     | A              | 2/5        | 3/5  | 3/5 | 4/5  | 1/5       |

## Detailed Initiative Analysis

### 1. Automated Procurement of News and Potentially Required New Services (Priority: 1)

**Owner:** MGE

**Problem Statement:**
Much manual effort and research required to understand the economic situation of a customer and what new service types they might need

**Proposed Solution:**
AI-supported analysis of described points, automated notification about news in any direction

**Project Metrics:**

- Complexity: 4/5 - News crawling fundamentally simple. Connection to CRM increases effort. No intervention in critical systems necessary.
- Cost: 4/5 - CRM connection/integration? Licensing?
- ROI: 4/5 - Cost/benefit not directly derivable. Assumption: Research and preparation effort 1h/per customer. Could be reduced to 15 minutes
- Risk: 4/5 - No sensitive customer data required. Main danger lies in misjudgments or "hallucinations" of AI, but controllable through human validation.
- Strategic Alignment: 5/5 - Growth

**Project Brief:**

- **Project Sponsor:** Sales Leader KAM
- **Involved Teams:** KAM, IT
- **Potential Conflicts:** Budgets and capacities must be approved for IT development and external tools. Possible dependency on vendors (vendor lock-in) or data quality of external sources. So far, we have served our customers very individually - in the future, it should be a standardized process.
- **Required Resources:** Developers for implementing interfaces to news aggregators and CRM. License for news API or comparable services. Training budget for internal use.
- **Data Availability:** Public news sources and industry reports are freely available. Protected customer data and contract information: Very high sensitivity (internally structured).
- **GenAI Considerations:** Prototyping: Simple implementation possible - news crawler + summary
  MVP: CRM integration for real-time notifications possibly more complex
  Scalability: No major concerns
  Ethics: AI can "hallucinate" -> assign a person for validation who has a relationship with the customers/knows the customers. Ensure data protection requirements are met (what is processed where?)
  Change Management: More effort before short-term benefit - continuation only with standardized process, which may be rejected by some employees.
- **Timeline:** 2026/2027
- **Additional Comments:**

### 2. Automated Recommendations and Support in CRM System (Priority: 2)

**Owner:** To be assigned

**Problem Statement:**
High manual effort in CRM system through data collection and maintenance

**Proposed Solution:**
AI provides suggestions in CRM for input fields and supports keeping data current (opportunities etc.). Text fields are filled with suggestions that can be adopted or adjusted (Client Plan)

**Project Metrics:**

- Complexity: 4/5 - e.g. use existing Co-Pilot
- Cost: 4/5 - License costs (per user) can quickly become expensive
- ROI: 4/5 - difficult to measure
- Risk: 2/5 - Microsoft is already used as CRM and Co-Pilot is a component of it. Security measures are therefore based on Microsoft standards, which we would rate as very high.
- Strategic Alignment: 4/5 - Transparency - basic sales tool. Sales has the greatest influence on fulfilling the Duvenbeck strategy.

**Project Brief:**

- **Project Sponsor:** CRM Team
- **Involved Teams:** Sales, CRM, IT
- **Potential Conflicts:** Internally: Training and acceptance problem among sales staff if CRM tool is perceived as too complex or restrictive. Data quality: AI suggestions can only be as good as the data stored in the system. Cross-departmental data maintenance required.
- **Required Resources:** License for CRM with AI support (e.g., Microsoft Copilot for Sales). IT resources for customizing and interface integration. Change management: training, best practices and internal communication to increase acceptance.
- **Data Availability:** CRM data (contact data, opportunities, activities): Currently available, but quality varies. Historical datasets from sales activities: The longer the period, the better the AI predictions.
- **GenAI Considerations:** Prototyping: MVP with Copilot easy to implement as the product is already commercially available.
  MVP: Integration into existing Salesforce environment and definition of use cases (e.g., client plans)
  Scalability: Licenses can be scaled with growing use (high costs per user)
  Ethics: Internal sensitivity regarding AI-based suggestions -> create transparency; ensure AI does not make discriminatory or biased recommendations.
  Change Management: Clear communication that AI only serves as an "assistant", but sales retains control. Establish regular feedback loops with users. Training and best practice sharing necessary.
- **Timeline:** Open
- **Additional Comments:**

### 3. AI Takes Over Initial Contract Review

**Owner:** To be assigned

**Problem Statement:**
KAMs review initial contracts or contract renewals for unacceptable passages and contractual service scope - are we able to fulfill this?

**Proposed Solution:**
Use of LLM for reviewing specific contract constellations

**Project Metrics:**

- Complexity: 2/5 - legally and linguistically complex.
- Cost: 3/5 - AI costs low, as it's one document. Legal validation possibly expensive
- ROI: 3/5 - Depends on customer. If reaction time is long, no time advantage. Lower error rate - overlooking relevant information can reduce follow-up costs
- Risk: 4/5 - Legal relevance, potential misinterpretations, liability issues. Service catalog, use of sensitive contract data (data protection review)
- Strategic Alignment: 1/5 - Standardization - "avoidance" of possible efforts / costs

**Project Brief:** _To be developed_

## Implementation Notes

The Strategic KAM initiatives focus on enhancing customer relationship management through AI-powered automation and intelligence. The automated news procurement and CRM recommendations are prioritized highest due to their potential for significant time savings and improved customer service quality.

## Contact

For questions or additional information about these initiatives, please contact the Strategic KAM department leadership.
