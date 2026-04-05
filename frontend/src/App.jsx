import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';

const App = () => {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <div className="font-sans antialiased text-foreground bg-background min-h-screen transition-colors duration-300">
                                <AppRoutes />
                                <Toaster position="top-right" richColors closeButton />
                            </div>
                        </WishlistProvider>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;
