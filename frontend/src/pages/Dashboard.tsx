import MainLayout from "../components/layout/MainLayout/MainLayout";
import "../assets/css/pages/dashboard.css";
import ApplicationAddButton from "../components/common/ApplicationAddButton/ApplicationAddButton";
import RecentApplications from "../components/common/RecentApplications/RecentApplications";

function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard">
        <ApplicationAddButton />
        <RecentApplications header={true} limit={7} />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
