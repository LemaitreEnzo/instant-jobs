import type { Application } from "../interfaces/models.interface";
import { ApplicationStatus } from "../types/enum.type";

import Button from "../components/ui/Button/Button";
import StatsCards from "../components/ui/StatsCards/StatsCards";
import Tag from "../components/ui/Tag/Tag";

function Dashboard() {
  const data: Application[] = [
    {
      id: 1,
      title: "Développeur Full-Stack",
      type: "CDI",
      logo: "logo1.png",
      company: "Acme Corp",
      city: "Compiègne",
      date: "2026-09-01",
      status: ApplicationStatus.pending,
      resend: "no",
      description: "Poste de développeur full-stack.",
      userId: 1,
      createdAt: "2026-09-01T10:00:00.000Z",
      updatedAt: "2026-09-01T10:00:00.000Z",
    },
    {
      id: 2,
      title: "Stage Marketing",
      type: "Stage",
      logo: "logo2.png",
      company: "Globex Inc",
      city: "Paris",
      date: "2026-10-15",
      status: ApplicationStatus.interview,
      resend: "no",
      description: "Stage marketing digital.",
      userId: 1,
      createdAt: "2026-09-02T14:30:00.000Z",
      updatedAt: "2026-09-05T09:15:00.000Z",
    },
    {
      id: 3,
      title: "Alternance Data Analyst",
      type: "Alternance",
      logo: "logo3.png",
      company: "Initech",
      city: "Lyon",
      date: "2026-09-20",
      status: ApplicationStatus.refused,
      resend: "yes",
      description: "Alternance analyse de données.",
      userId: 1,
      createdAt: "2026-08-20T08:00:00.000Z",
      updatedAt: "2026-09-03T16:45:00.000Z",
    },
  ];

  return (
    <div>
      <Button shape="rectangle" className="btn-primary">
        <span>Bonjour</span>
      </Button>
      <Tag className="tag-error">
        <span>Bonjoutttt</span>
      </Tag>
      <StatsCards data={data} />
    </div>
  );
}

export default Dashboard;
