import {
    LayoutDashboard,
    Briefcase,
    Mail,
    Calendar,
    Settings,
    LogOut,
    User as UserIcon
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
    user: User | null;
    currentView: string;
    onNavigate: (view: string) => void;
    onLogout: () => void;
}

export function Sidebar({
    user,
    currentView,
    onNavigate,
    onLogout
}: SidebarProps) {

    const mainNavItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'applications', label: 'Applications', icon: Briefcase },
        { id: 'emails', label: 'Emails', icon: Mail },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
    ];

    const supportNavItems = [
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const NavItem = ({ item }: { item: any }) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
            <button
                onClick={() => onNavigate(item.id)}
                className={`
          w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative cursor-pointer
          ${isActive
                        ? 'font-bold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}
        `}
                style={isActive ? { backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' } : undefined}
            >
                <Icon
                    className={`w-[22px] h-[22px] stroke-[1.5px] flex-shrink-0 ${isActive ? '' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'}`}
                    style={isActive ? { color: 'var(--btn-text)' } : undefined}
                />
                <span className="whitespace-nowrap">{item.label}</span>
            </button>
        );
    };

    return (
        <div
            className={`
        bg-white dark:bg-gray-800 flex flex-col w-72
        h-screen sticky top-0 border border-r border-[#232F3F] dark:border-gray-800
      `}
        >
            {/* Header / Logo */}
            <div className="h-24 flex items-center p-6 border-b border-[#232F3F]  mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-[#232F3F] dark:text-white ">
                    OFFERFLOW
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-12 overflow-y-auto ">
                <div className="space-y-2">
                    {mainNavItems.map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="space-y-2">
                    <div className="px-4 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Support
                    </div>
                    <div className="space-y-2">
                        {supportNavItems.map((item) => (
                            <NavItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className="p-6 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center border border-blue-200 dark:border-blue-700">
                            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            @{user?.email?.split('@')[0]}
                        </p>
                    </div>

                    <button
                        onClick={onLogout}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
