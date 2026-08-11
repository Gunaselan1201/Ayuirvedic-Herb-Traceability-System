# 🧪 Auto-Grade Calculation - Testing Guide

## How to Test the Auto-Grade Feature

### Prerequisites
✅ All servers are running:
- Backend: http://localhost:3001
- Lab Portal: http://localhost:3002/lab/
- Farmer Portal: http://localhost:5173

---

## Step-by-Step Testing

### 1. Go to Lab Portal
Open browser: **http://localhost:3002/lab/**

### 2. Select a Pending Batch
- Click on **"Test New Batch"** or **"Pending Tests"** from sidebar
- You should see pending batches from blockchain
- Click **"Start Testing"** on any batch

### 3. Watch the Auto-Grade Calculation

The **Quality Grade** field at the bottom of the form will show:
- **Auto-Calculated** badge (blue)
- It will update **in real-time** as you enter values
- Color-coded display (Green/Blue/Orange/Red)

---

## Test Scenarios

### 🟢 **Scenario 1: Grade A (Excellent)**
Enter these values to get Grade A:

**Physical Tests:**
- Moisture Content: `10` %
- Ash Value: `3` %
- Foreign Matter: `1` %

**Chemical Tests:**
- pH Level: `6.5`
- Pesticide Residue: `0.03` ppm
- Heavy Metals: Select **"Pass"**
- Solvent Residue: Select **"Pass"**
- Phytochemical Screening: Select **"Pass"**

**Biological Tests:**
- Microbial Test: Select **"Pass"**
- Fungal Count: `500` CFU/g
- E.coli/Salmonella: Select **"Absent"**
- Aflatoxin: `1` ppb

**Authentication:**
- DNA Verification: Select **"Pass"**
- FTIR Fingerprint: Select **"Pass"**

**Result:** Grade will show **"Grade A - Excellent ⭐"** in GREEN

---

### 🔵 **Scenario 2: Grade B (Good)**
Enter these values to get Grade B:

**Physical Tests:**
- Moisture Content: `13` % (slightly high)
- Ash Value: `4` %
- Foreign Matter: `1.5` %

**Chemical Tests:**
- pH Level: `7.8` (at limit)
- Pesticide Residue: `0.06` ppm (acceptable)
- Heavy Metals: Select **"Pass"**
- Solvent Residue: Select **"Pass"**
- Phytochemical Screening: Select **"Pass"**

**Biological Tests:**
- Microbial Test: Select **"Pass"**
- Fungal Count: `1200` CFU/g (slightly high)
- E.coli/Salmonella: Select **"Absent"**
- Aflatoxin: `3` ppb

**Authentication:**
- DNA Verification: Select **"Pass"**
- FTIR Fingerprint: Select **"Pass"**

**Result:** Grade will show **"Grade B - Good 👍"** in BLUE

---

### 🟠 **Scenario 3: Grade C (Conditional) - APPROVAL REQUIRED**
Enter these values to get Grade C:

**Physical Tests:**
- Moisture Content: `14` % (high)
- Ash Value: `6` % (high)
- Foreign Matter: `2.5` % (high)

**Chemical Tests:**
- pH Level: `8` (high)
- Pesticide Residue: `0.08` ppm (borderline)
- Heavy Metals: Select **"Pass"**
- Solvent Residue: Select **"Fail"** ❌
- Phytochemical Screening: Select **"Pass"**

**Biological Tests:**
- Microbial Test: Select **"Pass"**
- Fungal Count: `1500` CFU/g (high)
- E.coli/Salmonella: Select **"Absent"**
- Aflatoxin: `4` ppb (borderline)

**Authentication:**
- DNA Verification: Select **"Pass"**
- FTIR Fingerprint: Select **"Pass"**

**Result:** Grade will show **"Grade C - Acceptable ⚠️"** in ORANGE

**What Happens Next:**
1. Fill in Test Date, Test Time, Tested By fields
2. Click **"Submit Test Results"**
3. **Approval Dialog Appears!** 🎯
4. You'll see two buttons:
   - **"Approve for Manufacturing"** (Green)
   - **"Reject Batch"** (Red)
5. Choose one to proceed

---

### 🔴 **Scenario 4: Grade F (Failed) - AUTO-REJECTED**
Enter these values to get Grade F:

**Physical Tests:**
- Moisture Content: `10` %
- Ash Value: `3` %
- Foreign Matter: `1` %

**Chemical Tests:**
- pH Level: `6.5`
- Pesticide Residue: `0.03` ppm
- Heavy Metals: Select **"Fail"** ❌ (CRITICAL FAILURE!)
- Solvent Residue: Select **"Pass"**
- Phytochemical Screening: Select **"Pass"**

**Biological Tests:**
- Microbial Test: Select **"Pass"**
- Fungal Count: `500` CFU/g
- E.coli/Salmonella: Select **"Absent"**
- Aflatoxin: `1` ppb

**Authentication:**
- DNA Verification: Select **"Pass"**
- FTIR Fingerprint: Select **"Pass"**

**Result:** Grade will show **"Grade F - Poor ❌"** in RED

