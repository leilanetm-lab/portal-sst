import { useEffect, useMemo, useRef, useState } from "react";

import fisicos from "./dadosRiscos/fisicos";
import quimicos from "./dadosRiscos/quimicos";
import biologicos from "./dadosRiscos/biologicos";
import acidentes from "./dadosRiscos/acidentes";
import ergonomicos from "./dadosRiscos/ergonomicos";

function normalizar(texto = "") {

    return texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase();

}

function AutocompleteRisco({

    categoria,

    value,

    onChange

}) {

    const [mostrarLista, setMostrarLista] = useState(false);

    const [indiceSelecionado, setIndiceSelecionado] = useState(-1);

    const listaRef = useRef(null);

    const lista = useMemo(() => {

        switch (categoria) {

            case "fisicos":

                return fisicos;

            case "quimicos":

                return quimicos;

            case "biologicos":

                return biologicos;

            case "acidente":

                return acidentes;

            case "ergonomico":

                return ergonomicos;

            default:

                return [];

        }

    }, [categoria]);

    const resultados = useMemo(() => {

        if (!value?.trim()) return [];

        const pesquisa = normalizar(value);

        return lista

            .filter(item =>

                normalizar(item.nome).includes(pesquisa)

            )

            .slice(0,15);

    }, [value, lista]);

    useEffect(() => {

        setIndiceSelecionado(-1);

    }, [value]);

    useEffect(() => {

        if (

            indiceSelecionado >= 0 &&

            listaRef.current

        ){

            const elemento = listaRef.current.children[indiceSelecionado];

            elemento?.scrollIntoView({

                block:"nearest"

            });

        }

    }, [indiceSelecionado]);

    function selecionar(item){

        onChange(item.nome);

        setMostrarLista(false);

        setIndiceSelecionado(-1);

    }

    function tecla(e){

        if(!mostrarLista) return;

        switch(e.key){

            case "ArrowDown":

                e.preventDefault();

                setIndiceSelecionado(atual=>

                    Math.min(

                        atual+1,

                        resultados.length-1

                    )

                );

                break;

            case "ArrowUp":

                e.preventDefault();

                setIndiceSelecionado(atual=>

                    Math.max(

                        atual-1,

                        0

                    )

                );

                break;

            case "Enter":

                if(indiceSelecionado>=0){

                    e.preventDefault();

                    selecionar(

                        resultados[indiceSelecionado]

                    );

                }

                break;

            case "Escape":

                setMostrarLista(false);

                break;

            default:

                break;

        }

    }
        return (

        <div className="autocomplete">

            <input

                type="text"

                value={value}

                autoComplete="off"

                disabled={!categoria}

                placeholder={

                    categoria

                        ? "Digite o risco..."

                        : "Selecione primeiro a categoria"

                }

                onFocus={() => {

                    if (categoria) {

                        setMostrarLista(true);

                    }

                }}

                onBlur={() => {

                    setTimeout(() => {

                        setMostrarLista(false);

                    }, 150);

                }}

                onKeyDown={tecla}

                onChange={(e) => {

                    onChange(e.target.value);

                    setMostrarLista(true);

                }}

            />

            {

                mostrarLista &&

                resultados.length > 0 && (

                    <div

                        className="listaAutocomplete"

                        ref={listaRef}

                    >

                        {

                            resultados.map((item, index) => (

                                <div

                                    key={item.id}

                                    className={`itemAutocomplete ${

                                        indiceSelecionado === index

                                            ? "ativo"

                                            : ""

                                    }`}

                                    onMouseEnter={() =>

                                        setIndiceSelecionado(index)

                                    }

                                    onMouseDown={() =>

                                        selecionar(item)

                                    }

                                >

                                    {item.nome}

                                </div>

                            ))

                        }

                    </div>

                )

            }

            {

                mostrarLista &&

                value &&

                resultados.length === 0 && (

                    <div className="listaAutocomplete">

                        <div className="itemAutocomplete vazio">

                            Nenhum risco encontrado.

                        </div>

                    </div>

                )

            }

        </div>

    );

}

export default AutocompleteRisco;