import MainLayout from '../../components/layout/MainLayout/MainLayout';
import '../../assets/css/pages/student/mySchool.css';
import {useState, useEffect} from "react";
import useOrganization from '../../hooks/useOrganization';
import { UserRole } from '../../types/enum.type';
import type { Student } from '../../interfaces/user.interface';
import { useAuth } from '../../context/AuthContext';
import SmallProfile from '../../components/ui/SmallProfile/SmallProfile';
import PageTitle from '../../components/layout/PageTitle/PageTitle';


function MySchool() {
    const {user} = useAuth();
    const [students, setStudents] = useState<Student[] | null>(null);
    const {fetchUsers} = useOrganization();

    useEffect(() => {
        const loadData = async () => {
            try {

                /**Getting the list of students of an organization */
                if (user) {
                    const usersData = await fetchUsers(parseInt(user.organizationId));
                    const studentDataOnly = usersData.filter((user): user is Student => {return user.role === UserRole.STUDENT});
                    // setStudents(studentDataOnly);
                    
                }else{
                    throw new Error('No user found');
                }

            } catch (error) {
                console.error(error);
            }
        };
        loadData();
    }, [])

    if (students) {
        return (
            <MainLayout >
                <div className='my-school'>
                    <div></div>
                    <div className='my-school-header'>
                        <PageTitle title='Mon école' />
                    </div>
                    <div className='my-school-students'>
                        {students?.map((student) => {
                            return(
                                <SmallProfile data={student} />
                            )
                        })}
                    </div>
                    <div></div>
                </div>
            </MainLayout>
        )
    } else{

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