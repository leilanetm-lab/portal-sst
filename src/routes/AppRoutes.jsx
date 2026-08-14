import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Layout
from "../layouts/Layout";


/* ============================
   LOGIN
============================ */

import Login
from "../pages/Login/Login";


/* ============================
   PERFIL
============================ */

import MeuPerfil
from "../pages/Perfil/MeuPerfil";


/* ============================
   DASHBOARDS
============================ */

import Dashboard
from "../pages/Dashboard/Dashboard";

import DashboardUT
from "../pages/Dashboard/DashboardUT";


/* ============================
   CADASTROS
============================ */

import CadastroUT
from "../pages/CadastroUT/CadastroUT";

import CadastroAdministrativo
from "../pages/CadastroAdministrativo/CadastroAdministrativo";


/* ============================
   MESA DE TRABALHO
============================ */

import MesaTrabalho
from "../pages/MesaTrabalho/MesaTrabalho";


/* ============================
   SOLICITAÇÕES
============================ */

import NovaSolicitacao
from "../pages/Solicitacoes/NovaSolicitacao/NovaSolicitacao";

import EditarSolicitacao
from "../pages/Solicitacoes/EditarSolicitacao/EditarSolicitacao";

import DetalheSolicitacao
from "../pages/Solicitacoes/DetalheSolicitacao";


/* ============================
   BIBLIOTECA
============================ */

import Biblioteca
from "../pages/Biblioteca/Biblioteca";

import BibliotecaDetalhe
from "../pages/Biblioteca/BibliotecaDetalhe";


/* ============================
   INDICADORES
============================ */

import Indicadores
from "../pages/Indicadores/Indicadores";


/* ============================
   CALENDÁRIO
============================ */

import Calendario
from "../pages/Calendario/Calendario";


/* ============================
   USUÁRIOS
============================ */

import Usuarios
from "../pages/Usuarios/Usuarios";


/* ============================
   CONFIGURAÇÕES DA UT
============================ */

import Configuracoes
from "../pages/Configuracoes/Configuracoes";


/* ============================
   CONFIGURAÇÕES DO ADMIN
============================ */

import ConfiguracoesAdmin
from "../pages/Configuracoes/ConfiguracoesAdmin";


/* ============================
   MANUAL DA UT
============================ */

import ManualUT
from "../pages/ManualUT/ManualUT";


/* ============================
   SEGURANÇA
============================ */

import Seguranca
from "../pages/Seguranca/Seguranca";


/* ============================
   NOTIFICAÇÕES
============================ */

import Notificacoes
from "../pages/Notificacoes/Notificacoes";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ============================
                    LOGIN
                ============================ */}

                <Route
                    path="/"
                    element={
                        <Login />
                    }
                />


                {/* ============================
                    PORTAL
                ============================ */}

                <Route
                    element={
                        <Layout />
                    }
                >


                    {/* ============================
                        DASHBOARD ADMINISTRADOR
                    ============================ */}

                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    {/* ============================
                        DASHBOARD UT
                    ============================ */}

                    <Route
                        path="/dashboard-ut"
                        element={
                            <DashboardUT />
                        }
                    />


                    {/* ============================
                        PERFIL
                    ============================ */}

                    <Route
                        path="/perfil"
                        element={
                            <MeuPerfil />
                        }
                    />


                    {/* ============================
                        CONFIGURAÇÕES DA UT
                    ============================ */}

                    <Route
                        path="/configuracoes"
                        element={
                            <Configuracoes />
                        }
                    />


                    {/* ============================
                        CONFIGURAÇÕES DO ADMIN
                    ============================ */}

                    <Route
                        path="/configuracoes-admin"
                        element={
                            <ConfiguracoesAdmin />
                        }
                    />


                    {/* ============================
                        MANUAL DA UT
                    ============================ */}

                    <Route
                        path="/manual-ut"
                        element={
                            <ManualUT />
                        }
                    />


                    {/* ============================
                        SEGURANÇA
                    ============================ */}

                    <Route
                        path="/seguranca"
                        element={
                            <Seguranca />
                        }
                    />


                    {/* ============================
                        NOTIFICAÇÕES
                    ============================ */}

                    <Route
                        path="/notificacoes"
                        element={
                            <Notificacoes />
                        }
                    />


                    {/* ============================
                        CADASTRO UT
                    ============================ */}

                    <Route
                        path="/cadastro-ut"
                        element={
                            <CadastroUT />
                        }
                    />


                    {/* ============================
                        CADASTRO ADMINISTRATIVO
                    ============================ */}

                    <Route
                        path="/cadastro-administrativo"
                        element={
                            <CadastroAdministrativo />
                        }
                    />


                    {/* ============================
                        MESA DE TRABALHO
                    ============================ */}

                    <Route
                        path="/solicitacoes"
                        element={
                            <MesaTrabalho />
                        }
                    />


                    {/* ============================
                        NOVA SOLICITAÇÃO
                    ============================ */}

                    <Route
                        path="/solicitacoes/nova"
                        element={
                            <NovaSolicitacao />
                        }
                    />


                    {/* ============================
                        EDITAR CORREÇÃO
                    ============================ */}

                    <Route
                        path="/solicitacoes/:id/editar"
                        element={
                            <EditarSolicitacao />
                        }
                    />


                    {/* ============================
                        DETALHE DA SOLICITAÇÃO
                    ============================ */}

                    <Route
                        path="/solicitacoes/:id"
                        element={
                            <DetalheSolicitacao />
                        }
                    />


                    {/* ============================
                        BIBLIOTECA
                    ============================ */}

                    <Route
                        path="/biblioteca"
                        element={
                            <Biblioteca />
                        }
                    />


                    <Route
                        path="/biblioteca/:numeroUT"
                        element={
                            <BibliotecaDetalhe />
                        }
                    />


                    {/* ============================
                        INDICADORES
                    ============================ */}

                    <Route
                        path="/indicadores"
                        element={
                            <Indicadores />
                        }
                    />


                    {/* ============================
                        CALENDÁRIO
                    ============================ */}

                    <Route
                        path="/calendario"
                        element={
                            <Calendario />
                        }
                    />


                    {/* ============================
                        USUÁRIOS
                    ============================ */}

                    <Route
                        path="/usuarios"
                        element={
                            <Usuarios />
                        }
                    />


                </Route>

            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;