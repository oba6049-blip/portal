/**
 * Supabase Client & Connection Management
 */
import { createClient } from '@supabase/supabase-js';
import { RegistrationData } from './types';

// Retrieve Vite-forwarded secrets or environment properties safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configured state safely before starting Supabase connection
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "undefined" && supabaseAnonKey !== "undefined");

let supabaseInstance: any = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn("Supabase initialization failed. Defaulting to local storage mode.", error);
  }
}

export const supabase = supabaseInstance;

// Row mapping helper to resolve differences between database fields and the UI models
function mapRegistrationRow(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name || row.fullName || '',
    email: row.email || '',
    phone: row.phone || '',
    gender: row.gender || '',
    dateOfBirth: row.date_of_birth || row.dateOfBirth || '',
    country: row.country || '',
    state: row.state || '',
    city: row.city || '',
    highestQualification: row.highest_qualification || row.highestQualification || '',
    occupation: row.occupation || '',
    preferredCourse: row.preferred_course || row.preferredCourse || '',
    learningMode: row.learning_mode || row.learningMode || 'Online',
    experienceLevel: row.experience_level || row.experienceLevel || 'Beginner',
    learningGoals: row.learning_goals || row.learningGoals || '',
    referralSource: row.referral_source || row.referralSource || '',
    studentUid: row.student_uid || row.studentUid || '',
    status: row.status || 'Pending',
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function mapAssignmentRow(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    studentUid: row.student_uid || row.studentUid || '',
    studentEmail: row.student_email || row.studentEmail || '',
    studentName: row.student_name || row.studentName || '',
    registrationId: row.registration_id || row.registrationId || '',
    courseName: row.course_name || row.courseName || '',
    vercelUrl: row.vercel_url || row.vercelUrl || '',
    githubUrl: row.github_url || row.githubUrl || '',
    notes: row.notes || '',
    status: row.status || 'Pending',
    feedback: row.feedback || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
  };
}

/**
 * Persists a new student registration to Supabase (or Local Storage fall-back)
 */
export async function submitStudentRegistration(registration: RegistrationData): Promise<{ id: string; source: 'supabase' | 'localStorage' }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          full_name: registration.fullName,
          email: registration.email,
          phone: registration.phone,
          gender: registration.gender,
          date_of_birth: registration.dateOfBirth,
          country: registration.country,
          state: registration.state,
          city: registration.city,
          highest_qualification: registration.highestQualification,
          occupation: registration.occupation,
          preferred_course: registration.preferredCourse,
          learning_mode: registration.learningMode,
          experience_level: registration.experienceLevel,
          learning_goals: registration.learningGoals,
          referral_source: registration.referralSource,
          student_uid: registration.studentUid || null,
          status: 'Pending',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.warn("Supabase registration write failed, using local storage fallback:", error.message);
        throw error;
      }
      return { id: data?.[0]?.id || `sup-${Date.now()}`, source: 'supabase' };
    } catch (e) {
      console.error("Supabase failed during registration submit", e);
    }
  }

  // Fallback database simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const localDataString = localStorage.getItem('textocode_registrations') || '[]';
      const registrations = JSON.parse(localDataString);
      
      const newRecord = {
        ...registration,
        id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: registration.studentUid ? 'Pending' : 'Pending', // default status
        createdAt: new Date().toISOString()
      };
      
      registrations.push(newRecord);
      localStorage.setItem('textocode_registrations', JSON.stringify(registrations));
      resolve({ id: newRecord.id, source: 'localStorage' });
    }, 1200);
  });
}

/**
 * Creates/Updates the Student profile in Supabase
 */
export async function saveStudentProfile(uid: string, fullName: string, email: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('students')
        .upsert({
          uid: uid,
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString()
        });
      if (!error) return;
      console.warn("Supabase saveStudentProfile failed, using local storage fallback:", error.message);
    } catch (e) {
      console.error("Supabase error during profile upsert:", e);
    }
  }

  const localStudents = JSON.parse(localStorage.getItem('textocode_students') || '{}');
  localStudents[uid] = {
    fullName,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('textocode_students', JSON.stringify(localStudents));
}

/**
 * Fetches Student registrations matching email or optional studentUid state 
 */
export async function fetchStudentRegistrations(email: string, studentUid?: string): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let results: any[] = [];
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', email);

      if (!error && data) {
        results = data.map(mapRegistrationRow);
      }

      // Fallback/Supplement with student_uid lookup
      if (results.length === 0 && studentUid) {
        const { data: uidData, error: uidError } = await supabase
          .from('registrations')
          .select('*')
          .eq('student_uid', studentUid);
        if (!uidError && uidData) {
          results = uidData.map(mapRegistrationRow);
        }
      }
      return results;
    } catch (e) {
      console.error("Supabase fetch registrations failed, falling back to local storage:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_registrations') || '[]';
  const registrations = JSON.parse(localDataString);
  if (studentUid) {
    return registrations.filter((reg: any) => reg.email === email || reg.studentUid === studentUid);
  }
  return registrations.filter((reg: any) => reg.email === email);
}

/**
 * Admin Only: Retrieves all registered candidates from Supabase or LocalStorage
 */
export async function adminFetchAllRegistrations(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*');
      if (!error && data) {
        return data.map(mapRegistrationRow);
      }
      console.warn("Supabase adminFetchAllRegistrations failed, using local storage:", error?.message);
    } catch (e) {
      console.error("Supabase Admin registries fetch error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_registrations') || '[]';
  return JSON.parse(localDataString);
}

/**
 * Admin Only: Retrieves all registered student authentication records
 */
export async function adminFetchAllStudents(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');
      if (!error && data) {
        return data.map(row => ({
          id: row.uid || row.id,
          uid: row.uid || row.id,
          fullName: row.full_name || row.fullName || 'Textocode Student',
          email: row.email,
          createdAt: row.created_at || row.createdAt || new Date().toISOString(),
          updatedAt: row.updated_at || row.updatedAt || new Date().toISOString()
        }));
      }
      console.warn("Supabase adminFetchAllStudents failed, using local storage:", error?.message);
    } catch (e) {
      console.error("Supabase Admin students fetch error:", e);
    }
  }

  const localStudents = JSON.parse(localStorage.getItem('textocode_students') || '{}');
  return Object.entries(localStudents).map(([uid, data]: [string, any]) => ({
    id: uid,
    uid,
    fullName: data.fullName,
    email: data.email,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }));
}

