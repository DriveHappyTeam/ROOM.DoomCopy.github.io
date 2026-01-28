// game.js

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// mapas de niveles
let maps = [
  [ // nivel 1
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
  ],
  [ // nivel 2 laberinto
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,1],
    [1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,1],
    [1,1,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,1]
  ],
  [ // nivel 3 laberinto grande y difícil
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

let level = 0;
let map = maps[level];

let player = {x:3.5, y:3.5, dir:0, bullets:[], hp:100};
let aliens = [];
let keys = {};

function spawnAliens(num){
  aliens=[];
  for(let i=0;i<num;i++){
    aliens.push({x:Math.random()*5+1,y:Math.random()*3+1,alive:true});
  }
}
spawnAliens(3);

// raycasting paredes
function castRays(){
  for(let col=0; col<canvas.width; col++){
    let angle = (player.dir - Math.PI/6) + (col/canvas.width)*(Math.PI/3);
    let dist=0, hit=false;
    let x=player.x, y=player.y;
    while(!hit && dist<20){
      x+=Math.cos(angle)*0.05;
      y+=Math.sin(angle)*0.05;
      dist+=0.05;
      if(map[Math.floor(y)][Math.floor(x)]===1) hit=true;
    }
    let h = 200/dist;
    ctx.fillStyle=`rgb(${50+200/dist},${50},${50})`;
    ctx.fillRect(col,(canvas.height/2)-h/2,1,h);
  }
}

// aliens rojos
function drawAliens(){
  aliens.forEach(a=>{
    if(a.alive){
      let dx=a.x-player.x, dy=a.y-player.y;
      let dist=Math.sqrt(dx*dx+dy*dy);
      let angle=Math.atan2(dy,dx)-player.dir;
      if(angle>-Math.PI/6 && angle<Math.PI/6){
        let size=100/dist;
        let x=(canvas.width/2)+(angle/(Math.PI/3))*canvas.width;
        ctx.fillStyle="red";
        ctx.fillRect(x-size/2,canvas.height/2-size/2,size,size);
      }
    }
  });
}

// balas verdes
function drawBullets(){
  ctx.fillStyle="lime";
  player.bullets.forEach(b=>{
    let dx=b.x-player.x, dy=b.y-player.y;
    let dist=Math.sqrt(dx*dx+dy*dy);
    let angle=Math.atan2(dy,dx)-player.dir;
    if(angle>-Math.PI/6 && angle<Math.PI/6){
      let size=20/dist;
      let x=(canvas.width/2)+(angle/(Math.PI/3))*canvas.width;
      ctx.fillRect(x-size/2,canvas.height/2-size/2,size,size);
    }
  });
}

// manos verdes y pistola gris
function drawWeapon(){
  ctx.fillStyle="green";
  ctx.fillRect(canvas.width/2-80, canvas.height-80, 60,60);
  ctx.fillRect(canvas.width/2+20, canvas.height-80, 60,60);
  ctx.fillStyle="gray";
  ctx.fillRect(canvas.width/2-20, canvas.height-120, 40,60);
}

// HUD vida
function drawHUD(){
  ctx.fillStyle="red";
  ctx.fillRect(20,20,player.hp*2,20);
  ctx.strokeStyle="white";
  ctx.strokeRect(20,20,200,20);
}

// flecha de aviso si hay alien detrás
function drawArrowWarning(){
  let dangerBehind = aliens.some(a=>{
    if(!a.alive) return false;
    let dx=a.x-player.x, dy=a.y-player.y;
    let angle=Math.atan2(dy,dx)-player.dir;
    return (angle<=-Math.PI/6 || angle>=Math.PI/6); // fuera de visión
  });
  if(dangerBehind){
    ctx.fillStyle="yellow";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 50);
    ctx.lineTo(canvas.width/2-20, 80);
    ctx.lineTo(canvas.width/2+20, 80);
    ctx.closePath();
    ctx.fill();
  }
}

