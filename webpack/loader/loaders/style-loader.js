function loader (inputSource) {
    let code = `
        const style = document.createElement("style");
        style.innerHTML = ${JSON.stringify(inputSource)};
        document.head.appendChild(style);
    `
    return code;
}
module.exports = loader;