function loader (inputSouce) {
    console.log("inline-loader")
    return inputSouce + "/inline-loader"
}
loader.pitch = function () {
    console.log("inline-pictch")
    // return "a-pitch"
}
module.exports = loader