import { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const [clientCode, setClientCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [token]);

  // if (!token) {
  //   return null;
  // }

  const handleClientCodeChange = (event) => {
    setClientCode(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    filterMovementsByDate(event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    filterMovementsByDate(startDate, event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .get(`https://localhost:7129/api/CurrentAccount?clientData=${clientCode}`)
      .then((res) => setMovements(res.data))
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Conexión perdida",
          text: "No se pudo establecer conexión con el servidor.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleShowAllClients = () => {
    setIsLoading(true);
    axios
      .get("https://localhost:7129/api/Clients")
      .then((res) => {
        setClients(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Conexión perdida",
          text: "No se pudo establecer conexión con el servidor.",
        });
        setIsLoading(false);
      });
  };

  const filterMovementsByDate = (start, end) => {
    const filteredMovements = movements.filter(
      (movement) => movement.dateReceipt >= start && movement.dateReceipt <= end
    );
    setMovements(filteredMovements);
  };

  return (
    <div className="containerMain">
      <div className="containerForm">
        <h1 className="text-center">
          Consulta de Movimientos de Cuenta Corriente
        </h1>
        <button className="btn btn-primary mt-3" onClick={handleShowAllClients}>
          Mostrar todos los clientes
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="clientCode" className="form-label">
              Id o Nombre del Cliente:
            </label>
            <input
              type="text"
              className="form-control"
              id="clientCode"
              value={clientCode}
              onChange={handleClientCodeChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Fecha de inicio:
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endDate" className="form-label">
              Fecha de fin:
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Consultar
          </button>
        </form>
      </div>

      <h3 className="text-center">DETALLE</h3>

      <div className="tablaCuentas">
        {clients.length > 0 && (
          <table className="table tableBody text-light">
            <thead className="thead">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Razon Social</th>
                <th scope="col">CUIT</th>
                <th scope="col">Posnet</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {isLoading ? (
                <p className="text-center">Cargando clientes...</p>
              ) : (
                clients.map((client) => (
                  <tr key={client.idClient}>
                    <td scope="row">{client.idClient}</td>
                    <td scope="row">{client.razonSocial}</td>
                    <td scope="row">{client.cuit}</td>
                    <td scope="row">{client.posnet ? "Si" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {movements.length > 0 && (
          <table className="table tableBody text-light">
            <thead className="thead">
              <tr>
                <th scope="col">Fecha del Comprobante</th>
                <th scope="col">Nro del Comprobante</th>
                <th scope="col">Tipo de Comprobante</th>
                <th scope="col">Tipo</th>
                <th scope="col">Monto</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {isLoading ? (
                <p className="text-center">Cargando detalles...</p>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.idCA} className="file">
                    <td scope="row">{movement.dateReceipt}</td>
                    <td scope="row">{movement.numReceipt}</td>
                    <td scope="row">{movement.receiptType}</td>
                    <td scope="row">{movement.type}</td>
                    <td scope="row">{movement.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Home;
