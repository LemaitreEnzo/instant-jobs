import { useState } from "react";
import "../assets/css/pages/dashboard.css";
import ApplicationFormModal from "../components/application/ApplicationFormModal";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import Button from "../components/ui/Button/Button";

function Dashboard() {
  const [state, setstate] = useState(false);

  return (
    <MainLayout>
      <div className="dashboard">
        <Button onClick={() => setstate(true)}>Ajouter</Button>
        <ApplicationFormModal open={state} onOpenChange={setstate} />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
