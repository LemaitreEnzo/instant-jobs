import ApplicationsHeader from "./ApplicationsHeader";
import ApplicationsRow from "./ApplicationsRow";
import "./RecentApplications.css";

const RecentApplications = () => {

  const applications = [
    {
      logo: "",
      name: "Kakkoi Studio",
      company: "Agence Web",
      city: "Compiègne",
      sendDate: new Date(2026, 3, 14),
      type: "STAGE",
      status: "Refusée",
      resend: "Relancée",
      resendDate: new Date(2026, 3, 21),
    },
    {
      logo: "",
      name: "Maintners",
      company: "Application Web",
      city: "Paris",
      sendDate: new Date(2026, 3, 17),
      type: "ALTERNANCE",
      status: "Acceptée",
      resend: "Entretien passé",
      resendDate: "",
    },
    {
      logo: "",
      name: "Dronexperts",
      company: "Drone",
      city: "Bordeaux",
      sendDate: new Date(2026, 5, 6),
      type: "ALTERNANCE",
      status: "En attente",
      resend: "Pas de relance",
      resendDate: "",
    },
    {
      logo: "",
      name: "Intersport",
      company: "Commerce",
      city: "Pont Saint Maxence",
      sendDate: new Date(2026, 5, 20),
      type: "ALTERNANCE",
      status: "Refusée",
      resend: "Non nécessaire",
      resendDate: "",
    },
  ];

  const columns = ['Nom d\'entreprise', 'Date d\'envoie', 'Lieu', 'Domaine', 'Type', 'Status', 'Relance', 'Date de relance', '']

  return (
    <div className="recent-applications">
      <ApplicationsHeader />

      <table className="recent-applications-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="recent-applications-col">{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <ApplicationsRow key={app.name} {...app} />
          ))}
        </tbody>
      </table>

    </div>
  );
}
export default RecentApplications