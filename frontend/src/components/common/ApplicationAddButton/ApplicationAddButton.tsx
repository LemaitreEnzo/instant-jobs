import { useState } from "react";

import Button from "../../ui/Button/Button";
import ApplicationFormModal from "../ApplicationFormModal/ApplicationFormModal";

const ApplicationAddButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="application-add-button">
      <Button
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => setIsModalOpen(true)}
      >
        <span>Ajouter une candidature</span>
      </Button>

      <ApplicationFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
export default ApplicationAddButton