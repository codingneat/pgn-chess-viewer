
var pgnData = '[Event "GMA"] [Site "Wijk aan Zee NED"] [Date "2003.01.15"] [Round "4"] [White "Ponomariov, Ruslan"] [Black "Shirov, Alexei D"] [Result "0-1"] [WhiteElo "2734"] [BlackElo "2723"] [ECO "D44"] [EventDate "2003.01.11"] 1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 e6{fff  fff} 5.Bg5 dxc4 6.e4 b5 7.e5 h6 8.Bh4 g5 9.Nxg5 hxg5 10.Bxg5 Nbd7 11.g3 Bb7 12.Bg2 Qb6 13.exf6 O-O-O 14.O-O c5 15.d5 b4 16.Na4 Qb5 17.a3 exd5 18.axb4 cxb4 19.Be3 Nc5 20.Qg4+ Rd7 21.Qg7 Bxg7 22.fxg7 Rg8 23.Nxc5 Rxg7 24.Nxd7 Qxd7 25.Rxa7 Rg6 26.Rfa1 Re6 27.Bd4 Re2 28.h4 Rd2 29.Be3 Rxb2 30.R1a5 b3 31.Rc5+ Kd8 32.Rxb7 Qxb7 33.Rxd5+ Qxd5 34.Bxd5 Rb1+ 35.Kg2 b2 36.Be4 Rd1 37.Bg5+ Ke8 38.Bf6 b1=Q 39.Bxb1 Rxb1 40.h5 Kf8 41.g4 Rd1 42.Bb2 Kg8 0-1';

var board1 = '';
var pos = 0;
var gameData = [];
var game = [];



function color(pos,val) {
	$('td').css("background-color", "transparent");
	$('tr').css("background-color", "#F2F1EF");
	$('tr:nth-child('+parseInt((pos+1)/2)+')').css("background-color", "#22A7F0");
	if(game.turn()==='w'||val===1){
		$('td:nth-child(1)').css("background", '#F2F1EF');
	}else{
		$('td:nth-child(2)').css("background-color", '#F2F1EF');
	}
}

function color_reset() {
	$('td').css("background-color", "transparent");
	$('tr').css("background-color", "#F2F1EF");
}

function next(){
	if (pos < gameData.length - 1) {
	    pos++;
	    game.move(gameData[pos-1]);
	    board1.position(game.fen());
	}
	color(pos);
}

function prev(){
	if (pos > 0) {
	    pos--;
	    game.undo();
	    board1.position(game.fen());
	}
	color(pos);
}

function start(){
    pos = 0;
    game.reset();
    board1.position(game.fen());
    color_reset();
}

function end(){
    while (pos < gameData.length - 1) {
	    pos++;
	    game.move(gameData[pos-1]);
    }
    board1.position(game.fen());
    color(pos,1);
}

function move(p){
		if(p>pos) {
			while (pos < p) {
			    pos++;
			    game.move(gameData[pos-1]);
		    }
		    board1.position(game.fen());
		    color(pos);

		}else if(p<pos){
			game.reset();
			pos = 0;
			while (pos < p) {
			    pos++;
			    game.move(gameData[pos-1]);
		    }
		    board1.position(game.fen());
		    color(pos);

		}
}

function save(){
	var t = $('textarea').val();
	pos = 0;	
	$('table').html('');
	initialize(t)
}

function parseData(data) {
	var first = data.indexOf('"');
	var last = data.lastIndexOf('"');

	return data.substring(first+1,last);
}

function parsePgn(pgn) {
	pgn = pgn.replace(/(\r\n|\n|\r)/gm," ");
	pgn = pgn.replace(/ +(?= )/g,'');
	var array = pgn.split(']');
	var black = ''

	
	for(var i = 0;i<array.length;i++){
		array[i] = array[i].trim();
		if(array[i].substr(0,1)==='['){
			array[i] = array[i].substr(1,array[i].length-1);
		}
	}

	array[array.length-1] = array[array.length-1].replace(/{.+?}/g,function(c) {return c.replace(' ','||') } )

	
	return {data:array,pgn:array[array.length-1]};
}

function layout(obj) {

	var array = obj.data;
	var pgn = obj.pgn.split(' ');


	for(var i=0;i<pgn.length;i=i+2){
		black = pgn[i+1] || '';
		$('table').append('<tr><td><a href="javascript:void(0)"  onclick="move('+(i+1)+')">'+pgn[i]+'</a></td><td><a href="javascript:void(0)" onclick="move('+(i+2)+')">'+black+'</a></td></tr>');
		
	}

	for(var i = 0;i<array.length;i++){
		if(array[i].substr(0,6)==='White '){
			$('#white').text(parseData(array[i]));
		}
		if(array[i].substr(0,6)==='Black '){
			$('#black').text(parseData(array[i]));
		}
		if(array[i].substr(0,6)==='WhiteE'){
			$('#whiteElo').text('('+parseData(array[i])+')');
		}
		if(array[i].substr(0,6)==='BlackE'){
			$('#blackElo').text('('+parseData(array[i])+')');
		}
		if(array[i].substr(0,4)==='Site'){
			$('#site').text(parseData(array[i]));
		}
		if(array[i].substr(0,6)==='Event '){
			$('#event').text(parseData(array[i]));
		}
		if(array[i].substr(0,5)==='Round'){
			$('#round').text('ronda:'+parseData(array[i]));
		}
		if(array[i].substr(0,4)==='Date'){
			$('#date').text(parseData(array[i]));
		}

	}


	return ;
}

function initialize(pgn) {
	board1 = ChessBoard('board1', 'start');
	$(window).resize(board1.resize);

	var chess = new Chess();

	var obj = parsePgn(pgn);

	chess.load_pgn(obj.pgn);

	gameData = chess.history();

	layout(obj);

	chess.reset();
	game = chess;
}




//initialize
initialize(pgnData);








