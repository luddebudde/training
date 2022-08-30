const canvas = document.getElementById("theCanvas")
const ctx = canvas.getContext("2d")

const world = {
    width: canvas.width,
    height: canvas.height,
}
const player = {
    maxSpeed: 20,
    vel:{
        x:0,
        y:0,
    }, 
        pos:{
        x:100,
        y:150,
    }
}

setInterval(() => {
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.rect(0, 0, world.width, world.height)
    ctx.fill()

    ctx.beginPath()    
    ctx.arc(player.pos.x, player.pos.y, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "red"
    ctx.fill()
    
    player.pos.x = add(player.pos, player.vel)
}, 1000/30);

const add = (a, b) => {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    }
}

const diff = (a, b) => {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    }
}

const length = (a) => {
    return Math.sqrt(a.x * a.x +  a.y * a.y)
} 


const norm = (a) => {
    const len = length(a) 
    return div(a, len)
} 

const scale = (a, k) => { 
    return {
        x: a.x * k,
        y: a.y * k,
    }
} 

const div = (a, k) => { 
    return {
        x: a.x / k,
        y: a.y / k,
    }
} 


canvas.addEventListener ("mousedown", (event) => {
    console.log(event)
    const clickPos = {
        x: event.offsetX,
        y: event.offsetY,
    }
    player.vel = scale(
        norm(
            diff(clickPos, player.pos),
        ),
        player.maxSpeed
    )
})