import MainLayout from "../../components/layout/MainLayout/MainLayout";
import "../assets/css/pages/dashboard.css";
import CardDocument from "../../components/layout/CardDocument/CardDocument";
import { useAuth } from "../../context/AuthContext";
import useUser from "../../hooks/useUser";
import type { Media } from "../../interfaces/models.interface";
import useMedia from "../../hooks/useMedia";
import { useEffect, useState } from "react";
import MediaAddButton from "../../components/common/MediaAddButton/MediaAddButton";

function Document() {
  const { user } = useAuth();
  const { fetchMedias, loading } = useUser();
  const [medias, setMedias] = useState<Media[]>([]);

  const { remove } = useMedia();

  useEffect(() => {
    if (!user?.id) return;

    fetchMedias(user?.id as number)
      .then((data) => setMedias(data))
      .catch((err) => console.error(err));
  }, [user?.id, fetchMedias]);

  const handleDelete = async (id: number) => {
    if (!id) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    };

    try {
      await remove(id);
      setMedias((prevMedias) => prevMedias.filter((media) => id !== media.id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <MainLayout>
      <div className="dashboard">
        <MediaAddButton />
        {loading ? (
          <p>Chargement des documents...</p>
        ) : medias.length > 0 ? (
          <div className="documents-container" style={{ display: "flex", flexWrap: "wrap" }}>
            {medias.map((media) => (
              <CardDocument
                id={media.id}
                key={media.id}
                name={media.name}
                path={media.path}
                createdAt={media.createdAt}
                onDelete={() => handleDelete(media.id)}
              />
            ))}
          </div>
        ) : (
          <p>Aucun document trouvé.</p>
        )}
      </div>
    </MainLayout>
  );
}

export default Document;