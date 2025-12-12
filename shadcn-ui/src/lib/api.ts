const API_BASE_URL = 'http://localhost/classroom/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<T>;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (username_email: string, password: string, role: 'admin' | 'faculty') =>
      apiRequest('auth.php', {
        method: 'POST',
        body: JSON.stringify({ username_email, password, role }),
      }),
    check: () => apiRequest('auth.php?check=1'),
    logout: () => apiRequest('auth.php', { method: 'DELETE' }),
  },

  // Departments
  departments: {
    list: () => apiRequest('departments.php?action=list'),
    get: (id: number) => apiRequest(`departments.php?action=get&id=${id}`),
    create: (data: { name: string }) =>
      apiRequest('departments.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: { id: number; name: string }) =>
      apiRequest('departments.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`departments.php?id=${id}`, { method: 'DELETE' }),
  },

  // Semesters
  semesters: {
    list: () => apiRequest('semesters.php?action=list'),
    get: (id: number) => apiRequest(`semesters.php?action=get&id=${id}`),
    getByDept: (dept_id: number) => apiRequest(`semesters.php?action=by_dept&dept_id=${dept_id}`),
    create: (data: { dept_id: number; name: string; type: 'Odd' | 'Even' }) =>
      apiRequest('semesters.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: { id: number; dept_id: number; name: string; type: 'Odd' | 'Even' }) =>
      apiRequest('semesters.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`semesters.php?id=${id}`, { method: 'DELETE' }),
  },

  // Divisions
  divisions: {
    list: () => apiRequest('divisions.php?action=list'),
    get: (id: number) => apiRequest(`divisions.php?action=get&id=${id}`),
    getBySemester: (semester_id: number) =>
      apiRequest(`divisions.php?action=by_semester&semester_id=${semester_id}`),
    create: (data: { semester_id: number; name: string; num_students: number }) =>
      apiRequest('divisions.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: {
      id: number;
      semester_id: number;
      name: string;
      num_students: number;
    }) => apiRequest('divisions.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`divisions.php?id=${id}`, { method: 'DELETE' }),
  },

  // Classrooms
  classrooms: {
    list: () => apiRequest('classrooms.php?action=list'),
    get: (id: number) => apiRequest(`classrooms.php?action=get&id=${id}`),
    getByDept: (dept_id: number, type?: string) => {
      const url = type
        ? `classrooms.php?action=by_dept&dept_id=${dept_id}&type=${type}`
        : `classrooms.php?action=by_dept&dept_id=${dept_id}`;
      return apiRequest(url);
    },
    create: (data: { room_number: string; dept_id: number; type: 'Classroom' | 'Lab'; capacity: number }) =>
      apiRequest('classrooms.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: {
      id: number;
      room_number: string;
      dept_id: number;
      type: 'Classroom' | 'Lab';
      capacity: number;
    }) => apiRequest('classrooms.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`classrooms.php?id=${id}`, { method: 'DELETE' }),
  },

  // Faculty
  faculty: {
    list: (filters?: { filter_dept?: number; filter_sem?: number; filter_subject?: number }) => {
      const params = new URLSearchParams();
      if (filters?.filter_dept) params.append('filter_dept', filters.filter_dept.toString());
      if (filters?.filter_sem) params.append('filter_sem', filters.filter_sem.toString());
      if (filters?.filter_subject) params.append('filter_subject', filters.filter_subject.toString());
      const query = params.toString();
      return apiRequest(`faculty.php?action=list${query ? '&' + query : ''}`);
    },
    get: (id: number) => apiRequest(`faculty.php?action=get&id=${id}`),
    create: (data: {
      name: string;
      email?: string;
      phone?: string;
      dept_id: number;
      subject_ids?: number[];
    }) => apiRequest('faculty.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: {
      id: number;
      name: string;
      email?: string;
      phone?: string;
      dept_id: number;
      subject_ids?: number[];
    }) => apiRequest('faculty.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`faculty.php?id=${id}`, { method: 'DELETE' }),
  },

  // Subjects
  subjects: {
    list: () => apiRequest('subjects.php?action=list'),
    get: (id: number) => apiRequest(`subjects.php?action=get&id=${id}`),
    getBySemester: (semester_id: number) =>
      apiRequest(`subjects.php?action=by_semester&semester_id=${semester_id}`),
    create: (data: {
      subject_name: string;
      subject_code: string;
      credits: number;
      dept_id: number;
      semester_id: number;
    }) => apiRequest('subjects.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: {
      id: number;
      subject_name: string;
      subject_code: string;
      credits: number;
      dept_id: number;
      semester_id: number;
    }) => apiRequest('subjects.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`subjects.php?id=${id}`, { method: 'DELETE' }),
  },

  // Constraints
  constraints: {
    list: () => apiRequest('constraints.php?action=list'),
    get: (id: number) => apiRequest(`constraints.php?action=get&id=${id}`),
    getLatest: () => apiRequest('constraints.php?action=latest'),
    create: (data: { num_weekdays: number; num_daily_slots: number; lab_slot_length: number }) =>
      apiRequest('constraints.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (data: {
      id: number;
      num_weekdays: number;
      num_daily_slots: number;
      lab_slot_length: number;
    }) => apiRequest('constraints.php', { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => apiRequest(`constraints.php?id=${id}`, { method: 'DELETE' }),
  },

  // Timetable
  timetable: {
    list: (division_id?: number) => {
      const url = division_id
        ? `timetable.php?action=list&division_id=${division_id}`
        : 'timetable.php?action=list';
      return apiRequest(url);
    },
    getByDivision: (division_id: number) =>
      apiRequest(`timetable.php?action=by_division&division_id=${division_id}`),
    getByFaculty: (faculty_id: number) =>
      apiRequest(`timetable.php?action=by_faculty&faculty_id=${faculty_id}`),
    generate: () => apiRequest('timetable.php?action=generate', { method: 'POST' }),
    reset: () => apiRequest('timetable.php?action=reset', { method: 'DELETE' }),
  },
};

