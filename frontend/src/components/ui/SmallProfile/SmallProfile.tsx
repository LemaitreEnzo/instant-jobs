import type { PropsStudent } from "../../../types/props.type";
import { StudentStatus, StudentStatusLabel } from "../../../types/enum.type";
import { sliceItem } from "../../../utils/globals.util";
import Tag from "../Tag/Tag";

import "./SmallProfile.css";
import { Link } from "react-router-dom";

function SmallProfile(props: PropsStudent) {
  const data = props.data;
  const status = data.status;
  const campusName = data.campus?.name;
  const promotionName = data.promotion?.name;
  const specialityName = data.speciality?.name;
  const subSpecialityName = data.subSpeciality?.name;

  const organization = location.pathname.split("/")[1];
  const getStatus = (status: string) => {
    switch (status) {
      case StudentStatus.SEARCH:
        return "tag-terciary";
      case StudentStatus.PENDING:
        return "tag-warn";
      case StudentStatus.FOUND:
        return "tag-success";
      default:
        return "tag-none";
    }
  };

  return (
    <Link to={`/${organization}/student/${data.id}`} className="sp" >
      <div className="sp-left">
        <div className="sp-first-letter">
          <p>{data.firstname[0].toUpperCase()}</p>
        </div>
        <div className="sp-fullname">
          <p>{`${data.firstname} ${data.lastname}`}</p>
        </div>
      </div>
      <div className="sp-right">
        <div className="sp-right-content">
          <p className="sp-right-default">Campus :</p>
          <p className="sp-right-data">{sliceItem(campusName, 15)}</p>
        </div>
        <div className="sp-right-content">
          <p className="sp-right-default">Promotion :</p>
          <p className="sp-right-data">{sliceItem(promotionName, 15)}</p>
        </div>
        <div className="sp-right-content">
          <p className="sp-right-default">Spécialité :</p>
          <p className="sp-right-data">{sliceItem(specialityName, 15)}</p>
        </div>
        <div className="sp-right-content">
          <p className="sp-right-default">Sous-spécialité :</p>
          <p className="sp-right-data">{sliceItem(subSpecialityName, 15)}</p>
        </div>
        <div className="sp-right-content">
          <p className="sp-right-default">Status :</p>
          <Tag className={getStatus(status)} round>
            <span>{StudentStatusLabel[status]}</span>
          </Tag>
        </div>
      </div>
    </Link>
  );
}

export default SmallProfile;
