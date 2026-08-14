import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./EditarSolicitacao.css";

import SelecaoUT
    from "../sections/SelecaoUT";

import AlteracaoCadastro
    from "../sections/AlteracaoCadastro";

import TipoSolicitacao
    from "../sections/TipoSolicitacao";

import DadosSolicitacao
    from "../sections/DadosSolicitacao";

import DadosFuncao
    from "../sections/DadosFuncao";

import CadastroRiscos
    from "../sections/CadastroRiscos";

import LancamentoLTCAT
    from "../sections/LancamentoLTCAT";

import RevisaoAnual
    from "../sections/RevisaoAnual";

import AdequacaoCorrecao
    from "../sections/AdequacaoCorrecao";

import DadosGerais
    from "../sections/DadosGerais";

import ResumoSolicitacao
    from "../../../components/resumoSolicitacao/ResumoSolicitacao";

import {
    buscarSolicitacao,
    atualizarSolicitacaoCorrecao
} from "../../../services/solicitacoesService";


function EditarSolicitacao() {

    const { id } = useParams();

    const navigate =
        useNavigate();


    /* =========================
       CONTROLE
    ========================= */

    const [etapa, setEtapa] =
        useState(1);

    const [loading, setLoading] =
        useState(true);


    /* =========================
       UNIDADE
    ========================= */

    const [
        utSelecionada,
        setUtSelecionada
    ] = useState(null);

    const [
        cadastroAdministrativo,
        setCadastroAdministrativo
    ] = useState(null);

    const [
        houveAlteracaoCadastro,
        setHouveAlteracaoCadastro
    ] = useState("");

    const [
        dadosCadastroOriginal,
        setDadosCadastroOriginal
    ] = useState({});

    const [
        dadosCadastro,
        setDadosCadastro
    ] = useState({});


    /* =========================
       SOLICITAÇÃO
    ========================= */

    const [
        tipoSolicitacao,
        setTipoSolicitacao
    ] = useState("");

    const [
        documentosGerados,
        setDocumentosGerados
    ] = useState([]);

    const [
        dadosSolicitacao,
        setDadosSolicitacao
    ] = useState({});


    /* =========================
       FUNÇÃO
    ========================= */

    const [
        dadosFuncao,
        setDadosFuncao
    ] = useState({

        colaborador: "",

        emContratacao: false,

        funcao: "",

        setor: "",

        tipoGHE: "",

        identificacaoGHE: "",

        descricaoAtividade: "",

        descricaoLocal: "",

        riscos: []

    });


    const [
        funcoes,
        setFuncoes
    ] = useState([]);


    /* =========================
       OUTROS
    ========================= */

    const [
        protocolo,
        setProtocolo
    ] = useState("");

    const [
        statusSolicitacao,
        setStatusSolicitacao
    ] = useState(
        "Correção Solicitada"
    );

    const [
        aceite,
        setAceite
    ] = useState(false);


    const [
        revisaoAnual,
        setRevisaoAnual
    ] = useState({

        possuiAlteracao: ""

    });


    const [
        lancamentoLTCAT,
        setLancamentoLTCAT
    ] = useState({

        tipoLancamento: "",

        gheAtual: "",

        ghes: []

    });


    const [
        adequacaoCorrecao,
        setAdequacaoCorrecao
    ] = useState({

        tipoAlteracao: "",

        descricao: ""

    });


    /* =========================
       CARREGAR SOLICITAÇÃO
    ========================= */

    useEffect(() => {

        carregarSolicitacao();

    }, [id]);


    async function carregarSolicitacao() {

        try {

            setLoading(true);


            const dados =
                await buscarSolicitacao(id);


            console.log(
                "SOLICITAÇÃO CARREGADA:",
                dados
            );


            /* =========================
               SEGURANÇA
            ========================= */

            if (
                dados.status !==
                "Correção Solicitada"
            ) {

                alert(
                    "Esta solicitação não está aguardando correção."
                );


                navigate(
                    `/solicitacoes/${id}`
                );


                return;

            }


            /* =========================
               DADOS PRINCIPAIS
            ========================= */

            setProtocolo(
                dados.protocolo || ""
            );


            setStatusSolicitacao(
                dados.status ||
                "Correção Solicitada"
            );


            setAceite(
                dados.aceite || false
            );


            /* =========================
               CADASTRO ORIGINAL
            ========================= */

            const cadastro =
                dados.dadosCadastro || {};


            /*
            =================================
            RECUPERAR NÚMERO DA UT
            =================================
            */

            const numeroUT =

                cadastro.numeroUT ||

                dados.ut ||

                dados.numeroUT ||

                cadastro.ut ||

                "";


            /*
            =================================
            RECUPERAR NOME DA UT
            =================================
            */

            const nomeUT =

                cadastro.nomeUT ||

                dados.nomeUT ||

                cadastro.nome ||

                "";


            /*
            =================================
            RECUPERAR CLIENTE
            =================================
            */

            const cliente =

                cadastro.cliente ||

                dados.cliente ||

                "";


            /*
            =================================
            RECUPERAR CIDADE
            =================================
            */

            const cidade =

                cadastro.cidade ||

                dados.cidade ||

                "";


            /*
            =================================
            RECUPERAR ESTADO
            =================================
            */

            const estado =

                cadastro.estado ||

                dados.estado ||

                "";


            /*
            =================================
            CADASTRO COMPLETO
            =================================
            */

            const cadastroCompleto = {

                ...cadastro,

                numeroUT:
                    numeroUT,

                nomeUT:
                    nomeUT,

                cliente:
                    cliente,

                cidade:
                    cidade,

                estado:
                    estado,

                gerenteContrato:

                    cadastro.gerenteContrato ||

                    dados.gerenteContrato ||

                    "",

                emailGerente:

                    cadastro.emailGerente ||

                    dados.emailGerente ||

                    ""

            };


            console.log(
                "CADASTRO DA CORREÇÃO:",
                cadastroCompleto
            );


            console.log(
                "NÚMERO DA UT DA CORREÇÃO:",
                numeroUT
            );


            /* =========================
               VALIDAÇÃO DA UT
            ========================= */

            if (!numeroUT) {

                console.error(
                    "ATENÇÃO: a solicitação não possui número da UT.",
                    {
                        id,
                        dados,
                        cadastro
                    }
                );

            }


            /* =========================
               DEFINIR CADASTRO
            ========================= */

            setCadastroAdministrativo(
                cadastroCompleto
            );


            setDadosCadastro(
                cadastroCompleto
            );


            setDadosCadastroOriginal(
                cadastroCompleto
            );


            /* =========================
               DEFINIR UT SELECIONADA
            ========================= */

            const utInicial = {

                numeroUT:
                    numeroUT,

                nomeUT:
                    nomeUT,

                cliente:
                    cliente,

                cidade:
                    cidade,

                estado:
                    estado

            };


            console.log(
                "UT SELECIONADA NA CORREÇÃO:",
                utInicial
            );


            setUtSelecionada(
                utInicial
            );


            /* =========================
               SOLICITAÇÃO
            ========================= */

            setTipoSolicitacao(
                dados.tipoSolicitacao ||
                ""
            );


            setDocumentosGerados(

                Array.isArray(
                    dados.documentosGerados
                )

                    ? dados.documentosGerados

                    : []

            );


            setDadosSolicitacao(

                dados.dadosSolicitacao ||
                {}

            );


            /* =========================
               FUNÇÕES
            ========================= */

            const funcoesCarregadas =

                Array.isArray(
                    dados.funcoes
                )

                    ? dados.funcoes

                    : [];


            setFuncoes(
                funcoesCarregadas
            );


            if (
                funcoesCarregadas.length >
                0
            ) {

                setDadosFuncao(
                    funcoesCarregadas[
                        funcoesCarregadas.length - 1
                    ]
                );

            }


            /* =========================
               LTCAT
            ========================= */

            setLancamentoLTCAT(

                dados.lancamentoLTCAT ||

                {

                    tipoLancamento: "",

                    gheAtual: "",

                    ghes: []

                }

            );


            /* =========================
               REVISÃO ANUAL
            ========================= */

            setRevisaoAnual(

                dados.revisaoAnual ||

                {

                    possuiAlteracao: ""

                }

            );


            /* =========================
               ADEQUAÇÃO / CORREÇÃO
            ========================= */

            setAdequacaoCorrecao(

                dados.adequacaoCorrecao ||

                {

                    tipoAlteracao: "",

                    descricao: ""

                }

            );

        }

        catch (erro) {

            console.error(
                "Erro ao carregar solicitação:",
                erro
            );


            alert(
                "Erro ao carregar a solicitação."
            );


            navigate(-1);

        }

        finally {

            setLoading(false);

        }

    }


    /* =========================
       ENVIAR CORREÇÃO
    ========================= */

    async function onEnviar() {

        try {

            /*
            =================================
            GARANTIR NÚMERO DA UT
            =================================
            */

            const numeroUT =

                utSelecionada?.numeroUT ||

                dadosCadastro?.numeroUT;


            if (!numeroUT) {

                alert(
                    "Não foi possível identificar a Unidade de Trabalho desta solicitação."
                );


                console.error(
                    "UT não identificada:",
                    {

                        utSelecionada,

                        dadosCadastro

                    }
                );


                return;

            }


            /*
            =================================
            GARANTIR DADOS DA UT NO CADASTRO
            =================================
            */

            const cadastroFinal = {

                ...dadosCadastro,

                numeroUT:

                    numeroUT

            };


            console.log(
                "CADASTRO FINAL DA CORREÇÃO:",
                cadastroFinal
            );


            await atualizarSolicitacaoCorrecao(

                id,

                {

                    dadosCadastro:
                        cadastroFinal,

                    tipoSolicitacao,

                    documentosGerados,

                    dadosSolicitacao,

                    lancamentoLTCAT,

                    revisaoAnual,

                    adequacaoCorrecao,

                    funcoes

                }

            );


            alert(
                "Correção enviada com sucesso! A solicitação voltou para Análise Técnica."
            );


            navigate(
                `/solicitacoes/${id}`
            );

        }

        catch (erro) {

            console.error(
                "Erro ao enviar correção:",
                erro
            );


            alert(
                "Erro ao enviar a correção."
            );

        }

    }


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="editarSolicitacaoLoading">

                <h2>

                    Carregando solicitação...

                </h2>

            </div>

        );

    }


    /* =========================
       TELA
    ========================= */

    return (

        <div className="solicitacoes">


            <div className="cabecalho">

                <h1>

                    Editar Correção

                </h1>


                <p>

                    Protocolo:{" "}

                    <strong>

                        {protocolo}

                    </strong>

                </p>


                <p>

                    Corrija as informações solicitadas
                    pela Engenharia e envie novamente
                    para análise técnica.

                </p>

            </div>


            {/* ==========================
                ETAPA 1
            ========================== */}

            {

                etapa === 1 && (

                    <>

                        <SelecaoUT

    utSelecionada={
        utSelecionada
    }

    setUtSelecionada={
        setUtSelecionada
    }

    cadastroAdministrativo={
        cadastroAdministrativo
    }

    setCadastroAdministrativo={
        setCadastroAdministrativo
    }

    dadosCadastro={
        dadosCadastro
    }

    setDadosCadastro={
        setDadosCadastro
    }

    setDadosCadastroOriginal={
        setDadosCadastroOriginal
    }

    bloquearSelecao={true}

/>


                        <AlteracaoCadastro

                            utSelecionada={
                                utSelecionada
                            }

                            cadastroAdministrativo={
                                cadastroAdministrativo
                            }

                            houveAlteracaoCadastro={
                                houveAlteracaoCadastro
                            }

                            setHouveAlteracaoCadastro={
                                setHouveAlteracaoCadastro
                            }

                            dadosCadastro={
                                dadosCadastro
                            }

                            setDadosCadastro={
                                setDadosCadastro
                            }

                            setEtapa={
                                setEtapa
                            }

                        />

                    </>

                )

            }


            {/* ==========================
                ETAPA 2
            ========================== */}

            {

                etapa === 2 && (

                    <TipoSolicitacao

                        tipoSolicitacao={
                            tipoSolicitacao
                        }

                        setTipoSolicitacao={
                            setTipoSolicitacao
                        }

                        documentosGerados={
                            documentosGerados
                        }

                        setDocumentosGerados={
                            setDocumentosGerados
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                ETAPA 3
            ========================== */}

            {

                etapa === 3 && (

                    <DadosSolicitacao

                        tipoSolicitacao={
                            tipoSolicitacao
                        }

                        dadosSolicitacao={
                            dadosSolicitacao
                        }

                        setDadosSolicitacao={
                            setDadosSolicitacao
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                ETAPA 4
            ========================== */}

            {

                etapa === 4 && (

                    <DadosFuncao

                        dadosFuncao={
                            dadosFuncao
                        }

                        setDadosFuncao={
                            setDadosFuncao
                        }

                        setEtapa={
                            setEtapa
                        }

                        permitirNovoGHE={

                            !(

                                (

                                    tipoSolicitacao ===
                                    "Adequação"

                                    ||

                                    tipoSolicitacao ===
                                    "Correção"

                                )

                                &&

                                adequacaoCorrecao
                                    ?.tipoAlteracao ===
                                "tecnica"

                            )

                        }

                    />

                )

            }


            {/* ==========================
                ETAPA 5
            ========================== */}

            {

                etapa === 5 && (

                    <CadastroRiscos

                        dadosFuncao={
                            dadosFuncao
                        }

                        setDadosFuncao={
                            setDadosFuncao
                        }

                        funcoes={
                            funcoes
                        }

                        setFuncoes={
                            setFuncoes
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                LTCAT
            ========================== */}

            {

                etapa === 5.5 && (

                    <LancamentoLTCAT

                        lancamentoLTCAT={
                            lancamentoLTCAT
                        }

                        setLancamentoLTCAT={
                            setLancamentoLTCAT
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                REVISÃO ANUAL
            ========================== */}

            {

                etapa === 5.6 && (

                    <RevisaoAnual

                        revisaoAnual={
                            revisaoAnual
                        }

                        setRevisaoAnual={
                            setRevisaoAnual
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                ADEQUAÇÃO / CORREÇÃO
            ========================== */}

            {

                etapa === 5.7 && (

                    <AdequacaoCorrecao

                        adequacaoCorrecao={
                            adequacaoCorrecao
                        }

                        setAdequacaoCorrecao={
                            setAdequacaoCorrecao
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                DADOS GERAIS
            ========================== */}

            {

                etapa === 5.8 && (

                    <DadosGerais

                        adequacaoCorrecao={
                            adequacaoCorrecao
                        }

                        setAdequacaoCorrecao={
                            setAdequacaoCorrecao
                        }

                        setEtapa={
                            setEtapa
                        }

                    />

                )

            }


            {/* ==========================
                ETAPA 6
            ========================== */}

            {

                etapa === 6 && (

                    <ResumoSolicitacao

                        utSelecionada={
                            utSelecionada
                        }

                        cadastroAdministrativo={
                            cadastroAdministrativo
                        }

                        dadosCadastroOriginal={
                            dadosCadastroOriginal
                        }

                        dadosCadastro={
                            dadosCadastro
                        }

                        tipoSolicitacao={
                            tipoSolicitacao
                        }

                        documentosGerados={
                            documentosGerados
                        }

                        dadosSolicitacao={
                            dadosSolicitacao
                        }

                        lancamentoLTCAT={
                            lancamentoLTCAT
                        }

                        revisaoAnual={
                            revisaoAnual
                        }

                        adequacaoCorrecao={
                            adequacaoCorrecao
                        }

                        funcoes={
                            funcoes
                        }

                        protocolo={
                            protocolo
                        }

                        statusSolicitacao={
                            statusSolicitacao
                        }

                        etapaWorkflow={
                            2
                        }

                        aceite={
                            aceite
                        }

                        setAceite={
                            setAceite
                        }

                        setEtapa={
                            setEtapa
                        }

                        onEnviar={
                            onEnviar
                        }

                    />

                )

            }


        </div>

    );

}


export default EditarSolicitacao;