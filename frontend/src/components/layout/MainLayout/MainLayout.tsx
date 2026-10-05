import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

import "./MainLayout.css";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="layout-body">
        <SideBar />
        <div className="layout-children">{children || <Outlet />}</div>
      </main>
    </div>
  );
};

export default MainLayout;
