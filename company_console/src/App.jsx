import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Firmware from './pages/Firmware';
import Release from './pages/Release';
import Vehicles from './pages/Vehicles';

function ComingSoon({ title }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">This module has not been built yet.</p>
    </div>
  );
}

const PAGES = {
  Dashboard: <Dashboard />,
  Firmware: <Firmware />,
  Release: <Release />,
  Vehicles: <Vehicles />,
  'Update History': <ComingSoon title="Update History" />,
};


function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{PAGES[activePage]}</main>
      </div>
    </div>
  );
}

export default App;