import { useState } from "react";
import type { PropsApplicationFormModal } from "../../types/props.type";
import type { dataApplication } from "../../types/form.type";
import type { Application } from "../../interfaces/models.interface";
import { useFormValidation, validators } from "../../hooks/useFormValidation";

import { useAuth } from "../../context/AuthContext";
import { useApplication } from "../../hooks/useApplication";
import { ApplicationResend, ApplicationStatus, ApplicationStatusLabel, ApplicationType, ApplicationTypeLabel } from "../../types/enum.type";

import Modal from "../ui/Modal/Modal";
import FormField from "../ui/FormField/FormField";
import Select from "../ui/Select/Select";
import FileInput from "../ui/FileInput/FileInput";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";

import "./ApplicationFormModal.css";

const ApplicationFormModal = (props: PropsApplicationFormModal) => {
  const { open, onOpenChange } = props;
  const [fileError, setFileError] = useState<string | null>(null);

  const { user } = useAuth();
  const { create, remove, update, loading } = useApplication();

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
    status: null,
    type: null,
    description: "",
    date: null,
    resend: null,
  };

  const [formData, setFormData] = useState<dataApplication>(() =>
    props.application ? { ...props.application } : initData
  );
  const [preview, setPreview] = useState<string | undefined>(() => props.application?.logo);

  const [prevApp, setPrevApp] = useState(props.application);
  const [prevOpen, setPrevOpen] = useState(open);

  if (props.application !== prevApp || (open && !prevOpen)) {
    setPrevApp(props.application);
    setPrevOpen(open);

    if (props.application) {
      setFormData({
        title: props.application.title,
        logo: props.application.logo,
        company: props.application.company,
        city: props.application.city,
        status: props.application.status,
        type: props.application.type,
        description: props.application.description,
        date: props.application.date,
        resend: props.application.resend,
      });
      setPreview(props.application.logo);
    } else {
      setFormData(initData);
      setPreview(undefined);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: dataApplication) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(undefined);
      setFormData((prev: dataApplication) => ({
        ...prev,
        logo: "",
      }));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const base = reader.result as string;
      setPreview(base);
      setFormData((prev: dataApplication) => ({
        ...prev,
        logo: file ? base : "",
      }));
    });

    reader.readAsDataURL(file);
  };

  const handleTrash = () => {
    setPreview(undefined);
    setFormData((prev: dataApplication) => ({
      ...prev,
      logo: "",
    }));
    setFileError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(formData)) return;

    try {
      if (props.application?.id) {
        await update(props.application.id, formData as unknown as Partial<Application>);
      } else {
        await create({
          ...formData,
          userId: user?.id ?? null,
        } as unknown as Partial<Application>);
      }
      props.onSuccess?.();
      setFormData(initData);
      clearErrors();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!props.application?.id) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      return;
    }

    try {
      await remove(props.application.id);
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
      title={props.application ? "Modifier une candidature" : "Ajouter une candidature"}
      description="Remplissez les informations ci-dessous pour enregistrer et suivre une nouvelle candidature."
      size="md"
      customClassName="application-form-modal"
    >
      <h4>Informations de l'entreprise</h4>
      <form method="post" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Logo de l'entreprise"
          name="logo"
          required
          error={fileError || getError("logo")}
        >
          {preview ? (
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
          ) : (
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
          )}
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

        <h4>Personnalisation de la candidature</h4>

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
              options={Object.values(ApplicationStatus).map((status) => ({
                label: ApplicationStatusLabel[status],
                value: status
              }))}
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
              options={Object.values(ApplicationType).map((type) => ({
                label: ApplicationTypeLabel[type],
                value: type
              }))}
            />
          </FormField>
        </div>

        <FormField
          label="Description de la candidature"
          name="description"
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
          label="Date d'envoi de la candidature"
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
            options={Object.values(ApplicationResend).map((resend) => ({
              label: ApplicationStatusLabel[resend],
              value: resend
            }))}
          />
        </FormField>

        <div className="application-form-footer">
          <Button type="submit" className="btn-primary">
            <span>
              {loading ? "Enregistrement..." : props.application ? "Modifier" : "Enregistrer"}
            </span>
          </Button>

          {props.application && (
            <Button type="button" className="btn-error" onClick={handleDelete}>
              <span>Supprimer</span>
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ApplicationFormModal;
