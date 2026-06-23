# IT Job Platform

> Nền tảng tuyển dụng IT hàng đầu Việt Nam

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

This project follows a modern, scalable architecture with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router (pages & routes)
├── components/             # React components (ui, common, features, layouts)
├── lib/                    # Core utilities (contexts, hooks, providers)
├── services/               # API service layer
├── constants/              # App constants & configuration
├── types/                  # TypeScript type definitions
├── validators/             # Form validation schemas
├── utils/                  # Pure utility functions
└── helpers/                # Business logic helpers
```

For detailed structure documentation, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 📚 Documentation

### 🎯 For New Developers
- **[QUICK_START.md](./QUICK_START.md)** - Get started quickly with migration
- **[STRUCTURE_DIAGRAM.md](./STRUCTURE_DIAGRAM.md)** - Visual overview of the project structure

### 🔧 For Migration
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Complete refactoring overview
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Step-by-step migration instructions
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed structure documentation

### 📋 Workflows
- **[.agent/workflows/refactor-project-structure.md](./.agent/workflows/refactor-project-structure.md)** - Refactoring workflow checklist

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Context API
- **Form Validation**: Zod
- **HTTP Client**: Axios

## 🎨 Features

- ✅ Modern Next.js App Router architecture
- ✅ Type-safe with TypeScript
- ✅ Role-based access control (User, HR, Admin)
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support
- ✅ SEO optimized
- ✅ Feature-based component organization
- ✅ Centralized constants and configuration

## 📂 Key Directories

### `/app` - Application Routes
```
app/
├── (auth)/              # Authentication pages (login, register)
├── (protected)/         # Protected routes (user, admin, HR)
└── (public)/            # Public pages (home, jobs, blog)
```

### `/components` - React Components
```
components/
├── ui/                  # Atomic UI components (buttons, inputs)
├── common/              # Shared components (Navbar, Footer)
├── features/            # Feature-specific components
└── layouts/             # Page layouts
```

### `/lib` - Core Library
```
lib/
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── providers/           # Provider wrappers
└── utils.ts             # Utility functions
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BE_ENDPOINT=http://localhost:8081
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
```

### Code Style

- Use TypeScript for all new files
- Follow the naming conventions in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Use absolute imports with `@/` prefix
- Keep components small and focused
- Write meaningful commit messages

## 📖 Import Examples

```typescript
// Constants
import { ROUTES, API_ENDPOINTS } from "@/constants";

// Components
import { Button } from "@/components/ui/button";
import JobCard from "@/components/features/jobs/JobCard";
import Navbar from "@/components/common/Navbar";

// Lib
import { useAuth } from "@/lib/contexts/AuthContext";
import { useDebounce } from "@/lib/hooks/useDebounce";

// Services
import { jobsService } from "@/services/jobs.service";

// Utils & Helpers
import { formatCurrency } from "@/utils/format";
import { hasPermission } from "@/helpers/permission.helper";
```

## 🚧 Migration Status

This project is currently being refactored to a new, more maintainable structure.

- ✅ New structure created
- ✅ Constants migrated
- ✅ Core libraries organized
- ✅ Components reorganized
- 🔄 Pages migration in progress
- ⏳ Old structure cleanup pending

See [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) for details.

## 🤝 Contributing

1. Read the documentation files
2. Follow the project structure guidelines
3. Use the new import paths
4. Test your changes thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

For questions or issues:
1. Check the documentation files
2. Review the example pages
3. Contact the development team

---

**Happy Coding! 🚀**
