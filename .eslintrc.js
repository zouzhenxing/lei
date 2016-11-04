module.exports = {
    extends : "lei",
    rules : {
        'promise/catch-or-return' : "off",
    },
    globals : {
        express : false,
        rootPath : false,
        config : false,
        util : false,
    }
};