# Zynx Data AGI Platform - API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Main Components](#main-components)
5. [Custom Hooks](#custom-hooks)
6. [Utility Functions](#utility-functions)
7. [UI Components Library](#ui-components-library)
8. [Design System](#design-system)
9. [Routing](#routing)
10. [Examples](#examples)

---

## Project Overview

The Zynx Data AGI Platform is a React TypeScript application showcasing culturally aware artificial general intelligence. Built with modern web technologies including Vite, React 18, TypeScript, and shadcn/ui components.

### Key Features
- **Culturally Aware AGI**: Focus on ethical AI with cultural considerations
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Mobile-first approach with custom breakpoints
- **Component Library**: Comprehensive set of reusable UI components
- **Toast System**: Advanced notification system
- **Theme Support**: Custom AGI-themed design system

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd <project-name>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## Architecture

```
src/
├── components/         # Reusable React components
│   ├── ui/            # shadcn/ui component library
│   ├── Footer.tsx     # Site footer component
│   └── HeroSection.tsx # Landing page hero section
├── hooks/             # Custom React hooks
│   ├── use-mobile.tsx # Mobile breakpoint detection
│   └── use-toast.ts   # Toast notification system
├── lib/               # Utility libraries
│   └── utils.ts       # Common utility functions
├── pages/             # Page components
│   ├── Index.tsx      # Home page
│   └── NotFound.tsx   # 404 error page
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

---

## Main Components

### HeroSection

The main landing page hero section showcasing Zynx Data's AGI platform.

**Location**: `src/components/HeroSection.tsx`

#### Props
```typescript
// No props - self-contained component
```

#### Features
- **Animated Background**: Floating geometric elements with CSS animations
- **Interactive Buttons**: Hero and explore buttons with hover effects
- **Feature Cards**: Three interactive cards showcasing AI capabilities
- **Character Placeholder**: Space for Deeja character illustration
- **Responsive Design**: Mobile-first responsive layout

#### Usage
```tsx
import HeroSection from "@/components/HeroSection";

function App() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
```

#### Animation Classes Used
- `animate-fade-in` - Fade in text animation
- `animate-float` - Floating animation for background elements
- `animate-pulse-soft` - Soft pulsing animation
- `animate-bounce` - Bounce animation for interactive elements

---

### Footer

Site footer with company information and navigation links.

**Location**: `src/components/Footer.tsx`

#### Props
```typescript
// No props - self-contained component
```

#### Features
- **Three-Column Layout**: Company info, quick links, and social connections
- **Responsive Grid**: Stacks on mobile devices
- **Zynx Logo**: Positioned in bottom-right corner
- **Hover Effects**: Links have hover states with color transitions

#### Usage
```tsx
import Footer from "@/components/Footer";

function App() {
  return (
    <div>
      {/* Page content */}
      <Footer />
    </div>
  );
}
```

#### Sections
1. **Company Info**: Zynx Data description
2. **Quick Links**: Navigation to About, Research, Products, Contact
3. **Social Links**: LinkedIn, Twitter, GitHub

---

## Custom Hooks

### useIsMobile

Hook for detecting mobile breakpoints and responsive behavior.

**Location**: `src/hooks/use-mobile.tsx`

#### API
```typescript
function useIsMobile(): boolean
```

#### Features
- **Breakpoint Detection**: Uses 768px as mobile breakpoint
- **Real-time Updates**: Listens to window resize events
- **SSR Safe**: Handles server-side rendering gracefully

#### Usage
```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

#### Implementation Details
- Uses `window.matchMedia` for efficient breakpoint detection
- Returns `false` during SSR/initial render
- Automatically cleans up event listeners

---

### useToast

Advanced toast notification system with queue management.

**Location**: `src/hooks/use-toast.ts`

#### API
```typescript
interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}

function useToast(): {
  toasts: ToasterToast[];
  toast: (options: ToastOptions) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
  dismiss: (toastId?: string) => void;
}
```

#### Features
- **Queue Management**: Limits to 1 toast at a time
- **Auto Dismiss**: Configurable auto-dismiss timing
- **Update Support**: Update existing toasts
- **Action Support**: Add action buttons to toasts
- **Variant Support**: Default and destructive variants

#### Usage
```tsx
import { useToast } from "@/hooks/use-toast";

function NotificationExample() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
    });
  };
  
  const showError = () => {
    toast({
      title: "Error",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };
  
  return (
    <div>
      <button onClick={showSuccess}>Show Success</button>
      <button onClick={showError}>Show Error</button>
    </div>
  );
}
```

#### Toast Actions
```tsx
toast({
  title: "Are you sure?",
  description: "This action cannot be undone.",
  action: (
    <ToastAction altText="Undo">
      Undo
    </ToastAction>
  ),
});
```

---

## Utility Functions

### cn (Class Name Utility)

Utility function for merging Tailwind CSS classes with conflict resolution.

**Location**: `src/lib/utils.ts`

#### API
```typescript
function cn(...inputs: ClassValue[]): string
```

#### Features
- **Class Merging**: Combines multiple class strings
- **Conflict Resolution**: Resolves Tailwind class conflicts
- **Conditional Classes**: Supports conditional class application

#### Usage
```tsx
import { cn } from "@/lib/utils";

function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded", // base classes
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-800",
        className // user-provided classes
      )}
      {...props}
    />
  );
}
```

#### Powered By
- **clsx**: For conditional class names
- **tailwind-merge**: For Tailwind CSS class conflict resolution

---

## UI Components Library

The project includes a comprehensive set of shadcn/ui components. Here are the key components:

### Button

Versatile button component with multiple variants and sizes.

**Location**: `src/components/ui/button.tsx`

#### API
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | 
           "ghost" | "link" | "hero" | "explore" | "interactive";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

#### Variants
- **default**: Primary button style
- **destructive**: For dangerous actions
- **outline**: Outlined button
- **secondary**: Secondary button style
- **ghost**: Minimal button style
- **link**: Link-styled button
- **hero**: Special hero section button with AGI yellow theme
- **explore**: Explore button with enhanced effects
- **interactive**: AGI orange themed interactive button

#### Usage
```tsx
import { Button } from "@/components/ui/button";

function ButtonExamples() {
  return (
    <div className="space-x-2">
      <Button variant="default">Default</Button>
      <Button variant="hero" size="lg">
        Meet Deeja
      </Button>
      <Button variant="outline" size="sm">
        Small Outline
      </Button>
      <Button variant="ghost" size="icon">
        <SearchIcon />
      </Button>
    </div>
  );
}
```

---

### Card

Flexible card component for content organization.

**Location**: `src/components/ui/card.tsx`

#### API
```typescript
// Main card container
function Card(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element

// Card sections
function CardHeader(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element
function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element
function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element
function CardContent(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element
function CardFooter(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element
```

#### Usage
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ProfileCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Deeja</CardTitle>
        <CardDescription>
          Your culturally aware AGI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Ready to help with culturally sensitive tasks.</p>
      </CardContent>
      <CardFooter>
        <Button>Start Conversation</Button>
      </CardFooter>
    </Card>
  );
}
```

---

### Toast

Advanced toast notification component.

**Location**: `src/components/ui/toast.tsx`

#### API
```typescript
interface ToastProps {
  variant?: "default" | "destructive";
  // ... extends Radix Toast props
}

// Toast components
function Toast(props: ToastProps): JSX.Element
function ToastAction(props: ToastActionProps): JSX.Element
function ToastClose(props: ToastCloseProps): JSX.Element
function ToastTitle(props: ToastTitleProps): JSX.Element
function ToastDescription(props: ToastDescriptionProps): JSX.Element
```

#### Usage
```tsx
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";

function CustomToast() {
  return (
    <Toast>
      <ToastTitle>Notification</ToastTitle>
      <ToastDescription>
        Your AI assistant is ready.
      </ToastDescription>
      <ToastAction altText="View details">
        View
      </ToastAction>
      <ToastClose />
    </Toast>
  );
}
```

---

### Form Components

Comprehensive form handling with React Hook Form integration.

**Location**: `src/components/ui/form.tsx`

#### API
```typescript
// Form provider
const Form = FormProvider;

// Form field wrapper
function FormField<T>(props: ControllerProps<T>): JSX.Element

// Form components
function FormItem(props: React.HTMLAttributes<HTMLDivElement>): JSX.Element
function FormLabel(props: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>): JSX.Element
function FormControl(props: React.ComponentPropsWithoutRef<typeof Slot>): JSX.Element
function FormDescription(props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element
function FormMessage(props: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element
```

#### Usage
```tsx
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function ContactForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll use this to contact you about AGI updates.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

### Additional UI Components

The project includes 50+ additional UI components. Key components include:

#### Navigation
- **NavigationMenu**: Main navigation component
- **Breadcrumb**: Navigation breadcrumbs
- **Menubar**: Application menu bar

#### Data Display
- **Table**: Data table components
- **Chart**: Chart visualization components
- **Badge**: Status badges and labels
- **Avatar**: User avatar component

#### Feedback
- **Alert**: Alert messages
- **Progress**: Progress indicators
- **Skeleton**: Loading skeletons

#### Overlays
- **Dialog**: Modal dialogs
- **Sheet**: Slide-out sheets
- **Popover**: Popover components
- **Tooltip**: Contextual tooltips

#### Form Controls
- **Input**: Text input field
- **Textarea**: Multi-line text input
- **Select**: Dropdown select
- **Checkbox**: Checkbox input
- **RadioGroup**: Radio button groups
- **Switch**: Toggle switch
- **Slider**: Range slider

Each component follows the same pattern:
- Built on Radix UI primitives
- Fully typed with TypeScript
- Customizable with Tailwind classes
- Accessible by default

---

## Design System

### Color Palette

The application uses a custom AGI-themed color system:

#### AGI Brand Colors
```css
--agi-blue: 210 100% 50%
--agi-orange: 25 100% 50%  
--agi-yellow: 45 100% 50%
```

#### Semantic Colors
```css
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--primary: 222.2 47.4% 11.2%
--primary-foreground: 210 40% 98%
--secondary: 210 40% 96%
--secondary-foreground: 222.2 84% 4.9%
--muted: 210 40% 96%
--muted-foreground: 215.4 16.3% 46.9%
--accent: 210 40% 96%
--accent-foreground: 222.2 84% 4.9%
--destructive: 0 84.2% 60.2%
--destructive-foreground: 210 40% 98%
```

### Typography

- **Font**: System font stack for optimal performance
- **Sizes**: Responsive typography scale
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing

- **Base Unit**: 0.25rem (4px)
- **Scale**: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

### Animations

#### Custom Animations
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0% { box-shadow: var(--glow-primary); }
  100% { box-shadow: var(--glow-secondary); }
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

#### Usage Classes
- `animate-float` - Floating animation (3s infinite)
- `animate-glow` - Glowing effect (2s infinite alternate)
- `animate-pulse-soft` - Soft pulsing (2s infinite)

### Gradients

```css
--hero-gradient: linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)
--agi-gradient: linear-gradient(45deg, var(--agi-yellow), var(--agi-orange))
```

---

## Routing

The application uses React Router DOM for client-side routing.

**Location**: `src/App.tsx`

### Routes
- `/` - Home page (Index component)
- `*` - 404 Not Found page (NotFound component)

### Router Setup
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Adding New Routes
```tsx
// Add new routes above the catch-all "*" route
<Route path="/" element={<Index />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="*" element={<NotFound />} />
```

---

## Examples

### Creating a Custom Component

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  onActivate?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  onActivate
}: FeatureCardProps) {
  const { toast } = useToast();

  const handleActivate = () => {
    onActivate?.();
    toast({
      title: "Feature Activated",
      description: `${title} is now active.`,
    });
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300",
      "hover:scale-105 cursor-pointer",
      className
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button variant="hero" onClick={handleActivate}>
          Activate
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Responsive Layout Example

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function ResponsiveGrid() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-3"
    )}>
      <FeatureCard
        title="AI Research"
        description="Advanced research in AGI development"
        icon={<Brain className="h-5 w-5" />}
      />
      <FeatureCard
        title="Cultural AI"
        description="Culturally aware intelligence systems"
        icon={<Sparkles className="h-5 w-5" />}
      />
      <FeatureCard
        title="Innovation"
        description="Cutting-edge AI solutions"
        icon={<Zap className="h-5 w-5" />}
      />
    </div>
  );
}
```

### Form with Validation

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    console.log(values);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your AGI needs..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" variant="hero" size="lg">
          Send Message
        </Button>
      </form>
    </Form>
  );
}
```

---

## Best Practices

### Component Development
1. **Use TypeScript**: Always provide proper type definitions
2. **Follow shadcn/ui patterns**: Extend existing components when possible
3. **Use forwardRef**: For components that need DOM refs
4. **Implement displayName**: For better debugging experience

### Styling
1. **Use Tailwind classes**: Prefer Tailwind over custom CSS
2. **Use cn() utility**: For conditional and merged classes
3. **Follow design system**: Use defined colors and spacing
4. **Mobile-first**: Design for mobile, enhance for desktop

### State Management
1. **Use React Query**: For server state management
2. **Keep local state local**: Use useState for component-specific state
3. **Use custom hooks**: Extract reusable stateful logic

### Performance
1. **Lazy load pages**: Use React.lazy for code splitting
2. **Memoize expensive calculations**: Use useMemo and useCallback
3. **Optimize bundle size**: Import only what you need

---

## Contributing

When adding new components or features:

1. **Follow existing patterns**: Match the established code style
2. **Add TypeScript types**: Ensure full type safety
3. **Include documentation**: Update this document with new APIs
4. **Test thoroughly**: Ensure components work across devices
5. **Follow accessibility**: Maintain WCAG compliance

---

## Support

For questions or issues:
- Check the shadcn/ui documentation: https://ui.shadcn.com/
- Review Radix UI docs: https://www.radix-ui.com/
- Consult Tailwind CSS docs: https://tailwindcss.com/

---

*Last updated: December 2024*