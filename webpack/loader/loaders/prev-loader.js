function loader (inputSouce) {
    console.log("prev-loader")
    return inputSouce + "/prev-loader"
}
loader.pitch = function () {
    console.log("prev-pictch")
    // return "a-pitch"
}
module.exports = loader