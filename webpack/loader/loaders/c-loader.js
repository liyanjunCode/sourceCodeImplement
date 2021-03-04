function loader (inputSouce) {
    console.log("c-loader")
    return inputSouce + "// c-loader"
}
loader.pitch = function () {
    console.log("c-pictch")
}
module.exports = loader