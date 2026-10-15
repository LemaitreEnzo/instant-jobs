import type { PropsFilePreview } from "../../../types/props.type";
import "./FilePreview.css";

export function FilePreview(props: PropsFilePreview) {
  if (!props.path) return <p>Aucun fichier à afficher</p>;

  if (["png", "jpeg", "jpg", "gif", "webp"].includes(props.type)) {
    return (
      <div className="file-preview">
        <img
          src={props.path}
          alt="Aperçu du document"
          className="file-preview-img"
        />
      </div>
    );
  }

  if (props.type === "pdf") {
    const pdfUrl = `${props.path}#page=1&view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
    return (
      <div className="file-preview">
        <iframe className="file-preview-pdf" src={pdfUrl}>
          <p>Votre navigateur ne prend pas en charge l'affichage des PDF.</p>
        </iframe>
      </div>
    );
  }

  return (
    <div className="file-preview-fallback">
      <p>Aperçu indisponible pour ce type de fichier (.{props.type})</p>
    </div>
  );
}
