# Department Project Brief Management Workflow

## Overview
This document provides step-by-step instructions for agents to manage department project briefs within the Duvenbeck AI Workshop data system. This workflow ensures consistency, accuracy, and proper integration with the existing translation and data structure systems.

## Prerequisites
- Understanding of the translation key system (`department.category.identifier`)
- Familiarity with TypeScript department data files
- Knowledge of i18n translation file structure (de.json, en.json)
- Access to existing department files for reference patterns

## Workflow Steps

### Step 1: Department Data Updates
**Rule: NEVER add external information. Only update with provided data.**

When receiving new department spreadsheet information or data updates:

#### 1.1 Numerical Data Updates
- ✅ Update finalPrio, complexity, cost, roi, risk, strategicAlignment with provided values
- ✅ Use EXACT values from user spreadsheet (no interpretation)
- ✅ Set empty/missing numerical fields to appropriate null or 0 values
- ❌ DO NOT guess or estimate missing numerical values
- ❌ DO NOT search for external benchmarks or standards

**Example Update Process:**
```typescript
// Before (from existing file):
finalPrio: "1-A",
complexity: 4,
cost: 4,
owner: "",

// After (from user spreadsheet):
finalPrio: "1-A", // Keep existing if not provided
complexity: 3,    // Update with user value
cost: 4,         // Update with user value  
owner: "Corporate Development", // Add if provided, keep "" if empty
```

#### 1.2 Owner/Stakeholder Updates
- ✅ Add owner information EXACTLY as provided by user
- ✅ Keep owner as `""` (empty string) if not specified
- ✅ Update with user-provided stakeholder names/titles
- ❌ DO NOT assume or infer ownership from other data
- ❌ DO NOT add generic titles if not specified

#### 1.3 Translation Content Updates
- ✅ Update German translations (de.json) with user-provided German text
- ✅ Create professional English translations (en.json) ONLY from German text
- ✅ Keep missing content fields as `null` or empty strings
- ❌ DO NOT add content not provided by user
- ❌ DO NOT expand or interpret user content

#### 1.4 Missing Data Handling
**Critical Rule: Preserve empty/missing data as null or ""**

```typescript
// Correct handling of missing data:
owner: "", // Empty string if not provided
roi: null, // Null if not specified
additionalComments: null, // Null if no comments provided

// WRONG - Do not do this:
owner: "TBD", // Don't add placeholder text
roi: 0,       // Don't assume zero if not provided  
additionalComments: "None specified" // Don't add clarifying text
```

### Step 2: Data Updates Only - Content Rules
**Rule: NEVER add external information. Only update with provided data.**

When receiving new department information:
- ✅ Update ONLY the specific data provided by the user
- ✅ Keep missing information as `null` or `""` (empty string)
- ❌ DO NOT search for or add external information
- ❌ DO NOT make assumptions about missing data
- ❌ DO NOT expand or interpret beyond what is explicitly provided

### Step 3: Project Brief Structure Setup
**Reference: Use compliance.ts as the template pattern**

For departments that need project brief functionality:

1. **Identify existing project brief structure:**
   ```typescript
   // Example from compliance.ts
   projectBrief: {
     involvedTeamsKey: "compliance.projectBriefs.idea_identifier.involvedTeams",
     potentialConflictsKey: "compliance.projectBriefs.idea_identifier.potentialConflicts",
     dataAvailabilityKey: "compliance.projectBriefs.idea_identifier.dataAvailability",
     genaiConsiderationsKey: "compliance.projectBriefs.idea_identifier.genaiConsiderations",
     timelineKey: "compliance.projectBriefs.idea_identifier.timeline",
     additionalCommentsKey: "compliance.projectBriefs.idea_identifier.additionalComments"
   }
   ```

2. **For ideas without project briefs:**
   - Keep as `projectBrief: null`
   - Only add structure when user provides brief data

3. **For ideas with existing project briefs:**
   - Convert from direct text to translation keys
   - Follow the pattern: `department.projectBriefs.idea_identifier.field`

### Step 4: Translation Key Integration
**Follow established patterns for consistency**

#### Translation Key Structure:
```
department.projectBriefs.idea_identifier.field
```

