import React from "react";

interface Presenca {
  nome: string;
  ra: string;
  entrada: string | null;
  saida: string | null;
}

interface Props {
  presencas: Presenca[]; // Recebe do componente pai
}

export default function GridPresencas({ presencas }: Props) {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="text-left p-3 border border-gray-300">Nome</th>
          <th className="text-left p-3 border border-gray-300">RA</th>
          <th className="text-left p-3 border border-gray-300">Entrada</th>
          <th className="text-left p-3 border border-gray-300">Saída</th>
        </tr>
      </thead>
      <tbody>
        {presencas.map((p, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="p-3 border border-gray-300">{p.nome}</td>
            <td className="p-3 border border-gray-300">{p.ra}</td>
            <td className="p-3 border border-gray-300">{p.entrada || "-"}</td>
            <td className="p-3 border border-gray-300">{p.saida || "Em aberto"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
