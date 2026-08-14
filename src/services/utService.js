import { db } from "../firebase/firebaseConfig";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// =======================
// Salvar nova UT
// =======================
export async function salvarUT(ut) {
  const documento = doc(db, "UTs", ut.numeroUT);

  const existe = await getDoc(documento);

  if (existe.exists()) {
    throw new Error("Já existe uma UT cadastrada com este número.");
  }

  await setDoc(documento, {
    ...ut,
    criadoEm: new Date().toISOString(),
  });
}

// =======================
// Listar UTs
// =======================
export async function listarUTs() {
  const snapshot = await getDocs(collection(db, "UTs"));

  const lista = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

lista.sort((a, b) =>
  a.numeroUT.localeCompare(b.numeroUT)
);

return lista;
}

// =======================
// Atualizar UT
// =======================
export async function atualizarUT(numeroUT, dados) {
  const documento = doc(db, "UTs", numeroUT);

  await updateDoc(documento, {
    ...dados,
    atualizadoEm: new Date().toISOString(),
  });
}

// =======================
// Excluir UT
// =======================
export async function excluirUT(numeroUT) {
  const documento = doc(db, "UTs", numeroUT);

  await deleteDoc(documento);
}