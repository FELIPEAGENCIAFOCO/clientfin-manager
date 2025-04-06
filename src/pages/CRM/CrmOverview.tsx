
import React from "react";
import { useLeadStore } from "@/store/LeadStore";

const CrmOverview: React.FC = () => {
  const { leads, fetchLeads } = useLeadStore();

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div>
      <h1 className="text-3xl font-bold">CRM Overview</h1>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Lead Summary</h2>
        <p>Total leads: {leads.length}</p>
      </div>
    </div>
  );
};

export default CrmOverview;