**What Happens:**
1. Grade F appears immediately when Heavy Metals = Fail
2. Red notification banner appears at bottom-right:
   **"Automatic Rejection - This batch has received Grade F due to critical test failures"**
3. When you submit, batch is automatically rejected (no approval dialog)
4. Appears in "Rejected/Failed" sections in both portals

**Other ways to trigger Grade F:**
- E.coli/Salmonella: Select **"Present"** (instant F)
- Aflatoxin: Enter **`6`** ppb or higher (instant F)
- Pesticide Residue: Enter **`0.15`** ppm or higher (instant F)

---

## Visual Indicators

### Quality Grade Display Changes:
- **Empty/Not Calculated**: Gray background, "Enter test results to calculate grade..."
- **Grade A**: Green background, green border, "⭐" emoji
- **Grade B**: Blue background, blue border, "👍" emoji
- **Grade C**: Orange background, orange border, "⚠️" emoji
- **Grade F**: Red background, red border, "❌" emoji

### Real-Time Updates:
- As soon as you enter **7 required numeric fields**, the grade calculates
- Change any value → Grade recalculates instantly
- Select "Fail" for Heavy Metals → Instantly shows Grade F
- Select "Present" for E.coli → Instantly shows Grade F

---

## Verifying the Results

### After Submitting Grade C (Approved):
1. Go to **Farmer Portal**: http://localhost:5173
2. Click **"Approved by Lab"** from sidebar
3. You should see the batch with Grade C
4. **"Download Report"** button should be visible (green)
5. Click to download PDF with all test results

### After Submitting Grade F (Rejected):
1. Go to **Lab Portal** → **"Rejected Batches"**
2. Batch should appear with Grade F
3. Go to **Farmer Portal** → **"Rejected/Failed"** (if that page exists)
4. Should also appear there

### Checking Blockchain:
1. Open `d:\herb2\ledger.json`
2. Find the latest event for your batch ID
3. Verify it has:
   ```json
   {
     "stage": "lab",
     "data": {
       "qualityGrade": "A" or "B" or "C" or "Rejected",
       "originalGrade": "A" or "B" or "C" or "F",
       "approvalStatus": "approved" or "conditionally_approved" or "rejected",
       "approvalDecision": "auto_approved" or "approve" or "reject" or "auto_rejected",
       "pdfReport": "data:application/pdf;base64,...",
       "pdfFilename": "LAB_REPORT_..."
     }
   }
   ```

---

## Troubleshooting

### "Grade doesn't appear"
- Make sure you've entered values for all 7 numeric fields:
  - Moisture Content
  - Ash Value
  - Foreign Matter
  - pH Level
  - Pesticide Residue
  - Fungal Count
  - Aflatoxin
- Check browser console (F12) for errors

### "Approval dialog doesn't show"
- Make sure the grade calculated is **exactly "C"**
- Grade C requires 5-6 points (see scoring in main doc)
- Try the Scenario 3 values exactly as listed above
- Make sure you clicked "Submit Test Results" button

### "PDF download doesn't work"
- Check if `pdfReport` field exists in blockchain event
- Try opening browser console (F12) to see errors
- Verify jsPDF is installed: `cd d:\herb2\src\labportal ; npm list jspdf`

### "Grade F doesn't auto-reject"
- Verify one of these conditions:
  - Heavy Metals = "Fail"
  - E.coli/Salmonella = "Present"
  - Aflatoxin > 5
  - Pesticide > 0.1
- Check the red notification appears at bottom-right

### "No pending batches to test"
- Go to **Farmer Portal**: http://localhost:5173
- Create a new batch using the Farmer form
- Wait 10 seconds for Lab Portal to refresh
- Or manually refresh the Lab Portal page

---

## Expected Behavior Summary

| Grade | Auto-Calculated? | User Action Required? | Result |
|-------|-----------------|----------------------|--------|
| **A** | ✅ Yes | ❌ No (auto-approved) | → Approved by Lab |
| **B** | ✅ Yes | ❌ No (auto-approved) | → Approved by Lab |
| **C** | ✅ Yes | ✅ **Yes (Approve/Reject)** | → Manufacturing OR Rejected |
| **F** | ✅ Yes | ❌ No (auto-rejected) | → Rejected/Failed |

---

## Quick Test Checklist

- [ ] Open Lab Portal (http://localhost:3002/lab/)
- [ ] Select a pending batch
- [ ] Start entering test values
- [ ] Watch Quality Grade field update in real-time
- [ ] See color change (Green/Blue/Orange/Red)
- [ ] Test Grade A scenario (all excellent values)
- [ ] Test Grade C scenario (borderline values)
- [ ] See approval dialog appear for Grade C
- [ ] Test Grade F scenario (Heavy Metals = Fail)
- [ ] See red notification for Grade F
- [ ] Submit and verify PDF downloads from Farmer Portal

---

**🎯 The key change:** The Quality Grade field is now **read-only** with a blue "✨ Auto-Calculated" badge, and it updates automatically as you type. You should see it change colors and grades in real-time!

**If you still don't see changes:**
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try in incognito/private window
4. Check the Lab Portal terminal for Hot Module Replacement (HMR) updates
