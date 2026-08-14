import "./UltimasSolicitacoes.css";
import { useNavigate } from "react-router-dom";

function UltimasSolicitacoes({ solicitacoes }) {

    const navigate = useNavigate();

    return (

        <div className="cardTabela">

            <div className="tituloTabela">

                <h2>📄 Últimas Solicitações</h2>

                <button

                    onClick={() => navigate("/solicitacoes")}

                >

                    Ver todas

                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>OS</th>

                        <th>UT</th>

                        <th>Documento</th>

                        <th>Status</th>

                        <th>Data</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        solicitacoes.length === 0 ?

                        (

                            <tr>

                                <td

                                    colSpan="5"

                                    style={{

                                        textAlign: "center",

                                        padding: "30px"

                                    }}

                                >

                                    Nenhuma solicitação encontrada.

                                </td>

                            </tr>

                        )

                        :

                        (

                            solicitacoes.map((item,index)=>(

                                <tr

                                    key={index}

                                    onClick={() =>

                                        navigate(

                                            `/solicitacoes/${item.id}`

                                        )

                                    }

                                    style={{

                                        cursor:"pointer"

                                    }}

                                >

                                    <td>

                                        {item.os}

                                    </td>

                                    <td>

                                        {item.ut}

                                    </td>

                                    <td>

                                        {item.documento}

                                    </td>

                                    <td>

                                        <span

                                            className={`status ${

                                                item.status

                                                    .replace(/\s/g,"")

                                            }`}

                                        >

                                            {item.status}

                                        </span>

                                    </td>

                                    <td>

                                        {item.data}

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default UltimasSolicitacoes;