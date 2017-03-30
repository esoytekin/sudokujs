/*
 * master.js
 */
$(function(){

$("#btnHint").click(function(){
    $(this).toggleClass("active");
});

var alert = function(alert,title,type){
	var dialogInstance3 = new BootstrapDialog()
    .setMessage(alert);
	dialogInstance3.realize();
	if(title){
		dialogInstance3.setTitle(title)
	}
	
	if(!type){
                dialogInstance3.getModalHeader().hide();
	}else{
		dialogInstance3.setType(BootstrapDialog.TYPE_DANGER);
	}
	dialogInstance3.open();
}

function selectedPuzzleClass(puzzle){
    var self = this;
    self.type = puzzle.type;
    self.index = puzzle.index;
    self.puz = puzzle.puz.map(function(arr) {
        return arr.slice(0); 
    });

}

function fillTable(puzzle){

    var table = $("table tbody");

    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td');

        $tds.each(function(j,el){
            $tds.eq(j).text("");
            $tds.eq(j).removeClass('disabled');
            if(puzzle[i][j]!= 0 ){
                $tds.eq(j).text(puzzle[i][j]);
                $tds.eq(j).addClass('disabled');
            }
        
        });
    });

}


function checkSolution(){
    var table = $("table tbody");
    var result = true;
    var puzzle= new Array();

    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td');

        var subPuzzle = new Array();
        $tds.each(function(j,el){
            if(i>8 || j> 8 )
                return;
            var textVal = $tds.eq(j).text().trim();
            if(textVal != ""){
                subPuzzle.push($tds.eq(j).text());
            }           
        
        });
        if(subPuzzle.length>0)
            puzzle.push(subPuzzle);
    });

    return isGameFinished(puzzle);


}

function getStatePuzzle(){
    var table = $("table tbody");
    var puzzle= new Array();

    table.find('tr').each(function (i, el) {
        var $tds = $(this).find('td');

        var subPuzzle = new Array();
        $tds.each(function(j,el){
            if(i>8 || j> 8 )
                return;
            var textVal = $tds.eq(j).text().trim();
            if(textVal == ""){
                subPuzzle.push(0);
            }else {
                subPuzzle.push(parseInt( $tds.eq(j).text().trim() ));
            }           
        
        });
        if(subPuzzle.length>0)
            puzzle.push(subPuzzle);
    });

    return puzzle;

}
var createNumberButtons = function(){
    if(!$selectedCell)
        return;
    var puzzle = getStatePuzzle();
    var index = $($selectedCell).attr("id").split("-")[1];

    //set clicked cell value to 0;
    index = parseInt(index)-1;
    var i = Math.floor(index/9);
    var j = index - i*9;
    puzzle[i][j]=0;

    var values;
    var wantH = $("#btnHint").hasClass("active");
    if (wantH) {
    
        values = fillDomainValuesByCell(puzzle,index);
    }else{
        values = [1,2,3,4,5,6,7,8,9];
    };
    var str = '<div style="padding: 5% 15%" class="btn-group" role="group" aria-label="...">';
    for (var i=1; i < 10; ++i) {
        var disabled = "";
        if($.inArray(i,values)==-1){
            disabled = "disabled";
        }
        str = str +  '<button type="button" class="btn btn-danger btn-lg '+disabled+'">'+i+'</button>';
        //if(i%3==0)
          //str+="<br />";
    }
    str+="</div>"
    return str;
}
var numberSelector = new BootstrapDialog({
    title: 'Select Number', 
    //message: '<table class="table" style="text-align: center;" ><tr><td><a href="javascript://" class="link link-default" data-bind="click: numberClickEvent">1</a></td><td><a href="javascript://" class="link link-default">2</a></td><td><a href="javascript://" class="link link-default">3</a></td></tr><tr><td><a href="javascript://" class="link link-default">4</a></td><td><a href="javascript://" class="link link-default">5</a></td><td><a href="javascript://" class="link link-default">6</a></td></tr><tr><td><a href="javascript://" class="link link-default">7</a></td><td><a href="javascript://" class="link link-default">8</a></td><td><a href="javascript://" class="link link-default">9</a></td></tr></table>', 
    onshown: function(dialogRef){
         var element = dialogRef.getModalBody().find('button');
         //element.focus();
         //element[0].setSelectionRange(0,element.val().length);
         $(element).click(function(event){
              var selected = event.target.innerHTML;
              $selectedCell.text(selected);
              dialogRef.close();
              if(checkSolution()){
                alert("Congratulations..");
                //clearInterval(interv);
                //fillTable(self.puzzleSolution());
              }
         });
    } 
});


