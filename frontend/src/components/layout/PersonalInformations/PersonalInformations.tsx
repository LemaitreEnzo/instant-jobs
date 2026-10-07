import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useFormValidation, {
  validators,
} from "../../../hooks/useFormValidation";
import useUser from "../../../hooks/useUser";
import type { Student } from "../../../interfaces/user.interface";
import {
  StudentStatus,
  StudentStatusLabel,
  UserRole,
} from "../../../types/enum.type";
import type { PropsPersonalInformation } from "../../../types/props.type";
import Button from "../../ui/Button/Button";
import FormField from "../../ui/FormField/FormField";
import Input from "../../ui/Input/Input";
import Modal from "../../ui/Modal/Modal";
import Select from "../../ui/Select/Select";
import "./PersonalInformations.css";

function PersonalInformations(props: PropsPersonalInformation) {
  const user = props.user;
  const phoneFormatted: string = user.phone.match(/.{1,2}/g)?.join(" ") ?? ""; // Format phone number
  const [open, setOpen] = useState(false);
  const userHook = useUser();
  const { setUser } = useAuth();

  const isStudent = user.role === UserRole.STUDENT && "status" in user;

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    firstname: [validators.required("Le prénom est obligatoire")],
    lastname: [validators.required("Le nom est obligatoire")],
    email: [
      validators.required("L'email est obligatoire"),
      validators.email("Format d'email invalide"),
    ],
    phone: [validators.required("Le téléphone est obligatoire")],
    ...(isStudent && {
      status: [validators.required("Le statut est obligatoire")],
    }),
  });

  const initData = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    ...(isStudent && { status: (user as Student).status }),
  };

  const [formData, setFormData] = useState(initData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(formData)) {
      return;
    }

    try {
      await userHook.update(user.id, formData);

      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          ...formData,
        };
      });
      setOpen(false);
      clearErrors();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="pi">
      <div className="pi-header">
        <p>Infos personnelles</p>
        <Button className="btn-primary" onClick={() => setOpen(true)}>
          <span>Modifier</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </div>
      <div className="pi-container">
        <div className="pi-content">
          <p className="pi-content-default">Prénom :</p>
          <p className="pi-content-text">{user.firstname}</p>
        </div>
        <div className="pi-content">
          <p className="pi-content-default">Nom :</p>
          <p className="pi-content-text">{user.lastname}</p>
        </div>
        <div className="pi-content">
          <p className="pi-content-default">Email :</p>
          <p className="pi-content-text">{user.email}</p>
        </div>
        <div className="pi-content">
          <p className="pi-content-default">Téléphone :</p>
          <p className="pi-content-text">{phoneFormatted}</p>
        </div>
      </div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Modifier vos informations personnelles"
      >
        <h4>
          Informations de {user.firstname} {user.lastname}
        </h4>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <FormField
              label="Prénom"
              name="firstname"
              required
              error={getError("firstname")}
            >
              <Input
                type="text"
                name="firstname"
                id="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={hasError("firstname")}
              />
            </FormField>

            <FormField
              label="Nom"
              name="lastname"
              required
              error={getError("lastname")}
            >
              <Input
                type="text"
                name="lastname"
                id="lastname"
                value={formData.lastname}
                onChange={handleChange}
                error={hasError("lastname")}
              />
            </FormField>

            {isStudent && (
              <FormField
                label="Statut"
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
                  options={Object.values(StudentStatus).map((status) => ({
                    label: StudentStatusLabel[status],
                    value: status,
                  }))}
                />
              </FormField>
            )}

            <FormField
              label="Email"
              name="email"
              required
              error={getError("email")}
            >
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                error={hasError("email")}
              />
            </FormField>

            <FormField
              label="Téléphone"
              name="phone"
              required
              error={getError("phone")}
            >
              <Input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                error={hasError("phone")}
              />
            </FormField>
          </div>

          <div className="user-form-footer">
            <Button type="submit" className="btn-primary">
              <span>{userHook.loading ? "Enregistrement..." : "Modifier"}</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PersonalInformations;
