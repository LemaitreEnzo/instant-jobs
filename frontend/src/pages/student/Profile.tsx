import '../../assets/css/pages/student/profile.css';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import ProfileComponent from '../../components/layout/Profile/Profile';
import {useState, useEffect} from "react";
import useUser from '../../hooks/useUser';
import useOrganization from '../../hooks/useOrganization';
import useCampus from '../../hooks/useCampus';
import usePromotion from '../../hooks/usePromotion';
import useSpeciality from '../../hooks/useSpeciality';
import useSubSpeciality from '../../hooks/useSubSpeciality';
import type { Student, User } from '../../interfaces/user.interface';
import type { Campus, Organization, Promotion, Speciality, SubSpeciality } from '../../interfaces/models.interface';
import PersonalInformations from '../../components/layout/PersonalInformations/PersonalInformations';

function Profile() {
    const [user, setUser] = useState<User | Student | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [campus, setCampus] = useState<Campus | null>(null);
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [speciality, setSpeciality] = useState<Speciality | null>(null);
    const [subSpeciality, setSubSpeciality] = useState<SubSpeciality | null>(null);
    const {getMe} = useUser();
    const {fetchOne} = useOrganization();
    const fetchOneCampus = useCampus().fetchOne;
    const fetchOnePromotion = usePromotion().fetchOne;
    const fetchOneSpeciality = useSpeciality().fetchOne;
    const fetchOneSubSpeciality = useSubSpeciality().fetchOne;

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData =  await getMe();
                
                if (userData) {  
                    setUser(userData); 
                    const orga =  await fetchOne(userData.organizationId);
                    setOrganization(orga);
                    
                }else{
                    throw new Error("No user found");
                }

                if (userData.campusId) { 
                    const campusData = await fetchOneCampus(parseInt(userData.campusId));
                    setCampus(campusData);
                    
                }else{
                    throw new Error("No campus found");
                }

                if ("status" in userData) {
                    if (userData.promotionId) {
                        const promotionData = await fetchOnePromotion(userData.promotionId);
                        setPromotion(promotionData);
                    }else{
                        throw new Error("No promotion found");
                    }

                    if (userData.specialityId) {
                        const specialityData = await fetchOneSpeciality(userData.specialityId);
                        setSpeciality(specialityData);
                    }else{
                        throw new Error("No speciality found");
                    }

                    if (userData.subSpecialityId) {
                        const subSpecialityData = await fetchOneSubSpeciality(userData.subSpecialityId);
                        setSubSpeciality(subSpecialityData);
                    }else{
                        throw new Error("No sub-speciality found");
                    }
                }

            } catch (error) {
                console.error(error);
            }
        }

        loadData();

    }, [])

    if (user && organization && campus && promotion && speciality && subSpeciality) {
        return (
            <MainLayout >
                <div className="page-profile">
                    <ProfileComponent user={user} organization={organization} campus={campus} promotion={promotion} speciality={speciality} subSpeciality={subSpeciality} />
                    <PersonalInformations data={user} />
                </div>
            </MainLayout>
        )
    }else{
        return(
            <MainLayout >
                <div>
                    Loading
                </div>
            </MainLayout>
        )
    }

}

export default Profile