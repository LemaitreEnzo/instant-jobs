import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useCampus from "../../hooks/useCampus";
import useFormValidation, { validators } from "../../hooks/useFormValidation";
import useOrganization from "../../hooks/useOrganization";
import usePromotion from "../../hooks/usePromotion";
import useSpeciality from "../../hooks/useSpeciality";
import { useToast } from "../../hooks/useToast";
import useUser from "../../hooks/useUser";
import type {
  Campus,
  Promotion,
  Speciality,
  SubSpeciality,
} from "../../interfaces/models.interface";
import { StudentStatus, UserRole } from "../../types/enum.type";
import type { dataUser } from "../../types/form.type";
import type { PropsUserFormModal } from "../../types/props.type";
import Button from "../ui/Button/Button";
import FormField from "../ui/FormField/FormField";
import Input from "../ui/Input/Input";
import Modal from "../ui/Modal/Modal";
import Select from "../ui/Select/Select";

const NUMERIC_FIELDS: (keyof dataUser)[] = [
  "campusId",
  "promotionId",
  "specialityId",
  "subSpecialityId",
];

const CHILDREN: Partial<Record<keyof dataUser, (keyof dataUser)[]>> = {
  campusId: ["promotionId", "specialityId", "subSpecialityId"],
  promotionId: ["specialityId", "subSpecialityId"],
  specialityId: ["subSpecialityId"],
};

/**
 * Modal dialog for creating a new student account.
 */
const UserFormModal = ({
  open,
  onOpenChange,
  onSuccess,
  lockedCampusId,
}: PropsUserFormModal) => {
  const { user } = useAuth();
  const { create, loading } = useUser();
  const toast = useToast();
  const { fetchCampuses } = useOrganization();
  const { fetchPromotions } = useCampus();
  const { fetchSpecialities } = usePromotion();
  const { fetchSubSpecialities } = useSpeciality();

  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [subSpecialities, setSubSpecialities] = useState<SubSpeciality[]>([]);

  const initData: dataUser = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    role: UserRole.STUDENT,
    status: StudentStatus.SEARCH,
    organizationId: 0,
    campusId: null,
    promotionId: null,
    specialityId: null,
    subSpecialityId: null,
  };

  const { validate, hasError, getError, clearErrors } = useFormValidation({
    firstname: [validators.required("Le prénom est obligatoire")],
    lastname: [validators.required("Le nom est obligatoire")],
    email: [validators.required("L'email est obligatoire")],
    phone: [validators.required("Le téléphone est obligatoire")],
    password: [validators.required("Le mot de passe est obligatoire")],
    campusId: [validators.required("Le campus est obligatoire")],
    promotionId: [validators.required("La promotion est obligatoire")],
  });

  const buildInitData = (): dataUser => {
    if (!user) return initData;

    return {
      ...initData,
      organizationId: Number(user.organizationId),
      campusId: lockedCampusId ?? null,
    };
  };

  const [formData, setFormData] = useState<dataUser>(buildInitData);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setFormData(buildInitData());
      clearErrors();
    }
  }

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    fetchCampuses(parseInt(user.organizationId))
      .then((data) => !cancelled && setCampuses(data))
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [open, user, fetchCampuses]);

  useEffect(() => {
    if (!formData.campusId) return;
    let cancelled = false;
    fetchPromotions(formData.campusId)
      .then((data) => !cancelled && setPromotions(data))
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [formData.campusId, fetchPromotions]);

  useEffect(() => {
    if (!formData.promotionId) return;
    let cancelled = false;
    fetchSpecialities(formData.promotionId)
      .then((data) => !cancelled && setSpecialities(data))
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [formData.promotionId, fetchSpecialities]);

  useEffect(() => {
    if (!formData.specialityId) return;
    let cancelled = false;
    fetchSubSpecialities(formData.specialityId)
      .then((data) => !cancelled && setSubSpecialities(data))
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [formData.specialityId, fetchSubSpecialities]);

  const promotionOptions = formData.campusId ? promotions : [];
  const specialityOptions = formData.promotionId ? specialities : [];
  const subSpecialityOptions = formData.specialityId ? subSpecialities : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const key = name as keyof dataUser;

    setFormData((prev) => {
      const next: Record<string, unknown> = {
        ...prev,
        [key]: NUMERIC_FIELDS.includes(key)
          ? value
            ? Number(value)
            : null
          : value,
      };
      CHILDREN[key]?.forEach((child) => {
        next[child] = null;
      });
      return next as dataUser;
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate(formData)) return;

    if (!user) return;

    try {
      await create({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        role: UserRole.STUDENT,
        status: StudentStatus.SEARCH,
        organizationId: Number(user.organizationId),
        campusId: formData.campusId ?? null,
        promotionId: formData.promotionId ?? null,
        specialityId: formData.specialityId ?? null,
        subSpecialityId: formData.subSpecialityId ?? null,
      });
      toast.success(
        "Élève créé",
        "Le compte de l'élève a été créé avec succès.",
      );
      onSuccess?.();
      clearErrors();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(
        "Erreur lors de la création",
        err instanceof Error
          ? err.message
          : "Impossible de créer le compte élève.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ajouter un élève"
      description="Renseignez les informations de l'élève pour créer son compte."
      size="md"
      customClassName="user-form-modal"
    >
      <form method="post" onSubmit={handleSubmit} noValidate>
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
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            error={hasError("phone")}
          />
        </FormField>

        <FormField
          label="Mot de passe"
          name="password"
          required
          error={getError("password")}
        >
          <Input
            type="password"
            name="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={hasError("password")}
          />
        </FormField>

        <FormField
          label="Campus"
          name="campusId"
          required
          error={getError("campusId")}
        >
          <Select
            name="campusId"
            id="campusId"
            value={formData.campusId ? formData.campusId : undefined}
            error={hasError("campusId")}
            onChange={handleChange}
            disabled={Boolean(lockedCampusId)}
            options={campuses.map((c) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </FormField>

        <FormField
          label="Promotion"
          name="promotionId"
          required
          error={getError("promotionId")}
        >
          <Select
            name="promotionId"
            id="promotionId"
            value={formData.promotionId ? formData.promotionId : undefined}
            error={hasError("promotionId")}
            onChange={handleChange}
            options={promotionOptions.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
          />
        </FormField>

        <FormField label="Spécialité" name="specialityId">
          <Select
            name="specialityId"
            id="specialityId"
            value={formData.specialityId ? formData.specialityId : undefined}
            error={null}
            onChange={handleChange}
            options={specialityOptions.map((s) => ({
              label: s.name,
              value: s.id,
            }))}
          />
        </FormField>

        <FormField label="Sous-spécialité" name="subSpecialityId">
          <Select
            name="subSpecialityId"
            id="subSpecialityId"
            value={
              formData.subSpecialityId ? formData.subSpecialityId : undefined
            }
            error={null}
            onChange={handleChange}
            options={subSpecialityOptions.map((sp) => ({
              label: sp.name,
              value: sp.id,
            }))}
          />
        </FormField>

        <div className="user-form-footer">
          <Button type="submit" className="btn-primary">
            <span>{loading ? "Enregistrement..." : "Enregistrer"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
