
import React from "react";
import { useParams } from "react-router-dom";
import { useClientStore } from "@/store/ClientStore";
import { usePaymentStore } from "@/store/PaymentStore";
import { useFinancialTransactionStore } from "@/store/FinancialTransactionStore";

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedClient, fetchClient } = useClientStore();
  const { payments, fetchPaymentsForClient } = usePaymentStore();
  const { financialTransactions, fetchFinancialTransactionsForClient } = useFinancialTransactionStore();

  React.useEffect(() => {
    if (id) {
      fetchClient(id);
      fetchPaymentsForClient(id);
      fetchFinancialTransactionsForClient(id);
    }
  }, [id, fetchClient, fetchPaymentsForClient, fetchFinancialTransactionsForClient]);

  if (!selectedClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{selectedClient.name}</h1>
      <div className="mt-4">
        <p><strong>Email:</strong> {selectedClient.email}</p>
        <p><strong>Phone:</strong> {selectedClient.phone}</p>
        <p><strong>Address:</strong> {selectedClient.address}</p>
        {selectedClient.company_name && (
          <p><strong>Company:</strong> {selectedClient.company_name}</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;
