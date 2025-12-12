export const JOB_OPTIONS = [
  { value: "admin.", label: "Admin" },
  { value: "blue-collar", label: "Blue Collar" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "housemaid", label: "Housemaid" },
  { value: "management", label: "Management" },
  { value: "retired", label: "Retired" },
  { value: "self-employed", label: "Self Employed" },
  { value: "services", label: "Services" },
  { value: "student", label: "Student" },
  { value: "technician", label: "Technician" },
  { value: "unemployed", label: "Unemployed" },
  { value: "unknown", label: "Unknown" },
];

export const MARITAL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "unknown", label: "Unknown" },
];

export const EDUCATION_OPTIONS = [
  { value: "illiterate", label: "Illiterate" },
  { value: "basic.4y", label: "Basic (4y)" },
  { value: "basic.6y", label: "Basic (6y)" },
  { value: "basic.9y", label: "Basic (9y)" },
  { value: "high.school", label: "High School" },
  { value: "professional.course", label: "Professional Course" },
  { value: "university.degree", label: "University Degree" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "tertiary", label: "Tertiary" },
  { value: "unknown", label: "Unknown" },
];

export const CONTACT_OPTIONS = [
  { value: "cellular", label: "Cellular" },
  { value: "telephone", label: "Telephone" },
  { value: "unknown", label: "Unknown" },
];

export const MONTH_OPTIONS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
].map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const DAY_OPTIONS = ["mon", "tue", "wed", "thu", "fri"].map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const POUTCOME_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "failure", label: "Failure" },
  { value: "nonexistent", label: "Nonexistent" },
  { value: "success", label: "Success" },
];
