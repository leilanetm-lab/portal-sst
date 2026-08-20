import { useState } from "react";

import "./NovaSolicitacao.css";

import SelecaoUT from "../sections/SelecaoUT";
import AlteracaoCadastro from "../sections/AlteracaoCadastro";
import TipoSolicitacao from "../sections/TipoSolicitacao";
import DadosSolicitacao from "../sections/DadosSolicitacao";
import DadosFuncao from "../sections/DadosFuncao";
import CadastroRiscos from "../sections/CadastroRiscos";
import LancamentoLTCAT from "../sections/LancamentoLTCAT";
import RevisaoAnual from "../sections/RevisaoAnual";
import AdequacaoCorrecao from "../sections/AdequacaoCorrecao";
import DadosGerais from "../sections/DadosGerais";

import ResumoSolicitacao
    from "../../../components/resumoSolicitacao/ResumoSolicitacao";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    runTransaction
} from "firebase/firestore";

import {
    auth,
    db
} from "../../../firebase/firebaseConfig";

import {
    notificarAdministradores
} from "../../../services/notificacoesService";


function Solicitacoes() {


    // =====================================
    // CONTROLE DAS ETAPAS
    // =====================================

    const [
        etapa,
        setEtapa
    ] = useState(1);


    // =====================================
    // UNIDADE
    // =====================================

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


    // =====================================
    // TIPO DA SOLICITAÇÃO
    // =====================================

    const [
        tipoSolicitacao,
        setTipoSolicitacao
    ] = useState("");


    const [
        documentosGerados,
        setDocumentosGerados
    ] = useState([]);


    // =====================================
    // DADOS DA SOLICITAÇÃO
    // =====================================

    const [
        dadosSolicitacao,
        setDadosSolicitacao
    ] = useState({});


    // =====================================
    // DADOS DA FUNÇÃO
    // =====================================

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


    const [
        protocolo,
        setProtocolo
    ] = useState("");


    const [
        statusSolicitacao,
        setStatusSolicitacao
    ] = useState(
        "Em preenchimento"
    );


    const [
        aceite,
        setAceite
    ] = useState(false);


    // =====================================
    // CONTROLE DO ENVIO
    // Impede duplo clique / duplo envio
    // =====================================

    const [
        enviando,
        setEnviando
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


    // =====================================
    // ENVIO DA SOLICITAÇÃO
    // =====================================

    const onEnviar = async () => {


        // =====================================
        // BLOQUEAR DUPLO ENVIO
        // =====================================

        if (enviando) {

            return;

        }


        // Ativa o bloqueio imediatamente
        setEnviando(true);


        try {


            // =====================================
            // USUÁRIO LOGADO
            // =====================================

            const usuarioLogado =
                auth.currentUser;


            if (!usuarioLogado) {

                alert(
                    "Usuário não autenticado."
                );

                setEnviando(false);

                return;

            }


            console.log(
                "Usuário que está criando a solicitação:",
                usuarioLogado.uid
            );


            // =====================================
            // BUSCAR PERFIL DO USUÁRIO
            // =====================================

            const usuarioRef =
                doc(
                    db,
                    "Usuarios",
                    usuarioLogado.uid
                );


            const usuarioDoc =
                await getDoc(
                    usuarioRef
                );


            if (
                !usuarioDoc.exists()
            ) {

                alert(
                    "Cadastro do usuário não encontrado."
                );

                setEnviando(false);

                return;

            }


            const dadosUsuario =
                usuarioDoc.data();


            console.log(
                "Perfil do usuário:",
                dadosUsuario
            );


            // =====================================
            // GERAR PROTOCOLO
            // =====================================

            const contadorRef =
                doc(
                    db,
                    "Contadores",
                    "protocolos"
                );


            const protocoloGerado =
                await runTransaction(

                    db,

                    async (
                        transaction
                    ) => {


                        const contadorDoc =
                            await transaction.get(
                                contadorRef
                            );


                        const ultimoNumero =
                            contadorDoc.exists()

                                ?

                                (
                                    contadorDoc.data()
                                        .ultimoNumero || 0
                                )

                                :

                                0;


                        const proximoNumero =
                            ultimoNumero + 1;


                        /*
                        =====================================
                        SE O CONTADOR EXISTIR,
                        ATUALIZA.

                        SE NÃO EXISTIR,
                        CRIA.
                        =====================================
                        */

                        transaction.set(

                            contadorRef,

                            {

                                ultimoNumero:
                                    proximoNumero

                            },

                            {

                                merge: true

                            }

                        );


                        return (

                            `OS-${new Date().getFullYear()}-${String(
                                proximoNumero
                            ).padStart(
                                6,
                                "0"
                            )}`

                        );

                    }

                );


            console.log(
                "Protocolo gerado:",
                protocoloGerado
            );


            // =====================================
            // SALVAR SOLICITAÇÃO
            // =====================================

            const solicitacaoRef =
                await addDoc(

                    collection(
                        db,
                        "Solicitacoes"
                    ),

                    {


                        // =====================================
                        // PROTOCOLO
                        // =====================================

                        protocolo:
                            protocoloGerado,


                        // =====================================
                        // CONTROLE
                        // =====================================

                        status:
                            "Em Análise Técnica",

                        etapaWorkflow:
                            2,

                        criadoEm:
                            serverTimestamp(),


                        // =====================================
                        // USUÁRIO QUE CRIOU
                        // =====================================

                        criadoPorUid:
                            usuarioLogado.uid,

                        criadoPorEmail:
                            usuarioLogado.email || "",

                        criadoPorNome:

                            dadosUsuario.nomeUT ||

                            dadosUsuario.nome ||

                            "Usuário",


                        // =====================================
                        // ACEITE
                        // =====================================

                        aceite,

                        aceiteEm:
                            serverTimestamp(),


                        // =====================================
                        // UNIDADE
                        // =====================================

                        ut:
                            dadosCadastro.numeroUT ||
                            "",

                        cliente:
                            dadosCadastro.cliente ||
                            "",

                        cidade:
                            dadosCadastro.cidade ||
                            "",

                        gerenteContrato:
                            dadosCadastro.gerenteContrato ||
                            "",

                        emailGerente:
                            dadosCadastro.emailGerente ||
                            "",


                        // =====================================
                        // SOLICITAÇÃO
                        // =====================================

                        tipoSolicitacao,

                        documentosGerados,


                        // =====================================
                        // DADOS DA SOLICITAÇÃO
                        // =====================================

                        dadosSolicitacao,


                        // =====================================
                        // LANÇAMENTO LTCAT
                        // =====================================

                        lancamentoLTCAT,

                        tipoLancamentoLTCAT:

                            lancamentoLTCAT.tipoLancamento ===
                            "todos"

                                ?

                                "Todos os GHEs"

                                :

                                "GHEs específicos",


                        // =====================================
                        // REVISÃO ANUAL
                        // =====================================

                        revisaoAnual,

                        tipoRevisao:

                            revisaoAnual.possuiAlteracao ===
                            "nao"

                                ?

                                "Apenas atualização da vigência"

                                :

                                revisaoAnual.possuiAlteracao ===
                                "sim"

                                    ?

                                    "Alteração técnica"

                                    :

                                    "",


                        // =====================================
                        // ADEQUAÇÃO / CORREÇÃO
                        // =====================================

                        adequacaoCorrecao,

                        tipoAlteracao:

                            adequacaoCorrecao.tipoAlteracao ===
                            "administrativo"

                                ?

                                "Dados Administrativos"

                                :

                                adequacaoCorrecao.tipoAlteracao ===
                                "tecnica"

                                    ?

                                    "Alteração Técnica"

                                    :

                                    adequacaoCorrecao.tipoAlteracao ===
                                    "geral"

                                        ?

                                        "Dados Gerais"

                                        :

                                        "",


                        // =====================================
                        // FUNÇÕES
                        // =====================================

                        funcoes,


                        // =====================================
                        // CADASTRO ADMINISTRATIVO
                        // =====================================

                        dadosCadastro

                    }

                );


            console.log(
                "Solicitação salva:",
                solicitacaoRef.id
            );


            // =====================================
            // NOTIFICAR ADMINISTRADORES
            // =====================================

            if (
                dadosUsuario.perfil ===
                "UT"
            ) {


                const nomeUnidade =

                    dadosUsuario.nomeUT ||

                    dadosUsuario.nome ||

                    dadosCadastro.nomeUT ||

                    dadosCadastro.numeroUT ||

                    "A Unidade";


                console.log(
                    "Enviando notificação aos administradores..."
                );


                await notificarAdministradores({

                    solicitacaoId:
                        solicitacaoRef.id,

                    protocolo:
                        protocoloGerado,

                    titulo:
                        "Nova solicitação recebida",

                    mensagem:

                        `${nomeUnidade} abriu a solicitação ${protocoloGerado}.`,

                    tipo:
                        "solicitacao"

                });


                console.log(
                    "Administradores notificados."
                );

            }


            // =====================================
            // ATUALIZAR TELA
            // =====================================

            setProtocolo(
                protocoloGerado
            );


            setStatusSolicitacao(
                "Em Análise Técnica"
            );


            // =====================================
            // SUCESSO
            // =====================================

            alert(
                "Solicitação enviada com sucesso!"
            );


            /*
            IMPORTANTE:

            NÃO liberamos o botão novamente aqui.

            O estado "enviando" permanece true.
            Além disso, o status passou para
            "Em Análise Técnica", então o botão
            também deverá desaparecer no ResumoSolicitacao.
            */


        }

        catch (erro) {


            console.error(
                "Erro ao enviar a solicitação:",
                erro
            );


            alert(
                "Erro ao enviar a solicitação."
            );


            // =====================================
            // LIBERAR NOVAMENTE SOMENTE SE DER ERRO
            // =====================================

            setEnviando(false);

        }

    };


    // =====================================
    // TELA
    // =====================================

    return (

        <div className="solicitacoes">


            {/* =====================================
                CABEÇALHO
            ===================================== */}

            <div className="cabecalho">

                <h1>

                    Nova Solicitação

                </h1>


                <p>

                    Preencha as informações abaixo
                    para solicitar atualização dos
                    documentos legais da unidade.

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
                ETAPA LTCAT
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
                ETAPA REVISÃO ANUAL
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
                ETAPA ADEQUAÇÃO / CORREÇÃO
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
                ETAPA DADOS GERAIS
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

                        enviando={
                            enviando
                        }

                    />

                )

            }


        </div>

    );

}


export default Solicitacoes;