#### Standard Fields:
- `involvedTeams` / `involvedTeamsKey`
- `potentialConflicts` / `potentialConflictsKey` 
- `dataAvailability` / `dataAvailabilityKey`
- `genaiConsiderations` / `genaiConsiderationsKey`
- `timeline` / `timelineKey`
- `additionalComments` / `additionalCommentsKey`

#### Additional Fields (when provided):
- `projectSponsor` / `projectSponsorKey`
- `requiredResources` / `requiredResourcesKey`

### Step 5: Brief Data Integration Process

When user provides project brief information:

1. **Identify the correct idea:**
   - Match user-provided information to existing idea identifiers
   - Use idea titles/descriptions to find the correct entry

2. **Extract ONLY provided information:**
   - Map spreadsheet columns to translation fields
   - Preserve original German text for de.json
   - Create professional English translations for en.json
   - Leave unspecified fields as `null`

3. **Update department.ts file:**
   ```typescript
   // Change from:
   projectBrief: null
   
   // To:
   projectBrief: {
     involvedTeamsKey: "department.projectBriefs.idea_name.involvedTeams",
     // ... other keys as needed
   }
   ```

4. **Add translations to de.json:**
   ```json
   "department": {
     "projectBriefs": {
       "idea_identifier": {
         "involvedTeams": "Original German text",
         "potentialConflicts": "Original German text or null",
         // ... other fields
       }
     }
   }
   ```

5. **Add translations to en.json:**
   ```json
   "department": {
     "projectBriefs": {
       "idea_identifier": {
         "involvedTeams": "Professional English translation",
         "potentialConflicts": "Professional English translation or null",
         // ... other fields
       }
     }
   }
   ```

### Step 6: Documentation Generation

After ALL project briefs are processed, create department documentation:

#### File Location:
`docs/[department_name].md`

#### Reference Template:
Use `docs/compliance.md` as the structure template

#### Content Sources (ONLY from project):
- Workshop date from `department.ts` home section
- Collaboard link from `department.ts` home section
- Initiative data from `department.ts` ideas array
- Problem statements from `i18n/locales/*.json`
- Solutions from `i18n/locales/*.json`
- Project metrics from `department.ts` (complexity, cost, ROI, risk, strategic)
- Project briefs from translation files
- Notes from translation files

#### Content Rules:
- ✅ Extract ALL content from project data files
- ✅ Use provided spreadsheet information
- ✅ Follow compliance.md structure and format
- ❌ NO external research or information
- ❌ NO assumptions about missing data
- ❌ NO expansion beyond provided material

## File Update Checklist

### Phase 1: Department Data Updates (`src/data/department.ts`)
- [ ] Numerical values updated EXACTLY from user spreadsheet
- [ ] finalPrio values match user-provided priorities
- [ ] complexity, cost, roi, risk, strategicAlignment updated with user numbers
- [ ] owner fields updated with exact user-provided text or kept as ""
- [ ] Missing numerical values set to null (not 0 or estimated)
- [ ] Empty text fields kept as "" (not "TBD" or placeholder text)
- [ ] NO external information or assumptions added
- [ ] NO interpretation or expansion of user data

### Phase 2: Translation Updates (`src/i18n/locales/`)
- [ ] German translations (de.json) updated with user-provided German text
- [ ] English translations (en.json) created from German text only
- [ ] Missing content fields set to null or ""
- [ ] NO external content or assumptions added
- [ ] NO expansion beyond user-provided material

### Phase 3: Department TypeScript File (`src/data/department.ts`)
- [ ] Project brief structures added for relevant ideas
- [ ] Translation keys follow proper naming convention
- [ ] Null values preserved for missing project briefs
- [ ] No information added beyond user input

### German Translations (`src/i18n/locales/de.json`)
- [ ] `department.projectBriefs` section added
- [ ] Original German text preserved exactly
- [ ] Missing fields set to `null`
- [ ] No external translation or interpretation

### English Translations (`src/i18n/locales/en.json`)
- [ ] `department.projectBriefs` section added
- [ ] Professional English translations provided
- [ ] Same structure as German version
- [ ] Missing fields set to `null`

### Documentation (`docs/department.md`)
- [ ] Follows compliance.md structure
- [ ] All information from project sources only
- [ ] Workshop details from department.ts
- [ ] Complete initiative analysis with project briefs
- [ ] Implementation notes based on translation data
- [ ] Contact information appropriate to department

