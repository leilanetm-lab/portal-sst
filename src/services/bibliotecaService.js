import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc
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
                        (
                            arquivo,
                            indice
                        ) => {

                            if (
                                !arquivo
                            ) {

                                return;

                            }


                            documentos.push({

                                /* =========================
                                   IDENTIFICAÇÃO DO REGISTRO
                                ========================= */

                                solicitacaoId:
                                    documento.id,

                                tipoDocumento:
                                    tipo,

                                indiceDocumento:
                                    indice,


                                /* =========================
                                   DADOS DO DOCUMENTO
                                ========================= */

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


                                enviadoPorUid:
                                    arquivo.enviadoPorUid
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


/* =======================================
   EDITAR DOCUMENTO DA BIBLIOTECA
======================================= */

export async function editarDocumentoBiblioteca({

    solicitacaoId,

    tipoDocumento,

    indiceDocumento,

    nome,

    revisao,

    url,

    observacao,

    editadoPor = "",

    editadoPorUid = ""

}) {

    if (!solicitacaoId) {

        throw new Error(
            "Solicitação não informada."
        );

    }


    if (
        !tipoDocumento
    ) {

        throw new Error(
            "Tipo do documento não informado."
        );

    }


    if (
        indiceDocumento === undefined ||
        indiceDocumento === null
    ) {

        throw new Error(
            "Índice do documento não informado."
        );

    }


    const referencia =
        doc(
            db,
            "Solicitacoes",
            solicitacaoId
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


    const dados =
        documento.data();


    const documentos =
        dados.documentos
        ||
        {};


    const lista =
        documentos[
            tipoDocumento
        ];


    if (
        !Array.isArray(lista)
    ) {

        throw new Error(
            "Lista de documentos não encontrada."
        );

    }


    if (
        !lista[indiceDocumento]
    ) {

        throw new Error(
            "Documento não encontrado."
        );

    }


    /* =================================
       ATUALIZAR SOMENTE O DOCUMENTO
    ================================= */

    const documentoAtual =
        lista[indiceDocumento];


    lista[indiceDocumento] = {

        ...documentoAtual,

        nome:
            nome !== undefined
                ? nome
                : documentoAtual.nome,

        revisao:
            revisao !== undefined
                ? revisao
                : documentoAtual.revisao,

        url:
            url !== undefined
                ? url
                : documentoAtual.url,

        observacao:
            observacao !== undefined
                ? observacao
                : documentoAtual.observacao,

        editadoPor,

        editadoPorUid,

        editadoEm:
            new Date().toISOString()

    };


    await updateDoc(
        referencia,
        {

            documentos

        }
    );


    return {

        sucesso: true,

        documento:
            lista[indiceDocumento]

    };

}


/* =======================================
   EXCLUIR DOCUMENTO DA BIBLIOTECA
======================================= */

export async function excluirDocumentoBiblioteca({

    solicitacaoId,

    tipoDocumento,

    indiceDocumento

}) {

    if (!solicitacaoId) {

        throw new Error(
            "Solicitação não informada."
        );

    }


    if (
        !tipoDocumento
    ) {

        throw new Error(
            "Tipo do documento não informado."
        );

    }


    if (
        indiceDocumento === undefined ||
        indiceDocumento === null
    ) {

        throw new Error(
            "Índice do documento não informado."
        );

    }


    const referencia =
        doc(
            db,
            "Solicitacoes",
            solicitacaoId
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


    const dados =
        documento.data();


    const documentos =
        dados.documentos
        ||
        {};


    const lista =
        documentos[
            tipoDocumento
        ];


    if (
        !Array.isArray(lista)
    ) {

        throw new Error(
            "Lista de documentos não encontrada."
        );

    }


    if (
        !lista[indiceDocumento]
    ) {

        throw new Error(
            "Documento não encontrado."
        );

    }


    /* =================================
       REMOVER DOCUMENTO
    ================================= */

    lista.splice(
        indiceDocumento,
        1
    );


    await updateDoc(
        referencia,
        {

            documentos

        }
    );


    return {

        sucesso: true

    };

}