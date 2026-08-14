function InformacoesManserv({ dados, setDados }) {

  function alterarCampo(e) {

    setDados({

      ...dados,

      [e.target.name]: e.target.value,

    });

  }

  return (

    <div className="card">

      <h2>👷 Informações da Manserv</h2>

      <p className="descricao">

        Informe as informações da contratada e os responsáveis pelo contrato.

      </p>

      <div className="linha">

        <div className="campo">

          <label>Grau de Risco da Contratada *</label>

          <small>Informe o grau de risco da Manserv para este contrato.</small>

          <input
            name="grauRiscoContratada"
            value={dados.grauRiscoContratada}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>Objeto do Contrato *</label>

          <small>Resumo do objeto contratado.</small>

          <input
            name="objetoContrato"
            value={dados.objetoContrato}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="campo">

        <label>Abrangência do Contrato *</label>

        <small>

          Informe a abrangência geográfica ou operacional do contrato.

        </small>

        <textarea
          rows="4"
          name="abrangenciaContrato"
          value={dados.abrangenciaContrato}
          onChange={alterarCampo}
        />

      </div>

      <h3 className="subtitulo">

        Responsáveis pelo Contrato

      </h3>

      <div className="linha">

        <div className="campo">

          <label>Gestor do Contrato *</label>

          <input
            name="gestorContrato"
            value={dados.gestorContrato}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>E-mail do Gestor *</label>

          <input
            type="email"
            name="emailGestor"
            value={dados.emailGestor}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>Fiscal do Contrato *</label>

          <input
            name="fiscalContrato"
            value={dados.fiscalContrato}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>E-mail do Fiscal *</label>

          <input
            type="email"
            name="emailFiscal"
            value={dados.emailFiscal}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>Gerente do Contrato *</label>

          <input
            name="gerenteContrato"
            value={dados.gerenteContrato}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>E-mail do Gerente *</label>

          <input
            type="email"
            name="emailGerente"
            value={dados.emailGerente}
            onChange={alterarCampo}
          />

        </div>

      </div>

      <div className="linha">

        <div className="campo">

          <label>Coordenador do Contrato *</label>

          <input
            name="coordenadorContrato"
            value={dados.coordenadorContrato}
            onChange={alterarCampo}
          />

        </div>

        <div className="campo">

          <label>E-mail do Coordenador *</label>

          <input
            type="email"
            name="emailCoordenador"
            value={dados.emailCoordenador}
            onChange={alterarCampo}
          />

        </div>

      </div>

    </div>

  );

}

export default InformacoesManserv;