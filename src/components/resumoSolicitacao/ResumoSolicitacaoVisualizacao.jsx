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

    onDarAceite,

    onDevolver,

    onEnviarDocumento,

    onEditarCorrecao,

    ehUsuarioUT = false,

    ehAdministrador = false

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

        Object.keys(
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
                RODAPÉ / AÇÕES
                SOMENTE ADMIN
            ===================================== */}

            {
                podeExecutarAcoes && (

                    <footer className="rodapeResumo">


                        {/* ============================
                            EDITAR CORREÇÃO
                        ============================ */}

                        {
                            mostrarEditarCorrecao && (

                                <div className="acoesResumo">

                                    <button

                                        type="button"

                                        className="salvar"

                                        onClick={
                                            onEditarCorrecao
                                        }

                                    >

                                        ✏️ Editar Correção

                                    </button>

                                </div>

                            )
                        }


                        {/* ============================
                            ANÁLISE TÉCNICA
                        ============================ */}

                        {
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