import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

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
} from "../../firebase/firebaseConfig";

import {
    buscarBibliotecaUT
} from "../../services/bibliotecaService";

import "./Biblioteca.css";


function BibliotecaDetalhe() {

    const { numeroUT } = useParams();

    const navigate = useNavigate();


    const [dados, setDados] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [acessoNegado, setAcessoNegado] =
        useState(false);


    const [filtroAno, setFiltroAno] =
        useState("Todos");


    const [filtroDocumento, setFiltroDocumento] =
        useState("Todos");


    /* ============================
       CARREGAR USUÁRIO E VALIDAR ACESSO
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setAcessoNegado(true);

                        setLoading(false);

                        return;

                    }


                    try {

                        /* ============================
                           BUSCAR USUÁRIO LOGADO
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


                        if (!documentoUsuario.exists()) {

                            setAcessoNegado(true);

                            setLoading(false);

                            return;

                        }


                        const usuario =
                            documentoUsuario.data();


                        const perfil =
                            usuario.perfil || "";


                        const numeroUTUsuario =
                            usuario.numeroUT || "";


                        /* ============================
                           VALIDAR ACESSO DA UT
                        ============================ */

                        if (
                            perfil === "UT" &&
                            numeroUTUsuario !== numeroUT
                        ) {

                            console.warn(
                                "Acesso à biblioteca não autorizado.",
                                {
                                    usuarioUT:
                                        numeroUTUsuario,

                                    bibliotecaSolicitada:
                                        numeroUT
                                }
                            );


                            setAcessoNegado(true);

                            setLoading(false);

                            return;

                        }


                        /* ============================
                           ACESSO AUTORIZADO
                        ============================ */

                        const resposta =
                            await buscarBibliotecaUT(
                                numeroUT
                            );


                        setDados(resposta);

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

    }, [numeroUT]);


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
       ACESSO NEGADO
    ============================ */

    if (acessoNegado) {

        return (

            <div className="paginaBiblioteca">

                <button
                    className="btnAbrir"
                    onClick={() => navigate(-1)}
                >

                    ← Voltar

                </button>


                <div
                    className="mensagem erro"
                    style={{
                        marginTop: "30px"
                    }}
                >

                    ❌ Você não possui autorização
                    para acessar a biblioteca desta
                    Unidade de Trabalho.

                </div>

            </div>

        );

    }


    /* ============================
       UT NÃO ENCONTRADA
    ============================ */

    if (!dados || !dados.ut) {

        return (

            <div className="paginaBiblioteca">

                <button
                    className="btnAbrir"
                    onClick={() => navigate(-1)}
                >

                    ← Voltar

                </button>


                <h2>

                    UT não encontrada.

                </h2>

            </div>

        );

    }


    /* ============================
       ANOS DISPONÍVEIS
    ============================ */

    const anos = [

        "Todos",

        ...new Set(

            dados.documentos.map(
                documento => documento.ano
            )

        )

    ].sort(
        (a, b) => b - a
    );


    /* ============================
       FILTRAR DOCUMENTOS
    ============================ */

    const documentos =
        dados.documentos.filter(
            (documento) => {

                const anoOK =

                    filtroAno === "Todos"

                    ||

                    documento.ano ===
                    Number(filtroAno);


                const documentoOK =

                    filtroDocumento === "Todos"

                    ||

                    documento.tipo ===
                    filtroDocumento;


                return (
                    anoOK &&
                    documentoOK
                );

            }
        );


    return (

        <div className="paginaBiblioteca">


            {/* ============================
                VOLTAR
            ============================ */}

            <button
                className="btnAbrir"
                onClick={() => navigate(-1)}
            >

                ← Voltar

            </button>


            {/* ============================
                CABEÇALHO
            ============================ */}

            <h1>
    📚 Histórico Documental
</h1>

<div className="cabecalhoUnidadeBiblioteca">

    <span>
        Unidade
    </span>

    <strong>
        {dados.ut.nomeUT}
    </strong>

    <small>
        {dados.ut.numeroUT}
    </small>

</div>


            {/* ============================
                RESUMO
            ============================ */}

            <div className="cardsBiblioteca">


                <div className="cardResumo">

                    <span>
                        PGR
                    </span>

                    <strong>

                        {
                            dados.documentos.filter(
                                documento =>
                                    documento.tipo ===
                                    "PGR"
                            ).length
                        }

                    </strong>

                </div>


                <div className="cardResumo">

                    <span>
                        PCMSO
                    </span>

                    <strong>

                        {
                            dados.documentos.filter(
                                documento =>
                                    documento.tipo ===
                                    "PCMSO"
                            ).length
                        }

                    </strong>

                </div>


                <div className="cardResumo">

                    <span>
                        Total
                    </span>

                    <strong>

                        {
                            dados.documentos.length
                        }

                    </strong>

                </div>


            </div>


            {/* ============================
                FILTROS
            ============================ */}

            <div className="filtrosBiblioteca">


                <select

                    value={
                        filtroDocumento
                    }

                    onChange={(e) =>
                        setFiltroDocumento(
                            e.target.value
                        )
                    }

                >

                    <option value="Todos">

                        Todos

                    </option>


                    <option value="PGR">

                        PGR

                    </option>


                    <option value="PCMSO">

                        PCMSO

                    </option>

                </select>


                <select

                    value={
                        filtroAno
                    }

                    onChange={(e) =>
                        setFiltroAno(
                            e.target.value
                        )
                    }

                >

                    {

                        anos.map(
                            (ano) => (

                                <option
                                    key={ano}
                                    value={ano}
                                >

                                    {ano}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            {/* ============================
                TABELA DE DOCUMENTOS
            ============================ */}

            <table className="tabelaBiblioteca">


                <thead>

                    <tr>

                        <th>
                            Documento
                        </th>

                        <th>
                            Revisão
                        </th>

                        <th>
                            Ano
                        </th>

                        <th>
                            Publicado por
                        </th>

                        <th>
                            Data
                        </th>

                        <th></th>

                    </tr>

                </thead>


                <tbody>


                    {documentos.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >

                                Nenhum documento
                                encontrado.

                            </td>

                        </tr>

                    ) : (

                        documentos.map(
                            (documento, index) => (

                                <tr
                                    key={index}
                                >

                                    <td>

                                        {
                                            documento.tipo
                                        }

                                    </td>


                                    <td>

                                        REV{" "}

                                        {
                                            String(
                                                documento.revisao
                                            ).padStart(
                                                2,
                                                "0"
                                            )
                                        }

                                    </td>


                                    <td>

                                        {
                                            documento.ano
                                        }

                                    </td>


                                    <td>

                                        {
                                            documento.enviadoPor
                                        }

                                    </td>


                                    <td>

                                        {
                                            documento.enviadoEm
                                                ? new Date(
                                                    documento.enviadoEm
                                                ).toLocaleDateString(
                                                    "pt-BR"
                                                )
                                                : "-"
                                        }

                                    </td>


                                    <td>

                                        <button

                                            className="btnAbrir"

                                            onClick={() =>
                                                window.open(
                                                    documento.url,
                                                    "_blank"
                                                )
                                            }

                                        >

                                            📄 Abrir

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


export default BibliotecaDetalhe;