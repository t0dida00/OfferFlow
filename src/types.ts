export interface Application {
    _id: string;
    company: string;
    role: string;
    location: string;
    date: string;
    status: string;
    emailIds: string[];
}

export interface Email {
    emailId: string;
    subject: string;
    date: string;
    snippet: string;
    status: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    lastSyncTime: string;
}


