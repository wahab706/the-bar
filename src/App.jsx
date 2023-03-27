import { useState } from "react";
import Routes1 from "./Routes";
import { AppContext } from "./components/providers/ContextProvider";
import { AuthProvider } from "./components/providers/AuthProvider";

export default function App() {
  const apiUrl = "https://phpstack-899754-3368767.cloudwaysapps.com";

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
