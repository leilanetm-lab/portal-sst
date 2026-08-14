import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../../../../firebase/firebaseConfig";

const indicadoresService = {

    async buscarIndicadores(
        ano = 2026,
        mes = ""
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

snapshotSolicitacoes.forEach((doc) => {

    const dados = doc.data();

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

    snapshotSolicitacoes.forEach((doc) => {

        const dados = doc.data();

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

        snapshotSolicitacoes.forEach((doc)=>{

            const dados=doc.data();

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

snapshotSolicitacoes.forEach((doc)=>{

    const dados =
        doc.data();

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
           RETORNO
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

    slaMensal

};
    }

};

export default indicadoresService; 