function loader (inputSouce) {
    console.log("b-loader")
    return inputSouce + "/b-loader"
}
loader.pitch = function () {
    console.log("b-pictch")
}
module.exports = loader