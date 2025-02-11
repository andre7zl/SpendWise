import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/gastos")
      .then((response) => {
        const gastosFormatados = response.data.map((gasto) => ({
          ...gasto,
          dataFormatada: formatarData(gasto.data),
          valorFormatado: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(gasto.valor),
        }));
        setGastos(gastosFormatados);
      })
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }, []);

  function formatarData(dataString) {
    if (!dataString) return "Data inválida";
    const data = new Date(dataString);

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
    }).format(data);
  }

  function onSeeDetailsClick(gasto) {
    const valorFormatado = encodeURIComponent(gasto.valor);
    const dataFormatada = encodeURIComponent(gasto.dataFormatada);
    navigate(`/gasto?valor=${valorFormatado}&dataFormatada=${dataFormatada}`);
  }

  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const gastosPaginados = gastos.slice(
    indiceInicial,
    indiceInicial + itensPorPagina
  );
  const totalPaginas = Math.ceil(gastos.length / itensPorPagina);

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow w-full mx-auto">
      <ul className="space-y-4">
        {gastosPaginados.map((gasto) => (
          <li
            key={gasto.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow text-white"
          >
            <div>
              <span className="text-lg font-semibold">
                {gasto.valorFormatado}
              </span>
              <p className="text-gray-400 text-sm">{gasto.dataFormatada}</p>
            </div>
            <button
              onClick={() => onSeeDetailsClick(gasto)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
            >
              <ChevronRight />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-6">
        <span className="text-white text-sm">
          Mostrando {gastosPaginados.length} de {gastos.length} gastos
        </span>
        <nav className="flex items-center space-x-2" aria-label="Pagination">
          <button
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaAtual === totalPaginas}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            Próximo
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Gastos;
