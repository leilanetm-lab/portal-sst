import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

import {
    auth,
    db
} from "../firebase/firebaseConfig";

import {
    notificarAdministradores,
    notificarUTsDaSolicitacao
} from "./notificacoesService";


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


    const usuarioFirebase =
        auth.currentUser;


    let devolvidoPorNome =
        "Usuário";


    if (usuarioFirebase) {

        try {

            const usuarioRef =
                doc(
                    db,
                    "Usuarios",
                    usuarioFirebase.uid
                );


            const usuarioDoc =
                await getDoc(
                    usuarioRef
                );


            if (usuarioDoc.exists()) {

                const dadosUsuario =
                    usuarioDoc.data();


                devolvidoPorNome =
                    dadosUsuario.nome ||
                    dadosUsuario.nomeUT ||
                    usuarioFirebase.displayName ||
                    usuarioFirebase.email ||
                    "Usuário";

            }

            else {

                devolvidoPorNome =
                    usuarioFirebase.displayName ||
                    usuarioFirebase.email ||
                    "Usuário";

            }

        }

        catch (erro) {

            console.error(
                "Erro ao buscar dados do usuário para devolução:",
                erro
            );

            devolvidoPorNome =
                usuarioFirebase.displayName ||
                usuarioFirebase.email ||
                "Usuário";

        }

    }


    const snapshot =
        await getDoc(referencia);

    const dadosAtuais =
        snapshot.exists()
            ? snapshot.data()
            : {};

    const historicoAtual =
        Array.isArray(
            dadosAtuais.historicoDevolucoes
        )
            ? [
                ...dadosAtuais.historicoDevolucoes
            ]
            : [];

    const motivoLimpo =
        String(motivo || "").trim();

    const numeroDevolucao =
        historicoAtual.length + 1;

    const registroDevolucao = {

        numero:
            numeroDevolucao,

        motivo:
            motivoLimpo,

        devolvidoEm:
            Timestamp.now(),

        devolvidoPorUid:
            usuarioFirebase?.uid || "",

        devolvidoPorNome:
            devolvidoPorNome,

        devolvidoPorEmail:
            usuarioFirebase?.email || "",

        data:
            Timestamp.now(),

        responsavel:
            devolvidoPorNome,

        responsavelUid:
            usuarioFirebase?.uid || "",

        responsavelEmail:
            usuarioFirebase?.email || ""

    };


    await updateDoc(
        referencia,
        {

            status:
                "Correção Solicitada",

            etapaWorkflow:
                1,

            motivoDevolucao:
                motivoLimpo,

            devolvidoEm:
                serverTimestamp(),

            totalDevolucoes:
                numeroDevolucao,

            historicoDevolucoes:
                [
                    ...historicoAtual,
                    registroDevolucao
                ]

        }
    );

    const utDestino =
        dadosAtuais.ut ||
        dadosAtuais.dadosCadastro?.numeroUT ||
        dadosAtuais.numeroUT ||
        "";

    await notificarUTsDaSolicitacao({
        solicitacaoId:
            id,
        protocolo:
            dadosAtuais.protocolo || "",
        titulo:
            "Solicitação devolvida para correção",
        mensagem:
            `A solicitação ${dadosAtuais.protocolo || ""} foi devolvida para correção.${motivoLimpo ? ` Motivo: ${motivoLimpo}.` : ""}`,
        tipo:
            "devolucao",
        utNumero:
            utDestino,
        eventoId:
            `solicitacao:${id}:devolucao`
    });

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

    await notificarAdministradores({
        solicitacaoId:
            id,
        protocolo:
            dadosAtuais.protocolo || "",
        titulo:
            "Solicitação corrigida e reenviada para análise",
        mensagem:
            `A solicitação ${dadosAtuais.protocolo || ""} foi corrigida e reenviada para análise.`,
        tipo:
            "correcao",
        eventoId:
            `solicitacao:${id}:correcao-reenviada`
    });

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


async function montarHistoricoPortalCliente(
    referencia,
    evento = {}
) {

    const snapshot =
        await getDoc(
            referencia
        );

    if (
        !snapshot.exists()
    ) {
        return [];
    }

    const dadosAtuais =
        snapshot.data() || {};

    const historicoAtual =
        Array.isArray(
            dadosAtuais.historicoPortalCliente
        )
            ? [
                ...dadosAtuais.historicoPortalCliente
            ]
            : [];

    const tipoEvento =
        String(
            evento?.tipo || ""
        )
            .trim()
            .toLowerCase();

    if (
        !tipoEvento ||
        !["postagem", "aguardando", "aprovacao", "reprovacao"].includes(tipoEvento)
    ) {
        return historicoAtual;
    }

    const dataEvento =
        evento?.data;

    const dataValida =
        dataEvento
            ? new Date(dataEvento)
            : new Date();

    if (
        Number.isNaN(dataValida.getTime())
    ) {
        return historicoAtual;
    }

    historicoAtual.push({
        tipo: tipoEvento,
        data:
            Timestamp.fromDate(dataValida),
        motivo:
            tipoEvento === "reprovacao"
                ? String(evento?.motivo || "").trim()
                : ""
    });

    return historicoAtual;

}


