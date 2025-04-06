
import React from "react";
import { useLeadStore } from "@/store/LeadStore";

const Leads: React.FC = () => {
  const { leads, fetchLeads } = useLeadStore();

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Leads</h1>
      {leads.length > 0 ? (
        <ul className="mt-4">
          {leads.map((lead) => (
            <li key={lead.id} className="p-4 border rounded mb-2">
              <div className="font-semibold">{lead.name}</div>
              <div>Status: {lead.status}</div>
              <div>Source: {lead.source}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No leads found.</p>
      )}
    </div>
  );
};

export default Leads;
