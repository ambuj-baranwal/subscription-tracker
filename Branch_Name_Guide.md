# 🌱 Branch Naming Convention for Starter Templates

This repository contains multiple starter templates for **Express.js apps**, each on a dedicated branch.
Branch names are **descriptive and consistent**, so you can easily switch to the setup you need.

## 🔑 Format

```js
express - [category] - [detail];
```

## 📂 Categories

- **db** → Database setup
- **auth** → Authentication setup
- **frontend** → Frontend integration
- **setup** → Deployment / tooling setup
- **test** → Testing frameworks & tools

## ✅ Examples

- **Database setups**

  - `express-db-sqlite`
  - `express-db-postgres`
  - `express-db-mongo`
  - `express-db-prisma-postgres`
  - `express-without-db`

- **Authentication**

  - `express-auth-jwt`
  - `express-auth-passport-local`
  - `express-auth-oauth-google`

- **Frontend integration**

  - `express-frontend-react-vite`
  - `express-frontend-nextjs`

- **Deployment / tooling**

  - `express-setup-docker`
  - `express-setup-vercel`
  - `express-setup-heroku`

- **Testing**

  - `express-test-jest`
  - `express-test-vitest`

## 💡 Usage

```bash
# clone repo
git clone <your-repo-url>
cd <repo-name>

# list available templates
git branch -r

# switch to desired template
git switch express-db-postgres
```
