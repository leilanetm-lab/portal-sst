import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../../../../firebase/firebaseConfig";

const indicadoresService = {

    async buscarIndicadores(
        ano = 2026,
        mes = "",
        filtros = {}
    ) {

        const snapshotSolicitacoes=await getDocs(

            collection(
                db,
                "Solicitacoes"
            )

        );

        const snapshotUTs=await getDocs(

            collection(
                db,
                "UTs"
            )

        );

        const modalidadeFiltro =
            String(filtros.modalidade || "all").trim();

        const statusFiltro =
            String(filtros.status || "all").trim();

        const utFiltro =
            String(filtros.ut || "all").trim();

        const dataInicioFiltro =
            filtros.dataInicio
                ? new Date(filtros.dataInicio)
                : null;

        const dataFimFiltro =
            filtros.dataFim
                ? new Date(filtros.dataFim)
                : null;

        if (dataInicioFiltro) {
            dataInicioFiltro.setHours(0, 0, 0, 0);
        }

        if (dataFimFiltro) {
            dataFimFiltro.setHours(23, 59, 59, 999);
        }

        const dadosFiltrados =
            snapshotSolicitacoes.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((dados) => {
                    const tipoSolicitacao =
                        String(
                            dados.tipoSolicitacao ||
                            dados.revisaoAnual?.tipoSolicitacao ||
                            ""
                        ).trim();

                    const statusAtual =
                        String(
                            dados.status ||
                            dados.revisaoAnual?.status ||
                            ""
                        ).trim();

                    const numeroUT =
                        String(
                            dados.dadosCadastro?.numeroUT ||
                            dados.ut ||
                            dados.numeroUT ||
                            ""
                        ).trim();

                    const criadoEm =
                        dados.criadoEm?.toDate?.()
                            ??
                        (
                            dados.criadoEm
                                ? new Date(dados.criadoEm)
                                : null
                        );

                    if (
                        modalidadeFiltro !== "all" &&
                        tipoSolicitacao !== modalidadeFiltro
                    ) {
                        return false;
                    }

                    if (
                        statusFiltro !== "all" &&
                        statusAtual !== statusFiltro
                    ) {
                        return false;
                    }

                    if (
                        utFiltro !== "all" &&
                        numeroUT !== utFiltro
                    ) {
                        return false;
                    }

                    if (
                        dataInicioFiltro &&
                        criadoEm &&
                        criadoEm < dataInicioFiltro
                    ) {
                        return false;
                    }

                    if (
                        dataFimFiltro &&
                        criadoEm &&
                        criadoEm > dataFimFiltro
                    ) {
                        return false;
                    }

                    if (
                        criadoEm &&
                        criadoEm.getFullYear() !== Number(ano)
                    ) {
                        return false;
                    }

                    if (
                        criadoEm &&
                        mes !== "" &&
                        criadoEm.getMonth() !== Number(mes) - 1
                    ) {
                        return false;
                    }

                    return true;
                });

        const solicitacoesFiltradas = dadosFiltrados;

       /* =====================================
   MAPA DAS UTs
===================================== */

const mapaUTs = {};

snapshotUTs.forEach((doc)=>{

    const ut = doc.data();

    if(ut.numeroUT){

        mapaUTs[ut.numeroUT]=ut;

    }

}); 

        /* =====================================
           MESES
        ====================================== */

        const nomesMeses=[

            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"

        ];

        /* =====================================
           ARRAYS
        ====================================== */

        const producaoMensal = {};

const tiposSolicitacao = {};

const produtividadeMensal = {};

const engenhariaMensal = {};

const complexidadeMensal = {};

const vencimentos = [];

const graficoVencimentos = {};

const slaMensal = {};

        /* =====================================
           INICIALIZA MESES
        ====================================== */

        nomesMeses.forEach(mes=>{

            producaoMensal[mes] = {
    planejado: 0,
    realizado: 0,
    aderencia: 0,
    abertas: 0
};

            produtividadeMensal[mes]={

                pgr:0,

                pcmso:0,

                solicitacoes:0

            };

            engenhariaMensal[mes]={

                ghe:0,

                riscos:0,

                medidas:0

            };

        });

        /* =====================================
           CARDS
        ====================================== */

        let totalSolicitacoes=0;

        let totalPGR=0;

        let totalPCMSO=0;

        let totalLTCAT=0;

        let totalUTs = snapshotUTs.size;

        let totalGHE=0;

        let totalRiscos=0;

        let totalMedidas=0;

        let horasTecnicas=0;

        let somaSLA=0;

        let totalDocumentos=0;

        let totalConcluidas=0;

/* =====================================
   PLANEJAMENTO X EXECUÇÃO
===================================== */

const mesesAno = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
];

/* =====================================
   CALCULA PLANEJADO E REALIZADO
===================================== */

solicitacoesFiltradas.forEach((dados) => {

    const criadoEm =
        dados.criadoEm?.toDate?.();

    const aceiteEm =
        dados.aceiteEm?.toDate?.();

    const status =
        dados.status ||
        dados.revisaoAnual?.status ||
        "";

    /* -------------------------------
       PLANEJADO
       Solicitação aberta no ano
    -------------------------------- */

    if (
        criadoEm &&
        criadoEm.getFullYear() === Number(ano)
    ) {

        const mesAbertura =
            mesesAno[criadoEm.getMonth()];

        if (mesAbertura) {

            producaoMensal[
                mesAbertura
            ].planejado++;

        }

    }

    /* -------------------------------
       REALIZADO
       Solicitação concluída no ano
    -------------------------------- */

    if (
        status === "Concluído" &&
        aceiteEm &&
        aceiteEm.getFullYear() === Number(ano)
    ) {

        const mesConclusao =
            mesesAno[aceiteEm.getMonth()];

        if (mesConclusao) {

            producaoMensal[
                mesConclusao
            ].realizado++;

        }

    }

});

/* =====================================
   SOLICITAÇÕES AINDA ABERTAS
===================================== */

mesesAno.forEach((mesNome, indiceMes) => {

    const ultimoDiaMes =
        new Date(
            Number(ano),
            indiceMes + 1,
            0,
            23,
            59,
            59,
            999
        );

    let abertas = 0;

    solicitacoesFiltradas.forEach((dados) => {

        const criadoEm =
            dados.criadoEm?.toDate?.();

        const aceiteEm =
            dados.aceiteEm?.toDate?.();

        const status =
            dados.status ||
            dados.revisaoAnual?.status ||
            "";

        if (!criadoEm) return;

        /*
         * A solicitação já precisava existir
         * até o final daquele mês.
         */
        if (criadoEm > ultimoDiaMes) {
            return;
        }

        /*
         * Se foi concluída antes ou no final
         * daquele mês, não está mais aberta.
         */
        if (
            status === "Concluído" &&
            aceiteEm &&
            aceiteEm <= ultimoDiaMes
        ) {
            return;
        }

        abertas++;

    });

    producaoMensal[
        mesNome
    ].abertas = abertas;

});

/* =====================================
   ADERÊNCIA
===================================== */

mesesAno.forEach((mesNome) => {

    const planejado =
        producaoMensal[
            mesNome
        ].planejado;

    const realizado =
        producaoMensal[
            mesNome
        ].realizado;

    producaoMensal[
        mesNome
    ].aderencia =
        planejado === 0
            ? 0
            : Number(
                (
                    realizado /
                    planejado *
                    100
                ).toFixed(1)
            );

});



        /* =====================================
           SOLICITAÇÕES
        ====================================== */

        solicitacoesFiltradas.forEach((dados)=>{

            const documentos=dados.documentos || {};

            const funcoes=dados.funcoes || [];

            const criadoEm=dados.criadoEm?.toDate?.();

            /* ===============================
   FILTRO DE ANO E MÊS
=============================== */

if (
    criadoEm &&
    criadoEm.getFullYear() !== Number(ano)
) {
    return;
}

if (
    criadoEm &&
    mes !== "" &&
    criadoEm.getMonth() !== Number(mes) - 1
) {
    return;
}

            const aceite=dados.aceiteEm?.toDate?.();

            const status=

                dados.status ||

                dados.revisaoAnual?.status ||

                "";

            const tipo=

                dados.tipoSolicitacao ||

                dados.revisaoAnual?.tipoSolicitacao ||

                "";

            totalSolicitacoes++;

            /* ===============================
               TIPO
            ============================== */

            tiposSolicitacao[tipo]=

                (tiposSolicitacao[tipo] || 0)+1;

            /* ===============================
               DOCUMENTOS
            ============================== */

            totalPGR +=

                documentos.pgr?.length || 0;

            totalPCMSO +=

                documentos.pcmso?.length || 0;

            totalLTCAT +=

                documentos.ltcat?.length || 0;

            totalDocumentos +=
    (documentos.pgr?.length || 0) +
    (documentos.pcmso?.length || 0) +
    (documentos.ltcat?.length || 0);

            /* ===============================
               ENGENHARIA
            ============================== */

            funcoes.forEach(funcao=>{

                totalGHE++;

                const riscos=

                    funcao.riscos || [];

                totalRiscos += riscos.length;

                horasTecnicas +=

                    riscos.length * 7;

                riscos.forEach(r=>{

                    if(

                        r.medidas &&

                        r.medidas !== ""

                    ){

                        totalMedidas++;

                    }

                });

            });

            /* ===============================
               SLA
            ============================== */

            if(

    criadoEm &&

    aceite

){

                const dias=Math.ceil(

                    (aceite-criadoEm)/

                    (1000*60*60*24)

                );

                /* ===========================
   SLA MENSAL
=========================== */

const mes = criadoEm.toLocaleString(

    "pt-BR",

    {

        month:"short"

    }

);

if(!slaMensal[mes]){

    slaMensal[mes]={

        avaliacao:{

            somaDias:0,

            total:0,

            dentro:0

        },

        pgr:{

            somaDias:0,

            total:0,

            dentro:0

        },

        pcmso:{

            somaDias:0,

            total:0,

            dentro:0

        }

    };

}

/* ===========================
   AVALIAÇÃO
=========================== */

slaMensal[mes].avaliacao.total++;

slaMensal[mes].avaliacao.somaDias+=dias;

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

console.log("SLA AVALIAÇÃO", {
    criadoEm,
    aceite,
    dias
});

if(dias<=4){

    slaMensal[mes].avaliacao.dentro++;

}

/* ===========================
   PGR
=========================== */

const pgr=

    dados.documentos?.pgr?.[0];

if(

    pgr?.enviadoEm

){

    const dataPGR=

        new Date(

            pgr.enviadoEm

        );

    const inicioPGR = new Date(

    aceite.getFullYear(),

    aceite.getMonth(),

    aceite.getDate()

);

const fimPGR = new Date(

    dataPGR.getFullYear(),

    dataPGR.getMonth(),

    dataPGR.getDate()

);

const diasPGR = Math.round(

    (fimPGR-inicioPGR) /

    (1000*60*60*24)

);

    slaMensal[mes].pgr.total++;

    slaMensal[mes].pgr.somaDias+=diasPGR;

    if(diasPGR<=7){

        slaMensal[mes].pgr.dentro++;

    }

}

/* ===========================
   PCMSO
=========================== */

const pcmso=

    dados.documentos?.pcmso?.[0];

if(

    pcmso?.enviadoEm

){

    const dataPCMSO=

        new Date(

            pcmso.enviadoEm

        );

    const inicioPCMSO = new Date(

    aceite.getFullYear(),

    aceite.getMonth(),

    aceite.getDate()

);

const fimPCMSO = new Date(

    dataPCMSO.getFullYear(),

    dataPCMSO.getMonth(),

    dataPCMSO.getDate()

);

const diasPCMSO = Math.round(

    (fimPCMSO-inicioPCMSO) /

    (1000*60*60*24)

);

    slaMensal[mes].pcmso.total++;

    slaMensal[mes].pcmso.somaDias+=diasPCMSO;

    if(diasPCMSO<=7){

        slaMensal[mes].pcmso.dentro++;

    }

}

                somaSLA += dias;

                totalConcluidas++;

            }

            /* ===============================
   REVISÃO ANUAL
============================== */

if(tipo==="Revisão Anual"){

    const numeroUT =

        dados.dadosCadastro?.numeroUT;

    const ut =

        mapaUTs[numeroUT];

    if(

        ut &&

        ut.proximaRevisao

    ){

        const partes =

            ut.proximaRevisao.split("/");

        const dataRevisao = new Date(

            Number(partes[2]),

            Number(partes[1])-1,

            Number(partes[0])

        );

        const mes =

            nomesMeses[

                dataRevisao.getMonth()

            ];
    

    }

}

            /* ===============================
               PRODUTIVIDADE
            ============================== */

            if(criadoEm){

                const mes=

                    nomesMeses[

                        criadoEm.getMonth()

                    ];

                produtividadeMensal[mes]

                    .solicitacoes++;

                produtividadeMensal[mes]

                    .pgr +=

                    documentos.pgr?.length || 0;

                produtividadeMensal[mes]

                    .pcmso +=

                    documentos.pcmso?.length || 0;

            }

            /* ===============================
               ENGENHARIA
            ============================== */

            if(criadoEm){

                const mes=

                    nomesMeses[

                        criadoEm.getMonth()

                    ];

                engenhariaMensal[mes]

                    .ghe +=

                    funcoes.length;

                engenhariaMensal[mes]

                    .riscos +=

                    funcoes.reduce(

                        (s,f)=>

                            s +

                            (f.riscos?.length || 0),

                        0

                    );

                engenhariaMensal[mes]

                    .medidas +=

                    funcoes.reduce(

                        (s,f)=>

                            s +

                            (f.riscos?.filter(

                                r=>r.medidas

                            ).length || 0),

                        0

                    );

            }

        });

    /* =====================================
   COMPLEXIDADE TÉCNICA MENSAL
===================================== */

nomesMeses.forEach((mes) => {

    complexidadeMensal[mes] = {

        ghe:
            engenhariaMensal[mes]?.ghe || 0,

        riscos:
            engenhariaMensal[mes]?.riscos || 0,

        medidas:
            engenhariaMensal[mes]?.medidas || 0

    };

});

        /* ===========================
   UTs / VENCIMENTOS
=========================== */

const mesesGrafico = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
];

