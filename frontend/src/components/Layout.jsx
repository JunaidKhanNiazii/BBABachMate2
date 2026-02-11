import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;