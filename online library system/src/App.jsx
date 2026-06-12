import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import NotificationStack from "./components/NotificationStack";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LibraryCatalog from "./pages/LibraryCatalog";

const AppContent = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState(() => {
    if (!currentUser) return null;
    return currentUser.type === "admin" ? "adminDashboard" : "catalog";
  });

  // Update default page when user logs in
  React.useEffect(() => {
    if (currentUser) {
      setCurrentPage(currentUser.type === "admin" ? "adminDashboard" : "catalog");
    }
  }, [currentUser?.id]);

  if (!currentUser) return <LoginPage />;

  const renderPage = () => {
    switch (currentPage) {
      case "adminDashboard":
        return <AdminDashboard />;
      case "studentDashboard":
        return <StudentDashboard />;
      case "catalog":
        return <LibraryCatalog />;
      default:
        return currentUser.type === "admin"
          ? <AdminDashboard />
          : <LibraryCatalog />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <NotificationStack />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
