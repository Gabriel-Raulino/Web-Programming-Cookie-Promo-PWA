let token = "";
let scanner = null;


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registado com sucesso!'))
    .catch(err => console.error('Erro ao registar o Service Worker:', err));
}

const PUBLIC_VAPID_KEY = "COLOQUE_SUA_CHAVE_PUBLICA_AQUI";


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


async function ativarNotificacoes() {

  const permissao = await Notification.requestPermission();
  if (permissao !== "granted") {
    console.log("Notificações bloqueadas pelo utilizador.");
    return;
  }


  const registration = await navigator.serviceWorker.ready;
  

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
  }

  try {
    await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ subscription: subscription })
    });
    console.log("Dispositivo registado com sucesso para sorteios!");
  } catch (erro) {
    console.error("Erro ao guardar a subscrição no servidor", erro);
  }
}

async function fazerLogin() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha })
    });

    const dados = await res.json();

    if (dados.token) {
      token = dados.token;
      

      document.getElementById("login-section").style.display = "none";
      document.getElementById("app-section").style.display = "block";
      document.getElementById("bem-vindo").innerText = `Olá, ${dados.nome}!`;
      
      carregarQrCodes();
      
  
      ativarNotificacoes(); 
    } else {
      alert(dados.error);
    }
  } catch (error) {
    alert("Erro ao ligar ao servidor.");
  }
}


async function carregarQrCodes() {
  const res = await fetch("/api/qrcodes", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const codigos = await res.json();
  
  const lista = document.getElementById("lista-codigos");
  lista.innerHTML = "";
  codigos.forEach(item => {
    lista.innerHTML += `<li>🎫 ${item.codigo}</li>`;
  });
}


function iniciarCamera() {
  if (scanner) return; 

  
  scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } });
  
  scanner.render(async (codigoLido) => {
   
    scanner.clear();
    scanner = null;
    
    try {
      const res = await fetch("/api/qrcode", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ codigo: codigoLido })
      });
      
      const dados = await res.json();
      alert(dados.message || "QR Code processado!");
      

      carregarQrCodes(); 
      
    } catch (error) {
      alert("Erro ao enviar o QR Code.");
    }
  }, (erro) => {

  });
}