var $td = $("td");
var $selectedCell;
$td.click(function(event){
    var isDisabled = $(this).attr("class");
    if(isDisabled && isDisabled == 'disabled')
       return;

    $selectedCell = $(event.target);
    numberSelector.realize();
    //numberSelector.getModalHeader().hide();
    numberSelector.setMessage(createNumberButtons());
    numberSelector.open();

});

var puzzleSolution;

function solvePuzzle(puzzle){

    puzzleSolution = sudokuPuzzleSolver(puzzle);

   return puzzleSolution;
}


function getTwoDigit(elem){
    if (elem.length == 1) {
        return "0"+elem;
    };
    return elem;
}

function getCustomForm(){
    var str = '';
    str += '<form role="form">';
    str+='<div class="form-group">';
    str+='<label for="first">First Row:</label>';
    str+='<input type="text" required class="form-control" id="first">';
    str+='<label for="second">Second Row:</label>';
    str+='<input type="text" required class="form-control" id="second">';
    str+='<label for="third">Third Row:</label>';
    str+='<input type="text" required class="form-control" id="third">';
    str+='<label for="fourth">Fourth Row:</label>';
    str+='<input type="text" required class="form-control" id="fourth">';
    str+='<label for="fifth">Fifth Row:</label>';
    str+='<input type="text" required class="form-control" id="fifth">';
    str+='<label for="sixth">Sixth Row:</label>';
    str+='<input type="text" required class="form-control" id="sixth">';
    str+='<label for="seventh">Seventh Row:</label>';
    str+='<input type="text" required class="form-control" id="seventh">';
    str+='<label for="eight">Eighth Row:</label>';
    str+='<input type="text" required class="form-control" id="eight">';
    str+='<label for="ninth">Ninth Row:</label>';
    str+='<input type="text" required class="form-control" id="ninth">';
    str+='</div>';
    str+='</form>';
    return str;
}