/* ============================
   PUBLICAR DOCUMENTO
============================ */

export async function atualizarAcompanhamentoCliente(
    id,
    acompanhamento = {}
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );

    const dadosAcompanhamento =
        acompanhamento || {};

    const clienteExigePostagem =
        dadosAcompanhamento.clienteExigePostagem === true
            ? true
            : dadosAcompanhamento.clienteExigePostagem === false
                ? false
                : null;

    const statusAprovacao =
        String(dadosAcompanhamento.statusAprovacaoCliente || "")
            .trim()
            .toLowerCase();

    const motivoReprovacao =
        String(dadosAcompanhamento.motivoReprovacaoCliente || "")
            .trim();

    const dataResposta =
        dadosAcompanhamento.dataRespostaPostagem ||
        (clienteExigePostagem === true ? new Date().toISOString() : null);

    const dataReprovacaoBruta =
        dadosAcompanhamento.dataReprovacaoCliente ||
        new Date().toISOString().slice(0, 10);

    const snapshotAtual =
        await getDoc(
            referencia
        );

    const dadosAtuais =
        snapshotAtual.exists()
            ? snapshotAtual.data()
            : {};

    const possuiCorrecaoRelacionada = Boolean(
        dadosAtuais.correcaoRelacionadaId ||
        dadosAtuais.correcaoRelacionadaProtocolo
    );

    if (possuiCorrecaoRelacionada) {
        throw new Error("Este acompanhamento pertence ao ciclo anterior e não pode mais ser alterado.");
    }

    const payload = {
        clienteExigePostagem,
        dataRespostaPostagem:
            clienteExigePostagem === null
                ? null
                : dataResposta
                    ? Timestamp.fromDate(new Date(dataResposta))
                    : null
    };

    const historicoPortalCliente =
        Array.isArray(
            dadosAtuais.historicoPortalCliente
        )
            ? [
                ...dadosAtuais.historicoPortalCliente
            ]
            : [];

    if (clienteExigePostagem === false) {
        payload.dataPostagemCliente = null;
        payload.statusAprovacaoCliente = null;
        payload.dataAguardandoRetorno = null;
        payload.dataAprovacaoCliente = null;
        payload.dataReprovacaoCliente = null;
        payload.motivoReprovacaoCliente = null;
    }

    if (clienteExigePostagem === true) {

        const dataPostagem =
            dadosAcompanhamento.dataPostagemCliente;

        if (dataPostagem) {
            payload.dataPostagemCliente =
                Timestamp.fromDate(new Date(dataPostagem));
            historicoPortalCliente.push({
                tipo: "postagem",
                data: Timestamp.fromDate(new Date(dataPostagem)),
                motivo: ""
            });
        }

        if (statusAprovacao) {
            payload.statusAprovacaoCliente = statusAprovacao;

            if (statusAprovacao === "aguardando") {
                const dataAguardando =
                    dadosAcompanhamento.dataAguardandoRetorno ||
                    new Date().toISOString().slice(0, 10);

                payload.dataAguardandoRetorno =
                    Timestamp.fromDate(new Date(dataAguardando));

                historicoPortalCliente.push({
                    tipo: "aguardando",
                    data: Timestamp.fromDate(new Date(dataAguardando)),
                    motivo: ""
                });
            }
        }

        const dataAprovacao =
            dadosAcompanhamento.dataAprovacaoCliente;

        if (dataAprovacao) {
            payload.dataAprovacaoCliente =
                Timestamp.fromDate(new Date(dataAprovacao));
        }

        if (statusAprovacao === "reprovado") {
            if (!motivoReprovacao) {
                throw new Error("O motivo da reprovação do cliente é obrigatório.");
            }

            payload.statusAprovacaoCliente = "reprovado";
            payload.motivoReprovacaoCliente = motivoReprovacao;
            payload.dataReprovacaoCliente =
                Timestamp.fromDate(new Date(dataReprovacaoBruta));
            payload.dataAguardandoRetorno = null;
            payload.dataAprovacaoCliente = null;

            historicoPortalCliente.push({
                tipo: "reprovacao",
                data: Timestamp.now(),
                motivo: motivoReprovacao
            });
        }
        else {
            if (statusAprovacao === "aguardando") {
                payload.motivoReprovacaoCliente = null;
                payload.dataReprovacaoCliente = null;
            }
            else {
                payload.motivoReprovacaoCliente = null;
                payload.dataReprovacaoCliente = null;
                if (statusAprovacao !== "aguardando") {
                    payload.dataAguardandoRetorno = null;
                }
            }
        }

        if (statusAprovacao === "aprovado") {
            if (!dataAprovacao) {
                throw new Error("A data da aprovação do cliente é obrigatória quando o status for aprovado.");
            }

            payload.dataAguardandoRetorno = null;
            payload.dataReprovacaoCliente = null;

            historicoPortalCliente.push({
                tipo: "aprovacao",
                data: Timestamp.fromDate(new Date(dataAprovacao)),
                motivo: ""
            });
        }

    }

    payload.historicoPortalCliente =
        historicoPortalCliente;

    if (statusAprovacao === "reprovado") {
        payload.statusAprovacaoCliente = "reprovado";
        payload.motivoReprovacaoCliente = motivoReprovacao;
        payload.dataReprovacaoCliente =
            Timestamp.fromDate(new Date(dataReprovacaoBruta));
        payload.status = "Reprovado";
        payload.concluidaEm = null;
    }

    await updateDoc(
        referencia,
        payload
    );

    const protocolo =
        dadosAcompanhamento.protocolo ||
        "";

    const utNumero =
        dadosAcompanhamento.ut ||
        dadosAcompanhamento.dadosCadastro?.numeroUT ||
        "";

    if (
        clienteExigePostagem === true &&
        dataResposta &&
        statusAprovacao
    ) {

        const mensagemAdmin =
            statusAprovacao === "aprovado"
                ? `O cliente aprovou a solicitação ${protocolo || ""} e confirmou a divulgação.`
                : statusAprovacao === "reprovado"
                    ? `O cliente reprovou a solicitação ${protocolo || ""}. Motivo: ${motivoReprovacao || "não informado"}.`
                    : `O cliente respondeu a postagem da solicitação ${protocolo || ""}.`;

        await notificarAdministradores({
            solicitacaoId:
                id,
            protocolo,
            titulo:
                statusAprovacao === "aprovado"
                    ? "Cliente aprovou a solicitação"
                    : statusAprovacao === "reprovado"
                        ? "Cliente reprovou a solicitação"
                        : "Resposta do cliente registrada",
            mensagem:
                mensagemAdmin,
            tipo:
                "acompanhamento",
            eventoId:
                `solicitacao:${id}:acompanhamento-cliente:${statusAprovacao || "resposta"}`
        });

        await notificarUTsDaSolicitacao({
            solicitacaoId:
                id,
            protocolo,
            titulo:
                statusAprovacao === "aprovado"
                    ? "Acompanhamento concluído pela sua unidade"
                    : statusAprovacao === "reprovado"
                        ? "Acompanhamento do cliente reprovado"
                        : "Resposta do cliente registrada",
            mensagem:
                statusAprovacao === "aprovado"
                    ? `O cliente aprovou a solicitação ${protocolo || ""}.`
                    : statusAprovacao === "reprovado"
                        ? `O cliente reprovou a solicitação ${protocolo || ""}. Motivo: ${motivoReprovacao || "não informado"}.`
                        : `O cliente respondeu a solicitação ${protocolo || ""}.`,
            tipo:
                "acompanhamento",
            utNumero,
            eventoId:
                `solicitacao:${id}:acompanhamento-cliente:${statusAprovacao || "resposta"}`
        });

    }

    if (
        clienteExigePostagem === true &&
        dataResposta &&
        !statusAprovacao
    ) {

        await notificarAdministradores({
            solicitacaoId:
                id,
            protocolo,
            titulo:
                "Postagem do cliente registrada",
            mensagem:
                `O cliente registrou a postagem da solicitação ${protocolo || ""}.`,
            tipo:
                "acompanhamento",
            eventoId:
                `solicitacao:${id}:postagem-cliente`
        });

    }

}


