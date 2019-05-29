let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext('2d');
context.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
// context.fillRect(20, 20, 150, 150);
// context.beginPath();
// context.moveTo(50, 300);
// context.lineTo(300, 50);
// context.lineTo(300, 60);
// context.lineTo(320, 60);
// context.lineTo(300, 70);
// context.lineTo(300, 80);
// context.strokeStyle = 'navy';
// context.stroke();

// function drawRandomCircles(){
//     requestAnimationFrame(drawRandomCircles);
//     this.rx = Math.random() * window.innerWidth;
//     this.ry = Math.random() * window.innerHeight;
//     this.xr = Math.random() * 100;
//     this.yr = Math.random() * 100;
//     context.clearRect(this.rx, this.ry, this.xr, this.yr);
//     this.putFrame = function(){
//         for(let i=0;i<10; i++){
//             context.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
//             this.x = Math.random() * window.innerWidth;
//             this.y = Math.random() * window.innerHeight;
//             this.b = Math.random() * 2;
//             this.e = Math.random() * 2;
//             this.r = Math.random() * 10;
//             context.beginPath();
//             context.arc(this.x, this.y, this.r, Math.PI * 0, Math.PI * 2, true);
//             context.fill();
//             context.stroke();
//         }
//     }
//     this.putFrame();
// }
// drawRandomCircles();

function getColor(c){
    let colors = [];
    colors[0] = Number.parseFloat(c.substr(5, 70).split(',')[0]);
    colors[1] = Number.parseFloat(c.substr(5, 70).split(',')[1]);
    colors[2] = Number.parseFloat(c.substr(5, 70).split(',')[2]);
    colors[3] = Number.parseFloat(c.substr(5, 70).split(',')[3]);
    colors[0]=(colors[0]+Math.random()*10)%255;
    colors[1]=(colors[1]+Math.random()*10)%255;
    colors[2]=(colors[2]+Math.random()*10)%255;
    colors[3]=1;// (Math.random() * 0.5) + 0.5;
    return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
}

function putCircle({x, y, r, sa, ea, dx, dy, c, d = true}){
    if(x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0){
        c = getColor(c);
    }
    context.fillStyle = c;
    context.beginPath();
    context.arc(x, y, r, Math.PI / 180 * sa, Math.PI / 180 * ea, d);
    context.fill();
    context.stroke();
    return {
        x, y, r, sa, ea, dx, dy, d, c
    }
}

function putCircles(n){
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let circles = [];
    if(typeof n === 'object'){
        circles = n;
    }
    else {
        for(let i=0;i<n;i++){
            circles.push({
                x: Math.random()*window.innerWidth,
                y: Math.random()*window.innerHeight,
                r: Math.random()*15,
                sa: 0,
                ea: 360,
                dx: (Math.random() - 0.5)*10,
                dy: (Math.random() - 0.5)*10,
                c: `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255}, ${Math.random()*1})`
            });
        }
    }
    
    for(let i=0;i<circles.length;i++){
        circles[i] = putCircle(circles[i]);

        if(circles[i].x > window.innerWidth || circles[i].x < 0) circles[i].dx*=-1;
        if(circles[i].y > window.innerHeight || circles[i].y < 0) circles[i].dy*=-1;

        circles[i].x+=circles[i].dx;
        circles[i].y+=circles[i].dy;
    }
    return circles;
}
var circles = putCircles(100);
(function animate(){
    requestAnimationFrame(animate);
    circles = putCircles(circles);
})()