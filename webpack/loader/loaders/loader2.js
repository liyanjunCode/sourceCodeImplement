function loader (inputSouce) {
    console.log("loader2", inputSouce)
    return inputSouce
}
loader.pitch = function () {
    console.log("pictch2")
}
module.exports = loader