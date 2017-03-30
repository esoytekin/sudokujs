QUnit.test( "isGameFinished: null puzzle", function( assert ) {
  assert.equal( false,isGameFinished(), "Passed!" );
});

QUnit.test( "isGameFinished: empty puzzle", function( assert ) {
  var puz = [];
  assert.equal( false,isGameFinished(puz), "Passed!" );
});

QUnit.test( "isGameFinished: wrong sized puzzle", function( assert ) {
  var puz = [[1,2,3,4],[1,4,5,3,2]];
  assert.equal( false,isGameFinished(puz), "Passed!" );
});

QUnit.test( "isGameFinished: not finished puzzle", function( assert ) {
        var  puz= [ [ 1,0,0,0,7,0,0,3,0 ],
        [ 8,3,0,6,0,0,0,0,0 ],
        [ 0,0,2,9,0,0,6,0,8 ],
        [ 6,0,0,0,0,4,9,0,7 ],
        [ 0,9,0,0,0,0,0,5,0 ],
        [ 3,0,7,5,0,0,0,0,4 ],
        [ 2,0,3,0,0,9,1,0,0 ],
        [ 0,0,0,0,0,2,0,4,3 ],
        [ 0,4,0,0,8,0,0,0,9 ]
        ];
  assert.equal( false,isGameFinished(puz), "Passed!" );
});

QUnit.test( "isGameFinished: wrong values", function( assert ) {
        var puz= [ [ 1,1,1,1,7,1,1,3,1 ],
        [ 8,3,1,6,1,1,1,1,1 ],
        [ 1,1,2,9,1,1,6,1,8 ],
        [ 6,1,1,1,1,4,9,1,7 ],
        [ 1,9,1,1,1,1,1,5,1 ],
        [ 3,1,7,5,1,1,1,1,4 ],
        [ 2,1,3,1,1,9,1,1,1 ],
        [ 1,1,1,1,1,2,1,4,3 ],
        [ 1,4,1,1,8,1,1,1,9 ]
        ];
  assert.equal( false,isGameFinished(puz), "Passed!" );
});

QUnit.test("isGameFinished: Wrong Soluton",function(assert){
        var puz= [ 
        [ 1,10,9,8,7,5,4,3,2 ],
        [ 8,3,4,6,2,1,7,9,5 ],
        [ 5,7,2,9,4,3,6,1,8 ],
        [ 6,2,5,1,3,4,9,8,7 ],
        [ 4,9,8,2,6,7,3,5,1 ],
        [ 3,1,7,5,9,8,2,6,4 ],
        [ 2,8,3,4,5,9,1,7,6 ],
        [ 9,5,6,7,1,2,8,4,3 ],
        [ 7,4,1,3,8,6,5,2,9 ],
        ];
  assert.equal( false,isGameFinished(puz), "Passed!" );
});

QUnit.test("isGameFinished: Right Solution",function(assert){
        var puz = [ 
        [ 1,6,9,8,7,5,4,3,2 ],
        [ 8,3,4,6,2,1,7,9,5 ],
        [ 5,7,2,9,4,3,6,1,8 ],
        [ 6,2,5,1,3,4,9,8,7 ],
        [ 4,9,8,2,6,7,3,5,1 ],
        [ 3,1,7,5,9,8,2,6,4 ],
        [ 2,8,3,4,5,9,1,7,6 ],
        [ 9,5,6,7,1,2,8,4,3 ],
        [ 7,4,1,3,8,6,5,2,9 ],
        ];
  assert.equal( true,isGameFinished(puz), "Passed!" );

});

QUnit.test("fillDomainValues: ", function(assert){

        var puz= [ [ 0,0,3,0,2,0,6,0,0 ],
        [ 9,0,0,3,0,5,0,0,1 ],
        [ 0,0,1,8,0,6,4,0,0 ],
        [ 0,0,8,1,0,2,9,0,0 ],
        [ 7,0,0,0,0,0,0,0,8 ],
        [ 0,0,6,7,0,8,2,0,0 ],
        [ 0,0,2,6,0,9,5,0,0 ],
        [ 8,0,0,2,0,3,0,0,9 ],
        [ 0,0,5,0,1,0,3,0,0 ]
        ];

        var domainValues = fillDomainValues(puz);

        var testVals = new Array();

        testVals.push(4);
        testVals.push(5);

        assert.equal(domainValues[0].pop(),testVals.pop(),"Passed!");
        assert.equal(domainValues[0].pop(),testVals.pop(),"Passed!");
});

QUnit.test("putSingle: ",function(assert){


        var puz= [ [ 0,0,3,0,2,0,6,0,0 ],
        [ 9,0,0,3,0,5,0,0,1 ],
        [ 0,0,1,8,0,6,4,0,0 ],
        [ 0,0,8,1,0,2,9,0,0 ],
        [ 7,0,0,0,0,0,0,0,8 ],
        [ 0,0,6,7,0,8,2,0,0 ],
        [ 0,0,2,6,0,9,5,0,0 ],
        [ 8,0,0,2,0,3,0,0,9 ],
        [ 0,0,5,0,1,0,3,0,0 ]
        ];

        var domainValues = fillDomainValues(puz);
        console.log(domainValues);

        putSingle(puz,domainValues);



        assert.equal(puz[4][5],4,"Passed! ");

});

QUnit.test("getHistogram",function (assert) { 
    var domainValues = {};
    var vals = new Array();

    vals.push(1);
    vals.push(2);
    domainValues[0] = vals;

    vals = new Array();

    vals.push(1);
    vals.push(3);
    domainValues[1]= vals;

    var histogram = getHistogram(domainValues);
    
    var fakeHistogram = [0,2,1,1,0,0,0,0,0,0];


    assert.ok(histogram.toString()== fakeHistogram.toString(),"Passed!");



});

QUnit.test("fillDomainValuesByCell :",function (assert) {
        var puz= [ [ 0,0,3,0,2,0,6,0,0 ],
        [ 9,0,0,3,0,5,0,0,1 ],
        [ 0,0,1,8,0,6,4,0,0 ],
        [ 0,0,8,1,0,2,9,0,0 ],
        [ 7,0,0,0,0,0,0,0,8 ],
        [ 0,0,6,7,0,8,2,0,0 ],
        [ 0,0,2,6,0,9,5,0,0 ],
        [ 8,0,0,2,0,3,0,0,9 ],
        [ 0,0,5,0,1,0,3,0,0 ]
        ];

        var index = 11;

        var domainVals = fillDomainValuesByCell(puz,index);
        var expected = [4,7];
        assert.equal(domainVals.length,expected.length,"Lenghts are equal");
        assert.equal(domainVals[0],expected[0],"first elements are equal");
        assert.equal(domainVals[1],expected[1],"second elements are equal");
    });

QUnit.test("fillDomainValuesByCell: null check",function (assert) {
        
        var puz= [ [ 0,0,3,0,2,0,6,0,0 ],
        [ 9,0,0,3,0,5,0,0,1 ],
        [ 0,0,1,8,0,6,4,0,0 ],
        [ 0,0,8,1,0,2,9,0,0 ],
        [ 7,0,0,0,0,0,0,0,8 ],
        [ 0,0,6,7,0,8,2,0,0 ],
        [ 0,0,2,6,0,9,5,0,0 ],
        [ 8,0,0,2,0,3,0,0,9 ],
        [ 0,0,5,0,1,0,3,0,0 ]
        ];

        var index = 2;

        var domainValues = fillDomainValuesByCell(puz, index);

        assert.ok(domainValues == undefined, "Passed!");

    });


