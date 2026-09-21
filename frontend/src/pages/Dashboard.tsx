import MainLayout from "../components/layout/MainLayout/MainLayout";
import "../assets/css/pages/dashboard.css";
import ApplicationAddButton from "../components/common/ApplicationAddButton/ApplicationAddButton";

function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard">
        <ApplicationAddButton />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
