# Workstation Frontend

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Firebase config
`lib/firebase.ts` এ আপনার Firebase config দিন।

### 3. Environment variables
`.env.local` এ backend URL দিন:
```
NEXT_PUBLIC_API_URL=https://ovi-workstation-backend.onrender.com
```

### 4. Run
```bash
npm run dev
```

---

## Folder Structure

```
app/
├── (auth)/
│   ├── login/page.tsx          ← Login page
│   └── register/page.tsx       ← Register page
│
├── (dashboard)/
│   ├── layout.tsx              ← AuthGuard + Sidebar (সবার জন্য)
│   ├── dashboard/page.tsx      ← User dashboard home
│   │
│   ├── workplace/
│   │   ├── server-copy/        ← NID server copy
│   │   └── services-history/   ← Service history + PDF download
│   │
│   ├── recharge/page.tsx       ← bKash recharge
│   ├── recharge-history/       ← Recharge history
│   │
│   ├── payment/
│   │   ├── mock/               ← Mock bKash page (test)
│   │   ├── success/            ← Payment success
│   │   └── failed/             ← Payment failed
│   │
│   └── admin/
│       ├── layout.tsx          ← AdminGuard (admin/super_admin only)
│       ├── users/page.tsx      ← Users list + wallet recharge
│       ├── transactions/       ← All transactions
│       └── settings/           ← Admin settings
│
├── layout.tsx                  ← Root layout
└── page.tsx                    ← Redirect to /dashboard

components/
├── sidebar/
│   ├── app-sidebar.tsx         ← Main sidebar
│   ├── nav-main.tsx            ← Role-based nav
│   ├── nav-user.tsx            ← User dropdown
│   ├── nav-header.tsx          ← Org header
│   └── sidebar.config.ts       ← ⭐ Nav config (এখানে route add করুন)
│
├── guards/
│   └── Guards.tsx              ← AuthGuard + AdminGuard
│
├── server-copy/
│   └── NidPdf.tsx              ← PDF component
│
├── auth/
│   └── register-form.tsx
│
└── ui/                         ← shadcn components

hooks/
├── useUser.ts                  ← User + wallet data
└── use-mobile.ts

lib/
├── api.ts                      ← ⭐ সব API calls এখানে
├── firebase.ts                 ← Firebase config
└── utils.ts
```

## নতুন Page যোগ করতে

### 1. File বানান
```
app/(dashboard)/my-page/page.tsx
```

### 2. Sidebar config এ যোগ করুন
`components/sidebar/sidebar.config.ts` এ:
```ts
{ title: "My Page", icon: SomeIcon, href: "/my-page" }
```

শেষ! আর কিছু করতে হবে না।

## Role System

| Role | Dashboard | Workplace | Admin Panel |
|------|-----------|-----------|-------------|
| user | ✅ | ✅ (charge ৳40) | ❌ |
| admin | ✅ | ✅ (free) | ✅ (users, transactions) |
| super_admin | ✅ | ✅ (free) | ✅ (all + settings, roles) |
