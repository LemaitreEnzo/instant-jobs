import type { PropsSchoolCard } from "../../../types/props.type";

import "./SchoolCard.css";

const SchoolCard = (props: PropsSchoolCard) => {
  const data = props.data;
  const logo = data.logo;
  const name = data.name;
  const description = data.description;

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