mesesGrafico.forEach((mes)=>{

    graficoVencimentos[mes] = {

        proximos: 0,

        renovados: 0,

        vencidos: 0

    };

});


/* ===========================
   VENCIMENTOS DAS UTs
=========================== */

snapshotUTs.forEach((doc)=>{

    const ut = doc.data();

    if(!ut.proximaRevisao) return;

    const partes =
        ut.proximaRevisao.split("/");

    if(partes.length !== 3) return;

    const dia =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    const ano =
        Number(partes[2]);

    const dataRevisao =
        new Date(
            ano,
            mes,
            dia
        );

    dataRevisao.setHours(
        0,
        0,
        0,
        0
    );

    const hoje =
        new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );

    const mesGrafico =
        mesesGrafico[mes];

    if(!mesGrafico) return;


    /* ===========================
       LISTA DE VENCIMENTOS
    =========================== */

    const dias =
        Math.ceil(

            (
                dataRevisao -

                hoje

            ) /

            (1000 * 60 * 60 * 24)

        );

    vencimentos.push({

        ut: ut.numeroUT,

        cliente: ut.cliente,

        nomeUT: ut.nomeUT,

        dias,

        revisao:
            ut.proximaRevisao

    });


    /* ===========================
       PRÓXIMOS
    =========================== */

    if(dataRevisao >= hoje){

        graficoVencimentos[
            mesGrafico
        ].proximos++;

    }


    /* ===========================
       VENCIDOS
    =========================== */

    if(dataRevisao < hoje){

        graficoVencimentos[
            mesGrafico
        ].vencidos++;

    }

});


