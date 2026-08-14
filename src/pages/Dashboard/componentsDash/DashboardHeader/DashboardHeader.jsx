import "./DashboardHeader.css";

function DashboardHeader({

    usuario="Leilane",

    notificacoes=[],

    atualizar,

    atualizando=false

}){

    const hoje=new Date();

    const hora=hoje.getHours();

    let saudacao="Olá";

    if(hora<12){

        saudacao="Bom dia";

    }else if(hora<18){

        saudacao="Boa tarde";

    }else{

        saudacao="Boa noite";

    }

    const data=hoje.toLocaleDateString(

        "pt-BR",

        {

            weekday:"long",

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

    const totalNotificacoes=notificacoes.length;

    const possuiCritica=

        notificacoes.some(

            n=>n.tipo==="critico"

        );

    return(

        <div className="dashboardHeader">

            <div className="dashboardTitulo">

                <div>

                    <h1>

                        {saudacao}, {usuario} 👋

                    </h1>

                    <p>

                        {data}

                    </p>

                </div>

                <button

                    className="botaoAtualizar"

                    onClick={atualizar}

                    disabled={atualizando}

                >

                    {

                        atualizando

                        ?

                        "Atualizando..."

                        :

                        "Atualizar"

                    }

                </button>

            </div>

            <div className="dashboardResumo">

                <div className="resumoCard">

                    <span>

                        📌 Hoje

                    </span>

                    <small>

                        {

                            possuiCritica

                            ?

                            "Existem pendências críticas."

                            :

                            "Nenhuma pendência crítica."

                        }

                    </small>

                </div>

                <div className="resumoCard">

                    <span>

                        🔔 Notificações

                    </span>

                    <small>

                        {

                            totalNotificacoes===0

                            ?

                            "Você não possui notificações."

                            :

                            `Você possui ${totalNotificacoes} notificação(ões).`

                        }

                    </small>

                </div>

                <div className="resumoCard">

                    <span>

                        📄 Portal SST

                    </span>

                    <small>

                        Bem-vindo ao Sistema de Gestão de Documentos Legais.

                    </small>

                </div>

            </div>

        </div>

    );

}

export default DashboardHeader;