# IT Shared Services - AI Workshop Ideas

## Overview

The IT Shared Services department participated in the Duvenbeck AI Workshop on October 8, 2025. This document outlines the AI initiatives proposed by the IT team, including detailed problem statements, solutions, and project analysis.

**Workshop Details:**

- Date: October 8, 2025
- Department: IT Shared Services
- Collaboard Link: [Workshop Board](https://web.collaboard.app/share/4LFOhXRZX1a9cHjbtC4e6A)

## AI Initiatives Summary

The IT Shared Services department identified 11 key AI initiatives, prioritized based on complexity, cost, ROI, risk, and strategic alignment:

| Priority | Initiative                         | Owner            | Priority Level | Complexity | Cost | ROI | Risk | Strategic |
| -------- | ---------------------------------- | ---------------- | -------------- | ---------- | ---- | --- | ---- | --------- |
| A        | AI-Assisted Workflow               | Robin Giesen     | B              | 3/5        | 3/5  | 3/5 | 3/5  | 4/5       |
| A        | Data Quality Analysis              | Benedikt Weikamp | A              | 3/5        | 3/5  | 3/5 | 3/5  | 3/5       |
| C        | Computer Vision Pallet Tracking    | Benedikt Weikamp | C              | 1/5        | 2/5  | 4/5 | 3/5  | 1/5       |
| A        | Automatic Gate Detection           | Benedikt Weikamp | C              | 4/5        | 3/5  | 4/5 | 3/5  | 1/5       |
| C        | Computer Vision Load Detection     | Benedikt Weikamp | C              | 3/5        | 2/5  | 1/5 | 4/5  | 2/5       |
| A        | Predictive Disposition Pricing     | Benedikt Weikamp | B              | 2/5        | 2/5  | 5/5 | 1/5  | 5/5       |
| B        | Intelligent KPI Chatbot            | Simon Zschunke   | B              | 2/5        | 2/5  | 1/5 | 3/5  | 2/5       |
| A        | Internal Freight Exchange          | Simon Zschunke   | A              | 1/5        | 2/5  | 5/5 | 4/5  | 5/5       |
| A        | Scenario-Based Financial Forecasts | Simon Zschunke   | B              | 2/5        | 4/5  | 3/5 | 2/5  | 4/5       |
| B        | Predictive HR Analytics            | Simon Zschunke   | B              | 4/5        | 5/5  | 5/5 | 1/5  | 2/5       |
| A        | Telematics Cost Forecast           | Simon Zschunke   | A              | 3/5        | 3/5  | 5/5 | 2/5  | 5/5       |

## Detailed Initiative Analysis

### 1. AI-Assisted Workflow / Wiki Help (Priority: A)

**Owner:** Robin Giesen

**Problem Statement:**
[General] – Missing ChatGPT interface for team members

**Proposed Solution:**
Introduction of a usable ChatGPT GUI to accelerate general tasks

**Project Metrics:**

- Complexity: 3/5
- Cost: 3/5
- ROI: 3/5
- Risk: 3/5
- Strategic Alignment: 4/5

**Project Brief:** _To be developed_

### 2. Automatic Data Quality Analysis (Priority: A)

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

**Project Brief:** _To be developed_

### 3. Computer Vision-Supported Pallet Tracking (Priority: C)

**Owner:** Benedikt Weikamp

**Problem Statement:**
[Warehouse] – Missing overview of pallet movements

**Proposed Solution:**
CV: Automated pallet tracking in the warehouse so that no adhesive labels are needed anymore. Today pallets remain standing that no one has "on their radar" anymore. This can also prevent incorrect loading if necessary

**Project Metrics:**

- Complexity: 1/5 - A hall gate doesn't just serve one truck parking space but often two. You have to recognize which forklift is now unloading which truck. Furthermore, you have to know what is on the truck and the system must have an "idea" of what what is on the truck should probably look like. This can be remedied for a first version with manual assistance, but the problem of camera lighting in the hall remains problematic. What if a pallet is placed in a blind spot? What if goods are placed outside the hall?
- Cost: 2/5 - A lot of hardware effort, cameras, computers with appropriate hardware to evaluate many images in a short time. Personnel effort in development
- ROI: 4/5
- Risk: 3/5
- Strategic Alignment: 1/5

**Project Brief:** _To be developed_

### 4. Automatic Gate Occupancy Detection (Priority: A)

**Owner:** Benedikt Weikamp

**Problem Statement:**
[Warehouse] – Missing transparency about hall gate occupancy

**Proposed Solution:**
CV: License plate recognition at the hall gate to automatically detect gate occupancy

**Project Metrics:**

- Complexity: 4/5 - License plate recognition already works today, e.g. in parking garages. Problems can arise when several license plate-like signs are attached to a truck trailer. Here the right one must be found for comparison with the system data.
- Cost: 3/5 - Hardware with camera quite cheap to make, only the hardware for evaluation could be somewhat more expensive. Software not very problematic due to already available libraries. (OpenCV, Pytesseract)
- ROI: 4/5
- Risk: 3/5
- Strategic Alignment: 1/5

**Project Brief:**

- **Project Sponsor:** GF
- **Involved Teams:** DevOps, Branch xy
- **Potential Conflicts:**
- **Required Resources:** Developer, Hardware for scanning, Hardware for detection/evaluation
- **Data Availability:**
- **GenAI Considerations:** Prototype/Pilot: Test at one gate with one device
  Data protection: License plates are scanned and stored
  Scalability: High
- **Timeline:**
- **Additional Comments:**

### 5. Computer Vision Load Detection (Priority: C)

**Owner:** Benedikt Weikamp

**Problem Statement:**
[Warehouse] – No overview of truck fill levels

**Proposed Solution:**
CV: Load detection in the truck. Fill level, loading sequence, load securing

**Project Metrics:**

- Complexity: 3/5 - Since several pallets stand one behind the other on the truck, not all are visible through just one camera even with side loading. Additionally, the depth relative to the trailer would have to be recognized. This may require several cameras.
- Cost: 2/5
- ROI: 1/5
- Risk: 4/5
- Strategic Alignment: 2/5

**Project Brief:** _To be developed_

### 6. Predictive Disposition & Price Planning (Priority: A)

**Owner:** Benedikt Weikamp

**Problem Statement:**
[Disposition] – Missing forecasts for demand and costs

**Proposed Solution:**
Disposition: Learning from historical data. What happens cyclically? Plant holidays, vacation times, Christmas, Easter. Truck procurement possibly more difficult at certain times, oversupply of trucks at other times. Important for price negotiations and planning. Knowledge previously only in the heads of dispatchers, if a dispatcher leaves the company the knowledge is gone.

**Project Metrics:**

- Complexity: 2/5 - The data available today must be laboriously cleaned before analysis can take place, as it is currently hardly usable. Furthermore, it must be modeled very precisely what one actually wants to know. A pure LLM-based approach will probably not work here.
- Cost: 2/5
- ROI: 5/5
- Risk: 1/5 - If the assessment is wrong, additional costs are produced through incorrectly purchased fleet
- Strategic Alignment: 5/5

**Project Brief:** _To be developed_

### 7. Intelligent KPI Query via Chatbot (Priority: B)

**Owner:** Simon Zschunke

**Problem Statement:**
[Reporting] – Missing orientation in report structures

**Proposed Solution:**
I ask the bot what the key figure for an area is

**Project Metrics:**

- Complexity: 2/5 - Key figures are indeed sometimes measured differently, building a central data pool of key figures is already in progress, but no data can currently be trained on it. Reports are partly fragmented, branch-specific, different reporting systems
- Cost: 2/5
- ROI: 1/5
- Risk: 3/5
- Strategic Alignment: 2/5

**Project Brief:** _To be developed_

### 8. Internal Freight Exchange with AI Disposition (Priority: A)

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

### 9. Scenario-Based Financial Forecasts (Priority: A)

**Owner:** Simon Zschunke

**Problem Statement:**
[Finance] – Lengthy, estimation-based planning

**Proposed Solution:**
About a suggestion of values for the future that forecasts data for the future based on different scenarios

**Project Metrics:**

- Complexity: 2/5 - What influencing factors are there? Internal ones can possibly be determined, external ones difficult to predict. Cost and revenue forecasting should however already be possible with sales and CRM. Not all areas are planned driver-based and database-supported.
- Cost: 4/5
- ROI: 3/5
- Risk: 2/5
- Strategic Alignment: 4/5

**Project Brief:** _To be developed_

### 10. Predictive HR Analytics (Priority: B)

**Owner:** Simon Zschunke

**Problem Statement:**
[HR] – Unexpected employee turnover

**Proposed Solution:**
Predicting employee departures

**Project Metrics:**

- Complexity: 4/5 - There is no central HR database yet that is kept consistent. However, data from companies is standardized in one database. Influencing factors (feature engineering) could become difficult if not all attributes are maintained
- Cost: 5/5
- ROI: 5/5
- Risk: 1/5
- Strategic Alignment: 2/5

**Project Brief:** _To be developed_

### 11. Telematics-Based Cost Forecast (Priority: A)

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

## Implementation Notes

The IT Shared Services initiatives focus on leveraging AI for operational efficiency improvements across logistics, fleet management, and data quality. The internal freight exchange and telematics cost forecast are prioritized highest due to their potential for significant cost reduction and operational optimization.

## Contact

For questions or additional information about these initiatives, please contact the IT Shared Services leadership.
