//initial values
let memoryA = null
let memoryOp = null
let reset = true
let waitingMemoryB = false
let err = 'nuh uh uh'

//element selectors
const display = document.querySelector('.display')
const numbers = document.querySelectorAll('.number')
const correctors = document.querySelectorAll('.correction')
const operators = document.querySelectorAll('.operator')


//event distribution
numbers.forEach(button => button.addEventListener('click', () => setNumber(button.id)))
operators.forEach(button => button.addEventListener('click', () => setOperator(button.id)))
correctors.forEach(button => button.addEventListener('click', () => handleCorrection(button.id)))

//event handlers
const setNumber = number => {
    //reset for new entry
    if (reset === true) {
        setReset()
    }
    if (number === '.' && display.innerText.includes('.')) {
        return
    }
    //set the new numbers
    display.innerText += number
}
const setReset = () => {
    //set base values
    waitingMemoryB = false
    display.innerText = ''
    reset = false
}
const setOperator = operator => {
    //if there is already an operator in memory and we are waiting on the 2nd number, prevent the operation
    if (memoryOp && waitingMemoryB) {
        memoryOp = operator
        return
    }
    //if memoryA does not have a value yet, set it here
    if (memoryA === null) {
        memoryA = display.innerText
    //if memoryA and memoryOp have been set, run the calculation and display results
    } else if (memoryOp) {
        let result = operate(memoryA, display.innerText, memoryOp).toString().slice(0, 13)
        display.innerText = result
        //catch errors
        if (result === err) {
            memoryA = 0
            memoryOp = null
            waitingMemoryB = false
            reset = true
            return
        } else memoryA = result
    }
    //set the operator, wait for the 2nd number, when another number is clicked, reset() will be called
    memoryOp = operator
    waitingMemoryB = true
    reset = true
}
const handleCorrection = corrector => {
    switch (corrector) {
        case "del": 
            //prevent deleting previous evaluation
            if (waitingMemoryB) {
                return
            }
            //remove the last digit until there are none left. set display to 0 and reset if all deleted
            display.innerText = display.innerText.slice(0, -1)
            if (display.innerText.length === 0) {
                display.innerText = 0
                reset = true
            }
            break
        case 'clear':
            //only clear the most recently typed input
            display.innerText = 0
            reset = true
            break
        case 'allClear': 
            //delete everything
            display.innerText = 0
            memoryA = null
            memoryOp = null
            waitingMemoryB = false
            reset = true
            break
    }
}

//equations
const operate = (a, b, operator) => {
    a = Number(a)
    b = Number(b)
    switch (operator) {
        case '+': return (a * 10 + b * 10) / 10
        case '-': return (a * 10 - b * 10) / 10
        case '*': return ((a * 10) * (b * 10)) / 100
        case '/': 
            if (b === 0) {
                return err
            } else return ((a * 10) / (b * 10))
        //hitting = returns b (the displayed number)
        default: return b
    }
}




