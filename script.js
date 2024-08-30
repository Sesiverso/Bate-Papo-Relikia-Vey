// Importar funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAfVXG-xIe4FyPpsNTtmV__HutzOQFgaVQ",
  authDomain: "votacao-da4e2.firebaseapp.com",
  projectId: "votacao-da4e2",
  storageBucket: "votacao-da4e2.appspot.com",
  messagingSenderId: "696185234268",
  appId: "1:696185234268:web:37e1ddd097dfeea95a9799",
  measurementId: "G-PY9XXN0ESV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Função para enviar uma mensagem
const sendMessage = async () => {
  const messageInput = document.getElementById('message-input');
  const fileInput = document.getElementById('file-input');
  const message = messageInput.value.trim();

  if (message === '' && fileInput.files.length === 0) {
    alert('Digite uma mensagem ou selecione um arquivo.');
    return;
  }

  const username = localStorage.getItem('username');
  const profileImage = localStorage.getItem('profileImage');

  let fileUrl = '';
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileName = Date.now() + '-' + file.name;
    const fileRef = storageRef(storage, fileName);
    await uploadBytes(fileRef, file);
    fileUrl = await getDownloadURL(fileRef);
  }

  const messageData = {
    username: username,
    image: profileImage,
    message: message,
    file: fileUrl
  };

  push(ref(database, 'messages'), messageData);

  messageInput.value = '';
  fileInput.value = '';
};

// Função para exibir mensagens no chat
const displayMessages = () => {
  onValue(ref(database, 'messages'), (snapshot) => {
    const messages = snapshot.val();
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';

    for (const id in messages) {
      const msg = messages[id];
      const messageDiv = document.createElement('div');
      const profileImg = document.createElement('img');
      const messageText = document.createElement('div');
      
      profileImg.src = msg.image;
      profileImg.className = 'profile-img'; // Classe para estilizar a imagem do perfil
      
      messageText.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`;
      
      if (msg.file) {
        const fileElement = document.createElement('a');
        fileElement.href = msg.file;
        fileElement.target = '_blank';
        fileElement.innerText = 'Arquivo';
        fileElement.className = 'file';
        messageDiv.appendChild(fileElement);
      }

      messageDiv.appendChild(profileImg);
      messageDiv.appendChild(messageText);
      messagesContainer.appendChild(messageDiv);
    }
  });
};

// Configura eventos
document.getElementById('send-button').addEventListener('click', sendMessage);
window.onload = displayMessages;  // Carrega as mensagens quando a página é carregada
