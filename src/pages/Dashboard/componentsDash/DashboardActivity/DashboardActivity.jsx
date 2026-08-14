import "./DashboardActivity.css";
import { useNavigate } from "react-router-dom";

function DashboardActivity({ atividades }) {

    const navigate = useNavigate();

    return (

        <div className="dashboardActivity">

            <div className="activityHeader">

                <h2>📋 Atividades Recentes</h2>

                <button

                    onClick={() => navigate("/solicitacoes")}

                >

                    Histórico

                </button>

            </div>

            <div className="timeline">

                {

                    atividades.length === 0 ?

                    (

                        <div

                            style={{

                                textAlign:"center",

                                padding:"40px",

                                color:"#777"

                            }}

                        >

                            Nenhuma atividade encontrada.

                        </div>

                    )

                    :

                    (

                        atividades.map((item,index)=>(

                            <div

                                className="timelineItem"

                                key={index}

                            >

                                <div className="timelineIcon">

                                    {item.tipo}

                                </div>

                                <div className="timelineConteudo">

                                    <h4>

                                        {item.titulo}

                                    </h4>

                                    <p>

                                        {item.descricao}

                                    </p>

                                    <small>

                                        {item.tempo}

                                    </small>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </div>

    );

}

export default DashboardActivity;