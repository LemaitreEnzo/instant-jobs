import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useOrganization from "../hooks/useOrganization";
import useUser from "../hooks/useUser";

import type { Organization } from "../interfaces/models.interface";
import type { Student } from "../interfaces/user.interface";
import { UserRole } from "../types/enum.type";

import Applications from "../components/application/Applications";
import PageTitle from "../components/layout/PageTitle/PageTitle";
import PersonalInformations from "../components/layout/PersonalInformations/PersonalInformations";
import Profile from "../components/layout/Profile/Profile";

import "../assets/css/pages/student-details.css";

function StudentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchOne: fecthOneUser } = useUser();
  const { fetchOne: fetchOneOrga } = useOrganization();

  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [organization, setOrganization] = useState<Organization | undefined>(
    undefined,
  );

  useEffect(() => {
    const getStudent = async () => {
      try {
        const student = (await fecthOneUser(Number(id))) as Student;
        setStudent(student);
        const organization = await fetchOneOrga(
          Number(student?.organizationId),
        );
        setOrganization(organization);
      } catch (error) {
        console.error(error);
      }
    };

    getStudent();
  }, [fecthOneUser, fetchOneOrga, id, student?.organizationId]);

  if (student && organization) {
    return (
      <div className="student-details">
        <PageTitle
          title={`Profil de ${student?.firstname} ${student?.lastname}`}
        />
        <div className="student-details-top">
          <Profile user={student} organization={organization} contact />
          {user?.role !== UserRole.STUDENT && (
            <PersonalInformations user={student} />
          )}
        </div>
        {student.applications && <Applications data={student.applications} />}
      </div>
    );
  } else {
    return <div className="student-details">loading</div>;
  }
}

export default StudentDetails;
