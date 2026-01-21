# Richmond Family Place - Family Sign-in App 🏠

![Status](https://img.shields.io/badge/Status-Live-success)
![Platform](https://img.shields.io/badge/Platform-Netlify-00AD9F)
![Tech](https://img.shields.io/badge/Tech-Vue.js%20|%20GAS%20|%20Tailwind-blue)

**🔗 Live Demo:** [https://richmond-family-place-signin.netlify.app/](https://richmond-family-place-signin.netlify.app/)

**📊 Backend Database:** [View Live Google Sheet](https://docs.google.com/spreadsheets/d/13DAR0bZzFBHF7tdtvcdyWnh1I-87oQt50oXxGC6l_4s/edit?gid=0#gid=0)

---

### 📱 Scan to Visit
Scan the QR code below to access the sign-in app instantly on your mobile device:

<img src="singin-QR-code.png" alt="Scan to Sign In" width="200"/>

---

A modern, high-performance, and mobile-first sign-in solution built for community centers. This app streamlines the check-in process for families while maintaining a robust, synchronized database on Google Sheets.

## 🌟 Key Features

- **⚡ Optimistic UI**: Provides instant feedback upon submission, eliminating perceived network latency for a seamless user experience.
- **🧠 Smart Data Persistence**:
    - **Caching**: Remembers family details (Names, Membership, etc.) locally on the device for recurring visits.
    - **Context Awareness**: Automatically identifies returning users and differentiates between "First-time" and "Already Checked In" states.
- **🛡️ Enterprise-Grade Backend**:
    - Powered by **Google Apps Script** (GAS).
    - **Concurrency Control**: Implements `LockService` to prevent Race Conditions during high-concurrency peak hours.
    - **📅 Automated Archiving**: Includes a time-driven trigger that automatically migrates the previous month's data to a separate archive sheet (e.g., `Archive_Jan_2026`) on the 1st of every month. This keeps the active `Sheet1` lightweight and ensures long-term performance.
- **📱 Responsive & Native Feel**: Optimized for iOS and Android with careful attention to viewport-fit, touch targets, and non-scaling fonts.

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 (Composition API), Tailwind CSS, FontAwesome.
- **Backend**: Google Apps Script (JavaScript).
- **Database**: Google Sheets.
- **DevOps**: Git for version control, Netlify for automated deployment.

## 📊 Data Structure

The app stores data in a flattened format to support robust analytics:
- **ID**: Auto-incrementing unique identifier via Google Sheets formula.
- **Timestamp**: Precise server-side check-in time.
- **Family Info**: Consolidated family name, membership status, and contact details.
- **Granular Records**: Individual rows for each family member to enable detailed attendance reporting.

## 🔧 Installation & Deployment

1. **Google Sheets**:
   - Access the template structure here: [Link to Sheet](https://docs.google.com/spreadsheets/d/13DAR0bZzFBHF7tdtvcdyWnh1I-87oQt50oXxGC6l_4s/edit?gid=0#gid=0)
2. **Apps Script**: 
    - Copy the `Code.gs` into a new GAS project linked to the sheet.
    - Set up a **Time-driven Trigger** for the `monthlyArchive` function (e.g., Monthly on day 1).
    - Deploy as a **Web App** with "Anyone" having access.
3. **Frontend**:
    - Update the `scriptURL` in `index.html` with your deployed GAS URL.
    - Place the `singin-QR-code.png` in your project root.
    - Host on Netlify/GitHub Pages.

## 📝 License

Developed for Richmond Family Place. All identifying information and data handling comply with strict confidentiality standards.