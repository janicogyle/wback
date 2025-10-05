/**
 * Development environment configuration
 */

module.exports = {
  // Application settings
  app: {
    name: 'GCCCS CareerLink',
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
  },
  
  // Authentication settings
  auth: {
    tokenKey: 'token',
    userRoleKey: 'userRole',
    roles: {
      student: 'student',
      careerOffice: 'career_office',
      graduate: 'graduate'
    },
    defaultRole: 'student',
    tokens: {
      student: 'student-token',
      careerOffice: 'career-office-token',
      graduate: 'graduate-token'
    }
  },
  
  // Navigation settings
  navigation: {
    publicLinks: [
      { name: 'Home', path: '/' },
      { name: 'Events', path: '/events' },
      { name: 'About', path: '/about' },
    ],
    authenticatedLinks: {
      student: [
        { name: 'Events', path: '/events' },
        { name: 'About', path: '/about' },
        { name: 'Dashboard', path: '/dashboard/student' },
      ],
      careerOffice: [
        { name: 'Events', path: '/events' },
        { name: 'About', path: '/about' },
        { name: 'Dashboard', path: '/dashboard/career-office' },
      ],
      // Graduates use the same dashboard as students in this app
      graduate: [
        { name: 'Events', path: '/events' },
        { name: 'About', path: '/about' },
        { name: 'Dashboard', path: '/dashboard/student' },
      ],
    },
    dashboardRedirects: {
      student: '/dashboard/student',
      careerOffice: '/dashboard/career-office',
      // Redirect graduates to the student dashboard (shared experience)
      graduate: '/dashboard/student',
    },
  },
  
  // UI settings
  ui: {
    theme: {
      primary: '#FF6600',
      primaryLight: '#FF8533',
      primaryDark: '#CC5200',
      background: '#FFFFFF',
      foreground: '#171717',
    },
    breakpoints: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
  
  // Form validation settings
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordMinLength: 6,
  },
};