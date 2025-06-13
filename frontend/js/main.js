const form = document.getElementById('form')
// const form2 = document.getElementById('form2')
const login= document.getElementById('login')
const logout =document.getElementById("logout")

if(form) {
  form.addEventListener("submit", registerStudent);
}

if(logout){
  logout.addEventListener("click",verifyUserByFace2)
}

if(login) {
  login.addEventListener("click", verifyUserByFace);
}

// form2.addEventListener("submit", verifyUserByRa);

// Fecha o Preview da câmera
const closePreview = () => {
  const preview = document.getElementsByClassName("preview")[0]
  preview.remove()
  StopWebCam()
}

// Cria elemento de video e do canva para câmera
const getPreviewElement = (videoListener, videoWidth, videoHeight) => {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');

  // Definindo as propriedades de largura e altura do vídeo
  video.width = videoWidth ||380; // Defina a largura desejada (300 pixels neste exemplo)
  video.height = videoHeight || 380; // Defina a altura desejada (200 pixels neste exemplo)

  video.setAttribute('autoplay', true);
  video.addEventListener("play", () => videoListener(video, canvas));

  const containerPreview = document.createElement('div');
  containerPreview.className = 'preview';
  containerPreview.append(video);
  containerPreview.append(canvas);

  return {
    video,
    containerPreview,
    canvas
  };
};


// Verifica o usuário pela face
async function verifyUserByFace(e) {
  e.preventDefault()
  const students = await getAllStudents()

  const onPlayVideo = async (video, canvas) => {
    const result = await RenderImage(video, canvas)

    const descriptors = students.map(student => {
      const arrayToPush = []
      Object.keys(student.code).map((key) => arrayToPush.push(student.code[key]))
      return Float32Array.from(arrayToPush)
    })

    const resultCheck = await GetBestMatch(result.descriptor, descriptors)

    if (resultCheck < 0 || !students[resultCheck]) {
      alert('Aluno não encontrado')
    } else {
      alert(`Aluno encontrado - RA: ${students[resultCheck].ra}`)
      adicionaAlunoLista(students[resultCheck].name, students[resultCheck].ra)
      students.splice(resultCheck, 1)
    }

    closePreview()
  }

  function adicionaAlunoLista(name, ra) {
    const divLista = document.getElementById('ponto_entrada')
    const p = document.createElement('p')
    const label = document.createTextNode(`${name} - Horário: ${new Date().getHours()}:${new Date().getMinutes()}`)
    p.appendChild(label)
    divLista.appendChild(p)
  }

  const { containerPreview, video } = getPreviewElement(onPlayVideo)
  //document.body.appendChild(containerPreview)
  const divEntrada = document.getElementById('div-camera')
  divEntrada.appendChild(containerPreview)
  await StartFaceApi()
  await StartWebCam(video)
}


async function verifyUserByFace2(e) {
  e.preventDefault()
  const students = await getAllStudents()

  const onPlayVideo = async (video, canvas) => {
    const result = await RenderImage(video, canvas)

    const descriptors = students.map(student => {
      const arrayToPush = []
      Object.keys(student.code).map((key) => arrayToPush.push(student.code[key]))
      return Float32Array.from(arrayToPush)
    })

    const resultCheck = await GetBestMatch(result.descriptor, descriptors)

    if (resultCheck < 0 || !students[resultCheck]) {
      alert('Aluno não encontrado')
    } else {
      alert(`Aluno encontrado - RA: ${students[resultCheck].ra}`)
      adicionaAlunoLista(students[resultCheck].name, students[resultCheck].ra)
      students.splice(resultCheck, 1)
    }

    closePreview()
  }

  function adicionaAlunoLista(name, ra) {
    const divLista = document.getElementById('ponto_saida')
    const p = document.createElement('p')
    const label = document.createTextNode(`${name} - Horário: ${new Date().getHours()}:${new Date().getMinutes()}`)
    p.appendChild(label)
    divLista.appendChild(p)
  }

  const { containerPreview, video } = getPreviewElement(onPlayVideo)
  const divCamera = document.getElementById('div-camera')
  divCamera.appendChild(containerPreview)
  await StartFaceApi()
  await StartWebCam(video)
}
// Verifica face do usuário pelo ra
async function verifyUserByRa(e) {
  e.preventDefault()
  // const ra = document.getElementById('ra-validator').value

  // if (!ra) {
  //   alert('Preencha o RA!')
  //   return
  // }

  // const student = await getStudentByRa(ra)

  // if (!student) {
  //   alert('Aluno sem cadastro.')
  //   return
  // }

  const onPlayVideo = async (video, canvas, student) => {
    const result = await RenderImage(video, canvas)

    const arrayToPush = []
    Object.keys(student.code).map((key) => arrayToPush.push(student.code[key]))

    const resultCheck = await VerifyImage(Float32Array.from(arrayToPush), result.descriptor)
    if (resultCheck) {
      alert('user match');
    } else {
      alert('user do not match');
    }

    closePreview()
  }

  const { containerPreview, video } = getPreviewElement((video, canvas) => onPlayVideo(video, canvas, student))
  document.body.appendChild(containerPreview)

  await StartFaceApi()
  await StartWebCam(video)
}

