import MainLayout from "../components/layout/MainLayout/MainLayout";
import "../assets/css/pages/dashboard.css";
import PageTitle from "../components/layout/PageTitle/PageTitle";

function Dashboard() {
  return (
    <MainLayout>
      <div className="dashboard">
        < PageTitle title="test" />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
