import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPontoRegistrado: (ponto: {
    nome: string;
    ra: string;
    entrada: string;
    saida: string;
  }) => void;
}


export default function BaterPontoModal({ isOpen, onClose, onPontoRegistrado }: Props) {
  const [ra, setRa] = useState("");
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [carregandoCamera, setCarregandoCamera] = useState(true);
  const token = localStorage.getItem("access_token")
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Erro ao acessar a câmera.");
    }
  };

const pararCamera = () => {

  const video = videoRef.current;

  if (video?.srcObject) {
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => {
      track.stop();
    });

    video.srcObject = null; // 🔑 Remover referência da câmera
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

  const enviarPonto = async () => {
    if (!ra || !fotoBase64) {
      alert("Digite o RA e capture a foto.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/ponto/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          Authorization: ` Bearer ${token}`
        },
        body: JSON.stringify({ ra, imagem_base64: fotoBase64 }),
     
      });

      const result = await response.json();
      const dados = result.dados;

      if (dados.status === "sucesso") {
        onPontoRegistrado({
          nome: dados.nome,
          ra: dados.ra,
          entrada: dados.tipo === "entrada" ? dados.hora : "",
          saida: dados.tipo === "saida" ? dados.hora : "",
        });
        toast.success("Ponto registrado com sucesso")
      } else {
        toast.error(dados.mensagem || "Erro ao registrar ponto.");
        fecharModal();
      }

      fecharModal();
    } catch (err) {
      toast.error("Erro ao registrar ponto.");
      console.error(err);
      fecharModal()
    }
  };

  const fecharModal = () => {
    pararCamera();
    setRa("");
    setFotoBase64(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) startCamera();
    else {
      pararCamera()
    }
    return () => pararCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">Bater Ponto</h2>
        <input className="border p-2 mb-4 w-full" placeholder="RA" value={ra} onChange={(e) => setRa(e.target.value)} />

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
          <button onClick={enviarPonto} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            🕓 Enviar Ponto
          </button>
        </div>

        <button onClick={fecharModal} className="absolute top-2 right-4 text-red-600 text-xl">×</button>
      </div>
    </div>
  );
}
