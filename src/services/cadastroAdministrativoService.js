import { db } from "../firebase/firebaseConfig";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc
} from "firebase/firestore";


/* ============================
   BUSCAR CADASTRO
============================ */

export async function buscarCadastro(numeroUT) {

    if (!numeroUT) {

        return null;

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    const cadastro =
        await getDoc(documento);


    if (cadastro.exists()) {

        return {

            id: cadastro.id,

            ...cadastro.data()

        };

    }


    return null;

}


/* ============================
   SALVAR CADASTRO
============================ */

export async function salvarCadastro(
    numeroUT,
    dados
) {

    if (!numeroUT) {

        throw new Error(
            "Número da UT não informado."
        );

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    const dadosSalvar = {

        ...dados,

        numeroUT:
            String(numeroUT),

        atualizadoEm:
            new Date().toISOString()

    };


    console.log(
        "Salvando Cadastro Administrativo:",
        dadosSalvar
    );


    await setDoc(
        documento,
        dadosSalvar,
        {
            merge: true
        }
    );


    console.log(
        "Cadastro Administrativo salvo:",
        numeroUT
    );


    return {

        id: String(numeroUT),

        ...dadosSalvar

    };

}


/* ============================
   ATUALIZAR CADASTRO
============================ */

export async function atualizarCadastro(
    numeroUT,
    dados
) {

    if (!numeroUT) {

        throw new Error(
            "Número da UT não informado."
        );

    }


    const documento = doc(
        db,
        "CadastrosAdministrativos",
        String(numeroUT)
    );


    const dadosAtualizar = {

        ...dados,

        numeroUT:
            String(numeroUT),

        atualizadoEm:
            new Date().toISOString()

    };


    console.log(
        "Atualizando Cadastro Administrativo:",
        dadosAtualizar
    );


    await updateDoc(
        documento,
        dadosAtualizar
    );


    console.log(
        "Cadastro Administrativo atualizado:",
        numeroUT
    );


    return {

        id: String(numeroUT),

        ...dadosAtualizar

    };

}