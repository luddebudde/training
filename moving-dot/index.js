const canvas = document.getElementById("theCanvas")
const ctx = canvas.getContext("2d")

let x = 100
let y = 75
let velX = 0
let velY = 0


setInterval(() => {
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.rect(0, 0, 1200, 1200)
    ctx.fill()

    ctx.beginPath();
    ctx.arc(x , y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    
    x = x + velX
    y = y + velY
},
1000 / 30)

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp") {
        velY = -5
        velX = 0
    }
    if (event.code === "ArrowLeft") {
        velX = - 5
        velY = 0
    }
    if (event.code === "ArrowDown") {
        velY = 5
        velX = 0
    }
    if (event.code === "ArrowRight") {
        velX = 5
        velY = 0
    }
})