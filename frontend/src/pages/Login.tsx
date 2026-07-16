import Illustration from "../assets/img/Illustration.webp";
import Logo from "../assets/img/Logo.webp";

import "../assets/css/pages/login.css";

const Login = () => {
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
          <form action="" className="form" method="post">
            <div className="field">
              <label htmlFor="email">Adresse mail</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input type="password" name="password" id="password" />
            </div>
            <button className="button button-primary" type="submit">
              CONNEXION
            </button>
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
