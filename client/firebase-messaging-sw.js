    importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

    const firebaseConfig = {
        apiKey: "AIzaSyBQbtasdqdHMLKjKiinQaq4wto5xFOmdA8",
        authDomain: "login-3207d.firebaseapp.com",
        projectId: "login-3207d",
        storageBucket: "login-3207d.firebasestorage.app",
        messagingSenderId: "1095038246480",
        appId: "1:1095038246480:web:5e2c3a692d2ccb64893b55"
    };

    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Test';

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
        console.log("Background message received:", payload);
    
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: "/path-to-icon.png", // Optional
        };
    
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
    self.registration.showNotification(notificationTitle, notificationOptions);
    });