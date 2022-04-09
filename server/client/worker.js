self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log("Push Recieved...");
    self.registration.showNotification(`${data.title} ${data.date}`, {
        body: " Постуудыг мань тухлан уншаарай. ",
        icon: "https://itgelt-is-blogging.herokuapp.com/favicon.ico",
    });
});
