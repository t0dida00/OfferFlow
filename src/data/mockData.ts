export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  dateApplied: string;
  result: string;
}

// Generate mock data with dates spread across the last 3 months
const today = new Date();

export const mockApplications: Application[] = [
  {
    id: '001',
    company: 'Google',
    role: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    dateApplied: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '002',
    company: 'Meta',
    role: 'Product Manager',
    location: 'Menlo Park, CA',
    dateApplied: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '003',
    company: 'Apple',
    role: 'iOS Developer',
    location: 'Cupertino, CA',
    dateApplied: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Offer',
  },
  {
    id: '004',
    company: 'Amazon',
    role: 'Cloud Solutions Architect',
    location: 'Seattle, WA',
    dateApplied: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '005',
    company: 'Microsoft',
    role: 'Full Stack Developer',
    location: 'Redmond, WA',
    dateApplied: new Date(today.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Rejected',
  },
  {
    id: '006',
    company: 'Netflix',
    role: 'Data Engineer',
    location: 'Los Gatos, CA',
    dateApplied: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '007',
    company: 'Tesla',
    role: 'Embedded Systems Engineer',
    location: 'Palo Alto, CA',
    dateApplied: new Date(today.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '008',
    company: 'Airbnb',
    role: 'UX Designer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '009',
    company: 'Stripe',
    role: 'Backend Engineer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Offer',
  },
  {
    id: '010',
    company: 'Spotify',
    role: 'Machine Learning Engineer',
    location: 'New York, NY',
    dateApplied: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Rejected',
  },
  {
    id: '011',
    company: 'Uber',
    role: 'DevOps Engineer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '012',
    company: 'LinkedIn',
    role: 'Frontend Developer',
    location: 'Sunnyvale, CA',
    dateApplied: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '013',
    company: 'Salesforce',
    role: 'Solutions Engineer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '014',
    company: 'Adobe',
    role: 'Creative Cloud Developer',
    location: 'San Jose, CA',
    dateApplied: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Rejected',
  },
  {
    id: '015',
    company: 'Snap Inc.',
    role: 'AR/VR Engineer',
    location: 'Los Angeles, CA',
    dateApplied: new Date(today.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '016',
    company: 'Twitter',
    role: 'Platform Engineer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '017',
    company: 'Dropbox',
    role: 'Security Engineer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Offer',
  },
  {
    id: '018',
    company: 'Square',
    role: 'Mobile Developer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Pending',
  },
  {
    id: '019',
    company: 'Zoom',
    role: 'Video Platform Engineer',
    location: 'San Jose, CA',
    dateApplied: new Date(today.getTime() - 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Interview',
  },
  {
    id: '020',
    company: 'Coinbase',
    role: 'Blockchain Developer',
    location: 'San Francisco, CA',
    dateApplied: new Date(today.getTime() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    result: 'Rejected',
  },
];
