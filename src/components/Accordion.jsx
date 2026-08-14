import "./Accordion.css";

import { useState } from "react";

function Accordion({

    titulo,

    children,

    abertoInicial = false

}) {

    const [aberto, setAberto] = useState(abertoInicial);

    return (

        <div className="accordion">

            <div

                className="accordion-header"

                onClick={() => setAberto(!aberto)}

            >

                <span>{titulo}</span>

                <span className="seta">

                    {aberto ? "▲" : "▼"}

                </span>

            </div>

            {aberto && (

                <div className="accordion-body">

                    {children}

                </div>

            )}

        </div>

    );

}

export default Accordion;