import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="font-sans antialiased text-foreground bg-background min-h-screen transition-colors duration-300">
            <AppRoutes />
            <Toaster position="top-right" richColors closeButton />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
