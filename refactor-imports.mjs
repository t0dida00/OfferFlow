import fs from 'fs';
import path from 'path';

const srcDir = './src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Mappings from old generic import paths to new logical locations
const oldToNewPaths = {
  './ApplicationsTable': './ApplicationsTable',
  '../components/ApplicationsTable': '../../pages/Applications/ApplicationsTable',
  
  './AddApplicationModal': './AddApplicationModal',
  '../components/AddApplicationModal': '../../pages/Applications/AddApplicationModal',
  
  './ApplicationDetailsModal': './ApplicationDetailsModal',
  '../components/ApplicationDetailsModal': '../../pages/Applications/ApplicationDetailsModal',
  
  './ApplicationCard': './ApplicationCard',
  '../components/ApplicationCard': '../../pages/Applications/ApplicationCard',

  './EmailsTable': './EmailsTable',
  '../components/EmailsTable': '../../pages/Emails/EmailsTable',

  './EmailSelectionModal': './EmailSelectionModal',
  '../components/EmailSelectionModal': '../../pages/Emails/EmailSelectionModal',

  './ChartsSection': './ChartsSection',
  '../components/ChartsSection': '../../pages/Overview/ChartsSection',

  './RecentApplicationsList': './RecentApplicationsList',
  '../components/RecentApplicationsList': '../../pages/Overview/RecentApplicationsList',

  './RecentEmailsList': './RecentEmailsList',
  '../components/RecentEmailsList': '../../pages/Overview/RecentEmailsList',

  './Dashboard': './Dashboard',
  '../components/Dashboard': '../../layouts/Dashboard',
  './components/Dashboard': './layouts/Dashboard',
  
  './Sidebar': './Sidebar',
  '../components/Sidebar': '../../layouts/Dashboard/Sidebar',
  
  './BottomNavigation': './BottomNavigation',
  '../components/BottomNavigation': '../../layouts/Dashboard/BottomNavigation',

  './SyncSuccessModal': './SyncSuccessModal',
  '../components/SyncSuccessModal': '../../components/common/SyncSuccessModal',

  './StatusModal': './StatusModal',
  '../components/StatusModal': '../../components/common/StatusModal',

  './LandingPage': './LandingPage',
  '../components/LandingPage': '../../pages/Landing',
  './components/LandingPage': './pages/Landing',

  './LoginPage': './LoginPage',
  '../components/LoginPage': '../../pages/Login',
  './components/LoginPage': './pages/Login',
  
  './LoginSuccess': './LoginSuccess',
  '../components/LoginSuccess': '../../pages/LoginSuccess',
  './components/LoginSuccess': './pages/LoginSuccess',

  './pages/OverviewPage': './pages/Overview',
  './pages/ApplicationsPage': './pages/Applications',
  './pages/EmailsPage': './pages/Emails',
  './pages/CalendarPage': './pages/Calendar',
  './pages/SettingsPage': './pages/Settings',

  './components/Footer': './components/Footer',
  '../components/Footer': '../../components/Footer',
  
  './components/ProtectedRoute': './components/ProtectedRoute',
  
  './components/ThemeToggle': './components/ThemeToggle',
};

