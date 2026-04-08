import { createContext, useState } from "react";

export const VersionContext = createContext();

export const VersionProvider = ({ children }) => {
  const [versionModal, setVersionModal] = useState({
    open: false,
    message: "",
  });

  return (
    <VersionContext.Provider value={{ versionModal, setVersionModal }}>
      {children}
    </VersionContext.Provider>
  );
};