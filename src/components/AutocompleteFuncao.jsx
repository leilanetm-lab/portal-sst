import { useEffect, useRef, useState } from "react";
import { funcoes } from "../data/funcoes";

function AutocompleteFuncao({

    value,

    onChange,

    abrirModal

}) {

    const [texto, setTexto] = useState(value || "");
    const [lista, setLista] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {

        setTexto(value || "");

    }, [value]);

    useEffect(() => {

        function clicarFora(event){

            if(
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ){

                setMostrarLista(false);

            }

        }

        document.addEventListener("mousedown", clicarFora);

        return ()=>{

            document.removeEventListener("mousedown", clicarFora);

        };

    }, []);

    function pesquisar(valor){

        setTexto(valor);

        onChange(valor);

        if(valor.trim()===""){

            setLista(funcoes.slice(0,20));

            return;

        }

        const resultado = funcoes.filter((funcao)=>

            funcao
                .toLowerCase()
                .includes(valor.toLowerCase())

        );

        setLista(resultado);

    }

    return(

        <div
            className="autocomplete"
            ref={containerRef}
        >

            <input

                type="text"

                placeholder="Digite a função..."

                value={texto}

                onFocus={()=>{

                    setMostrarLista(true);

                    if(texto===""){

                        setLista(funcoes.slice(0,20));

                    }

                }}

                onChange={(e)=>{

                    pesquisar(e.target.value);

                    setMostrarLista(true);

                }}

            />

            {

                mostrarLista &&(

                    <div className="autocomplete-lista">

                        {

                            lista.length>0 ? (

                                lista.map((funcao)=>(

                                    <div

                                        key={funcao}

                                        className="autocomplete-item"

                                        onClick={()=>{

                                            setTexto(funcao);

                                            onChange(funcao);

                                            setMostrarLista(false);

                                        }}

                                    >

                                        {funcao}

                                    </div>

                                ))

                            )

                            :

                            (

                                <div className="autocomplete-vazio">

                                    <p>

                                        Nenhuma função encontrada.

                                    </p>

                                    <button

                                        type="button"

                                        className="btnSolicitar"

                                        onClick={()=>{

                                            setMostrarLista(false);

                                            abrirModal();

                                        }}

                                    >

                                        📩 Solicitar cadastro de nova função

                                    </button>

                                </div>

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}

export default AutocompleteFuncao;