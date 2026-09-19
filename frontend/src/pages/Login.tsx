import Illustration from "../assets/img/Illustration.webp";
import Logo from "../assets/img/Logo.webp";
import Button from "../components/ui/Button/Button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../hooks/useUser";
import { useFormValidation, validators } from "../hooks/useFormValidation";

import type { Student, User } from "../interfaces/user.interface";
import type { dataLogin } from "../types/form.type";

import Input from "../components/ui/Input/Input";
import FormField from "../components/ui/FormField/FormField";

import "../assets/css/pages/login.css";

const Login = () => {
  const navigate = useNavigate();

  const { validate, hasError, getError } = useFormValidation({
    email: [validators.required("L'email est obligatoire"), validators.email()],
    password: [validators.required("Le mot de passe est obligatoire")],
  });

  const initData: dataLogin = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState<dataLogin>(initData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate(formData)) return;

    try {
      const user: User | Student | undefined = await loginUser(formData);

      if (!user) return;

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login">
      <div className="left background">
        <div className="image">
          <img src={Logo} />
        </div>

        <div className="container">
          <div className="content">
            <h1>Bon retour ! </h1>
            <p>Veuillez entrer vos informations</p>
          </div>
          <form
            onSubmit={handleSubmit}
            action=""
            className="form"
            method="post"
            noValidate
          >
            <FormField
              label="Adresse mail"
              name="email"
              required
              error={getError("email")}
            >
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="vous@exemple.com"
                onChange={handleChange}
                error={hasError("email")}
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
                placeholder="••••••••"
                onChange={handleChange}
                error={hasError("password")}
              />
            </FormField>
            <Button type="submit" className="btn-primary">
              <span>CONNEXION</span>
            </Button>
          </form>
          <div className="content">
            <p>Un problème lors de la connexion ? Contactez l’assistance</p>
          </div>
        </div>
      </div>

      <div className="right background background-primary">
        <div className="image">
          <img src={Illustration} />
        </div>
      </div>
    </div>
  );
};

export default Login;
