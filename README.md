# 📊 React Native Expense Tracker App

A simple personal **expense tracker** built with **Expo**, **Supabase**, **Zustand**, and **TypeScript**.

This project allows users to:

- Track their **expenses**
- Visualize categories in a **monthly donut chart**
- Manage entries with **add / edit / delete** features
  ➡️ All synced securely with **Supabase Authentication + Database**.

---

## ✨ Features

### 🔐 Authentication (Supabase)

- Email + password signup
- Email confirmation support
- Secure login
- Persisted session with **AsyncStorage**
- Auto token refresh + app-state handling

### 💸 Expense Tracking

- Add new expenses
- Edit saved expenses
- Delete expenses with confirmation
- View all expenses for the selected month
- Fast UI updates with **Zustand** store

> 📝 **Note:** This app tracks **expenses only**. No income field is used.

### 📅 Month Picker

- Choose any **month & year**
- Automatically load expenses for the selected period
- Displays a label like **“November 2025”**

### 📊 Monthly Donut Chart

- Groups expenses by **category**
- Auto-generated **HSL colors**
- Interactive tooltips
- Clean list summary with **category totals**

### 🎨 Dark / Light Theme

- Fully supports system color scheme
- Uses a shared theme file for consistent styling

---

## 🏗️ Tech Stack

| Purpose          | Technology                               |
| ---------------- | ---------------------------------------- |
| Framework        | React Native (Expo)                      |
| Backend          | Supabase (Auth & Database)               |
| Local Storage    | AsyncStorage                             |
| State Management | Zustand                                  |
| Charts           | `react-native-gifted-charts`             |
| Date Picker      | `@react-native-community/datetimepicker` |
| Navigation       | Expo Router                              |
| Language         | TypeScript                               |

---

## 🗄️ Database (Supabase / PostgreSQL)

This app uses **Supabase (PostgreSQL)** to store all expense data.

It mainly uses two tables:

- `auth.users` – built-in Supabase **Auth** table that stores user accounts
- `categories` – list of expense categories (e.g. `Food`, `Transport`, `Rent`)
- `transactions` – each expense, linked to a user and a category

## 📦 Folder Structure

```bash
/app
  / (auth)
  / (tabs)
  RootLayout.tsx

/api
  getMonthly.ts
  deleteTransaction.ts

/components
  Cards.tsx
  ModalAdd.tsx
  MonthlyDonutChart.tsx
  ModalEdit.tsx

/globalStore
  transactionStore.ts
  userStore.ts

/hooks
  useLogin.ts
  useSignup.ts





```
