// definisi tipe untuk Lead
export type Lead = {
  id: number;
  name: string;
  age: number;
  job: string;
  score: number;
  education: string;
  marital: string;
  balance: number;
  loan: "Yes" | "No";
  contact: "Cellular" | "Telephone";
  lastContact: number; // days
  status: "pending" | "converted";
};

// data lead
export const leads: Lead[] = [
  { id: 1, name: 'Budi Santoso', age: 45, job: 'Management', score: 0.92, education: 'University', marital: 'Married', balance: 5420000, loan: 'No', contact: 'Cellular', lastContact: 180, status: 'pending' },
  { id: 2, name: 'Siti Nurhaliza', age: 38, job: 'Technician', score: 0.87, education: 'University', marital: 'Single', balance: 3250000, loan: 'No', contact: 'Cellular', lastContact: 92, status: 'pending' },
  { id: 3, name: 'Ahmad Wijaya', age: 52, job: 'Entrepreneur', score: 0.85, education: 'Secondary', marital: 'Married', balance: 8900000, loan: 'Yes', contact: 'Telephone', lastContact: 156, status: 'pending' },
  { id: 4, name: 'Dewi Lestari', age: 29, job: 'Admin', score: 0.78, education: 'University', marital: 'Single', balance: 1850000, loan: 'No', contact: 'Cellular', lastContact: 45, status: 'pending' },
  { id: 5, name: 'Rudi Hartono', age: 61, job: 'Retired', score: 0.75, education: 'Secondary', marital: 'Married', balance: 12500000, loan: 'No', contact: 'Telephone', lastContact: 220, status: 'converted' },
  { id: 6, name: 'Maya Kusuma', age: 34, job: 'Services', score: 0.68, education: 'University', marital: 'Divorced', balance: 2100000, loan: 'Yes', contact: 'Cellular', lastContact: 67, status: 'converted' },
  { id: 7, name: 'Hendra Gunawan', age: 42, job: 'Blue-collar', score: 0.62, education: 'Secondary', marital: 'Married', balance: 980000, loan: 'No', contact: 'Cellular', lastContact: 134, status: 'pending' },
  { id: 8, name: 'Rina Permata', age: 27, job: 'Student', score: 0.45, education: 'University', marital: 'Single', balance: 450000, loan: 'Yes', contact: 'Cellular', lastContact: 15, status: 'pending' },
];

// data conversion
export const conversions = [
  { id: 1, leadId: 5, leadName: 'Rudi Hartono', amount: 50000000, duration: '12 months', rate: 5.5, conversionDate: '2025-10-28', salesPerson: 'Andi Wijaya', campaignType: 'Outbound Call' },
  { id: 2, leadId: 6, leadName: 'Maya Kusuma', amount: 25000000, duration: '6 months', rate: 5.0, conversionDate: '2025-10-25', salesPerson: 'Sari Dewi', campaignType: 'Email Campaign' },
  { id: 3, leadId: 9, leadName: 'Bambang Susilo', amount: 75000000, duration: '24 months', rate: 6.0, conversionDate: '2025-10-22', salesPerson: 'Andi Wijaya', campaignType: 'Outbound Call' },
  { id: 4, leadId: 10, leadName: 'Lestari Indah', amount: 30000000, duration: '12 months', rate: 5.5, conversionDate: '2025-10-20', salesPerson: 'Budi Santoso', campaignType: 'Branch Visit' },
  { id: 5, leadId: 11, leadName: 'Dimas Prasetyo', amount: 45000000, duration: '18 months', rate: 5.75, conversionDate: '2025-10-18', salesPerson: 'Sari Dewi', campaignType: 'Outbound Call' },
];

// data target
export const targetData = {
  monthly: { target: 21, achieved: 18, remaining: 3, percentage: 85.7, deadline: '2025-10-31' },
  quarterly: { target: 60, achieved: 52, remaining: 8, percentage: 86.7, deadline: '2025-12-31' },
  yearly: { target: 240, achieved: 198, remaining: 42, percentage: 82.5, deadline: '2025-12-31' },
  breakdown: [
    { month: 'Jul', target: 20, achieved: 18 },
    { month: 'Aug', target: 20, achieved: 16 },
    { month: 'Sep', target: 20, achieved: 18 },
    { month: 'Oct', target: 21, achieved: 18 },
  ],
};

// data rata-rata skor bulanan
export const avgScoreMonthly = [
  { month: 'Jan', score: 0.68 },
  { month: 'Feb', score: 0.71 },
  { month: 'Mar', score: 0.73 },
  { month: 'Apr', score: 0.72 },
  { month: 'May', score: 0.75 },
  { month: 'Jun', score: 0.74 },
];

// data total leads bulanan
export const totalLeadsMonthly = [
  { month: 'Jan', count: 145 },
  { month: 'Feb', count: 152 },
  { month: 'Mar', count: 168 },
  { month: 'Apr', count: 175 },
  { month: 'May', count: 189 },
  { month: 'Jun', count: 198 },
];

// data high priority bulanan
export const highPriorityMonthly = [
  { month: 'Jan', count: 32 },
  { month: 'Feb', count: 38 },
  { month: 'Mar', count: 42 },
  { month: 'Apr', count: 45 },
  { month: 'May', count: 51 },
  { month: 'Jun', count: 48 },
];


export const conversionData = [
    { month: 'Jan', rate: 12 },
    { month: 'Feb', rate: 15 },
    { month: 'Mar', rate: 18 },
    { month: 'Apr', rate: 22 },
    { month: 'May', rate: 28 },
    { month: 'Jun', rate: 32 },
  ];

export const scoreDistribution = [
    { range: '0-25%', count: 1, color: 'bg-red-500' },
    { range: '25-50%', count: 1, color: 'bg-orange-500' },
    { range: '50-75%', count: 3, color: 'bg-yellow-500' },
    { range: '75-100%', count: 3, color: 'bg-green-500' },
  ];