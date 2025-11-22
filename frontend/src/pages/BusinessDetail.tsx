import React from "react";

interface Props {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const BusinessDetail: React.FC<Props> = ({ businessId, onNavigate }) => {
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <button onClick={() => onNavigate("/businesses")}>Back</button>
      <h1>Business Detail - ID: {businessId}</h1>
      <p>You can load API data for this business here.</p>
    </div>
  );
};

