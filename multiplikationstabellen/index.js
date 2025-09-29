// const listig = [
//     [1, 2 , 3],
//     [4, 5 , 6],
//     [7, 8 , 9],
// ]

// listig.forEach((list) => {
//     list.forEach((number) => {
//         process.stdout.write(number.toString())
//     }) 
// })


const amount = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
]

amount.forEach(factor1 => {
    process.stdout.write (`${factor1}:ans\t|`)
    amount.forEach(factor2 => { 
        process.stdout.write(`\t ${factor1} * ${factor2} = ${factor1 * factor2} `)
    })
   console.log()
});