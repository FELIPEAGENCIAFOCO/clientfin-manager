
import React from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DreReport: React.FC = () => {
  // Sample data - would be replaced with real data from your financial transactions
  const financialData = {
    revenue: {
      sales: 150000,
      services: 75000,
      other: 5000,
      total: 230000
    },
    expenses: {
      cogs: 85000,
      salaries: 45000,
      marketing: 18000,
      rent: 12000,
      utilities: 5000,
      other: 7000,
      total: 172000
    },
    grossProfit: 145000,
    operatingProfit: 58000,
    netProfit: 43500
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Demonstração do Resultado do Exercício (DRE)</h1>
      </div>
      
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resumo Financeiro</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.revenue.total)}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Despesas Totais</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financialData.expenses.total)}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Lucro Líquido</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(financialData.netProfit)}</p>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3">Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell>1. RECEITA OPERACIONAL BRUTA</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.revenue.total)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Receita com Vendas</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.revenue.sales)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Receita com Serviços</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.revenue.services)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Outras Receitas</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.revenue.other)}</TableCell>
              </TableRow>
              
              <TableRow className="font-medium">
                <TableCell>2. CUSTOS E DESPESAS</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.total)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Custo dos Produtos Vendidos</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.cogs)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Salários e Encargos</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.salaries)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Marketing e Publicidade</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.marketing)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Aluguel</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.rent)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Utilities</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.utilities)}</TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell className="pl-8">Outras Despesas</TableCell>
                <TableCell className="text-right">{formatCurrency(financialData.expenses.other)}</TableCell>
              </TableRow>
              
              <TableRow className="bg-gray-50">
                <TableCell className="font-medium">3. LUCRO BRUTO (1-2)</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(financialData.grossProfit)}</TableCell>
              </TableRow>
              
              <TableRow className="bg-gray-100">
                <TableCell className="font-medium">4. LUCRO OPERACIONAL</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(financialData.operatingProfit)}</TableCell>
              </TableRow>
              
              <TableRow className="bg-gray-200">
                <TableCell className="font-bold">5. LUCRO LÍQUIDO</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(financialData.netProfit)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DreReport;
