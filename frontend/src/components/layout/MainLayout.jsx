import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "../client/Chatbot/Chatbot";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MainLayout;
