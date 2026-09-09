import { useState } from "react";
import UserModal from "../UserModal/UserModal";
import "./UserHeader.css";

const UserHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="user-header">
      <span
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => setIsModalOpen((isOpen) => !isOpen)}
        className="user-header_avatar"
      >
        F
      </span>
      <UserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
export default UserHeader;