// Also we must handle components moving *within* the same folder logically, meaning imports like `../components/Dashboard.module.scss` to `./Dashboard.module.scss` or `../components/Dashboard`.
// It's much easier to just do regex magic for known files.

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // A brute force but relatively effective way for this specific refactoring.
    // Replace all from paths
    // e.g. from '../components/Dashboard.module.scss'
    // First, let's normalize the file path backward slashes to forward slashes for matching
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    
    // We can do a string replacements based on where the file currently IS.
    const fileContent = content.split('\n');
    for (let i = 0; i < fileContent.length; i++) {
        let line = fileContent[i];
        
        // Let's rewrite imports that are strictly broken.
        // It's mostly simpler: Replace strict old strings with absolute aliasing or relative based on file location.
        // It's too complex to write a perfect AST parser in regex. Let's rely on standard patterns.
    }
    
    // Actually, simple replace is easiest:
    const replacements = [
        // App.tsx
        ["import { LoginPage } from './components/LoginPage'", "import { LoginPage } from './pages/Login'"],
        ["import { Dashboard } from './components/Dashboard'", "import { Dashboard } from './layouts/Dashboard'"],
        ["import { LandingPage } from './components/LandingPage'", "import { LandingPage } from './pages/Landing'"],
        ["import { LoginSuccess } from './components/LoginSuccess'", "import { LoginSuccess } from './pages/LoginSuccess'"],
        ["import { OverviewPage } from './pages/OverviewPage'", "import { OverviewPage } from './pages/Overview'"],
        ["import { ApplicationsPage } from './pages/ApplicationsPage'", "import { ApplicationsPage } from './pages/Applications'"],
        ["import { EmailsPage } from './pages/EmailsPage'", "import { EmailsPage } from './pages/Emails'"],
        ["import { CalendarPage } from './pages/CalendarPage'", "import { CalendarPage } from './pages/Calendar'"],
        ["import { SettingsPage } from './pages/SettingsPage'", "import { SettingsPage } from './pages/Settings'"],

        // Shared imports in pages
        ["import { DashboardOutletContext } from '../components/Dashboard'", "import { DashboardOutletContext } from '../../layouts/Dashboard'"],
        ["import styles from '../components/Dashboard.module.scss'", "import styles from '../../layouts/Dashboard/Dashboard.module.scss'"],
        
        ["import { ApplicationsTable } from '../components/ApplicationsTable'", "import { ApplicationsTable } from './ApplicationsTable'"],
        ["import { EmailsTable } from '../components/EmailsTable'", "import { EmailsTable } from './EmailsTable'"],
        ["import { ChartsSection } from '../components/ChartsSection'", "import { ChartsSection } from '../Overview/ChartsSection'"],
        ["import { RecentApplicationsList } from '../components/RecentApplicationsList'", "import { RecentApplicationsList } from '../Overview/RecentApplicationsList'"],
        ["import { RecentEmailsList } from '../components/RecentEmailsList'", "import { RecentEmailsList } from '../Overview/RecentEmailsList'"],
        
        // Layouts Dashboard
        ["import { AddApplicationModal } from './AddApplicationModal'", "import { AddApplicationModal } from '../../pages/Applications/AddApplicationModal'"],
        ["import { SyncSuccessModal } from './SyncSuccessModal'", "import { SyncSuccessModal } from '../../components/common/SyncSuccessModal'"],
        ["import { Sidebar } from './Sidebar'", "import { Sidebar } from './Sidebar'"],
        ["import { BottomNavigation } from './BottomNavigation'", "import { BottomNavigation } from './BottomNavigation'"],
        
        // Modals / Cards
        ["import { ApplicationDetailsModal } from './ApplicationDetailsModal'", "import { ApplicationDetailsModal } from './ApplicationDetailsModal'"],
        ["import { StatusModal } from './StatusModal'", "import { StatusModal } from '../../components/common/StatusModal'"],
        
        // Styles
        ["import styles from './Dashboard.module.scss'", "import styles from './Dashboard.module.scss'"],
        ["import './Dashboard.css'", "import './Dashboard.css'"],
        
        // Cross Domain
        ["import { ApplicationDetailsModal } from './ApplicationDetailsModal'", "import { ApplicationDetailsModal } from '../../pages/Applications/ApplicationDetailsModal'"], // Warning: handled below
    ];

    // Special handlers for ApplicationTable.tsx, RecentApps, etc because they are in different folders now!
    if (normalizedFilePath.includes('src/pages/Overview/RecentApplicationsList.tsx')) {
        content = content.replace("import { ApplicationDetailsModal } from './ApplicationDetailsModal'", "import { ApplicationDetailsModal } from '../../pages/Applications/ApplicationDetailsModal'");
        content = content.replace("import { StatusModal } from './StatusModal'", "import { StatusModal } from '../../components/common/StatusModal'");
    }
    if (normalizedFilePath.includes('src/pages/Applications/ApplicationsTable.tsx')) {
        content = content.replace("import { StatusModal } from './StatusModal'", "import { StatusModal } from '../../components/common/StatusModal'");
    }
    
    // Replace all static mappings
    replacements.forEach(([from, to]) => {
        if (content.includes(from)) {
            content = content.split(from).join(to);
            changed = true;
        }
    });

    // Fix `../types` if we moved them down a directory
    // If the file is now in `src/pages/Applications/ApplicationsTable.tsx` instead of `src/components/ApplicationsTable.tsx`, `../types` becomes `../../types`
    const componentsMovedOneLevelDeeper = [
        'Applications/ApplicationsTable.tsx',
        'Applications/AddApplicationModal.tsx',
        'Applications/ApplicationDetailsModal.tsx',
        'Applications/ApplicationCard.tsx',
        'Emails/EmailsTable.tsx',
        'Emails/EmailSelectionModal.tsx',
        'Overview/ChartsSection.tsx',
        'Overview/RecentApplicationsList.tsx',
        'Overview/RecentEmailsList.tsx',
        'Dashboard/index.tsx', // `src/layouts/Dashboard/index.tsx` was `src/components/Dashboard.tsx`
        'Dashboard/Sidebar.tsx',
        'Dashboard/BottomNavigation.tsx',
        'Landing/index.tsx',
        'Login/index.tsx',
        'LoginSuccess/index.tsx',
        'common/StatusModal.tsx',
        'common/SyncSuccessModal.tsx'
    ];

    if (componentsMovedOneLevelDeeper.some(p => normalizedFilePath.includes(p))) {
        content = content.replace(/from '\.\.\/types'/g, "from '../../types'");
        content = content.replace(/from '\.\.\/services\/api'/g, "from '../../services/api'");
        content = content.replace(/from '\.\.\/public/g, "from '../../public");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
console.log('Refactoring references complete.');
