# 🌍 REST Countries SPA (Vanilla JS + History API)

This project is a **Single Page Application (SPA)** built with **Vanilla JavaScript**, **TailwindCSS**, and the **REST Countries API**.  
It demonstrates how to implement **client-side routing** using the **History API** (via `history.back()`, `history.forward()`, `history.go()`) and **hash-based navigation** for handling routes.

---

## ✨ Features

- 🔍 **Search for countries** by name.
- 🌎 **Filter countries** by region.
- 📄 **View detailed information** for each country:
  - Native name
  - Population
  - Region & subregion
  - Capital(s)
  - Top-level domains
  - Currencies
  - Languages
  - Border countries
- 🔗 **Navigate between pages** without full reloads using hash-based routing.
- ⏪ **Back & Forward navigation** using History API (`history.back()`, `history.forward()`, `history.go()`).
- ⚡ **No frameworks** — built only with **Vanilla JS** + **TailwindCSS**.

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** (no frameworks)
- **TailwindCSS** for styling
- **History API** for browser navigation
- **Hash-based Routing** to avoid server configuration issues
- **REST Countries API** as the data source

---

## 🚀 Usage

1. Clone the repository:

```bash
   git clone https://github.com/your-username/rest-countries-spa.git
   cd rest-countries-spa
```
2. Run a local server (e.g., with VSCode Live Server):

```bash
npx serve
```

3. Open the app in your browser:

```bash
http://localhost:3000/spa/#/
```

---

## 🔄 Navigation
The app uses hash-based routes:
```
#/ → Countries Listing

#/country?countryName=comoros → Country Details

```
The History API is used to support navigation:
```
history.back() → go to previous page

history.forward() → go to next page

history.go(n) → go n steps forward or backward
```
---

## 🎯 Learning Purpose
This project was developed as a practice exercise to understand:

1. How SPAs work without frameworks.

2. How to implement routing in Vanilla JS.

3. How to use the History API effectively with hash-based navigation.

4. How to structure clean DOM rendering logic.

5. How to implement debouncing for search input to optimize API calls.

