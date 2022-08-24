const canvas = document.getElementById("theCanvas")
console.log(canvas)
const ctx = canvas.getContext("2d")

canvas.addEventListener("mousemove", (event) => {
    console.log(event)
    const x = event.offsetX
    const y = event.offsetY

    if (event.buttons === 1) {
        
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "blue"
    ctx.fill();
    }
})

document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR"){
        ctx.beginPath()

        
            ctx.fillStyle = "white"

        ctx.rect(0, 0, 1200, 1200)
        ctx.fill()
    }
})