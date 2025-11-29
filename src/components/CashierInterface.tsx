import { Button } from './ui/button';
import { User, Product, Sale } from '../App';
import { SalesTransaction } from './SalesTransaction';
import { LogOut } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

interface CashierInterfaceProps {
  user: User;
  products: Product[];
  onLogout: () => void;
  onAddSale: (sale: Sale) => void;
}

export function CashierInterface({ user, products, onLogout, onAddSale }: CashierInterfaceProps) {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white border-b border-[#D1EDC5] sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-2 rounded-xl">
                <ShoppingCart className="size-6 text-[#1a5a1a]" />
              </div>
              <div>
                <h1 className="text-xl text-[#1a5a1a]">Cashier POS</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="border-[#D1EDC5] text-[#1a5a1a] hover:bg-[#f0f9ed]">
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <SalesTransaction
          user={user}
          products={products}
          onAddSale={onAddSale}
        />
      </div>
    </div>
  );
}