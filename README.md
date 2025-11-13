📊 React Native Expense Tracker App

A simple personal expense tracker built with Expo, Supabase, Zustand, and TypeScript.

This project allows users to track their expenses, visualize categories in a monthly donut chart, and manage expense entries with add / edit / delete features — all synced securely with Supabase Authentication + Database.

✨ Features
🔐 Authentication (Supabase)

Email + password signup

Email confirmation support

Secure login

Persisted session (AsyncStorage)

Auto token refresh + app-state handling

💸 Expense Tracking

Add new expenses

Edit saved expenses

Delete expenses with confirmation

View all expenses for the selected month

Zustand store for fast UI updates

📅 Month Picker

Choose any month & year

Automatically load expenses for selected period

Shows label like “November 2025”

📊 Monthly Donut Chart

Groups expenses by category

Auto-generated HSL colors

Interactive tooltips

Clean list summary with totals

🎨 Dark / Light Theme

Fully supports system color scheme

Uses shared theme file

🏗️ Tech Stack
Purpose Technology
Framework React Native (Expo)
Backend Supabase (Auth & Database)
Local Storage AsyncStorage
State Management Zustand
Charts react-native-gifted-charts
Date Picker @react-native-community/datetimepicker
Navigation Expo Router
Language TypeScript
📦 Folder Structure
/app
/ (auth)
/ (tabs)
RootLayout.tsx

/api
getMonthly.ts
deleteTransaction.ts

/components
Cards.tsx
Modal.tsx
MonthlyDonutChart.tsx
TransactionModal.tsx

/globalStore
transactionStore.ts
userStore.ts

/hooks
useLogin.ts
useSignup.ts

🔧 Environment Variables

Create .env:

EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

🚀 Installation & Setup
npm install
npm install react-native-gifted-charts
npm install @react-native-async-storage/async-storage
npm install @react-native-community/datetimepicker
npm install @react-native-picker/picker
expo install expo-router

Run app:

npx expo start

🔐 Supabase Setup
categories
Column Type
id uuid
name text
transactions
Column Type
id uuid
user_id uuid
amount numeric
category_id uuid
date date
description text

No “income” field is required — the app handles expenses only.

🔍 Core Logic
💾 Get Monthly Expenses

getMonthlyTransactions():

calculates month boundaries

fetches only the user’s expenses

updates Zustand store

➕ Add Expense

Includes:

amount

category

date

optional description

✏️ Edit Expense

loads expense data

updates fields

saves to Supabase

❌ Delete Expense

confirms deletion

removes from Supabase

reloads monthly expenses
