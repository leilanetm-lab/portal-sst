function InformacoesCliente({ dados, setDados }) {

  function alterarCampo(e) {

    setDados({

      ...dados,

      [e.target.name]: e.target.value,

    });

  }

  return (

    <div className="card">

      <h2>🏢 Informações do Cliente</h2>

      <p className="descricao">

        Preencha as informações referentes ao cliente e à Unidade de Trabalho.

      </p>

      <div className="linha">

        <div className="campo">

          <label>Nome da Contratante *</label>

          <small>Informe a razão social da empresa contratante.</small>

          <input
            name="nomeContratante"
            value={dados.nomeContratante}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>CNPJ do Cliente *</label>

          <small>CNPJ da empresa contratante.</small>

          <input
            name="cnpjCliente"
            value={dados.cnpjCliente}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>Ramo da Atividade da Contratante *</label>

          <small>Atividade econômica principal da contratante.</small>

          <input
            name="ramoContratante"
            value={dados.ramoContratante}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Ramo da Atividade da UT *</label>

          <small>Atividade desenvolvida na Unidade de Trabalho.</small>

          <input
            name="ramoUT"
            value={dados.ramoUT}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>CNAE da Atividade *</label>

          <small>Código CNAE da atividade da contratante.</small>

          <input
            name="cnaeCliente"
            value={dados.cnaeCliente}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Grau de Risco da Contratante *</label>

          <small>Informe o grau de risco conforme o CNAE.</small>

          <input
            name="grauRiscoContratante"
            value={dados.grauRiscoContratante}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="campo">

        <label>Endereço da Localidade *</label>

        <small>

          Informe o endereço completo onde a Unidade de Trabalho está localizada.

        </small>

        <textarea
          rows="4"
          name="enderecoLocalidade"
          value={dados.enderecoLocalidade}
          onChange={alterarCampo}
        />

      </div>

    </div>

  );

}

export default InformacoesCliente;