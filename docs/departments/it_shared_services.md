# IT Shared Services - AI Workshop Ideas

## Overview

The IT Shared Services department participated in the Duvenbeck AI Workshop on October 8, 2025.

**Workshop Details:**

- Date: October 8, 2025
- Department: IT Shared Services
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/4LFOhXRZX1a9cHjbtC4e6A)

## AI Initiatives Summary

The IT Shared Services department identified 3 key AI initiatives:

| Priority | Initiative                         | Owner            | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ---------------------------------- | ---------------- | -------------- | ---------- | ---- | --- | ---- | --------- |
| A        | Automatic Data Quality Analysis    | Benedikt Weikamp | A              | 3/5        | 3/5  | 3/5 | 3/5  | 3/5       |
| A        | Internal Freight Exchange with AI  | Simon Zschunke   | A              | 1/5        | 2/5  | 5/5 | 4/5  | 5/5       |
| A        | Telematics-Based Cost Forecast     | Simon Zschunke   | A              | 3/5        | 3/5  | 5/5 | 2/5  | 5/5       |

## Detailed Initiative Analysis

### 1. Automatic Data Quality Analysis (Priority: A)

**Owner:** Benedikt Weikamp

**Problem Statement:**
[General] – Faulty or incomplete data inventories

**Proposed Solution:**
Error analysis master data (detection of false entries)

**Project Metrics:**

- Complexity: 3/5 - Apart from rule-based algorithms, there are many possible problems related to master data. Does the address really exist? Is it perhaps completely new and not yet contained in any map? Spelling of data can cause problems when different languages come into play, not just for addresses.
- Cost: 3/5 - Many people have to work on the topics. Additionally, many rules must be defined for how to handle which data. The costs arise here mainly on a personnel level
- ROI: 3/5
- Risk: 3/5
- Strategic Alignment: 3/5

**Project Brief:** _Not available in original data_

### 2. Internal Freight Exchange with AI Disposition (Priority: A)

**Owner:** Simon Zschunke

**Problem Statement:**
[Disposition] – Decentralized route planning in individual companies

**Proposed Solution:**
Something like an internal freight exchange with a recommendation on which truck the shipment could best be dispatched

**Project Metrics:**

- Complexity: 1/5 - Single file in Caro not available. Orders are copied internally instead of being dispatched as one order across multiple companies. Acceptance among dispatchers could be difficult. Everyone does their own thing. Master data is not maintained consistently, many duplicates in addresses. Geocoding would have to be checked.
- Cost: 2/5
- ROI: 5/5
- Risk: 4/5
- Strategic Alignment: 5/5

**Project Brief:**

- **Project Sponsor:** GF
- **Involved Teams:** Disposition, Fleet, BI, Master data
- **Potential Conflicts:** Intervenes in ongoing planning processes
- **Required Resources:** Dispatchers, TMS data
- **Data Availability:** Fleetboard, TMS data
Current TMS data necessary for search
- **GenAI Considerations:** Similar tours to the entered order can be found
What-if analysis

Transactions would need to be recorded promptly
- **Timeline:** 
- **Additional Comments:** 

### 3. Telematics-Based Cost Forecast (Priority: A)

**Owner:** Simon Zschunke

**Problem Statement:**
[Fleet] – High and unpredictable operating costs

**Proposed Solution:**
One could use telematics data for condition forecasting and cost prediction

**Project Metrics:**

- Complexity: 3/5 - Fleet telematics data such as tire pressures, usage severity, driver rating and repair data are already recorded. However, it could be difficult to assign individual invoice items to categories like tires, engine, etc. The data quality could be rather poor overall if SAP incoming invoices are not booked correctly
- Cost: 3/5 - Rather higher costs due to the amount of data. If the agent is added then it will probably check the data several times a day
- ROI: 5/5
- Risk: 2/5
- Strategic Alignment: 5/5

**Project Brief:**

- **Project Sponsor:** GF
- **Involved Teams:** Fleet, BI
- **Potential Conflicts:** 
- **Required Resources:** ML algorithm, Fleet, Accounting, IT, AI Agent
- **Data Availability:** Repair data, Fleetboard, Vehicle master data
- **GenAI Considerations:** Prototype with few trucks. Check simulated data against actual data. Repair data clustered by repair type.
Agent sends timely information when e.g. a tire goes flat or anomalies are present in the data

Large amounts of data
Users compare reports with messages from the agent. Mutual checking of all telemetry data (e.g. tire pressures)
- **Timeline:** asap
- **Additional Comments:** Data quality could be partially poor for recorded repair data. Input processes would need to be questioned
