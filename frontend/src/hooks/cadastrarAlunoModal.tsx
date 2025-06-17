import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CadastroAlunoModal({ isOpen, onClose }: Props) {
  const [nome, setNome] = useState("");
  const [ra, setRa] = useState("");
  const [email, setEmail] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Erro ao acessar a câmera.");
    }
  };

  const pararCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturarFoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setFotoBase64(dataUrl);
    }
  };

  const enviarCadastro = async () => {
    if (!fotoBase64 || !nome || !ra || !email) {
      alert("Preencha todos os campos e capture uma foto.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/alunos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, ra, image_base64: fotoBase64 }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar aluno.");

      toast.success("Aluno cadastrado com sucesso!");
      fecharModal();
    } catch (error) {
      toast.error("Falha ao cadastrar aluno.");
      console.error(error);
    }
  };

  const fecharModal = () => {
    pararCamera();
    setNome("");
    setRa("");
    setEmail("");
    setFotoBase64(null);
    onClose();
  };

  // Inicia a câmera quando o modal abre
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      pararCamera();
    }
    // cleanup automático ao desmontar o modal
    return () => pararCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">Cadastrar Aluno</h2>

        <input className="border p-2 mb-2 w-full" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="border p-2 mb-2 w-full" placeholder="RA" value={ra} onChange={(e) => setRa(e.target.value)} />
        <input className="border p-2 mb-4 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        {!fotoBase64 ? (
          <video ref={videoRef} autoPlay className="w-full mb-2 rounded" />
        ) : (
          <img src={fotoBase64} alt="Foto capturada" className="w-full mb-2 rounded shadow" />
        )}
        <canvas ref={canvasRef} hidden />

        <div className="flex justify-between items-center">
          <button onClick={capturarFoto} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            📸 Capturar Foto
          </button>
          <button onClick={enviarCadastro} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ✅ Cadastrar
          </button>
        </div>

        <button onClick={fecharModal} className="absolute top-2 right-4 text-red-600 text-xl">×</button>
      </div>
    </div>
  );
}