/* ===========================
   REVISÕES ANUAIS RENOVADAS
=========================== */

solicitacoesFiltradas.forEach((dados)=>{

    const tipoSolicitacao =
        dados.tipoSolicitacao ||
        dados.revisaoAnual?.tipoSolicitacao ||
        "";

    const status =
        dados.status ||
        dados.revisaoAnual?.status ||
        "";

    const aceite =
        dados.aceite === true;

    const aceiteEm =
        dados.aceiteEm?.toDate?.();


    /* ===========================
       SOMENTE REVISÃO ANUAL
    =========================== */

    if(
        tipoSolicitacao !==
        "Revisão Anual"
    ){

        return;

    }


    /* ===========================
       RENOVADA
    =========================== */

    if(
        aceite &&
        aceiteEm
    ){

        const mes =
            mesesGrafico[
                aceiteEm.getMonth()
            ];

        if(!mes) return;

        graficoVencimentos[
            mes
        ].renovados++;

    }

});        
        /* =====================================
           SLA MÉDIO
        ====================================== */

        const slaMedio =

            totalConcluidas===0

            ?

            0

            :

            Number(

                (

                    somaSLA/

                    totalConcluidas

                ).toFixed(1)

            );

        /* =====================================
           COMPLEXIDADE
        ====================================== */

        const indiceComplexidade =

            totalGHE===0

            ?

            0

            :

            Number(

                (

                    totalRiscos/

                    totalGHE

                ).toFixed(1)

            );

        /* =====================================
           HORAS TÉCNICAS
        ====================================== */

        const horasEstimadas =

            Number(

                (

                    horasTecnicas/60

                ).toFixed(1)

            );

            const minutosGeracaoDocumentos =
    totalDocumentos * 30;

