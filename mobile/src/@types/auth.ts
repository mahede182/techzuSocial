export type AuthTab = 'login' | 'register';

export interface AuthTabProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
