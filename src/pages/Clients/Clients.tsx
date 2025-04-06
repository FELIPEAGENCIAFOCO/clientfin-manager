
import React from "react";
import { useClientStore } from "@/store/ClientStore";

const Clients: React.FC = () => {
  const { clients, fetchClients } = useClientStore();

  React.useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Clients</h1>
      {clients.length > 0 ? (
        <ul className="mt-4">
          {clients.map((client) => (
            <li key={client.id} className="p-4 border rounded mb-2">
              {client.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4">No clients found.</p>
      )}
    </div>
  );
};

export default Clients;
