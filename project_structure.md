.
├── Dockerfile
├── README.md
├── app
│   ├── (protected)
│   │   ├── dashboard
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   ├── decks
│   │   │   │   ├── [deckId]
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── study
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── study
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   └── route.ts
│   │   │   └── signin
│   │   │   └── page.tsx
│   │   └── decks
│   │   ├── [deckId]
│   │   │   ├── cards
│   │   │   │   ├── [cardId]
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── study
│   │   │   │   │   └── route.ts
│   │   │   │   ├── reorder
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── route.ts
│   │   │   └── study-sessions
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── auth
│   │   ├── error
│   │   │   └── page.tsx
│   │   └── signin
│   │   └── page.tsx
│   ├── components
│   │   ├── auth
│   │   │   ├── auth-component.tsx
│   │   │   └── login-button.tsx
│   │   ├── dashboard
│   │   │   ├── dashboard-metrics.tsx
│   │   │   ├── dashboard-overview.tsx
│   │   │   └── layout.tsx
│   │   ├── decks
│   │   │   ├── card-skeleton.tsx
│   │   │   ├── deck-card.tsx
│   │   │   ├── deck-details.tsx
│   │   │   ├── deck-error.tsx
│   │   │   ├── deck-filters.tsx
│   │   │   ├── deck-form.tsx
│   │   │   ├── deck-skeleton.tsx
│   │   │   └── reorderable-card-list.tsx
│   │   ├── dialogs
│   │   │   ├── add-card-dialog.tsx
│   │   │   ├── delete-confirm-dialog.tsx
│   │   │   ├── edit-card-dialog.tsx
│   │   │   ├── edit-deck-dialog.tsx
│   │   │   ├── index.ts
│   │   │   └── share-deck-dialog.tsx
│   │   ├── providers
│   │   │   ├── auth-provider.tsx
│   │   │   └── toast-provider.tsx
│   │   ├── study
│   │   │   ├── study-dashboard.tsx
│   │   │   └── study-session.tsx
│   │   └── ui
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── pagination.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── use-toast.ts
│   ├── contexts
│   │   └── deck-context.tsx
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib
│   │   ├── auth.ts
│   │   ├── custom-prisma-adapter.ts
│   │   ├── prisma.ts
│   │   ├── transformers.ts
│   │   └── utils.ts
│   └── page.tsx
├── components.json
├── docker-compose.yml
├── hooks
│   ├── use-deck.ts
│   └── use-toast.ts
├── lib
│   ├── transformers.ts
│   └── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20241024132738_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema prisma.md
│   ├── schema.prisma
│   └── schema.prisma:110
├── project_structure.md
├── public
│   ├── 42_Logo.svg
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   └── logo.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── types
├── deck.ts
├── index.ts
├── prisma.d.ts
└── study.ts

42 directories, 106 files
