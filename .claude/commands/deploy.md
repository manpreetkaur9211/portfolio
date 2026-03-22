# Deploy Resume

 verify on localhost, then commit and push to trigger Vercel deployment.

## Steps


### Step 1 — Start the dev server and verify

Start the dev server in the background:

```bash
npm run dev
```

Wait for it to be ready, then tell the user:
- The dev server is running at http://localhost:8080
- Ask them to verify: open the site, click the Resume button in the navbar and in the Contact section, confirm the new PDF downloads correctly
- Ask: "Does everything look good? Type 'yes' to proceed with the commit and push."

### Step 2 — Commit and push

Once the user confirms, stage all the diffs except public/resume.docx and commit:

```bash


git commit -m "Update resume PDF"
git push origin master
```

Then tell the user:
- The changes have been pushed to GitHub
- Vercel will automatically deploy — they can monitor it at https://vercel.com/dashboard
