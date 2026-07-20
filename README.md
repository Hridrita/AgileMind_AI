#  AgileMind AI — Frontend

**AgileMind AI** is an AI-powered Agile project management platform that combines intelligent automation with modern project management workflows. Built with Next.js 16 and React 19, it provides a seamless experience for managing projects, tasks, and sprints with AI assistance.

Live URL: https://agilemind-nine.vercel.app

---

##  Key Features

###  Project Management
- **Create Projects** — Set up projects with title, framework, description, team members, and story points
- **Explore Projects** — Search, filter, sort, and paginate through all projects
- **Project Details** — View comprehensive project information with real-time progress tracking
- **Manage Projects** — Edit and delete projects with role-based permissions

###  Task Management
- **Task Board** — Kanban-style board with 4 columns (To Do, In Progress, Review, Done)
- **Task Operations** — Create, edit, delete, and move tasks between columns
- **Permission System** — Only task creators can edit/delete; only assignees can change status
- **Progress Tracking** — Automatic project progress calculation based on completed tasks

###  AI-Powered Features
- **Content Generator** — Generate titles, descriptions, and tags from any topic
- **Story Generator** — Convert feature requests into Agile user stories with task breakdown
- **Story Refinement** — Refine generated stories based on feedback
- **Description Expander** — Expand short descriptions into detailed project descriptions
- **Story Point Estimator** — AI-powered Fibonacci scale estimation
- **History Tracking** — Stores user's past AI requests for context-aware recommendations

###  Analytics & Visualization
- **Sprint Burndown Chart** — Track sprint progress against ideal burndown
- **Task Distribution Chart** — Visualize task status distribution with pie charts
- **Team Velocity Chart** — Monitor team performance across sprints

###  Authentication
- **Better Auth Integration** — Secure email/password and Google social login
- **Role-Based Access** — User-specific project and task management
- **Session Management** — JWT-based authentication with automatic refresh

---

##  Tech Stack

| **Category** | **Technology** |
|--------------|----------------|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Authentication** | Better Auth with MongoDB adapter |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Icons** | React Icons |
| **AI Integration** | Groq SDK (LLaMA 3.3) |
| **Database** | MongoDB Atlas |
| **Type Safety** | TypeScript (optional) |

---

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Backend server running (see backend README)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd agilemind

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```dotenv
# Authentication
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# AI (Groq)
GROQ_API_KEY=your_groq_api_key

# Optional: Google OAuth (for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

---

##  Project Structure

```
agilemind/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   ├── ai/                  # AI tools page
│   │   ├── explore/             # Project exploration
│   │   ├── items/
│   │   │   ├── [id]/            # Project details
│   │   │   ├── add/             # Create project
│   │   │   └── manage/          # Manage projects
│   │   ├── about/               # About page
│   │   ├── blog/                # Blog/insights
│   │   ├── contact/             # Contact page
│   │   ├── privacy/             # Privacy policy
│   │   ├── terms/               # Terms of service
│   │   ├── layout.js            # Root layout
│   │   └── page.js              # Home page
│   ├── components/
│   │   ├── common/              # Shared components
│   │   ├── layout/              # Navbar, Footer
│   │   ├── auth/                # Auth-related components
│   │   ├── charts/              # Recharts components
│   │   ├── modals/              # Edit, Delete modals
│   │   └── TaskBoard.jsx        # Kanban board
│   ├── lib/
│   │   ├── auth.js              # Better Auth configuration
│   │   ├── auth-client.js       # Auth client
│   │   └── axios.js             # Axios instance
│   └── styles/
│       └── globals.css          # Global styles
├── public/                      # Static assets
├── .env.example                 # Example environment variables
├── package.json
├── tailwind.config.js
├── next.config.mjs
└── README.md
```

---

##  Authentication Flow

1. **Login/Register** — User signs in via Better Auth (email/password or Google OAuth)
2. **Session Management** — JWT token issued and stored client-side
3. **API Calls** — Frontend attaches JWT as `Bearer` token in requests
4. **Backend Verification** — Backend verifies token via JWKS endpoint
5. **User Context** — User ID/Email extracted for ownership checks
6. **Role-Based Access** — Creators can edit/delete; assignees can change task status

### Security Features
- **Creator-Only Edit/Delete** — Only task creators can modify or delete tasks
- **Assignee-Only Status Change** — Only assigned users can change task status
- **User-Specific Projects** — Users only see and manage their own projects
- **Protected Routes** — Authentication required for project/task management

---

##  API Integration

The frontend communicates with the backend via RESTful APIs:

### Project Endpoints
| **Method** | **Endpoint** | **Purpose** |
|------------|--------------|-------------|
| GET | `/api/items` | Fetch all projects (with search/filter/sort) |
| GET | `/api/items/:id` | Fetch single project |
| POST | `/api/items` | Create new project |
| PUT | `/api/items/:id` | Update project |
| DELETE | `/api/items/:id` | Delete project |
| GET | `/api/items/user/:userId` | Fetch user's projects |

### Task Endpoints
| **Method** | **Endpoint** | **Purpose** |
|------------|--------------|-------------|
| GET | `/api/projects/:projectId/tasks` | Fetch project tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### AI Endpoints
| **Method** | **Endpoint** | **Purpose** |
|------------|--------------|-------------|
| POST | `/api/ai/generate-content` | Generate AI content |
| POST | `/api/ai/generate-story` | Generate user story |
| POST | `/api/ai/refine-story` | Refine generated story |
| GET | `/api/ai/story-history/:userId` | Fetch AI history |
| POST | `/api/ai/expand-description` | Expand short description |
| POST | `/api/ai/estimate-points` | Estimate story points |

---

##  UI/UX Features

- **Fully Responsive** — Works on mobile, tablet, and desktop
- **Smooth Animations** — Framer Motion for page transitions
- **Loading Skeletons** — Visual feedback during data loading
- **Toast Notifications** — User feedback for actions
- **Interactive Charts** — Recharts for data visualization
- **Modals** — Edit and delete confirmation modals


