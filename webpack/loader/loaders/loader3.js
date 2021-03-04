function loader (inputSouce) {
    console.log("loader3", inputSouce)
    return inputSouce
}
loader.pitch = function () {
    console.log("pictch3")
}
module.exports = loader