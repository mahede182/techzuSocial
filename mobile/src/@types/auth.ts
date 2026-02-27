export type AuthTab = 'login' | 'register';

export interface AuthTabProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}
