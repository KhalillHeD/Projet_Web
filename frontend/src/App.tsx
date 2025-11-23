import React from 'react';
import { useRouter } from './hooks/useRouter';
import { matchRoute } from './utils/router';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Businesses } from './pages/Businesses';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Billing } from './pages/Billing';
import { Stock } from './pages/Stock';
import { Settings } from './pages/Settings';
import { useAuth } from "./context/AuthContext";


function App() {
  const { currentPath, navigate } = useRouter();
  const auth = useAuth();
  console.log("AUTH CONTEXT:", auth);

  const renderPage = () => {
    if (currentPath === '/') {
      return (
        <>
          <Navbar onNavigate={navigate} transparent />
          <Home onNavigate={navigate} />
          <Footer />
        </>
      );
    }

    if (currentPath === '/login') {
      return <Login onNavigate={navigate} />;
    }

    if (currentPath === '/signup') {
      return <Signup onNavigate={navigate} />;
    }

    if (currentPath === '/businesses') {
      return <Businesses onNavigate={navigate} />;
    }

    const dashboardMatch = matchRoute('/business/:id', currentPath);
    if (dashboardMatch.match && currentPath === `/business/${dashboardMatch.params.id}`) {
      return <Dashboard businessId={dashboardMatch.params.id} onNavigate={navigate} />;
    }

    const transactionsMatch = matchRoute('/business/:id/transactions', currentPath);
    if (transactionsMatch.match) {
      return <Transactions businessId={transactionsMatch.params.id} onNavigate={navigate} />;
    }

    const billingMatch = matchRoute('/business/:id/billing', currentPath);
    if (billingMatch.match) {
      return <Billing businessId={billingMatch.params.id} onNavigate={navigate} />;
    }

    const stockMatch = matchRoute('/business/:id/stock', currentPath);
    if (stockMatch.match) {
      return <Stock businessId={stockMatch.params.id} onNavigate={navigate} />;
    }

    const settingsMatch = matchRoute('/business/:id/settings', currentPath);
    if (settingsMatch.match) {
      return <Settings businessId={settingsMatch.params.id} onNavigate={navigate} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FF]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0B1A33] mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1A6AFF] text-white rounded-xl hover:bg-[#1557d9] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  };

  return <>{renderPage()}</>;
}

export default App;
