import { useEffect, useState } from "react";
import "../../assets/css/pages/admin/school.css";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import SchoolCard from "../../components/ui/SchoolCard/SchoolCard";
import SmallProfile from "../../components/ui/SmallProfile/SmallProfile";
import { useAuth } from "../../context/AuthContext";
import useOrganization from "../../hooks/useOrganization";
import type { Organization } from "../../interfaces/models.interface";
import type { Staff, Student } from "../../interfaces/user.interface";
import { UserRole } from "../../types/enum.type";

function School() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [students, setStudents] = useState<Student[] | null>(null);
  const { fetchUsers, fetchOne } = useOrganization();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const usersData = await fetchUsers(parseInt(user.organizationId));
          const organizationData = await fetchOne(
            parseInt(user.organizationId),
          );

          const filteredUsers = usersData.filter((user): boolean => {
            return user.role === UserRole.STUDENT;
          });

          const studentUsers = filteredUsers as Student[];

          if (user.role === UserRole.STAFF) {
            const userStaff = user as Staff;
            const filteredStudents = studentUsers.filter((student) => {
              return student.campus.id === userStaff.campus.id;
            });

            setStudents(filteredStudents);
          } else {
            setStudents(studentUsers);
          }

          setOrganization(organizationData);
        } else {
          throw new Error("No user found");
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, [fetchOne, fetchUsers, user]);

  if (students && organization) {
    return (
      <div className="my-school">
        <div className="my-school-header">
          <PageTitle title={user.role === UserRole.STAFF ? "Mon campus" : "Mon école"} />
        </div>
        <SchoolCard data={organization} />

        <div className="my-school-students">
          {students.map((student, index) => {
            return <SmallProfile key={index} data={student} />;
          })}
        </div>
        <div></div>
      </div>
    );
  } else {
    return <div className="my-school">loading</div>;
  }
}

export default School;
