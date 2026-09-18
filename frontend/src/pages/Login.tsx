import Illustration from "../assets/img/Illustration.webp";
import Logo from "../assets/img/Logo.webp";
import Button from "../components/ui/Button/Button";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/pages/login.css";
import { loginUser } from "../hooks/useUser";
import type { dataLogin } from "../types/form.type";

const Login = () => {
  const navigate = useNavigate();

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
    try {
      await loginUser(formData);
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
          >
            <div className="field">
              <label htmlFor="email">Adresse mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
            </div>
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
