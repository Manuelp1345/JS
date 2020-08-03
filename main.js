//Objetos 
const miprimerobjeto = {}

const miobjeto = {
    unNumero: 12,
    unString: "Hola mundo",
    unaCondicion: true,
}
/* console.log(miobjeto.unString); */

//arreglos 

//arreglo vacio
const arrvacio = []

const arr = [1,2,"hola","mundo",miobjeto]

arr.push(5);
/* console.log(arr); */

const suma = 1 + 2
const resta = 1 - 2
const multiplicar = 2 * 3
const divicion = 9 / 3

/* console.log(suma,resta,multiplicar,divicion); */

const modulo = 10 % 3 

let num = 5 


num%= 2
/* 
console.log(num); */


//operadores logicos
//igualdad estricta
const resultado1= 5 === 6
//igualdad no estricta, strings pueden ser iguales a numeros si el valor es el mismo 
const resultado2= 5 == "5"


/* console.log(resultado2); */

const numeros = [1,2,3,4,5]

for (let i = 0; i < numeros.length; i++){
     console.log(numeros[i])
}