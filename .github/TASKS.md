# Next Tasks — prioritized

This file lists the next work items for the repository, in priority order. Each entry includes a concise description, reproduction steps (when applicable), acceptance criteria, suggested branch name, labels, and an estimated ETA.

## 2) Labels on the overview tab are sometimes hidden behind the outer div

- Priority: P1
- ETA: 4-8 hours
- Labels: bug, ui

## Description

Some labels on the overview tab are not visible or are clipped because they render behind a parent container (overflow or z-index issues). This task fixes the CSS/layout so labels are readable and not clipped.

## Reproduction steps

1. Open the Overview tab in the app (or the page that contains the overview component).
2. Use a screen size or data set known to reproduce the issue (narrow width / many labels - if uncertain, try responsive widths and inspect with devtools).
3. Notice labels that are partially or fully hidden behind an outer container.

## Investigation notes (suggested)

- Inspect the DOM for the label elements and their parent containers. Look for `overflow: hidden` or clipped heights on container elements.
- Check z-index stacking contexts. If labels use absolute/fixed positioning, ensure they have a higher `z-index` than the clipping container and are not inside a stacking context that prevents visibility.
- If the issue is caused by `overflow-hidden` used for layout, consider changing to `overflow-visible` on the specific container or restructure the DOM so that labels are outside the clipped region.
- Review Tailwind utility classes on the component and its parents for `overflow-hidden`, `z-10`, `z-0`, `relative`, `absolute` etc.

## Acceptance criteria

- Labels on the Overview tab are fully visible at common breakpoints and data densities.
- Fix maintains intended layout and scrolling behavior; no new visual regressions are introduced.
- Add a small UI test or screenshot/snapshot if the project supports it.

---

If you take one of these tasks, please create a branch from `main`, keep commits focused, and open a PR describing the root cause and the fix. Ping @otavio-dlx for review when ready.
