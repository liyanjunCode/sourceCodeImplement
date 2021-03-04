function loader (inputSouce) {
    console.log("loader1", inputSouce)
    return inputSouce
}
loader.pitch = function () {
    console.log("pictch1")
}
module.exports = loader