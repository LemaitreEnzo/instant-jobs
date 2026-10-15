import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useUser from "../hooks/useUser";
import useOrganization from "../hooks/useOrganization";

import type { Student } from "../interfaces/user.interface";
import type { Organization } from "../interfaces/models.interface";
import { UserRole } from "../types/enum.type";

import PageTitle from "../components/layout/PageTitle/PageTitle";
import Applications from "../components/application/Applications";
import Profile from "../components/layout/Profile/Profile";
import PersonalInformations from "../components/layout/PersonalInformations/PersonalInformations";

import "../assets/css/pages/student-details.css";

function StudentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchOne: fecthOneUser } = useUser();
  const { fetchOne: fetchOneOrga } = useOrganization();

  const [student, setStudent] = useState<Student>(null);
  const [organization, setOrganization] = useState<Organization>(null);

  useEffect(() => {
    const getStudent = async () => {
      try {
        const data = (await fecthOneUser(parseInt(id))) as Student;
        setStudent(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getStudentOrga = async () => {
      try {
        const data = await fetchOneOrga(parseInt(student?.organizationId));
        setOrganization(data);
      } catch (error) {
        console.error(error);
      }
    };

    getStudent();
    getStudentOrga();
  }, [fecthOneUser, fetchOneOrga, id, student?.organizationId]);

  if (student && organization) {
    return (
      <div className="student-details">
        <PageTitle
          title={`Profil de ${student?.firstname} ${student?.lastname}`}
        />
        <div className="student-details-top">
          <Profile user={student} organization={organization} contact />
          {user.role !== UserRole.STUDENT && <PersonalInformations user={student} />}
        </div>
        <Applications data={student.applications} />
      </div>
    );
  } else {
    return <div className="student-details">loading</div>;
  }
}

export default StudentDetails;
