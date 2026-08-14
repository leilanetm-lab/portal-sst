import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";


/* =======================================
   LISTAR A BIBLIOTECA
   1 LINHA POR UT
======================================= */

export async function listarBiblioteca() {

    const snapshot =
        await getDocs(
            collection(
                db,
                "Solicitacoes"
            )
        );


    const mapaUTs = {};


    snapshot.forEach(
        (documento) => {

            const dados =
                documento.data();


            /* =================================
               IDENTIFICAR UT
               
               Primeiro usa o cadastro
               administrativo.
               
               Se não existir, usa o campo
               principal "ut".
            ================================= */

            const numeroUT =
                dados.dadosCadastro?.numeroUT
                ||
                dados.ut
                ||
                "";


            const nomeUT =
                dados.dadosCadastro?.nomeUT
                ||
                dados.nomeUT
                ||
                "";


            if (!numeroUT) {

                return;

            }


            /* =================================
               CRIAR REGISTRO DA UT
            ================================= */

            if (
                !mapaUTs[numeroUT]
            ) {

                mapaUTs[numeroUT] = {

                    numeroUT,

                    nomeUT,

                    quantidadeDocumentos:
                        0,

                    ultimaAtualizacao:
                        null

                };

            }


            /* =================================
               DOCUMENTOS
            ================================= */

            const documentos =
                dados.documentos
                ||
                {};


            Object.values(
                documentos
            ).forEach(
                (lista) => {

                    if (
                        !Array.isArray(
                            lista
                        )
                    ) {

                        return;

                    }


                    lista.forEach(
                        (arquivo) => {

                            if (
                                !arquivo
                            ) {

                                return;

                            }


                            mapaUTs[
                                numeroUT
                            ].quantidadeDocumentos++;


                            if (
                                arquivo.enviadoEm
                            ) {

                                const data =
                                    new Date(
                                        arquivo.enviadoEm
                                    );


                                if (
                                    !mapaUTs[
                                        numeroUT
                                    ].ultimaAtualizacao
                                    ||

                                    data >
                                    new Date(
                                        mapaUTs[
                                            numeroUT
                                        ].ultimaAtualizacao
                                    )
                                ) {

                                    mapaUTs[
                                        numeroUT
                                    ].ultimaAtualizacao =
                                        arquivo.enviadoEm;

                                }

                            }

                        }
                    );

                }
            );

        }
    );


    return Object.values(
        mapaUTs
    ).sort(
        (a, b) => {

            if (
                !a.ultimaAtualizacao &&
                !b.ultimaAtualizacao
            ) {

                return 0;

            }


            if (
                !a.ultimaAtualizacao
            ) {

                return 1;

            }


            if (
                !b.ultimaAtualizacao
            ) {

                return -1;

            }


            return (

                new Date(
                    b.ultimaAtualizacao
                )

                -

                new Date(
                    a.ultimaAtualizacao
                )

            );

        }
    );

}


/* =======================================
   HISTÓRICO DOCUMENTAL DA UT
======================================= */

export async function buscarBibliotecaUT(
    numeroUT
) {

    const snapshot =
        await getDocs(
            collection(
                db,
                "Solicitacoes"
            )
        );


    let ut = null;


    const documentos = [];


    snapshot.forEach(
        (documento) => {

            const dados =
                documento.data();


            /* =================================
               IDENTIFICAR UT DA SOLICITAÇÃO
            ================================= */

            const numeroUTSolicitacao =
                dados.dadosCadastro?.numeroUT
                ||
                dados.ut
                ||
                "";


            /* =================================
               FILTRAR SOMENTE A UT SOLICITADA
            ================================= */

            if (
                String(
                    numeroUTSolicitacao
                ).trim()
                !==
                String(
                    numeroUT
                ).trim()
            ) {

                return;

            }


            /* =================================
               IDENTIFICAR A UT
            ================================= */

            if (!ut) {

                ut = {

                    numeroUT,

                    nomeUT:
                        dados.dadosCadastro?.nomeUT
                        ||
                        dados.nomeUT
                        ||
                        ""

                };

            }


            /* =================================
               DOCUMENTOS
            ================================= */

            const lista =
                dados.documentos
                ||
                {};


            Object.keys(
                lista
            ).forEach(
                (tipo) => {

                    if (
                        !Array.isArray(
                            lista[tipo]
                        )
                    ) {

                        return;

                    }


                    lista[tipo].forEach(
                        (arquivo) => {

                            if (
                                !arquivo
                            ) {

                                return;

                            }


                            documentos.push({

                                tipo:
                                    tipo.toUpperCase(),


                                revisao:
                                    arquivo.revisao,


                                url:
                                    arquivo.url,


                                nome:
                                    arquivo.nome,


                                observacao:
                                    arquivo.observacao
                                    ||
                                    "",


                                enviadoPor:
                                    arquivo.enviadoPor
                                    ||
                                    "",


                                enviadoEm:
                                    arquivo.enviadoEm
                                    ||
                                    "",


                                ano:
                                    arquivo.enviadoEm
                                    ?

                                    new Date(
                                        arquivo.enviadoEm
                                    ).getFullYear()

                                    :

                                    ""

                            });

                        }
                    );

                }
            );

        }
    );


    /* =================================
       ORDENAR DOCUMENTOS
       MAIS RECENTE PRIMEIRO
    ================================= */

    documentos.sort(
        (a, b) => {

            if (
                !a.enviadoEm &&
                !b.enviadoEm
            ) {

                return 0;

            }


            if (
                !a.enviadoEm
            ) {

                return 1;

            }


            if (
                !b.enviadoEm
            ) {

                return -1;

            }


            return (

                new Date(
                    b.enviadoEm
                )

                -

                new Date(
                    a.enviadoEm
                )

            );

        }
    );


    return {

        ut,

        documentos

    };

}