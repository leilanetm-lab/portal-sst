import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../firebase/firebaseConfig";

import {
    listarBiblioteca
} from "../../services/bibliotecaService";

import "./Biblioteca.css";


function Biblioteca() {

    const navigate =
        useNavigate();


    const [
        uts,
        setUTs
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        perfil,
        setPerfil
    ] = useState("");


    const [
        usuarioUT,
        setUsuarioUT
    ] = useState(null);


    const [
        filtroNomeUT,
        setFiltroNomeUT
    ] = useState("");


    const [
        filtroNumeroUT,
        setFiltroNumeroUT
    ] = useState("");


    /* ============================
       CARREGAR USUÁRIO E BIBLIOTECA
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setUTs([]);

                        setLoading(false);

                        return;

                    }


                    try {

                        /* ============================
                           BUSCAR PERFIL
                        ============================ */

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


                            setPerfil(
                                dadosUsuario.perfil || ""
                            );


                            setUsuarioUT(
                                dadosUsuario
                            );

                        }


                        /* ============================
                           CARREGAR BIBLIOTECA
                        ============================ */

                        const lista =
                            await listarBiblioteca();


                        setUTs(lista);

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar biblioteca:",
                            erro
                        );

                    }

                    finally {

                        setLoading(false);

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* ============================
       CARREGANDO
    ============================ */

    if (loading) {

        return (

            <h2>
                Carregando...
            </h2>

        );

    }


    /* ============================
       BIBLIOTECA DA UT
    ============================ */

    if (perfil === "UT") {

        const numeroUT =
            usuarioUT?.numeroUT || "";


        const nomeUT =
            usuarioUT?.nomeUT ||
            usuarioUT?.nome ||
            "Minha Unidade";


        const bibliotecaUT =
            uts.filter(
                (ut) =>
                    ut.numeroUT === numeroUT
            );


        const quantidadeDocumentos =
            bibliotecaUT.reduce(
                (total, ut) =>
                    total +
                    (
                        Number(
                            ut.quantidadeDocumentos
                        ) || 0
                    ),
                0
            );


        return (

            <div className="paginaBiblioteca">


                {/* ============================
                    CABEÇALHO UT
                ============================ */}

                <h1>

                    📚 Minha Biblioteca

                </h1>


                <p
                    style={{
                        color: "#666",
                        marginBottom: "25px"
                    }}
                >

                    Documentos publicados para
                    sua Unidade de Trabalho.

                </p>


                {/* ============================
                    IDENTIFICAÇÃO
                ============================ */}

                <div className="cardsBiblioteca">


                    <div className="cardResumo cardUnidade">

    <span>
        Unidade
    </span>

    <strong>
        {nomeUT}
    </strong>

</div>


                    <div className="cardResumo">

                        <span>
                            Nº da UT
                        </span>

                        <strong>
                            {numeroUT}
                        </strong>

                    </div>


                    <div className="cardResumo">

                        <span>
                            Documentos publicados
                        </span>

                        <strong>
                            {quantidadeDocumentos}
                        </strong>

                    </div>


                </div>


                {/* ============================
                    TABELA
                ============================ */}

                <table className="tabelaBiblioteca">


                    <thead>

                        <tr>

                            <th
                                style={{
                                    width: "180px"
                                }}
                            >
                                Nº UT
                            </th>


                            <th>
                                Nome da UT
                            </th>


                            <th
                                style={{
                                    width: "170px"
                                }}
                            >
                                Documentos
                            </th>


                            <th
                                style={{
                                    width: "180px"
                                }}
                            >
                                Última Atualização
                            </th>


                            <th
                                style={{
                                    width: "140px"
                                }}
                            >
                                Ação
                            </th>

                        </tr>

                    </thead>


                    <tbody>


                        {bibliotecaUT.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: "center",
                                        padding: "30px"
                                    }}
                                >

                                    Nenhum documento
                                    publicado para esta UT.

                                </td>

                            </tr>

                        ) : (

                            bibliotecaUT.map(
                                (ut) => (

                                    <tr
                                        key={
                                            ut.numeroUT
                                        }
                                    >

                                        <td>

                                            {
                                                ut.numeroUT
                                            }

                                        </td>


                                        <td>

                                            {
                                                ut.nomeUT
                                            }

                                        </td>


                                        <td>

                                            {
                                                ut.quantidadeDocumentos
                                            }

                                        </td>


                                        <td>

                                            {
                                                ut.ultimaAtualizacao

                                                    ?

                                                    new Date(
                                                        ut.ultimaAtualizacao
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )

                                                    :

                                                    "-"
                                            }

                                        </td>


                                        <td>

                                            <button

                                                className="btnAbrir"

                                                onClick={() =>

                                                    navigate(
                                                        `/biblioteca/${ut.numeroUT}`
                                                    )

                                                }

                                            >

                                                📂 Abrir

                                            </button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}


                    </tbody>

                </table>


            </div>

        );

    }


    /* ============================
       BIBLIOTECA ADMINISTRATIVA
    ============================ */

    const listaFiltrada =
        uts.filter((ut) => {

            const nomeOK =
                ut.nomeUT
                    .toLowerCase()
                    .includes(
                        filtroNomeUT.toLowerCase()
                    );


            const numeroOK =
                ut.numeroUT
                    .toLowerCase()
                    .includes(
                        filtroNumeroUT.toLowerCase()
                    );


            return nomeOK && numeroOK;

        });


    return (

        <div className="paginaBiblioteca">


            <h1>

                📚 Biblioteca de Documentos

            </h1>


            {/* ============================
                RESUMO ADMIN
            ============================ */}

            <div className="cardsBiblioteca">


                <div className="cardResumo">

                    <span>
                        Total de UTs
                    </span>

                    <strong>
                        {uts.length}
                    </strong>

                </div>


                <div className="cardResumo">

                    <span>
                        Total de Documentos
                    </span>

                    <strong>

                        {
                            uts.reduce(
                                (total, ut) =>
                                    total +
                                    (
                                        Number(
                                            ut.quantidadeDocumentos
                                        ) || 0
                                    ),
                                0
                            )
                        }

                    </strong>

                </div>


            </div>


            {/* ============================
                FILTROS ADMIN
            ============================ */}

            <div className="filtrosBiblioteca">


                <input

                    placeholder="Pesquisar Nome da UT"

                    value={
                        filtroNomeUT
                    }

                    onChange={(e) =>
                        setFiltroNomeUT(
                            e.target.value
                        )
                    }

                />


                <input

                    placeholder="Número da UT"

                    value={
                        filtroNumeroUT
                    }

                    onChange={(e) =>
                        setFiltroNumeroUT(
                            e.target.value
                        )
                    }

                />

            </div>


            {/* ============================
                TABELA ADMIN
            ============================ */}

            <table className="tabelaBiblioteca">


                <thead>

                    <tr>

                        <th
                            style={{
                                width: "180px"
                            }}
                        >
                            Nº UT
                        </th>


                        <th>
                            Nome da UT
                        </th>


                        <th
                            style={{
                                width: "170px"
                            }}
                        >
                            Documentos
                        </th>


                        <th
                            style={{
                                width: "180px"
                            }}
                        >
                            Última Atualização
                        </th>


                        <th
                            style={{
                                width: "140px"
                            }}
                        >
                            Ação
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {listaFiltrada.map(
                        (ut) => (

                            <tr
                                key={
                                    ut.numeroUT
                                }
                            >

                                <td>

                                    {
                                        ut.numeroUT
                                    }

                                </td>


                                <td>

                                    {
                                        ut.nomeUT
                                    }

                                </td>


                                <td>

                                    {
                                        ut.quantidadeDocumentos
                                    }

                                </td>


                                <td>

                                    {
                                        ut.ultimaAtualizacao

                                            ?

                                            new Date(
                                                ut.ultimaAtualizacao
                                            ).toLocaleDateString(
                                                "pt-BR"
                                            )

                                            :

                                            "-"
                                    }

                                </td>


                                <td>

                                    <button

                                        className="btnAbrir"

                                        onClick={() =>

                                            navigate(
                                                `/biblioteca/${ut.numeroUT}`
                                            )

                                        }

                                    >

                                        📂 Abrir

                                    </button>

                                </td>

                            </tr>

                        )
                    )}


                </tbody>

            </table>


        </div>

    );

}


export default Biblioteca;