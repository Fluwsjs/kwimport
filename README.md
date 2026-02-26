# KW Import – Import Zelf Regelen & BPM Berekenen

Professionele Nederlandse web-applicatie voor auto-import en BPM-berekeningen.

## Technische stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** – custom KW Automotive kleurenpalet
- **Prisma** + PostgreSQL
- **NextAuth v5** – authenticatie
- **React Hook Form** + Zod – formulieren & validatie
- **@react-pdf/renderer** – server-side PDF generatie
- **Nodemailer** – e-mail notificaties
- **Vitest** – unit tests

---

## Snel starten

### 1. Vereisten

- Node.js >= 18
- PostgreSQL database

### 2. Installeren

```bash
npm install
```

### 3. Environment variables

Kopieer `.env.example` naar `.env.local` en vul alle waarden in:

```bash
cp .env.example .env.local
```

Minimaal vereist:
- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_SECRET` – genereer met `openssl rand -base64 32`
- `NEXTAUTH_URL` – bv. `http://localhost:3000`

### 4. Database opzetten

```bash
npm run db:push       # Schema naar database pushen (development)
npm run db:seed       # Admin gebruiker aanmaken
```

Of gebruik migraties voor productie:
```bash
npm run db:migrate
```

### 5. Dev server starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pagina's

| Route | Beschrijving |
|---|---|
| `/` | Homepagina met hero, USPs en hoe-werkt-het |
| `/bpm-calculator` | Multi-step BPM calculator (personenauto) |
| `/bpm-via-link` | BPM berekenen via advertentielink (beta) |
| `/import-stappenplan` | Stap-voor-stap importgids |
| `/hulp-inschakelen` | Dienstenpakketten |
| `/contact` | Contactformulier + offerteaanvraag |
| `/admin` | Admin dashboard (beveiligd) |
| `/admin/leads` | Leads beheer |
| `/admin/berekeningen` | Berekeningen overzicht |

---

## BPM Calculator

De BPM-logica staat in `src/lib/bpm/`:

- `calculator.ts` – pure functions, geen side effects
- `tableRegistry.ts` – laadt tarieftabellen per jaar
- `types.ts` – TypeScript interfaces
- `tables/` – JSON tarieftabellen per jaar

### Tests uitvoeren

```bash
npm run test
```

### BPM tarieftabellen bijwerken

Zie `src/lib/bpm/tables/README_BPM_TABLES.md` voor instructies.

---

## Deployment

### Vercel (aanbevolen)

1. Push naar GitHub
2. Importeer in Vercel
3. Stel environment variables in
4. Deploy

### Zelf hosten (Docker)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npx prisma generate
CMD ["npm", "start"]
```

### Database migraties in productie

```bash
npx prisma migrate deploy
npm run db:seed
```

---

## Admin toegang

Standaard admin account wordt aangemaakt via seed script:

- E-mail: waarde van `ADMIN_EMAIL` env var (standaard: `admin@kwautomotive.nl`)
- Wachtwoord: waarde van `ADMIN_PASSWORD` env var

**Wijzig dit altijd in productie!**

---

## TODO – Uitbreidingen

### Voertuigtypes
- [ ] Bestelauto (N1 categorie) – eigen tariefschijven
- [ ] Motor / scooter – eigen tariefschijven
- [ ] Camper – eigen tariefschijven

### URL Adapters (BPM via link)
- [ ] AutoTrader UK adapter
- [ ] Marktplaats.nl adapter
- [ ] Gaspedaal.nl adapter
- [ ] Betere error handling bij bot-bescherming

### BPM Calculator
- [ ] Koppeling RDW Open Data API voor voertuiggegevens via kenteken
- [ ] Historische tarieftabellen (2020–2023)
- [ ] Meerdere voertuigen in één sessie opslaan
- [ ] Vergelijken forfaitair vs. koerslijst in één overzicht

### Admin
- [ ] Lead status aanpassen (drag & drop kanban)
- [ ] CSV export per datumrange
- [ ] E-mailcampagne integratie (Mailchimp/ActiveCampaign)
- [ ] Analytics dashboard (Chart.js)

### Overig
- [ ] i18n voor Belgische markt (BIV in plaats van BPM)
- [ ] Blog / kennisbank (MDX)
- [ ] WhatsApp Business link in contactpagina
- [ ] Cookie consent banner