const mediaPorDocumento =
    totalDocumentos === 0
        ? 0
        : Number(
            (
                (
                    horasTecnicas +
                    minutosGeracaoDocumentos
                ) /
                totalDocumentos
            ).toFixed(1)
        );

        /* =====================================
           RESUMO TÉCNICO
        ====================================== */

        const resumoTecnico={

    totalGHE,

    totalRiscos,

    totalMedidas,

    totalDocumentos,

    horasEstimadas,

    mediaPorDocumento,

    indiceComplexidade

};

        /* =====================================
           CARDS
        ====================================== */

        const cards={

            solicitacoes:

                totalSolicitacoes,

            pgr:

                totalPGR,

            pcmso:

                totalPCMSO,

            ltcat:

                totalLTCAT,

            ut:
                totalUTs,

            sla:

                slaMedio

        };

        /* =====================================
           INDICADORES DE DEVOLUÇÕES
        ====================================== */

        const filtroUT =
            String(
                filtros.ut || "all"
            ).trim();

        const dataInicio =
            filtros.dataInicio
                ? new Date(filtros.dataInicio)
                : null;

        const dataFim =
            filtros.dataFim
                ? new Date(filtros.dataFim)
                : null;

        if (dataInicio) {

            dataInicio.setHours(0, 0, 0, 0);

        }

        if (dataFim) {

            dataFim.setHours(23, 59, 59, 999);

        }

        const totalSolicitacoesDevolucao =
            dadosFiltrados.length;

        const totalDevolucoes =
            dadosFiltrados.reduce(
                (soma, item) =>
                    soma + Number(item.totalDevolucoes || 0),
                0
            );

        const solicitacoesComCorrecao =
            dadosFiltrados.filter(
                (item) =>
                    Number(item.totalDevolucoes || 0) >= 1
            ).length;

        const solicitacoesCom2Mais =
            dadosFiltrados.filter(
                (item) =>
                    Number(item.totalDevolucoes || 0) >= 2
            ).length;

        const aprovadasPrimeiraAnalise =
            dadosFiltrados.filter(
                (item) =>
                    Number(item.totalDevolucoes || 0) === 0
            ).length;

        const taxaRetrabalho =
            totalSolicitacoesDevolucao === 0
                ? 0
                : (
                    solicitacoesComCorrecao /
                    totalSolicitacoesDevolucao
                ) * 100;

        const mediaDevolucoes =
            solicitacoesComCorrecao === 0
                ? 0
                : totalDevolucoes / solicitacoesComCorrecao;

        const mapaMotivos = new Map();

        dadosFiltrados.forEach((item) => {

            const historico =
                Array.isArray(item.historicoDevolucoes)
                    ? item.historicoDevolucoes
                    : [];

            historico.forEach((devolucao) => {

                const motivo =
                    String(
                        devolucao?.motivo || ""
                    ).trim() || "Motivo não informado";

                mapaMotivos.set(
                    motivo,
                    (mapaMotivos.get(motivo) || 0) + 1
                );

            });

        });

        const topMotivos =
            Array.from(mapaMotivos.entries())
                .map(([motivo, quantidade]) => ({
                    motivo,
                    quantidade
                }))
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, 10);

        const distribuicaoDevolucoes = {
            zero:
                dadosFiltrados.filter(
                    (item) => Number(item.totalDevolucoes || 0) === 0
                ).length,
            um:
                dadosFiltrados.filter(
                    (item) => Number(item.totalDevolucoes || 0) === 1
                ).length,
            dois:
                dadosFiltrados.filter(
                    (item) => Number(item.totalDevolucoes || 0) === 2
                ).length,
            tres:
                dadosFiltrados.filter(
                    (item) => Number(item.totalDevolucoes || 0) === 3
                ).length,
            quatroMais:
                dadosFiltrados.filter(
                    (item) => Number(item.totalDevolucoes || 0) >= 4
                ).length
        };

        const mapaUTsDevolucoes = {};

        dadosFiltrados.forEach((item) => {

            const ut =
                String(
                    item.dadosCadastro?.numeroUT ||
                    item.ut ||
                    item.numeroUT ||
                    "Não informado"
                ).trim() || "Não informado";

            if (!mapaUTsDevolucoes[ut]) {

                mapaUTsDevolucoes[ut] = {
                    ut,
                    totalSolicitacoes: 0,
                    aprovadasPrimeiraAnalise: 0,
                    solicitacoesComCorrecao: 0,
                    solicitacoesCom2Mais: 0,
                    totalDevolucoes: 0
                };

            }

            const devolucoesUT = Number(item.totalDevolucoes || 0);

            mapaUTsDevolucoes[ut].totalSolicitacoes += 1;

            if (devolucoesUT === 0) {

                mapaUTsDevolucoes[ut].aprovadasPrimeiraAnalise += 1;

            }

            if (devolucoesUT >= 1) {

                mapaUTsDevolucoes[ut].solicitacoesComCorrecao += 1;

            }

            if (devolucoesUT >= 2) {

                mapaUTsDevolucoes[ut].solicitacoesCom2Mais += 1;

            }

            mapaUTsDevolucoes[ut].totalDevolucoes += devolucoesUT;

        });

        const utDetalhe =
            Object.values(mapaUTsDevolucoes)
                .map((ut) => ({
                    ...ut,
                    percentualRetrabalho:
                        ut.totalSolicitacoes === 0
                            ? 0
                            : (ut.solicitacoesComCorrecao / ut.totalSolicitacoes) * 100
                }))
                .sort((a, b) => b.totalDevolucoes - a.totalDevolucoes);

        const mesesOrdenados = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez"
        ];

        const evolucaoMensal =
            mesesOrdenados.map((mesNome, index) => {

                const totalSolicitacoesMes =
                    dadosFiltrados.filter((item) => {

                        const criadoEm = item.criadoEm?.toDate?.()
                            ?? (item.criadoEm ? new Date(item.criadoEm) : null);

                        return criadoEm &&
                            criadoEm.getFullYear() === Number(ano) &&
                            criadoEm.getMonth() === index;

                    }).length;

                const totalDevolucoesMes =
                    dadosFiltrados.reduce((soma, item) => {

                        const criadoEm = item.criadoEm?.toDate?.()
                            ?? (item.criadoEm ? new Date(item.criadoEm) : null);

                        if (
                            criadoEm &&
                            criadoEm.getFullYear() === Number(ano) &&
                            criadoEm.getMonth() === index
                        ) {

                            return soma + Number(item.totalDevolucoes || 0);

                        }

                        return soma;

                    }, 0);

                return {
                    mes: mesNome,
                    totalSolicitacoes: totalSolicitacoesMes,
                    totalDevolucoes: totalDevolucoesMes
                };

            });

        const utOptions =
            Array.from(
                new Set(
                    snapshotUTs.docs
                        .map((doc) => doc.data())
                        .map((ut) => String(ut.numeroUT || "").trim())
                        .filter(Boolean)
                        .concat(
                            dadosFiltrados.map((item) =>
                                String(
                                    item.dadosCadastro?.numeroUT ||
                                    item.ut ||
                                    item.numeroUT ||
                                    ""
                                ).trim()
                            )
                        )
                        .filter(Boolean)
                )
            ).sort();

        const devolucoesCards = {
            totalSolicitacoes: totalSolicitacoesDevolucao,
            aprovadasPrimeiraAnalise,
            solicitacoesComCorrecao,
            solicitacoesCom2Mais,
            totalDevolucoes,
            taxaRetrabalho: Number(taxaRetrabalho.toFixed(1)),
            mediaDevolucoes: Number(mediaDevolucoes.toFixed(1))
        };

        const toDateValue = (valor) => {
            if (!valor) return null;
            if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;
            if (valor.toDate) {
                const data = valor.toDate();
                return Number.isNaN(data.getTime()) ? null : data;
            }
            if (typeof valor === "string") {
                const data = new Date(valor);
                return Number.isNaN(data.getTime()) ? null : data;
            }
            if (typeof valor === "number") {
                const data = new Date(valor);
                return Number.isNaN(data.getTime()) ? null : data;
            }
            return null;
        };

        const diferencaDias = (inicio, fim) => {
            if (!inicio || !fim) return null;
            const diff = fim.getTime() - inicio.getTime();
            return Number((diff / 86400000).toFixed(1));
        };

        const obterNumeroUT = (item) =>
            String(
                item?.dadosCadastro?.numeroUT ||
                item?.ut ||
                item?.numeroUT ||
                ""
            ).trim();

        const solicitacoesComPostagemCliente =
            dadosFiltrados.filter((item) => item.clienteExigePostagem === true);

        const dataDisponibilizacao = (item) => {
            const documentos = item?.documentos || {};
            const datas = [
                toDateValue(documentos?.pgr?.[0]?.enviadoEm),
                toDateValue(documentos?.pgr?.[0]?.dataDisponibilizacao),
                toDateValue(documentos?.pcmso?.[0]?.enviadoEm),
                toDateValue(documentos?.pcmso?.[0]?.dataDisponibilizacao),
                toDateValue(item?.dataDisponibilizacaoPGR),
                toDateValue(item?.dataDisponibilizacaoPCMSO),
                toDateValue(item?.dataDisponibilizacao)
            ].filter(Boolean);

            if (datas.length === 0) {
                return null;
            }

            datas.sort((a, b) => a.getTime() - b.getTime());
            return datas[datas.length - 1];
        };

        const itensComPostagem =
            solicitacoesComPostagemCliente.filter((item) => !!toDateValue(item?.dataPostagemCliente));

        const itensSemPostagem =
            solicitacoesComPostagemCliente.filter((item) => !toDateValue(item?.dataPostagemCliente));

        const itensComRetorno =
            solicitacoesComPostagemCliente.filter((item) => {
                const status = String(item?.statusAprovacaoCliente || "").trim().toLowerCase();
                return status === "aprovado" || status === "reprovado" ||
                    !!toDateValue(item?.dataAprovacaoCliente) ||
                    !!toDateValue(item?.dataReprovacaoCliente);
            });

        const itensAguardandoRetorno =
            solicitacoesComPostagemCliente.filter((item) => {
                const dataPostagem = toDateValue(item?.dataPostagemCliente);
                return !!dataPostagem && String(item?.statusAprovacaoCliente || "").trim().toLowerCase() === "aguardando";
            });

        const idsReprovados = new Set();
        const totalReprovacoesHistorico = solicitacoesComPostagemCliente.reduce((total, item) => {
            const historico = Array.isArray(item?.historicoPortalCliente) ? item.historicoPortalCliente : [];
            const reprovacaoAtual = String(item?.statusAprovacaoCliente || "").trim().toLowerCase() === "reprovado" || !!toDateValue(item?.dataReprovacaoCliente);

            if (reprovacaoAtual) {
                idsReprovados.add(item.id);
            }

            const eventosReprovacao = historico.filter((evento) => evento?.tipo === "reprovacao");
            if (eventosReprovacao.length > 0) {
                idsReprovados.add(item.id);
            }

            return total + eventosReprovacao.length;
        }, 0);

        const documentosReprovados = idsReprovados.size;

        const slaMedioPostagem =
            itensComPostagem.length === 0
                ? 0
                : Number((
                    itensComPostagem.reduce((soma, item) => {
                        const inicio = dataDisponibilizacao(item);
                        const fim = toDateValue(item.dataPostagemCliente);
                        const dias = diferencaDias(inicio, fim);
                        return soma + (Number.isFinite(dias) ? dias : 0);
                    }, 0) / itensComPostagem.length
                ).toFixed(1));

        const slaMedioRetorno =
            itensComRetorno.length === 0
                ? 0
                : Number((
                    itensComRetorno.reduce((soma, item) => {
                        const inicio = toDateValue(item.dataPostagemCliente);
                        const dataAprovacao = toDateValue(item.dataAprovacaoCliente);
                        const dataReprovacao = toDateValue(item.dataReprovacaoCliente);
                        const fim = dataAprovacao && dataReprovacao
                            ? new Date(Math.min(dataAprovacao.getTime(), dataReprovacao.getTime()))
                            : dataAprovacao || dataReprovacao;
                        const dias = diferencaDias(inicio, fim);
                        return soma + (Number.isFinite(dias) ? dias : 0);
                    }, 0) / itensComRetorno.length
                ).toFixed(1));

        const indiceReprovacao =
            itensComRetorno.length === 0
                ? 0
                : Number((
                    (documentosReprovados / itensComRetorno.length) * 100
                ).toFixed(1));

        const mapaUTAcompanhamento = {};

        solicitacoesComPostagemCliente.forEach((item) => {
            const ut = obterNumeroUT(item) || "Não informado";
            if (!mapaUTAcompanhamento[ut]) {
                mapaUTAcompanhamento[ut] = {
                    ut,
                    documentosComPostagem: 0,
                    postados: 0,
                    aguardandoPostagem: 0,
                    totalDiasPostagem: 0,
                    totalDiasRetorno: 0,
                    aguardandoRetorno: 0,
                    reprovados: 0,
                    aprovados: 0,
                    retornoRecebido: 0
                };
            }

            const registro = mapaUTAcompanhamento[ut];
            registro.documentosComPostagem += 1;

            const postagem = toDateValue(item?.dataPostagemCliente);
            if (postagem) {
                registro.postados += 1;
                const disponibilidade = dataDisponibilizacao(item);
                const diasPostagem = diferencaDias(disponibilidade, postagem);
                if (Number.isFinite(diasPostagem)) {
                    registro.totalDiasPostagem += diasPostagem;
                }
            }
            else {
                registro.aguardandoPostagem += 1;
            }

            const statusAprovacao = String(item?.statusAprovacaoCliente || "").trim().toLowerCase();
            if (statusAprovacao === "aguardando" && postagem) {
                registro.aguardandoRetorno += 1;
            }

            const dataAprovacao = toDateValue(item?.dataAprovacaoCliente);
            const dataReprovacao = toDateValue(item?.dataReprovacaoCliente);
            const retorno = dataAprovacao || dataReprovacao;
            if (retorno) {
                registro.retornoRecebido += 1;
                if (statusAprovacao === "aprovado") {
                    registro.aprovados += 1;
                }
                if (statusAprovacao === "reprovado") {
                    registro.reprovados += 1;
                }

                const inicioRetorno = postagem;
                const fimRetorno = dataAprovacao && dataReprovacao
                    ? new Date(Math.min(dataAprovacao.getTime(), dataReprovacao.getTime()))
                    : dataAprovacao || dataReprovacao;
                const diasRetorno = diferencaDias(inicioRetorno, fimRetorno);
                if (Number.isFinite(diasRetorno)) {
                    registro.totalDiasRetorno += diasRetorno;
                }
            }
        });

        const slaPostagemPorUT = Object.values(mapaUTAcompanhamento)
            .map((ut) => ({
                ut: ut.ut,
                documentosComPostagem: ut.documentosComPostagem,
                postados: ut.postados,
                slaMedioPostagem: ut.postados === 0 ? 0 : Number((ut.totalDiasPostagem / ut.postados).toFixed(1)),
                aguardandoPostagem: ut.aguardandoPostagem
            }))
            .filter((ut) => ut.documentosComPostagem > 0)
            .sort((a, b) => Number(b.slaMedioPostagem || 0) - Number(a.slaMedioPostagem || 0));

        const slaRetornoPorUT = Object.values(mapaUTAcompanhamento)
            .map((ut) => ({
                ut: ut.ut,
                postados: ut.postados,
                retornoRecebido: ut.retornoRecebido,
                slaMedioRetorno: ut.retornoRecebido === 0 ? 0 : Number((ut.totalDiasRetorno / ut.retornoRecebido).toFixed(1))
            }))
            .filter((ut) => ut.retornoRecebido > 0)
            .sort((a, b) => Number(b.slaMedioRetorno || 0) - Number(a.slaMedioRetorno || 0));

        const reprovaçõesPorUT = Object.values(mapaUTAcompanhamento)
            .map((ut) => ({
                ut: ut.ut,
                reprovados: ut.reprovados,
                indiceReprovacao: ut.retornoRecebido === 0 ? 0 : Number(((ut.reprovados / ut.retornoRecebido) * 100).toFixed(1))
            }))
            .filter((ut) => ut.reprovados > 0 || ut.indiceReprovacao > 0)
            .sort((a, b) => Number(b.reprovados || 0) - Number(a.reprovados || 0));

        const tabelaUT = Object.values(mapaUTAcompanhamento)
            .map((ut) => ({
                ut: ut.ut,
                documentosComPostagem: ut.documentosComPostagem,
                postados: ut.postados,
                aguardandoPostagem: ut.aguardandoPostagem,
                slaMedioPostagem: ut.postados === 0 ? 0 : Number((ut.totalDiasPostagem / ut.postados).toFixed(1)),
                aguardandoRetorno: ut.aguardandoRetorno,
                slaMedioRetorno: ut.retornoRecebido === 0 ? 0 : Number((ut.totalDiasRetorno / ut.retornoRecebido).toFixed(1)),
                aprovados: ut.aprovados,
                reprovados: ut.reprovados,
                indiceReprovacao: ut.retornoRecebido === 0 ? 0 : Number(((ut.reprovados / ut.retornoRecebido) * 100).toFixed(1))
            }))
            .sort((a, b) => Number(b.documentosComPostagem || 0) - Number(a.documentosComPostagem || 0));

        const acompanhamentoPosDisponibilizacao = {
            cards: {
                documentosComPostagemExigida: solicitacoesComPostagemCliente.length,
                slaMedioPostagem,
                aguardandoPostagem: itensSemPostagem.length,
                slaMedioRetorno,
                aguardandoRetorno: itensAguardandoRetorno.length,
                documentosReprovados,
                indiceReprovacao,
                totalRetornos: itensComRetorno.length,
                totalReprovacoesHistorico
            },
            slaPostagemPorUT,
            slaRetornoPorUT,
            reprovaçõesPorUT,
            tabelaUT
        };

        /* =====================================
        ====================================== */
