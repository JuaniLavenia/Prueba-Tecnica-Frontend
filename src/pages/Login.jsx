import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.username && values.password) {
      setIsLoading(true);

      const data = new URLSearchParams();
      data.append("Username", values.username);
      data.append("Password", values.password);

      axios
        .post("https://localhost:7129/api/User/login", data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          const { token, userId } = res.data;
          localStorage.setItem("token", token);
          login(token, userId);

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sesión iniciada",
            showConfirmButton: false,
            timer: 1500,
          });
          setValues({ username: "", password: "" });
          navigate("/");
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Los datos proporcionados no son correctos",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingrese un correo y/o contraseña valido",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <>
      <main className="mainDiv pt-5 w-100">
        <div className="col col-lg-4 col-md-8 col-sm-12 login">
          <h1 className="fw-bold text-center py-10 text-black">Bienvenido</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="username"
                className="form-label loginLabel text-black"
              >
                Usuario
              </label>
              <input
                type="text"
                className="form-control loginInput"
                id="usernameLogin"
                required
                maxLength={40}
                name="username"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="registerPassword"
                className="form-label loginLabel text-black"
              >
                Contraseña
              </label>
              <input
                type="password"
                className="form-control loginInput"
                id="passwordLogin"
                required
                minLength={6}
                maxLength={12}
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 btnsDiv">
              <button
                id="iniciarSesion"
                type="submit"
                className="btn btn-primary btn-inicio-sesion"
                onSubmit={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
