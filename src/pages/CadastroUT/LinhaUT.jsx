import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
} from "react-icons/fi";

import { excluirUT } from "../../services/utService";

function LinhaUT({
  ut,
  editarUT,
  carregarUTs,
}) {

  async function excluir() {
    const confirmar = window.confirm(
      `Deseja realmente excluir a UT ${ut.numeroUT}?`
    );

    if (!confirmar) return;

    try {
      await excluirUT(ut.numeroUT);

      alert("✅ Unidade excluída com sucesso!");

      carregarUTs();

    } catch (erro) {
      console.error(erro);
      alert("Erro ao excluir a unidade.");
    }
  }

  // ==========================
  // Status Automático
  // ==========================

  const hoje = new Date();

  const partes = ut.proximaRevisao.split("/");

  const dataRevisao = new Date(
    partes[2],
    partes[1] - 1,
    partes[0]
  );

  const diferencaDias = Math.ceil(
    (dataRevisao - hoje) / (1000 * 60 * 60 * 24)
  );

  let classeStatus = "";
  let textoStatus = "";

  if (diferencaDias < 0) {

    classeStatus = "vencido";
    textoStatus = `Vencido há ${Math.abs(diferencaDias)} dias`;

  } else if (diferencaDias <= 45) {

    classeStatus = "vencendo";
    textoStatus = `Vence em ${diferencaDias} dias`;

  } else {

    classeStatus = "em-dia";
    textoStatus = "Em dia";

  }

  return (
    <tr>

      <td>

        <div className="numero-ut">
          {ut.numeroUT}
        </div>

       <div
  className="nome-ut"
  title={ut.nomeUT}
>
  {ut.nomeUT}
</div>

      </td>

      <td>
        <strong>{ut.cliente}</strong>
      </td>

      <td className="local">

        <FiMapPin className="icone-local" />

        <span>
          {ut.cidade}/{ut.estado}
        </span>

      </td>

      <td>{ut.proximaRevisao}</td>

      <td>

        <span className={`status ${classeStatus}`}>
          {textoStatus}
        </span>

      </td>

      <td>

        <div className="acoes-ut">

          <button
            className="btn-acao editar"
            title="Editar"
            onClick={() => editarUT(ut)}
          >
            <FiEdit2 />
          </button>

          <button
            className="btn-acao excluir"
            title="Excluir"
            onClick={excluir}
          >
            <FiTrash2 />
          </button>

        </div>

      </td>

    </tr>
  );
}

export default LinhaUT;