import { BrowserRouter, useLocation, Navigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useContext, useEffect } from "react";
import { VersionContext, VersionProvider } from "./context/VersionContext";
import StatusModal from "./conponents/ui/StatusModal";
import { setVersionModalHandler } from "./utils/versionModalHandler";
import MobileRoutes from "./mobile/routes/MobileRoutes";


function AppContent() {
  const { versionModal, setVersionModal } = useContext(VersionContext);
  const location = useLocation();

  useEffect(() => {
    setVersionModalHandler((message) => {
      setVersionModal({ open: true, message });
    });
  }, [setVersionModal]);

  const isMobilePath =
    location.pathname === "/m" ||
    location.pathname.endsWith("-m") ||
    location.pathname.startsWith("/stock-m/");

  // On first open at root "/", redirect based on screen size
  if (location.pathname === "/" && window.innerWidth < 768) {
    return <Navigate to="/m" replace />;
  }
  // On "/m" with desktop width, redirect to desktop login
  if (location.pathname === "/m" && window.innerWidth >= 768) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {isMobilePath ? <MobileRoutes /> : <AppRoutes />}

      <StatusModal
        isOpen={versionModal.open}
        message={versionModal.message}
        type="error"
        onClose={() => setVersionModal({ open: false, message: "" })}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <VersionProvider>
        <AppContent />
      </VersionProvider>
    </BrowserRouter>
  );
}

export default App;
