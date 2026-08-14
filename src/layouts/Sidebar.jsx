import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

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
} from "../firebase/firebaseConfig";

import "./Layout.css";


function Sidebar() {

    const [usuario, setUsuario] = useState(null);

    const [carregando, setCarregando] = useState(true);


    /* ============================
       CARREGAR USUÁRIO LOGADO
    ============================ */

    useEffect(() => {

        const cancelar = onAuthStateChanged(
            auth,
            async (usuarioFirebase) => {

                if (!usuarioFirebase) {

                    setUsuario(null);

                    setCarregando(false);

                    return;

                }

                try {

                    const referencia = doc(
                        db,
                        "Usuarios",
                        usuarioFirebase.uid
                    );

                    const documento = await getDoc(
                        referencia
                    );

                    if (documento.exists()) {

                        setUsuario(
                            documento.data()
                        );

                    }

                }

                catch (erro) {

                    console.error(
                        "Erro ao carregar usuário da Sidebar:",
                        erro
                    );

                }

                finally {

                    setCarregando(false);

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

    if (carregando) {

        return (

            <aside className="sidebar">

                <div className="sidebarLogo">

                    <h2>
                        🛡 Portal SST
                    </h2>

                    <span>
                        Gestão de Documentos
                    </span>

                </div>

            </aside>

        );

    }


    /* ============================
       IDENTIFICAR PERFIL
    ============================ */

    const perfil =
        usuario?.perfil || "";


    const ehUT =
        perfil === "UT";


    /* ============================
       DADOS DO USUÁRIO
    ============================ */

    const nomeUsuario = ehUT

        ? (
            usuario?.nomeUT ||
            usuario?.nome ||
            "Usuário UT"
        )

        : (
            usuario?.nome ||
            "Administrador"
        );


    const descricaoUsuario = ehUT

        ? "Usuário UT"

        : "Administrador SST";


    return (

        <aside className="sidebar">


            {/* ============================
                LOGO
            ============================ */}

            <div className="sidebarLogo">

                <h2>
                    🛡 Portal SST
                </h2>

                <span>
                    Gestão de Documentos
                </span>

            </div>


            {/* ============================
                MENU
            ============================ */}

            <nav className="sidebarMenu">


                {/* =================================
                    MENU ADMINISTRADOR
                ================================= */}

                {!ehUT && (

                    <>

                        <NavLink
                            to="/dashboard"
                            end
                            className="menuItem"
                        >
                            🏠 Dashboard
                        </NavLink>


                        <NavLink
                            to="/solicitacoes"
                            end
                            className="menuItem"
                        >
                            📄 Solicitações
                        </NavLink>


                        <NavLink
                            to="/biblioteca"
                            end
                            className="menuItem"
                        >
                            📚 Biblioteca
                        </NavLink>


                        <NavLink
                            to="/indicadores"
                            end
                            className="menuItem"
                        >
                            📊 Indicadores
                        </NavLink>


                        <NavLink
                            to="/calendario"
                            end
                            className="menuItem"
                        >
                            📅 Calendário
                        </NavLink>


                        <NavLink
                            to="/cadastro-ut"
                            end
                            className="menuItem"
                        >
                            🏢 Cadastro UT
                        </NavLink>


                        <NavLink
                            to="/usuarios"
                            end
                            className="menuItem"
                        >
                            👥 Usuários
                        </NavLink>


                        {/* ============================
                            CONFIGURAÇÕES ADMIN
                        ============================ */}

                        <NavLink
                            to="/configuracoes-admin"
                            end
                            className="menuItem"
                        >
                            ⚙️ Configurações
                        </NavLink>

                    </>

                )}


                {/* =================================
                    MENU USUÁRIO UT
                ================================= */}

                {ehUT && (

                    <>

                        <NavLink
                            to="/dashboard-ut"
                            end
                            className="menuItem"
                        >
                            🏠 Início
                        </NavLink>


                        <NavLink
                            to="/solicitacoes/nova"
                            end
                            className="menuItem"
                        >
                            ➕ Nova Solicitação
                        </NavLink>


                        <NavLink
                            to="/solicitacoes"
                            end
                            className="menuItem"
                        >
                            📋 Minhas Solicitações
                        </NavLink>


                        <NavLink
                            to="/biblioteca"
                            end
                            className="menuItem"
                        >
                            📚 Minha Biblioteca
                        </NavLink>


                        {/* ============================
                            MANUAL DA UT
                        ============================ */}

                        <NavLink
                            to="/manual-ut"
                            end
                            className="menuItem"
                        >
                            📖 Manual do Portal
                        </NavLink>


                        {/* ============================
                            CONFIGURAÇÕES UT
                        ============================ */}

                        <NavLink
                            to="/configuracoes"
                            end
                            className="menuItem"
                        >
                            ⚙️ Configurações
                        </NavLink>

                    </>

                )}

            </nav>


            {/* ============================
                RODAPÉ
            ============================ */}

            <div className="sidebarRodape">

                <strong>
                    {nomeUsuario}
                </strong>

                <small>
                    {descricaoUsuario}
                </small>

            </div>


        </aside>

    );

}


export default Sidebar;