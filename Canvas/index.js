const canvas = document.getElementById("theCanvas")
console.log(canvas)
const ctx = canvas.getContext("2d")

// ctx.beginPath()
// ctx.fillStyle = "green"
// ctx.rect(50, 50, 150, 50)
// ctx.fill()

const chessLine = 8
const heightLine = canvas.height / chessLine;
const widthLine = canvas.width / chessLine;

const line = [
    heightLine,
    heightLine,
    heightLine,
    heightLine,
    heightLine,
    heightLine,
    heightLine,
    heightLine,
]

line.forEach((y, row) => {

    line.forEach((x, colum) => {
        
        
        ctx.beginPath()

        if ((colum + row) % 2 === 0) {
            ctx.fillStyle = "black"
        } else {
            ctx.fillStyle = "white"
        }

        ctx.rect(colum * 100, row * 100, 100, 100)
        ctx.fill()
    });

 

});

// canvas = document.getElementById("theCanvas");
// ctx = canvas.getContext("2d");

const colum = 3
const row = 3

ctx.beginPath();
ctx.arc(colum * 100 + 50, row * 100 + 50, 40, 0, 2 * Math.PI);
ctx.fillStyle = "red"
ctx.fill();