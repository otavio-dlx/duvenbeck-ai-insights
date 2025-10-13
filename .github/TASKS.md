# Next Tasks — prioritized

This file lists the next work items for the repository, in priority order. Each entry includes a concise description, reproduction steps (when applicable), acceptance criteria, suggested branch name, labels, and an estimated ETA.

If you take one of these tasks, please create a branch from `main`, keep commits focused, and open a PR describing the root cause and the fix. Ping @otavio-dlx for review when ready.

## 🐛 Bugs (High Priority)

### 1. Fix Filter Alignment for Metrics and Ideas

**Description:** The filters in the sidebar are not properly aligned with the metrics and ideas displayed in the dashboard, causing inconsistent data visualization.

**Reproduction Steps:**

1. Navigate to the dashboard
2. Apply any filter in the sidebar (department, category, etc.)
3. Observe that metrics and ideas shown don't match the applied filter criteria

**Acceptance Criteria:**

- [ ] All metrics update correctly when filters are applied
- [ ] Ideas list reflects the same filter criteria as metrics
- [ ] Filter state is synchronized across all dashboard components
- [ ] No data inconsistencies between different sections

**Branch:** `fix/filter-alignment-metrics-ideas`
**Labels:** `bug`, `high-priority`, `dashboard`
**ETA:** 2-3 days

### 2. Fix Department Process Links Mix-up

**Description:** Process links are being incorrectly mixed up between different departments, showing wrong process documentation or workflows.

**Reproduction Steps:**

1. Navigate to a specific department view
2. Click on process links or workflow documentation
3. Observe that links lead to incorrect department processes

**Acceptance Criteria:**

- [ ] Each department shows only its own process links
- [ ] Links correctly navigate to the appropriate department documentation
- [ ] No cross-contamination of links between departments
- [ ] All process links are functional and accurate

**Branch:** `fix/department-process-links`
**Labels:** `bug`, `high-priority`, `navigation`
**ETA:** 1-2 days

## ✨ Features (Medium Priority)

### 3. Add Final Priority Filter to Sidebar

**Description:** Enhance the sidebar filters to include a "Final Priority" filter option, allowing users to filter ideas and metrics by their priority ranking.

**Acceptance Criteria:**

- [ ] New "Final Priority" filter appears in the sidebar
- [ ] Filter allows selection of priority ranges (e.g., 1-5, 6-10, etc.)
- [ ] Filter integrates with existing filter system
- [ ] Priority filter updates all dashboard components consistently
- [ ] Filter state persists across page navigation

**Branch:** `feature/final-priority-filter`
**Labels:** `feature`, `enhancement`, `filters`
**ETA:** 2-3 days

### 4. Add Priority Explanation Info Icon

**Description:** Add an informational icon next to the "Final Priority" header in the prioritization matrix table that explains the priority scoring system when clicked.

**Acceptance Criteria:**

- [ ] Info icon (ℹ️) appears next to "Final Priority" header
- [ ] Clicking the icon shows a modal or tooltip
- [ ] Explanation clearly states "1 is the most important priority"
- [ ] Modal/tooltip includes priority scale explanation (1-5 or similar)
- [ ] Icon is visually consistent with the app's design system
- [ ] Modal can be closed by clicking outside or using close button

**Branch:** `feature/priority-explanation-icon`
**Labels:** `feature`, `enhancement`, `ux`, `documentation`
**ETA:** 1-2 days
