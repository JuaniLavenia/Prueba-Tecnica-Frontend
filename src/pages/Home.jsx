import { useContext, useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const [clientCode, setClientCode] = useState("");
  const [movements, setMovements] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredMovements, setFilteredMovements] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);

  const [clients, setClients] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

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
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .get(`https://localhost:7129/api/CurrentAccount?clientData=${clientCode}`)
      .then((res) => {
        setMovements(res.data);
        setFilteredMovements(res.data);
      })
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

  const handleShowAllClients = async () => {
    setIsLoading1(true);
    const page = currentPage || 1;
    await axios
      .get(
        `https://localhost:7129/api/Clients?page=${page}&limit=${postsPerPage}`
      )
      .then((res) => {
        setClients(res.data.items);
        setCurrentPage(res.data.currentPage);
        setIsLoading1(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Conexión perdida",
          text: "No se pudo establecer conexión con el servidor.",
        });
      })
      .finally(() => {
        setIsLoading1(false);
      });
  };

  const handlePageChange = async (newPage) => {
    if (newPage <= 0) return;
    try {
      const response = await axios.get(
        `https://localhost:7129/api/Clients?page=${newPage}&limit=${postsPerPage}`
      );
      setClients(response.data.items);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Conexión perdida",
        text: "No se pudo establecer conexión con el servidor.",
      });
    }
  };

  const handleFilterByDate = () => {
    setIsLoading(true);
    axios
      .get(
        `https://localhost:7129/api/CurrentAccount/GetByDateRange?startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        setFilteredMovements(res.data);
      })
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

  useEffect(() => {
    setFilteredMovements(movements);
  }, [movements, startDate, endDate]);

  // const handlePrintPDF = async () => {
  //   try {
  //     const payload = movements;
  //     const response = await axios.post(
  //       "https://localhost:7129/api/CurrentAccount",
  //       JSON.stringify(payload),
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = response.data;
  //     Swal.fire({
  //       position: "center",
  //       icon: "success",
  //       title: "PDF generado correctamente",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Algo salió mal :(",
  //     });
  //   }
  // };

  return (
    <div className="containerMain">
      <div className="containerForm">
        <h1 className="text-center">
          Consulta de Movimientos de Cuenta Corriente
        </h1>
        <button
          className="btn btn-primary mt-3"
          onClick={handleShowAllClients}
          disabled={isLoading1}
        >
          {isLoading1 ? "Cargando..." : "Mostrar todos los clientes"}
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Consultar"}
          </button>
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
          <div className="text-center">
            <button
              className="btn btn-primary mt-3"
              onClick={handleFilterByDate}
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Filtrar por fecha"}
            </button>
          </div>
        </form>

        {/* <button
          className="btn btn-primary mt-3"
          onClick={handlePrintPDF}
          disabled={isLoading2}
        >
          {isLoading2 ? "Cargando..." : "Generar reporte de la tabla"}
        </button> */}
      </div>

      <h3 className="text-center">DETALLE</h3>

      <div className="tablaClientes">
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
            {clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No hay registros
                </td>
              </tr>
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
        <div className="text-center">
          <button
            className="btn btn-light"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </button>
          <button
            className="btn btn-light"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
      <div className="tablaCuentas">
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
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-light">
                  No hay registros
                </td>
              </tr>
            ) : (
              filteredMovements.map((movement) => (
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
      </div>
    </div>
  );
}

export default Home;
