import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import "./Header.css";

function Header() {
  const { token, logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout("");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Se cerró la sesion",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark containPrincipal">
        <div className="container-fluid ">
          <Link className="navbar-brand text-light" to="/">
            Trocadero Distribuidora
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <li className="nav-item" id="login-register">
                {token ? (
                  <Link
                    className="nav-link text-light logoutBtn"
                    to="/"
                    onClick={handleLogout}
                  >
                    <svg
                      className="bi d-block mx-auto mb-1"
                      width="30px"
                      height="30px"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="#ffffff"
                    >
                      <g
                        clipPath="url(#remove-user_svg__clip0)"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18.621 12.121L20.743 10m2.121-2.121L20.743 10m0 0L18.62 7.879M20.743 10l2.121 2.121M1 20v-1a7 7 0 017-7v0a7 7 0 017 7v1M8 12a4 4 0 100-8 4 4 0 000 8z"></path>
                      </g>
                      <defs>
                        <clipPath id="remove-user_svg__clip0">
                          <path fill="#fff" d="M0 0h24v24H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                    Cerrar Sesión
                  </Link>
                ) : (
                  <Link className="nav-link text-light loginBtn" to="/login">
                    <svg
                      className="bi d-block mx-auto mb-1"
                      width="30px"
                      height="30px"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      color="#ffffff"
                    >
                      <path
                        d="M5 20v-1a7 7 0 017-7v0a7 7 0 017 7v1M12 12a4 4 0 100-8 4 4 0 000 8z"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    Iniciar Sesion
                  </Link>
                )}
              </li>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
