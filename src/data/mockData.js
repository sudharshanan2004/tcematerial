// Mock data for development - Replace with your own backend API calls

export const mockCategories = [
  {
    id: '1',
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Programming, algorithms, and software development',
    icon: 'PenTool'
  },
  {
    id: '2',
    name: 'Question Papers',
    slug: 'question-papers',
    description: 'Previous year exam papers and solutions',
    icon: 'FileQuestion'
  },
  {
    id: '3',
    name: 'Lab Reports',
    slug: 'lab-reports',
    description: 'Lab manuals and experiment reports',
    icon: 'ClipboardList'
  },
  {
    id: '4',
    name: 'Science',
    slug: 'science',
    description: 'Physics, Chemistry, and Biology materials',
    icon: 'FlaskConical'
  },
  {
    id: '5',
    name: 'Textbooks',
    slug: 'textbooks',
    description: 'Reference books and study guides',
    icon: 'BookOpen'
  },
  {
    id: '6',
    name: 'Others',
    slug: 'others',
    description: 'Miscellaneous study materials',
    icon: 'FolderOpen'
  }
];

export const mockMaterials = [
  {
    id: '1',
    title: 'Data Structures Notes - Complete Unit 1',
    description: 'Comprehensive handwritten notes covering arrays, linked lists, stacks, and queues with examples.',
    subject: 'Data Structures',
    material_type: 'notes',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'ds-unit1-notes.pdf',
    file_size: 2500000,
    download_count: 145,
    view_count: 523,
    semester: 3,
    year: 2024,
    college: 'TCE',
    created_at: '2024-01-15T10:30:00Z',
    uploaded_by: 'user1',
    category_id: '1',
    categories: {
      name: 'Computer Science',
      slug: 'computer-science'
    }
  },
  {
    id: '2',
    title: 'Operating Systems Question Paper - Nov 2023',
    description: 'End semester examination question paper with all units covered.',
    subject: 'Operating Systems',
    material_type: 'question_paper',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'os-qp-nov2023.pdf',
    file_size: 1800000,
    download_count: 89,
    view_count: 312,
    semester: 5,
    year: 2023,
    college: 'TCE',
    created_at: '2024-01-10T14:20:00Z',
    uploaded_by: 'user2',
    category_id: '2',
    categories: {
      name: 'Question Papers',
      slug: 'question-papers'
    }
  },
  {
    id: '3',
    title: 'Database Management System Notes',
    description: 'Complete DBMS notes with SQL queries, normalization, and ER diagrams.',
    subject: 'DBMS',
    material_type: 'notes',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'dbms-complete-notes.pdf',
    file_size: 3200000,
    download_count: 234,
    view_count: 678,
    semester: 4,
    year: 2024,
    college: 'TCE',
    created_at: '2024-01-08T09:15:00Z',
    uploaded_by: 'user1',
    category_id: '1',
    categories: {
      name: 'Computer Science',
      slug: 'computer-science'
    }
  },
  {
    id: '4',
    title: 'Computer Networks Lab Manual',
    description: 'Lab experiments with programs for socket programming, routing algorithms.',
    subject: 'Computer Networks',
    material_type: 'other',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'cn-lab-manual.pdf',
    file_size: 1500000,
    download_count: 67,
    view_count: 198,
    semester: 5,
    year: 2024,
    college: 'TCE',
    created_at: '2024-01-05T11:45:00Z',
    uploaded_by: 'user3',
    category_id: '3',
    categories: {
      name: 'Lab Reports',
      slug: 'lab-reports'
    }
  },
  {
    id: '5',
    title: 'Machine Learning Handwritten Notes',
    description: 'Detailed notes on supervised learning, neural networks, and deep learning basics.',
    subject: 'Machine Learning',
    material_type: 'notes',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'ml-notes.pdf',
    file_size: 4100000,
    download_count: 178,
    view_count: 445,
    semester: 7,
    year: 2024,
    college: 'TCE',
    created_at: '2024-01-03T16:30:00Z',
    uploaded_by: 'user2',
    category_id: '1',
    categories: {
      name: 'Computer Science',
      slug: 'computer-science'
    }
  },
  {
    id: '6',
    title: 'Engineering Mathematics III - Question Bank',
    description: 'Collection of important questions with solutions for M3.',
    subject: 'Mathematics',
    material_type: 'question_paper',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'm3-question-bank.pdf',
    file_size: 2800000,
    download_count: 156,
    view_count: 389,
    semester: 3,
    year: 2024,
    college: 'TCE',
    created_at: '2024-01-01T08:00:00Z',
    uploaded_by: 'user1',
    category_id: '2',
    categories: {
      name: 'Question Papers',
      slug: 'question-papers'
    }
  }
];

// Mock user data
export const mockUser = {
  id: 'user1',
  email: 'student@college.edu',
  displayName: 'John Doe'
};

// Mock saved materials (material IDs saved by user)
export const mockSavedMaterialIds = ['1', '3', '5'];

// Helper function to get saved materials
export const getSavedMaterials = () => {
  return mockSavedMaterialIds.map(id => {
    const material = mockMaterials.find(m => m.id === id);
    return {
      id: `saved-${id}`,
      saved_at: new Date().toISOString(),
      materials: material
    };
  }).filter(item => item.materials);
};

// Helper function to get user uploads
export const getUserUploads = (userId) => {
  return mockMaterials.filter(m => m.uploaded_by === userId);
};

// Helper function to get user stats
export const getUserStats = (userId) => {
  const uploads = getUserUploads(userId);
  return {
    totalUploads: uploads.length,
    totalViews: uploads.reduce((sum, m) => sum + m.view_count, 0),
    totalDownloads: uploads.reduce((sum, m) => sum + m.download_count, 0)
  };
};