/* =====================================
   SLA - PREPARA DADOS DO GRÁFICO
===================================== */

const graficoSLA = Object.entries(

    slaMensal

).map(([mes,dados])=>{

    const mediaAvaliacao =

        dados.avaliacao.total===0

        ?

        0

        :

        Number(

            (

                dados.avaliacao.somaDias/

                dados.avaliacao.total

            ).toFixed(1)

        );

    const mediaPGR =

        dados.pgr.total===0

        ?

        0

        :

        Number(

            (

                dados.pgr.somaDias/

                dados.pgr.total

            ).toFixed(1)

        );

    const mediaPCMSO =

        dados.pcmso.total===0

        ?

        0

        :

        Number(

            (

                dados.pcmso.somaDias/

                dados.pcmso.total

            ).toFixed(1)

        );

    return{

        mes,

        avaliacao:

            dados.avaliacao.total===0

            ?

            0

            :

            Math.round(

                (

                    dados.avaliacao.dentro/

                    dados.avaliacao.total

                )*100

            ),

        pgr:

            dados.pgr.total===0

            ?

            0

            :

            Math.round(

                (

                    dados.pgr.dentro/

                    dados.pgr.total

                )*100

            ),

        pcmso:

            dados.pcmso.total===0

            ?

            0

            :

            Math.round(

                (

                    dados.pcmso.dentro/

                    dados.pcmso.total

                )*100

            ),

        mediaAvaliacao,

        mediaPGR,

        mediaPCMSO

    };

});

        return{

    cards,

    producaoMensal,

    tiposSolicitacao,

    produtividadeMensal,

    engenhariaMensal,

    vencimentos,

    graficoVencimentos,

    resumoTecnico,

    graficoSLA,

    complexidadeMensal,

    slaMensal,

    devolucoesCards,

    topMotivos,

    distribuicaoDevolucoes,

    utDetalhe,

    evolucaoMensal,

    utOptions,

    acompanhamentoPosDisponibilizacao

};
    }

};

export default indicadoresService; 