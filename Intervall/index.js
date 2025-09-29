

const calc = (y) => { 
    console.log(y - 2)
}

const call = (fun, arg) => {
    return fun(arg) * 2
}

[1, 2, 3].forEach((n) => {
    console.log(n - 2)
})

let count = 1

setInterval(() => {
    count = count + count
    console.log(count)
},
1000)