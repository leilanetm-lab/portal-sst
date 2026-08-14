import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    getDocs
} from "firebase/firestore";

import {
    db
} from "../firebase/firebaseConfig";


// ======================================================
// CRIAR NOTIFICAÇÃO
// ======================================================

export async function criarNotificacao({
    destinatarioUid,
    solicitacaoId = "",
    protocolo = "",
    titulo = "",
    mensagem = "",
    tipo = "geral"
}) {

    if (!destinatarioUid) {

        console.error(
            "Não foi possível criar notificação: destinatário não informado."
        );

        return;

    }


    await addDoc(
        collection(
            db,
            "Notificacoes"
        ),
        {

            destinatarioUid,

            solicitacaoId,

            protocolo,

            titulo,

            mensagem,

            tipo,

            lida: false,

            criadoEm:
                serverTimestamp()

        }
    );

}


// ======================================================
// OUVIR NOTIFICAÇÕES DO USUÁRIO
// ======================================================

export function ouvirNotificacoes(
    uid,
    callback
) {

    if (!uid) {

        callback([]);

        return () => {};

    }


    const referencia =
        collection(
            db,
            "Notificacoes"
        );


    const consulta =
        query(
            referencia,
            where(
                "destinatarioUid",
                "==",
                uid
            )
        );


    const cancelar =
        onSnapshot(
            consulta,
            (snapshot) => {

                const lista =
                    snapshot.docs.map(
                        (documento) => ({

                            id:
                                documento.id,

                            ...documento.data()

                        })
                    );


                /*
                Ordena no navegador.
                Assim não precisamos criar
                índice composto no Firebase.
                */

                lista.sort(
                    (a, b) => {

                        const dataA =
                            a.criadoEm?.toDate
                                ? a.criadoEm.toDate()
                                : new Date(0);


                        const dataB =
                            b.criadoEm?.toDate
                                ? b.criadoEm.toDate()
                                : new Date(0);


                        return (
                            dataB - dataA
                        );

                    }
                );


                callback(
                    lista
                );

            },

            (erro) => {

                console.error(
                    "Erro ao ouvir notificações:",
                    erro
                );

                callback([]);

            }
        );


    return cancelar;

}


// ======================================================
// MARCAR UMA NOTIFICAÇÃO COMO LIDA
// ======================================================

export async function marcarNotificacaoComoLida(
    id
) {

    if (!id) return;


    const referencia =
        doc(
            db,
            "Notificacoes",
            id
        );


    await updateDoc(
        referencia,
        {

            lida: true,

            lidaEm:
                serverTimestamp()

        }
    );

}


// ======================================================
// MARCAR TODAS COMO LIDAS
// ======================================================

export async function marcarTodasComoLidas(
    notificacoes
) {

    if (
        !Array.isArray(notificacoes)
    ) {

        return;

    }


    const pendentes =
        notificacoes.filter(
            (notificacao) =>
                !notificacao.lida
        );


    await Promise.all(

        pendentes.map(
            (notificacao) =>
                marcarNotificacaoComoLida(
                    notificacao.id
                )
        )

    );

}


// ======================================================
// BUSCAR USUÁRIOS ADMINISTRADORES
// ======================================================

export async function buscarAdministradores() {

    const referencia =
        collection(
            db,
            "Usuarios"
        );


    const consulta =
        query(
            referencia,
            where(
                "perfil",
                "==",
                "ADMIN"
            )
        );


    const snapshot =
        await getDocs(
            consulta
        );


    return snapshot.docs.map(
        (documento) => ({

            uid:
                documento.id,

            ...documento.data()

        })
    );

}


// ======================================================
// NOTIFICAR TODOS OS ADMINISTRADORES
// ======================================================

export async function notificarAdministradores({

    solicitacaoId = "",

    protocolo = "",

    titulo = "",

    mensagem = "",

    tipo = "solicitacao"

}) {

    const administradores =
        await buscarAdministradores();


    if (
        administradores.length === 0
    ) {

        console.warn(
            "Nenhum administrador encontrado."
        );

        return;

    }


    await Promise.all(

        administradores.map(
            (administrador) =>

                criarNotificacao({

                    destinatarioUid:
                        administrador.uid,

                    solicitacaoId,

                    protocolo,

                    titulo,

                    mensagem,

                    tipo

                })

        )

    );

}