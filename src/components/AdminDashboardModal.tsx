import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Shield, Search, Trash2, CheckCircle2, AlertCircle, 
  Download, Users, BookOpen, Clock, Activity, Loader2, Check, Filter, ClipboardList,
  ExternalLink
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { 
  adminFetchAllRegistrations, 
  adminFetchAllStudents, 
  adminDeleteRegistration, 
  adminUpdateRegistrationStatus,
  adminFetchAllAssignments,
  adminGradeAssignment,
  isSupabaseConfigured
} from '../supabase';
import { COURSES } from '../constants';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const { user, loginUser, loginWithGoogleUser, logoutUser, useLocalAuthFallback } = useAuth();
  
  // Auth state during admin logging in
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Dashboard lists and statistics
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [viewTab, setViewTab] = useState<'registrations' | 'students' | 'assignments'>('registrations');

  // Grading interactions
  const [gradingAssignmentId, setGradingAssignmentId] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [gradingStatus, setGradingStatus] = useState('Pending');
  const [gradingLoading, setGradingLoading] = useState(false);
  
  // Checking active user permissions
  useEffect(() => {
    if (user) {
      const emailLower = (user.email || '').toLowerCase();
      if (emailLower === 'nuddywale@gmail.com' || emailLower === 'oba6049@gmail.com') {
        setIsAdmin(true);
        setAuthError(null);
      } else {
        setIsAdmin(false);
        setAuthError('Access Denied. Only nuddywale@gmail.com or oba6049@gmail.com is authorized. Your active user account is ' + user.email);
      }
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Read data if is logged in as Admin
  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAdminData();
    }
  }, [isOpen, isAdmin]);

  async function loadAdminData() {
    setLoadingData(true);
    try {
      const [regs, luds, ass] = await Promise.all([
        adminFetchAllRegistrations(),
        adminFetchAllStudents(),
        adminFetchAllAssignments()
      ]);
      
      // Sort registrations by date desc
      const sortedRegs = (regs || []).sort((a: any, b: any) => {
        const timeA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt.seconds * 1000) : 0;
        const timeB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt.seconds * 1000) : 0;
        return timeB - timeA;
      });

      setRegistrations(sortedRegs);
      setStudents(luds || []);
      setAssignments(ass || []);
    } catch (err) {
      console.error('Failed to load admin dataset', err);
    } finally {
      setLoadingData(false);
    }
  }

  const handleGradeAssignmentSubmit = async (registrationId: string) => {
    if (!feedbackInput.trim()) {
      alert('Feedback is required to provide guidance to the student.');
      return;
    }
    setGradingLoading(true);
    try {
      await adminGradeAssignment(registrationId, gradingStatus as any, feedbackInput.trim());
      setAssignments(prev => prev.map(a => a.id === registrationId ? { ...a, status: gradingStatus, feedback: feedbackInput.trim(), updatedAt: new Date().toISOString() } : a));
      setGradingAssignmentId(null);
      setFeedbackInput('');
      alert('Assignment graded and locked successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update assignment submission.');
    } finally {
      setGradingLoading(false);
    }
  };

  // Google Oauth Login proxy
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loginWithGoogleUser();
    } catch (err: any) {
      setAuthError(err?.message || 'Google account sign-in rejected.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Credentials direct login handler (supports custom administrative keys: nuddywale@gmail.com / subair009)
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Please input both Email and Security Credentials Password.');
      return;
    }
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loginUser(emailInput.trim().toLowerCase(), passwordInput);
    } catch (err: any) {
      setAuthError(err?.message || 'Verification of administrative security keys failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Delete candidate registration
  const handleDeleteCandidate = async (regId: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this candidate enrollment request? This is irreversible.')) {
      return;
    }
    try {
      await adminDeleteRegistration(regId);
      setRegistrations(prev => prev.filter(r => r.id !== regId));
    } catch (err) {
      alert('Failed to delete registration record.');
    }
  };

  // Update status
  const handleStatusChange = async (regId: string, newStatus: string) => {
    try {
      await adminUpdateRegistrationStatus(regId, { status: newStatus });
      setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert('Failed to update registration status.');
    }
  };

  // Export registrations as CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    
    const headers = [
      'ID', 'Full Name', 'Email', 'Phone', 'Gender', 'DOB', 
      'Country', 'State', 'City', 'Qualification', 'Occupation',
      'Preferred Course', 'Learning Mode', 'Experience Level', 'referralSource', 'Status', 'Date'
    ];

    const rows = registrations.map(reg => {
      const dateVal = reg.createdAt ? (typeof reg.createdAt === 'string' ? new Date(reg.createdAt).toLocaleDateString() : new Date(reg.createdAt.seconds * 1000).toLocaleDateString()) : 'N/A';
      return [
        reg.id,
        `"${(reg.fullName || '').replace(/"/g, '""')}"`,
        reg.email,
        `"${reg.phone || ''}"`,
        reg.gender || '',
        reg.dateOfBirth || '',
        reg.country || '',
        reg.state || '',
        reg.city || '',
        reg.highestQualification || '',
        `"${(reg.occupation || '').replace(/"/g, '""')}"`,
        `"${(reg.preferredCourse || '').replace(/"/g, '""')}"`,
        reg.learningMode || '',
        reg.experienceLevel || '',
        `"${(reg.referralSource || '').replace(/"/g, '""')}"`,
        reg.status || 'Received',
        dateVal
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `textocode_applications_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Filter lists based on search parameter & filter selections
  const filteredRegs = registrations.filter(reg => {
    const textMatch = 
      (reg.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const courseMatch = selectedCourseFilter === 'All' || reg.preferredCourse === selectedCourseFilter;
    const statusMatch = selectedStatusFilter === 'All' || (reg.status || 'Received') === selectedStatusFilter;
    
    return textMatch && courseMatch && statusMatch;
  });

  const filteredStudents = students.filter(student => {
    const textMatch = 
      (student.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Validate if search query matches any enrolled track/course name for this student
    const studentRegs = registrations.filter(r => 
      (r.email || '').toLowerCase() === (student.email || '').toLowerCase() || 
      (r.studentUid && r.studentUid === student.id)
    );
    const hasCourseMatch = studentRegs.some(r => 
      (r.preferredCourse || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return textMatch || hasCourseMatch;
  });

  // Stats Counters
  const totalSubmissions = registrations.length;
  const contactedCount = registrations.filter(r => r.status === 'Contacted').length;
  const admittedCount = registrations.filter(r => r.status === 'Admitted').length;
  const pendingCount = registrations.filter(r => !r.status || r.status === 'Received' || r.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      
      <div id="admin-management-card" className="relative w-full max-w-6xl bg-[#0e0e11] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        
        {/* Banner/Header with status info */}
        <div className="p-6 bg-gradient-to-r from-[#1e112c]/40 to-[#0e0e11] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <Shield className="w-5 h-5 text-[#A855F7]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                TEXTOCODE Administrative Vault
                <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded-full bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 uppercase">
                  Root Only
                </span>
              </h2>
              <p className="text-xs text-neutral-450">
                Authorized command deck & admissions control system
              </p>
            </div>
          </div>
          
          <button 
            id="close-admin-vault-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content based on Auth state */}
        {!isAdmin ? (
          /* SECTION 1: ADMINISTRATOR AUTHENTICATION GATE */
          <div className="p-8 md:p-12 max-w-lg mx-auto w-full text-center space-y-6">
            <div className="w-16 h-16 bg-[#A855F7]/5 border border-[#A855F7]/10 text-[#A855F7] rounded-3xl flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Access Verification Required</h3>
              <p className="text-sm text-neutral-400 mt-1.5 leading-normal">
                This area is designated exclusively for administrative management. Log in with the official credentials <span className="font-mono text-purple-400">nuddywale@gmail.com</span> or <span className="font-mono text-purple-400">oba6049@gmail.com</span> with password <span className="font-mono text-purple-400">subair009</span> or use Google Identity auth.
              </p>
            </div>

            {/* Email & Password Admin Credentials Login form */}
            <form onSubmit={handleCredentialsSignIn} className="space-y-4 text-left bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 font-sans mb-1.5">Administrative Email Address</label>
                <input
                  type="email"
                  placeholder="admin@textocode.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/50 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 font-sans mb-1.5">Security Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#A855F7]/50 focus:ring-1 focus:ring-[#A855F7]/50 transition-all font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 mt-2 bg-[#6F2DA8] hover:bg-[#7C3AED] text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Verify Credentials & Enter Workspace</span>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-neutral-600 text-[10px] uppercase tracking-wider font-mono">Or SSO option</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {typeof window !== 'undefined' && window.self !== window.top && (
              <div className="p-4 bg-purple-500/5 border border-purple-500/10 text-neutral-300 rounded-2xl text-[11px] font-mono leading-normal flex items-start space-x-2.5 text-left">
                <ExternalLink className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Iframe Sandbox Warning:</span>
                  <p className="mt-0.5 text-neutral-405 text-[10px]">Google authentication popups are often blocked by standard browser sandbox policies inside iframes.</p>
                  <button 
                    type="button"
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="mt-2 text-purple-400 hover:text-purple-300 font-bold underline flex items-center gap-1 cursor-pointer text-xs"
                  >
                    Open Admin Deck in New Tab ↗
                  </button>
                </div>
              </div>
            )}

            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-mono flex items-start space-x-2 text-left">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-vault-google-sso"
              type="button"
              disabled={authLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2.5 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-white text-xs font-semibold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.09 15.45.5 12.24.5C5.816.5.6 5.716.6 12.15S5.816 23.8 12.24 23.8c6.705 0 11.164-4.707 11.164-11.364c0-.765-.082-1.35-.18-1.785H12.24z"/>
              </svg>
              <span>Verify with Google Identity SSO</span>
            </button>

          </div>
        ) : (
          /* SECTION 2: THE ACTUAL ADMIN WORKSPACE PANEL */
          <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0c]">
            
            {/* Control panel Stats Grid */}
            <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-b border-white/5 bg-[#0e0e11]">
              
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-450 font-medium">Total Candidates</span>
                  <ClipboardList className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-white">{totalSubmissions}</span>
                  <span className="text-[10px] font-mono text-neutral-500">records</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-450 font-medium">Under Review</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-white">{pendingCount}</span>
                  <span className="text-[10px] sans text-amber-400/80 font-medium">awaiting</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-450 font-medium">Contacted</span>
                  <Activity className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-white">{contactedCount}</span>
                  <span className="text-[10px] font-mono text-neutral-500">leads</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-450 font-medium">Admitted Students</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold text-white">{admittedCount}</span>
                  <span className="text-[10px] text-emerald-450 font-medium">{totalSubmissions > 0 ? Math.round((admittedCount/totalSubmissions)*100) : 0}% conv</span>
                </div>
              </div>

            </div>

            {/* Filter and navigation row */}
            <div className="p-4 bg-[#0c0c0f] border-b border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Left Tabs */}
              <div className="flex items-center bg-white/5 p-1 rounded-xl w-fit shrink-0">
                <button
                  onClick={() => setViewTab('registrations')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewTab === 'registrations' 
                      ? 'bg-[#A855F7] text-white shadow-md' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Applicant Registrations ({registrations.length})
                </button>
                <button
                  onClick={() => setViewTab('students')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewTab === 'students' 
                      ? 'bg-[#A855F7] text-white shadow-md' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Registered Students ({students.length})
                </button>
                <button
                  onClick={() => setViewTab('assignments')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    viewTab === 'assignments' 
                      ? 'bg-[#A855F7] text-white shadow-md' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Vercel Assignments ({assignments.length})
                </button>
              </div>

              {/* Action utilities */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1 md:w-64 min-w-[180px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search by keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-[#A855F7]/40 placeholder:text-neutral-600 transition-all font-mono"
                  />
                </div>

                {viewTab === 'registrations' && (
                  <>
                    {/* Course Filter */}
                    <div className="relative shrink-0">
                      <select
                        value={selectedCourseFilter}
                        onChange={(e) => setSelectedCourseFilter(e.target.value)}
                        className="bg-white/5 border border-white/5 text-xs text-neutral-300 rounded-xl px-3 py-2 outline-none focus:border-[#A855F7]/30"
                      >
                        <option value="All">All Courses</option>
                        {Array.from(new Set([
                          ...COURSES.map(c => c.title),
                          ...registrations.map(r => r.preferredCourse).filter(Boolean)
                        ])).sort().map(courseTitle => (
                          <option key={courseTitle} value={courseTitle}>{courseTitle}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="relative shrink-0">
                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/5 text-xs text-neutral-300 rounded-xl px-3 py-2 outline-none focus:border-[#A855F7]/30"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Received">Received / Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Dynamic Cloud-Sync Indicator */}
                    <button
                      onClick={handleExportCSV}
                      disabled={registrations.length === 0}
                      className="flex items-center space-x-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-neutral-200 rounded-xl transition-all font-semibold active:scale-[0.98] disabled:opacity-30"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </>
                )}

                <button
                  onClick={loadAdminData}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-neutral-400 hover:text-white transition-all text-xs"
                  title="Reload dataset"
                >
                  Refresh
                </button>

              </div>
            </div>

            {/* Dynamic content rendering tables */}
            <div className="flex-1 overflow-auto p-6 min-h-[300px]">
              
              {loadingData ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
                  <p className="text-xs text-neutral-500 font-mono">Decrypting and downloading admin table registers...</p>
                </div>
              ) : viewTab === 'registrations' ? (
                /* REGISTRATIONS VIEW GRID */
                filteredRegs.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                    <ClipboardList className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-neutral-400">No student enrollment listings found</p>
                    <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto leading-normal">
                      Try refining your search text or switching options. No prospective students have finalized registrations matching this filter.
                    </p>
                  </div>
                ) : (
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/5 font-mono uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4 font-bold">Candidate Info</th>
                          <th className="p-4 font-bold">Location / Age</th>
                          <th className="p-4 font-bold">Qualification & Job</th>
                          <th className="p-4 font-bold">Target Track</th>
                          <th className="p-4 font-bold">Goals / Referrals</th>
                          <th className="p-4 font-bold text-center">Status Badge</th>
                          <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredRegs.map((reg) => {
                          const formattedDate = reg.createdAt 
                            ? (typeof reg.createdAt === 'string' 
                              ? new Date(reg.createdAt).toLocaleDateString() 
                              : new Date(reg.createdAt.seconds * 1000).toLocaleDateString())
                            : 'N/A';
                          
                          const status = reg.status || 'Received';

                          return (
                            <tr key={reg.id} className="hover:bg-white/[0.02] text-neutral-300 transition-colors">
                              {/* 1. Name and Contact details */}
                              <td className="p-4 space-y-1">
                                <div className="font-bold text-white text-sm">{reg.fullName}</div>
                                <div className="font-mono text-[11px] text-[#A855F7] select-all">{reg.email}</div>
                                <div className="text-neutral-500 font-mono text-[10px]">{reg.phone}</div>
                                {reg.studentUid && (
                                  <span className="inline-block text-[8px] bg-purple-500/10 text-[#A855F7] px-1.5 py-0.5 rounded font-mono">
                                    UID: {reg.studentUid.slice(0, 8)}...
                                  </span>
                                )}
                              </td>

                              {/* 2. Demographic coordinates */}
                              <td className="p-4 space-y-1 text-neutral-400">
                                <span className="block font-medium text-neutral-300">{reg.country}</span>
                                <span className="block font-mono text-[10px]">{reg.state}, {reg.city}</span>
                                <div className="flex gap-2 text-[10px] text-neutral-500 mt-1">
                                  <span>{reg.gender}</span>
                                  <span>•</span>
                                  <span>DOB: {reg.dateOfBirth}</span>
                                </div>
                              </td>

                              {/* 3. Education & Work Details */}
                              <td className="p-4 space-y-1">
                                <div className="text-white font-medium">{reg.highestQualification}</div>
                                <div className="text-neutral-400 italic text-[11px]">{reg.occupation}</div>
                                <div className="mt-1">
                                  <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                    reg.experienceLevel === 'Advanced' ? 'bg-indigo-500/10 text-indigo-400' :
                                    reg.experienceLevel === 'Intermediate' ? 'bg-sky-500/10 text-sky-400' :
                                    'bg-amber-500/10 text-amber-500'
                                  }`}>
                                    {reg.experienceLevel || 'Beginner'} XP
                                  </span>
                                </div>
                              </td>

                              {/* 4. Target course & learning format */}
                              <td className="p-4 space-y-1.5 min-w-[150px]">
                                <div className="font-bold text-purple-200 leading-normal">{reg.preferredCourse}</div>
                                <div className="flex items-center space-x-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${reg.learningMode === 'Physical' ? 'bg-emerald-400' : 'bg-sky-400'}`} />
                                  <span className="text-[10px] text-neutral-400 font-medium uppercase font-mono">{reg.learningMode} Training</span>
                                </div>
                              </td>

                              {/* 5. Goal summary statements */}
                              <td className="p-4 max-w-xs space-y-1.5 text-neutral-400">
                                <p className="line-clamp-2 leading-relaxed text-neutral-300" title={reg.learningGoals}>
                                  "{reg.learningGoals || 'No statement provided.'}"
                                </p>
                                <div className="text-[10px] text-neutral-500">
                                  <span className="font-semibold text-neutral-400">Referral:</span> {reg.referralSource || 'Unknown source'}
                                </div>
                                <div className="text-[9px] text-neutral-600 font-mono">
                                  Reg: {formattedDate}
                                </div>
                              </td>

                              {/* 6. Live Status dropdown selector */}
                              <td className="p-4 text-center">
                                <div className="inline-block relative">
                                  <select
                                    value={status}
                                    onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[10px] uppercase border outline-none cursor-pointer appearance-none ${
                                      status === 'Admitted' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                      status === 'Contacted' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                                      status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                      'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    }`}
                                  >
                                    <option value="Received">Pending</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Admitted">Admitted</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </div>
                              </td>

                              {/* 7. Delete Record */}
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteCandidate(reg.id)}
                                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                  title="Delete Permanent Applicant Record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : viewTab === 'students' ? (
                /* STUDENTS SYSTEM USERS TAB */
                filteredStudents.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                    <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-neutral-400">No registered accounts logged</p>
                  </div>
                ) : (
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] max-w-5xl mx-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/5 font-mono uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4 font-bold">Registered Student</th>
                          <th className="p-4 font-bold">Contact Email</th>
                          <th className="p-4 font-bold">Enrolled Courses & Status</th>
                          <th className="p-4 font-bold">Vercel Placements</th>
                          <th className="p-4 font-bold">Joined On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredStudents.map((stud) => {
                          const dateJoinedVal = stud.createdAt 
                            ? (typeof stud.createdAt === 'string' 
                              ? new Date(stud.createdAt).toLocaleDateString() 
                              : new Date(stud.createdAt.seconds * 1000).toLocaleDateString())
                            : 'N/A';
                          
                          const emailLower = stud.email.toLowerCase();
                          const isAdminMail = emailLower === 'nuddywale@gmail.com' || emailLower === 'oba6049@gmail.com';

                          // Cross-reference registrations
                          const studentRegs = registrations.filter(r => 
                            (r.email || '').toLowerCase() === (stud.email || '').toLowerCase() || 
                            (r.studentUid && r.studentUid === stud.id)
                          );

                          // Cross-reference assignments
                          const studentAss = assignments.filter(a => 
                            (a.studentEmail || '').toLowerCase() === (stud.email || '').toLowerCase() || 
                            (a.studentUid && a.studentUid === stud.id)
                          );

                          return (
                            <tr key={stud.id} className="hover:bg-white/[0.02] text-neutral-300 transition-colors">
                              <td className="p-4 flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#A855F7]/10 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                  {(stud.fullName || stud.email || 'S')[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span className="truncate">{stud.fullName || 'No name'}</span>
                                    {isAdminMail && (
                                      <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 rounded px-1.5 py-0.5 uppercase font-mono font-bold shrink-0">
                                        Super admin
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-mono text-neutral-500">REF: {stud.id.slice(0, 8)}...</div>
                                </div>
                              </td>
                              <td className="p-4 font-mono select-all text-neutral-300">
                                {stud.email}
                              </td>
                              <td className="p-4 space-y-1.5">
                                {studentRegs.length === 0 ? (
                                  <span className="text-neutral-500 italic text-[11px]">No course enrollment submitted</span>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    {studentRegs.map((reg, index) => {
                                      const status = reg.status || 'Received';
                                      return (
                                        <div key={reg.id || index} className="flex items-center gap-2">
                                          <span className="font-semibold text-white truncate max-w-[160px]" title={reg.preferredCourse}>
                                            {reg.preferredCourse}
                                          </span>
                                          <span className={`px-2 py-0.5 text-[8px] font-bold font-mono uppercase tracking-wider rounded border ${
                                            status === 'Admitted' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            status === 'Contacted' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                                            status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                            'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                          }`}>
                                            {status === 'Received' ? 'Pending' : status}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                {studentAss.length === 0 ? (
                                  <span className="text-neutral-600 font-mono text-[10px]">No submissions</span>
                                ) : (
                                  <div className="space-y-1">
                                    {studentAss.map((ass, index) => (
                                      <div key={ass.id || index} className="flex items-center space-x-1.5 text-[10px]">
                                        <span className="w-1 h-1 rounded-full bg-purple-450" />
                                        <a 
                                          href={ass.vercelUrl} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="font-mono text-[#A855F7] hover:underline font-semibold"
                                        >
                                          Live Code ↗
                                        </a>
                                        <span className={`text-[8px] font-mono px-1 rounded-sm border ${
                                          ass.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                          ass.status === 'Needs Revision' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                          'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                                        }`}>
                                          {ass.status || 'Pending'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="p-4 text-neutral-400 font-mono text-[11px]">
                                {dateJoinedVal}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                /* ASSIGNMENTS VIEW PANELS */
                assignments.length === 0 ? (
                  <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
                    <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-neutral-400">No Vercel assignments submitted yet</p>
                    <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto leading-normal">
                      Students will submit their deployed Vercel and GitHub repository URLs from their student admissions dashboards.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Inline Grading Form Overlay, if active */}
                    {gradingAssignmentId && (
                      <div className="p-6 bg-purple-950/15 border border-[#A855F7]/20 rounded-2xl text-left space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                            Review Student Assignment Placement
                          </h4>
                          <button 
                            onClick={() => { setGradingAssignmentId(null); setFeedbackInput(''); }}
                            className="text-xs font-mono text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-mono font-bold uppercase text-neutral-400 mb-1">
                              Update grading status
                            </label>
                            <select 
                              value={gradingStatus}
                              onChange={(e) => setGradingStatus(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-3 text-neutral-300 text-xs focus:outline-none focus:border-[#A855F7]/30"
                            >
                              <option value="Pending">Pending Review</option>
                              <option value="Approved">Approved (Grade Pass)</option>
                              <option value="Needs Revision">Needs Revision (Redo request)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono font-bold uppercase text-neutral-400 mb-1">
                              Instructor Feedback Comment
                            </label>
                            <input 
                              type="text"
                              required
                              placeholder="Great responsive design! App runs smoothly, API integration verified..."
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              className="w-full bg-neutral-950 border border-white/5 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#A855F7]/30 font-sans"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setGradingAssignmentId(null); setFeedbackInput(''); }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleGradeAssignmentSubmit(gradingAssignmentId)}
                            disabled={gradingLoading}
                            className="px-5 py-2 bg-[#A855F7] hover:bg-purple-600 font-bold text-xs text-white rounded-xl flex items-center justify-center space-x-1"
                          >
                            {gradingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
                            <span>Save Review Decisions</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/5 font-mono uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-4 font-bold">Student Submitter</th>
                            <th className="p-4 font-bold">Enrolled Track Course</th>
                            <th className="p-4 font-bold">Deployed Vercel Live Link</th>
                            <th className="p-4 font-bold">GitHub Source Repo</th>
                            <th className="p-4 font-bold">Student Notes</th>
                            <th className="p-4 font-bold text-center">Grading State</th>
                            <th className="p-4 font-bold text-center">Grade Panel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {assignments.map((ass) => {
                            return (
                              <tr key={ass.id} className="hover:bg-white/[0.02] text-neutral-300 transition-colors">
                                <td className="p-4 space-y-0.5">
                                  <div className="font-bold text-white text-sm">{ass.studentName}</div>
                                  <div className="font-mono text-[10px] text-neutral-500">{ass.studentEmail}</div>
                                </td>
                                <td className="p-4 font-medium text-neutral-300">
                                  {ass.courseName}
                                </td>
                                <td className="p-4 text-left select-all">
                                  <a 
                                    href={ass.vercelUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="font-mono text-[11px] text-[#A855F7] hover:underline flex items-center gap-1 font-semibold"
                                  >
                                    <span>Vercel Live</span>
                                    <span className="text-[9px]">↗</span>
                                  </a>
                                </td>
                                <td className="p-4 text-left">
                                  {ass.githubUrl ? (
                                    <a 
                                      href={ass.githubUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="font-mono text-[11px] text-[#A855F7] hover:underline flex items-center gap-1"
                                    >
                                      <span>GitHub Code</span>
                                      <span className="text-[9px]">↗</span>
                                    </a>
                                  ) : (
                                    <span className="text-neutral-600 font-mono text-[10px]">No Repo Url Provided</span>
                                  )}
                                </td>
                                <td className="p-4 max-w-[180px] truncate text-neutral-400 font-sans hover:text-white cursor-help" title={ass.notes || ''}>
                                  {ass.notes || (
                                    <span className="text-neutral-600 italic">No notes</span>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    <span className={`px-2.5 py-1 text-[9px] font-bold font-mono uppercase tracking-wider rounded-full border ${
                                      ass.status === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                      ass.status === 'Needs Revision' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                      'bg-neutral-500/10 border-neutral-500/20 text-neutral-400'
                                    }`}>
                                      {ass.status}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => {
                                      setGradingAssignmentId(ass.id);
                                      setFeedbackInput(ass.feedback || '');
                                      setGradingStatus(ass.status || 'Pending');
                                    }}
                                    className="px-3 py-1.5 bg-white/5 border border-white/5 text-neutral-250 hover:bg-[#A855F7] hover:text-white hover:border-[#A855F7] rounded-xl text-[10px] font-bold transition-all"
                                  >
                                    Review & Grade
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              )}

            </div>

            {/* Dashboard footer block */}
            <div className="p-4 bg-[#0e0e11] border-t border-white/5 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono">
                System Storage Mode: {isSupabaseConfigured ? '🟢 LIVE_SUPABASE_SECURE' : '🟡 SANDBOX_OFFLINE_LOCAL'}
              </span>
              <div className="flex items-center space-x-2 bg-purple-500/5 px-3 py-1.5 rounded-xl border border-purple-500/10">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] text-neutral-400">Authenticated: <strong className="text-white">{user?.email}</strong></span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
