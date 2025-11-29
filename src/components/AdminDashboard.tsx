import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Product, Sale } from '../App';
import { InventoryManagement } from './InventoryManagement';
import { ReportsPage } from './ReportsPage';
import { SalesTransaction } from './SalesTransaction';
import { LogOut, LayoutDashboard, Package, FileText, ShoppingCart } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  products: Product[];
  sales: Sale[];
  onLogout: () => void;
  onUpdateProducts: (products: Product[]) => void;
  onAddSale: (sale: Sale) => void;
}

export function AdminDashboard({ 
  user, 
  products, 
  sales, 
  onLogout, 
  onUpdateProducts,
  onAddSale 
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => {
    const today = new Date();
    const saleDate = new Date(sale.timestamp);
    return saleDate.toDateString() === today.toDateString();
  });
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-white border-b border-[#D1EDC5] sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-2 rounded-xl">
                <LayoutDashboard className="size-6 text-[#1a5a1a]" />
              </div>
              <div>
                <h1 className="text-xl text-[#1a5a1a]">Admin Dashboard</h1>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border border-[#D1EDC5]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">
              <LayoutDashboard className="size-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="pos" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">
              <ShoppingCart className="size-4 mr-2" />
              POS
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">
              <Package className="size-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">
              <FileText className="size-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl border border-[#D1EDC5] shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-600 mb-1">Total Products</div>
                <div className="text-3xl text-[#1a5a1a]">{products.length}</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-600 mb-1">Low Stock Items</div>
                <div className="text-3xl text-red-600">{lowStockProducts.length}</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-[#D1EDC5] shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-600 mb-1">Today's Sales</div>
                <div className="text-3xl text-[#1a5a1a]">{todaySales.length}</div>
              </div>
              
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-sm text-[#1a5a1a] mb-1">Today's Revenue</div>
                <div className="text-3xl text-[#1a5a1a]">₱{todayRevenue.toFixed(2)}</div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-red-900 mb-2">Low Stock Alert</h3>
                <div className="space-y-1">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="text-sm text-red-800">
                      {product.name}: {product.stock} units remaining (Min: {product.minStock})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Sales */}
            <div className="bg-white rounded-xl border border-[#D1EDC5] p-6 shadow-sm">
              <h3 className="text-[#1a5a1a] mb-4">Recent Sales</h3>
              <div className="space-y-3">
                {sales.slice(0, 5).map(sale => (
                  <div key={sale.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm text-gray-900">{sale.receiptNumber}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(sale.timestamp).toLocaleString()} - {sale.cashierName}
                      </div>
                    </div>
                    <div className="text-[#1a5a1a]">₱{sale.total.toFixed(2)}</div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <p className="text-sm text-gray-500">No sales yet</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pos">
            <SalesTransaction
              user={user}
              products={products}
              onAddSale={onAddSale}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement
              products={products}
              onUpdateProducts={onUpdateProducts}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsPage sales={sales} products={products} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}