const video = document.getElementById('video');
const recVideo = document.getElementById('rec-video');
const startRecBtn = document.getElementById('start-rec');
const stopRecBtn = document.getElementById('stop-rec');

window.navigator.getUserMedia({
            // video: true
            video: {
                // height: 400
            }
        },
        function(stream){
            video.srcObject = stream;
            let rec = new MediaRecorder(stream);

            startRecBtn.addEventListener('click', () => {
                rec.start();
                // console.log(startRecBtn.style.display);
                startRecBtn.style.display='none';
                stopRecBtn.style.display='block'
            });
            stopRecBtn.addEventListener('click', () => {
                rec.stop();
                stopRecBtn.style.display='none';
                startRecBtn.style.display='block'
            });

            rec.ondataavailable = ({data}) => {
                recVideo.src = window.URL.createObjectURL(data);
            };
        },
        function(err){
            console.log(err);
        }
)