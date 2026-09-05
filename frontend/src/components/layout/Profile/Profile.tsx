import type { PropsProfile } from "../../../types/props.type";
import Button from "../../ui/Button/Button";
import "./Profile.css";

const Profile = (props: PropsProfile) => {
  const classes: string = ["border profile", props.className].join(" ").trim();

  return (
    <div className={classes}>
      <div className="top">
        <div className="name">
          <div className="image">
            <span>{props.data.firstname[0]}</span>
          </div>
          <div className="right">
            <div className="content">
              <h2>
                {props.data.firstname} {props.data.lastname}
              </h2>
              <p>Étudiante à LA MANU</p>
            </div>
            <div className="school">
              <div className="image">
                <img src="" alt="" />
              </div>
              <div className="content">
                <p>
                  LA MANU - Grande Ecole - Création - Management - Numérique
                </p>
              </div>
            </div>
            <div className="links">
              <Button href={`mailto://${props.data.email}`}>
                <span>Email</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="none"
                >
                  <path d="M2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.000666667 14.5507 0 14V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196666 1.45067 0.000666667 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.805 0.98 20.0007 1.45067 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.0217 15.805 18.5507 16.0007 18 16H2ZM10 9L18 4V2L10 7L2 2V4L10 9Z" />
                </svg>
              </Button>
              <Button href={`tel://${props.data.phone}`}>
                <span>Phone</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.552 22.133C15.112 22.08 11.031 21.516 6.757 17.243C2.484 12.969 1.921 8.889 1.867 7.448C1.787 5.252 3.469 3.119 5.412 2.286C5.64598 2.18497 5.9022 2.1465 6.15553 2.17438C6.40886 2.20225 6.65059 2.29551 6.857 2.445C8.457 3.611 9.561 5.375 10.509 6.762C10.7176 7.06673 10.8068 7.43755 10.7596 7.8038C10.7123 8.17005 10.532 8.50613 10.253 8.748L8.302 10.197C8.20774 10.2651 8.14139 10.365 8.11528 10.4783C8.08916 10.5916 8.10505 10.7105 8.16 10.813C8.602 11.616 9.388 12.812 10.288 13.712C11.188 14.612 12.441 15.45 13.3 15.942C13.4077 16.0025 13.5345 16.0194 13.6543 15.9892C13.774 15.9591 13.8777 15.8842 13.944 15.78L15.214 13.847C15.4475 13.5368 15.7919 13.3291 16.1752 13.2672C16.5584 13.2053 16.9508 13.2941 17.27 13.515C18.677 14.489 20.319 15.574 21.521 17.113C21.6826 17.3209 21.7854 17.5684 21.8187 17.8296C21.8519 18.0909 21.8144 18.3562 21.71 18.598C20.873 20.551 18.755 22.214 16.552 22.133Z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
