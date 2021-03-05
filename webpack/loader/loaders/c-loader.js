function loader (inputSouce) {
    console.log("c-loader")
    const async = this.async()
    async(null, inputSouce + "// c-loader")
    // return inputSouce + "// c-loader"
}
loader.pitch = function () {
    console.log("c-pictch")
    return "ccc"
}
module.exports = loader