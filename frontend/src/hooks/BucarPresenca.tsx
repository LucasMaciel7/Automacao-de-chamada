import React, { useEffect, useState } from "react";
import GridPresencas from "../components/Gridpresenca"; // ajuste o caminho conforme seu projeto

interface Presenca {
  nome: string;
  ra: string;
  entrada: string | null;
  saida: string | null;
}

export default function App() {
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPresencas = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/presenca");
        if (!resposta.ok) {
          throw new Error("Erro ao buscar presenças");
        }

        const dados = await resposta.json();
        setPresencas(dados);
      } catch (erro) {
        console.error("Erro:", erro);
      } finally {
        setLoading(false);
      }
    };

    buscarPresencas();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Registros de Ponto</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <GridPresencas presencas={presencas} />
      )}
    </div>
  );
}
