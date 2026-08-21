import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

import {
    auth,
    db
} from "../firebase/firebaseConfig";


/* ============================
   LISTAR TODAS AS SOLICITAÇÕES
============================ */

export async function listarSolicitacoes() {

    const snapshot = await getDocs(
        collection(
            db,
            "Solicitacoes"
        )
    );


    return snapshot.docs.map(
        (documento) => ({

            id:
                documento.id,

            ...documento.data()

        })
    );

}


/* ============================
   BUSCAR UMA SOLICITAÇÃO
============================ */

export async function buscarSolicitacao(
    id
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );


    const documento =
        await getDoc(
            referencia
        );


    if (
        !documento.exists()
    ) {

        throw new Error(
            "Solicitação não encontrada."
        );

    }


    return {

        id:
            documento.id,

        ...documento.data()

    };

}


/* ============================
   DAR ACEITE
============================ */

export async function darAceiteSolicitacao(
    id
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );


    await updateDoc(
        referencia,
        {

            status:
                "Em Elaboração do PGR",

            etapaWorkflow:
                3,

            aceite:
                true,

            aceiteEm:
                serverTimestamp()

        }
    );

}


/* ============================
   DEVOLVER PARA CORREÇÃO
============================ */

export async function devolverSolicitacao(
    id,
    motivo
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );


    await updateDoc(
        referencia,
        {

            status:
                "Correção Solicitada",

            etapaWorkflow:
                1,

            motivoDevolucao:
                motivo,

            devolvidoEm:
                serverTimestamp()

        }
    );

}


/* ============================
   ATUALIZAR SOLICITAÇÃO
   APÓS CORREÇÃO
============================ */

export async function atualizarSolicitacaoCorrecao(
    id,
    dados
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );


    const snapshot =
        await getDoc(
            referencia
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Solicitação não encontrada."
        );

    }


    const dadosAtuais =
        snapshot.data();


    const {

        dadosCadastro = {},

        tipoSolicitacao = "",

        documentosGerados = [],

        dadosSolicitacao = {},

        lancamentoLTCAT = {},

        revisaoAnual = {},

        adequacaoCorrecao = {},

        funcoes = []

    } = dados;


    await updateDoc(
        referencia,
        {

            /* =========================
               CONTROLE DO WORKFLOW
            ========================= */

            status:
                "Em Análise Técnica",

            etapaWorkflow:
                2,

            aceite:
                false,

            correcaoEnviadaEm:
                serverTimestamp(),


            /* =========================
               UNIDADE
            ========================= */

            ut:
                dadosCadastro.numeroUT
                ||
                dadosAtuais.ut
                ||
                "",

            cliente:
                dadosCadastro.cliente
                ||
                dadosAtuais.cliente
                ||
                "",

            cidade:
                dadosCadastro.cidade
                ||
                dadosAtuais.cidade
                ||
                "",

            gerenteContrato:
                dadosCadastro.gerenteContrato
                ||
                dadosAtuais.gerenteContrato
                ||
                "",

            emailGerente:
                dadosCadastro.emailGerente
                ||
                dadosAtuais.emailGerente
                ||
                "",


            /* =========================
               SOLICITAÇÃO
            ========================= */

            tipoSolicitacao,

            documentosGerados,


            /* =========================
               DADOS DA SOLICITAÇÃO
            ========================= */

            dadosSolicitacao,


            /* =========================
               LTCAT
            ========================= */

            lancamentoLTCAT,

            tipoLancamentoLTCAT:

                lancamentoLTCAT.tipoLancamento ===
                "todos"

                    ? "Todos os GHEs"

                    : "GHEs específicos",


            /* =========================
               REVISÃO ANUAL
            ========================= */

            revisaoAnual,

            tipoRevisao:

                revisaoAnual.possuiAlteracao ===
                "nao"

                    ? "Apenas atualização da vigência"

                    : revisaoAnual.possuiAlteracao ===
                      "sim"

                        ? "Alteração técnica"

                        : "",


            /* =========================
               ADEQUAÇÃO / CORREÇÃO
            ========================= */

            adequacaoCorrecao,

            tipoAlteracao:

                adequacaoCorrecao.tipoAlteracao ===
                "administrativo"

                    ? "Dados Administrativos"

                    : adequacaoCorrecao.tipoAlteracao ===
                      "tecnica"

                        ? "Alteração Técnica"

                        : adequacaoCorrecao.tipoAlteracao ===
                          "geral"

                            ? "Dados Gerais"

                            : "",


            /* =========================
               FUNÇÕES
            ========================= */

            funcoes,


            /* =========================
               CADASTRO
            ========================= */

            dadosCadastro

        }
    );

}


