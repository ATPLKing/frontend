# ATPLKing Frontend

**ATPLKing** is a modern digital platform designed to support aspiring airline pilots in preparing for the **Airline Transport Pilot License (ATPL)** exams.  
This repository contains the **frontend** application that delivers a clean, responsive, and interactive user interface for engaging with ATPL question banks and explanations.

---

## 🎯 Project Overview

This project serves as the user-facing web interface and is built with the following goals in mind:

- ✅ Provide a distraction-free quiz experience
- ✅ Support dark/light theme toggling
- ✅ Display detailed explanations for each question
- ✅ Ensure full responsiveness across devices

---

## Tech Stack

| Tech                | Role                                 |
|---------------------|--------------------------------------|
| **React 19**        | UI framework                         |
| **TypeScript**      | Typed JavaScript                     |
| **Vite**            | Build tool & dev server              |
| **MUI (Material UI)** | Component library & theming        |
| **React Router**    | Client-side routing                  |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API

The app talks to the ATPLKing backend API. By default it targets `http://localhost:3000`.

Copy the example environment file and adjust it if your backend runs elsewhere:

```bash
cp .env.example .env
```

| Variable         | Description                      | Default               |
|------------------|----------------------------------|-----------------------|
| `VITE_API_URL`   | Base URL of the backend API      | `http://localhost:3000` |

### 3. Run the dev server

```bash
npm run dev
```

Open your browser and navigate to the URL printed in the terminal (usually `http://localhost:5173`).

---

## Scripts

| Command             | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start the Vite dev server                |
| `npm run build`     | Type-check and build for production      |
| `npm run lint`      | Run oxlint                               |
| `npm run preview`   | Preview the production build locally     |

---

## Project Structure

```
src/
├── components/   # Reusable UI components (Header, SubjectAccordion)
├── pages/        # Route-level pages (Home, Quiz, Result, Historic)
├── theme/        # MUI theme & dark/light mode context
└── utils/        # API client, localStorage helpers, domain logic
```

## LICENSE

This project is licensed under the GNU General Public License v3.0.
You are free to use, modify, and distribute it under the terms of the license.

![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)

## Contact Me

Feel free to reach out to me through any of the following platforms:

<div align="center">
  <a href="https://github.com/Chesterkxng" target="_blank" style="text-decoration: none; color: #333;">
    <img src="https://img.shields.io/badge/GitHub-%23121011?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="mailto:cgoita00@gmail.com" target="_blank" style="text-decoration: none; color: #333;">
    <img src="https://img.shields.io/badge/Email-%23D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail" />
  </a>
  <a href="https://discord.com/users/chesterkxng" target="_blank" style="text-decoration: none; color: #333;">
    <img src="https://img.shields.io/badge/Discord-%237289DA?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" />
  </a>
  <a href="https://www.linkedin.com/in/cheick-goïta" target="_blank" style="text-decoration: none; color: #333;">
    <img src="https://img.shields.io/badge/LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</div>
