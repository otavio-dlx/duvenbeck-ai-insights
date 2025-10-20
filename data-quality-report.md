# Data Quality Report

Generated on: 2025-10-20T11:16:46.461Z

⚠️  **3 data quality issue(s) found:**

## Translation Issues

🔴 **multiple**: Empty translation keys found

## Owner Issues

🔴 **corp_dev**: Empty owner fields

## Metrics Issues

🔴 **corp_dev**: Invalid metric values (outside 1-5 range)

## Recommended Actions

1. **Translation Issues**: Fill empty translation keys in `src/i18n/locales/`
2. **Owner Issues**: Assign owners to all ideas in department data files
3. **Metrics Issues**: Ensure all complexity, cost, roi, risk, strategic values are 1-5
4. **Structure Issues**: Follow the `NewFormatIdea` interface requirements

> 💡 These issues do not prevent the app from running but should be addressed for complete data integrity.
