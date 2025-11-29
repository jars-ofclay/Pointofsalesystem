import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sale, Product } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';

interface ReportsPageProps {
  sales: Sale[];
  products: Product[];
}

export function ReportsPage({ sales, products }: ReportsPageProps) {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Calculate statistics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  // Daily sales data
  const getDailySales = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
        return saleDate === date;
      });
      const revenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue,
        transactions: daySales.length
      };
    });
  };

  // Product sales data
  const getProductSales = () => {
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();

    sales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSales.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          productSales.set(item.productId, {
            name: item.productName,
            quantity: item.quantity,
            revenue: item.subtotal
          });
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Category distribution
  const getCategoryDistribution = () => {
    const categories = new Map<string, number>();

    products.forEach(product => {
      const value = product.price * product.stock;
      categories.set(product.category, (categories.get(product.category) || 0) + value);
    });

    return Array.from(categories.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };

  const dailySalesData = getDailySales();
  const topProducts = getProductSales();
  const categoryData = getCategoryDistribution();

  const COLORS = ['#D1EDC5', '#a8dfa0', '#7fcd77', '#5bb84f', '#3a9d2e'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#1a5a1a]">Reports & Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Track your business performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl text-[#1a5a1a]">₱{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-3 rounded-xl">
                <DollarSign className="size-6 text-[#1a5a1a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-2xl text-[#1a5a1a]">{totalTransactions}</p>
              </div>
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-3 rounded-xl">
                <ShoppingCart className="size-6 text-[#1a5a1a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
                <p className="text-2xl text-[#1a5a1a]">₱{averageTransaction.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-3 rounded-xl">
                <TrendingUp className="size-6 text-[#1a5a1a]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inventory Value</p>
                <p className="text-2xl text-[#1a5a1a]">₱{totalInventoryValue.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] p-3 rounded-xl">
                <Package className="size-6 text-[#1a5a1a]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={reportPeriod} onValueChange={(v) => setReportPeriod(v as any)}>
        <TabsList className="bg-white border border-[#D1EDC5]">
          <TabsTrigger value="daily" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-[#D1EDC5] data-[state=active]:text-[#1a5a1a]">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card className="border-[#D1EDC5] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#f0f9ed] to-white border-b border-[#D1EDC5]">
              <CardTitle className="text-[#1a5a1a]">Sales Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#D1EDC5" name="Revenue (₱)" />
                  <Bar dataKey="transactions" fill="#a8dfa0" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="border-[#D1EDC5] shadow-sm">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Weekly report - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="border-[#D1EDC5] shadow-sm">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Monthly report - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-[#D1EDC5] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#f0f9ed] to-white border-b border-[#D1EDC5]">
            <CardTitle className="text-[#1a5a1a]">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-[#D1EDC5] to-[#a8dfa0] text-[#1a5a1a] w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#1a5a1a]">₱{product.revenue.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No sales data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-[#D1EDC5] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#f0f9ed] to-white border-b border-[#D1EDC5]">
            <CardTitle className="text-[#1a5a1a]">Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No inventory data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Summary */}
      <Card className="border-[#D1EDC5] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#f0f9ed] to-white border-b border-[#D1EDC5]">
          <CardTitle className="text-[#1a5a1a]">Inventory Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-gray-600">Stock</th>
                  <th className="text-right py-3 px-4 text-gray-600">Value</th>
                  <th className="text-right py-3 px-4 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{product.stock}</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      ₱{(product.price * product.stock).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {product.stock <= product.minStock ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}