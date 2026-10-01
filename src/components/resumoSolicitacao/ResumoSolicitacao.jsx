import "./ResumoSolicitacao.css";
import logoManserv from "../../assets/logo-manserv.png";
import TimelineWorkflow from "../workflow/TimelineWorkflow";


function ResumoSolicitacao({

    utSelecionada,

    cadastroAdministrativo,

    dadosCadastroOriginal,

    dadosCadastro,

    tipoSolicitacao,

    documentosGerados,

    dadosSolicitacao,

    lancamentoLTCAT,

    revisaoAnual,

    adequacaoCorrecao,

    funcoes,

    protocolo,

    statusSolicitacao,

    etapaWorkflow,

    aceite,

    setAceite,

    setEtapa,

    onEnviar,

    enviando,

    solicitacaoOriginalId = "",

    solicitacaoOriginalProtocolo = "",

    motivoReprovacaoCliente = "",

    alteracaoCadastroOrigem = false

}){


    const totalRiscos = funcoes.reduce(

        (total, funcao) =>
            total + funcao.riscos.length,

        0

    );


    const riscosCompletos = funcoes.reduce(

        (total, funcao) =>

            total +

            funcao.riscos.filter(
                item => item.valido
            ).length,

        0

    );


    const nomesCampos = {

        numeroUT:
            "Número da UT",

        nomeUT:
            "Nome da Unidade",

        cliente:
            "Cliente",

        gerenteContrato:
            "Gerente do Contrato",

        emailGerente:
            "E-mail do Gerente",

        cidade:
            "Cidade",

        endereco:
            "Endereço",

        contrato:
            "Contrato",

        vigenciaContrato:
            "Vigência do Contrato",

        descricaoAlteracao:
            "Descrição das Alterações"

    };


    const alteracoesCadastro =

        Object.keys(
            dadosCadastro || {}
        )

        .filter(
            (campo) => {

                if (
                    campo ===
                    "descricaoAlteracao"
                ) {

                    return false;

                }


                return (

                    (
                        dadosCadastroOriginal?.[
                            campo
                        ] ?? ""
                    )

                    !==

                    (
                        dadosCadastro?.[
                            campo
                        ] ?? ""
                    )

                );

            }

        )

        .map(
            (campo) => ({

                campo,

                nome:
                    nomesCampos[campo] ||
                    campo,

                anterior:
                    dadosCadastroOriginal?.[
                        campo
                    ] || "-",

                atual:
                    dadosCadastro?.[
                        campo
                    ] || "-"

            })

        );


    return(

        <div className="ordemServico">


            <header className="cabecalhoOS">


                <div className="empresa">


                    <img

                        src={logoManserv}

                        alt="Manserv"

                        className="logoEmpresa"

                    />


                    <div>

                        <h3>

                            Sistema Corporativo

                            <br/>

                            Segurança e Saúde do Trabalho

                        </h3>

                    </div>


                </div>


                <div className="tituloOS">

                    <h2>

                        ORDEM DE SERVIÇO SST

                    </h2>


                    <small>

                        Resumo da Solicitação

                    </small>

                </div>


            </header>


            {
                solicitacaoOriginalId && (
                    <section className="secaoResumo" style={{ marginTop: 20 }}>
                        <div className="tituloSecao" style={{ color: "#b3261e" }}>
                            🔴 Correção originada de reprovação do cliente
                        </div>

                        <div className="fichaTecnica">
                            <div>
                                <span>Solicitação original</span>
                                <strong>{solicitacaoOriginalProtocolo || solicitacaoOriginalId || "-"}</strong>
                            </div>

                            <div className="campoGrande">
                                <span>Motivo da reprovação</span>
                                <strong>{motivoReprovacaoCliente || "-"}</strong>
                            </div>

                            <div>
                                <span>Modalidade</span>
                                <strong>Correção</strong>
                            </div>

                            <div>
                                <span>Alteração no Cadastro Administrativo</span>
                                <strong>{alteracaoCadastroOrigem ? "Sim" : "Não"}</strong>
                            </div>
                        </div>
                    </section>
                )
            }

            <section className="barraInformacoes">


                <div>

                    <span>

                        PROTOCOLO

                    </span>


                    <strong>

                        {
                            protocolo ||
                            "Será gerado após o envio"
                        }

                    </strong>

                </div>


                <div>

                    <span>

                        STATUS

                    </span>


                    <strong className="statusEmPreenchimento">

                        {statusSolicitacao}

                    </strong>

                </div>


                <div>

                    <span>

                        PRAZO ESTIMADO

                    </span>


                    <strong>

                        PGR: 7 dias úteis

                        <br/>

                        PCMSO: 7 dias após conclusão do PGR

                    </strong>

                </div>


            </section>


            <section className="secaoResumo">


                <div className="tituloSecao">

                    🏢 Dados da Unidade

                </div>


                <div className="fichaTecnica">


                    <div>

                        <span>

                            Gerente do Contrato

                        </span>


                        <strong>

                            {
                                dadosCadastro?.gerenteContrato ||
                                "-"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>

                            🏢 Identificação da Unidade

                        </span>


                        <strong>

                            {utSelecionada?.numeroUT}

                            <br/>

                            <small>

                                {utSelecionada?.nomeUT}

                            </small>

                        </strong>

                    </div>


                    <div>

                        <span>

                            E-mail do Gerente

                        </span>


                        <strong>

                            {
                                dadosCadastro?.emailGerente ||
                                "-"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>

                            Data da Solicitação

                        </span>


                        <strong>

                            {
                                new Date()
                                    .toLocaleDateString(
                                        "pt-BR"
                                    )
                            }

                        </strong>

                    </div>


                </div>


            </section>


            {
                alteracoesCadastro.length > 0 && (

                    <section className="secaoResumo">


                        <div className="tituloSecao">

                            📝 Alterações do Cadastro Administrativo

                        </div>


                        {
                            dadosCadastro?.descricaoAlteracao && (

                                <div

                                    className="campoGrande"

                                    style={{
                                        marginBottom: 25
                                    }}

                                >

                                    <span>

                                        Descrição das Alterações

                                    </span>


                                    <strong>

                                        {
                                            dadosCadastro.descricaoAlteracao
                                        }

                                    </strong>

                                </div>

                            )
                        }


                        <div className="listaRiscosResumo">


                            {

                                alteracoesCadastro.map(

                                    (item, index) => (

                                        <div

                                            key={index}

                                            className="cardResumoRisco"

                                        >


                                            <div className="cabecalhoResumoRisco">

                                                <h3>

                                                    {item.nome}

                                                </h3>

                                            </div>


                                            <div className="dadosResumoRisco">


                                                <div>

                                                    <label>

                                                        Valor anterior

                                                    </label>


                                                    <p>

                                                        {item.anterior}

                                                    </p>

                                                </div>


                                                <div>

                                                    <label>

                                                        Novo valor

                                                    </label>


                                                    <p>

                                                        {item.atual}

                                                    </p>

                                                </div>


                                            </div>


                                        </div>

                                    )

                                )

                            }


                        </div>


                    </section>

                )

            }


            <section className="secaoResumo">


                <div className="tituloSecao">

                    📄 Solicitação

                </div>


                <div className="fichaTecnica">


                    <div>

                        <span>

                            Tipo da Solicitação

                        </span>


                        <strong>

                            {
                                tipoSolicitacao ||
                                "-"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>

                            Documentos Solicitados

                        </span>


                        <strong>

                            {
                                documentosGerados.length > 0

                                    ?

                                    documentosGerados.join(
                                        " / "
                                    )

                                    :

                                    "-"
                            }

                        </strong>

                    </div>


                    <div className="campoGrande">

                        <span>

                            Motivo

                        </span>


                        <strong>

                            {
                                dadosSolicitacao?.motivo ||
                                "-"
                            }

                        </strong>

                    </div>


                    <div className="campoGrande">

                        <span>

                            Justificativa da Solicitação

                        </span>


                        <strong>

                            {
                                dadosSolicitacao?.descricao ||
                                "-"
                            }

                        </strong>

                    </div>


                    {
                        tipoSolicitacao ===
                        "Lançamento LTCAT"

                        && (

                            <>

                                <div>

                                    <span>

                                        Lançamento das medições

                                    </span>


                                    <strong>

                                        {
                                            lancamentoLTCAT?.tipoLancamento ===
                                            "todos"

                                                ?

                                                "Todos os GHEs"

                                                :

                                                "GHEs específicos"
                                        }

                                    </strong>

                                </div>


                                {

                                    lancamentoLTCAT?.tipoLancamento ===
                                    "especificos"

                                    && (

                                        <div className="campoGrande">


                                            <span>

                                                GHEs informados

                                            </span>


                                            <strong>

                                                {

                                                    lancamentoLTCAT?.ghes?.length > 0

                                                        ?

                                                        lancamentoLTCAT.ghes.map(

                                                            (ghe, index) => (

                                                                <div
                                                                    key={index}
                                                                >

                                                                    {ghe}

                                                                </div>

                                                            )

                                                        )

                                                        :

                                                        "-"

                                                }

                                            </strong>


                                        </div>

                                    )

                                }

                            </>

                        )

                    }


                    {

                        tipoSolicitacao ===
                        "Revisão Anual"

                        &&

                        revisaoAnual?.possuiAlteracao ===
                        "nao"

                        && (

                            <div>

                                <span>

                                    Revisão Anual

                                </span>


                                <strong>

                                    Apenas atualização da vigência.

                                </strong>

                            </div>

                        )

                    }


                    {

                        (

                            tipoSolicitacao ===
                            "Adequação"

                            ||

                            tipoSolicitacao ===
                            "Correção"

                        )

                        && (

                            <div className="resumoItem">

                                <strong>

                                    Tipo da alteração:

                                </strong>


                                <span>

                                    {
                                        adequacaoCorrecao.tipoAlteracao ===
                                        "administrativo"

                                        &&

                                        "Dados Administrativos"
                                    }


                                    {
                                        adequacaoCorrecao.tipoAlteracao ===
                                        "tecnica"

                                        &&

                                        "Alteração Técnica"
                                    }


                                    {
                                        adequacaoCorrecao.tipoAlteracao ===
                                        "geral"

                                        &&

                                        "Dados Gerais"
                                    }

                                </span>

                            </div>

                        )

                    }


                    {

                        adequacaoCorrecao?.tipoAlteracao ===
                        "geral"

                        &&

                        adequacaoCorrecao?.descricao

                        && (

                            <div className="resumoItem">

                                <strong>

                                    Descrição:

                                </strong>


                                <span>

                                    {
                                        adequacaoCorrecao.descricao
                                    }

                                </span>

                            </div>

                        )

                    }


                </div>


            </section>


            {


                funcoes.map(

                    (funcao, index) => (

                        <section

                            className="secaoResumo"

                            key={index}

                        >


                            <div className="tituloSecao">

                                👷 Função {index + 1}

                            </div>


                            <div className="fichaTecnica">


                                <div>

                                    <span>

                                        Função

                                    </span>


                                    <strong>

                                        {funcao.funcao}

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        Setor

                                    </span>


                                    <strong>

                                        {funcao.setor}

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        GHE

                                    </span>


                                    <strong>

                                        {

                                            funcao.tipoGHE ===
                                            "novo"

                                                ?

                                                `Novo (${funcao.identificacaoGHE})`

                                                :

                                                funcao.identificacaoGHE

                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        Colaborador

                                    </span>


                                    <strong>

                                        {funcao.colaborador}

                                    </strong>

                                </div>


                                <div className="campoGrande">

                                    <span>

                                        Descrição das Atividades

                                    </span>


                                    <strong>

                                        {funcao.descricaoAtividade}

                                    </strong>

                                </div>


                                <div className="campoGrande">

                                    <span>

                                        Local de Trabalho

                                    </span>


                                    <strong>

                                        {funcao.descricaoLocal}

                                    </strong>

                                </div>


                            </div>


                            <div

                                className="tituloSecao"

                                style={{
                                    marginTop: 30
                                }}

                            >

                                ☣ Inventário de Riscos

                            </div>


                            <div className="painelIndicadoresResumo">


                                <div className="indicadorResumo">

                                    <span>

                                        Total de riscos

                                    </span>


                                    <strong>

                                        {funcao.riscos.length}

                                    </strong>

                                </div>


                                <div className="indicadorResumo sucesso">

                                    <span>

                                        Completos

                                    </span>


                                    <strong>

                                        {
                                            funcao.riscos.filter(
                                                item =>
                                                    item.valido
                                            ).length
                                        }

                                    </strong>

                                </div>


                                <div className="indicadorResumo alerta">

                                    <span>

                                        Pendentes

                                    </span>


                                    <strong>

                                        {

                                            funcao.riscos.length -

                                            funcao.riscos.filter(
                                                item =>
                                                    item.valido
                                            ).length

                                        }

                                    </strong>

                                </div>


                            </div>


                            {

                                funcao.riscos.length ===
                                0

                                    ?

                                    (

                                        <div className="alertaCadastro">

                                            Nenhum risco cadastrado.

                                        </div>

                                    )

                                    :

                                    (

                                        <div className="listaRiscosResumo">


                                            {

                                                funcao.riscos.map(

                                                    (
                                                        item,
                                                        indiceRisco
                                                    ) => (

                                                        <div

                                                            key={
                                                                indiceRisco
                                                            }

                                                            className="cardResumoRisco"

                                                        >


                                                            <div className="cabecalhoResumoRisco">


                                                                <div>

                                                                    <small>

                                                                        RISCO{" "}
                                                                        {
                                                                            indiceRisco +
                                                                            1
                                                                        }

                                                                    </small>


                                                                    <h3>

                                                                        {
                                                                            item.risco
                                                                        }

                                                                    </h3>

                                                                </div>


                                                                <span

                                                                    className={
                                                                        `categoriaResumo ${item.categoria}`
                                                                    }

                                                                >

                                                                    {
                                                                        item.categoria
                                                                    }

                                                                </span>


                                                            </div>


                                                            <div className="dadosResumoRisco">


                                                                <div>

                                                                    <label>

                                                                        Fonte Geradora

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.atividade
                                                                        }

                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>

                                                                        Forma de Exposição

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.contato
                                                                        }

                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>

                                                                        EPI

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.epi
                                                                        }

                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>

                                                                        CA

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.ca
                                                                        }

                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>

                                                                        EPC

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.epc ||
                                                                            "Não informado"
                                                                        }

                                                                    </p>

                                                                </div>


                                                                <div className="linhaInteira">

                                                                    <label>

                                                                        Controles Administrativos

                                                                    </label>


                                                                    <p>

                                                                        {
                                                                            item.medidas
                                                                        }

                                                                    </p>

                                                                </div>


                                                            </div>


                                                            <div className="rodapeResumoRisco">


                                                                {

                                                                    item.valido

                                                                        ?

                                                                        (

                                                                            <span className="statusOk">

                                                                                ✔ Cadastro Completo

                                                                            </span>

                                                                        )

                                                                        :

                                                                        (

                                                                            <span className="statusPendente">

                                                                                ⚠ Cadastro Pendente

                                                                            </span>

                                                                        )

                                                                }


                                                            </div>


                                                        </div>

                                                    )

                                                )

                                            }


                                        </div>

                                    )

                            }


                        </section>

                    )

                )

            }


            <section className="secaoResumo">


                <div className="tituloSecao">

                    📝 Declaração de Responsabilidade

                </div>


                <div className="caixaDeclaracao">


                    <p>

                        Declaro que todas as informações prestadas nesta solicitação representam as condições reais do ambiente de trabalho e serão utilizadas para elaboração dos documentos de Segurança e Saúde do Trabalho.

                    </p>


                    <div className="aceiteEletronico">


                        <div>

                            <span>

                                UNIDADE SOLICITANTE

                            </span>


                            <div>

                                <strong>

                                    UT{" "}
                                    {
                                        dadosCadastro?.numeroUT ||
                                        "-"
                                    }

                                </strong>


                                <br/>


                                <span>

                                    {
                                        dadosCadastro?.cliente ||
                                        "-"
                                    }

                                </span>

                            </div>

                        </div>


                        <div>

                            <span>

                                ACEITE

                            </span>


                            <label className="checkboxAceite">


                                <input

                                    type="checkbox"

                                    checked={aceite}

                                    onChange={(e) =>
                                        setAceite(
                                            e.target.checked
                                        )
                                    }

                                    disabled={enviando}

                                />


                                Declaro que as informações prestadas representam as condições reais da unidade e autorizo o envio desta solicitação para análise da equipe de SST.


                            </label>


                        </div>


                    </div>


                </div>


            </section>


            <TimelineWorkflow

                etapa={
                    etapaWorkflow ||
                    2
                }

            />


            <footer className="rodapeResumo">


                {/* =====================================
                    BOTÃO VOLTAR
                ===================================== */}

                <button

                    type="button"

                    className="cancelar"

                    disabled={enviando}

                    onClick={() => {


                        if (
                            tipoSolicitacao ===
                            "Lançamento LTCAT"
                        ) {

                            setEtapa(5.5);

                            return;

                        }


                        if (
                            tipoSolicitacao ===
                            "Revisão Anual"
                        ) {


                            if (
                                revisaoAnual?.possuiAlteracao ===
                                "nao"
                            ) {

                                setEtapa(5.6);

                            }

                            else {

                                setEtapa(5);

                            }


                            return;

                        }


                        if (

                            (
                                tipoSolicitacao ===
                                "Adequação"

                                ||

                                tipoSolicitacao ===
                                "Correção"
                            )

                        ) {


                            if (
                                adequacaoCorrecao?.tipoAlteracao ===
                                "administrativo"
                            ) {

                                setEtapa(5.7);

                            }

                            else if (
                                adequacaoCorrecao?.tipoAlteracao ===
                                "geral"
                            ) {

                                setEtapa(5.8);

                            }

                            else {

                                setEtapa(5);

                            }


                            return;

                        }


                        setEtapa(5);

                    }}

                >

                    ← Voltar para edição

                </button>


                <div className="acoesResumo">


                    {/* =====================================
                        VISUALIZAR OS
                    ===================================== */}

                    <button

                        type="button"

                        className="secundario"

                        onClick={() =>
                            window.print()
                        }

                    >

                        👁 Visualizar OS

                    </button>


                    {/* =====================================
                        ENVIAR SOLICITAÇÃO
                    ===================================== */}

                    {

                        /*
                        Só mostra o botão enquanto
                        a solicitação ainda não foi enviada.

                        Depois que o envio começa,
                        "enviando" fica true.

                        O botão desaparece.

                        Se der erro, o onEnviar()
                        libera novamente o botão.
                        */

                        !enviando

                        &&

                        statusSolicitacao !==
                        "Em Análise Técnica"

                        && (

                            <button

                                type="button"

                                className="salvar"

                                onClick={() => {


                                    if (!aceite) {

                                        alert(
                                            "⚠️ Para enviar a solicitação é obrigatório confirmar o aceite da declaração."
                                        );

                                        return;

                                    }


                                    onEnviar();

                                }}

                            >

                                📨 Enviar Solicitação

                            </button>

                        )

                    }


                </div>


            </footer>


        </div>

    );

}


export default ResumoSolicitacao;