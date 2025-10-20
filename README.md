# Duvenbeck AI Insights Dashboard

A React + TypeScript dashboard for visualizing AI initiative ideas from comprehensive workshops across all departments at Duvenbeck.

## 🚀 Live Demo

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 🧪 Testing & Data Quality

This project includes comprehensive data validation tests to ensure data integrity between frontend, documentation, and translation files.

### Running Tests

```bash
# Run all tests
npm test

# Run tests once (non-watch mode)
npm run test:run

# Run only data validation tests
npm run test:data

# Generate data quality report
npm run data-quality-report
```

### Important: Tests vs Build/Deploy

**The data validation tests are designed to identify data quality issues but will NOT prevent:**

- ✅ Local development (`npm run dev`)
- ✅ Production builds (`npm run build`)
- ✅ Vercel deployments

This ensures that data issues don't block development or deployment while still providing visibility into what needs to be fixed.

### Data Quality Report

Run `npm run data-quality-report` to generate a detailed report of any data issues:

- **Translation Issues**: Empty translation keys in `src/i18n/locales/`
- **Owner Issues**: Missing owner assignments in department data
- **Metrics Issues**: Values outside the 1-5 range for complexity, cost, ROI, risk, strategic alignment
- **Structure Issues**: Missing required fields or incorrect data formats

The report helps identify exactly what data needs to be collected from the team.

```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5a4ac7b1-bddc-4ab4-8522-9a1e39004185) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

Qdrant:

curl \
 -X GET 'https://8959e9b0-ec49-4675-86ba-2fa8a597acd0.europe-west3-0.gcp.cloud.qdrant.io:6333' \
 --header 'api-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.wEhKxw4ekc03-fcun-YbMg3tvGdNkCCGSbIeunYfE_g'
```
