import { useRef, useState, useEffect } from "react";
import type { PropsMediaFormModal } from "../../../types/props.type";
import { useFormValidation, validators } from "../../../hooks/useFormValidation";
import type { dataMedia } from "../../../types/form.type";

import { useAuth } from "../../../context/AuthContext";
import useMedia from "../../../hooks/useMedia";

import FormField from "../../ui/FormField/FormField";
import FileInput from "../../ui/FileInput/FileInput";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

import "./MediaFormModal.css";

const MediaFormModal = (props: PropsMediaFormModal) => {
  const { open, onOpenChange } = props;
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { user } = useAuth();
  const { create, loading } = useMedia();

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    path: [validators.required("Le fichier est obligatoire")],
    name: [validators.required("Le nom du document est obligatoire")],
  });

  const handleFileError = (error: string | null) => {
    setFileError(error);
  }

  const initData: dataMedia = {
    name: "",
    path: "",
  };

  const [formData, setFormData] = useState<dataMedia>(initData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        path: "",
      }));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const base = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        path: file ? base : "",
      }))
    });

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(formData)) return;

    try {
      await create({
        ...formData,
        userId: user?.id ?? undefined,
      });
      props.onSuccess?.();
      setFormData(initData);
      clearErrors();
      onOpenChange(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  const checkClickOutside = (e) => {
    if (open && modalContainerRef.current && !modalContainerRef.current.contains(e.target)) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", checkClickOutside);

    return () => document.removeEventListener("mousedown", checkClickOutside);
  }, [open]);

  return (
    open && (
      <div className="media-form-modal">
        <div className="modal-container" ref={modalContainerRef}>
          <div className="modal-header">
            <h3>Ajouter un document</h3>
            <p>Remplissez les informations ci-dessous pour enregistrer un nouveau document.</p>
          </div>
          <form method="post" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Fichier"
              name="path"
              required
              error={fileError || getError("path")}
            >
              <FileInput
                name="path"
                id="path"
                title="Choisir un fichier ou le déposer ici"
                helperText="PDF, JPEG, PNG, SVG et Webp format uniquement, 10Mo maximum"
                buttonText="Parcourir"
                accept="image/jpeg,image/png,image/svg+xml,image/webp,application/pdf"
                maxSizeMB={10}
                error={fileError || getError("path")}
                onFileSelect={handleFileSelect}
                onError={handleFileError}
              />
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
            <div className="modal-container-footer">
              <Button type="submit" className="btn-primary">
                <span>{loading ? "Enregistrement" : "Enregistrer"}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    )

  );
}
export default MediaFormModal