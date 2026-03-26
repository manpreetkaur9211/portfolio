---
name: find-jobs
description: Scrape fresh job listings from LinkedIn and Seek into Google Sheets. Use when user wants to find jobs, search for roles, update the job sheet, or refresh job listings.
disable-model-invocation: true
---

# Find Jobs

Scrape senior full-stack / frontend job listings from LinkedIn, Seek, and Indeed into a Google Sheet with 3 tabs: High-Scale, Mid-Scale, and Startups — sorted by match score.

## What this skill does

- Fetches up to 30 high-scale, 30 mid-scale, and 20 startup job postings
- Sources: LinkedIn Jobs, Seek.com.au, Indeed Australia (via Apify)
- Auto-classifies companies by size and scores each job against your skill profile
- Writes results to Google Sheets — re-runs only add new listings, never duplicates

---

## Step 1 — Set up Apify (if you haven't already)

Apify is the scraping platform that handles LinkedIn and Seek on your behalf.

1. Go to **https://apify.com** → Sign Up (free account includes $5/month in credits — enough for many runs)
2. After logging in: **Console → Settings → Integrations → API tokens**
3. Click **Create new token** → copy the token value

Keep this token ready for Step 3.

---

## Step 2 — Set up Google Sheets access

The script writes to Google Sheets via a service account. Do this once:

**2a. Create a Google Cloud project:**
1. Go to **https://console.cloud.google.com**
2. Create a new project (e.g., `job-scraper`)
3. Enable these two APIs:
   - **Google Sheets API** (search → Enable)
   - **Google Drive API** (search → Enable)

**2b. Create a service account:**
1. IAM & Admin → Service Accounts → **Create Service Account**
2. Name it `job-scraper`, click Create
3. Grant role: **Editor** → Continue → Done
4. Click the service account → **Keys** tab → **Add Key → Create new key → JSON**
5. Download the file → rename it to `gcp-service-account.json`
6. Move it into `scripts/job-scraper/gcp-service-account.json`

**2c. Create your Google Sheet:**
1. Create a new blank Google Sheet at **https://sheets.google.com**
2. Share it with the service account email (looks like `job-scraper@your-project.iam.gserviceaccount.com`) → **Editor** access
3. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

---

## Step 3 — Configure the scraper

Copy the example config and fill in your credentials:

```bash
cd scripts/job-scraper
cp config.example.json config.json
```

Open `config.json` and replace:
- `YOUR_APIFY_API_TOKEN` → your Apify token from Step 1
- `YOUR_GOOGLE_SHEET_ID` → your Spreadsheet ID from Step 2c
- `google_credentials_path` → leave as `./gcp-service-account.json` (already in the right place)

Ask the user: "Have you filled in `config.json` with your Apify token and Google Sheet ID? Type 'yes' to continue."

---

## Step 4 — Install dependencies

```bash
cd scripts/job-scraper
npm install
```

This installs `apify-client` and `googleapis`.

---

## Step 5 — Run the pilot (20 jobs preview)

Before the full scrape, do a quick 20-job pilot to confirm quality:

```bash
cd scripts/job-scraper
npm run pilot
```

This fetches 20 jobs from LinkedIn Melbourne only and prints them to the console — no Google Sheets writes yet.

Tell the user:
- Check the table output — look for Senior Frontend / Full Stack roles
- Jobs with a **Match Score of 80+** are strong fits for your profile
- If results look off (wrong roles, wrong location), adjust `keywords` in `config.json` and re-run `npm run pilot`

Ask: "Do the results look good? Type 'yes' to proceed with the full scrape."

---

## Step 6 — Full scrape → Google Sheets

Once the pilot looks good, run the full scrape across all sources:

```bash
cd scripts/job-scraper
npm run scrape
```

This will:
1. Search across all 5 keywords × 3 sources in parallel (takes 3–8 minutes)
2. Deduplicate and classify each job (High-Scale / Mid-Scale / Startup)
3. Score every job against your React, Angular, TypeScript, Node.js, Next.js, AI-Assisted development profile
4. Write results into your Google Sheet — 3 tabs, sorted by Match Score descending

Tell the user:
- Open your Google Sheet — you'll see 3 tabs: `High-Scale (>1000)`, `Mid-Scale (200-1000)`, `Startups (<200)`
- **Match Score 80–100** = Strong match → prioritise applying to these
- **Match Score 60–79** = Good match → worth reviewing
- The Apply URL column links directly to the job listing

---

## Step 7 — Re-run to refresh listings

The scraper is idempotent — re-running it only adds new job listings (identified by unique Apply URL). Existing rows are never duplicated.

To refresh LinkedIn only:

```bash
cd scripts/job-scraper
npm run scrape:linkedin
```

Or to refresh all sources again:

```bash
cd scripts/job-scraper
npm run scrape
```

Run weekly to catch new postings.
