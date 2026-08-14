import {
    getAuth,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import {
    doc,
    getDoc
} from "firebase/firestore";

import app, {
    db
} from "../firebase/firebaseConfig";


const auth = getAuth(app);


/* ============================
   TRANSFORMAR LOGIN
============================ */

function transformarLogin(loginUsuario) {

    const valor =
        String(loginUsuario || "")
            .trim();


    if (valor.includes("@")) {

        return valor;

    }


    return `${valor}@portal-sst.local`;

}


/* ============================
   LOGIN
============================ */

export async function login(
    loginUsuario,
    senha
) {

    const email =
        transformarLogin(
            loginUsuario
        );


    const resultado =
        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );


    const usuario =
        resultado.user;


    const referencia =
        doc(
            db,
            "Usuarios",
            usuario.uid
        );


    const documento =
        await getDoc(
            referencia
        );


    if (!documento.exists()) {

        throw new Error(
            "Usuário autenticado, mas sem cadastro no portal."
        );

    }


    const perfil =
        documento.data();


    return {

        usuario,

        perfil

    };

}


/* ============================
   USUÁRIO AUTENTICADO
============================ */

export function usuarioAtual() {

    return auth.currentUser;

}


/* ============================
   TOKEN DO USUÁRIO AUTENTICADO
============================ */

export async function obterTokenAtual(
    atualizar = false
) {

    const usuario =
        auth.currentUser;


    if (!usuario) {

        throw new Error(
            "Nenhum usuário autenticado."
        );

    }


    return await usuario.getIdToken(
        atualizar
    );

}


/* ============================
   VERIFICAR SE USUÁRIO É ADMIN
============================ */

export async function usuarioEhAdmin() {

    const usuario =
        auth.currentUser;


    if (!usuario) {

        return false;

    }


    const referencia =
        doc(
            db,
            "Usuarios",
            usuario.uid
        );


    const documento =
        await getDoc(
            referencia
        );


    if (!documento.exists()) {

        return false;

    }


    const dados =
        documento.data();


    return dados.perfil === "ADMIN";

}


/* ============================
   SAIR
============================ */

export async function sair() {

    await signOut(auth);

}