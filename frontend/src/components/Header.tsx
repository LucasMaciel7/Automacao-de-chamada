import React from "react";
import CadastroAlunoModal from "../hooks/cadastrarAlunoModal";
import { useState } from "react";

export default function Header() {
  
    const [modalAberto, setModalAberto] = useState(false);

  
    const handleCadastro = () => {
    alert("Cadastro de presenças ainda não implementado");
  };



  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Sistema de Presença</h1>
        <p className="text-sm text-gray-500 mt-1 mb-4">Registre sua entrada e saída com reconhecimento facial</p>

      
      </div>

      <CadastroAlunoModal isOpen={modalAberto} onClose={() => setModalAberto(false)} />
    </>
  );
}

