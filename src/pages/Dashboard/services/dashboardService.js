import {

    collection,

    getDocs,

    query,

    orderBy

} from "firebase/firestore";

import { db } from "../../../firebase/firebaseConfig";

const dashboardService={

    async buscarDashboard(){

        /* ===============================
           BUSCA DADOS
        =============================== */

        const snapshotSolicitacoes=

            await getDocs(

                query(

                    collection(

                        db,

                        "Solicitacoes"

                    ),

                    orderBy(

                        "criadoEm",

                        "desc"

                    )

                )

            );

        const snapshotUTs=

            await getDocs(

                collection(

                    db,

                    "UTs"

                )

            );

        /* ===============================
           ARRAYS
        =============================== */

        const solicitacoes=[];

        const vencimentos=[];

        const atividades=[];

        const notificacoes=[];

        const producaoMes={};

        const tiposSolicitacao={};

        /* ===============================
           CONTADORES
        =============================== */

        let solicitacoesAndamento=0;

        let documentosPublicados=0;

        let vencimentosProximos=0;

        let somaDiasSLA=0;

        let totalConcluidas=0;

        /* ===============================
           SOLICITAÇÕES
        =============================== */

        snapshotSolicitacoes.forEach((doc)=>{

            const dados=doc.data();

            const cadastro=dados.dadosCadastro || {};

            const criadoEm=dados.criadoEm?.toDate?.();

            const protocolo=dados.protocolo || "";

            const numeroUT=cadastro.numeroUT || "";

            const cliente=cadastro.cliente || "";

            const status=

                dados.status ||

                dados.revisaoAnual?.status ||

                "";

            const tipoSolicitacao=

                dados.tipoSolicitacao ||

                dados.revisaoAnual?.tipoRevisao ||

                "Não informado";
                            /* ===============================
               SOLICITAÇÕES EM ANDAMENTO
            =============================== */

            if(status !== "Concluído"){

                solicitacoesAndamento++;

            }

            /* ===============================
               DOCUMENTOS PUBLICADOS
            =============================== */

            const documentos=dados.documentos || {};

            documentosPublicados +=

                (documentos.pgr?.length || 0)+

                (documentos.pcmso?.length || 0)+

                (documentos.ltcat?.length || 0);

            /* ===============================
               SLA MÉDIO
            =============================== */

            if(

                status==="Concluído" &&

                criadoEm &&

                dados.aceiteEm

            ){

                const aceite=

                    dados.aceiteEm.toDate();

                const dias=

                    Math.ceil(

                        (aceite-criadoEm)/

                        (1000*60*60*24)

                    );

                somaDiasSLA += dias;

                totalConcluidas++;

            }

            /* ===============================
               ÚLTIMAS SOLICITAÇÕES
            =============================== */

            solicitacoes.push({

                id:doc.id,

                os:protocolo,

                ut:numeroUT,

                cliente,

                documento:tipoSolicitacao,

                status,

                data:

                    criadoEm

                    ?

                    criadoEm.toLocaleDateString("pt-BR")

                    :

                    ""

            });

            /* ===============================
               ATIVIDADES RECENTES
            =============================== */

            atividades.push({

                tipo:

                    status==="Concluído"

                    ?

                    "✅"

                    :

                    "📄",

                titulo:

                    status==="Concluído"

                    ?

                    "Solicitação concluída"

                    :

                    "Nova solicitação",

                descricao:

                    `${cliente} • ${numeroUT}`,

                tempo:

                    criadoEm

                    ?

                    criadoEm.toLocaleDateString("pt-BR")

                    :

                    ""

            });

            /* ===============================
               NOTIFICAÇÕES
            =============================== */

            if(status==="Correção Solicitada"){

                notificacoes.push({

                    tipo:"critico",

                    titulo:"Correção solicitada",

                    descricao:protocolo

                });

            }

            if(status==="Em Análise Técnica"){

                notificacoes.push({

                    tipo:"info",

                    titulo:"Documento em análise",

                    descricao:protocolo

                });

            }

            if(status==="Concluído"){

                notificacoes.push({

                    tipo:"sucesso",

                    titulo:"Documento concluído",

                    descricao:protocolo

                });

            }

            /* ===============================
               PRODUÇÃO MENSAL
            =============================== */

            if(criadoEm){

                const chave=

                    criadoEm.toLocaleString(

                        "pt-BR",

                        {

                            month:"short"

                        }

                    );

                producaoMes[chave]=

                    (producaoMes[chave] || 0)+1;

            }

            /* ===============================
               SOLICITAÇÕES POR TIPO
            =============================== */

            tiposSolicitacao[tipoSolicitacao]=

                (tiposSolicitacao[tipoSolicitacao] || 0)+1;

        });
                /* ===============================
           UTs
        =============================== */

        snapshotUTs.forEach((doc)=>{

            const ut=doc.data();

            if(!ut.proximaRevisao) return;

            const partes=

                ut.proximaRevisao.split("/");

            const dataRevisao=new Date(

                Number(partes[2]),

                Number(partes[1])-1,

                Number(partes[0])

            );

            const hoje=new Date();

            hoje.setHours(

                0,0,0,0

            );

            const dias=Math.ceil(

                (dataRevisao-hoje)/

                (1000*60*60*24)

            );

            /* ===============================
               CARD VENCIMENTOS
            =============================== */

            if(dias<=60){

                vencimentosProximos++;

            }

            /* ===============================
               NOTIFICAÇÕES
            =============================== */

            if(dias<=15){

                notificacoes.push({

                    tipo:"critico",

                    titulo:"Revisão crítica",

                    descricao:

                        `${ut.numeroUT} vence em ${dias} dias`

                });

            }

            else if(dias<=45){

                notificacoes.push({

                    tipo:"alerta",

                    titulo:"Revisão próxima",

                    descricao:

                        `${ut.numeroUT} vence em ${dias} dias`

                });

            }

            /* ===============================
               SITUAÇÃO
            =============================== */

            let situacao="Normal";

            if(dias<0){

                situacao="Vencido";

            }

            else if(dias<=15){

                situacao="Crítico";

            }

            else if(dias<=45){

                situacao="Alerta";

            }

            else{

                situacao=`${dias} dias`;

            }

            vencimentos.push({

                ut:ut.numeroUT,

                nomeUT:ut.nomeUT,

                cliente:ut.cliente,

                documento:"PGR / PCMSO",

                revisao:

                    ut.ultimaRevisao ||

                    "-",

                vence:

                    ut.proximaRevisao,

                situacao

            });

        });

        /* ===============================
           ORDENA VENCIMENTOS
        =============================== */

        vencimentos.sort((a,b)=>{

            const da=a.vence.split("/");

            const db=b.vence.split("/");

            const dataA=new Date(

                da[2],

                da[1]-1,

                da[0]

            );

            const dataB=new Date(

                db[2],

                db[1]-1,

                db[0]

            );

            return dataA-dataB;

        });

        vencimentos.splice(10);

        solicitacoes.splice(10);

        atividades.splice(10);
                /* ===============================
           SLA MÉDIO
        =============================== */

        const slaMedio =

            totalConcluidas===0

            ?

            "0 dias"

            :

            `${Math.round(

                somaDiasSLA/

                totalConcluidas

            )} dias`;

        /* ===============================
           RETORNO
        =============================== */

        return{

            cards:{

                solicitacoes:

                    solicitacoesAndamento,

                documentos:

                    documentosPublicados,

                vencimentos:

                    vencimentosProximos,

                sla:

                    slaMedio

            },

            solicitacoes,

            vencimentos,

            atividades,

            notificacoes,

            graficoTipos:

                tiposSolicitacao,

            producaoMensal:

                producaoMes

        };

    }

};

export default dashboardService;