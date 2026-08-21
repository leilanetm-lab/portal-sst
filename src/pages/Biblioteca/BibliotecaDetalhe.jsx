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
    buscarBibliotecaUT,
    editarDocumentoBiblioteca,
    excluirDocumentoBiblioteca
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


    const [perfil, setPerfil] =
        useState("");


    const [usuarioLogado, setUsuarioLogado] =
        useState(null);


    const [filtroAno, setFiltroAno] =
        useState("Todos");


    const [filtroDocumento, setFiltroDocumento] =
        useState("Todos");


    const [processando, setProcessando] =
        useState(false);


    /*
    ======================================================
    VERIFICAR ADMINISTRADOR
    ======================================================

    Aceita os possíveis formatos utilizados
    no cadastro do usuário.
    */

    const ehAdministrador =
        [
            "ADMIN",
            "ADMINISTRADOR",
            "ADMINISTRADOR SST"
        ].includes(
            String(perfil || "")
                .trim()
                .toUpperCase()
        );


    /* ============================
       CARREGAR BIBLIOTECA
    ============================ */

    async function carregarBiblioteca() {

        try {

            setLoading(true);


            const resposta =
                await buscarBibliotecaUT(
                    numeroUT
                );


            setDados(
                resposta
            );

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


                        if (
                            !documentoUsuario.exists()
                        ) {

                            setAcessoNegado(true);

                            setLoading(false);

                            return;

                        }


                        const usuario =
                            documentoUsuario.data();


                        const perfilUsuario =
                            usuario.perfil || "";


                        const numeroUTUsuario =
                            usuario.numeroUT || "";


                        setPerfil(
                            perfilUsuario
                        );


                        setUsuarioLogado({

                            uid:
                                usuarioFirebase.uid,

                            nome:
                                usuario.nome
                                ||
                                usuarioFirebase.displayName
                                ||
                                usuarioFirebase.email
                                ||
                                ""

                        });


                        /* ============================
                           VALIDAR ACESSO DA UT
                        ============================ */

                        if (
                            String(
                                perfilUsuario
                            )
                                .trim()
                                .toUpperCase() ===
                                "UT"
                            &&
                            String(
                                numeroUTUsuario
                            ).trim()
                            !==
                            String(
                                numeroUT
                            ).trim()
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


                        setDados(
                            resposta
                        );

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
       EDITAR DOCUMENTO
    ============================ */

    async function editarDocumento(
        documento
    ) {

        if (!ehAdministrador) {

            alert(
                "Você não possui permissão para editar documentos."
            );

            return;

        }


        if (
            !documento.solicitacaoId
            ||
            !documento.tipoDocumento
            ||
            documento.indiceDocumento === undefined
        ) {

            alert(
                "Não foi possível identificar o documento para edição."
            );

            console.error(
                "Dados necessários para edição não encontrados:",
                documento
            );

            return;

        }


        /* ============================
           NOVO NOME
        ============================ */

        const novoNome =
            window.prompt(
                "Nome do documento:",
                documento.nome || ""
            );


        if (
            novoNome === null
        ) {

            return;

        }


        /* ============================
           NOVO LINK
        ============================ */

        const novoLink =
            window.prompt(
                "Link do documento:",
                documento.url || ""
            );


        if (
            novoLink === null
        ) {

            return;

        }


        if (
            !novoLink.trim()
        ) {

            alert(
                "Informe um link válido."
            );

            return;

        }


        /* ============================
           NOVA REVISÃO
        ============================ */

        const novaRevisao =
            window.prompt(
                "Revisão do documento:",
                documento.revisao ?? ""
            );


        if (
            novaRevisao === null
        ) {

            return;

        }


        /* ============================
           OBSERVAÇÃO
        ============================ */

        const novaObservacao =
            window.prompt(
                "Observação:",
                documento.observacao || ""
            );


        if (
            novaObservacao === null
        ) {

            return;

        }


        try {

            setProcessando(true);


            await editarDocumentoBiblioteca({

                solicitacaoId:
                    documento.solicitacaoId,

                tipoDocumento:
                    documento.tipoDocumento,

                indiceDocumento:
                    documento.indiceDocumento,

                nome:
                    novoNome.trim(),

                revisao:
                    novaRevisao.trim(),

                url:
                    novoLink.trim(),

                observacao:
                    novaObservacao.trim(),

                editadoPor:
                    usuarioLogado?.nome
                    ||
                    "Administrador",

                editadoPorUid:
                    usuarioLogado?.uid
                    ||
                    ""

            });


            alert(
                "Documento atualizado com sucesso!"
            );


            await carregarBiblioteca();

        }

        catch (erro) {

            console.error(
                "Erro ao editar documento:",
                erro
            );


            alert(
                "Não foi possível editar o documento."
            );

        }

        finally {

            setProcessando(false);

        }

    }


    /* ============================
       EXCLUIR DOCUMENTO
    ============================ */

    async function excluirDocumento(
        documento
    ) {

        if (!ehAdministrador) {

            alert(
                "Você não possui permissão para excluir documentos."
            );

            return;

        }


        if (
            !documento.solicitacaoId
            ||
            !documento.tipoDocumento
            ||
            documento.indiceDocumento === undefined
        ) {

            alert(
                "Não foi possível identificar o documento para exclusão."
            );

            console.error(
                "Dados necessários para exclusão não encontrados:",
                documento
            );

            return;

        }


        const confirmar =
            window.confirm(

                `Tem certeza que deseja excluir o documento "${documento.nome || documento.tipo}"?\n\n` +

                "Essa ação removerá o documento da biblioteca."

            );


        if (
            !confirmar
        ) {

            return;

        }


        try {

            setProcessando(true);


            await excluirDocumentoBiblioteca({

                solicitacaoId:
                    documento.solicitacaoId,

                tipoDocumento:
                    documento.tipoDocumento,

                indiceDocumento:
                    documento.indiceDocumento

            });


            alert(
                "Documento excluído com sucesso!"
            );


            await carregarBiblioteca();

        }

        catch (erro) {

            console.error(
                "Erro ao excluir documento:",
                erro
            );


            alert(
                "Não foi possível excluir o documento."
            );

        }

        finally {

            setProcessando(false);

        }

    }


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
                    onClick={() =>
                        navigate(-1)
                    }
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

    if (
        !dados
        ||
        !dados.ut
    ) {

        return (

            <div className="paginaBiblioteca">

                <button
                    className="btnAbrir"
                    onClick={() =>
                        navigate(-1)
                    }
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
                documento =>
                    documento.ano
            )

        )

    ].sort(
        (a, b) => {

            if (
                a === "Todos"
            ) {

                return -1;

            }

            if (
                b === "Todos"
            ) {

                return 1;

            }

            return b - a;

        }
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
                    Number(
                        filtroAno
                    );


                const documentoOK =

                    filtroDocumento === "Todos"

                    ||

                    documento.tipo ===
                    filtroDocumento;


                return (
                    anoOK
                    &&
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
                onClick={() =>
                    navigate(-1)
                }
                disabled={processando}
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

                    disabled={processando}

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

                    disabled={processando}

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

                        <th>
                            Ação
                        </th>

                    </tr>

                </thead>


                <tbody>


                    {
                        documentos.length === 0

                        ?

                        (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={{
                                        textAlign:
                                            "center",

                                        padding:
                                            "30px"
                                    }}
                                >

                                    Nenhum documento
                                    encontrado.

                                </td>

                            </tr>

                        )

                        :

                        (

                            documentos.map(
                                (
                                    documento,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            documento.solicitacaoId
                                            +
                                            "-"
                                            +
                                            documento.tipoDocumento
                                            +
                                            "-"
                                            +
                                            documento.indiceDocumento
                                            +
                                            "-"
                                            +
                                            index
                                        }
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
                                                    ??
                                                    ""
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
                                                ||
                                                "-"
                                            }

                                        </td>


                                        <td>

                                            {
                                                documento.enviadoEm

                                                ?

                                                new Date(
                                                    documento.enviadoEm
                                                ).toLocaleDateString(
                                                    "pt-BR"
                                                )

                                                :

                                                "-"
                                            }

                                        </td>


                                        <td>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",

                                                    gap:
                                                        "6px",

                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

                                                {/* =========================
                                                    ABRIR
                                                ========================= */}

                                                <button

                                                    className="btnAbrir"

                                                    onClick={() =>
                                                        window.open(
                                                            documento.url,
                                                            "_blank"
                                                        )
                                                    }

                                                    disabled={
                                                        processando
                                                    }

                                                >

                                                    📄 Abrir

                                                </button>


                                                {/* =========================
                                                    EDITAR — ADMINISTRADOR
                                                ========================= */}

                                                {
                                                    ehAdministrador
                                                    &&
                                                    (

                                                        <button

                                                            className="btnAbrir"

                                                            onClick={() =>
                                                                editarDocumento(
                                                                    documento
                                                                )
                                                            }

                                                            disabled={
                                                                processando
                                                            }

                                                            style={{
                                                                background:
                                                                    "#f0ad4e",

                                                                color:
                                                                    "#fff",

                                                                border:
                                                                    "none"
                                                            }}

                                                        >

                                                            ✏️ Editar

                                                        </button>

                                                    )
                                                }


                                                {/* =========================
                                                    EXCLUIR — ADMINISTRADOR
                                                ========================= */}

                                                {
                                                    ehAdministrador
                                                    &&
                                                    (

                                                        <button

                                                            className="btnAbrir"

                                                            onClick={() =>
                                                                excluirDocumento(
                                                                    documento
                                                                )
                                                            }

                                                            disabled={
                                                                processando
                                                            }

                                                            style={{
                                                                background:
                                                                    "#d9534f",

                                                                color:
                                                                    "#fff",

                                                                border:
                                                                    "none"
                                                            }}

                                                        >

                                                            🗑️ Excluir

                                                        </button>

                                                    )
                                                }


                                            </div>

                                        </td>

                                    </tr>

                                )

                            )

                        )

                    }


                </tbody>

            </table>


            {
                processando
                &&
                (

                    <div
                        style={{
                            marginTop:
                                "15px",

                            color:
                                "#555",

                            fontWeight:
                                "600"
                        }}
                    >

                        Processando...

                    </div>

                )
            }


        </div>

    );

}


export default BibliotecaDetalhe;