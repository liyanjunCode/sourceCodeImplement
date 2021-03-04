function loader (inputSouce) {
    console.log("a-loader")
    return inputSouce + "/a-loader"
}
loader.pitch = function () {
    console.log("a-pictch")
    // return "a-pitch"
}
module.exports = loader