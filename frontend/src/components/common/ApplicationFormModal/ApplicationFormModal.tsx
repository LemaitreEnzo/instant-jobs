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

  const { user } = useAuth();
  const { create, loading } = useApplication();

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    title: [validators.required("L'intitulé du poste est obligatoire")],
    company: [validators.required("Le nom de l'entreprise est obligatoire")],
    city: [validators.required("Le lieu est obligatoire")],
    status: [validators.required("Le statut est obligatoire")],
    type: [validators.required("Le type est obligatoire")],
    description: [validators.required("La description est obligatoire")],
    date: [validators.required("La date est obligatoire")],
    resend: [validators.required("Le statut de relance est obligatoire")],
  });

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
    setFormData((prev) => ({
      ...prev,
      logo: file ? file.name : "",
    }));
  };

  const checkClickOutside = (e) => {
    if (open && modalContainerRef.current && !modalContainerRef.current.contains(e.target)) {
      onOpenChange(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    return () => document.removeEventListener("mousedown", checkClickOutside);
  }, [open])

  return (
    open && (
      <div className="application-form-modal">
        <div className="modal-container" ref={modalContainerRef}>
          <div className="modal-header">
            <h3>Ajouter une candidature</h3>
            <p>Description du formulaire</p>
          </div>
          <h4>Informations de l'entreprise</h4>
          <form method="post" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Logo de l'entreprise"
              name="logo"
              required
              error={getError("logo")}
            >
              <FileInput
                name="logo"
                id="logo"
                title="Choisir un fichier ou le déposer ici"
                helperText="JPEG, PNG, SVG and WebP format uniquement, 50Mo maximum"
                buttonText="Parcourir"
                accept="image/jpeg,image/png,image/svg+xml,image/webp"
                maxSizeMB={50}
                error={getError("logo")}
                onFileSelect={handleFileSelect}
              />
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
                    { label: ApplicationStatus.pending, value: "pending" },
                    { label: ApplicationStatus.interview, value: "interview" },
                    { label: ApplicationStatus.accepted, value: "accepted" },
                    { label: ApplicationStatus.refused, value: "rejected" },
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