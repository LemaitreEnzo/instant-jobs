import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsRow from "./ApplicationsRow";
import "./RecentApplications.css";
import logoExample from "../../../assets/img/Entreprise/image 2.png"
import logoExample2 from "../../../assets/img/Entreprise/image 4.png"
import logoExample3 from "../../../assets/img/Entreprise/image 5.png"
import logoExample4 from "../../../assets/img/Entreprise/image3.png"

const RecentApplications = () => {
  const columns = ['Nom d\'entreprise', 'Date d\'envoie', 'Lieu', 'Domaine', 'Type', 'Status', 'Relance', 'Date de relance', '']

  return (
    <div className="recent-applications">
      <ApplicationsHeader />

      <div className="recent-applications-columns">
        {columns.map((col) => (
          <span key={col} className="recent-applications-col">{col}</span>
        ))}
      </div>

      <div className="recent-applications-body">
        <ApplicationsRow logo={logoExample} name="Kakkoi Studio" company="Agence Web" city="Compiègne"
          sendDate={new Date(2026, 3, 14)} type="STAGE" status="Refusée"
          resend="Relancée" resendDate={new Date(2026, 3, 21)} />

        <ApplicationsRow logo={logoExample3} name="Maintners" company="Application Web" city="Paris"
          sendDate={new Date(2026, 3, 17)} type="ALTERNANCE" status="Acceptée"
          resend="Entretien passé" resendDate={""} />

        <ApplicationsRow logo={logoExample2} name="Dronexperts" company="Drone" city="Bordeaux"
          sendDate={new Date(2026, 5, 6)} type="ALTERNANCE" status="En attente"
          resend="Pas de relance" resendDate={""} />
          
          <ApplicationsRow logo={logoExample4} name="Intersport" company="Commerce" city="Pont Saint Maxence"
          sendDate={new Date(2026, 5, 20)} type="ALTERNANCE" status="Refusée"
          resend="Non nécessaire" resendDate={""} />
      </div>

    </div>
  );
}
export default RecentApplications