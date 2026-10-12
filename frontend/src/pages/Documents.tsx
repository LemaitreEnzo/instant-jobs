import { useAuth } from "../context/AuthContext";

function Documents() {
  const { user } = useAuth();
  return <div>Documents</div>;
}

export default Documents;
