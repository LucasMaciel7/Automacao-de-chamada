import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import GridPresencas from '../components/Gridpresenca';
import CadastrarAlunoModal from '../hooks/cadastrarAlunoModal';
import BaterPontoModal from '../hooks/BaterPontoModal';
import { useNavigate } from "react-router-dom";
import ResumoPresencasModal from '../components/ResumoPresenca';

interface Presenca {
  nome: string;
  ra: string;
  entrada: string | null;
  saida: string | null;
}

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalPontoAberto, setModalPontoAberto] = useState(false);
  const [modalResumoAberto, setModalResumoAberto] = useState(false);

  const buscarPresencas = async () => {
    try {
      const resposta = await fetch("http://localhost:8000/presenca/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (!resposta.ok) throw new Error("Erro ao buscar presenças");
      const dados = await resposta.json();
      setPresencas(dados);
    } catch (erro) {
      console.error("Erro ao carregar presenças:", erro);
    }
  };

  useEffect(() => {

    if (!token) {
      navigate("/"); // redireciona para login
    } else {
      buscarPresencas();
    }
  }, [navigate]);

  const adicionarPresenca = (nova: Presenca) => {
    setPresencas((prev) => {
      const index = prev.findIndex((p) => p.ra === nova.ra);
      if (index !== -1) {
        const atualizada = [...prev];
        atualizada[index] = {
          ...atualizada[index],
          entrada: nova.entrada || atualizada[index].entrada,
          saida: nova.saida || atualizada[index].saida,
        };
        return atualizada;
      }
      return [...prev, nova];
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <Header />

        <div className="flex justify-between mb-4">
          <button onClick={() => setModalCadastroAberto(true)} className="bg-green-600 text-white px-4 py-2 rounded">
            ➕ Cadastrar Aluno
          </button>
          <button onClick={() => setModalPontoAberto(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
            🕓 Bater Ponto
          </button>

           <button onClick={() => setModalResumoAberto(true)} className="bg-purple-600 text-white px-4 py-2 rounded">
              📋 Ver Resumo
           </button>
        </div>

        <GridPresencas presencas={presencas} />

        <CadastrarAlunoModal
          isOpen={modalCadastroAberto}
          onClose={() => setModalCadastroAberto(false)}
        />

        <BaterPontoModal
          isOpen={modalPontoAberto}
          onClose={() => {
            setModalPontoAberto(false);
            buscarPresencas(); // <- atualiza os dados após fechar o modal
          }}
          onPontoRegistrado={adicionarPresenca}
        />
        
        <ResumoPresencasModal
          isOpen={modalResumoAberto}
          onClose={() => setModalResumoAberto(false)}
        />

        
      </div>
    </div>
  );
}
