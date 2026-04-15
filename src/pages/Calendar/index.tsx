import { Calendar } from 'lucide-react';

export function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Calendar Coming Soon</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        We're working hard to bring you a fully integrated calendar view. Stay tuned!
      </p>
    </div>
  );
}
