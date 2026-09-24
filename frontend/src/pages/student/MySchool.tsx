import MainLayout from '../../components/layout/MainLayout/MainLayout';
import '../../assets/css/pages/student/mySchool.css';
import {useState, useEffect} from "react";
import useUser from '../../hooks/useUser';
import useOrganization from '../../hooks/useOrganization';


function MySchool() {
    const [students, setStudents] = useState([]);
    const {getMe} = useUser();
    const {fetchUsers} = useOrganization();

    useEffect(() => {
        const getStudents = async () => {
            try {
                const user = await getMe();
                const organisationsId = user?.id;
                if (organisationsId && organisationsId != null) {
                    const users = await fetchUsers(organisationsId);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getStudents();
        
    }, [])

    return (
        <MainLayout >
            <div className='my-school'>
                test
            </div>
        </MainLayout>
    )
}

export default MySchool