/**
 * Admin Only: Delete a student registration request permanently
 */
export async function adminDeleteRegistration(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);
      if (!error) return;
      console.warn("Supabase delete failed, using local storage:", error.message);
    } catch (e) {
      console.error("Supabase delete registration error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_registrations') || '[]';
  let registrations = JSON.parse(localDataString);
  registrations = registrations.filter((reg: any) => reg.id !== id);
  localStorage.setItem('textocode_registrations', JSON.stringify(registrations));
}

/**
 * Admin Only: Update the status of registering candidates
 */
export async function adminUpdateRegistrationStatus(id: string, updateFields: any): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const dbFields: any = {};
      if (updateFields.status !== undefined) dbFields.status = updateFields.status;
      if (updateFields.feedback !== undefined) dbFields.feedback = updateFields.feedback;
      dbFields.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('registrations')
        .update(dbFields)
        .eq('id', id);
      if (!error) return;
      console.warn("Supabase update registration failed, using local storage:", error.message);
    } catch (e) {
      console.error("Supabase update registration status error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_registrations') || '[]';
  const registrations = JSON.parse(localDataString);
  const updated = registrations.map((reg: any) => {
    if (reg.id === id) {
      return { ...reg, ...updateFields, updatedAt: new Date().toISOString() };
    }
    return reg;
  });
  localStorage.setItem('textocode_registrations', JSON.stringify(updated));
}

/**
 * Submits an assignment submission with URL assets
 */
export async function submitAssignment(assignmentData: {
  studentUid: string;
  studentEmail: string;
  studentName: string;
  registrationId: string;
  courseName: string;
  vercelUrl: string;
  githubUrl?: string;
  notes?: string;
}): Promise<void> {
  const payload = {
    ...assignmentData,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('assignments')
        .upsert({
          id: assignmentData.registrationId, // register identifier is the submission ID
          student_uid: assignmentData.studentUid,
          student_email: assignmentData.studentEmail,
          student_name: assignmentData.studentName,
          registration_id: assignmentData.registrationId,
          course_name: assignmentData.courseName,
          vercel_url: assignmentData.vercelUrl,
          github_url: assignmentData.githubUrl || null,
          notes: assignmentData.notes || null,
          status: 'Pending',
          updated_at: new Date().toISOString()
        });
      if (!error) return;
      console.warn("Supabase submitAssignment failed, using local storage fallback:", error.message);
    } catch (e) {
      console.error("Supabase assignments submit error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_assignments') || '[]';
  let assignments = JSON.parse(localDataString);
  assignments = assignments.filter((a: any) => a.registrationId !== assignmentData.registrationId);
  assignments.push({
    ...payload,
    id: assignmentData.registrationId
  });
  localStorage.setItem('textocode_assignments', JSON.stringify(assignments));
}

/**
 * Retrieves the assignment submission matching a specific course registration
 */
export async function getAssignmentByRegistration(registrationId: string): Promise<any | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('registration_id', registrationId)
        .maybeSingle();
      if (!error && data) {
        return mapAssignmentRow(data);
      }
      if (error) {
        console.warn("Supabase getAssignmentByRegistration failed, using local storage:", error.message);
      }
    } catch (e) {
      console.error("Supabase load assignments error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_assignments') || '[]';
  const assignments = JSON.parse(localDataString);
  return assignments.find((a: any) => a.registrationId === registrationId) || null;
}

/**
 * Admin Only: Retrieves all submitting student assignments from Supabase/LocalStorage
 */
export async function adminFetchAllAssignments(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*');
      if (!error && data) {
        return data.map(mapAssignmentRow);
      }
      console.warn("Supabase adminFetchAllAssignments failed, using local storage:", error?.message);
    } catch (e) {
      console.error("Supabase Admin assignments fetch error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_assignments') || '[]';
  return JSON.parse(localDataString);
}

/**
 * Admin Only: Sets feedback and status on a student assignment submission
 */
export async function adminGradeAssignment(registrationId: string, status: 'Pending' | 'Approved' | 'Needs Revision', feedback: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status,
          feedback,
          updated_at: new Date().toISOString()
        })
        .eq('registration_id', registrationId);
      if (!error) return;
      console.warn("Supabase adminGradeAssignment failed, using local storage fallback:", error.message);
    } catch (e) {
      console.error("Supabase admin grading error:", e);
    }
  }

  const localDataString = localStorage.getItem('textocode_assignments') || '[]';
  let assignments = JSON.parse(localDataString);
  assignments = assignments.map((a: any) => {
    if (a.registrationId === registrationId) {
      return {
        ...a,
        status,
        feedback,
        updatedAt: new Date().toISOString()
      };
    }
    return a;
  });
  localStorage.setItem('textocode_assignments', JSON.stringify(assignments));
}
