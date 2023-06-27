"use strict"

const button = document.getElementById("okButton")
const buttonInput = document.getElementById("buttonInput")
const output = document.getElementById("output")
const board = document.getElementById("board")

let boom = new Audio('KABOOM.mp3')

let x = 0
let y = 0
let z = 0
let neighborCount = 0

let pressColor = "white"
let color = pressColor

buttonInput.addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
        return
    }

    const p = document.createElement("p")
    p.textContent = buttonInput.value
    output.appendChild(p)
})

buttonInput.addEventListener("input", (e) => {
})

let squares = [

]

while (y < 50) {

    x = 0
    const rowDiv = document.createElement("div")
    board.appendChild(rowDiv)
    rowDiv.className = "row"

    let squareRow = []
    squares.push(squareRow)

    while (x < 50) {

        const row = y
        const column = x

        let mineOdds = Math.random() * 7

        const squareElement = document.createElement("button")
        squareElement.textContent = buttonInput.value
        
        const square = {
            isMine: mineOdds < 1,
            isPressed: false,
            element: squareElement,
        }

        squareRow.push(
            square
        )


        rowDiv.appendChild(squareElement)
        x = x + 1

        squareElement.addEventListener("contextmenu", (e) => {
            square.element.style.backgroundImage = "url(flag.avif)"
            e.preventDefault()
        })
        squareElement.className = "button"
        squareElement.addEventListener("click", (e) => {
        

            

            squareElement.style.background = pressColor
            square.isPressed = true
            z = z + 1

            if (square.isMine){                
                squares.forEach(squares => {
                    
                    squares.forEach(square => {
                        console.log(square)
                    
                        if (square.isMine){
                            square.element.style.backgroundImage = "url(nukeMine.png)"
                                ()

                        }                        
                    });
                });
            }



            const neighbours = [
                squares[row - 1]?.[column - 1],
                squares[row - 1]?.[column],
                squares[row - 1]?.[column + 1],
                squares[row]?.[column - 1],
                squares[row]?.[column + 1],
                squares[row + 1]?.[column - 1],
                squares[row + 1]?.[column],
                squares[row + 1]?.[column + 1],
            ].filter(el => {
                return el !== undefined
            })

            neighbours.forEach(neighbour => {
                if (neighbour.isMine) {
                    neighborCount = neighborCount + 1
                }
            })

            if (neighborCount !== 0){
            squareElement.textContent = neighborCount
            }

            if (neighborCount === 0) {
                neighbours.forEach(neighbour => {
                    if (!neighbour.isPressed) {
                        neighbour.element.click()
                    }
                })
            }
            neighborCount = 0

        })

    }
    y = y + 1
}
