import { useEffect, useState } from "react";
import "./CadastroUT.css";

import ModalNovaUT from "../../components/ModalNovaUT";
import BarraPesquisa from "./BarraPesquisa";
import TabelaUT from "./TabelaUT";

import { listarUTs } from "../../services/utService";

function CadastroUT() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pesquisa, setPesquisa] = useState("");
  const [uts, setUTs] = useState([]);
  const [utSelecionada, setUtSelecionada] = useState(null);

  async function carregarUTs() {
    const lista = await listarUTs();
    setUTs(lista);
  }

  useEffect(() => {
    carregarUTs();
  }, []);

  const utsFiltradas = uts.filter((ut) => {
    const texto = pesquisa.toLowerCase();

    return (
      ut.numeroUT?.toLowerCase().includes(texto) ||
      ut.nomeUT?.toLowerCase().includes(texto) ||
      ut.cliente?.toLowerCase().includes(texto) ||
      ut.cidade?.toLowerCase().includes(texto)
    );
  });

  function novaUT() {
    setUtSelecionada(null);
    setModalAberto(true);
  }

  function editarUT(ut) {
    setUtSelecionada(ut);
    setModalAberto(true);
  }

  return (
    <div className="cadastro-ut">

      <div className="cabecalho">

        <h1>Cadastro de Unidades de Trabalho</h1>

        <p>
          Gerencie todas as Unidades de Trabalho cadastradas no Portal SST.
        </p>

        <div className="contador-ut">
          Mostrando <strong>{utsFiltradas.length}</strong> de{" "}
          <strong>{uts.length}</strong> unidades cadastradas
        </div>

      </div>

      <BarraPesquisa
        pesquisa={pesquisa}
        setPesquisa={setPesquisa}
        carregarUTs={carregarUTs}
        abrirModal={novaUT}
        uts={utsFiltradas}
      />

      <TabelaUT
        uts={utsFiltradas}
        editarUT={editarUT}
        carregarUTs={carregarUTs}
      />

      <ModalNovaUT
        aberto={modalAberto}
        fechar={() => {
          setModalAberto(false);
          setUtSelecionada(null);
        }}
        aoSalvar={carregarUTs}
        ut={utSelecionada}
      />

    </div>
  );
}

export default CadastroUT;