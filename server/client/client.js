const publicVapidKey =
    "BAomWl075gntTctOq_5wawh3PaG_Vip3L9Gww-cQgq5jkU1Ip0ouTxsNWaQqJqqCWXzK_q3SEAqLnOTzy5UxFhU";
// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err));
}
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function send() {
    const register = await navigator.serviceWorker.register("/worker", {
        scope: "/",
    });
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    await fetch("/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
    });
}
