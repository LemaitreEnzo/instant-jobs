import UserHeader from "../../common/UserHeader/UserHeader";
import Button from "../../ui/Button/Button";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header_search">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.553 15.553C16.2086 14.8974 16.7287 14.119 17.0835 13.2624C17.4383 12.4058 17.6209 11.4877 17.6209 10.5605C17.6209 9.6333 17.4383 8.71518 17.0835 7.85857C16.7287 7.00196 16.2086 6.22362 15.553 5.56799C14.8973 4.91237 14.119 4.3923 13.2624 4.03748C12.4058 3.68265 11.4877 3.50003 10.5605 3.50003C9.63327 3.50003 8.71515 3.68265 7.85854 4.03748C7.00192 4.3923 6.22359 4.91237 5.56796 5.56799C4.24387 6.89209 3.5 8.68794 3.5 10.5605C3.5 12.433 4.24387 14.2289 5.56796 15.553C6.89205 16.8771 8.68791 17.621 10.5605 17.621C12.433 17.621 14.2289 16.8771 15.553 15.553ZM15.553 15.553L20 20"
            stroke="#121212"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <input
          type="text"
          placeholder="Rechercher une offre, une entreprise, un document..."
        />
      </div>
      <div className="header_actions">
        <Button shape="icon" className="btn-terciary">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.9341 14.98C18.6357 14.5033 18.4773 13.9524 18.4771 13.39V9.22599C18.4771 7.50819 17.7947 5.86074 16.58 4.64606C15.3653 3.43139 13.7179 2.74899 12.0001 2.74899C10.2822 2.74899 8.63479 3.43139 7.42012 4.64606C6.20545 5.86074 5.52305 7.50819 5.52305 9.22599V13.388C5.52313 13.951 5.36476 14.5027 5.06605 14.98L3.97805 16.72C3.88344 16.8714 3.83108 17.0453 3.82639 17.2237C3.82171 17.4022 3.86487 17.5786 3.95141 17.7348C4.03794 17.8909 4.16469 18.021 4.31849 18.1116C4.4723 18.2022 4.64755 18.25 4.82605 18.25H19.1741C19.3526 18.25 19.5278 18.2022 19.6816 18.1116C19.8354 18.021 19.9622 17.8909 20.0487 17.7348C20.1352 17.5786 20.1784 17.4022 20.1737 17.2237C20.169 17.0453 20.1167 16.8714 20.0221 16.72L18.9341 14.98Z"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 21.25H14"
              stroke="black"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </Button>
        <UserHeader />
      </div>
    </header>
  );
};
export default Header;
