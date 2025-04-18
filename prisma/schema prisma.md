// prisma/schema.prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url = env("POSTGRES_PRISMA_URL")
directUrl = env("POSTGRES_URL_NON_POOLING")
}

// NextAuth.js Models
model Account {
id String @id @default(cuid())
userId String
type String
provider String
providerAccountId String
refresh_token String? @db.Text
access_token String? @db.Text
expires_at Int?
token_type String?
scope String?
id_token String? @db.Text
session_state String?

user User @relation(fields: [userId], references: [id], onDelete: Cascade)

@@unique([provider, providerAccountId])
@@index([userId])
}

model Session {
id String @id @default(cuid())
sessionToken String @unique
userId String
expires DateTime
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
id String @id @default(cuid())
name String?
email String? @unique
emailVerified DateTime?
image String?
accounts Account[]
sessions Session[]
decks Deck[]
cardProgress CardProgress[]
studySessions StudySession[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model VerificationToken {
identifier String
token String @unique
expires DateTime

@@unique([identifier, token])
}

// Flashcard Application Models
model Deck {
id String @id @default(cuid())
title String
description String?
isPublic Boolean @default(false)
userId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
cards Card[]
tags Tag[]
studySessions StudySession[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([userId])
}

model Card {
id String @id @default(cuid())
front String
back String
hint String?
deckId String
deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
progress CardProgress[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
order Int

@@index([deckId])
}

model Tag {
id String @id @default(cuid())
name String @unique
decks Deck[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model CardProgress {
id String @id @default(cuid())
userId String
cardId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
easeFactor Float @default(2.5)
interval Int @default(0)
repetitions Int @default(0)
nextReview DateTime @default(now())
lastReviewed DateTime @default(now())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@unique([userId, cardId])
@@index([userId])
@@index([cardId])
@@index([nextReview])
}

model StudySession {
id String @id @default(cuid())
userId String
deckId String
user User @relation(fields: [userId], references: [id], onDelete: Cascade)
deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
startTime DateTime @default(now())
endTime DateTime?
cardsStudied Int @default(0)

@@index([userId])
@@index([deckId])
}
