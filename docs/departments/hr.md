# HR - AI Workshop Ideas

## Overview

The HR (Human Resources) department participated in the Duvenbeck AI Workshop on October 6, 2025. This document outlines the AI initiatives proposed by the HR team, including detailed problem statements, solutions, and project analysis.

**Workshop Details:**

- Date: October 6, 2025
- Department: HR
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/bmHLS7MzZ7k0EI_ubnyKoA)

## AI Initiatives Summary

The HR department identified 5 key AI initiatives, prioritized based on complexity, cost, ROI, risk, and strategic alignment:

| Priority | Initiative                      | Owner | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ------------------------------- | ----- | -------------- | ---------- | ---- | --- | ---- | --------- |
| 1        | HR Data Dashboard/KPI Reporting |       | A              | 1/5        | 4/5  | 5/5 | 1/5  | 5/5       |
| 2        | Employee Information Dashboard  |       | A              | 1/5        | 4/5  | 5/5 | 1/5  | 5/5       |
| 3        | HR Agent for Questions          |       | A              | 1/5        | 4/5  | 4/5 | 4/5  | 3/5       |
| 4        | Vacation Management             |       | A              | 1/5        | 4/5  | 5/5 | 1/5  | 5/5       |
| 5        | Email Prioritization            |       | A              | 1/5        | 4/5  | 5/5 | 1/5  | 5/5       |

## Detailed Initiative Analysis

### 1. HR Data Dashboard/KPI Reporting (Priority: 1)

**Problem Statement:**
Data (master data & KPIs) must be retrieved from various systems and centrally consolidated and delivered to various stakeholders and shareholders.

**Proposed Solution:**
AI workflow for querying master data and defined KPIs and merging/consolidating as well as providing as reports and live dashboard

**Project Metrics:**

- Complexity: 1/5 - very complicated due to different specificities of country, business unit, locations, systems and payroll providers, plus complexity in data harmonization, probably not all data is currently available in the systems or in different places
- Cost: 4/5 - High costs when setting up the systems, later regarding running costs no high costs expected
- ROI: 5/5 - An HR dashboard at the respective organizational level leads to a significantly better decision-making basis for operational HR management --> greatly improved reporting, shareholder and stakeholder satisfaction, this represents a management tool that is not yet available to us today, this also leads to risk minimization, early warning systems, personnel deployment planning
- Risk: 1/5 - due to personal data
- Strategic Alignment: 5/5 - corresponds to Duvenbeck's strategic alignment

**Project Brief:**

- **Project Sponsor:** Wolfgang Kortus / Sven Grünwoldt
- **Involved Teams:** central HR management, contact persons for payroll providers in the countries (on Duvenbeck side and on the payroll provider side), IT, Corporate Development, Finance regarding reporting
- **Potential Conflicts:** Data harmonization / term definitions (e.g., FTE; Absence Status, etc.)
- **Required Resources:** null
- **Data Availability:** Basic data warehouse exists, currently expanding data queries, data scope table can then be made available
- **GenAI Considerations:** local hosting necessary, role concept / access rights / reporting regarding the HR dashboard
- **Timeline:** Q1 2026 for the first pilot, rollout during Q4 2026
- **Additional Comments:** null

### 2. Employee Information Dashboard (Priority: 2)

**Problem Statement:**
Gather information about an employee as a decision basis for any personnel measures. All necessary information for next steps must be retrieved from different systems (payroll system, personnel file, time information system, transfer matrix, etc.).

**Proposed Solution:**
Compilation of all important employee information in one overview

**Project Metrics:**

- Complexity: 1/5 - very complicated due to different specificities of country, business unit, locations, systems and payroll providers, probably not all data is currently available in the systems or in different places
- Cost: 4/5 - High costs when setting up the systems, later regarding running costs no high costs expected
- ROI: 5/5 - An HR dashboard at the respective organizational level leads to a significantly better decision-making basis for operational HR management --> greatly improved reporting, shareholder and stakeholder satisfaction, this represents a management tool that is not yet available to us today, this also leads to risk minimization, early warning systems, personnel deployment planning --> forms the basis for a consolidated HR dashboard / master data management
- Risk: 1/5 - due to personal data
- Strategic Alignment: 5/5 - corresponds to Duvenbeck's strategic alignment

**Project Brief:**

