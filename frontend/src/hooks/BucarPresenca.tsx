import React, { useEffect, useState } from "react";

interface Presenca {
  nome: string;
  ra: string;
  entrada: string | null;
  saida: string | null;
}

export default function App() {
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const buscarPresencas = async () => {
      try {
        const resposta = await fetch("http://localhost:8000/presenca", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`, 
          },
        });

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
  }, [token]); // adiciona token como dependência se quiser garantir atualização

  return (
    <div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {presencas.map((p, index) => (
            <li key={index}>
              {p.nome} - {p.ra} | Entrada: {p.entrada ?? "-"} | Saída: {p.saida ?? "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
