# 42Recall

A spaced repetition flashcard application designed specifically for 42 School students to enhance their learning journey.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
  - [Running with Docker](#running-with-docker)
- [Project Structure](#project-structure)
- [Features in Detail](#features-in-detail)
  - [Deck Management](#deck-management)
  - [Study System](#study-system)
  - [Collaboration](#collaboration)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [UI Components](#ui-components)
- [📸 Showcase](#-showcase)
    - [🎯 Key Features Showcase](#-key-features-showcase)
        - [🔐 Authentication with 42](#-authentication-with-42)
        - [📚 Dashboard Overview](#-dashboard-overview)
        - [🎴 Deck Management](#-deck-management)
        - [✏️ Card Creation](#️-card-creation)
        - [📖 Study Mode](#-study-mode)
        - [📊 Progress Tracking](#-progress-tracking)
    - [👥 Collaboration Features](#-collaboration-features)
        - [🌙 Dark Mode Support](#-dark-mode-support)
        - [📱 Responsive Design](#-responsive-design)
    - [💡 Example Use Cases](#-example-use-cases)
        - [Project Preparation](#project-preparation)
        - [Exam Preparation](#exam-preparation)
        - [Concept Mastery](#concept-mastery)


## Features

- **Spaced Repetition Learning**: Optimize your study sessions with scientifically-proven spaced repetition techniques
- **Project-Based Organization**: Organize flashcards by 42 projects (Libft, ft_printf, get_next_line, etc.)
- **Code-Focused Cards**: Create cards with code snippets, explanations, and hints
- **Collaborative Learning**: Share decks with other 42 students
- **Progress Tracking**: Monitor your learning progress with detailed statistics
- **42 Authentication**: Secure login using 42 School's OAuth system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with 42 School OAuth
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Styling**: Tailwind CSS with CSS Variables for theming
- **Drag & Drop**: dnd-kit for card reordering
- **Charts**: Recharts for progress visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- 42 School OAuth credentials

### Environment Setup

Create a `.env` file with the following variables:

```env
# Database
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
POSTGRES_PRISMA_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
POSTGRES_URL_NON_POOLING=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# Authentication
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zelhajou/42recall.git
cd 42recall
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

You can also run the project with Docker using the provided `docker-compose.yml` file.

### Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/zelhajou/42recall.git
cd 42recall
```

2. Create a `.env` file with required environment variables:
```env
# Database
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
POSTGRES_PRISMA_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
POSTGRES_URL_NON_POOLING=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# Authentication
FORTYTWO_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

3. Build and run the containers:
```bash
docker-compose up -d --build
```

4. Run database migrations:
```bash
docker-compose exec app npx prisma migrate deploy
```

The application should now be running at [http://localhost:3000](http://localhost:3000).


## Project Structure

```
app/
├── (protected)/     # Protected routes requiring authentication
├── api/            # API routes
├── auth/           # Authentication pages
├── components/     # React components
│   ├── auth/       # Authentication components
│   ├── dashboard/  # Dashboard components
│   ├── decks/      # Flashcard deck components
│   ├── dialogs/    # Modal dialogs
│   ├── study/      # Study session components
│   └── ui/         # Reusable UI components
├── contexts/       # React context providers
├── lib/           # Utility functions and configurations
└── types/         # TypeScript type definitions
```

## Features in Detail

### Deck Management
- Create and manage flashcard decks
- Organize cards by 42 projects and topics
- Add code snippets and hints to cards
- Reorder cards via drag and drop
- Import/Export deck functionality

### Study System
- Spaced repetition algorithm for optimal learning
- Progress tracking per card and deck
- Study session statistics
- Review scheduling based on performance

### Collaboration
- Share decks with other students
- Public/Private deck settings
- Collaborative learning features

### Authentication
- Secure login with 42 School OAuth
- User profile and settings
- Logout functionality

### Dashboard
- Overview of study progress
- Statistics and charts
- Recent activity feed

### UI Components
- Custom UI components for consistent design
- Dark mode support with CSS Variables
- Responsive design for mobile and desktop

## 📸 Showcase

### 🎯 Key Features Showcase

#### 🔐 Authentication with 42

![Authentication](public/showcase/auth.png)
Clean and simple authentication using your 42 School credentials. Single-click login process with secure OAuth2 integration.


#### 📚 Dashboard Overview
![Dashboard](public/showcase/dashboard.png)
- Personal study progress tracking
- Quick access to recent decks
- Study streak monitoring
- Project completion statistics

#### 🎴 Deck Management
![Deck Management](public/showcase/decks.png)
Organize your study materials by:
- 42 School projects
- Topics and concepts
- Custom categories
- Public/Private visibility

#### ✏️ Card Creation
![Card Creation](public/showcase/card-creation.png)
Create rich flashcards with:
- Code syntax highlighting
- Markdown support
- Helpful hints
- Custom formatting

#### 📖 Study Mode
![Study Mode](public/showcase/study-mode.png)
Efficient study sessions with:
- Spaced repetition algorithm
- Progress tracking
- Performance statistics
- Answer validation

#### 📊 Progress Tracking
![Progress Tracking](public/showcase/progress.png)
Monitor your learning journey:
- Visual progress charts
- Project completion rates
- Study session history
- Retention analytics

### 👥 Collaboration Features
![Collaboration](public/showcase/collaboration.png)
Learn together with:
- Shared decks
- Public deck discovery
- Community contributions
- Peer learning

### 🌙 Dark Mode Support
![Dark Mode](public/showcase/dark-mode.png)
Comfortable studying in any lighting with:
- System theme detection
- Manual theme toggle
- High contrast options
- Eye-friendly design

### 📱 Responsive Design
![Responsive Design](public/showcase/responsive.png)
Study anywhere with full support for:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes


## 💡 Example Use Cases

### Project Preparation
Create decks for upcoming projects:
```plaintext
Push_swap Algorithms
├── Quick Sort Implementation
├── Chunk Sorting Strategy
└── Operation Optimization
```

### Exam Preparation
Study common exam concepts:
```plaintext
Exam Rank 02
├── Printf Implementation
├── Get_next_line Logic
└── Common Pitfalls
```

### Concept Mastery
Master fundamental concepts:
```plaintext
Memory Management
├── Malloc/Free Usage
├── Memory Leaks
└── Buffer Operations