// update
function update(){
  // balas
  // disparar balas
window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (e.code === "Space") {
      // cada bala tiene vida útil (frames)
      player.bullets.push({
        x: player.x,
        y: player.y,
        dir: player.dir,
        life: 100 // dura ~100 ciclos antes de desaparecer
      });
    }
  });
  window.addEventListener("keyup", e => { keys[e.code] = false; });
  
  // dibujar balas verdes
  function drawBullets() {
    ctx.fillStyle = "lime";
    player.bullets.forEach(b => {
      let dx = b.x - player.x, dy = b.y - player.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx) - player.dir;
      if (angle > -Math.PI/6 && angle < Math.PI/6) {
        let size = 20 / dist;
        let x = (canvas.width / 2) + (angle / (Math.PI/3)) * canvas.width;
        ctx.fillRect(x - size/2, canvas.height/2 - size/2, size, size);
      }
    });
  }
  
  // actualizar balas
  function updateBullets() {
    player.bullets.forEach(b => {
      b.x += Math.cos(b.dir) * 0.2;
      b.y += Math.sin(b.dir) * 0.2;
      b.life--; // cada frame pierde vida
  
      // colisión con aliens
      aliens.forEach(a => {
        if (a.alive && Math.abs(b.x - a.x) < 0.3 && Math.abs(b.y - a.y) < 0.3) {
          a.alive = false;
          b.life = 0; // bala se destruye al impactar
        }
      });
    });
  
    // limpiar balas que ya murieron o salieron del mapa
    player.bullets = player.bullets.filter(b => {
      return b.life > 0 &&
             b.x >= 0 && b.y >= 0 &&
             b.y < map.length && b.x < map[0].length;
    });
  }
  // aliens atacan más lento y menos daño
  aliens.forEach(a=>{
    if(a.alive){
      let dx=player.x-a.x, dy=player.y-a.y;
      let dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>0.5){
        a.x+=dx/dist*0.005; // velocidad reducida
        a.y+=dy/dist*0.005;
      } else {
        player.hp-=0.05; // daño reducido
      }
    }
  });

  // perder vida si se sale del mapa (vacío estilo Minecraft)
  if(player.x < 0 || player.y < 0 || 
     player.y >= map.length || player.x >= map[0].length ||
     map[Math.floor(player.y)][Math.floor(player.x)] === 1){
    player.hp -= 0.1; // daño lento por estar en el vacío
  }

  // reinicio si muere
  if(player.hp<=0){
    alert("Has muerto en el vacío... reiniciando nivel");
    player.hp=100;
    level=0;
    map=maps[level];
    spawnAliens(3);
  }

  // pasar nivel
  if(aliens.every(a=>!a.alive)){
    level++;
    if(level>=maps.length){ alert("¡Ganaste todos los niveles!"); level=0; }
    map=maps[level];
    spawnAliens(4+level); // más aliens en niveles altos
  }
}

// draw
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  castRays();
  drawAliens();
  drawBullets();
  drawWeapon();
  drawHUD();
  drawArrowWarning();
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// controles fluidos con velocidad ajustada
window.addEventListener("keydown",e=>{
  keys[e.code]=true;
  if(e.code==="Space"){ player.bullets.push({x:player.x,y:player.y,dir:player.dir}); }
});
window.addEventListener("keyup",e=>{ keys[e.code]=false; });

function handleControls(){
    if(keys["KeyW"]){ 
      player.x+=Math.cos(player.dir)*0.03; 
      player.y+=Math.sin(player.dir)*0.03; 
    }
    if(keys["KeyS"]){ 
      player.x-=Math.cos(player.dir)*0.03; 
      player.y-=Math.sin(player.dir)*0.03; 
    }
    if(keys["KeyA"]){ 
      player.dir-=0.03; 
    }
    if(keys["KeyD"]){ 
      player.dir+=0.03; 
    }
  }
  setInterval(handleControls,30);