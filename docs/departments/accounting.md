# Accounting Department - AI Workshop Ideas

## Overview

The Accounting department participated in the Duvenbeck AI Workshop on October 8, 2025. This document outlines the AI initiatives proposed by the Accounting team, including detailed problem statements, solutions, and project analysis.

**Workshop Details:**

- Date: October 8, 2025
- Department: Accounting
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/Hsxx813xLtyu4B7p5WZTpw)

## AI Initiatives Summary

The Accounting department identified 4 key AI initiatives, prioritized based on complexity, cost, ROI, risk, and strategic alignment:

| Final Prio | Initiative | Owner | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| ---------- | ---------- | ----- | -------------- | ---------- | ---- | --- | ---- | --------- |
| 1 | Automated Reading of Documents (Orders/Delivery Notes) | Annette Gziello | A | 3/5 | 1/5 | 5/5 | 4/5 | 4/5 |
| 2 | Chatbot Solution for External Inquiries | Wadim Soroka | A | 5/5 | 3/5 | 3/5 | 4/5 | 2/5 |
| 3 | Automated Cash Forecast | Wadim Soroka | A | 1/5 | 3/5 | 5/5 | 3/5 | 5/5 |
| 4 | Automated Analysis of IC Differences | Patrick Dönges | A | 5/5 | 5/5 | 1/5 | 5/5 | 3/5 |

## Detailed Initiative Analysis

### 1. Automated Reading of Documents (Orders/Delivery Notes) (Final Prio: 1)

**Owner:** Annette Gziello

**Problem Statement:**
Manual reading of documents

**Proposed Solution:**
Reading of transport orders, delivery notes and contracts

**Project Metrics:**

- Complexity: 3/5 - Document type must be recognized
  Relevant information must generally be read from the document type
  For contracts: verification against specified parameters
  For invoices: pre-entry / booking
  For leasing recurring invoices: information storage in SAP
  For transport documents: information storage in Car_O
- Cost: 1/5 - High document volume (transport papers)
- ROI: 5/5 - Staff reduction possible in many areas
  Time savings
  faster liquidity
  higher data quality
- Risk: 4/5 - Possible misinterpretation by AI
- Strategic Alignment: 4/5 - Cost reduction in administration

**Project Brief:**

- **Project Sponsor:** Annette Gziello
- **Involved Teams:** Finance + others
- **Potential Conflicts:** Project work vs. daily business
- **Required Resources:**
- **Data Availability:** Various documents such as invoices, transport papers, contracts, etc.
- **GenAI Considerations:**
- **Timeline:**
- **Additional Comments:** Very general project
  can be divided into sub-projects
  e.g. delivery note analysis for billing
  contract analysis for different departments
  invoice receipt workflow
  storage of leasing data
  depending on the document type, different characteristics of further use of the determined data
  different follow-up workflows
  Adobe already has a similar process, which could be used as a reference.

### 2. Chatbot Solution for External Inquiries (Final Prio: 2)

**Owner:** Wadim Soroka

**Problem Statement:**
Creditor reminder and invoice inquiries require too much manual time

**Proposed Solution:**
Answers to these standard inquiries could quite simply be given by a chatbot

**Project Metrics:**

- Complexity: 5/5 - Categorization into customers / entrepreneurs
  clear information query (reference / transport order / credit note number)
  clear response with payment date or document copy (payment run)
- Cost: 3/5 - Potentially larger costs could arise from many queries
- ROI: 3/5 - Quick responses
  Customer satisfaction
  Transparency
- Risk: 4/5 - False information can be shared
  Feedback may not match entrepreneur data
- Strategic Alignment: 2/5 - Cost reduction in administration

**Project Brief:**

- **Project Sponsor:** Wadim Soroka
- **Involved Teams:** Accounting + Billing
- **Potential Conflicts:** Project work vs. daily business
- **Required Resources:**
- **Data Availability:** ERP and TMS data
- **GenAI Considerations:**
- **Timeline:**
- **Additional Comments:** Interpret information content from emails, derive and create to-dos.
  Depending on the topic, further downstream workflows can emerge from this

### 3. Automated Cash Forecast (Final Prio: 3)

**Owner:** Wadim Soroka

**Problem Statement:**
Cash forecast is lengthy due to various data sources

**Proposed Solution:**
Automated integration of all available sources and logical evaluation

**Project Metrics:**

- Complexity: 1/5 - Read CO budget, categorize, assign
  Customer/entrepreneur assignment
  Customer payment behavior
  Factoring forecast depending on billing status/speed
- Cost: 3/5 - Implementation costs possibly relatively high
  ongoing costs rather low, as query intensity is not so high
- ROI: 5/5 - Liquidity necessary for corporate management
- Risk: 3/5 - High complexity of different data sources
- Strategic Alignment: 5/5 - Liquidity necessary for corporate management

**Project Brief:**

- **Project Sponsor:** Wadim Soroka
- **Involved Teams:** Treasury, Controlling, Finance
- **Potential Conflicts:** Project work vs. daily business
- **Required Resources:**
- **Data Availability:** ERP and TMS, electronic banking (Coupa)
- **GenAI Considerations:**
- **Timeline:**
- **Additional Comments:** Plausibility check of data with e.g. traffic light system

### 4. Automated Analysis of IC Differences (Final Prio: 4)

**Owner:** Patrick Dönges

**Problem Statement:**
Occurrence and subsequent clarification of IC differences

**Proposed Solution:**
Automated analysis of differences, development of solution proposals

**Project Metrics:**

- Complexity: 5/5 - Evaluation of Excel tables exported from LucaNet (comparison of actual figures)
- Cost: 5/5 - Monthly evaluation, manageable scale of Excel tables
- ROI: 1/5 - (manageable) reduction of internal monthly activities
- Risk: 5/5 - No significant risk apparent
- Strategic Alignment: 3/5 - Unknown

**Project Brief:** _Not provided_

## Implementation Notes

Based on the provided data, the Accounting department has identified 4 AI initiatives with varying levels of complexity, cost, and strategic alignment. The initiatives range from document automation to cash forecasting, each with specific owners and detailed metrics from the workshop evaluation.

## Contact

For questions or additional information about these initiatives, please contact the respective initiative owners listed above.
