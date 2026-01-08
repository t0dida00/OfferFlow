import { Building2, MapPin, DollarSign, Calendar, FileText } from 'lucide-react';

type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdate: string;
  salary: string;
  location: string;
  notes: string;
}

interface ApplicationCardProps {
  application: Application;
}

const statusConfig = {
  applied: {
    label: 'Applied',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    dotColor: 'bg-gray-500',
  },
  interview: {
    label: 'Interview',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
  },
  offer: {
    label: 'Offer Received',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
  },
  rejected: {
    label: 'Rejected',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
  },
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const status = statusConfig[application.status];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{application.position}</h3>
              <p className="text-gray-600">{application.company}</p>
            </div>
          </div>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bgColor} ${status.textColor}`}>
          <div className={`w-2 h-2 rounded-full ${status.dotColor}`}></div>
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{application.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{application.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Updated: {new Date(application.lastUpdate).toLocaleDateString()}</span>
        </div>
      </div>

      {application.notes && (
        <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">{application.notes}</p>
        </div>
      )}
    </div>
  );
}
