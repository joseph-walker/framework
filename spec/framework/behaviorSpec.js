/**
 * Tests the component functions of Friar to ensure they behave properly
 */

var friar = require('./../../dist/framework.js');
var Rx    = require('rx');

describe("Friar `makeSink` function", function() {
    it("should curry a given function", function() {
        var testFunction = function(state, valueA, valueB) {
            return true;
        };
        
        var sink             = friar.makeSink(testFunction);
        partiallyAppliedSink = sink([true, true]);
        
        expect(partiallyAppliedSink(true)).toEqual(true);
    });
    
    it("should curry a function that does not require multiple arguments", function() {
        var testFunction = function(state) {
            return true;
        };
        
        var sink = friar.makeSink(testFunction);
        
        expect(sink([])(true)).toEqual(true);
    });
    
    it("should throw an exception if you dispatch to a source with a differing number of arguments than it expects", function() {
        var testFunction = function(state, valueA) {
            return true;
        };
        
        var sink = friar.makeSink(testFunction);
        
        expect(sink([true])).not.toThrow();
        expect(function() { sink([true, true]); }).toThrow();
        expect(function() { sink(); }).toThrow();
    });
    
    it("should curry a function in such a way that it can be passed an array of arguments and still behave", function() {
        var testFunction = function(state, valueA, valueB, valueC) {            
            return valueA + valueB + valueC;
        };
        
        var source       = new Rx.Subject();
        var sinkFunction = friar.makeSink(testFunction);
        var testSink     = source.map(sinkFunction);
        
        testSink.subscribe(function(partiallyAppliedSink) {
            expect(partiallyAppliedSink(null)).toEqual(6);
        });
        
        friar.dispatch(source, 1, 2, 3);
    });
});

describe ("Friar `dispatch` function", function() {
    var source;
    
    beforeEach(function() {
        source = new Rx.Subject()
    });
    
    afterEach(function() {
        source.onCompleted();
    })
    
    it("should push the given arguments to an Rx stream", function() {
        source.subscribe(function(val) {
            expect(val).toEqual([1, 2, 3]);
        });
        
        friar.dispatch(source, 1, 2, 3);
    });
    
    it("should dispatch in such a way that sinks with no arguments aside from state still work", function() {
        var testFunction = function(state) {
            return 4;
        };
        
        var testSink = source.map(friar.makeSink(testFunction));
        
        testSink.subscribe(function(sinkFunction) {
            expect(sinkFunction(null)).toEqual(4);
        });
        
        friar.dispatch(source);
        
        // It should throw in this scenario that we give it more than 0 arguments
        expect(function() { friar.dispatch(source, 2); }).toThrow();
    });
});
