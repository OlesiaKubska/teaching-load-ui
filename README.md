# 📚 Teaching Load UI (Frontend)

Frontend part of the **Teaching Load Automation System**.  
The application allows administrators or the academic department to manage information about teachers, subjects, and teaching loads (lectures, practical classes, etc.).  

---

## 🚀 Tech stack
- [Angular 17+](https://angular.io/) — SPA framework  
- [Angular Material](https://material.angular.io/) — UI components  
- [RxJS](https://rxjs.dev/) — reactive programming  
- [TypeScript](https://www.typescriptlang.org/) — static typing  

---

## ⚙️ Installation & Run

### 1. Clone repository
```bash
git clone https://github.com/<your-username>/teaching-load-ui.git
cd teaching-load-ui/frontend
```
---

### 2. Install dependencies
```bash
npm install
```
---

### 3. Run locally
```bash
npm start
```
---

### Додаток буде доступний за адресою:
```bash
👉 http://localhost:4200
```
---

## 🌍 Environment setup

Base API URL is defined in `app.component.ts`:

```bash

apiBaseUrl = "http://localhost:5000/api";
```
---

## 📖 Usage

### The app manages three main entities:

- Teachers - manage teacher data (name, degree, position, experience).

- Subjects - manage subjects (name, hours).

- Loads - assign teaching load (teacher, subject, group, year, type of class).

### Features include:

- CRUD-operations (create, edit, delete)

- Filtering and search

- Pagination and sorting

- Data validation

---

## 🔗 Backend API
[teaching-load-api](https://github.com/OlesiaKubska/teaching-load-api)  
(Node.js + Express + MongoDB)

---

## 📜 License

MIT License
