self.addEventListener("install", (event) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log('[Service Worker] Ativado');
});


self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const promiseChain = clients.openWindow("/");
  event.waitUntil(promiseChain);
});


self.addEventListener("push", function (event) {
  const data = event.data?.json() ?? {};
  let message = data.message || "Você tem uma nova mensagem!";
  
  event.waitUntil(
    self.registration.showNotification("Promoção Biscoitos X", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png",
      tag: "promo-x",
    })
  );
});
