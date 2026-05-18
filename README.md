# Mars Cafe Gardens 🌿

A premium, interactive restaurant website built with React 19, Vite, Tailwind CSS, and Convex.

## 🚀 Features

- **Dynamic Menu Management:** Real-time updates for food items, prices, and categories via a hidden Admin Panel.
- **Persistent Ordering System:** A fully functional cart that persists in the user's browser, linked directly to WhatsApp for easy checkout.
- **Live Gallery & Ambience:** Manage the restaurant's atmosphere with a persistent image gallery (supports mobile camera uploads).
- **Owner Branding System:** Upload and change the cafe logo anytime. Choose from multiple highlight themes to match the brand.
- **Interactive Reviews:** Real-time customer feedback and ratings.
- **Modern UI/UX:** Luxury deep-black theme with optimized mobile responsiveness for restaurant staff.
- **GitHub Pages Ready:** Configured for seamless deployment on GitHub Pages.

## 🛠️ Tech Stack

- **Frontend:** React 19, TanStack Router (Hash Mode), TanStack Query
- **Backend:** Convex (Real-time Database & Server Functions)
- **Styling:** Tailwind CSS v4
- **Persistence:** LocalStorage (for Cart and Logo) + Convex (for Menu, Settings, and Gallery)

## 📦 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/higenyiswaibu16-sudo/MARS-CAF-.git
    cd MARS-CAF-
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env.local` file with your Convex URL:
    ```env
    VITE_CONVEX_URL=your_convex_deployment_url
    ```

4.  **Run in development mode:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 🔒 Owner Panel Access

To access the hidden Owner Panel:
1.  Navigate to the homepage.
2.  Click on the **Restaurant Logo** (or name) in the navbar **5 times** rapidly.
3.  Enter the password: `marsadmin`

## 🚀 Deployment (GitHub Pages)

The project is pre-configured for GitHub Pages at `/MARS-CAF-/`. To deploy:
1.  Run `npm run build`.
2.  Push the contents of the `dist` directory to the `gh-pages` branch.

## 📄 License

MIT License - Copyright (c) 2024 Mars Cafe Gardens
