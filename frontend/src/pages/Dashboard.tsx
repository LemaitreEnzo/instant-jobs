import Profile from "../components/layout/Profile/Profile";
import Button from "../components/ui/Button/Button";
import Tag from "../components/ui/Tag/Tag";

function Dashboard() {
  return (
    <div>
      <Button shape="rectangle" className="btn-primary">
        <span>Bonjour</span>
      </Button>
      <Tag className="tag-error">
        <span>Bonjoutttt</span>
      </Tag>
      <Profile
        data={{
          id: 1,
          email: "lemaitreenzo05@gmail.com",
          firstname: "Enzo",
          lastname: "Lemaitre",
          organisation_id: 1,
          phone: "0699417519",
          password_hash: "",
        }}
      />
    </div>
  );
}

export default Dashboard;
