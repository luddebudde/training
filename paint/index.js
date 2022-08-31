const canvas = document.getElementById("theCanvas")
const ctx = canvas.getContext("2d")
const redButton = document.getElementById("redButton")
const blueButton = document.getElementById("blueButton")
const blackButton = document.getElementById("blackButton")

let color = "black"

redButton.addEventListener("click", () => {
    color = "red"
});

blueButton.addEventListener("click", () => {
    color = "blue"
});

blackButton.addEventListener("click", () => {
    color = "black"
});

let lastX = 500
let lastY = 500
const width = 10

canvas.addEventListener("mousemove", (event) => {
    console.log(event)
    const x = event.offsetX
    const y = event.offsetY

    if (event.buttons === 1) {

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(lastX, lastY);
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, width/2, 0, 2 * Math.PI);
        ctx.fillStyle = color
        ctx.fill();
    }
    lastX = x
    lastY = y
})

document.addEventListener("keydown", (event) => {
    if (event.code === "KeyR") {
        ctx.beginPath()


        ctx.fillStyle = "white"

        ctx.rect(0, 0, 1200, 1200)
        ctx.fill()
        ctx.fillStyle = "black"
    }
})