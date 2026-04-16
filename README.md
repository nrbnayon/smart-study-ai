# BassInsight Frontend

Modern fishing community and lake monitoring platform built with Next.js, React, and TypeScript.

## Core Features

- **Lake Explorations**: Comprehensive database of lakes with weather, species, and water conditions.
- **Fishing Reports**: User-generated fishing reports with success rate calculations and detailed conditions.
- **Catches Gallery**: Community-driven gallery of catches with photo moderation workflows.
- **Authentication**: Secure authentication flows (Sign In, Sign Up, OTP Verification, Password Recovery).
- **Role-Based Dashboards**:
  - **User**: Manage profile, view personal catches, and track favorite lakes.
  - **Admin**: Comprehensive management of lakes, reports, users, and catch moderation.
- **Interactive UI**: Responsive layouts with smooth animations and dark mode support.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Hugeicons](https://hugeicons.com/), [Lucide](https://lucide.dev/), [Tabler](https://tabler-icons.io/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Prerequisites

- **Node.js**: 18.x or higher
- **Package Manager**: npm 9.x or higher

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file in the root directory:

   ```env
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Development Server**:

   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev`: Starts the development server with Webpack.
- `npm run build`: Generates the production build.
- `npm start`: Runs the built application in production mode.
- `npm run lint`: Executes ESLint for code quality checks.

## Project Structure

```text
frontend/
├── app/                    # Next.js App Router (Auth, Admin, User routes)
│   ├── (auth)/             # Authentication pages
│   ├── (roles)/            # Protected dashboards (Admin/User)
│   └── globals.css         # Global styling
├── components/             # Reusable UI components
│   ├── AuthProtected/     # Components requiring authentication
│   ├── Landing/           # Public landing page sections
│   ├── Shared/            # Reusable components (Table, Pagination, etc.)
│   └── ui/                # Core UI primitives (Shadcn-like)
├── redux/                 # State management
│   ├── services/           # RTK Query API definitions
│   ├── features/           # Redux slices
│   └── store.ts            # Store configuration
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and shared logic
├── public/                 # Static assets (images, icons)
├── types/                  # TypeScript interfaces and types
└── next.config.ts          # Next.js configuration
```

## API Integration

The application uses **RTK Query** for efficient API communication. All endpoints are centralized in `redux/services/`, ensuring consistent data fetching, caching, and state synchronization across the platform.

## Build & Deployment

To prepare the application for production:

```bash
npm run build
npm start
```

For deployment, it is recommended to use [Vercel](https://vercel.com/) or any platform supporting the Next.js runtime. Ensure the `NEXT_PUBLIC_API_URL` is set to your production backend.

## Troubleshooting

- **CORS Issues**: Ensure the backend allows requests from your frontend domain.
- **Image Loading**: If external images fail to load, verify the `remotePatterns` in `next.config.ts`.
- **Windows Scripts**: If npm scripts fail on Windows, ensure your shell is set correctly or use PowerShell.

## License

ISC License.