/* ======================================================
   BUSCAR NOME DO USUÁRIO LOGADO
====================================================== */

async function obterNomeUsuarioLogado() {

    const usuarioFirebase =
        auth.currentUser;


    /*
    ==========================================
    NÃO EXISTE USUÁRIO AUTENTICADO
    ==========================================
    */

    if (
        !usuarioFirebase
    ) {

        return "Usuário não identificado";

    }


    /*
    ==========================================
    BUSCAR CADASTRO DO USUÁRIO NO FIRESTORE
    ==========================================
    */

    try {

        const referenciaUsuario =
            doc(
                db,
                "Usuarios",
                usuarioFirebase.uid
            );


        const documentoUsuario =
            await getDoc(
                referenciaUsuario
            );


        if (
            documentoUsuario.exists()
        ) {

            const dadosUsuario =
                documentoUsuario.data();


            /*
            Prioridade:
            1. nome cadastrado no portal
            2. displayName do Firebase
            3. email
            */

            return (

                dadosUsuario.nome
                ||
                usuarioFirebase.displayName
                ||
                usuarioFirebase.email
                ||
                "Usuário"

            );

        }

    }

    catch (erro) {

        console.error(
            "Erro ao buscar nome do usuário logado:",
            erro
        );

    }


    /*
    ==========================================
    FALLBACK
    ==========================================
    */

    return (

        usuarioFirebase.displayName
        ||
        usuarioFirebase.email
        ||
        "Usuário"

    );

}


/* ============================
   PUBLICAR DOCUMENTO
============================ */

export async function anexarDocumento(

    id,

    tipo,

    documento

) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );


    const snapshot =
        await getDoc(
            referencia
        );


    if (
        !snapshot.exists()
    ) {

        throw new Error(
            "Solicitação não encontrada."
        );

    }


    const dados =
        snapshot.data();


    /*
    ==========================================
    BUSCAR AUTOMATICAMENTE QUEM ESTÁ LOGADO
    ==========================================
    */

    const usuarioLogado =
        await obterNomeUsuarioLogado();


    const lista =
        Array.isArray(
            dados.documentos?.[tipo]
        )

            ? [
                ...dados.documentos[tipo]
            ]

            : [];


    /*
    ==========================================
    ADICIONAR DOCUMENTO
    ==========================================
    */

    lista.push({

        nome:
            documento.nome,

        revisao:
            Number(
                documento.revisao
            ),

        url:
            documento.url,

        observacao:
            documento.observacao
            ||
            "",

        /*
        AGORA NÃO É MAIS FIXO.
        VAI GRAVAR QUEM ESTÁ LOGADO.
        */

        enviadoPor:
            usuarioLogado,

        enviadoEm:
            new Date().toISOString()

    });


    /*
    ==========================================
    ATUALIZAR WORKFLOW
    ==========================================
    */

    let status =
        dados.status;


    let etapaWorkflow =
        dados.etapaWorkflow;


    if (
        tipo === "pgr"
    ) {

        status =
            "Em Elaboração do PCMSO";

        etapaWorkflow =
            4;

    }


    if (
        tipo === "pcmso"
    ) {

        status =
            "Concluído";

        etapaWorkflow =
            5;

    }


    /*
    ==========================================
    SALVAR
    ==========================================
    */

    await updateDoc(
        referencia,
        {

            [`documentos.${tipo}`]:
                lista,

            status,

            etapaWorkflow

        }
    );

}