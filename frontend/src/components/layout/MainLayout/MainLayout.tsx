import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <SideBar />
      <Header />
    </div>
  );
};
export default MainLayout;
