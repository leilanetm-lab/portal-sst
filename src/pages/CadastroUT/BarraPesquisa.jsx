import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiPlus,
} from "react-icons/fi";

import { exportarExcel } from "../../Utils/exportarExcel";

function BarraPesquisa({
  pesquisa,
  setPesquisa,
  carregarUTs,
  abrirModal,
  uts,
}) {
  return (
    <div className="acoes">

      <div className="campo-pesquisa">

        <FiSearch className="icone-pesquisa" />

        <input
          type="text"
          placeholder="Pesquisar por UT, cliente ou cidade..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

      </div>

      <div className="botoes">

        <button
          className="atualizar"
          onClick={carregarUTs}
        >
          <FiRefreshCw />
          Atualizar
        </button>

        <button
          className="exportar"
          onClick={() => exportarExcel(uts)}
        >
          <FiDownload />
          Exportar Excel
        </button>

        <button
          className="nova-ut"
          onClick={abrirModal}
        >
          <FiPlus />
          Nova Unidade
        </button>

      </div>

    </div>
  );
}

export default BarraPesquisa;