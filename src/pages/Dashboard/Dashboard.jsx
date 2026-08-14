import { useEffect, useState } from "react";

import "./Dashboard.css";

import useDashboard from "./hooks/useDashboard";

import DashboardHeader
    from "./componentsDash/DashboardHeader/DashboardHeader";

import DashboardCards
    from "./componentsDash/DashboardCards/DashboardCards";

import UltimasSolicitacoes
    from "./componentsDash/DashboardTables/UltimasSolicitacoes";

import ProximosVencimentos
    from "./componentsDash/DashboardTables/ProximosVencimentos";

import DashboardActivity
    from "./componentsDash/DashboardActivity/DashboardActivity";

import DashboardCharts
    from "./componentsDash/DashboardCharts/DashboardCharts";

import { usuarioAtual } from "../../services/authService";

import {
    doc,
    getDoc
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";


function Dashboard() {


    const {

        cards,

        solicitacoes,

        vencimentos,

        atividades,

        notificacoes,

        graficoTipos,

        producaoMensal,

        loading,

        atualizar

    } = useDashboard();


    /* ============================
       USUÁRIO LOGADO
    ============================ */

    const [usuario, setUsuario] =
        useState("");


    const [
        carregandoUsuario,
        setCarregandoUsuario
    ] = useState(true);


    /* ============================
       BUSCAR PERFIL
    ============================ */

    useEffect(() => {

        carregarUsuario();

    }, []);


    async function carregarUsuario() {

        try {

            const usuarioFirebase =
                usuarioAtual();


            if (!usuarioFirebase) {

                setUsuario(
                    "Usuário"
                );

                return;

            }


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


                /*
                 * ADMIN
                 */

                if (
                    dados.perfil ===
                    "ADMIN"
                ) {

                    setUsuario(
                        dados.nome ||
                        "Administrador"
                    );

                }


                /*
                 * UT
                 */

                else if (
                    dados.perfil ===
                    "UT"
                ) {

                    setUsuario(

                        dados.nomeUT ||

                        dados.nome ||

                        "Unidade"

                    );

                }


                /*
                 * Caso não exista
                 * perfil reconhecido
                 */

                else {

                    setUsuario(

                        dados.nome ||

                        "Usuário"

                    );

                }

            }

            else {

                /*
                 * Se o usuário ainda não
                 * tiver cadastro na coleção
                 * Usuarios, usamos o nome
                 * cadastrado no Firebase.
                 */

                setUsuario(

                    usuarioFirebase
                        .displayName ||

                    usuarioFirebase
                        .email ||

                    "Usuário"

                );

            }

        }

        catch (erro) {

            console.error(
                "Erro ao carregar usuário:",
                erro
            );


            setUsuario(
                "Usuário"
            );

        }

        finally {

            setCarregandoUsuario(
                false
            );

        }

    }


    /* ============================
       CARREGANDO DASHBOARD
    ============================ */

    if (
        loading ||
        carregandoUsuario
    ) {

        return (

            <div className="dashboard">

                Carregando...

            </div>

        );

    }


    /* ============================
       DASHBOARD
    ============================ */

    return (

        <div className="dashboard">


            <DashboardHeader

                usuario={
                    usuario
                }

                notificacoes={
                    notificacoes || []
                }

                atualizar={
                    atualizar
                }

                atualizando={
                    loading
                }

            />


            <DashboardCards

                cards={
                    cards
                }

            />


            <div className="dashboardGrid">


                <UltimasSolicitacoes

                    solicitacoes={
                        solicitacoes
                    }

                />


                <ProximosVencimentos

                    vencimentos={
                        vencimentos
                    }

                />


            </div>


            <DashboardCharts

                graficoTipos={
                    graficoTipos
                }

            />


            <DashboardActivity

                atividades={
                    atividades
                }

            />


        </div>

    );

}


export default Dashboard;