import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../../../../firebase/firebaseConfig";


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const CUSTO_MENSAL_PGR = 5682;

const CUSTO_MENSAL_PCMSO = 5682;

const MULTIPLICADOR_COMPLEXIDADE = 1.60;


/* =====================================================
   CLIENTES DE ALTA COMPLEXIDADE
===================================================== */

const CLIENTES_ALTA_COMPLEXIDADE = [

    "GERDAU",

    "ANGLO",

    "SAMARCO",

    "NOVO NORDISK"

];


/* =====================================================
   PESOS DE ESFORÇO
===================================================== */

const PESOS = {

    revisao: 1.00,

    implantacao: 1.20,

    adendo: 0.40,

    adequacao: 0.25,

    correcao: 0.12

};


/* =====================================================
   BENCHMARK PGR
===================================================== */

const BENCHMARK_PGR = {

    revisao: 6000,

    implantacao: 8000,

    adendo: 2000,

    adequacao: 1200,

    correcao: 750

};


/* =====================================================
   BENCHMARK PGR
   ALTA COMPLEXIDADE
===================================================== */

const BENCHMARK_PGR_ALTA = {

    revisao: 12000,

    implantacao: 15000,

    adendo: 4000,

    adequacao: 2500,

    correcao: 1500

};


/* =====================================================
   BENCHMARK PCMSO
===================================================== */

const BENCHMARK_PCMSO = {

    revisao: 4000,

    implantacao: 6000,

    adendo: 1000,

    adequacao: 800,

    correcao: 350

};


/* =====================================================
   BENCHMARK PCMSO
   ALTA COMPLEXIDADE
===================================================== */

const BENCHMARK_PCMSO_ALTA = {

    revisao: 9000,

    implantacao: 12000,

    adendo: 2500,

    adequacao: 1500,

    correcao: 900

};


/* =====================================================
   NORMALIZA TEXTO
===================================================== */

function normalizarTexto(valor) {

    return String(valor || "")

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase()

        .trim();

}


/* =====================================================
   IDENTIFICA MODALIDADE
===================================================== */

function identificarModalidade(dados) {

    const tipo = normalizarTexto(

        dados.tipoSolicitacao ||

        dados.revisaoAnual?.tipoSolicitacao ||

        ""

    );

    const tipoRevisao = normalizarTexto(

        dados.revisaoAnual?.tipoRevisao ||

        ""

    );

    const tipoAlteracao = normalizarTexto(

        dados.tipoAlteracao ||

        dados.revisaoAnual?.tipoAlteracao ||

        ""

    );


    /* ===========================
       REVISÃO
    =========================== */

    if(

        tipo.includes("revisao") ||

        tipoRevisao.includes("revisao")

    ) {

        return "revisao";

    }


    /* ===========================
       IMPLANTAÇÃO
    =========================== */

    if(

        tipo.includes("implantacao")

    ) {

        return "implantacao";

    }


    /* ===========================
       ADENDO
    =========================== */

    if(

        tipo.includes("adendo")

    ) {

        return "adendo";

    }


    /* ===========================
       ADEQUAÇÃO
    =========================== */

    if(

        tipo.includes("adequacao")

    ) {

        return "adequacao";

    }


    /* ===========================
       CORREÇÃO / ATUALIZAÇÃO
    =========================== */

    if(

        tipo.includes("correcao") ||

        tipo.includes("atualizacao") ||

        tipoAlteracao.includes("correcao") ||

        tipoAlteracao.includes("atualizacao")

    ) {

        return "correcao";

    }


    return null;

}


/* =====================================================
   IDENTIFICA ALTA COMPLEXIDADE
===================================================== */

function ehAltaComplexidade(dados) {

    const cliente = normalizarTexto(

        dados.cliente ||

        dados.dadosCadastro?.cliente ||

        dados.dadosCadastro?.nomeContratante ||

        ""

    );


    return CLIENTES_ALTA_COMPLEXIDADE.some(

        nome =>

            cliente.includes(

                normalizarTexto(nome)

            )

    );

}


/* =====================================================
   NOME DO MÊS
===================================================== */

