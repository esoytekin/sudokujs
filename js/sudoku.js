/**
 * sudoku.js
 */
var checkCondition = false;
var gameLocked = false;
var backwardMovements = new Array();
var sudokuPuzzleSolver = function (puzzle){ 
    if(!isAPuzzle(puzzle))
        return undefined;

    console.debug("starting solving sudoku..");
    var domainValues = fillDomainValues(puzzle);
    console.debug("calculated domain values..");
    
    while (!gameLocked && !isGameFinished(puzzle)) {
        if (checkCondition) {
            checkCondition = false;
            console.debug("putting single values...");
            putSingle(puzzle, domainValues);

            console.debug("calculating domain values.."); 
            domainValues = fillDomainValues(puzzle);
        };

        while (!checkCondition && !isGameFinished(puzzle)) {
            console.debug("* multiple choice");
            var histogram = getHistogram(domainValues);
            console.info("calculated histogram");
            var maxConstraining = getMaxIndex(histogram);
            //search for minimum sized max histogram valued array
            putMulti(puzzle,domainValues,maxConstraining);
            domainValues = fillDomainValues(puzzle);


        }
        
        if(gameLocked){
            console.debug("game is locked. backwarding...");

            var back= backwardMovements.pop();

            if(back){
                var p = back.puzzle;
                puzzle = p.map(function(arr){
                    return arr.slice(0);
                });
                var ival = Math.floor(back.key/9);
                var jval = back.key - ival*9;

                var fixedMoves = back.fixedMove;
                var fixedM = fixedMoves.pop();
                puzzle[ival][jval] = fixedM;

                if (fixedMoves.length > 0 ){
                    backwardMovements.push(back);
                }

                gameLocked = false;
                domainValues = fillDomainValues(puzzle);
            }

        }
    }

    console.info("found solution. returning..");

   return puzzle;

}

var fillDomainValues = function(puzzle){//{{{

    var dict = {};
    for (var i = 0; i < puzzle.length; i++) {
        for (var j = 0; j < puzzle[i].length; j++) {
            if(puzzle[i][j] != 0)
                continue;

            var vals  = new Array();

            //fill column values to the vals array
            for (var k = 0; k < puzzle.length; k++) {
                if (j!=k) {
                    if($.inArray(puzzle[i][k],vals) == -1){
                        vals.push(puzzle[i][k]);
                    }
                
                }
            }

            //fill row values to the vals array
            for (var k = 0; k < puzzle.length; k++) {
                if (i!=k) {
                    if($.inArray(puzzle[k][j],vals) == -1){
                        vals.push(puzzle[k][j]);
                    }
                
                };
            };


            //room
            var vali = Math.floor( i/3 )*3;
            var valj = Math.floor( j/3 )*3;
            for (var x = vali; x < vali+3; x++) {
                for (var y = valj; y < valj+3; y++) {
                    if(x!=i && y!=j){
                        if ($.inArray(puzzle[x][y],vals) == -1) {
                            vals.push(puzzle[x][y]);
                        }
                    }
                }
            }

            var domainVals = new Array();

            for (var k = 1; k < 10; k++) {
                if ($.inArray(k,vals) == -1) {
                    domainVals.push(k);
                }   
            }

            if (!checkCondition) {
                checkCondition = domainVals.length == 1;
            }

            if (domainVals.length == 0) {
            
                gameLocked = true;
            };

            dict[i*9+j]= domainVals;

        }
    }

    return dict;
}//}}}


var fillDomainValuesByCell = function(puzzle,cell){

    
    if(cell < 0 || cell > 80)
        return;

    var i = Math.floor(cell/9);
    var j = cell - i*9;

    if(puzzle[i][j] != 0)
        return;

    var vals  = new Array();
    //fill column values to the vals array
    for (var k = 0; k < puzzle.length; k++) {
        if (j!=k) {
            if($.inArray(puzzle[i][k],vals) == -1){
                vals.push(puzzle[i][k]);
            }
        
        }
    }

    //fill row values to the vals array
    for (var k = 0; k < puzzle.length; k++) {
        if (i!=k) {
            if($.inArray(puzzle[k][j],vals) == -1){
                vals.push(puzzle[k][j]);
            }
        
        };
    };


    //room
    var vali = Math.floor( i/3 )*3;
    var valj = Math.floor( j/3 )*3;
    for (var x = vali; x < vali+3; x++) {
        for (var y = valj; y < valj+3; y++) {
            if(x!=i && y!=j){
                if ($.inArray(puzzle[x][y],vals) == -1) {
                    vals.push(puzzle[x][y]);
                }
            }
        }
    }

    var domainVals = new Array();

    for (var k = 1; k < 10; k++) {
        if ($.inArray(k,vals) == -1) {
            domainVals.push(k);
        }   
    }
    

    return domainVals;

}

