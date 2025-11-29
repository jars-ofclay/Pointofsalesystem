import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CashierInterface } from './components/CashierInterface';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
  name: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  minStock: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  cashierId: string;
  cashierName: string;
  timestamp: Date;
  receiptNumber: string;
}

// Demo users
const INITIAL_USERS = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const, name: 'Erica Monacillo', email: 'admin@pos.com' },
  { id: '2', username: 'cashier', password: 'cashier123', role: 'cashier' as const, name: 'Jars Christian Lerio', email: 'cashier@pos.com' }
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Rice 25kg',
      category: 'Groceries',
      price: 1250,
      stock: 50,
      barcode: '8901234567890',
      minStock: 10
    },
    {
      id: '2',
      name: 'Cooking Oil 1L',
      category: 'Groceries',
      price: 180,
      stock: 30,
      barcode: '8901234567891',
      minStock: 5
    },
    {
      id: '3',
      name: 'Sugar 1kg',
      category: 'Groceries',
      price: 65,
      stock: 45,
      barcode: '8901234567892',
      minStock: 10
    },
    {
      id: '4',
      name: 'Coffee 3-in-1 Pack',
      category: 'Beverages',
      price: 120,
      stock: 60,
      barcode: '8901234567893',
      minStock: 15
    },
    {
      id: '5',
      name: 'Instant Noodles Pack',
      category: 'Food',
      price: 85,
      stock: 100,
      barcode: '8901234567894',
      minStock: 20
    }
  ]);
  const [sales, setSales] = useState<Sale[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSignUp = (username: string, email: string, password: string, role: 'admin' | 'cashier') => {
    const newUser = {
      id: (registeredUsers.length + 1).toString(),
      username,
      email,
      password,
      role,
      name: username.charAt(0).toUpperCase() + username.slice(1)
    };
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const handleGoToSignUp = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleAddSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    
    // Update inventory
    const updatedProducts = products.map(product => {
      const saleItem = sale.items.find(item => item.productId === product.id);
      if (saleItem) {
        return {
          ...product,
          stock: product.stock - saleItem.quantity
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  if (!currentUser) {
    if (showSignUp) {
      return <SignUpPage onSignUp={handleSignUp} onBackToLogin={handleBackToLogin} />;
    }
    return <LoginPage onLogin={handleLogin} onGoToSignUp={handleGoToSignUp} registeredUsers={registeredUsers} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ed 0%, #ffffff 100%)' }}>
      {currentUser.role === 'admin' ? (
        <AdminDashboard
          user={currentUser}
          products={products}
          sales={sales}
          onLogout={handleLogout}
          onUpdateProducts={handleUpdateProducts}
          onAddSale={handleAddSale}
        />
      ) : (
        <CashierInterface
          user={currentUser}
          products={products}
          onLogout={handleLogout}
          onAddSale={handleAddSale}
        />
      )}
    </div>
  );
}

export default App;