// Cadastro do usuário
async function registerStudent(e) {
  e.preventDefault()

  const ra = document.getElementById('ra').value
  const name = document.getElementById('name').value

  if (!ra || !name) {
    alert('Preencha todos os dados!')
    return
  }

  const onPlayVideo = async (video, canvas, ra, name) => {
    const result = await RenderImage(video, canvas)
    saveStudent(ra, result.score, result.descriptor, name)
    alert(`RA: ${ra}, cadastrado com sucesso!`)

    closePreview()
  }

  const { containerPreview, video } = getPreviewElement((video, canvas) => onPlayVideo(video, canvas, ra, name))
  document.body.appendChild(containerPreview)

  await StartFaceApi()
  await StartWebCam(video)
}

//  ---- localstorage -------------------------------------------

// Busca todos os aluno salvos no localstorage
export const getAllStudents = () => {
  const students = localStorage.getItem("students")

  if (!students) {
    return []
  }

  return JSON.parse(students)
}

// salva um aluno no localStorage
export const saveStudent = (ra, score, code, name) => {
  const students = getAllStudents()

  const student = getStudentByRa(ra)

  if (student) {
    localStorage.setItem("students", JSON.stringify(students.map(item => {
      if (item.ra === ra) {
        item.score = score;
        item.code = code;
        item.name = name
      }
      return item
    })))
    return
  }

  students.push({ ra, code: code, score, name })
  localStorage.setItem("students", JSON.stringify(students))
}

// Busca um aluno do localStorage pelo RA
export const getStudentByRa = (ra) => {
  const students = getAllStudents()
  return students.find(item => item.ra === ra)
}

//  ---- webcam -------------------------------------------------

let currentStream = undefined

// Ininia a captura de vídeo pelo webcam do usuário
export async function StartWebCam(video) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        currentStream = stream;
        video.srcObject = stream;
        resolve()
      })
      .catch((error) => {
        console.error('Error accessing the webcam:', error);
        reject(error)
      });
  })
}

// Finaliza a captura de vídeo da webcam do usuário
export async function StopWebCam() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop())
  }
}

//  ---- face api -------------------------------------------------

// Inicia os recursos do face-api, deve ser executado antes de qualquer uso da lib
export async function StartFaceApi() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  ]);
}

// Retorna o index de um array de rostos (detections2), qual o rosto pertence ao detections1.
// Essa função retorna o indice do array, neste caso, -1 é retornado quando o rosto não foi encontrado.
export async function GetBestMatch(detections1, detections2, threshold = 0.6) {
  const faceMatcher = new faceapi.FaceMatcher(detections1);
  const results = detections2.map(descriptor => faceMatcher.findBestMatch(descriptor));
  const person = results.findIndex(item => item.label === 'person 1' && item.distance < threshold)
  return person
}

// Verifica se 2 rostos - (face1 e face2), são a mesma pessoa. threshold é o parâmetro para definição do grau de confiabilidade
export async function VerifyImage(face1, face2, threshold = 0.6) {
  if (face1 && face2) {
    const euclideanDistance = faceapi.euclideanDistance(face1, face2);

    if (euclideanDistance < threshold) {
      return true
    } else {
      return false
    }
  } else {
    throw "Not Face"
  }
}

// Executa a busca do rosto pelo face-api, ao encontrar um rosto, será retornado os dados relacionados aquele rosto
export async function RenderImage(video, canvas) {
  const ctx = canvas.getContext('2d');

  canvas.width = video.width || 640;
  canvas.height = video.height || 480;

  const displaySize = { width: video.width || 640, height: video.height || 480 };

  faceapi.matchDimensions(canvas, displaySize);

  const result = await new Promise((resolve, reject) => {

    const tryGetFace = async () => {
      const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);

      // Capture an image when a face is detected
      if (detections.length > 0) {
        const capturedImageDataUrl = canvas.toDataURL('image/jpeg');

        // Display the base64-encoded image
        const capturedImage = new Image();
        capturedImage.src = capturedImageDataUrl;
      }

      if (detections.length) {
        resolve({
          score: detections[0].detection.score,
          descriptor: detections[0].descriptor
        })
        return
      }

      setTimeout(tryGetFace, 100)
    }
    tryGetFace()
  })

  return result
}