- **Project Sponsor:** Wolfgang Kortus / Sven Grünwoldt
- **Involved Teams:** central HR management, contact persons for payroll providers in the countries (on Duvenbeck side and on the payroll provider side), IT, Corporate Development, Finance regarding reporting
- **Potential Conflicts:** Data harmonization / term definitions (e.g., FTE; Absence Status, etc.)
- **Required Resources:** null
- **Data Availability:** Basic data warehouse exists, currently expanding data queries, data scope table can then be made available
- **GenAI Considerations:** local hosting necessary, role concept / access rights / reporting regarding the HR dashboard
- **Timeline:** Q2 2026 for the first pilot, rollout during Q4 2026
- **Additional Comments:** Dependent on the introduction of SAP Success Factors (SF can provide such an employee master data sheet)

### 3. HR Agent for Questions (Priority: 3)

**Problem Statement:**
Employees often don't have quick answers to HR questions.

**Proposed Solution:**
An HR agent provides immediate information on HR topics.

**Project Metrics:**

- Complexity: 1/5 - country-specific containers must be filled, possibly automatically filled, legal reliability, differences within a country (locations, collective bargaining), filling legal HR topics possible provider Haufe (for Germany)
- Cost: 4/5 - annual license costs for different country-specific providers, consider different language packages (countries but also driver personnel within a country)
- ROI: 4/5 - ROI highly dependent on the size of the country (number of employees), proportion of blue collar (rather high ROI) and white collar area, location with high turnover --> high ROI)
- Risk: 4/5 - rather low risk, as HR controls the content
- Strategic Alignment: 3/5 - Productivity increase, should refer to a digitalization strategy

**Project Brief:**

- **Project Sponsor:** Wolfgang Kortus / Sven Grünwoldt
- **Involved Teams:** Legal, IT, Regional HR managers, suppliers for legal content
- **Potential Conflicts:** potential resource conflicts
- **Required Resources:** null
- **Data Availability:** Prior decision on scope of HR chatbot (which questions should be covered)
  Suppliers provide legal data, regional HR managers must provide Duvenbeck-specific data
- **GenAI Considerations:** local hosting necessary,
  country-specific containers or each country/region/location has specific chatbot content,
  decision on foreign languages to be used,
  decision on text, voice or video - chatbot
- **Timeline:** Q3 2026 for pilot
- **Additional Comments:** Scalability to an onboarding chatbot and topics outside of HR (e.g., breakdown assistance for drivers)

### 4. Vacation Management (Priority: 4)

**Problem Statement:**
Vacation: Employee vacation requests regarding remaining vacation balance, all vacation requests via D3 (in GER) are manually entered into the time information program, vacation requests from D3 need to be incorporated into the work schedule

**Proposed Solution:**
Determination of current vacation balances, automated transmission to employees. Digital vacation requests must be automatically considered in the work schedule. The system captures approved vacation requests from D3 into the time recording program

**Project Metrics:**

- Complexity: 1/5 - very complicated due to different specificities of country, business unit, locations, systems and payroll providers, plus complexity in data harmonization, probably not all data is currently available in the systems or in different places
- Cost: 4/5 - High costs when setting up the systems, later regarding running costs no high costs expected
- ROI: 5/5 - Management of vacation provisions, flows into management of temporary work, if vacation phases are compensated by temporary work (mainly affects blue collar in PCL)
- Risk: 1/5 - due to personal data
- Strategic Alignment: 5/5 - Productivity increase, should refer to a digitalization strategy

**Project Brief:**
To be developed

### 5. Email Prioritization (Priority: 5)

**Problem Statement:**
Prioritization of emails in Outlook, automatic reminders for unprocessed emails

**Proposed Solution:**
Email evaluation, response suggestions in connection with Duvenbeck-specific knowledge, email reminders, prioritization

**Project Metrics:**

- Complexity: 1/5 - Complexity lies in training Duvenbeck-specific knowledge
- Cost: 4/5 - Costs for local hosting, one-time costs for building the workflow, possibly server costs
- ROI: 5/5 - Time savings, thus productivity increase
- Risk: 1/5 - Prerequisite: local hosting, in this case personal data is protected
- Strategic Alignment: 5/5 - Digitalization strategy

**Project Brief:**
To be developed

## Implementation Notes

The HR initiatives focus on centralizing HR data, improving employee self-service, and automating routine tasks to enhance operational efficiency. The top three priorities (HR Data Dashboard, Employee Information Dashboard, and HR Agent) all have complete project briefs with Wolfgang Kortus and Sven Grünwoldt as sponsors. The HR Data Dashboard is prioritized highest with a pilot planned for Q1 2026, followed by the Employee Information Dashboard in Q2 2026, and the HR Agent in Q3 2026.

## Contact

For questions or additional information about these initiatives, please contact the HR department leadership.
