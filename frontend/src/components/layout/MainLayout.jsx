import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "../client/Chatbot/Chatbot";
import NotificationsProvider from "../../context/NotificationsProvider";

const MainLayout = ({ children }) => {
  return (
    <NotificationsProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Chatbot />
      </div>
    </NotificationsProvider>
  );
};

export default MainLayout;
