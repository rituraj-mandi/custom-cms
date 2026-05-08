# Custom CMS Platform

A modern full-stack CMS platform built using:

- Next.js App Router
- TypeScript
- Supabase
- Editor.js
- Tailwind CSS

This repository contains:

- `admin-cms` → Admin dashboard/editor
- `user-cms` → Public frontend/blog viewer

---

## Admin Dashboard

<div align="center">
  <img src="img/AdminDashboard.png" alt="AdminDashboard"/>
</div>

---

## Create Page

<div align="center">
  <img src="img/CreatePage.png" alt="CreatePage"/>
</div>

---

## User CMS Home

<div align="center">
  <img src="img/UserHome.png" alt="UserHome"/>
</div>

---

## Blog Page

<div align="center">
  <img src="img/BlogPage.png" alt="BlogPage"/>
</div>

---

# Features

## Admin CMS

- Authentication
- Create posts
- Edit posts
- Delete posts
- Dashboard search
- Category & subcategory system
- Unsaved changes protection
- Media cleanup on discard
- Responsive UI
- Dark mode editor

---

## Editor.js Features

- Rich text editing
- Headers
- Lists
- Code blocks
- Tables
- Quotes
- Checklists
- Warnings
- Raw HTML
- Embeds
- Delimiters
- Image uploads
- Audio uploads
- Video uploads
- Carousel/gallery
- Mermaid diagrams
- LaTeX/KaTeX rendering
- Custom blocks

---

## User CMS

- Home page
- Dynamic blog pages
- Search dropdown
- Category filtering
- Subcategory filtering
- Latest-first posts
- Responsive design
- Carousel rendering
- Media rendering
- Mermaid rendering
- KaTeX rendering

---

# Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

---

## Backend

- Supabase Database
- Supabase Auth
- Supabase Storage

---

## Editor

- Editor.js
- Mermaid
- KaTeX

---

# Repository Structure

```txt
custom-cms/

├── admin-cms/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── types/
│   └── ...

├── user-cms/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── types/
│   └── ...

├── README.md
├── LICENSE
└── .gitignore
```

---

# Environment Setup

Create a Supabase project:

https://supabase.com

---

# Admin CMS Environment

Create:

```txt
admin-cms/.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

```

---

# User CMS Environment

Create:

```txt
user-cms/.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Database Setup

Inside Supabase SQL Editor run:

```sql
create table posts (
  id uuid default gen_random_uuid() primary key,

  title text not null,

  slug text unique not null,

  category text,

  subcategory text,

  thumbnail_url text,

  content jsonb,

  created_at timestamptz default now()
);
```

---

# Storage Bucket Setup

Go to:

```txt
Storage
```

Create bucket:

```txt
media
```

Enable:

```txt
Public Bucket
```

---

# Storage Policies

## Public Read Access

Operation:

```txt
SELECT
```

Expression:

```sql
true
```

---

## Authenticated Upload

Operation:

```txt
INSERT
```

Expression:

```sql
auth.role() = 'authenticated'
```

---

## Authenticated Delete

Operation:

```txt
DELETE
```

Expression:

```sql
auth.role() = 'authenticated'
```

---

## Authenticated Update

Operation:

```txt
UPDATE
```

Expression:

```sql
auth.role() = 'authenticated'
```

---

# Installation

Clone repository:

```bash
git clone YOUR_REPOSITORY_URL
```

---

# Install Admin CMS

```bash
cd admin-cms
npm install
```

Run:

```bash
npm run dev
```

---

# Install User CMS

Open another terminal:

```bash
cd user-cms
npm install
```

Run:

```bash
npm run dev
```

---

# License

MIT

---

# Author

Rituraj Mandi

GitHub:
https://github.com/rituraj-mandi
