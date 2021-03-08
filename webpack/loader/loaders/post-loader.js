function loader (inputSouce) {
    console.log("post-loader")
    return inputSouce + "/post-loader"
}
loader.pitch = function () {
    console.log("post-pictch")
    // return "a-pitch"
}
module.exports = loader