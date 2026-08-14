import "./ProximosVencimentos.css";
import { useNavigate } from "react-router-dom";

function ProximosVencimentos({ vencimentos }) {

    const navigate = useNavigate();

    return (

        <div className="cardTabela">

            <div className="tituloTabela">

                <h2>⚠️ Próximos Vencimentos</h2>

                <button

                    onClick={() => navigate("/calendario")}

                >

                    Calendário

                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>UT</th>

                        <th>Documento</th>

                        <th>Revisão</th>

                        <th>Vence</th>

                        <th>Situação</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        vencimentos.length===0 ?

                        (

                            <tr>

                                <td

                                    colSpan="5"

                                    style={{

                                        textAlign:"center",

                                        padding:"30px"

                                    }}

                                >

                                    Nenhum vencimento encontrado.

                                </td>

                            </tr>

                        )

                        :

                        (

                            vencimentos.map((item,index)=>(

                                <tr

                                    key={index}

                                    onClick={()=>

                                        navigate(

                                            `/biblioteca/${item.ut}`

                                        )

                                    }

                                    style={{

                                        cursor:"pointer"

                                    }}

                                >

                                    <td>

                                        {item.ut}

                                    </td>

                                    <td>

                                        {item.documento}

                                    </td>

                                    <td>

                                        {item.revisao}

                                    </td>

                                    <td>

                                        {item.vence}

                                    </td>

                                    <td>

                                        <span

                                            className={

                                                `status ${

                                                    item.situacao

                                                        .replace(/\s/g,"")

                                                }`

                                            }

                                        >

                                            {item.situacao}

                                        </span>

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

export default ProximosVencimentos;