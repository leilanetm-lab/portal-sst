import { useEffect, useState } from "react";
import {
  salvarUT,
  atualizarUT,
} from "../services/utService";
import "./ModalNovaUT.css";

function ModalNovaUT({
  aberto,
  fechar,
  aoSalvar,
  ut,
}) {
  const [numeroUT, setNumeroUT] = useState("");
  const [nomeUT, setNomeUT] = useState("");
  const [cliente, setCliente] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [ultimaRevisao, setUltimaRevisao] = useState("");
  const [periodicidade, setPeriodicidade] = useState("12");
  const [diasAntecedenciaAlerta, setDiasAntecedenciaAlerta] = useState(45);

  useEffect(() => {
    if (!aberto) return;

    if (ut) {
      setNumeroUT(ut.numeroUT || "");
      setNomeUT(ut.nomeUT || "");
      setCliente(ut.cliente || "");
      setCidade(ut.cidade || "");
      setEstado(ut.estado || "");
      setUltimaRevisao(ut.ultimaRevisao || "");
      setPeriodicidade(String(ut.periodicidade || 12));
      setDiasAntecedenciaAlerta(
    ut.diasAntecedenciaAlerta || 45
);
    } else {
      limparFormulario();
    }
  }, [ut, aberto]);

  function limparFormulario() {
    setNumeroUT("");
    setNomeUT("");
    setCliente("");
    setCidade("");
    setEstado("");
    setUltimaRevisao("");
    setPeriodicidade("12");
    setDiasAntecedenciaAlerta(45);
  }

  let proximaRevisao = "";

  if (ultimaRevisao) {
    const data = new Date(ultimaRevisao);
    data.setMonth(data.getMonth() + Number(periodicidade));
    proximaRevisao = data.toLocaleDateString("pt-BR");
  }
let primeiroAlerta = "";

if (ultimaRevisao) {

    const data = new Date(ultimaRevisao);

    data.setMonth(
        data.getMonth() + Number(periodicidade)
    );

    data.setDate(
        data.getDate() -
        Number(diasAntecedenciaAlerta)
    );

    primeiroAlerta =
        data.toLocaleDateString("pt-BR");

}

  if (!aberto) return null;

  async function salvar() {
    try {
      const dados = {
        numeroUT,
        nomeUT,
        cliente,
        cidade,
        estado,
        ultimaRevisao,
        periodicidade: Number(periodicidade),
        proximaRevisao,
        diasAntecedenciaAlerta:
    Number(diasAntecedenciaAlerta),

primeiroAlerta,
      };

      if (ut) {
        await atualizarUT(numeroUT, dados);

        alert("✅ Unidade atualizada com sucesso!");
      } else {
        await salvarUT(dados);

        alert("✅ Unidade cadastrada com sucesso!");
      }

      limparFormulario();

      if (aoSalvar) {
        await aoSalvar();
      }

      fechar();
    } catch (erro) {
      console.error(erro);
      alert(erro.message);
    }
  }
    return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>
          {ut ? "Editar Unidade de Trabalho" : "Nova Unidade de Trabalho"}
        </h2>

        <div className="formulario">

          <div className="campo">
            <label>Número da UT *</label>

            <input
              type="text"
              value={numeroUT}
              disabled={!!ut}
              onChange={(e) => setNumeroUT(e.target.value)}
              placeholder="06.0689.006"
            />
          </div>

          <div className="campo">
            <label>Nome da Unidade *</label>

            <input
              type="text"
              value={nomeUT}
              onChange={(e) => setNomeUT(e.target.value)}
              placeholder="Nome da Unidade"
            />
          </div>

          <div className="campo">
            <label>Cliente *</label>

            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Cliente"
            />
          </div>

          <div className="linha">

            <div className="campo">

              <label>Cidade *</label>

              <input
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
              />

            </div>

            <div className="campo">

              <label>Estado *</label>

              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >

                <option value="">Selecione...</option>

                <option value="AC">Acre (AC)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="AP">Amapá (AP)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PA">Pará (PA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="TO">Tocantins (TO)</option>

              </select>

            </div>

          </div>

          <div className="linha">

            <div className="campo">

              <label>Última Revisão Global *</label>

              <input
                type="date"
                value={ultimaRevisao}
                onChange={(e) => setUltimaRevisao(e.target.value)}
              />

            </div>

            <div className="campo">

              <label>Periodicidade *</label>

              <select
                value={periodicidade}
                onChange={(e) => setPeriodicidade(e.target.value)}
              >
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
              </select>

            </div>

          </div>

<div className="linha">

    <div className="campo">

        <label>Dias de antecedência para alerta</label>

        <input
            type="number"
            min="1"
            value={diasAntecedenciaAlerta}
            onChange={(e) =>
                setDiasAntecedenciaAlerta(e.target.value)
            }
        />

    </div>

    <div className="campo">

        <label>Primeiro alerta</label>

        <input
            type="text"
            value={primeiroAlerta}
            disabled
        />

    </div>

</div>

          <div className="campo">

            <label>Próxima Revisão</label>

            <input
              type="text"
              value={proximaRevisao}
              disabled
            />

          </div>

        </div>

        <div className="botoes">

          <button onClick={fechar}>
            Cancelar
          </button>

          <button
            className="salvar"
            onClick={salvar}
          >
            {ut ? "Salvar Alterações" : "Salvar Unidade"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ModalNovaUT;