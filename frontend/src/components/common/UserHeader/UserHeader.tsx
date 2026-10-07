import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import UserModal from "../UserModal/UserModal";
import "./UserHeader.css";

const UserHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  return (
    <div className="user-header">
      <span
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => setIsModalOpen((isOpen) => !isOpen)}
        className="user-header_avatar"
      >
        {user?.firstname.charAt(0)}
      </span>
      <UserModal user={user} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};
export default UserHeader;
