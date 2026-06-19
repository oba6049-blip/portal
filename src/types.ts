export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  iconName: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  highestQualification: string;
  occupation: string;
  preferredCourse: string;
  learningMode: 'Online' | 'Physical';
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  learningGoals: string;
  referralSource: string;
  studentUid?: string; // Links registration to authenticated user profile
}

export type CourseCategory = 'all' | 'Artificial Intelligence' | 'Cloud Computing' | 'Programming & Development' | 'Data Analytics' | 'DevOps & Infrastructure';

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
