# 🛡️ Watchtower

> **A smart and lightweight URL monitoring tool with built-in SSL tracking and instant notifications.**  
> *Keep watch. Stay ahead.*

---

## 🚀 Overview

**Watchtower** is a fullstack web application designed to monitor the health and security of your web services.  
It provides real-time status checks, SSL expiry tracking, automated alerts, and exportable reports — all managed through a simple, clean dashboard.

ฺSee Demo: [Watchtower](https://watchtower.wee-ed.org/)

---

## 🧰 Tech Stack

| Layer       | Technology            |
|-------------|------------------------|
| Frontend    | [Next.js 14](https://nextjs.org/) (App Router, TypeScript) |
| Backend     | [Watchtower-api](https://github.com/nattkarn/watchtower-api) |
| Database    | [PostgreSQL on Neon](https://neon.tech/) |
| ORM         | [Prisma](https://www.prisma.io/) |
| Notification| Email (Nodemailer) |
| Auth        | JWT + Bcrypt |
| Deployment  | - |

---

## ✨ Features

- ✅ Monitor HTTP status of any URL
- ✅ Track SSL certificate expiry (with warning threshold)
- ✅ Simple dashboard for viewing and managing all monitored URLs
- ✅ Email notifications when services go down or SSL is near expiry
- ✅ Export reports (CSV / PDF)
- ✅ Authenticated access for personal use

---

## 🛠️ Getting Started

## 📅 Roadmap

- [x] Project Initialization
- [ ] Core Setup: Auth, DB, Prisma
- [ ] URL Monitor + SSL Checker
- [ ] Notification system
- [ ] Export feature
- [ ] UI/UX polish and deploy
