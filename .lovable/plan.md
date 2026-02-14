
# Capvest AI Trading Platform — Full Rebuild in React

## Overview
Rebuild the Capvest AI Trading platform as a modern, dark & premium React application with Supabase backend for authentication, user data, and admin functionality. Role-based access controls admin features within the same app.

---

## 1. Landing Page (Public)
A polished, dark-themed landing page with gold/amber accents featuring:
- **Hero section** with headline, subtitle, and CTA buttons (Sign Up / Sign In)
- **Market ticker** with live-looking crypto/forex prices scrolling
- **Platform metrics** (Win Rate, Avg Return, etc.) in a stats grid
- **Features section** — AI Predictions, Automated Trading, Financial Control cards
- **Comparison section** — "With Capvest AI" vs "Without" side-by-side
- **Investment plans preview** — summary of available packages
- **FAQ accordion** section
- **Footer** with branding and links
- **Multi-language support** (English, Spanish, French, German, Portuguese)

## 2. Authentication (Supabase)
- **Sign In** page with email/password
- **Sign Up** page with name, email, password, confirm password
- Password visibility toggle
- Supabase Auth for session management
- Profiles table for user data (name, user ID like CAI-XXXX)
- User roles table (admin vs user) for role-based access

## 3. User Dashboard (Authenticated)
- **Portfolio overview** — Total Balance, Weekly P&L, Active Plan, Next Distribution
- **Quick actions** — Fund Account, Withdraw buttons
- **Bottom navigation** — Trading, Packages, Dashboard, Deposit, Withdraw

## 4. Trading Page
- Platform description and certification badge
- Trusted institutions display
- Performance metrics grid
- Market ticker
- "How Our AI Works" explainer card
- Live system activity feed (simulated)

## 5. Investment Packages
- Cards for 7 tiers: Micro ($50) through Platinum ($5,000)
- Each shows investment amount, weekly earnings range, risk level
- Confirmation flow before investing
- Insufficient funds handling with redirect to deposit

## 6. Deposit Page
- Network selector (USDT TRC20, BTC, ETH, SOL)
- Wallet address display with copy-to-clipboard
- Deposit amount input
- Step-by-step instructions

## 7. Withdrawal Page
- Form with email, network selection, wallet address, amount
- Minimum $50 validation
- Withdrawal request submission

## 8. Account Settings
- Profile info (email, name)
- Change password form
- Logout button

## 9. Notifications
- List of notifications from admin
- Notification bell with unread count badge

## 10. Admin Features (Role-Based)
Visible only to users with the `admin` role:
- **Admin Dashboard** — User count, pending deposits/withdrawals, recent activity, CSV export
- **User Management** — Search users, edit balance/plan/P&L, ban/unban
- **Deposit Verification** — Approve/reject pending deposits
- **Withdrawal Processing** — Approve/reject withdrawal requests
- **Broadcast Notifications** — Send to individual user or all users
- **Registered Users List** — Full user directory
- **Platform Settings** — Min deposit, Telegram link, platform name, admin account

## 11. Database (Supabase)
- **profiles** table — user_id, name, email, capvest_id, balance, weekly_pnl, active_plan, banned status
- **user_roles** table — role-based access (admin/user)
- **deposits** table — user_id, amount, network, status, wallet address
- **withdrawals** table — user_id, amount, network, wallet address, status
- **notifications** table — target user, title, message, read status, timestamp
- **investments** table — user_id, plan name, amount, status
- RLS policies for all tables with admin override via security definer function

## Design Direction
- **Dark background** (#0c1427 / #0f172a gradient)
- **Gold/amber accents** for CTAs, highlights, and branding
- **Green** for positive values and success states
- **Red** for negative values and destructive actions
- Clean card-based layouts with subtle borders and shadows
- Premium typography with Inter font family
- Smooth animations and transitions
- Mobile-first responsive design
