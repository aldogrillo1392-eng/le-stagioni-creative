# 🌿 Le Stagioni Creative — PWA Catalog

Web App Progressiva per il catalogo artigianale di **Le Stagioni Creative**.  
Stack: **Next.js 14 · React · TypeScript · Tailwind CSS · Firebase · Vercel**

---

## Struttura del progetto

```
le-stagioni-creative/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── robots.txt
│   └── images/                # logo.png, placeholder.jpg, og-cover.jpg
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home (hero + novità + categorie + evidenza)
│   │   ├── catalogo/page.tsx  # Catalogo con filtri
│   │   ├── prodotto/[slug]/   # Pagina prodotto con gallery + SEO
│   │   ├── admin/             # Area admin (login + CRUD + impostazioni)
│   │   ├── layout.tsx         # Root layout con font, provider, metadata
│   │   ├── sitemap.ts         # Sitemap dinamica
│   │   └── robots.ts          # robots.txt via Next.js
│   ├── components/
│   │   ├── catalog/           # ProductCard, ProductDetail, FiltersBar
│   │   ├── admin/             # ProductForm (create/edit con drag&drop)
│   │   ├── layout/            # Header, Footer
│   │   └── ui/                # Button (design system)
│   ├── hooks/
│   │   ├── useAuth.tsx        # Context Auth + login/logout/reset
│   │   └── useProducts.ts     # Hook per catalogo, novità, evidenza
│   ├── lib/
│   │   ├── firebase/          # client, auth, products, settings, storage
│   │   └── utils/             # cn, toSlug, formatPrice, formatDate, ...
│   ├── styles/globals.css     # Tailwind + custom CSS
│   └── types/index.ts         # Tutti i tipi TypeScript
├── firestore.rules            # Regole sicurezza Firestore
├── storage.rules              # Regole sicurezza Storage
├── .env.example               # Template variabili d'ambiente
└── next.config.mjs            # Next.js + PWA config
```

---

## Installazione locale

### 1. Prerequisiti

- Node.js 18+
- npm 9+ oppure pnpm 8+
- Un progetto Firebase (gratuito, piano Spark)

### 2. Clona il progetto

```bash
git clone https://github.com/tuo-username/le-stagioni-creative.git
cd le-stagioni-creative
npm install
```

### 3. Configura Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un nuovo progetto (es. `le-stagioni-creative`)
3. **Authentication** → Abilita "Email/Password"
4. **Authentication** → Users → Aggiungi utente: inserisci la tua email e password admin
5. **Firestore Database** → Crea database in modalità produzione
6. **Storage** → Inizializza

#### Copia le credenziali Firebase:

Project Settings → General → "Your apps" → Web app → Copia l'oggetto `firebaseConfig`

### 4. Variabili d'ambiente

```bash
cp .env.example .env.local
```

Apri `.env.local` e inserisci i valori del firebaseConfig:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=le-stagioni-creative.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=le-stagioni-creative
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=le-stagioni-creative.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://lestagionicreative.it
```

### 5. Configura le Security Rules Firestore

Nella Firebase Console → Firestore → Regole, incolla il contenuto di `firestore.rules`.

Poi crea una collection `admins` con un documento il cui ID è l'UID del tuo utente admin:

```
admins/
  └── [UID-del-tuo-utente]/
        email: "tua@email.it"
        role: "admin"
```

Puoi trovare l'UID in Authentication → Users → clicca sull'utente.

### 6. Configura le Storage Rules

Firebase Console → Storage → Regole → incolla il contenuto di `storage.rules`.

### 7. Aggiungi le immagini necessarie

Metti nella cartella `public/images/`:
- `logo.png` — il logo di Le Stagioni Creative
- `placeholder.jpg` — immagine placeholder per prodotti senza foto
- `og-cover.jpg` — immagine 1200×630 per Open Graph

### 8. Avvia in locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## Deploy su Vercel

### Metodo consigliato: import da GitHub

1. Crea repository su GitHub e fai push del codice
2. Vai su [vercel.com](https://vercel.com) → New Project
3. Importa il repository GitHub
4. Nella sezione "Environment Variables" aggiungi tutte le variabili da `.env.local`
5. Clicca "Deploy"

### Dominio personalizzato

In Vercel → Settings → Domains → aggiungi `lestagionicreative.it`  
Poi aggiorna i DNS del dominio puntando ai nameserver Vercel (o aggiungi record A/CNAME).

---

## Accesso all'area admin

1. Vai su `https://tuodominio.it/admin` (link nascosto nel footer)
2. Accedi con l'email e password create in Firebase Authentication
3. Il link admin nel footer diventa visibile solo passandoci sopra con il mouse (per discrezione)

---

## Funzionalità principali

### Area pubblica
- **Home**: hero animato, novità, griglia categorie, articoli in evidenza, CTA Instagram
- **Catalogo**: ricerca istantanea, filtri per categoria/stato/prezzo, griglia responsiva
- **Pagina prodotto**: gallery con miniature, condivisione, pulsante Acquista su Vinted, JSON-LD Schema.org

### Area admin
- **Catalogo admin**: tabella con tutte le azioni (modifica, duplica, elimina, nascondi, metti in evidenza, riordina)
- **Nuovo articolo / Modifica**: form completo con drag&drop immagini, compressione automatica in WebP, preview
- **Statistiche**: KPI, prodotti più visti, ultimi inseriti, distribuzione per categoria, export CSV
- **Impostazioni**: tutto il testo del sito modificabile senza codice (logo, colori, social, footer, contatti)

### PWA
- Installabile come app su smartphone (iOS e Android)
- Offline page
- Caching immagini Firebase Storage

---

## SEO incluso

- Meta title/description per ogni pagina e prodotto
- Open Graph (condivisione WhatsApp, Facebook, Instagram)
- Schema.org Product markup
- Sitemap dinamica generata da Firestore
- URL slug puliti (`/prodotto/portacandela-fiore`)

---

## Scalabilità futura

Il progetto è strutturato per aggiungere facilmente:

| Feature       | Da aggiungere                          |
|---------------|----------------------------------------|
| Wishlist      | `wishlists` collection in Firestore    |
| Recensioni    | `reviews` sub-collection per prodotto  |
| Newsletter    | Integrazione Mailchimp/Brevo via API   |
| Blog          | `posts` collection + MDX              |
| Notifiche Push| Firebase Cloud Messaging              |
| Carrello      | context locale → ordini in Firestore   |
| Pagamenti     | Stripe Checkout (da aggiungere)        |
| Account utenti| Firebase Auth + `users` collection     |

---

## Sicurezza

- **Firestore Rules**: solo l'admin autenticato può scrivere; tutto il resto è in lettura
- **Storage Rules**: upload solo per admin autenticati; max 10 MB per immagine
- **Auth**: sessione con scadenza a chiusura browser, recupero password via email, blocco dopo 5 tentativi
- **HTTP Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **HTTPS**: obbligatorio in produzione via Vercel

---

*Sviluppato con ❤️ per Le Stagioni Creative*
