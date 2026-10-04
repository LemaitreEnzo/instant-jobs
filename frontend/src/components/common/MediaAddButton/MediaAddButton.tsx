import { useState } from "react";

import Button from "../../ui/Button/Button";
import MediaFormModal from "../MediaFormModal/MediaFormModal";

const MediaAddButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="media-add-button">
      <Button
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => setIsModalOpen(true)}
      >
        <span>Ajouter un document</span>
      </Button>

      <MediaFormModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
export default MediaAddButton