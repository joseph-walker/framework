/**
 * Tests the module exported by Babel to ensure everything is available via 
 * require or import
 */

var friar = require('./../../dist/framework.js');

describe("Friar Module Import", function() {
    it("contains all the necessary exported functions", function() {
        expect(friar.dispatch).toBeDefined();
        expect(friar.makeDispatcher).toBeDefined();
        expect(friar.makeSink).toBeDefined();
        expect(friar.makeApp).toBeDefined();
    });
});
