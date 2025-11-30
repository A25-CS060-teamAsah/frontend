# Frontend - Lead Scoring System

Next.js Frontend untuk Lead Scoring System dengan UI modern menggunakan React, Tailwind CSS, dan Radix UI components.

**Team A25-CS060** - Capstone Project Bangkit 2024

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Setup & Instalasi](#-setup--instalasi)
- [Pages & Routes](#-pages--routes)
- [Component Structure](#-component-structure)
- [UI Features](#-ui-features)
- [API Integration](#-api-integration)
- [State Management](#-state-management)
- [Running the App](#-running-the-app)

## ✨ Fitur

- **Dashboard Analytics** - Real-time metrics dengan visualisasi charts
- **Lead Management** - Complete CRUD operations untuk customers
- **Advanced Search & Filter UI** - Multi-parameter filtering dengan collapsible panel
- **Prediction Analytics** - Comprehensive prediction statistics
- **Auto-Predict Monitor** - Real-time cron job status monitoring
- **Authentication** - JWT-based login/register
- **Role-Based UI** - Different views untuk Admin & Sales
- **Responsive Design** - Mobile-friendly interface
- **Dark Mode Support** - Customizable theme (optional)

## 🛠️ Teknologi

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Forms**: Native React forms
- **Routing**: Next.js App Router

## 🚀 Setup & Instalasi

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy template .env.local
cp .env.local.example .env.local

# Edit dengan text editor
nano .env.local
```

**File `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Build for Production
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

## 📱 Pages & Routes

### Public Routes
- `/login` - User login page
- `/register` - User registration page

### Protected Routes (Dashboard)
Semua routes di bawah `/dashboard` require authentication:

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Main Dashboard | Overview metrics & top leads |
| `/dashboard/leadList` | Lead Management | Customer CRUD & advanced filters |
| `/dashboard/analytics` | Prediction Analytics | Statistics & charts |
| `/dashboard/admin` | Auto-Predict Monitor | Cron job status (Admin only) |
| `/dashboard/pending` | Pending Predictions | Customers without predictions |

### Route Protection
- Authentication menggunakan JWT stored di `localStorage`
- Automatic redirect ke `/login` jika tidak authenticated
- Role-based access control (RBAC) untuk admin routes

## 🎨 Component Structure

```
frontend/
├── app/
│   ├── (dashboard)/         # Dashboard layout group
│   │   ├── layout.tsx       # Dashboard layout wrapper
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── leadList/        # Lead management
│   │   ├── analytics/       # Analytics page
│   │   ├── admin/           # Auto-predict monitor
│   │   └── pending/         # Pending predictions
│   ├── login/               # Login page
│   ├── register/            # Register page
│   └── layout.tsx           # Root layout
├── components/
│   ├── auth/
│   │   ├── login-form.tsx   # Login form component
│   │   └── register-form.tsx # Register form
│   ├── organisms/           # Complex components
│   │   ├── prediction-analytics.tsx  # Analytics charts
│   │   ├── auto-predict-monitor.tsx  # Cron job monitor
│   │   ├── lead-detail-modal.tsx     # Lead details modal
│   │   └── csv-upload-modal.tsx      # CSV upload
│   ├── dashboard.tsx        # Main dashboard component
│   ├── leads.tsx            # Lead list with filters
│   └── ui/                  # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ...
└── lib/
    ├── api/                 # API service layer
    │   ├── customer.service.ts
    │   ├── prediction.service.ts
    │   └── auth.service.ts
    └── types/               # TypeScript types
        ├── customer.types.ts
        └── prediction.types.ts
```

## 🎯 UI Features

### 1. Dashboard (Main Page)
**Location**: `/dashboard`

**Features:**
- **Total Leads Card** - Total customers dengan monthly trend
- **High Priority Card** - Leads dengan score ≥50%
- **Avg Score Card** - Average prediction score
- **Top Priority Leads Table** - 6 customers dengan score tertinggi
- **Monthly Trend Chart** - Visualisasi 6 bulan terakhir

**Components Used:**
- Card components untuk metrics
- Table untuk top leads
- Chart components untuk trend visualization

### 2. Lead Management
**Location**: `/dashboard/leadList`

**Features:**
- **Search Bar** - Search by name, job, education, marital
- **Priority Filter Tabs** - All / High / Medium / Low
- **Advanced Filter Panel** ✨ NEW:
  - Collapsible panel with toggle button
  - Age Range (Min & Max inputs)
  - Job Type dropdown (11+ categories)
  - Education Level (Primary, Secondary, Tertiary)
  - Marital Status (Single, Married, Divorced)
  - Housing Loan filter (Yes/No/All)
  - Personal Loan filter (Yes/No/All)
  - Active badge indicator
  - Clear Filters button
  - Real-time auto-fetch on change
- **Lead Cards** - Display customer info & prediction score
- **Actions**:
  - View details (modal)
  - Edit customer
  - Delete customer
  - Predict single customer
- **Batch Actions**:
  - Select multiple customers
  - Batch predict
- **CSV Upload** - Bulk import customers
- **Pagination** - Navigate through pages

**State Management:**
```typescript
// Filter states
const [searchQuery, setSearchQuery] = useState("");
const [filterPriority, setFilterPriority] = useState<string>("all");
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
const [minAge, setMinAge] = useState("");
const [maxAge, setMaxAge] = useState("");
const [job, setJob] = useState("");
const [education, setEducation] = useState("");
const [marital, setMarital] = useState("");
const [housing, setHousing] = useState<boolean | undefined>(undefined);
const [loan, setLoan] = useState<boolean | undefined>(undefined);
```

**Auto-Fetch on Filter Change:**
```typescript
useEffect(() => {
  fetchLeads();
}, [page, searchQuery, filterPriority, minAge, maxAge, job, education, marital, housing, loan]);
```

### 3. Analytics
**Location**: `/dashboard/analytics`

**Features:**
- **Total Predictions** - Count semua predictions
- **Average Score** - Mean probability score
- **Priority Distribution**:
  - High Priority (≥75%) - Green
  - Medium Priority (50-75%) - Yellow
  - Low Priority (<50%) - Red
- **Coverage Statistics**:
  - Customers with predictions
  - Customers without predictions
- **Visual Charts**:
  - Bar charts untuk priority distribution
  - Progress bars
- **Conversion Rate** - Percentage positive predictions

**Data Format Support:**
```typescript
// Supports both camelCase and snake_case from backend
const totalPredictions =
  (stats as any)?.totalPredictions ||
  (stats as any)?.total_predictions || 0;
```

### 4. Auto-Predict Monitor
**Location**: `/dashboard/admin`

**Features:**
- **System Status**:
  - Current status (Running/Idle) - with color indicator
  - Cron enabled (Yes/No)
  - Schedule (e.g., "*/2 * * * *")
- **Execution Tracking**:
  - Last Run timestamp
  - Next Run prediction
  - Total Runs counter
- **Cache Statistics**:
  - Cached predictions count
  - Cache hits vs misses
  - Hit rate percentage
- **Manual Control**:
  - Trigger immediate prediction button
- **Real-Time Updates**:
  - Auto-refresh every 30 seconds

### 5. Pending Predictions
**Location**: `/dashboard/pending`

**Features:**
- List customers without predictions
- Quick predict button for each customer
- Batch predict all pending

## 🔌 API Integration

### API Service Layer

**Location**: `frontend/lib/api/`

**Customer Service** (`customer.service.ts`):
```typescript
// Get customers dengan advanced filters
export async function getCustomers(params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: string;
  // Advanced filters
  minAge?: number;
  maxAge?: number;
  job?: string;
  education?: string;
  marital?: string;
  housing?: boolean;
  loan?: boolean;
  hasDefault?: boolean;
}) {
  const response = await apiClient.get('/customers', { params });
  return response.data;
}

// Get customer stats
export async function getCustomerStats() {
  const response = await apiClient.get('/customers/stats');
  return response.data;
}

// Create customer
export async function createCustomer(customerData: CreateCustomerDto) {
  const response = await apiClient.post('/customers', customerData);
  return response.data;
}

// Upload CSV
export async function uploadCSV(file: File) {
  const formData = new FormData();
  formData.append('csvfile', file);
  const response = await apiClient.post('/customers/upload-csv', formData);
  return response.data;
}
```

**Prediction Service** (`prediction.service.ts`):
```typescript
// Get prediction stats
export async function getPredictionStats() {
  const response = await apiClient.get('/predictions/stats');
  return response.data;
}

// Get top leads
export async function getTopLeads(limit: number = 6, threshold: number = 0.5) {
  const response = await apiClient.get('/predictions/top-leads', {
    params: { limit, threshold }
  });
  return response.data;
}

// Predict single customer
export async function predictCustomer(customerId: number) {
  const response = await apiClient.post(`/predictions/customer/${customerId}`);
  return response.data;
}

// Batch predict
export async function batchPredict(customerIds: number[]) {
  const response = await apiClient.post('/predictions/batch', { customerIds });
  return response.data;
}

// Get job status
export async function getJobStatus() {
  const response = await apiClient.get('/predictions/job/status');
  return response.data;
}
```

**Authentication Service** (`auth.service.ts`):
```typescript
export async function login(email: string, password: string) {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.data.user));
  return response.data;
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
```

### Axios Configuration

**Location**: `frontend/lib/api/axios.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔄 State Management

Frontend menggunakan React Hooks untuk state management:

### useState
- Local component state
- Form inputs
- UI toggles (modals, filters)

### useEffect
- Data fetching
- Auto-refresh intervals
- Filter change reactions

**Example: Lead List State**
```typescript
const [leads, setLeads] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [searchQuery, setSearchQuery] = useState("");
const [filterPriority, setFilterPriority] = useState("all");
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
const [minAge, setMinAge] = useState("");
const [maxAge, setMaxAge] = useState("");
// ... more filters

useEffect(() => {
  fetchLeads();
}, [page, searchQuery, filterPriority, minAge, maxAge, job, education, marital, housing, loan]);

const fetchLeads = async () => {
  setLoading(true);
  try {
    const response = await getCustomers({
      page,
      limit: 20,
      search: searchQuery || undefined,
      sortBy: "probability_score",
      order: "DESC",
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      job: job || undefined,
      education: education || undefined,
      marital: marital || undefined,
      housing: housing,
      loan: loan,
    });
    setLeads(response.data.customers);
    setTotalPages(response.data.pagination.totalPages);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
  } finally {
    setLoading(false);
  }
};
```

## 🏃 Running the App

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```
- Optimized bundle
- Server-side rendering
- Static optimization

### Lint & Type Check
```bash
# ESLint
npm run lint

# TypeScript type checking
npm run type-check
```

## 🎨 UI Components (Radix UI)

Component library yang digunakan:
- `Button` - Actions & CTAs
- `Card` - Content containers
- `Dialog` - Modals
- `Input` - Text inputs
- `Select` - Dropdowns
- `Table` - Data tables
- `Badge` - Status indicators
- `Progress` - Loading bars
- `Tabs` - Filter tabs
- `Collapsible` - Advanced filters panel

## ✅ Recent Updates (30 Nov 2025)

1. ✅ **Advanced Filter UI** - Implemented collapsible panel dengan 6 filter controls
2. ✅ **Active Badge Indicator** - Shows when filters are applied
3. ✅ **Clear Filters** - One-click reset all filters
4. ✅ **Real-time Auto-fetch** - Results update automatically on filter change
5. ✅ **Data Format Compatibility** - Support both camelCase & snake_case dari backend
6. ✅ **Search by Name** - Enhanced search functionality
7. ✅ **Auto-Predict Monitor** - Fixed status tracking display

---

**Status**: ✅ Frontend Running | API Connected | All Features Working

*Last Updated: 30 November 2025*