export async function concluirAcompanhamentoCliente(
    id,
    acompanhamento = {}
) {

    const referencia =
        doc(
            db,
            "Solicitacoes",
            id
        );

    const dadosAcompanhamento =
        acompanhamento || {};

    const statusAprovacao =
        String(dadosAcompanhamento.statusAprovacaoCliente || "")
            .trim()
            .toLowerCase();

    const dataAprovacao =
        dadosAcompanhamento.dataAprovacaoCliente;

    if (statusAprovacao !== "aprovado") {
        throw new Error("A solicitação só pode ser concluída quando o cliente aprovou.");
    }

    if (!dataAprovacao) {
        throw new Error("Informe a data da aprovação do cliente antes de concluir.");
    }

    const snapshot =
        await getDoc(
            referencia
        );

    const dadosAtuais =
        snapshot.exists()
            ? snapshot.data()
            : {};

    const possuiCorrecaoRelacionada = Boolean(
        dadosAtuais.correcaoRelacionadaId ||
        dadosAtuais.correcaoRelacionadaProtocolo
    );

    if (possuiCorrecaoRelacionada) {
        throw new Error("Esta solicitação já possui uma Correção relacionada. A nova análise deve ser realizada na solicitação vinculada.");
    }

    const historicoPortalCliente =
        Array.isArray(
            dadosAtuais.historicoPortalCliente
        )
            ? [
                ...dadosAtuais.historicoPortalCliente
            ]
            : [];

    const jaTemAprovacaoHistorico =
        historicoPortalCliente.some(
            (evento) =>
                evento?.tipo === "aprovacao"
        );

    if (
        !jaTemAprovacaoHistorico
    ) {
        historicoPortalCliente.push({
            tipo:
                "aprovacao",
            data:
                Timestamp.now(),
            motivo:
                ""
        });
    }

    await updateDoc(
        referencia,
        {
            statusAprovacaoCliente: "aprovado",
            dataAprovacaoCliente:
                Timestamp.fromDate(new Date(dataAprovacao)),
            concluidaEm:
                serverTimestamp(),
            status:
                "Concluído",
            etapaWorkflow:
                5,
            historicoPortalCliente
        }
    );

    const protocolo =
        dadosAcompanhamento.protocolo ||
        "";

    const utNumero =
        dadosAcompanhamento.ut ||
        dadosAcompanhamento.dadosCadastro?.numeroUT ||
        "";

    await notificarAdministradores({
        solicitacaoId:
            id,
        protocolo,
        titulo:
            "Solicitação concluída",
        mensagem:
            `A solicitação ${protocolo || ""} foi concluída após aprovação do cliente.`,
        tipo:
            "conclusao",
        eventoId:
            `solicitacao:${id}:concluida`
    });

    await notificarUTsDaSolicitacao({
        solicitacaoId:
            id,
        protocolo,
        titulo:
            "Solicitação concluída",
        mensagem:
            `A solicitação ${protocolo || ""} foi concluída com aprovação do cliente.`,
        tipo:
            "conclusao",
        utNumero,
        eventoId:
            `solicitacao:${id}:concluida`
    });

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
            "Aguardando aprovação do cliente";

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

    const pgrDisponivel =
        Array.isArray(
            lista
        ) &&
        tipo === "pgr";

    const pcmsoDisponivel =
        Array.isArray(
            lista
        ) &&
        tipo === "pcmso";

    const pgrJaDisponivel =
        pgrDisponivel ||
        Array.isArray(
            dados.documentos?.pgr
        ) &&
        dados.documentos.pgr.length > 0;

    const pcmsoJaDisponivel =
        pcmsoDisponivel ||
        Array.isArray(
            dados.documentos?.pcmso
        ) &&
        dados.documentos.pcmso.length > 0;

    const utNumero =
        dados.ut ||
        dados.dadosCadastro?.numeroUT ||
        dados.numeroUT ||
        "";

    if (tipo === "pgr") {

        await notificarUTsDaSolicitacao({
            solicitacaoId:
                id,
            protocolo:
                dados.protocolo || "",
            titulo:
                "PGR disponibilizado para sua unidade",
            mensagem:
                `O PGR da solicitação ${dados.protocolo || ""} foi disponibilizado para sua unidade.`,
            tipo:
                "pgr",
            utNumero,
            eventoId:
                `solicitacao:${id}:pgr-disponibilizado`
        });

    }

    if (tipo === "pcmso") {

        await notificarUTsDaSolicitacao({
            solicitacaoId:
                id,
            protocolo:
                dados.protocolo || "",
            titulo:
                "PCMSO disponibilizado para sua unidade",
            mensagem:
                `O PCMSO da solicitação ${dados.protocolo || ""} foi disponibilizado para sua unidade.`,
            tipo:
                "pcmso",
            utNumero,
            eventoId:
                `solicitacao:${id}:pcmso-disponibilizado`
        });

    }

    if (pgrJaDisponivel && pcmsoJaDisponivel) {

        await notificarUTsDaSolicitacao({
            solicitacaoId:
                id,
            protocolo:
                dados.protocolo || "",
            titulo:
                "PGR e PCMSO disponibilizados",
            mensagem:
                `PGR e PCMSO disponibilizados. O acompanhamento no portal do cliente está disponível para a solicitação ${dados.protocolo || ""}.`,
            tipo:
                "acompanhamento",
            utNumero,
            eventoId:
                `solicitacao:${id}:pgr-pcmso-disponibilizados`
        });

    }

}