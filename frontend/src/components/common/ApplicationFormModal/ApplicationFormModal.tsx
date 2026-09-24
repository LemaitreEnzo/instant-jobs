import { useEffect, useRef, useState } from "react";
import type { PropsApplicationFormModal } from "../../../types/props.type";
import type { dataApplication } from "../../../types/form.type";
import { useFormValidation, validators } from "../../../hooks/useFormValidation";

import { useAuth } from "../../../context/AuthContext";
import { useApplication } from "../../../hooks/useApplication";
import { ApplicationStatus } from "../../../types/enum.type";

import FormField from "../../ui/FormField/FormField";
import Select from "../../ui/Select/Select";
import FileInput from "../../ui/FileInput/FileInput";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

import "./ApplicationFormModal.css";

const ApplicationFormModal = (props: PropsApplicationFormModal) => {
  const { open, onOpenChange } = props;
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string>();
  const [fileError, setFileError] = useState<string | null>(null);

  const { user } = useAuth();
  const { create, loading } = useApplication();

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    logo: [validators.required("Le logo de l'entreprise est obligatoire")],
    title: [validators.required("L'intitulé du poste est obligatoire")],
    company: [validators.required("Le nom de l'entreprise est obligatoire")],
    city: [validators.required("Le lieu est obligatoire")],
    status: [validators.required("Le statut est obligatoire")],
    type: [validators.required("Le type est obligatoire")],
    description: [validators.required("La description est obligatoire")],
    date: [validators.required("La date est obligatoire")],
    resend: [validators.required("Le statut de relance est obligatoire")],
  });

  const handleFileError = (error: string | null) => {
    setFileError(error);
  };


  const initData: dataApplication = {
    title: "",
    logo: "",
    company: "",
    city: "",
    status: ApplicationStatus.pending,
    type: "Alternance",
    description: "",
    date: new Date().toISOString().split("T")[0],
    resend: "no",
  };

  const [formData, setFormData] = useState<dataApplication>(initData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    setPreview(URL.createObjectURL(file as File));
    setFormData((prev) => ({
      ...prev,
      logo: file ? file.name : "",
    }))
  };

  const handleTrash = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(undefined);
    setFormData((prev) => ({
      ...prev,
      logo: "",
    }));
    setFileError(null);
  }

  const checkClickOutside = (e) => {
    if (open && modalContainerRef.current && !modalContainerRef.current.contains(e.target)) {
      onOpenChange(false);
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(formData)) return;

    try {
      await create({
        ...formData,
        userId: user?.id ?? null,
      });

      setFormData(initData);
      clearErrors();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", checkClickOutside);

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(undefined);

    return () => document.removeEventListener("mousedown", checkClickOutside);
  }, [open])

  return (
    open && (
      <div className="application-form-modal">
        <div className="modal-container" ref={modalContainerRef}>
          <div className="modal-header">
            <h3>Ajouter une candidature</h3>
            <p>Remplissez les informations ci-dessous pour enregistrer et suivre une nouvelle candidature.</p>
          </div>
          <h4>Informations de l'entreprise</h4>
          <form method="post" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Logo de l'entreprise"
              name="logo"
              required
              error={fileError || getError("logo")}
            >
              {preview ?
                <div className="preview-container" onClick={handleTrash}>
                  <div className="preview-image-wrapper">
                    <img className="preview-image" src={preview} alt="Aperçu du logo" />
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
                :
                <FileInput
                  name="logo"
                  id="logo"
                  title="Choisir un fichier ou le déposer ici"
                  helperText="JPEG, PNG, SVG et WebP format uniquement, 50Mo maximum"
                  buttonText="Parcourir"
                  accept="image/jpeg,image/png,image/svg+xml,image/webp"
                  maxSizeMB={50}
                  error={fileError || getError("logo")}
                  onFileSelect={handleFileSelect}
                  onError={handleFileError}
                />
              }
            </FormField>

            <div>
              <FormField
                label="Nom de l'entreprise"
                name="company"
                required
                error={getError("company")}
              >
                <Input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  error={hasError("company")}
                />
              </FormField>

              <FormField
                label="Lieu de l'entreprise"
                name="city"
                required
                error={getError("city")}
              >
                <Input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={hasError("city")}
                />
              </FormField>
            </div>

            <h4>Personalisation de la candidature</h4>

            <FormField
              label="Nom de la candidature"
              name="title"
              required
              error={getError("title")}
            >
              <Input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                error={hasError("title")}
              />
            </FormField>

            <div>
              <FormField
                label="Statut de la candidature"
                name="status"
                required
                error={getError("status")}
              >
                <Select
                  name="status"
                  id="status"
                  error={hasError("status")}
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { label: "En attente", value: ApplicationStatus.pending },
                    { label: "Entretien", value: ApplicationStatus.interview },
                    { label: "Acceptée", value: ApplicationStatus.accepted },
                    { label: "Refusée", value: ApplicationStatus.refused },
                  ]}
                />
              </FormField>

              <FormField
                label="Type de candidature"
                name="type"
                required
                error={getError("type")}
              >
                <Select
                  name="type"
                  id="type"
                  error={hasError("type")}
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { label: "Alternance", value: "Alternance" },
                    { label: "Stage", value: "Stage" },
                    { label: "CDI", value: "CDI" },
                  ]}
                />
              </FormField>
            </div>

            <FormField
              label="Description de la candidature"
              name="description"
              required
              error={getError("description")}
            >
              <Input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                error={hasError("description")}
              />
            </FormField>

            <FormField
              label="Date d'envoie de la candidature"
              name="date"
              required
              error={getError("date")}
            >
              <Input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                error={hasError("date")}
              />
            </FormField>

            <FormField
              label="Statut pour la relance de candidature"
              name="resend"
              required
              error={getError("resend")}
            >
              <Select
                name="resend"
                id="resend"
                error={hasError("resend")}
                value={formData.resend}
                onChange={handleChange}
                options={[
                  { label: "Pas de relance", value: "no" },
                  { label: "Relancée", value: "yes" },
                ]}
              />
            </FormField>

            <Button type="submit" className="btn-primary">
              <span>{loading ? "Enregistrement..." : "Enregistrer"}</span>
            </Button>
          </form>
        </div>
      </div>
    )

  );
}
export default ApplicationFormModal