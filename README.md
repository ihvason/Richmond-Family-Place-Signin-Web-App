# Richmond Family Place - Family Sign-in App 🏠

![Status](https://img.shields.io/badge/Status-Live-success)
![Platform](https://img.shields.io/badge/Platform-Netlify-00AD9F)
![Tech](https://img.shields.io/badge/Tech-Vue.js%20|%20GAS%20|%20Tailwind-blue)

**🔗 Live Demo:** [https://richmond-family-place-signin.netlify.app/](https://richmond-family-place-signin.netlify.app/)

A modern, high-performance, and mobile-first sign-in solution built for community centers. This app streamlines the check-in process for families while maintaining a robust, synchronized database on Google Sheets.

## 🌟 Key Features

- **⚡ Optimistic UI**: Provides instant feedback upon submission, eliminating perceived network latency for a seamless user experience.
- **🧠 Smart Data Persistence**:
    - **Caching**: Remembers family details (Names, Membership, etc.) locally on the device for recurring visits.
    - **Context Awareness**: Automatically identifies returning users and differentiates between "First-time" and "Already Checked In" states.
- **🛡️ Enterprise-Grade Backend**:
    - Powered by **Google Apps Script** (GAS).
    - Implements **`LockService`** to prevent Race Conditions during high-concurrency peak hours.
    - **Atomic Writes**: Uses flattened data structures to ensure data integrity and prevent row misalignment.
- **📱 Responsive & Native Feel**: Optimized for iOS and Android with careful attention to viewport-fit, touch targets, and non-scaling fonts.

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 (Composition API), Tailwind CSS, FontAwesome.
- **Backend**: Google Apps Script (JavaScript).
- **Database**: Google Sheets.
- **DevOps**: Git for version control, Playwright (planned) for automated testing.

## 📊 Data Structure

The app stores data in a flattened format to support robust analytics:
- **ID**: Auto-incrementing unique identifier via Google Sheets formula.
- **Timestamp**: Precise server-side check-in time.
- **Family Info**: Consolidated family name, membership status, and contact details.
- **Granular Records**: Individual rows for each family member to enable detailed attendance reporting.

## 🔧 Installation & Deployment

1. **Google Sheets**: Create a sheet named `Sheet1` with appropriate headers.
2. **Apps Script**: 
    - Copy the `gsheetapp.gs` into a new GAS project.
    - Deploy as a **Web App** with "Anyone" having access.
3. **Frontend**:
    - Update the `scriptURL` in `index.html` with your deployed GAS URL.
    - Host `index.html` on GitHub Pages, Vercel, or any static hosting service.

## 📝 License

Developed for Richmond Family Place. All identifying information and data handling comply with strict confidentiality standards.
