import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

function Layout() {

    return (

        <div className="layout">

            <Sidebar />

            <div className="layoutPrincipal">

                <Header />

                <main className="layoutConteudo">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default Layout;