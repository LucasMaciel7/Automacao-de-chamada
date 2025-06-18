import React, { useEffect, useState } from "react";

interface PresencaItem {
  aluno: string;
  ra: string;
  disciplina: string;
  professor: string;
  entrada: string;
  saida: string;
  tempo_presente_minutos: number;
  duracao_aula_minutos: number;
  status: "Presente" | "Ausente";
}

type PresencasPorAluno = {
  [ra: string]: PresencaItem[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumoPresencasModal({ isOpen, onClose }: Props) {
  const [presencas, setPresencas] = useState<PresencasPorAluno>({});
  const [carregando, setCarregando] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setCarregando(true);
      try {
        const resposta = await fetch("http://localhost:8000/ponto/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dados = await resposta.json();
        setPresencas(dados);
      } catch (err) {
        console.error("Erro ao buscar resumo:", err);
      } finally {
        setCarregando(false);
      }
    };

    fetchData();
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex justify-center items-center z-50 overflow-auto p-6">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-lg font-bold text-red-500"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">📋 Resumo de Presenças</h2>

        {carregando ? (
          <p>Carregando...</p>
        ) : (
          Object.entries(presencas).map(([ra, registros]) => (
            <div key={ra} className="mb-6 border rounded p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">
                {registros[0].aluno} - RA: {ra}
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Disciplina</th>
                    <th className="border p-2">Professor</th>
                    <th className="border p-2">Entrada</th>
                    <th className="border p-2">Saída</th>
                    <th className="border p-2">Presente (min)</th>
                    <th className="border p-2">Duração (min)</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((r, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border p-2">{r.disciplina}</td>
                      <td className="border p-2">{r.professor}</td>
                      <td className="border p-2">{r.entrada}</td>
                      <td className="border p-2">{r.saida}</td>
                      <td className="border p-2">{r.tempo_presente_minutos}</td>
                      <td className="border p-2">{r.duracao_aula_minutos}</td>
                      <td className={`border p-2 font-bold ${r.status === "Presente" ? "text-green-600" : "text-red-500"}`}>
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