var isAPuzzle = function(puzzle){

    if(!puzzle)
        return false;
    if (puzzle.length != 9) {
        return false;
    };

    for (var i = 0; i < puzzle.length; i++) {
        if (puzzle[i].length!=9) {
            return false;
        };
        for (var j = 0; j < puzzle[i].length; j++) {
            if (puzzle[i][j]< 0 || puzzle[i][j]>9) {
                return false;
            };
        }
    }

    return true;

}

var isGameFinished = function(puzzle){
    if(!puzzle)
        return false;
    if (puzzle.length != 9) {
        return false;
    };

    for (var i = 0; i < puzzle.length; i++) {
        if (puzzle[i].length!=9) {
            return false;
        };

        for (var j = 0; j < puzzle[i].length; j++) {
            if (puzzle[i][j]< 1 || puzzle[i][j]>9) {
                return false;
            };
            //check room
            var vali = Math.floor( i/3 )*3;
            var valj = Math.floor( j/3 )*3;
            for (var x = vali; x < vali+3; x++) {
                for (var y = valj; y < valj+3; y++) {
                    if(x!=i && y!=j){
                        if (puzzle[x][y] == puzzle[i][j]) {
                            return false;

                        }
                    }
                }
            }

            //check row
            //
            for (var k = 0; k < puzzle.length; k++) {
                if (j!=k) {
                    if(puzzle[i][j] == puzzle[i][k]){
                        return false;
                    }
                
                };
            };

            //check column
            for (var k = 0; k < puzzle.length; k++) {
                if (i!=k) {
                    if(puzzle[i][j] == puzzle[k][j]){
                        return false;
                    }
                
                };
            };


        };
    };


    return true;
}


var putSingle = function(puzzle,domainValues){
    for(var key in domainValues){
        var elem = domainValues[key];

        if(elem.length == 1){
            var i = Math.floor(key/9);
            var j = key - i*9;
            puzzle[i][j]=elem.pop();
            dom = fillDomainValues(puzzle);
        }
    }


}

var getHistogram = function(domainValues){
    var histogram = [0,0,0,0,0,0,0,0,0,0];

    for (var key in domainValues) {
        var values = domainValues[key];

        for (var i=0; i < values.length; ++i) {
            var sudokuVal = histogram[values[i]];
            histogram[values[i]] = ++sudokuVal;
        }
    }

    return histogram;
}

var getMaxIndex = function(histogram){
    var max      = 0;
    var maxIndex = 0;

    for (var i=0; i < histogram.length; ++i) {
        if (histogram[i]> max) {
            max = histogram[i];
            maxIndex = i;

        };
    }

    return maxIndex;
}

var putMulti = function(puzzle, domainValues, maxConstraining){
    var sizee = 99;
    var keyElement = 0;

    for (var key in domainValues) {
        var elem = domainValues[key];
        if($.inArray(maxConstraining, elem) != -1){
            if (elem.length < sizee) {
                sizee = elem.length;
                keyElement = key;
                
            };
        
        }

    }

    var tempVals = domainValues[keyElement];

    var tempValsStack = new Array();

    for (var i=0; i < tempVals.length; ++i) {
        if (maxConstraining != tempVals[i]) {
            tempValsStack.push(tempVals[i]);
        };
    }

    if (tempValsStack.length >0) {
        var backwardMovement = new Backward(puzzle,keyElement,tempValsStack);
        backwardMovements.push(backwardMovement);
    };

    var histI = Math.floor(keyElement/9);
    var histJ = keyElement - histI*9;

    puzzle[histI][histJ] = maxConstraining;

}

var Backward = function( puzzle, key, fixedMove){
    var self = this;

    self.puzzle = puzzle.map(function(arr){
        return arr.slice(0);
    });
    self.key = key;
    self.fixedMove = fixedMove;

}
