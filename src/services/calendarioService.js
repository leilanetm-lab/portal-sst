import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

/* ==========================================
   CONVERTE DD/MM/YYYY EM DATE
========================================== */

function dataBRParaDate(data){

    if(!data) return null;

    const partes = data.split("/");

    return new Date(

        Number(partes[2]),
        Number(partes[1])-1,
        Number(partes[0])

    );

}

/* ==========================================
   ADICIONA DIAS
========================================== */

function adicionarDias(data,dias){

    const nova = new Date(data);

    nova.setDate(

        nova.getDate()+dias

    );

    return nova;

}

/* ==========================================
   FORMATA YYYY-MM-DD
========================================== */

function formatarData(data){

    return data.toISOString().split("T")[0];

}

/* ==========================================
   EVENTOS
========================================== */

export async function listarEventosCalendario(){

    const eventos=[];

    /* ===============================
       SOLICITAÇÕES
    =============================== */

    const snapshotSolicitacoes = await getDocs(

        collection(db,"Solicitacoes")

    );

    snapshotSolicitacoes.forEach((doc)=>{

        const dados = doc.data();

        const cadastro = dados.dadosCadastro || {};

        const criadoEm = dados.criadoEm?.toDate?.();

        if(!criadoEm) return;

        const protocolo = dados.protocolo || "";

        const numeroUT = cadastro.numeroUT || "";

        const nomeUT = cadastro.nomeUT || "";

        const cliente = cadastro.cliente || "";

        const analise = adicionarDias(

            criadoEm,

            4

        );

        const pgr = adicionarDias(

            analise,

            7

        );

        const pcmso = adicionarDias(

            pgr,

            7

        );

        /* ===============================
           ANÁLISE
        =============================== */

        eventos.push({

            id:doc.id+"-analise",

            titulo:protocolo,

            descricao:"Análise Técnica",

            data:formatarData(analise),

            tipo:"analise",

            cor:"#2196F3",

            protocolo,

            cliente,

            numeroUT,

            nomeUT,

            status:"normal"

        });

        /* ===============================
           PGR
        =============================== */

        eventos.push({

            id:doc.id+"-pgr",

            titulo:protocolo,

            descricao:"Elaboração PGR",

            data:formatarData(pgr),

            tipo:"pgr",

            cor:"#43A047",

            protocolo,

            cliente,

            numeroUT,

            nomeUT,

            status:"normal"

        });

        /* ===============================
           PCMSO
        =============================== */

        eventos.push({

            id:doc.id+"-pcmso",

            titulo:protocolo,

            descricao:"Elaboração PCMSO",

            data:formatarData(pcmso),

            tipo:"pcmso",

            cor:"#8E24AA",

            protocolo,

            cliente,

            numeroUT,

            nomeUT,

            status:"normal"

        });

    });

    /* ===============================
       UTs
    =============================== */

    const snapshotUT = await getDocs(

        collection(db,"UTs")

    );

    snapshotUT.forEach((doc)=>{

        const ut = doc.data();

        const cliente = ut.cliente || "";

        if(ut.primeiroAlerta){

            const dataAlerta = dataBRParaDate(

                ut.primeiroAlerta

            );

            const dataRevisao = dataBRParaDate(

                ut.proximaRevisao

            );

            const hoje = new Date();

            hoje.setHours(0,0,0,0);

            const diasParaVencimento = Math.ceil(

                (dataRevisao-hoje) /

                (1000*60*60*24)

            );

            let status="normal";

            if(diasParaVencimento<0){

                status="vencido";

            }else if(diasParaVencimento<=15){

                status="critico";

            }else if(diasParaVencimento<=45){

                status="alerta";

            }

            eventos.push({

                id:doc.id+"-alerta",

                titulo:ut.numeroUT,

                descricao:"Alerta de Revisão",

                data:formatarData(dataAlerta),

                tipo:"alerta",

                cor:"#FB8C00",

                cliente,

                numeroUT:ut.numeroUT,

                nomeUT:ut.nomeUT,

                diasParaVencimento,

                dataRevisao:ut.proximaRevisao,

                status

            });

        }

        if(ut.proximaRevisao){

            const dataRevisao = dataBRParaDate(

                ut.proximaRevisao

            );

            const hoje = new Date();

            hoje.setHours(0,0,0,0);

            const diasParaVencimento = Math.ceil(

                (dataRevisao-hoje) /

                (1000*60*60*24)

            );

            let status="normal";

            if(diasParaVencimento<0){

                status="vencido";

            }else if(diasParaVencimento<=15){

                status="critico";

            }else if(diasParaVencimento<=45){

                status="alerta";

            }

            eventos.push({

                id:doc.id+"-revisao",

                titulo:ut.numeroUT,

                descricao:"Revisão Global",

                data:formatarData(dataRevisao),

                tipo:"revisao",

                cor:"#E53935",

                cliente,

                numeroUT:ut.numeroUT,

                nomeUT:ut.nomeUT,

                diasParaVencimento,

                dataRevisao:ut.proximaRevisao,

                status

            });

        }

    });

    return eventos;

}