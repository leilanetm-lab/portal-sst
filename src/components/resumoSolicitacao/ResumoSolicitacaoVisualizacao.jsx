import { useEffect, useMemo, useState } from "react";

import "./ResumoSolicitacao.css";

import TimelineWorkflow from "../workflow/TimelineWorkflow";

import PublicarDocumento
    from "../PublicarDocumento/PublicarDocumento";

import logoManserv
    from "../../assets/logo-manserv.png";


function ResumoSolicitacaoVisualizacao({

    utSelecionada,

    cadastroAdministrativo,

    dadosCadastroOriginal,

    dadosCadastro,

    cadastroAdministrativoPrimeiraSolicitacao = false,

    cadastroAdministrativoAlteradoNestaSolicitacao = false,

    tipoSolicitacao,

    documentosGerados,

    dadosSolicitacao,

    lancamentoLTCAT,

    revisaoAnual,

    adequacaoCorrecao,

    funcoes,

    protocolo,

    statusSolicitacao,

    motivoDevolucao,

    totalDevolucoes,

    etapaWorkflow,

    onDarAceite,

    onDevolver,

    onEnviarDocumento,

    onEditarCorrecao,

    ehUsuarioUT = false,

    ehAdministrador = false,

    dadosSolicitacaoCompleta = null,

    onSalvarAcompanhamentoCliente = null,

    onConcluirAcompanhamentoCliente = null,

    onAvancarParaCorrecao = null,

    onAbrirRelacionada = null

}) {


    /* =====================================
       PROTEÇÃO DOS DADOS
    ===================================== */

    const listaFuncoes =
        Array.isArray(funcoes)
            ? funcoes
            : [];


    const listaDocumentos =
        Array.isArray(documentosGerados)
            ? documentosGerados
            : [];


    /* =====================================
       INDICADORES DE RISCO
    ===================================== */

    const totalRiscos =
        listaFuncoes.reduce(

            (total, funcao) =>

                total +
                (
                    Array.isArray(funcao.riscos)
                        ? funcao.riscos.length
                        : 0
                ),

            0

        );


    const riscosCompletos =
        listaFuncoes.reduce(

            (total, funcao) =>

                total +

                (
                    Array.isArray(funcao.riscos)

                        ? funcao.riscos.filter(
                            item => item.valido
                        ).length

                        : 0
                ),

            0

        );


    /* =====================================
       NOMES DOS CAMPOS
    ===================================== */

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

        numeroContrato:
            "Número do Contrato",

        vigenciaContrato:
            "Vigência do Contrato",

        descricaoAlteracao:
            "Descrição das Alterações",

        diretoria:
            "Diretoria",

        locaisAtuacao:
            "Locais de atuação do contrato",

        enderecoExecucao:
            "Endereço de execução",

        segmento:
            "Segmento",

        cnpjAtualizado:
            "CNPJ Atualizado",

        turnoTrabalho:
            "Turno de Trabalho",

        cnae:
            "CNAE da Atividade",

        ramoContratante:
            "Ramo da Atividade da Contratante",

        ramoUT:
            "Ramo da Atividade da UT",

        enderecoLocalidade:
            "Endereço da Localidade",

        nomeContratante:
            "Nome da Contratante",

        cnpjCliente:
            "CNPJ do Cliente",

        cnaeCliente:
            "CNAE do Cliente",

        grauRiscoContratante:
            "Grau de Risco da Contratante",

        grauRiscoContratada:
            "Grau de Risco da Contratada",

        objetoContrato:
            "Objeto do Contrato",

        abrangenciaContrato:
            "Abrangência do Contrato"

    };


    /* =====================================
       ALTERAÇÕES DO CADASTRO
    ===================================== */

    const alteracoesCadastro =

        cadastroAdministrativoPrimeiraSolicitacao
            ? []
            : Object.keys(
                dadosCadastro || {}
            )

            .filter((campo) => {

                if (
                    campo ===
                    "descricaoAlteracao"
                ) {

                    return false;

                }


                return (

                    dadosCadastroOriginal?.[campo] ??
                    ""

                ) !== (

                    dadosCadastro?.[campo] ??
                    ""

                );

            })

            .map((campo) => ({

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

            }));


    /* =====================================
       CONTROLE DO WORKFLOW
    ===================================== */

    const mostrarAnalise =
        etapaWorkflow === 2;


    const mostrarUploadPGR =
        etapaWorkflow === 3;


    const mostrarUploadPCMSO =
        etapaWorkflow === 4;


    const mostrarBiblioteca =
        etapaWorkflow >= 5;


    const mostrarEditarCorrecao =
        statusSolicitacao ===
        "Correção Solicitada";


    const motivoAtualDevolucao =
        motivoDevolucao ||
        "-";


    const mostrarCadastroAdministrativoCompleto =
        cadastroAdministrativoPrimeiraSolicitacao ||
        cadastroAdministrativoAlteradoNestaSolicitacao;


    /*
    =====================================
    IMPORTANTE

    Tudo que for ação interna da Engenharia
    só poderá aparecer para ADMIN.
    =====================================
    */

    const podeExecutarAcoes =
        ehAdministrador &&
        !ehUsuarioUT;


    const podeEditarCorrecaoUT =
        ehUsuarioUT &&
        statusSolicitacao ===
        "Correção Solicitada";

    const documentoPGRDisponibilizado =
        Array.isArray(
            dadosSolicitacaoCompleta?.documentos?.pgr
        ) &&
        dadosSolicitacaoCompleta.documentos.pgr.length > 0;

    const documentoPCMSODisponibilizado =
        Array.isArray(
            dadosSolicitacaoCompleta?.documentos?.pcmso
        ) &&
        dadosSolicitacaoCompleta.documentos.pcmso.length > 0;

    const possuiDocumentoPublicado =
        documentoPGRDisponibilizado &&
        documentoPCMSODisponibilizado;

    const [acompanhamentoCliente, setAcompanhamentoCliente] = useState({
        clienteExigePostagem: null,
        dataPostagemCliente: "",
        dataAguardandoRetorno: "",
        statusAprovacaoCliente: "",
        dataAprovacaoCliente: "",
        dataReprovacaoCliente: "",
        motivoReprovacaoCliente: ""
    });

    useEffect(() => {

        const clienteExigePostagem =
            dadosSolicitacaoCompleta?.clienteExigePostagem;

        const dataRespostaPostagem =
            dadosSolicitacaoCompleta?.dataRespostaPostagem;

        const dataPostagemCliente =
            dadosSolicitacaoCompleta?.dataPostagemCliente;

        const dataAguardandoRetorno =
            dadosSolicitacaoCompleta?.dataAguardandoRetorno;

        const statusAprovacaoCliente =
            dadosSolicitacaoCompleta?.statusAprovacaoCliente || "";

        const dataAprovacaoCliente =
            dadosSolicitacaoCompleta?.dataAprovacaoCliente;

        const dataReprovacaoCliente =
            dadosSolicitacaoCompleta?.dataReprovacaoCliente;

        const motivoReprovacaoCliente =
            dadosSolicitacaoCompleta?.motivoReprovacaoCliente || "";

        setAcompanhamentoCliente({
            clienteExigePostagem:
                clienteExigePostagem === undefined || clienteExigePostagem === null
                    ? null
                    : Boolean(clienteExigePostagem),
            dataRespostaPostagem:
                dataRespostaPostagem
                    ? formatarDataInput(dataRespostaPostagem)
                    : "",
            dataPostagemCliente:
                dataPostagemCliente
                    ? formatarDataInput(dataPostagemCliente)
                    : "",
            dataAguardandoRetorno:
                dataAguardandoRetorno
                    ? formatarDataInput(dataAguardandoRetorno)
                    : "",
            statusAprovacaoCliente,
            dataAprovacaoCliente:
                dataAprovacaoCliente
                    ? formatarDataInput(dataAprovacaoCliente)
                    : "",
            dataReprovacaoCliente:
                dataReprovacaoCliente
                    ? formatarDataInput(dataReprovacaoCliente)
                    : "",
            motivoReprovacaoCliente
        });

    }, [dadosSolicitacaoCompleta]);

    function formatarDataInput(valor) {

        if (!valor) {
            return "";
        }

        if (typeof valor === "string") {
            return valor.slice(0, 10);
        }

        if (valor?.toDate) {
            const data = valor.toDate();
            return data.toISOString().slice(0, 10);
        }

        const data = new Date(valor);

        if (Number.isNaN(data.getTime())) {
            return "";
        }

        return data.toISOString().slice(0, 10);

    }

    function formatarDataBrasileira(valor) {

        if (!valor) {
            return "";
        }

        const data =
            valor?.toDate
                ? valor.toDate()
                : new Date(valor);

        if (Number.isNaN(data.getTime())) {
            return "";
        }

        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(data);

    }

    const solicitacaoRelacionadaId =
        dadosSolicitacaoCompleta?.correcaoRelacionadaId ||
        dadosSolicitacaoCompleta?.solicitacaoOriginalId ||
        "";

    const solicitacaoRelacionadaProtocolo =
        dadosSolicitacaoCompleta?.correcaoRelacionadaProtocolo ||
        dadosSolicitacaoCompleta?.solicitacaoOriginalProtocolo ||
        "";

    const mostrarBlocoAcompanhamento =
        possuiDocumentoPublicado &&
        (
            statusSolicitacao !== "Correção Solicitada" &&
            statusSolicitacao !== "Em Análise Técnica"
        );

    const statusAprovacaoClientePersistido =
        String(dadosSolicitacaoCompleta?.statusAprovacaoCliente || "")
            .trim()
            .toLowerCase();

    const statusAprovacaoClienteNormalizado =
        String(acompanhamentoCliente.statusAprovacaoCliente || statusAprovacaoClientePersistido || "")
            .trim()
            .toLowerCase();

    const motivoReprovacaoClientePersistido =
        String(
            acompanhamentoCliente.motivoReprovacaoCliente ||
            dadosSolicitacaoCompleta?.motivoReprovacaoCliente ||
            ""
        ).trim();

    const dataReprovacaoClientePersistida =
        dadosSolicitacaoCompleta?.dataReprovacaoCliente ||
        acompanhamentoCliente.dataReprovacaoCliente ||
        "";

    const possuiCorrecaoRelacionada = Boolean(
        dadosSolicitacaoCompleta?.correcaoRelacionadaId ||
        dadosSolicitacaoCompleta?.correcaoRelacionadaProtocolo
    );

    const cicloOriginalEncerradoPorReprovacao =
        possuiCorrecaoRelacionada;

    const clienteAprovouDocumento =
        !cicloOriginalEncerradoPorReprovacao &&
        statusAprovacaoClienteNormalizado === "aprovado" &&
        Boolean(acompanhamentoCliente.dataAprovacaoCliente);

    const solicitacaoConcluida =
        !cicloOriginalEncerradoPorReprovacao &&
        (
            Boolean(dadosSolicitacaoCompleta?.concluidaEm) ||
            (
                statusAprovacaoClienteNormalizado === "aprovado" &&
                Boolean(dadosSolicitacaoCompleta?.dataAprovacaoCliente)
            )
        );

    const mostrarCampoDataPostagem =
        acompanhamentoCliente.clienteExigePostagem === true && !solicitacaoConcluida;

    const mostrarStatusAprovacao =
        mostrarCampoDataPostagem &&
        acompanhamentoCliente.dataPostagemCliente;

    const mostrarCampoDataAprovacao =
        acompanhamentoCliente.statusAprovacaoCliente === "aprovado" && !solicitacaoConcluida;

    const mostrarCampoMotivoReprovacao =
        acompanhamentoCliente.statusAprovacaoCliente === "reprovado" && !solicitacaoConcluida;

    const acompanhamentoClienteSomenteLeitura =
        possuiCorrecaoRelacionada;

    const podeEditarAcompanhamentoCliente =
        !solicitacaoConcluida &&
        !acompanhamentoClienteSomenteLeitura;

    const deveSalvarAcompanhamento =
        podeEditarAcompanhamentoCliente &&
        (
            acompanhamentoCliente.statusAprovacaoCliente === "aguardando" ||
            acompanhamentoCliente.statusAprovacaoCliente === "reprovado"
        );

    const deveConcluirSolicitacao =
        !solicitacaoConcluida &&
        acompanhamentoCliente.statusAprovacaoCliente === "aprovado" &&
        Boolean(acompanhamentoCliente.dataAprovacaoCliente) &&
        !acompanhamentoClienteSomenteLeitura;

    const textoStatusAvaliacao = useMemo(() => {

        const status =
            statusAprovacaoClienteNormalizado;

        if (status === "aguardando") {
            return "⏳ Aguardando aprovação do cliente";
        }

        if (status === "aprovado" && Boolean(acompanhamentoCliente.dataAprovacaoCliente)) {
            return "✅ Documento aprovado pelo cliente";
        }

        if (status === "reprovado") {
            return "🔴 Documento reprovado pelo cliente";
        }

        return "";

    }, [statusAprovacaoClienteNormalizado, acompanhamentoCliente.dataAprovacaoCliente]);

    async function salvarAcompanhamento(evento) {

        evento.preventDefault();

        if (solicitacaoConcluida || acompanhamentoClienteSomenteLeitura) {
            return;
        }

        if (acompanhamentoCliente.statusAprovacaoCliente === "reprovado") {
            const motivo = String(acompanhamentoCliente.motivoReprovacaoCliente || "").trim();

            if (!motivo) {
                alert("Descreva o motivo da reprovação do cliente antes de salvar.");
                return;
            }
        }

        if (!onSalvarAcompanhamentoCliente) {
            return;
        }

        await onSalvarAcompanhamentoCliente({
            ...acompanhamentoCliente,
            clienteExigePostagem:
                acompanhamentoCliente.clienteExigePostagem
        });

    }

    async function concluirSolicitacao(evento) {

        evento.preventDefault();

        if (acompanhamentoClienteSomenteLeitura || !onConcluirAcompanhamentoCliente) {
            return;
        }

        await onConcluirAcompanhamentoCliente({
            ...acompanhamentoCliente,
            clienteExigePostagem:
                acompanhamentoCliente.clienteExigePostagem
        });

    }

    return (

        <div className="ordemServico">


            {/* =====================================
                CABEÇALHO
            ===================================== */}

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

                            <br />

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


            {/* =====================================
                BARRA DE INFORMAÇÕES
            ===================================== */}

            {
                solicitacaoRelacionadaId && (
                    <section className="secaoResumo" style={{ marginTop: 20 }}>
                        <div className="tituloSecao">
                            🔗 Solicitação relacionada
                        </div>

                        <div className="fichaTecnica">
                            <div>
                                <span>Solicitação vinculada</span>
                                <strong>{solicitacaoRelacionadaProtocolo || solicitacaoRelacionadaId}</strong>
                            </div>

                            <div>
                                <span>Ação</span>
                                <strong>
                                    <button
                                        type="button"
                                        className="salvar"
                                        onClick={() => onAbrirRelacionada && onAbrirRelacionada(solicitacaoRelacionadaId)}
                                        style={{ marginTop: 0 }}
                                    >
                                        Abrir solicitação relacionada
                                    </button>
                                </strong>
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

                    <strong
                        className="statusEmPreenchimento"
                    >

                        {
                            statusSolicitacao ||
                            "-"
                        }

                    </strong>

                </div>


                <div>

                    <span>
                        PRAZO ESTIMADO
                    </span>

                    <strong>

                        PGR: 7 dias úteis

                        <br />

                        PCMSO: 7 dias após conclusão do PGR

                    </strong>

                </div>

            </section>


            {/* =====================================
                CORREÇÃO SOLICITADA
            ===================================== */}

            {
                mostrarEditarCorrecao && (

                    <section className="alertaCorrecaoCard">

                        <div className="alertaCorrecaoHeader">

                            <div className="alertaCorrecaoTituloWrap">

                                <span className="alertaCorrecaoIcone">
                                    ⚠️
                                </span>

                                <div>

                                    <h3>
                                        CORREÇÃO SOLICITADA
                                    </h3>

                                    {
                                        Number(
                                            totalDevolucoes
                                        ) > 0 && (

                                            <small>
                                                Devolução nº {totalDevolucoes}
                                            </small>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                        <div className="alertaCorrecaoConteudo">

                            <p className="alertaCorrecaoMensagem">
                                Sua solicitação precisa de ajustes antes de ser analisada novamente.
                            </p>

                            <div className="alertaCorrecaoMotivoWrap">

                                <span className="alertaCorrecaoLabel">
                                    Motivo da devolução
                                </span>

                                <div className="alertaCorrecaoMotivo">
                                    {
                                        motivoAtualDevolucao
                                    }
                                </div>

                            </div>

                            {
                                onEditarCorrecao && (

                                    <button
                                        type="button"
                                        className="alertaCorrecaoBotao"
                                        onClick={onEditarCorrecao}
                                    >
                                        ✏️ CORRIGIR SOLICITAÇÃO
                                    </button>

                                )
                            }

                        </div>

                    </section>

                )
            }


            {/* =====================================
                DADOS DA UNIDADE
            ===================================== */}

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
                                dadosCadastro
                                    ?.gerenteContrato
                                ||
                                "-"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>
                            🏢 Identificação da Unidade
                        </span>

                        <strong>

                            {
                                utSelecionada
                                    ?.numeroUT
                                ||
                                "-"
                            }

                            <br />

                            <small>

                                {
                                    utSelecionada
                                        ?.nomeUT
                                    ||
                                    "-"
                                }

                            </small>

                        </strong>

                    </div>


                    <div>

                        <span>
                            E-mail do Gerente
                        </span>

                        <strong>

                            {
                                dadosCadastro
                                    ?.emailGerente
                                ||
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


            {/* =====================================
                CADASTRO ADMINISTRATIVO PARA CONFERÊNCIA
            ===================================== */}

            {
                mostrarCadastroAdministrativoCompleto && (

                    <section className="secaoResumo">

                        <div className="tituloSecao">

                            🏢 Cadastro Administrativo

                        </div>

                        <div className="fichaTecnica">

                            {Object.entries(dadosCadastro || {})
                                .filter(([campo, valor]) =>
                                    campo !== "descricaoAlteracao" &&
                                    campo !== "atualizadoEm" &&
                                    valor !== undefined &&
                                    valor !== null &&
                                    String(valor).trim() !== ""
                                )
                                .map(([campo, valor]) => (

                                    <div key={campo}>

                                        <span>
                                            {nomesCampos[campo] || campo}
                                        </span>

                                        <strong>
                                            {typeof valor === "object"
                                                ? JSON.stringify(valor)
                                                : String(valor)}
                                        </strong>

                                    </div>

                                ))}

                        </div>

                        {cadastroAdministrativoAlteradoNestaSolicitacao && (

                            <div className="campoGrande" style={{ marginTop: 18 }}>

                                <span>
                                    🔄 Cadastro atualizado nesta solicitação
                                </span>

                                <strong>
                                    Os dados abaixo representam a versão atualizada enviada pela UT para conferência do ADMIN.
                                </strong>

                            </div>

                        )}

                    </section>

                )
            }


            {/* =====================================
                ALTERAÇÕES DO CADASTRO
            ===================================== */}

            {
                alteracoesCadastro.length > 0 && (

                    <section className="secaoResumo">

                        <div className="tituloSecao">

                            📝 Alterações do Cadastro Administrativo

                        </div>


                        {
                            dadosCadastro
                                .descricaoAlteracao && (

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
                                            dadosCadastro
                                                .descricaoAlteracao
                                        }

                                    </strong>

                                </div>

                            )
                        }


                        <div className="listaRiscosResumo">

                            {
                                alteracoesCadastro.map(
                                    (
                                        item,
                                        index
                                    ) => (

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


            {/* =====================================
                SOLICITAÇÃO
            ===================================== */}

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
                                listaDocumentos.length > 0

                                    ? listaDocumentos.join(
                                        " / "
                                    )

                                    : "-"
                            }

                        </strong>

                    </div>


                    <div className="campoGrande">

                        <span>
                            Motivo
                        </span>

                        <strong>

                            {
                                dadosSolicitacao
                                    ?.motivo
                                ||
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
                                dadosSolicitacao
                                    ?.descricao
                                ||
                                "-"
                            }

                        </strong>

                    </div>


                    {
                        tipoSolicitacao ===
                        "Lançamento LTCAT" && (

                            <>

                                <div>

                                    <span>
                                        Lançamento das medições
                                    </span>

                                    <strong>

                                        {
                                            lancamentoLTCAT
                                                ?.tipoLancamento ===
                                            "todos"

                                                ? "Todos os GHEs"

                                                : "GHEs específicos"
                                        }

                                    </strong>

                                </div>


                                {
                                    lancamentoLTCAT
                                        ?.tipoLancamento ===
                                    "especificos" && (

                                        <div className="campoGrande">

                                            <span>
                                                GHEs informados
                                            </span>

                                            <strong>

                                                {
                                                    lancamentoLTCAT
                                                        ?.ghes
                                                        ?.length > 0

                                                        ? lancamentoLTCAT
                                                            .ghes
                                                            .map(
                                                                (
                                                                    ghe,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        key={index}
                                                                    >
                                                                        {ghe}
                                                                    </div>

                                                                )
                                                            )

                                                        : "-"
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
                        "Revisão Anual" &&

                        revisaoAnual
                            ?.possuiAlteracao ===
                        "nao" && (

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
                            "Adequação" ||

                            tipoSolicitacao ===
                            "Correção"

                        ) && (

                            <div className="resumoItem">

                                <strong>
                                    Tipo da alteração:
                                </strong>

                                <span>

                                    {
                                        adequacaoCorrecao
                                            ?.tipoAlteracao ===
                                        "administrativo" &&

                                        "Dados Administrativos"
                                    }

                                    {
                                        adequacaoCorrecao
                                            ?.tipoAlteracao ===
                                        "tecnica" &&

                                        "Alteração Técnica"
                                    }

                                    {
                                        adequacaoCorrecao
                                            ?.tipoAlteracao ===
                                        "geral" &&

                                        "Dados Gerais"
                                    }

                                </span>

                            </div>

                        )
                    }


                    {
                        adequacaoCorrecao
                            ?.tipoAlteracao ===
                        "geral" &&

                        adequacaoCorrecao
                            ?.descricao && (

                            <div className="resumoItem">

                                <strong>
                                    Descrição:
                                </strong>

                                <span>

                                    {
                                        adequacaoCorrecao
                                            .descricao
                                    }

                                </span>

                            </div>

                        )
                    }

                </div>

            </section>


            {/* =====================================
                FUNÇÕES E RISCOS
            ===================================== */}

            {
                listaFuncoes.map(
                    (
                        funcao,
                        index
                    ) => (

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

                                                ? `Novo (${funcao.identificacaoGHE})`

                                                : funcao.identificacaoGHE
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

                                        {
                                            Array.isArray(funcao.riscos)
                                                ? funcao.riscos.length
                                                : 0
                                        }

                                    </strong>

                                </div>


                                <div className="indicadorResumo sucesso">

                                    <span>
                                        Completos
                                    </span>

                                    <strong>

                                        {
                                            Array.isArray(funcao.riscos)

                                                ? funcao.riscos.filter(
                                                    item =>
                                                        item.valido
                                                ).length

                                                : 0
                                        }

                                    </strong>

                                </div>


                                <div className="indicadorResumo alerta">

                                    <span>
                                        Pendentes
                                    </span>

                                    <strong>

                                        {
                                            Array.isArray(funcao.riscos)

                                                ? funcao.riscos.length -
                                                  funcao.riscos.filter(
                                                      item =>
                                                          item.valido
                                                  ).length

                                                : 0
                                        }

                                    </strong>

                                </div>


                            </div>


                            {
                                !Array.isArray(
                                    funcao.riscos
                                ) ||

                                funcao.riscos.length === 0

                                    ? (

                                        <div className="alertaCadastro">

                                            Nenhum risco cadastrado.

                                        </div>

                                    )

                                    : (

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
                                                                        RISCO {
                                                                            indiceRisco + 1
                                                                        }
                                                                    </small>

                                                                    <h3>
                                                                        {item.risco}
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
                                                                        {item.atividade}
                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>
                                                                        Forma de Exposição
                                                                    </label>

                                                                    <p>
                                                                        {item.contato}
                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>
                                                                        EPI
                                                                    </label>

                                                                    <p>
                                                                        {item.epi}
                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <label>
                                                                        CA
                                                                    </label>

                                                                    <p>
                                                                        {item.ca}
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
                                                                        {item.medidas}
                                                                    </p>

                                                                </div>


                                                            </div>


                                                            <div className="rodapeResumoRisco">

                                                                {
                                                                    item.valido

                                                                        ? (

                                                                            <span className="statusOk">

                                                                                ✔ Cadastro Completo

                                                                            </span>

                                                                        )

                                                                        : (

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


            {/* =====================================
                OBSERVAÇÕES DA ENGENHARIA
                SOMENTE ADMIN
            ===================================== */}

            {
                podeExecutarAcoes && (

                    <section className="secaoResumo">

                        <div className="tituloSecao">

                            💬 Observações da Engenharia

                        </div>


                        <div className="caixaDeclaracao">

                            <textarea

                                rows={6}

                                placeholder="Digite aqui as observações da análise técnica..."

                                style={{

                                    width: "100%",

                                    padding: "15px",

                                    borderRadius: "10px",

                                    border:
                                        "1px solid #d9d9d9",

                                    resize: "vertical",

                                    fontSize: "15px"

                                }}

                            />

                        </div>

                    </section>

                )
            }


            {/* =====================================
                FLUXO
                VISÍVEL PARA TODOS
            ===================================== */}

            <section className="secaoResumo">

                <div className="tituloSecao">

                    📈 Fluxo da Solicitação

                </div>


                <TimelineWorkflow

                    etapa={
                        etapaWorkflow || 2
                    }

                />

            </section>


            {/* =====================================
                ACOMPANHAMENTO NO PORTAL DO CLIENTE
            ===================================== */}

            {
                mostrarBlocoAcompanhamento && (

                    <section className="secaoResumo">

                        {
                            acompanhamentoClienteSomenteLeitura ? (
                                <>
                                    <div className="tituloSecao">
                                        📌 Acompanhamento do cliente — ciclo anterior
                                    </div>

                                    <div className="blocoAcompanhamentoCliente">
                                        <div className="mensagemAcompanhamentoStatus reprovado">
                                            🔴 Reprovado pelo cliente
                                        </div>

                                        <div className="campoAcompanhamentoCliente">
                                            <label>
                                                Motivo da reprovação:
                                            </label>
                                            <strong>
                                                {motivoReprovacaoClientePersistido || "-"}
                                            </strong>
                                        </div>

                                        <div className="campoAcompanhamentoCliente">
                                            <label>
                                                Data da reprovação:
                                            </label>
                                            <strong>
                                                {formatarDataBrasileira(dataReprovacaoClientePersistida) || "-"}
                                            </strong>
                                        </div>

                                        <div className="campoAcompanhamentoCliente">
                                            <label>
                                                Correção gerada:
                                            </label>
                                            <strong>
                                                {solicitacaoRelacionadaProtocolo || solicitacaoRelacionadaId || "-"}
                                            </strong>
                                        </div>

                                        <div className="acoesResumo acompanhamentoAcoes">
                                            <button
                                                type="button"
                                                className="salvar"
                                                onClick={() => onAbrirRelacionada && onAbrirRelacionada(solicitacaoRelacionadaId)}
                                            >
                                                Abrir solicitação relacionada
                                            </button>
                                        </div>

                                        <div className="mensagemAcompanhamentoStatus reprovado" style={{ marginTop: 10 }}>
                                            🔒 Este acompanhamento pertence ao ciclo anterior e não pode mais ser alterado.
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <form className="blocoAcompanhamentoCliente" onSubmit={salvarAcompanhamento}>

                                    <div className="tituloSecao">
                                        📌 Acompanhamento no portal do cliente
                                    </div>

                                    <div className="campoAcompanhamentoCliente">

                                        <label>
                                            Existe postagem em plataforma específica do cliente?
                                        </label>

                                        <div className="grupoOpcoesAcompanhamento">

                                            <label className="opcaoAcompanhamento">
                                                <input
                                                    type="radio"
                                                    name="clienteExigePostagem"
                                                    checked={acompanhamentoCliente.clienteExigePostagem === true}
                                                    disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                    onChange={() => setAcompanhamentoCliente((estado) => ({
                                                        ...estado,
                                                        clienteExigePostagem: true,
                                                        statusAprovacaoCliente: estado.statusAprovacaoCliente || "aguardando",
                                                        dataAguardandoRetorno: estado.dataAguardandoRetorno || new Date().toISOString().slice(0, 10),
                                                        dataRespostaPostagem: new Date().toISOString().slice(0, 10)
                                                    }))}
                                                />
                                                <span>Sim</span>
                                            </label>

                                            <label className="opcaoAcompanhamento">
                                                <input
                                                    type="radio"
                                                    name="clienteExigePostagem"
                                                    checked={acompanhamentoCliente.clienteExigePostagem === false}
                                                    disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                    onChange={() => setAcompanhamentoCliente((estado) => ({
                                                        ...estado,
                                                        clienteExigePostagem: false,
                                                        dataPostagemCliente: "",
                                                        dataAguardandoRetorno: "",
                                                        statusAprovacaoCliente: "",
                                                        dataAprovacaoCliente: "",
                                                        dataReprovacaoCliente: "",
                                                        motivoReprovacaoCliente: ""
                                                    }))}
                                                />
                                                <span>Não</span>
                                            </label>

                                        </div>

                                    </div>

                                    {
                                        acompanhamentoCliente.clienteExigePostagem === false && (
                                            <div className="mensagemAcompanhamentoSucesso">
                                                ✅ Não existe postagem em plataforma específica do cliente.
                                            </div>
                                        )
                                    }

                                    {
                                        mostrarCampoDataPostagem && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label htmlFor="dataPostagemCliente">
                                                    📅 Data da postagem na plataforma do cliente
                                                </label>
                                                <input
                                                    id="dataPostagemCliente"
                                                    type="date"
                                                    value={acompanhamentoCliente.dataPostagemCliente || ""}
                                                    disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                    onChange={(evento) => setAcompanhamentoCliente((estado) => ({
                                                        ...estado,
                                                        dataPostagemCliente: evento.target.value
                                                    }))}
                                                />
                                            </div>
                                        )
                                    }

                                    {
                                        mostrarStatusAprovacao && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label>
                                                    Status da aprovação do cliente
                                                </label>
                                                <div className="grupoOpcoesAcompanhamento">

                                                    <label className="opcaoAcompanhamento">
                                                        <input
                                                            type="radio"
                                                            name="statusAprovacaoCliente"
                                                            checked={acompanhamentoCliente.statusAprovacaoCliente === "aguardando"}
                                                            disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                            onChange={() => setAcompanhamentoCliente((estado) => ({
                                                                ...estado,
                                                                statusAprovacaoCliente: "aguardando",
                                                                dataAguardandoRetorno: new Date().toISOString().slice(0, 10),
                                                                dataAprovacaoCliente: "",
                                                                dataReprovacaoCliente: "",
                                                                motivoReprovacaoCliente: ""
                                                            }))}
                                                        />
                                                        <span>Aguardando retorno</span>
                                                    </label>

                                                    <label className="opcaoAcompanhamento">
                                                        <input
                                                            type="radio"
                                                            name="statusAprovacaoCliente"
                                                            checked={acompanhamentoCliente.statusAprovacaoCliente === "aprovado"}
                                                            disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                            onChange={() => setAcompanhamentoCliente((estado) => ({
                                                                ...estado,
                                                                statusAprovacaoCliente: "aprovado",
                                                                dataAguardandoRetorno: "",
                                                                dataAprovacaoCliente: estado.dataAprovacaoCliente || new Date().toISOString().slice(0, 10),
                                                                dataReprovacaoCliente: "",
                                                                motivoReprovacaoCliente: ""
                                                            }))}
                                                        />
                                                        <span>Aprovado</span>
                                                    </label>

                                                    <label className="opcaoAcompanhamento">
                                                        <input
                                                            type="radio"
                                                            name="statusAprovacaoCliente"
                                                            checked={acompanhamentoCliente.statusAprovacaoCliente === "reprovado"}
                                                            disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                            onChange={() => setAcompanhamentoCliente((estado) => ({
                                                                ...estado,
                                                                statusAprovacaoCliente: "reprovado",
                                                                dataAguardandoRetorno: "",
                                                                dataAprovacaoCliente: "",
                                                                dataReprovacaoCliente: estado.dataReprovacaoCliente || new Date().toISOString().slice(0, 10)
                                                            }))}
                                                        />
                                                        <span>Reprovado</span>
                                                    </label>

                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        mostrarCampoDataAprovacao && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label htmlFor="dataAprovacaoCliente">
                                                    📅 Data da aprovação do cliente
                                                </label>
                                                <input
                                                    id="dataAprovacaoCliente"
                                                    type="date"
                                                    value={acompanhamentoCliente.dataAprovacaoCliente || ""}
                                                    disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                    onChange={(evento) => setAcompanhamentoCliente((estado) => ({
                                                        ...estado,
                                                        dataAprovacaoCliente: evento.target.value
                                                    }))}
                                                />
                                            </div>
                                        )
                                    }

                                    {
                                        mostrarCampoMotivoReprovacao && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label htmlFor="motivoReprovacaoCliente">
                                                    Descreva os motivos da reprovação do cliente
                                                </label>
                                                <textarea
                                                    id="motivoReprovacaoCliente"
                                                    rows={5}
                                                    value={acompanhamentoCliente.motivoReprovacaoCliente || ""}
                                                    disabled={solicitacaoConcluida || acompanhamentoClienteSomenteLeitura}
                                                    onChange={(evento) => setAcompanhamentoCliente((estado) => ({
                                                        ...estado,
                                                        motivoReprovacaoCliente: evento.target.value
                                                    }))}
                                                    placeholder="Descreva os motivos da reprovação do cliente"
                                                />
                                            </div>
                                        )
                                    }

                                    {
                                        !solicitacaoConcluida && (
                                            acompanhamentoCliente.statusAprovacaoCliente === "reprovado" &&
                                            acompanhamentoCliente.motivoReprovacaoCliente && (
                                                <div className="mensagemAcompanhamentoStatus reprovado">
                                                    🔴 Documento reprovado pelo cliente
                                                </div>
                                            )
                                        )
                                    }

                                    {
                                        clienteAprovouDocumento && (
                                            <div className="mensagemAcompanhamentoStatus">
                                                ✅ Documento aprovado pelo cliente
                                            </div>
                                        )
                                    }

                                    {
                                        clienteAprovouDocumento && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label>
                                                    Data da aprovação:
                                                </label>
                                                <strong>
                                                    {formatarDataBrasileira(
                                                        dadosSolicitacaoCompleta?.dataAprovacaoCliente
                                                    ) || "-"}
                                                </strong>
                                            </div>
                                        )
                                    }

                                    {
                                        solicitacaoConcluida && (
                                            <div className="campoAcompanhamentoCliente">
                                                <label>
                                                    Solicitação concluída em:
                                                </label>
                                                <strong>
                                                    {formatarDataBrasileira(
                                                        dadosSolicitacaoCompleta?.concluidaEm
                                                    ) || "-"}
                                                </strong>
                                            </div>
                                        )
                                    }

                                    {
                                        !solicitacaoConcluida &&
                                            !acompanhamentoClienteSomenteLeitura && (
                                                acompanhamentoCliente.statusAprovacaoCliente === "reprovado" &&
                                                onAvancarParaCorrecao && (
                                                    <div className="acoesResumo acompanhamentoAcoes">
                                                        <button
                                                            type="button"
                                                            className="salvar"
                                                            onClick={() => onAvancarParaCorrecao(acompanhamentoCliente.motivoReprovacaoCliente)}
                                                        >
                                                            AVANÇAR PARA CORREÇÃO
                                                        </button>
                                                    </div>
                                                )
                                            )
                                    }

                                    {
                                        !solicitacaoConcluida && (
                                            onSalvarAcompanhamentoCliente &&
                                            deveSalvarAcompanhamento && (
                                                <div className="acoesResumo acompanhamentoAcoes">
                                                    <button type="submit" className="salvar">
                                                        Salvar acompanhamento
                                                    </button>
                                                </div>
                                            )
                                        )
                                    }

                                    {
                                        !solicitacaoConcluida &&
                                            onConcluirAcompanhamentoCliente &&
                                            deveConcluirSolicitacao && (
                                                <div className="acoesResumo acompanhamentoAcoes">
                                                    <button type="button" className="salvar" onClick={concluirSolicitacao}>
                                                        ✅ CONCLUIR SOLICITAÇÃO
                                                    </button>
                                                </div>
                                            )
                                    }

                                </form>
                            )
                        }

                    </section>

                )
            }

            {/* =====================================
                RODAPÉ / AÇÕES
                SOMENTE ADMIN
            ===================================== */}

            {
                (
                    podeExecutarAcoes ||
                    podeEditarCorrecaoUT
                ) && (

                    <footer className="rodapeResumo">


                        {/* ============================
                            EDITAR CORREÇÃO
                        ============================ */}

                        {
                            mostrarEditarCorrecao &&
                            onEditarCorrecao && (

                                <div className="acoesResumo">

                                    <button

                                        type="button"

                                        className="salvar"

                                        onClick={
                                            onEditarCorrecao
                                        }

                                    >

                                        ✏️ {
                                            ehAdministrador
                                                ? "Editar Correção"
                                                : "Corrigir Solicitação"
                                        }

                                    </button>

                                </div>

                            )
                        }


                        {/* ============================
                            ANÁLISE TÉCNICA
                        ============================ */}

                        {
                            podeExecutarAcoes &&
                            mostrarAnalise && (

                                <div className="acoesResumo">

                                    <button

                                        type="button"

                                        className="cancelar"

                                        onClick={
                                            onDevolver
                                        }

                                    >

                                        🔴 Devolver para Correção

                                    </button>


                                    <button

                                        type="button"

                                        className="salvar"

                                        onClick={
                                            onDarAceite
                                        }

                                    >

                                        🟢 Dar Aceite

                                    </button>

                                </div>

                            )
                        }


                        {/* ============================
                            PUBLICAR PGR
                        ============================ */}

                        {
                            mostrarUploadPGR && (

                                <PublicarDocumento

                                    titulo="PGR"

                                    onPublicar={
                                        (documento) =>
                                            onEnviarDocumento(
                                                "pgr",
                                                documento
                                            )
                                    }

                                />

                            )
                        }


                        {/* ============================
                            PUBLICAR PCMSO
                        ============================ */}

                        {
                            mostrarUploadPCMSO && (

                                <PublicarDocumento

                                    titulo="PCMSO"

                                    onPublicar={
                                        (documento) =>
                                            onEnviarDocumento(
                                                "pcmso",
                                                documento
                                            )
                                    }

                                />

                            )
                        }


                        {/* ============================
                            BIBLIOTECA
                        ============================ */}

                        {
                            mostrarBiblioteca && (

                                <div className="acoesResumo">

                                    <button

                                        type="button"

                                        className="salvar"

                                    >

                                        📚 Publicar na Biblioteca

                                    </button>

                                </div>

                            )
                        }


                    </footer>

                )
            }


        </div>

    );

}


export default ResumoSolicitacaoVisualizacao;