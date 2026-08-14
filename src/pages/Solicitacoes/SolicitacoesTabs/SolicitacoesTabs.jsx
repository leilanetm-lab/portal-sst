import { useEffect, useState } from "react";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../../firebase/firebaseConfig";

import "./SolicitacoesTabs.css";


function SolicitacoesTabs({
    abaAtual,
    setAbaAtual
}) {

    const [perfil, setPerfil] =
        useState("");


    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setPerfil("");

                        return;

                    }


                    try {

                        const referencia =
                            doc(
                                db,
                                "Usuarios",
                                usuarioFirebase.uid
                            );


                        const documento =
                            await getDoc(
                                referencia
                            );


                        if (
                            documento.exists()
                        ) {

                            const dados =
                                documento.data();


                            setPerfil(
                                dados.perfil || ""
                            );

                        }

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao identificar perfil:",
                            erro
                        );

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /*
    ==========================================
    USUÁRIO UT
    ==========================================
    */

    if (perfil === "UT") {

        return null;

    }


    /*
    ==========================================
    ADMINISTRADOR
    ==========================================
    */

    return (

        <div className="solicitacoesTabs">


            <button

                className={
                    abaAtual === "entrada"
                        ? "ativo"
                        : ""
                }

                onClick={() =>
                    setAbaAtual("entrada")
                }

            >

                📥 Caixa de Entrada

            </button>


            <button

                className={
                    abaAtual === "minhas"
                        ? "ativo"
                        : ""
                }

                onClick={() =>
                    setAbaAtual("minhas")
                }

            >

                📄 Minhas Solicitações

            </button>


            <button

                className={
                    abaAtual === "nova"
                        ? "ativo"
                        : ""
                }

                onClick={() =>
                    setAbaAtual("nova")
                }

            >

                ➕ Nova Solicitação

            </button>


        </div>

    );

}


export default SolicitacoesTabs;