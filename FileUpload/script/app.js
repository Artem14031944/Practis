import { upload } from './upload.js';
import  firebase  from 'firebase/app';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAE10E64AaMdd-OtDlJ9KYoUFkn6MJ-lBc",
    authDomain: "fn-upload.firebaseapp.com",
    projectId: "fn-upload",
    storageBucket: "fn-upload.appspot.com",
    messagingSenderId: "954749990121",
    appId: "1:954749990121:web:67e8d09b315ae9a74e6c78"
};
  
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task =  ref.put(file)
       
            task.on('state_changed', snapshot => {
                const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage; 
            }, err => {
                console.log(err);
            }, () => {
                task.snapshot.ref.getDownloadURL()
                .then(res => console.log(res, 'res'))
            })
        });
    }
 });