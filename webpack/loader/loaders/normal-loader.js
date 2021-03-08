function loader (inputSouce) {
    console.log("normal-loader")
    return inputSouce + "/normal-loader"
}
loader.pitch = function () {
    console.log("normal-pictch")
    // return "a-pitch"
}
module.exports = loader