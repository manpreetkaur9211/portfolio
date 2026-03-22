# Update Portfolio Content

Update portfolio data in `src/constants/userData.ts` and `src/constants/sectionData.ts`, sync the same changes into `public/resume.docx`, regenerate `public/resume.pdf`, verify everything on localhost, then commit and push to trigger Vercel deployment.


## What this skill covers

- **Hero** — introduction text
- **About** — bio paragraphs
- **Skills** — frontend / backend / other skill bars
- **Projects** — professional projects (`projects`) and personal projects (`selfProjects`)
- **Self Learning** — courses and learning entries (`selfLearning.courses`)

---

## Step 1 — Gather changes : 
Infer information from the technologies and tools user has learnt in the current session with claude and add anything meaningful that is missing from the introduction , about or skills section and adding it will be adding value to user\'s resume

---

## Step 2 — Apply updates
Update the gathered information in the following section if it makes sense to update it. Meaning, if adding it in particular section makes users profile stronger for job opportunities, add it.
- **Hero**:  introduction text
- **About**: updated bio paragraph(s)
- **Skills**: Any new skills to add (name, category, rough proficiency %)?
- **Projects**: New project to add, or updates to existing ones?
- **Self Learning**: New course or learning entry to add?
Edit `src/constants/userData.ts` directly. Follow these rules:
- Keep content **concise** — one-liner descriptions where possible
- Do **not** hardcode content in components — all data lives in `userData.ts` / `sectionData.ts`
- For skills, match the existing color pattern: frontend → `bg-blue-*`, backend → `bg-green-*` / `bg-teal-*`, other → `bg-purple-*` / `bg-orange-*`
- For new self-learning entries, increment the `id` and use `"#"` for `certificateUrl` if no URL is provided
- For new projects, increment the `id` and use `"#"` for `liveUrl`/`codeUrl` if not provided

---



## Step 3 — Sync changes into resume.docx and regenerate PDF
Update the gathered information in the following section if it makes sense to update it. Meaning, if adding it in particular section makes users profile stronger for job opportunities, add it.
Ignore if it already exists

After updating `userData.ts`, apply the same content changes to `public/resume.docx` using Microsoft Word COM via PowerShell, then export `public/resume.pdf`.

**Map portfolio sections → resume sections:**

| Portfolio change | Resume section to update |
|---|---|
| New self-learning course | Skills section (Full-Stack AI / relevant category) + Competencies |
| New skill | Skills section + Competencies |
| Updated bio / hero text | Professional Summary |
| New project | Work Experience bullet |

**Use this PowerShell pattern for each text change:**

```powershell
$docxPath = 'C:\Users\SuperPc\workspace\portfolio-hub\public\resume.docx'
$pdfPath  = 'C:\Users\SuperPc\workspace\portfolio-hub\public\resume.pdf'

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docxPath)

function DoReplace($find, $replace) {
    $doc.Content.Find.Execute($find, $false, $false, $false, $false, $false, $true, 1, $true, $replace, 2) | Out-Null
}

# Apply one DoReplace call per changed  if user asks to replace the text otherwise add skill or competency, e.g.:
DoReplace 'old skills text' 'new skills text'
DoReplace 'old competency'  'new competency'

$doc.Save()
$doc.SaveAs([ref]$pdfPath, [ref]17)   # 17 = wdFormatPDF
$doc.Close()
$word.Quit()
```

**Resume content rules:**
- Always use the term **"AI-Assisted Development"** for AI/Claude Code mentions — never "agentic systems" or other jargon
- Skills section groups: `Full-Stack AI`, `Front End Development`, `Back End Development`, `Testing Frameworks`, `UI Libraries`, `Cloud & Services`
- New self-learning items → add to `Full-Stack AI` skills group and to `Competencies`
- Keep resume language concise and action-verb led

---

## Step 4 — Verify on dev server

Start the dev server in the background:

```bash
npm run dev
```

Wait for it to be ready, then tell the user:
- The dev server is running (check the port in output, usually http://localhost:8080 or 8081)
- Ask them to verify the updated sections look correct in the browser
- Ask them to click the **Resume** button (Navbar / About / Contact) and confirm the downloaded PDF shows the updated content
- Ask: **"Does everything look good? Type 'yes' to proceed with the commit and push to Vercel."**

---

## Step 5 — Commit and push to Vercel

Once the user confirms, stage all changed files and commit:

```bash
git add src/constants/userData.ts src/constants/sectionData.ts  public/resume.pdf
git commit -m "Update portfolio and resume: <brief summary of what changed>"
git push origin master
```

Then tell the user:
- Changes pushed to GitHub
- Vercel will auto-deploy from the `master` branch — monitor at https://vercel.com/dashboard
- Both the portfolio site and the resume download will reflect the new content once deployed
