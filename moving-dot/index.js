const canvas = document.getElementById("theCanvas")
const ctx = canvas.getContext("2d")
const world = {
    worldWidth: canvas.width,
    worldHeight: canvas.height,
}


const player1 = {
    radius: 50, 
    speed: 5,
    mass: 5,
    pos:{
        x: 500,
        y: 100,
    },
    vel:{
        x:0,
        y:0,
    },
}
const coin = {
    radius: 25,
    mass: 2.5,
    pos:{
        x: 300,
        y: 300,
    },
}

setInterval(() => {
    // Uppdatera
    player1.pos.x = player1.pos.x + player1.vel.x
    player1.pos.y = player1.pos.y + player1.vel.y

    //  Bounce 
    const playerRightBoundary = player1.pos.x + player1.radius
    if (playerRightBoundary > world.worldWidth && player1.vel.x > 0){
        player1.vel.x = -player1.vel.x 
        player1.pos.x = world.worldWidth - player1.radius
    }
    const playerLeftBoundary = player1.pos.x - player1.radius
    if (playerLeftBoundary < 0 && player1.vel.x < 0 ){
        player1.vel.x = -player1.vel.x
        player1.pos.x = 0 + player1.radius
    }

    // Teleport
    const playerTopBoundary = player1.pos.y - player1.radius
    const playerBottomBoundary = player1.pos.y + player1.radius
    if (player1.pos.y < 0 && player1.vel.y < 0 ){
        player1.pos.y = world.worldHeight
    }
    if (player1.pos.y > world.worldHeight && player1.vel.y > 0 ){
        player1.pos.y = 0 
    }

    // console.log(player1.pos.x - coin.pos.x, player1.pos.y - coin.pos.y)

    
    const dx = player1.pos.x - coin.pos.x
    const dy = player1.pos.y - coin.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    // console.log("dist", dist)
    if (dist < player1.radius + coin.radius) {
        // console.log("crash")
        player1.radius = player1.radius + 5
        coin.pos.x = Math.random() * world.worldWidth
        coin.pos.y = Math.random() * world.worldHeight
    }
    
    // Rita ut
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.rect(0, 0, world.worldWidth, world.worldHeight)
    ctx.fill()

    // Draw Player
    ctx.beginPath();
    ctx.arc(player1.pos.x , player1.pos.y, player1.radius , 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player1.pos.x, player1.pos.y + world.worldHeight, player1.radius , 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(player1.pos.x, player1.pos.y - world.worldHeight, player1.radius , 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    
    // coin
    ctx.beginPath();
    ctx.arc(coin.pos.x , coin.pos.y, coin.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(coin.pos.x , coin.pos.y, coin.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "gold";
    ctx.stroke();
    
    ctx.fillStyle = "gold"
    ctx.font = "20px arial";
    ctx.fillText("10", coin.pos.x - 11, coin.pos.y + 7);

    ctx.fillStyle = "black"
    ctx.font = "30px arial";
    ctx.fillText(`${(player1.radius / 5 - 10) * 10}`, 10, world.worldHeight - 10);
},
1000 / 30)



document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
        player1.vel.y = -player1.speed
        player1.vel.x = 0
    }
    if (event.code === "ArrowLeft") {
        player1.vel.x = -player1.speed
        player1.vel.y = 0
    }
    if (event.code === "ArrowDown") {
        player1.vel.y = player1.speed
        player1.vel.x = 0
    }
    if (event.code === "ArrowRight") {
        player1.vel.x = player1.speed
        player1.vel.y = 0
    }
})