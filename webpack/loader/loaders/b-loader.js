function loader (inputSouce) {
    console.log("b-loader")
    let async = this.async();
    async(null, inputSouce + "/b-loader");
    // return inputSouce + "/b-loader"
}
loader.pitch = function () {
    console.log("b-pictch")
}
module.exports = loader