import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PageLayout({ children, isAuthenticated, profile, handleLogout, onOpenAuth }) {
  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar 
        isAuthenticated={isAuthenticated} 
        profile={profile} 
        handleLogout={handleLogout} 
        onOpenAuth={onOpenAuth} 
      />
      <main className="main-routed-view" style={{ flex: 1 }}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
