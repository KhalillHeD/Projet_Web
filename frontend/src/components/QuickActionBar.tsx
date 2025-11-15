import React from 'react';
import { Plus, Receipt, Package, FileText, Eye } from 'lucide-react';
import { Button } from './Button';

interface QuickActionBarProps {
  onAction: (action: string) => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onAction }) => {
  const actions = [
    { icon: <Plus size={20} />, label: 'Add Transaction', action: 'add-transaction', variant: 'primary' as const },
    { icon: <Package size={20} />, label: 'Add Stock Item', action: 'add-stock', variant: 'success' as const },
    { icon: <FileText size={20} />, label: 'Generate Invoice', action: 'generate-invoice', variant: 'warning' as const },
    { icon: <Receipt size={20} />, label: 'View Transactions', action: 'view-transactions', variant: 'secondary' as const },
    { icon: <Eye size={20} />, label: 'View Stock', action: 'view-stock', variant: 'outline' as const },
  ];

  return (
    <div className="flex flex-wrap gap-3 animate-fade-in">
      {actions.map((action, index) => (
        <Button
          key={action.action}
          variant={action.variant}
          size="md"
          icon={action.icon}
          onClick={() => onAction(action.action)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