const nomesMeses = [

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


/* =====================================================
   CALCULAR SAVING
===================================================== */

export async function calcularSaving() {


    /* =================================================
       BUSCA SOLICITAÇÕES
    ================================================= */

    const snapshot = await getDocs(

        collection(

            db,

            "Solicitacoes"

        )

    );


    const solicitacoes = [];


    snapshot.forEach((doc) => {

        const dados = doc.data();


        const criadoEm =

            dados.criadoEm?.toDate?.();


        if(!criadoEm) return;


        const documentosGerados =

            dados.documentosGerados || [];


        const documentos =

            dados.documentos || {};


        const modalidade =

            identificarModalidade(dados);


        if(!modalidade) return;


        const cliente =

            dados.cliente ||

            dados.dadosCadastro?.cliente ||

            "";


        const altaComplexidade =

            ehAltaComplexidade(dados);


        const pesoBase =

            PESOS[modalidade];


        const pesoInterno =

            altaComplexidade

                ? pesoBase *

                  MULTIPLICADOR_COMPLEXIDADE

                : pesoBase;


        /* =============================================
           DOCUMENTOS
        ============================================= */


        const temPGR =

            documentosGerados.some(

                item =>

                    normalizarTexto(item) ===

                    "pgr"

            ) ||

            (documentos.pgr?.length || 0) > 0;


        const temPCMSO =

            documentosGerados.some(

                item =>

                    normalizarTexto(item) ===

                    "pcmso"

            ) ||

            (documentos.pcmso?.length || 0) > 0;


        if(!temPGR && !temPCMSO) {

            return;

        }


        solicitacoes.push({

            dados,

            criadoEm,

            mes:

                nomesMeses[

                    criadoEm.getMonth()

                ],

            modalidade,

            pesoBase,

            pesoInterno,

            cliente,

            altaComplexidade,

            temPGR,

            temPCMSO

        });

    });


    /* =================================================
       AGRUPA POR MÊS
    ================================================= */

    const gruposMensais = {};


    nomesMeses.forEach(mes => {

        gruposMensais[mes] = {

            pgr: [],

            pcmso: []

        };

    });


    solicitacoes.forEach(item => {

        if(item.temPGR) {

            gruposMensais[

                item.mes

            ].pgr.push(item);

        }


        if(item.temPCMSO) {

            gruposMensais[

                item.mes

            ].pcmso.push(item);

        }

    });


    /* =================================================
       CALCULA CADA MÊS
    ================================================= */

    const mensal = nomesMeses.map(mes => {


        const grupoPGR =

            gruposMensais[mes].pgr;


        const grupoPCMSO =

            gruposMensais[mes].pcmso;


        /* =============================================
           PESO TOTAL DO MÊS
        ============================================= */

        const pesoTotalPGR =

            grupoPGR.reduce(

                (soma, item) =>

                    soma +

                    item.pesoInterno,

                0

            );


        const pesoTotalPCMSO =

            grupoPCMSO.reduce(

                (soma, item) =>

                    soma +

                    item.pesoInterno,

                0

            );


        /* =============================================
           CUSTO INTERNO PGR
        ============================================= */

        let custoInternoPGR = 0;


        if(pesoTotalPGR > 0) {

            custoInternoPGR =

                grupoPGR.reduce(

                    (soma, item) =>

                        soma +

                        (

                            CUSTO_MENSAL_PGR *

                            (

                                item.pesoInterno /

                                pesoTotalPGR

                            )

                        ),

                    0

                );

        }


        /* =============================================
           CUSTO INTERNO PCMSO
        ============================================= */

        let custoInternoPCMSO = 0;


        if(pesoTotalPCMSO > 0) {

            custoInternoPCMSO =

                grupoPCMSO.reduce(

                    (soma, item) =>

                        soma +

                        (

                            CUSTO_MENSAL_PCMSO *

                            (

                                item.pesoInterno /

                                pesoTotalPCMSO

                            )

                        ),

                    0

                );

        }


        /* =============================================
           VALOR DE MERCADO PGR
        ============================================= */

        const valorMercadoPGR =

            grupoPGR.reduce(

                (soma, item) => {


                    const tabela =

                        item.altaComplexidade

                            ? BENCHMARK_PGR_ALTA

                            : BENCHMARK_PGR;


                    return soma +

                        tabela[

                            item.modalidade

                        ];

                },

                0

            );


        /* =============================================
           VALOR DE MERCADO PCMSO
        ============================================= */

        const valorMercadoPCMSO =

            grupoPCMSO.reduce(

                (soma, item) => {


                    const tabela =

                        item.altaComplexidade

                            ? BENCHMARK_PCMSO_ALTA

                            : BENCHMARK_PCMSO;


                    return soma +

                        tabela[

                            item.modalidade

                        ];

                },

                0

            );


        /* =============================================
           TOTAIS
        ============================================= */

        const interno =

            custoInternoPGR +

            custoInternoPCMSO;


        const externo =

            valorMercadoPGR +

            valorMercadoPCMSO;


        const saving =

            externo -

            interno;


        const eficiencia =

            externo === 0

                ? 0

                : Number(

                    (

                        (

                            saving /

                            externo

                        ) * 100

                    ).toFixed(1)

                );


        const documentos =

            grupoPGR.length +

            grupoPCMSO.length;


        return {

            mes,

            interno:

                Number(

                    interno.toFixed(2)

                ),

            externo:

                Number(

                    externo.toFixed(2)

                ),

            saving:

                Number(

                    saving.toFixed(2)

                ),

            eficiencia,

            documentos

        };

    });


    /* =================================================
       TOTAIS
    ================================================= */

    const custoInterno =

        mensal.reduce(

            (soma, item) =>

                soma +

                item.interno,

            0

        );


    const valorExterno =

        mensal.reduce(

            (soma, item) =>

                soma +

                item.externo,

            0

        );


    const savingTotal =

        mensal.reduce(

            (soma, item) =>

                soma +

                item.saving,

            0

        );


    const percentual =

        valorExterno === 0

            ? 0

            : Number(

                (

                    (

                        savingTotal /

                        valorExterno

                    ) * 100

                ).toFixed(2)

            );


    const documentos =

        mensal.reduce(

            (soma, item) =>

                soma +

                item.documentos,

            0

        );


    const economiaMedia =

        documentos === 0

            ? 0

            : Number(

                (

                    savingTotal /

                    documentos

                ).toFixed(2)

            );


    return {

        mensal,

        custoInterno:

            Number(

                custoInterno.toFixed(2)

            ),

        valorExterno:

            Number(

                valorExterno.toFixed(2)

            ),

        savingTotal:

            Number(

                savingTotal.toFixed(2)

            ),

        percentual,

        documentos,

        economiaMedia

    };

}