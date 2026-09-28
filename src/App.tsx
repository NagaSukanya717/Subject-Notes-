import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { MaterialDetailPage } from './components/MaterialDetailPage';
import { UploadView } from './components/UploadView';
import { UserVaultView } from './components/UserVaultView';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <main className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <div className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'browse' && <BrowseView />}
        {currentView === 'material-detail' && <MaterialDetailPage />}
        {currentView === 'upload' && <UploadView />}
        {currentView === 'vault' && <UserVaultView />}
        {currentView === 'admin' && <AdminPanel />}
      </div>

      <Footer />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
