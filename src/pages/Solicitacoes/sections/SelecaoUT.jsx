import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../../../firebase/firebaseConfig";

import { listarUTs } from "../../../services/utService";
import { buscarCadastro } from "../../../services/cadastroAdministrativoService";


function SelecaoUT({

    utSelecionada,

    setUtSelecionada,

    cadastroAdministrativo,

    setCadastroAdministrativo,

    dadosCadastro,

    setDadosCadastro,

    setDadosCadastroOriginal,

    bloquearSelecao = false

}) {

    const [uts, setUTs] = useState([]);

    const [carregandoUsuario, setCarregandoUsuario] =
        useState(true);

    const [usuarioPerfil, setUsuarioPerfil] =
        useState(null);


    /* ============================
       CARREGAR USUÁRIO LOGADO
    ============================ */

    useEffect(() => {

        const cancelar =
            onAuthStateChanged(
                auth,
                async (usuarioFirebase) => {

                    if (!usuarioFirebase) {

                        setUsuarioPerfil(null);

                        setCarregandoUsuario(false);

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

                            setUsuarioPerfil(
                                documento.data()
                            );

                        }

                    }

                    catch (erro) {

                        console.error(
                            "Erro ao carregar perfil do usuário:",
                            erro
                        );

                    }

                    finally {

                        setCarregandoUsuario(false);

                    }

                }
            );


        return () => {

            cancelar();

        };

    }, []);


    /* ============================
       CARREGAR UTs
    ============================ */

    useEffect(() => {

        async function carregarUTs() {

            try {

                const lista =
                    await listarUTs();


                /*
                ==================================
                ADMIN
                ==================================

                Administrador pode visualizar
                todas as UTs.
                */

                if (
                    usuarioPerfil?.perfil ===
                    "ADMIN"
                ) {

                    setUTs(
                        lista || []
                    );

                    return;

                }


                /*
                ==================================
                USUÁRIO UT
                ==================================

                Usuário UT só pode visualizar
                a própria UT.
                */

                if (
                    usuarioPerfil?.perfil ===
                    "UT"
                ) {

                    const numeroUTUsuario =

                        usuarioPerfil.numeroUT ||
                        "";


                    const utsPermitidas =
                        (lista || []).filter(

                            item =>

                                String(
                                    item.numeroUT
                                ).trim() ===
                                String(
                                    numeroUTUsuario
                                ).trim()

                        );


                    setUTs(
                        utsPermitidas
                    );


                    /*
                    Se a UT do usuário foi
                    encontrada, seleciona
                    automaticamente.
                    */

                    if (
                        utsPermitidas.length === 1 &&
                        !utSelecionada?.numeroUT &&
                        !bloquearSelecao
                    ) {

                        await selecionarUTPorNumero(

                            utsPermitidas[0].numeroUT,

                            utsPermitidas

                        );

                    }


                    return;

                }


                /*
                ==================================
                PERFIL DESCONHECIDO
                ==================================

                Por segurança, não mostra
                nenhuma UT.
                */

                setUTs([]);

            }

            catch (erro) {

                console.error(
                    "Erro ao carregar UTs:",
                    erro
                );

                setUTs([]);

            }

        }


        if (
            !carregandoUsuario
        ) {

            carregarUTs();

        }

    }, [
        usuarioPerfil,
        carregandoUsuario,
        bloquearSelecao
    ]);


    /* ============================
       SELECIONAR UT
    ============================ */

    async function selecionarUTPorNumero(
        numeroUT,
        listaUTs = uts
    ) {

        const ut =
            listaUTs.find(

                item =>

                    String(
                        item.numeroUT
                    ).trim() ===
                    String(
                        numeroUT
                    ).trim()

            );


        if (!ut) {

            console.error(
                "UT não encontrada:",
                numeroUT
            );

            return;

        }


        /*
        Segurança adicional:

        Usuário UT nunca pode
        selecionar outra UT,
        mesmo que alguém tente
        manipular o componente.
        */

        if (
            usuarioPerfil?.perfil ===
            "UT"
        ) {

            const numeroUTUsuario =

                String(
                    usuarioPerfil.numeroUT ||
                    ""
                ).trim();


            if (
                String(
                    numeroUT
                ).trim() !==
                numeroUTUsuario
            ) {

                alert(
                    "Você só pode realizar solicitações para a sua própria Unidade de Trabalho."
                );

                return;

            }

        }


        setUtSelecionada(
            ut
        );


        try {

            const cadastro =
                await buscarCadastro(
                    numeroUT
                );


            if (cadastro) {

                setCadastroAdministrativo(
                    cadastro
                );


                setDadosCadastroOriginal({

                    ...cadastro,

                    numeroUT:
                        numeroUT,

                    nomeUT:
                        ut.nomeUT,

                    cliente:
                        ut.cliente,

                    cidade:
                        ut.cidade,

                    estado:
                        ut.estado

                });


                setDadosCadastro({

                    ...cadastro,

                    numeroUT:
                        numeroUT,

                    nomeUT:
                        ut.nomeUT,

                    cliente:
                        ut.cliente,

                    cidade:
                        ut.cidade,

                    estado:
                        ut.estado

                });

            }

            else {

                setCadastroAdministrativo(
                    null
                );


                setDadosCadastroOriginal({

                    numeroUT:
                        numeroUT,

                    nomeUT:
                        ut.nomeUT,

                    cliente:
                        ut.cliente,

                    cidade:
                        ut.cidade,

                    estado:
                        ut.estado

                });


                setDadosCadastro({

                    numeroUT:
                        numeroUT,

                    nomeUT:
                        ut.nomeUT,

                    cliente:
                        ut.cliente,

                    cidade:
                        ut.cidade,

                    estado:
                        ut.estado

                });

            }

        }

        catch (erro) {

            console.error(
                "Erro ao buscar Cadastro Administrativo:",
                erro
            );

        }

    }


    /* ============================
       SELECT
    ============================ */

    async function selecionarUT(e) {

        /*
        Na edição de uma solicitação
        existente, a UT fica bloqueada.
        */

        if (
            bloquearSelecao
        ) {

            return;

        }


        const numeroUT =
            e.target.value;


        if (!numeroUT) {

            setUtSelecionada(null);

            setCadastroAdministrativo(null);

            setDadosCadastroOriginal({});

            setDadosCadastro({});

            return;

        }


        await selecionarUTPorNumero(
            numeroUT
        );

    }


    /* ============================
       CARREGANDO
    ============================ */

    if (
        carregandoUsuario
    ) {

        return (

            <div className="card">

                <h2>
                    📌 Seleção da Unidade
                </h2>

                <p className="descricao">

                    Carregando informações da
                    Unidade de Trabalho...

                </p>

            </div>

        );

    }


    /* ============================
       TELA
    ============================ */

    return (

        <div className="card">

            <h2>
                📌 Seleção da Unidade
            </h2>


            <p className="descricao">

                {bloquearSelecao

                    ? "Unidade vinculada à solicitação."

                    : usuarioPerfil?.perfil === "UT"

                        ? "Sua solicitação será realizada para a sua Unidade de Trabalho."

                        : "Selecione a Unidade de Trabalho que receberá a solicitação."

                }

            </p>


            <div className="campo">

                <label>

                    Unidade *

                </label>


                <select

                    value={
                        utSelecionada?.numeroUT || ""
                    }

                    onChange={
                        selecionarUT
                    }

                    disabled={
                        bloquearSelecao ||
                        usuarioPerfil?.perfil === "UT"
                    }

                >

                    <option value="">

                        Selecione...

                    </option>


                    {uts.map(
                        (ut) => (

                            <option

                                key={
                                    ut.numeroUT
                                }

                                value={
                                    ut.numeroUT
                                }

                            >

                                {ut.numeroUT}
                                {" - "}
                                {ut.nomeUT}

                            </option>

                        )
                    )}

                </select>

            </div>


            {usuarioPerfil?.perfil === "UT" &&
                utSelecionada && (

                    <div
                        className="mensagem sucesso"
                    >

                        🔒 Solicitação vinculada à sua Unidade de Trabalho.

                    </div>

                )
            }


            {utSelecionada &&
                cadastroAdministrativo && (

                    <div
                        className="mensagem sucesso"
                    >

                        ✅ Cadastro Administrativo localizado.

                    </div>

                )
            }


            {utSelecionada &&
                !cadastroAdministrativo && (

                    <div
                        className="mensagem erro"
                    >

                        ❌ Esta UT ainda não possui Cadastro Administrativo.

                    </div>

                )
            }


        </div>

    );

}


export default SelecaoUT;