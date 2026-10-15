import "../../assets/css/pages/student/profile.css";
import PageTitle from "../../components/layout/PageTitle/PageTitle";
import PersonalInformations from "../../components/layout/PersonalInformations/PersonalInformations";
import ProfileComponent from "../../components/layout/Profile/Profile";
import { useAuth } from "../../context/AuthContext";

/**
 * User profile view and editing page.
 * Displays personal details, contact information, and editable account settings.
 */
function Profile() {
  const { user, organization } = useAuth();

  if (user && organization) {
    return (
      <div className="page-profile">
        <div className="my-school-header">
          <PageTitle title="Profil" />
        </div>
        <div className="page-profile-container">
          <ProfileComponent user={user} organization={organization} contact />
          <PersonalInformations user={user} />
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default Profile;
