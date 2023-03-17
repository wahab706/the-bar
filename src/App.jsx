import { useState } from "react";
import Routes1 from "./Routes";
import { MainLayout } from "./components";
import { AppContext } from "./components/providers/ContextProvider";
import { AuthProvider } from "./components/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function App() {
  const apiUrl = "https://phpstack-908320-3153127.cloudwaysapps.com";

  const [locationChange, setLocationChange] = useState(location.pathname);

  return (
    <>
      <AuthProvider apiUrl={apiUrl}>
        <AppContext.Provider
          value={{
            locationChange,
            setLocationChange,
            apiUrl,
          }}
        >
          <Routes1 />
        </AppContext.Provider>
      </AuthProvider>
    </>
  );
}
