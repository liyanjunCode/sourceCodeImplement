const less = require("less");
function loader (source) {
    let css = source;
    less.render(source, function (err, c) {
        css = c.css;
    });
    return css;
}
module.exports = loader;