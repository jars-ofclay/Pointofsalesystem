import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Product } from '../App';
import { Search, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryTrackingProps {
  products: Product[];
}

type StockFilter = 'all' | 'low' | 'normal' | 'high';

export function InventoryTracking({ products }: InventoryTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');

  const getStockStatus = (product: Product): 'low' | 'normal' | 'high' => {
    if (product.stock <= product.minStock) return 'low';
    if (product.stock <= product.minStock * 2) return 'normal';
    return 'high';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    
    const status = getStockStatus(product);
    const matchesFilter = stockFilter === 'all' || status === stockFilter;
    
    return matchesSearch && matchesFilter;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);
  const normalStockProducts = products.filter(p => {
    const status = getStockStatus(p);
    return status === 'normal';
  });
  const highStockProducts = products.filter(p => {
    const status = getStockStatus(p);
    return status === 'high';
  });

  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-[#1a5a1a]">Inventory Tracking</h2>
        <p className="text-[#5B7A4A] mt-1">Monitor stock levels and inventory status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Stock Value</div>
              <Package className="size-5 text-[#4A7C3A]" />
            </div>
            <div className="text-2xl text-[#2D5016]">₱{totalStockValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Total Units</div>
              <TrendingUp className="size-5 text-[#4A7C3A]" />
            </div>
            <div className="text-2xl text-[#2D5016]">{totalStockUnits}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 shadow-sm bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-red-800">Low Stock Items</div>
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div className="text-2xl text-red-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card className="border-[#D1EDC5] shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Good Stock</div>
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div className="text-2xl text-green-600">{highStockProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Filter */}
      <Card className="border-[#D1EDC5] shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Package className="size-4" />
            <span>Filter by Stock Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              onClick={() => setStockFilter('all')}
              className={`cursor-pointer px-4 py-2 ${
                stockFilter === 'all'
                  ? 'bg-[#4A7C3A] hover:bg-[#3D6B2F] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All ({products.length})
            </Badge>
            <Badge
              onClick={() => setStockFilter('low')}
              className={`cursor-pointer px-4 py-2 ${
                stockFilter === 'low'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              Low Stock ({lowStockProducts.length})
            </Badge>
            <Badge
              onClick={() => setStockFilter('normal')}
              className={`cursor-pointer px-4 py-2 ${
                stockFilter === 'normal'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
              }`}
            >
              Normal Stock ({normalStockProducts.length})
            </Badge>
            <Badge
              onClick={() => setStockFilter('high')}
              className={`cursor-pointer px-4 py-2 ${
                stockFilter === 'high'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
            >
              Good Stock ({highStockProducts.length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="border-[#D1EDC5] shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name, category, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#D1EDC5]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && stockFilter === 'all' && (
        <Card className="border-red-200 shadow-sm bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader className="border-b border-red-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowStockProducts.slice(0, 6).map(product => (
                <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-red-100">
                  <div>
                    <div className="text-[#2D5016]">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600">{product.stock} units</div>
                    <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                  </div>
                </div>
              ))}
            </div>
            {lowStockProducts.length > 6 && (
              <div className="mt-3 text-center text-sm text-red-700">
                +{lowStockProducts.length - 6} more items with low stock
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="border-[#D1EDC5] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#f0f9ed] to-white border-b border-[#D1EDC5]">
          <CardTitle className="text-[#1a5a1a]">Stock Levels ({filteredProducts.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-gray-600">Current Stock</th>
                  <th className="text-right py-3 px-4 text-gray-600">Min Stock</th>
                  <th className="text-right py-3 px-4 text-gray-600">Stock Value</th>
                  <th className="text-center py-3 px-4 text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const status = getStockStatus(product);
                  const stockValue = product.stock * product.price;
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{product.name}</td>
                      <td className="py-3 px-4 text-gray-600">{product.category}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`${
                          status === 'low' ? 'text-red-600' :
                          status === 'normal' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{product.minStock}</td>
                      <td className="py-3 px-4 text-right text-gray-900">₱{stockValue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={`${
                          status === 'low' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                          status === 'normal' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                          'bg-green-100 text-green-700 hover:bg-green-100'
                        }`}>
                          {status === 'low' && <AlertTriangle className="size-3 mr-1" />}
                          {status === 'low' ? 'Low' : status === 'normal' ? 'Normal' : 'Good'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
