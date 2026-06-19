import React, { useState, useEffect } from 'react';
import {
  User, MapPin, GraduationCap, Compass, BookOpen, ChevronLeft, ChevronRight,
  CheckCircle, Sparkles, AlertCircle, RefreshCw, Smartphone, Mail, Calendar, 
  FileText, LogIn, UserPlus, LogOut, Key, ShieldCheck, Award, Eye, Download, Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegistrationData } from '../types';
import { COURSES } from '../constants';
import { submitStudentRegistration, isSupabaseConfigured, fetchStudentRegistrations, submitAssignment, getAssignmentByRegistration } from '../supabase';
import { useAuth } from './AuthContext';

interface PortalProps {
  preselectedCourse: string | null;
  clearPreselection: () => void;
}

const INITIAL_FORM: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  country: '',
  state: '',
  city: '',
  highestQualification: '',
  occupation: '',
  preferredCourse: '',
  learningMode: 'Online',
  experienceLevel: 'Beginner',
  learningGoals: '',
  referralSource: ''
};

export default function Portal({ preselectedCourse, clearPreselection }: PortalProps) {
  const { user, signUpUser, loginUser, loginWithGoogleUser, logoutUser, error: authError, clearError, useLocalAuthFallback } = useAuth();
  
  // Tab/Mode state: 'guest' | 'login' | 'signup' | 'dashboard'
  const [portalMode, setPortalMode] = useState<'guest' | 'login' | 'signup'>('guest');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [saveSource, setSaveSource] = useState<'supabase' | 'localStorage' | null>(null);

  // Auth form states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  
  // Dashboard states
  const [studentRegistrations, setStudentRegistrations] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [activeDashboardView, setActiveDashboardView] = useState<'main' | 'new-register'>('main');
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Assignment states & form variables
  const [currentAssignment, setCurrentAssignment] = useState<any | null>(null);
  const [assignmentLoading, setAssignmentLoading] = useState<boolean>(false);
  const [vercelLink, setVercelLink] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [submittingAssignment, setSubmittingAssignment] = useState<boolean>(false);
  const [assignmentMsg, setAssignmentMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch assignment when a student ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      setAssignmentMsg(null);
      setVercelLink('');
      setGithubLink('');
      setAssignmentNotes('');
      setCurrentAssignment(null);
      
      const fetchAssignment = async () => {
        setAssignmentLoading(true);
        try {
          const fetched = await getAssignmentByRegistration(selectedTicket.id);
          if (fetched) {
            setCurrentAssignment(fetched);
            setVercelLink(fetched.vercelUrl || '');
            setGithubLink(fetched.githubUrl || '');
            setAssignmentNotes(fetched.notes || '');
          }
        } catch (err) {
          console.error("Error fetching assignment", err);
        } finally {
          setAssignmentLoading(false);
        }
      };
      
      fetchAssignment();
    }
  }, [selectedTicket]);

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignmentMsg(null);
    
    if (!vercelLink.trim()) {
      setAssignmentMsg({ type: 'error', text: 'Vercel deployment URL is required.' });
      return;
    }
    
    if (!vercelLink.trim().toLowerCase().includes('vercel.app') && !vercelLink.trim().toLowerCase().startsWith('http')) {
      setAssignmentMsg({ type: 'error', text: 'Please enter a valid URL (preferably a Vercel project deployment link).' });
      return;
    }

    setSubmittingAssignment(true);
    try {
      await submitAssignment({
        studentUid: user.uid,
        studentEmail: user.email,
        studentName: user.fullName || user.email.split('@')[0],
        registrationId: selectedTicket.id,
        courseName: selectedTicket.preferredCourse,
        vercelUrl: vercelLink.trim(),
        githubUrl: githubLink.trim(),
        notes: assignmentNotes.trim()
      });
      
      // Refresh current assignment
      const updated = await getAssignmentByRegistration(selectedTicket.id);
      setCurrentAssignment(updated);
      setAssignmentMsg({ type: 'success', text: 'Your Vercel assignment project was submitted successfully to the portal!' });
    } catch (err: any) {
      console.error(err);
      setAssignmentMsg({ type: 'error', text: 'Error submitting assignment. Please check and try again.' });
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Sync course selection from catalog
  useEffect(() => {
    if (preselectedCourse) {
      setFormData((prev) => ({ ...prev, preferredCourse: preselectedCourse }));
      if (user) {
        setActiveDashboardView('new-register');
      } else {
        setPortalMode('guest');
      }
      setCurrentStep(4); // Skip directly to Course Selection step for candidate ease
      clearPreselection();
      
      // Auto-focus scroll to portal
      const sectionElement = document.getElementById('register');
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [preselectedCourse, user]);

  // Sync logged-in user profile with form inputs
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        studentUid: user.uid
      }));
      // Load user registrations
      loadUserRegistrations();
    } else {
      // Clear bound auth values if logged out
      setFormData((prev) => ({
        ...prev,
        fullName: '',
        email: '',
        studentUid: undefined
      }));
      setStudentRegistrations([]);
      setActiveDashboardView('main');
    }
  }, [user]);

  // Load registrations from supabase or localstorage
  const loadUserRegistrations = async () => {
    if (!user) return;
    setLoadingRegs(true);
    try {
      const data = await fetchStudentRegistrations(user.email, user.uid);
      setStudentRegistrations(data);
      if (data.length > 0) {
        setSelectedTicket(data[0]); // Select first ticket as default
      }
    } catch (err) {
      console.error("Failed to load registrations:", err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const stepsList = [
    { title: 'Identity', desc: 'Personal details', icon: User },
    { title: 'Location', desc: 'Regional zone', icon: MapPin },
    { title: 'Education', desc: 'Background & Role', icon: GraduationCap },
    { title: 'Course', desc: 'Choose learning track', icon: BookOpen },
    { title: 'Summary', desc: 'Goals & Submit', icon: Compass }
  ];

  // Client-side structural validator per form step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      else if (formData.fullName.trim().length > 100) newErrors.fullName = 'Name cannot exceed 100 chars';
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) newErrors.email = 'Email address is required';
      else if (!emailPattern.test(formData.email)) newErrors.email = 'Please provide a valid email';
      else if (formData.email.trim().length > 100) newErrors.email = 'Email cannot exceed 100 chars';

      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (formData.phone.trim().length > 30) newErrors.phone = 'Phone cannot exceed 30 chars';

      if (!formData.gender) newErrors.gender = 'Please select a gender';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.country.trim()) newErrors.country = 'Country is required';
      if (!formData.state.trim()) newErrors.state = 'State or region is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }

    if (step === 3) {
      if (!formData.highestQualification.trim()) newErrors.highestQualification = 'Highest qualification is required';
      if (!formData.occupation.trim()) newErrors.occupation = 'Current occupation is required';
    }

    if (step === 4) {
      if (!formData.preferredCourse) newErrors.preferredCourse = 'Please select a preferred course';
      if (!formData.learningMode) newErrors.learningMode = 'Learning mode is required';
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, stepsList.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the specific error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const dup = { ...prev };
        delete dup[name];
        return dup;
      });
    }
  };

  // Form submission logic
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(stepsList.length)) return;

    setIsSubmitting(true);
    try {
      const response = await submitStudentRegistration(formData);
      setCreatedDocId(response.id);
      setSaveSource(response.source);
      
      // If logged in, reload student registration lists
      if (user) {
        await loadUserRegistrations();
      }
    } catch (err) {
      console.error("Submission failed: ", err);
      alert("Submission encountered an error. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPortal = () => {
    setFormData({
      ...INITIAL_FORM,
      fullName: user?.fullName || '',
      email: user?.email || '',
      studentUid: user?.uid
    });
    setCreatedDocId(null);
    setSaveSource(null);
    setCurrentStep(1);
    setErrors({});
    if (user) {
      setActiveDashboardView('main');
    }
  };

  // Authentication: Sign In
  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      alert("Please enter both email and password.");
      return;
    }
    setIsAuthSubmitting(true);
    try {
      await loginUser(authEmail, authPassword);
      setAuthPassword('');
      clearError();
    } catch (err: any) {
      console.warn("Auth failed:", err.message);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // Authentication: Sign Up
  const handleAuthSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authFullName || !authEmail || !authPassword) {
      alert("Please fill in all account registration fields.");
      return;
    }
    if (authPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setIsAuthSubmitting(true);
    try {
      await signUpUser(authEmail, authPassword, authFullName);
      setAuthFullName('');
      setAuthPassword('');
      clearError();
    } catch (err: any) {
      console.warn("Auth failed:", err.message);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  // Authentication: Google Sign-in
  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogleUser();
      clearError();
    } catch (err: any) {
      console.warn("Google Auth failed:", err.message);
    }
  };

  return (
    <section id="register" className="py-24 bg-transparent transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F2DA8] dark:text-[#A855F7] bg-purple-50 dark:bg-[#4C1D95]/30 px-3 py-1.5 rounded-full inline-block">
            Portal Gateway
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mt-4">
            Textocode Academy Student Portal
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm font-medium">
            Register your student identity, login to configure your catalog enrollments, and download your verified entry tickets.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] mx-auto mt-4 rounded-full" />
        </div>

        {/* Sync Connection Banner Notification */}
        <div className="mb-8 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-1.5">
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors ${
              (isSupabaseConfigured && !useLocalAuthFallback) || saveSource === 'supabase'
                ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200/20 text-emerald-700 dark:text-emerald-400 font-medium'
                : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200/20 text-amber-700 dark:text-amber-450 font-medium'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                (isSupabaseConfigured && !useLocalAuthFallback) || saveSource === 'supabase' ? 'bg-[#A855F7] animate-pulse' : 'bg-amber-400 animate-pulse'
              }`} />
              <span>
                STATUS: {useLocalAuthFallback ? 'SECURE_LOCAL_SANDBOX_ACTIVE' : isSupabaseConfigured ? 'SECURE_SUPABASE_SYNCED' : 'LOCAL_SANDBOX_STUB'}
              </span>
            </span>
          </div>
          {useLocalAuthFallback && (
            <div className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-mono px-4 py-1.5 rounded-xl max-w-lg text-center leading-normal">
              ⚠️ Supabase API variables are not configured in project secrets. We have automatically activated the secure local sandbox fallback so you can sign up or log in normally!
            </div>
          )}
        </div>

        {/* Standard Identity Headers (Sign-in information overlay) */}
        {user && (
          <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/30 dark:bg-neutral-900/40 backdrop-blur-md border border-purple-100/10 dark:border-white/5 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F2DA8] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-purple-500/10">
                {user.fullName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-neutral-400 block font-mono">AUTHENTICATED STUDENT</span>
                <span className="text-sm font-bold text-neutral-850 dark:text-neutral-200">{user.fullName}</span>
                <span className="text-xs text-neutral-400 font-mono ml-2">({user.email})</span>
              </div>
            </div>
            
            <button
              onClick={logoutUser}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* MAIN DISPLAY CONTAINER */}
        <div className="max-w-5xl mx-auto bg-white/40 dark:bg-white/5 backdrop-blur-2xl border border-purple-100/25 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* Top Tabs (Only visible when NOT logged in) */}
          {!user && (
            <div className="grid grid-cols-3 border-b border-purple-100/10 dark:border-white/5 bg-black/5 dark:bg-black/20 p-2 gap-2">
              <button
                onClick={() => { setPortalMode('guest'); clearError(); }}
                className={`py-3.5 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 ${
                  portalMode === 'guest'
                    ? 'bg-[#6F2DA8] text-white shadow-lg shadow-purple-900/10'
                    : 'text-neutral-600 dark:text-neutral-450 hover:bg-white/35 dark:hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Guest Registration</span>
                <span className="sm:hidden">Guest</span>
              </button>
              
              <button
                onClick={() => { setPortalMode('login'); clearError(); }}
                className={`py-3.5 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 ${
                  portalMode === 'login'
                    ? 'bg-[#6F2DA8] text-white shadow-lg shadow-purple-900/10'
                    : 'text-neutral-600 dark:text-neutral-450 hover:bg-white/35 dark:hover:bg-white/5'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Student Login</span>
              </button>
              
              <button
                onClick={() => { setPortalMode('signup'); clearError(); }}
                className={`py-3.5 px-2 text-xs sm:text-sm font-bold rounded-2xl transition-all flex items-center justify-center space-x-2 ${
                  portalMode === 'signup'
                    ? 'bg-[#6F2DA8] text-white shadow-lg shadow-purple-900/10'
                    : 'text-neutral-600 dark:text-neutral-450 hover:bg-white/35 dark:hover:bg-white/5'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Sign Up</span>
              </button>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              
              {/* CASE A: USER LOGGED IN - SHOW STUDENT DASHBOARD */}
              {user ? (
                <motion.div
                  key="student-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {activeDashboardView === 'main' ? (
                    <div>
                      {/* DASHBOARD SUMMARY VIEW */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Welcome stats & actions */}
                        <div className="lg:col-span-4 space-y-6">
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#4C1D95]/40 to-[#1E1B4B]/40 dark:from-[#2e1065]/40 dark:to-neutral-900/50 border border-purple-200/10 dark:border-white/5 text-left">
                            <Sparkles className="w-8 h-8 text-amber-400 mb-4 animate-bounce" />
                            <h4 className="text-xl font-black text-white">Student Dashboard</h4>
                            <p className="text-neutral-300 text-xs mt-2 leading-relaxed">
                              Access all registrations linked synchronized with your cloud credential. Present admissions reference strings during live classes.
                            </p>
                            
                            <div className="mt-6 border-t border-purple-200/10 pt-4 text-xs font-mono text-neutral-400 space-y-2">
                              <div>• Core Account: {user.email}</div>
                              <div>• Submissions: {studentRegistrations.length} record(s)</div>
                            </div>
                          </div>

                          {/* Quick enrollment initiator */}
                          <div className="p-5 border border-purple-100/15 dark:border-white/5 bg-white/25 dark:bg-neutral-950/20 backdrop-blur-sm rounded-2xl text-left">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Academic Catalogs</h5>
                            <p className="text-xs text-neutral-500 leading-normal mb-4">
                              Ready to acquire other competencies? Submit registrations easily with auto-filled coordinates.
                            </p>
                            <button
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  fullName: user.fullName,
                                  email: user.email,
                                  studentUid: user.uid
                                }));
                                setCreatedDocId(null);
                                setCurrentStep(1);
                                setErrors({});
                                setActiveDashboardView('new-register');
                              }}
                              className="w-full inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] text-xs font-bold text-white transition-all hover:opacity-90 cursor-pointer shadow-lg shadow-purple-500/15"
                            >
                              <BookOpen className="w-4 h-4 mr-1.5" />
                              Enroll in a New Course
                            </button>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Registrations Ticket manager */}
                        <div className="lg:col-span-8 flex flex-col gap-6 text-left">
                          <h4 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center">
                            <Award className="w-5 h-5 mr-2 text-[#6F2DA8] dark:text-[#A855F7]" />
                            Your Registered Courses Admissions
                          </h4>

                          {loadingRegs ? (
                            <div className="py-20 flex flex-col items-center justify-center text-neutral-400 text-xs">
                              <RefreshCw className="w-8 h-8 animate-spin text-[#A855F7] mb-2" />
                              Synced query with Database...
                            </div>
                          ) : studentRegistrations.length === 0 ? (
                            <div className="py-16 px-6 text-center border-2 border-dashed border-purple-150/15 dark:border-white/5 rounded-2xl bg-white/10">
                              <Compass className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                              <h5 className="font-bold text-neutral-800 dark:text-white">No Admissions Records Found</h5>
                              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                                You haven't completed any candidate registration requests yet under this student identity.
                              </p>
                              <button
                                onClick={() => setActiveDashboardView('new-register')}
                                className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-[#6F2DA8] text-xs font-bold text-white transition-all cursor-pointer"
                              >
                                Submit Intake Questionnaire Now
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                              {/* Left Panel: Record List Selector */}
                              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                                {studentRegistrations.map((snapReg) => (
                                  <div
                                    key={snapReg.id}
                                    onClick={() => setSelectedTicket(snapReg)}
                                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                      selectedTicket?.id === snapReg.id
                                        ? 'bg-[#6F2DA8]/10 border-[#6F2DA8] dark:border-[#A855F7]'
                                        : 'bg-white/20 dark:bg-neutral-950/20 border-purple-100/10 dark:border-white/5 hover:border-[#6F2DA8]/30 hover:bg-white/30 dark:hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] font-mono font-bold text-[#6F2DA8] dark:text-[#A855F7]">ID: {snapReg.id.slice(0, 8).toUpperCase()}</span>
                                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/10 text-emerald-500">APPROVED</span>
                                    </div>
                                    <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-150 mt-2 line-clamp-1">
                                      {snapReg.preferredCourse}
                                    </h5>
                                    <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
                                      <span>Mode: {snapReg.learningMode}</span>
                                      <span>{snapReg.country || 'Global'}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Right Panel: Selected Ticket Blueprint visual display */}
                              {selectedTicket && (
                                <div className="border border-dashed border-purple-200/40 dark:border-white/10 bg-black/20 dark:bg-black/50 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
                                  <span className="absolute -top-6 -left-6 w-12 h-12 bg-[#0a0a0c] rounded-full border border-dashed border-purple-150/10" />
                                  <span className="absolute -top-6 -right-6 w-12 h-12 bg-[#0a0a0c] rounded-full border border-dashed border-purple-150/10" />

                                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100/10 text-[9px] font-mono font-bold text-[#6F2DA8] dark:text-[#A855F7]">
                                    <span>TEXTOCODE_OFFICIAL_PASS</span>
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                      VERIFIED_IN_FIREBASE
                                    </span>
                                  </div>

                                  <div className="space-y-3 font-mono text-xs">
                                    <div>
                                      <span className="text-[9px] text-neutral-500 block uppercase">Candidate</span>
                                      <span className="font-bold text-neutral-900 dark:text-white">
                                        {selectedTicket.fullName}
                                      </span>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-neutral-500 block uppercase">Selected Track</span>
                                      <span className="font-bold text-neutral-900 dark:text-white text-xs block line-clamp-1">
                                        {selectedTicket.preferredCourse}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-[9px] text-neutral-500 block uppercase">Method</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">
                                          {selectedTicket.learningMode}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-neutral-500 block uppercase">Skill Level</span>
                                        <span className="font-bold text-neutral-900 dark:text-white">
                                          {selectedTicket.experienceLevel}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="border-t border-purple-100/10 pt-3">
                                      <span className="text-[9px] text-neutral-500 block uppercase">Database Ref ID</span>
                                      <span className="text-[10px] font-mono text-[#A855F7] select-all block break-all font-semibold">
                                        {selectedTicket.id}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-5 pt-3 border-t border-purple-100/10 text-[9px] text-neutral-450 italic text-center font-mono">
                                    Present this reference on study center check-in.
                                  </div>
                                </div>
                              )}

                            </div>

                            {/* ASSIGNMENT SUBMISSION WORKSPACE */}
                            {selectedTicket && (
                              <div className="mt-8 border-t border-purple-150/15 pt-8 text-left space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    <h4 className="text-base font-black text-white flex items-center gap-2">
                                      <span className="p-1.5 bg-purple-500/10 rounded-lg text-[#A855F7]">
                                        <Award className="w-4 h-4" />
                                      </span>
                                      Course Capstone Project & Assignment Submission
                                    </h4>
                                    <p className="text-xs text-neutral-400 mt-1">
                                      Deploy your React/Full-Stack app on Vercel and submit the live URL here for grading.
                                    </p>
                                  </div>
                                  
                                  {currentAssignment && (
                                    <span className={`px-2.5 py-1 text-[10px] font-bold font-mono uppercase tracking-wider rounded-full border self-start sm:self-auto ${
                                      currentAssignment.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                      currentAssignment.status === 'Needs Revision' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse' :
                                      'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                                    }`}>
                                      Status: {currentAssignment.status}
                                    </span>
                                  )}
                                </div>

                                {assignmentLoading ? (
                                  <div className="py-8 flex items-center justify-center space-x-2 text-xs text-neutral-400">
                                    <RefreshCw className="w-4 h-4 animate-spin text-[#A855F7]" />
                                    <span>Syncing assignment status...</span>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                    
                                    {/* Left: Interactive submit form */}
                                    <div className="lg:col-span-7 bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                                      <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                                        
                                        {assignmentMsg && (
                                          <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                                            assignmentMsg.type === 'success' 
                                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' 
                                              : 'bg-red-500/10 border border-red-500/20 text-rose-500'
                                          }`}>
                                            <Info className="w-4 h-4 shrink-0" />
                                            <span>{assignmentMsg.text}</span>
                                          </div>
                                        )}

                                        <div className="space-y-1.5">
                                          <label className="block text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                                            Vercel Live deployment Link <span className="text-rose-500">*</span>
                                          </label>
                                          <div className="relative">
                                            <input 
                                              type="url"
                                              required
                                              disabled={currentAssignment?.status === 'Approved'}
                                              placeholder="https://my-awesome-project.vercel.app"
                                              value={vercelLink}
                                              onChange={(e) => setVercelLink(e.target.value)}
                                              className="w-full pl-4 pr-12 py-3 bg-neutral-950/40 border border-white/5 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#A855F7]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            />
                                            {vercelLink && (
                                              <a 
                                                href={vercelLink} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
                                                title="Open live link"
                                              >
                                                <Eye className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>
                                        </div>

                                        <div className="space-y-1.5">
                                          <label className="block text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                                            GitHub Repository URL (Optional)
                                          </label>
                                          <input 
                                            type="url"
                                            disabled={currentAssignment?.status === 'Approved'}
                                            placeholder="https://github.com/username/project-repo"
                                            value={githubLink}
                                            onChange={(e) => setGithubLink(e.target.value)}
                                            className="w-full px-4 py-3 bg-neutral-950/40 border border-white/5 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-[#A855F7]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                          />
                                        </div>

                                        <div className="space-y-1.5">
                                          <label className="block text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                                            Submitter Notes / Tech Stack Details
                                          </label>
                                          <textarea 
                                            rows={3}
                                            disabled={currentAssignment?.status === 'Approved'}
                                            placeholder="Introduce your project details, features, or explain instructions if database dependencies are required..."
                                            value={assignmentNotes}
                                            onChange={(e) => setAssignmentNotes(e.target.value)}
                                            className="w-full px-4 py-3 bg-neutral-950/40 border border-white/5 rounded-xl text-white text-xs focus:outline-none focus:border-[#A855F7]/50 lg:leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
                                          />
                                        </div>

                                        {currentAssignment?.status !== 'Approved' && (
                                          <button
                                            type="submit"
                                            disabled={submittingAssignment}
                                            className="w-full py-2.5 bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] hover:opacity-95 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50"
                                          >
                                            {submittingAssignment ? (
                                              <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>Publishing Submission...</span>
                                              </>
                                            ) : (
                                              <span>{currentAssignment ? 'Update Project Submission' : 'Submit Live Assignment'}</span>
                                            )}
                                          </button>
                                        )}
                                      </form>
                                    </div>

                                    {/* Right: Submission Info, Checklist and Feedback */}
                                    <div className="lg:col-span-5 space-y-4">
                                      
                                      {/* Grading / Feedback if exists */}
                                      {currentAssignment && currentAssignment.feedback && (
                                        <div className="p-5 text-left rounded-2xl bg-purple-950/10 border border-[#A855F7]/20 relative overflow-hidden">
                                          <div className="absolute right-3 top-3 opacity-10">
                                            <Award className="w-12 h-12 text-purple-400" />
                                          </div>
                                          <h5 className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5 uppercase tracking-wider mb-2">
                                            <span>Instructor Feedback & Guidance</span>
                                          </h5>
                                          <p className="text-xs text-neutral-300 italic leading-relaxed py-1">
                                            "{currentAssignment.feedback}"
                                          </p>
                                          <p className="text-[10px] text-neutral-500 font-mono mt-3">
                                            Graded at: {new Date(currentAssignment.updatedAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}

                                      <div className="p-5 text-left border border-white/5 bg-white/[0.01] rounded-2xl text-xs space-y-3">
                                        <h5 className="font-bold text-white text-xs">Submission Requirements</h5>
                                        <ul className="space-y-2 text-neutral-450 leading-relaxed list-disc list-inside">
                                          <li>Live URL must be a fully accessible Vercel deployment link.</li>
                                          <li>Submit the source GitHub repository for optional code assessments.</li>
                                          <li>Avoid submitting broken links. Maintain your project state inside Vercel continuous deployment.</li>
                                          <li>For queries about grades or revisions, consult your class administrator.</li>
                                        </ul>
                                      </div>

                                    </div>

                                  </div>
                                )}
                              </div>
                            )}
                            </>
                          )}

                        </div>

                      </div>
                    </div>
                  ) : (
                    /* CANDIDATE REGISTRATION ENROLLMENT FORM (User is Logged-In) */
                    <div>
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-150/10">
                        <button
                          onClick={() => setActiveDashboardView('main')}
                          className="flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-[#6F2DA8] dark:hover:text-[#A855F7] transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Return to Dashboard</span>
                        </button>
                        <span className="text-xs font-mono font-bold text-[#A855F7]">SECURED ENROLLMENT ACTIVE</span>
                      </div>

                      {/* We embed the standard 5 step form context */}
                      <AnimatePresence mode="wait">
                        {!createdDocId ? (
                          <div id="logged-registration-container">
                            
                            {/* Visual steps */}
                            <div className="flex justify-between items-center mb-10 overflow-x-auto no-scrollbar pb-4">
                              {stepsList.map((stepItem, idx) => {
                                const StepIcon = stepItem.icon;
                                const isPassed = currentStep > idx + 1;
                                const isActive = currentStep === idx + 1;
                                return (
                                  <div key={stepItem.title} className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="flex items-center">
                                      <div
                                        onClick={() => {
                                          if (isPassed) setCurrentStep(idx + 1);
                                        }}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold border cursor-pointer transition-all ${
                                          isPassed
                                            ? 'bg-purple-100/55 dark:bg-[#4C1D95]/30 border-purple-200/20 text-[#6F2DA8] dark:text-[#A855F7]'
                                            : isActive
                                            ? 'bg-[#6F2DA8] dark:bg-[#A855F7] border-purple-150 text-white shadow-lg'
                                            : 'bg-white/30 dark:bg-white/5 border-purple-100/10 dark:border-white/10 text-neutral-400'
                                        }`}
                                      >
                                        {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                      </div>
                                      
                                      <div className="hidden sm:block ml-2 text-left">
                                        <p className={`text-[11px] font-bold uppercase tracking-wider leading-none ${
                                          isActive ? 'text-[#6F2DA8] dark:text-[#A855F7]' : 'text-neutral-400'
                                        }`}>
                                          {stepItem.title}
                                        </p>
                                        <p className="text-[9px] text-neutral-500 italic font-mono mt-0.5 whitespace-nowrap">
                                          {stepItem.desc}
                                        </p>
                                      </div>
                                    </div>

                                    {idx < stepsList.length - 1 && (
                                      <div className="w-4 sm:w-10 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-6">
                              {renderFormSteps()}
                              {renderStepControls()}
                            </form>
                          </div>
                        ) : (
                          renderTicketDisplay()
                        )}
                      </AnimatePresence>

                    </div>
                  )}
                </motion.div>
              ) : (
                
                /* CASE B: GUEST MODE OR GUEST VIEWED CHANNELS */
                <motion.div
                  key="guest-or-auth-selectors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  
                  {/* TAB 1: GUEST ENROLLMENT (Multi Step registration) */}
                  {portalMode === 'guest' && (
                    <div id="guest-form-container">
                      <AnimatePresence mode="wait">
                        {!createdDocId ? (
                          <div id="guest-subform">
                            
                            {/* Visual steps navigation */}
                            <div className="flex justify-between items-center mb-10 overflow-x-auto no-scrollbar pb-4">
                              {stepsList.map((stepItem, idx) => {
                                const StepIcon = stepItem.icon;
                                const isPassed = currentStep > idx + 1;
                                const isActive = currentStep === idx + 1;
                                return (
                                  <div key={stepItem.title} className="flex items-center space-x-2 flex-shrink-0">
                                    <div className="flex items-center">
                                      <div
                                        onClick={() => {
                                          if (isPassed) setCurrentStep(idx + 1);
                                        }}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold border cursor-pointer transition-all ${
                                          isPassed
                                            ? 'bg-purple-100/55 dark:bg-[#4C1D95]/30 border-purple-200/20 text-[#6F2DA8] dark:text-[#A855F7]'
                                            : isActive
                                            ? 'bg-[#6F2DA8] dark:bg-[#A855F7] border-purple-150 text-white shadow-lg'
                                            : 'bg-white/30 dark:bg-white/5 border-purple-100/10 dark:border-white/10 text-neutral-400'
                                        }`}
                                      >
                                        {isPassed ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                      </div>
                                      
                                      <div className="hidden sm:block ml-2 text-left">
                                        <p className={`text-[11px] font-bold uppercase tracking-wider leading-none ${
                                          isActive ? 'text-[#6F2DA8] dark:text-[#A855F7]' : 'text-neutral-400'
                                        }`}>
                                          {stepItem.title}
                                        </p>
                                        <p className="text-[9px] text-neutral-500 italic font-mono mt-0.5 whitespace-nowrap">
                                          {stepItem.desc}
                                        </p>
                                      </div>
                                    </div>

                                    {idx < stepsList.length - 1 && (
                                      <div className="w-4 sm:w-10 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-6">
                              {renderFormSteps()}
                              {renderStepControls()}
                            </form>
                          </div>
                        ) : (
                          renderTicketDisplay()
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* TAB 2: STUDENT LOGIN FORM */}
                  {portalMode === 'login' && (
                    <motion.div
                      key="student-login-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-md mx-auto py-4 text-left"
                    >
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-[#6F2DA8]/15 rounded-2xl flex items-center justify-center text-[#6F2DA8] dark:text-[#A855F7] mx-auto mb-3 border border-purple-200/20">
                          <LogIn className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 dark:text-white">Sign In to Student Account</h4>
                        <p className="text-xs text-neutral-500 mt-1">Access records, view courses allocations, and manage credentials.</p>
                      </div>

                      {authError && (
                        <div className="p-4 mb-5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-500 text-xs flex items-start gap-2.5">
                          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <form onSubmit={handleAuthLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Student Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-950 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                            placeholder="janedoe@gmail.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-950 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                            placeholder="Password reference string"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isAuthSubmitting}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] text-xs font-bold text-white shadow-lg shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
                        >
                          {isAuthSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Verifying Credentials...
                            </>
                          ) : (
                            "Verify Student Account"
                          )}
                        </button>
                      </form>

                      {/* Divider option */}
                      <div className="my-6 flex items-center justify-between text-neutral-450 text-[10px] uppercase tracking-wider font-mono">
                        <span className="w-1/3 h-px bg-purple-100/10" />
                        <span>Or Access via</span>
                        <span className="w-1/3 h-px bg-purple-100/10" />
                      </div>

                      {/* Google Authentication method triggers */}
                      <button
                        onClick={handleGoogleAuth}
                        className="w-full py-2.5 rounded-xl border border-purple-100/15 dark:border-white/10 bg-white/30 dark:bg-neutral-900 hover:bg-white/50 dark:hover:bg-neutral-850 text-xs font-bold text-neutral-700 dark:text-neutral-250 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
                        <span>Sign In with Google Identity</span>
                      </button>

                      {typeof window !== 'undefined' && window.self !== window.top && (
                        <div className="mt-4 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-2.5 text-[10px] text-neutral-650 dark:text-neutral-300">
                          <ExternalLink className="w-4.5 h-4.5 text-[#A855F7] flex-shrink-0 mt-0.5" />
                          <div className="text-left font-mono leading-normal">
                            <span className="font-semibold text-neutral-800 dark:text-white">Iframe Preview Notice:</span>
                            <p className="mt-0.5 text-neutral-500 dark:text-neutral-400 text-[9px]">Google authentication popups are often blocked inside sandboxed preview frames by modern security standards.</p>
                            <button 
                              type="button"
                              onClick={() => window.open(window.location.origin, '_blank')}
                              className="mt-1.5 text-[#A855F7] hover:underline font-bold block cursor-pointer"
                            >
                              Open Portal in New Tab ↗
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-6 p-3.5 rounded-xl bg-[#6F2DA8]/5 border border-purple-150/10 flex items-start gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <Info className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                        <span>Mock Mode: If Firebase Auth is not active in this sandbox, credentials will mock log you in instantly to enable live client previewing!</span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: STUDENT REGISTRATION ACCOUNT SIGN UP */}
                  {portalMode === 'signup' && (
                    <motion.div
                      key="student-signup-form"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-md mx-auto py-4 text-left"
                    >
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-[#6F2DA8]/15 rounded-2xl flex items-center justify-center text-[#6F2DA8] dark:text-[#A855F7] mx-auto mb-3 border border-purple-200/20">
                          <UserPlus className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 dark:text-white">Create Student Account</h4>
                        <p className="text-xs text-neutral-500 mt-1">Get custom admissions tracker, download badges, and lock in credentials.</p>
                      </div>

                      {authError && (
                        <div className="p-4 mb-5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-500 text-xs flex items-start gap-2.5">
                          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <form onSubmit={handleAuthSignUp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Your Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={authFullName}
                            onChange={(e) => setAuthFullName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-950 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                            placeholder="Jane Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Active Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-950 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                            placeholder="janedoe@gmail.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Configure Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-950 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                            placeholder="At least 6 characters"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isAuthSubmitting}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] text-xs font-bold text-white shadow-lg shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
                        >
                          {isAuthSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Creating Academic Record...
                            </>
                          ) : (
                            "Verify and Register Student Account"
                          )}
                        </button>
                      </form>

                      {/* Divider option */}
                      <div className="my-6 flex items-center justify-between text-neutral-450 text-[10px] uppercase tracking-wider font-mono">
                        <span className="w-1/3 h-px bg-purple-100/10" />
                        <span>Or Quick Link</span>
                        <span className="w-1/3 h-px bg-purple-100/10" />
                      </div>

                      {/* Google Signup method triggers */}
                      <button
                        onClick={handleGoogleAuth}
                        className="w-full py-2.5 rounded-xl border border-purple-100/15 dark:border-white/10 bg-white/30 dark:bg-neutral-900 hover:bg-white/50 dark:hover:bg-neutral-850 text-xs font-bold text-neutral-700 dark:text-neutral-250 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4.5 h-4.5 text-amber-500" />
                        <span>Sign Up with Google Account</span>
                      </button>

                      {typeof window !== 'undefined' && window.self !== window.top && (
                        <div className="mt-4 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-2.5 text-[10px] text-neutral-650 dark:text-neutral-300">
                          <ExternalLink className="w-4.5 h-4.5 text-[#A855F7] flex-shrink-0 mt-0.5" />
                          <div className="text-left font-mono leading-normal">
                            <span className="font-semibold text-neutral-800 dark:text-white">Iframe Preview Notice:</span>
                            <p className="mt-0.5 text-neutral-500 dark:text-neutral-400 text-[9px]">Google authentication popups are often blocked inside sandboxed preview frames by modern security standards.</p>
                            <button 
                              type="button"
                              onClick={() => window.open(window.location.origin, '_blank')}
                              className="mt-1.5 text-[#A855F7] hover:underline font-bold block cursor-pointer"
                            >
                              Open Portal in New Tab ↗
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );

  // Modular renderer for Form Steps
  function renderFormSteps() {
    return (
      <div className="relative text-left">
        {/* STEP 1: Identification info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <User className="w-5 h-5 text-[#6F2DA8] mr-2" />
              Step 1: Personal Identification Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Applicant Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!!user} // Locked if signed in
                  className={`w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border disabled:opacity-75 disabled:cursor-not-allowed ${
                    errors.fullName ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7]'
                  } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!user} // Locked if signed in
                    className={`w-full pl-9 pr-4 py-2.5 bg-white/60 dark:bg-black/40 border disabled:opacity-75 disabled:cursor-not-allowed ${
                      errors.email ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7]'
                    } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                    placeholder="johndoe@gmail.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-4 py-2.5 bg-white/60 dark:bg-black/40 border ${
                      errors.phone ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8] dark:focus:border-[#A855F7]'
                    } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                    placeholder="+234 (0) 801-234-5678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-[11px] mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" /> {errors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-400 dark:text-white rounded-xl focus:outline-none"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-[11px] mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 2: Location specs */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <MapPin className="w-5 h-5 text-[#6F2DA8] mr-2" />
              Step 2: Region of Residence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border ${
                    errors.country ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8]'
                  } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                  placeholder="Nigeria"
                />
                {errors.country && <p className="text-red-500 text-[11px] mt-1">{errors.country}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  State / Region *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border ${
                    errors.state ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8]'
                  } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                  placeholder="Lagos"
                />
                {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border ${
                    errors.city ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8]'
                  } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                  placeholder="Ikeja"
                />
                {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Education & Occupation */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <GraduationCap className="w-5 h-5 text-[#6F2DA8] mr-2" />
              Step 3: Background Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Highest Qualification completed *
                </label>
                <select
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                >
                  <option value="">Choose Qualification...</option>
                  <option value="High School">High School / O-Level</option>
                  <option value="Diploma">Ordinary/Higher Diploma (OND/HND)</option>
                  <option value="Bachelors">BSc / BA / BTech (Bachelors)</option>
                  <option value="Masters">MSc / MBA / MA (Masters)</option>
                  <option value="Doctorate">PhD / Doctorate</option>
                  <option value="Other">Other Professional Qualifications</option>
                </select>
                {errors.highestQualification && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.highestQualification}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Current Professional Occupation *
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border ${
                    errors.occupation ? 'border-red-500' : 'border-purple-150/15 dark:border-white/10 focus:border-[#6F2DA8]'
                  } text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none`}
                  placeholder="Undergraduate Student, Developer, Accountant..."
                />
                {errors.occupation && <p className="text-red-500 text-[11px] mt-1">{errors.occupation}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Choose track and options */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <BookOpen className="w-5 h-5 text-[#6F2DA8] mr-2" />
              Step 4: Select Academic Course track
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Preferred Intake Track *
                </label>
                <select
                  name="preferredCourse"
                  value={formData.preferredCourse}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                >
                  <option value="">Enroll in Course Track...</option>
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title} ({course.duration})
                    </option>
                  ))}
                </select>
                {errors.preferredCourse && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.preferredCourse}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Learning Mode *
                  </label>
                  <select
                    name="learningMode"
                    value={formData.learningMode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="Online">Online Sessions</option>
                    <option value="Physical">In-Person (Lagos Center)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                    Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-[#000000] dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="Beginner">Beginner (Zero experience)</option>
                    <option value="Intermediate">Intermediate (Have coded before)</option>
                    <option value="Advanced">Advanced (SRE/Eng)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Questionnaire summary */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Compass className="w-5 h-5 text-[#6F2DA8] mr-2" />
              Step 5: Goals & Finalize Submit
            </h3>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  What are your learning goals with this course? (Optional)
                </label>
                <textarea
                  name="learningGoals"
                  value={formData.learningGoals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-[#6F2DA8]"
                  placeholder="Tell us what you aim to achieve... (Max 1000 chars)"
                  maxLength={1000}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono mb-1">
                  Where did you hear about Textocode Academy?
                </label>
                <input
                  type="text"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white/60 dark:bg-black/40 border border-purple-150/15 dark:border-white/10 text-sm text-neutral-900 dark:text-white rounded-xl focus:outline-none"
                  placeholder="LinkedIn, WhatsApp, Google Search, Friend referrals..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Next / Prev buttons helper
  function renderStepControls() {
    return (
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/10 dark:border-white/5 mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border flex items-center select-none transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-40 border-neutral-200 dark:border-neutral-800 text-neutral-400 cursor-not-allowed'
              : 'border-purple-200/20 dark:border-white/10 bg-white/35 dark:bg-white/5 hover:bg-neutral-100/50 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
        </button>

        {currentStep < stepsList.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-neutral-900 dark:bg-neutral-800 hover:bg-[#6F2DA8] dark:hover:bg-[#A855F7] flex items-center select-none transition-all cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4 ml-1.5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] hover:opacity-90 flex items-center select-none shadow-lg shadow-purple-900/10 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                Submit Registration <Sparkles className="w-4 h-4 ml-1.5 text-amber-300" />
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  // Display complete ticket
  function renderTicketDisplay() {
    return (
      <motion.div
        id="registration-ticket-display"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6 max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          Registration Complete!
        </h3>
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-2">
          Your academic candidate profile has been generated successfully.
        </p>

        {/* Digital Ticket/Admission Pass representation */}
        <div className="mt-8 border border-dashed border-purple-200/40 dark:border-white/10 bg-white/55 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
          <span className="absolute -top-6 -left-6 w-12 h-12 bg-[#0a0a0c] rounded-full border border-dashed border-purple-100/15" />
          <span className="absolute -top-6 -right-6 w-12 h-12 bg-[#0a0a0c] rounded-full border border-dashed border-purple-100/15" />

          <div className="flex items-center justify-between border-b border-purple-50 dark:border-neutral-850 pb-4 mb-4 text-[10px] font-mono font-bold text-[#6F2DA8] dark:text-[#A855F7]">
            <span>TEXTO_ADMISSION_PASS</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">
              APPROVED
            </span>
          </div>

          <div className="space-y-3 font-mono">
            <div>
              <span className="text-[10px] text-neutral-400 block uppercase">Candidate</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white uppercase select-all">
                {formData.fullName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Selected Track</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1">
                  {formData.preferredCourse}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Study Mode</span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  {formData.learningMode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-purple-50 dark:border-neutral-850/50 pt-3">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Record Reference</span>
                <span className="text-[11px] font-bold text-neutral-[#6F2DA8] dark:text-[#A855F7] select-all truncate block">
                  {createdDocId}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Database Host</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">
                  {saveSource === 'supabase' ? 'Cloud_Supabase' : 'Local_Browser'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[9px] text-[#A855F7] dark:text-neutral-550 font-mono text-center">
            * Present reference string to study center coordinators *
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetPortal}
            className="flex-1 py-3 text-sm font-bold text-[#6F2DA8] dark:text-[#A855F7] border border-purple-200/20 dark:border-white/10 bg-white/35 dark:bg-white/5 hover:bg-white/55 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            {user ? "View Admissions Dashboard" : "Register Another Student"}
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#6F2DA8] to-[#4C1D95] rounded-xl transition-all shadow-md cursor-pointer"
          >
            Contact Support
          </button>
        </div>

      </motion.div>
    );
  }
}