function SudokuViewModel(){
    var self = this;
    self.title = "S U D O K U - S O L V E R";
    
    self.timer = ko.observable(0);
    self.clock = ko.computed(function(){
        var totalsec = parseInt( self.timer() );

        var mins = Math.floor(totalsec/60);
        var secs = totalsec - mins*60;

        return getTwoDigit(""+mins)+":"+getTwoDigit(""+secs);
    });
    var interv ;
    self.puzzle = [
        {   
            type: 'easy',
            index: 0,
            puz: [
                    [0,0,3,0,2,0,6,0,0],
                    [9,0,0,3,0,5,0,0,1],
                    [0,0,1,8,0,6,4,0,0],
                    [0,0,8,1,0,2,9,0,0],
                    [7,0,0,0,0,0,0,0,8],
                    [0,0,6,7,0,8,2,0,0],
                    [0,0,2,6,0,9,5,0,0],
                    [8,0,0,2,0,3,0,0,9],
                    [0,0,5,0,1,0,3,0,0]
                ]
        },
        {
            type: 'easy',
            index: 1,
            puz: [
            
              [0,2,6,0,0,0,8,1,0],
              [3,0,0,7,0,8,0,0,6],
              [4,0,0,0,5,0,0,0,7],
              [0,5,0,1,0,7,0,9,0],
              [0,0,3,9,0,5,1,0,0],
              [0,4,0,3,0,2,0,5,0],
              [1,0,0,0,3,0,0,0,2],
              [5,0,0,2,0,4,0,0,9],
              [0,3,8,0,0,0,4,6,0]
            ]
        
        
        },
        {
            type: 'tough',
            index: 0,
            puz: [
                [0,0,0,2,0,0,0,6,3],
                [3,0,0,0,0,5,4,0,1],
                [0,0,1,0,0,3,9,8,0],
                [0,0,0,0,0,0,0,9,0],
                [0,0,0,5,3,8,0,0,0],
                [0,3,0,0,0,0,0,0,0],
                [0,2,6,3,0,0,5,0,0],
                [5,0,3,7,0,0,0,0,8],
                [4,7,0,0,0,1,0,0,0]
            
            ]
        },
        {
            type: 'tough',
            index: 1,
            puz: [
            
            [0,1,0,0,0,4,0,0,0],
            [0,0,6,8,0,5,0,0,1],
            [5,0,3,7,0,1,9,0,0],
            [8,0,4,0,0,7,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,3,0,0,6,0,9],
            [0,0,1,5,0,8,2,0,4],
            [6,0,0,4,0,3,1,0,0],
            [0,0,0,2,0,0,0,5,0] 
            ]
        },
        {
            type: 'extreme',
            index: 0,
            puz: [
            [1,3,0,0,0,0,0,0,0],
            [0,0,2,0,5,0,0,3,0],
            [0,0,9,0,0,2,0,8,0],
            [5,0,0,3,0,0,0,1,0],
            [0,0,0,1,0,6,0,0,0],
            [0,1,0,0,0,5,0,0,7],
            [0,9,0,4,0,0,3,0,0],
            [0,8,0,0,2,0,5,0,0],
            [0,0,0,0,0,0,0,6,4] 
            
            ]
        },
        {
            type: 'extreme',
            index: 1,
            puz: [
            [1,0,0,0,7,0,0,3,0],
            [8,3,0,6,0,0,0,0,0],
            [0,0,2,9,0,0,6,0,8],
            [6,0,0,0,0,4,9,0,7],
            [0,9,0,0,0,0,0,5,0],
            [3,0,7,5,0,0,0,0,4],
            [2,0,3,0,0,9,1,0,0],
            [0,0,0,0,0,2,0,4,3],
            [0,4,0,0,8,0,0,0,9] 
            
            ]
        }

    ];
    
    self.gameTypes = ["Easy","Tough","Extreme","Custom"];

    self.selectedPuzzle = ko.observable(new selectedPuzzleClass(self.puzzle[0]));
    fillTable(self.selectedPuzzle().puz);
    interv = setInterval(function() {
        var newTimer = self.timer() + 1;
        self.timer( newTimer);
    }, 1000);


    self.puzzleSolution = ko.computed(function(){
        var puzzle = self.selectedPuzzle().puz.map(function(arr){
            return arr.slice(0);
        });
        return solvePuzzle(puzzle);
    });


    self.levelClick = function(item,event){
        clearInterval(interv);
        self.timer(0);
        interv = setInterval(function() {
            var newTimer = self.timer() + 1;
            self.timer( newTimer);
        }, 1000);
        var typeOfPuzzle = event.target.innerHTML.toLowerCase();
        if (typeOfPuzzle=='easy') {
            self.selectedPuzzle( new selectedPuzzleClass(self.puzzle[0]) );
            fillTable(self.selectedPuzzle().puz);
        }else if (typeOfPuzzle=='tough') {
            self.selectedPuzzle( new selectedPuzzleClass(self.puzzle[2]) );
            fillTable(self.selectedPuzzle().puz);
        }else if (typeOfPuzzle == "extreme"){
            self.selectedPuzzle( new selectedPuzzleClass(self.puzzle[4]) );
            fillTable(self.selectedPuzzle().puz);
        
        } 
    }

    self.customClick = function(item,event){
        
        BootstrapDialog.show({
            title: 'Insert Custom Sudoku', 
            buttons: [{
                 id: 'btn-ok',   
                 icon: 'glyphicon glyphicon-check',       
                 label: 'OK',
                 cssClass: 'btn-primary', 
                 autospin: false,
                 hotkey:13,//enter
                 action: function(dialogRef){    
            var first = dialogRef.getModalBody().find('#first').val();
            var second = dialogRef.getModalBody().find('#second').val();
            var third = dialogRef.getModalBody().find('#third').val();
            var fourth = dialogRef.getModalBody().find('#fourth').val();
            var fifth = dialogRef.getModalBody().find('#fifth').val();
            var sixth = dialogRef.getModalBody().find('#sixth').val();
            var seventh = dialogRef.getModalBody().find('#seventh').val();
            var eight = dialogRef.getModalBody().find('#eight').val();
            var ninth = dialogRef.getModalBody().find('#ninth').val();

            var regexPattern = /(\d,){8}\d/;
            if(
                    !first.match(regexPattern) ||
                    !second.match(regexPattern) ||
                    !third.match(regexPattern) ||
                    !fourth.match(regexPattern) ||
                    !fifth .match(regexPattern) ||
                    !sixth.match(regexPattern) ||
                    !seventh.match(regexPattern) ||
                    !eight.match(regexPattern) ||
                    !ninth.match(regexPattern)
              ){
                alert("Please fill required fields!");
                return;
            }

            var firstValues   = first.split(",");
            var secondValues  = second.split(",");
            var thirdValues   = third.split(",");
            var fourthValues  = fourth.split(",");
            var fifthValues   = fifth.split(",");
            var sixthValues   = sixth.split(",");
            var seventhValues = seventh.split(",");
            var eightValues   = eight.split(",");
            var ninthValues   = ninth.split(",");

            var customValues = new Array();
            customValues.push(firstValues);
            customValues.push( secondValues );
            customValues.push(thirdValues);
            customValues.push( fourthValues );
            customValues.push( fifthValues );
            customValues.push( sixthValues );
            customValues.push( seventhValues );
            customValues.push( eightValues );
            customValues.push( ninthValues );

            for (var i=0; i < customValues.length; ++i) {
                for (var j=0; j < customValues[i].length; ++j) {
                    var val = parseInt(customValues[i][j]);
                    customValues[i][j]=val;
                }
            }

            var puzzle = {
                type: 'custom',
                index: 0,
                puz: customValues
            };
            self.selectedPuzzle(new selectedPuzzleClass(puzzle));
            fillTable(self.selectedPuzzle().puz);

            dialogRef.close();
            }
            }],
            message : getCustomForm(),
            onshown: function(dialogRef){
                 var element = dialogRef.getModalBody().find('button');
                 //element.focus();
                 //element[0].setSelectionRange(0,element.val().length);
            } 
        });
    }

    self.restartGame = function (item,event){
        fillTable(self.selectedPuzzle().puz);
        clearInterval(interv);
        self.timer(0);
        interv = setInterval(function() {
            var newTimer = self.timer() + 1;
            self.timer( newTimer);
        }, 1000);
    }


    self.newGame = function(item,event){
        
        var selectedPuzzleType = self.selectedPuzzle().type;
        if(selectedPuzzleType == "custom"){
            return;
        }
        clearInterval(interv);
        self.timer(0);
        interv = setInterval(function() {
            var newTimer = self.timer() + 1;
            self.timer( newTimer);
        }, 1000);
        var selectedPuzzleType = self.selectedPuzzle().type;
        var selectedPuzzleIndex =self.selectedPuzzle().index; 

        if(selectedPuzzleType == "easy"){
            if ( selectedPuzzleIndex == 0){
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[1]));
            }else{
            
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[0]));
            }
        } else if(selectedPuzzleType == "tough"){
            if ( selectedPuzzleIndex == 0){
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[3]));
            }else{
            
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[2]));
            }
        } else if(selectedPuzzleType == "extreme"){
            if ( selectedPuzzleIndex == 0){
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[5]));
            }else{
            
                self.selectedPuzzle(new selectedPuzzleClass(self.puzzle[4]));
            }
        }

        fillTable(self.selectedPuzzle().puz);

    }

    self.solveGame = function(item,event){
        clearInterval(interv);
        fillTable(self.puzzleSolution());
    
    }


}

ko.applyBindings(new SudokuViewModel());
});
