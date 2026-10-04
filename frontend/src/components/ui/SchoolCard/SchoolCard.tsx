import type { PropsSchoolCard } from "../../../types/props.type";

import "./SchoolCard.css";

const SchoolCard = ({name, logo, description}: PropsSchoolCard) => {
  return (
    <div className="school-card">
      <div className="school-card-logo">
        <img src={logo} alt={name} />
      </div>
      <div className="school-card-content">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
export default SchoolCard