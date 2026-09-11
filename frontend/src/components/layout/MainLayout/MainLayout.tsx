import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main_layout_body">
        <SideBar />
        <div className="main_layout_children">{children}</div>
      </main>
    </div>
  );
};
export default MainLayout;
