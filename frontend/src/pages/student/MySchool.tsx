import MainLayout from '../../components/layout/MainLayout/MainLayout';
import '../../assets/css/pages/student/mySchool.css';
import { useState, useEffect } from "react";
import useOrganization from '../../hooks/useOrganization';
import { UserRole } from '../../types/enum.type';
import type { Student } from '../../interfaces/user.interface';
import { useAuth } from '../../context/AuthContext';
import SmallProfile from '../../components/ui/SmallProfile/SmallProfile';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import type { Organization } from '../../interfaces/models.interface';
import SchoolCard from '../../components/ui/SchoolCard/SchoolCard';


function MySchool() {
    const { user } = useAuth();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [students, setStudents] = useState<Student[] | null>(null);
    const { fetchUsers, fetchOne } = useOrganization();

    useEffect(() => {
        const loadData = async () => {
            try {

                /**Getting the list of students of an organization */
                if (user) {
                    const usersData = await fetchUsers(parseInt(user.organizationId));
                    const organizationData = await fetchOne(parseInt(user.organizationId));
                    const studentDataOnly = usersData.filter((user): user is Student => { return user.role === UserRole.STUDENT });
                    setOrganization(organizationData);
                    setStudents(studentDataOnly);

                } else {
                    throw new Error('No user found');
                }

            } catch (error) {
                console.error(error);
            }
        };
        loadData();
    }, [])

    if (students && organization) {
        return (
            <MainLayout >
                <div className='my-school'>
                    <SchoolCard name={organization.name} logo={organization.logo} description={organization.description} />
                    <div className='my-school-header'>
                        <PageTitle title='Mon école' />
                    </div>

                    <div className='my-school-students'>
                        {students.map((student, index) => {
                            return(
                                <SmallProfile key={index} data={student} />
                            )
                        })}
                    </div>
                    <div></div>
                </div>
            </MainLayout>
        )
    } else {

        return (
            <MainLayout >
                <div className='my-school'>
                    loading
                </div>
            </MainLayout>
        )
    }

}

export default MySchool