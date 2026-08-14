function DadosContrato({ dados, setDados }) {

  function alterarCampo(e) {

    setDados({

      ...dados,

      [e.target.name]: e.target.value,

    });

  }

  return (

    <div className="card">

      <h2>📄 Dados do Contrato</h2>

      <p className="descricao">

        Preencha as informações referentes ao contrato da Unidade de Trabalho.

      </p>

      <div className="linha">

        <div className="campo">

          <label>Diretoria *</label>

          <small>Informe a diretoria responsável pelo contrato.</small>

          <input
            name="diretoria"
            value={dados.diretoria}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Segmento *</label>

          <small>Informe o segmento de atuação do contrato.</small>

          <input
            name="segmento"
            value={dados.segmento}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>Número do Contrato *</label>

          <small>Número informado pelo cliente.</small>

          <input
            name="numeroContrato"
            value={dados.numeroContrato}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Vigência do Contrato *</label>

          <small>Data final da vigência contratual.</small>

          <input
            type="date"
            name="vigenciaContrato"
            value={dados.vigenciaContrato}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha-3">

        <div className="campo">

          <label>CNPJ Atualizado *</label>

          <small>CNPJ utilizado neste contrato.</small>

          <input
            name="cnpjAtualizado"
            value={dados.cnpjAtualizado}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Turno de Trabalho *</label>

          <small>Turno predominante da unidade.</small>

          <input
            name="turnoTrabalho"
            value={dados.turnoTrabalho}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>CNAE da Atividade *</label>

          <small>Código CNAE da atividade executada.</small>

          <input
            name="cnae"
            value={dados.cnae}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="campo">

        <label>Locais de Atuação do Contrato *</label>

        <small>

          Informe todas as localidades onde o contrato é executado.

        </small>

        <textarea
          rows="4"
          name="locaisAtuacao"
          value={dados.locaisAtuacao}
          onChange={alterarCampo}
        />

      </div>

      <div className="campo">

        <label>Endereços dos Locais de Execução *</label>

        <small>

          Informe os endereços completos das unidades onde as atividades são realizadas.

        </small>

        <textarea
          rows="4"
          name="enderecoExecucao"
          value={dados.enderecoExecucao}
          onChange={alterarCampo}
        />

      </div>

    </div>

  );

}

export default DadosContrato;