import { useState } from "react";
import { useFormValidation, validators } from "../../hooks/useFormValidation";

import { useAuth } from "../../context/AuthContext";
import useMedia from "../../hooks/useMedia";

import Button from "../ui/Button/Button";
import FileInput from "../ui/FileInput/FileInput";
import FormField from "../ui/FormField/FormField";
import Input from "../ui/Input/Input";
import Modal from "../ui/Modal/Modal";

import type { dataMedia } from "../../types/form.type";
import type { PropsMediaFormModal } from "../../types/props.type";
import { getFileTypeFromUri } from "../../utils/globals.util";
import { FilePreview } from "../layout/FilePreview/FilePreview";
import "./DocumentFormModal.css";

/**
 * Modal dialog for uploading and editing student documents (CVs, cover letters).
 * Integrates file selection, size and type validation, preview thumbnail, and deletion.
 */
const DocumentFormModal = (props: PropsMediaFormModal) => {
  const { open, onOpenChange } = props;
  const [fileError, setFileError] = useState<string | null>(null);

  const { user } = useAuth();
  const { create, remove, update, loading } = useMedia();

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    path: [validators.required("Le fichier est obligatoire")],
    name: [validators.required("L'intitulé est obligatoire")],
  });

  const handleFileError = (error: string | null) => {
    setFileError(error);
  };

  const initData: dataMedia = {
    name: "",
    path: "",
  };

  const [formData, setFormData] = useState<dataMedia>(() =>
    props.media ? { ...props.media } : initData,
  );
  const [preview, setPreview] = useState<string | undefined>(
    () => props.media?.path,
  );

  const [prevApp, setPrevApp] = useState(props.media);
  const [prevOpen, setPrevOpen] = useState(open);

  if (props.media !== prevApp || (open && !prevOpen)) {
    setPrevApp(props.media);
    setPrevOpen(open);

    if (props.media) {
      setFormData({
        name: props.media.name,
        path: props.media.path,
      });
      setPreview(props.media.path);
    } else {
      setFormData(initData);
      setPreview(undefined);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: dataMedia) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(undefined);
      setFormData((prev: dataMedia) => ({
        ...prev,
        path: "",
      }));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const base = reader.result as string;
      setPreview(base);
      setFormData((prev: dataMedia) => ({
        ...prev,
        path: file ? base : "",
      }));
    });

    reader.readAsDataURL(file);
  };

  const handleTrash = () => {
    setPreview(undefined);
    setFormData((prev: dataMedia) => ({
      ...prev,
      path: "",
    }));
    setFileError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(formData)) return;

    try {
      if (props.media?.id) {
        await update(props.media.id, formData as unknown as dataMedia);
      } else {
        await create({
          ...formData,
          userId: user?.id ?? null,
        } as unknown as dataMedia);
      }
      props.onSuccess?.();
      setFormData(initData);
      setPreview(undefined);
      setFileError(null);
      clearErrors();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!props.media?.id) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    }

    try {
      await remove(props.media.id);
      props.onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={props.media ? "Modifier un document" : "Ajouter un document"}
      description="Remplissez les informations ci-dessous pour enregistrer et suivre un nouveau document."
      size="md"
      customClassName="media-form-modal"
    >
      <h4>Informations de l'entreprise</h4>
      <form method="post" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Fichier"
          name="path"
          required
          error={fileError || getError("path")}
        >
          {preview ? (
            <div className="preview-container" onClick={handleTrash}>
              <div className="preview-image-wrapper">
                <FilePreview
                  path={preview}
                  type={getFileTypeFromUri(preview)}
                />
                <div className="preview-overlay">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <FileInput
              name="path"
              id="path"
              title="Choisir un fichier ou le déposer ici"
              helperText="PDF, JPEG, PNG, SVG et WebP format uniquement, 10Mo maximum"
              buttonText="Parcourir"
              accept="application/pdf,image/jpeg,image/png,image/svg+xml,image/webp"
              maxSizeMB={50}
              error={fileError || getError("path")}
              onFileSelect={handleFileSelect}
              onError={handleFileError}
            />
          )}
        </FormField>

        <FormField
          label="Nom du document"
          name="name"
          required
          error={getError("name")}
        >
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            error={hasError("name")}
          />
        </FormField>

        <div className="media-form-footer">
          <Button type="submit" className="btn-primary">
            <span>
              {loading
                ? "Enregistrement..."
                : props.media
                  ? "Modifier"
                  : "Enregistrer"}
            </span>
          </Button>

          {props.media && (
            <Button type="button" className="btn-error" onClick={handleDelete}>
              <span>Supprimer</span>
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DocumentFormModal;
