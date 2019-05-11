const video = document.getElementById('video');
const recVideo = document.getElementById('rec-video');
const startRecBtn = document.getElementById('start-rec');
const stopRecBtn = document.getElementById('stop-rec');
const downloadBtn = document.getElementById('download');

window.navigator.getUserMedia({
            // video: true
            // OR
            video: {
                // height: 400
                // width: 600
            }
        },
        function(stream){
            video.srcObject = stream;
            let rec = new MediaRecorder(stream);

            startRecBtn.addEventListener('click', () => {
                rec.start();
                startRecBtn.style.display='none';
                stopRecBtn.style.display='block';
            });
            stopRecBtn.addEventListener('click', () => {
                rec.stop();
                stopRecBtn.style.display='none';
                startRecBtn.style.display='block';
            });

            rec.ondataavailable = ({data}) => {
                let blob = new Blob([data], { 'type': 'video/mp4;' });
                recVideo.src = window.URL.createObjectURL(blob);
                downloadBtn.parentElement.style.display = 'block';
                downloadBtn.parentElement.href = recVideo.src;
            };
        },
        function(err){
            console.log(err);
        }
)