## Common Patterns

### Identifier Creation:
```
German Title → English Identifier
"Marktanalyse-Automatisierung" → "market_analysis_automation"
"Dashboard/Reporting" → "dashboard_reporting"
"Vertragsdatenbank" → "contract_database"
```

### Translation Key Examples:
```
corp_dev.projectBriefs.market_analysis_automation.involvedTeams
compliance.projectBriefs.damage_claim_review.dataAvailability
department.projectBriefs.idea_identifier.field_name
```

### Project Brief Field Mapping:
| Spreadsheet Column | Translation Field | Key Suffix |
|-------------------|------------------|------------|
| Projekt Sponsor | projectSponsor | .projectSponsor |
| Involvierte Teams | involvedTeams | .involvedTeams |
| Potenzielle Konflikte | potentialConflicts | .potentialConflicts |
| Benötigte Mittel | requiredResources | .requiredResources |
| Datenverfügbarkeit | dataAvailability | .dataAvailability |
| GenAI-spezifische Überlegungen | genaiConsiderations | .genaiConsiderations |
| Grober Zeitplan | timeline | .timeline |
| Sonstige Kommentare | additionalComments | .additionalComments |

## Quality Control

### Before Completion:
1. **Verify data sources:**
   - All information traceable to user input or existing project files
   - No external research or assumptions made

2. **Check translation consistency:**
   - German and English files have matching structure
   - Translation keys properly referenced in department.ts

3. **Validate documentation:**
   - Follows established template structure
   - All content sourced from project data
   - No external information added

4. **Test translation system:**
   - Keys properly formatted and consistent
   - No missing references in department data files

## Error Prevention

### Common Mistakes to Avoid:

#### Data Update Mistakes:
- ❌ Adding information not provided by user
- ❌ Making assumptions about missing numerical values
- ❌ Setting empty fields to placeholder text ("TBD", "None", "N/A")
- ❌ Interpreting or expanding user-provided data
- ❌ Using external sources for "completion" or validation
- ❌ Estimating missing values based on similar entries

#### Translation Mistakes:
- ❌ Inconsistent translation key naming
- ❌ Mixing direct text with translation keys
- ❌ Adding extra fields not in user data
- ❌ Creating content not provided by user
- ❌ Expanding abbreviations or unclear text without user input

#### Example of CORRECT handling:
```typescript
// User provides: "Owner: CEO + COO + CIO, Complexity: 3, Cost: (empty)"
finalPrio: "2",
owner: "CEO + COO + CIO", // Exact user text
complexity: 3,            // User value
cost: null,              // Empty in user data = null
roi: null,               // Not provided = null
```

#### Example of INCORRECT handling:
```typescript
// DON'T do this:
finalPrio: "2",
owner: "Chief Executive Officer, Chief Operating Officer, Chief Information Officer", // Expanded
complexity: 3,
cost: 0,                 // Assumed zero for empty
roi: "TBD",             // Added placeholder
```

### Success Indicators:
- ✅ User can trace every piece of information to their input
- ✅ Translation system works correctly
- ✅ Documentation matches established patterns
- ✅ No external information contamination

## Department-Specific Notes

### Compliance Department (Reference)
- Complete project brief structure established
- 3 ideas with detailed project briefs
- Serves as template for other departments

### Corporate Development (Completed)
- 7 initiatives identified
- 3 project briefs completed (market_analysis_automation, dashboard_reporting, contract_database)
- Mixed field structure (some with projectSponsor, some without)

### Future Departments
- Follow this workflow exactly
- Adapt field structure based on user-provided spreadsheet columns
- Maintain consistency with established patterns

## Support Files

### Reference Files:
- `src/data/compliance.ts` - Project brief structure example
- `src/data/corp_dev.ts` - Translation key usage example
- `docs/compliance.md` - Documentation template
- `.github/AGENT_INSTRUCTIONS.md` - General project guidelines

### Translation Guidelines:
- Preserve original meaning in English translations
- Use professional business language
- Maintain consistent terminology across departments
- Keep null values for missing information

---

**Last Updated:** October 15, 2025  
**Created for:** Duvenbeck AI Workshop Project Brief Management  
**Usage:** Follow this workflow for ALL department project brief updates