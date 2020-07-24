'use strict';
let first_move_ai = [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]];

class TicTacToe {
  constructor(max_depth, curr_player, w, h,help) {

    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.ai = 'O';
    this.human = 'X';
    this.res = [[0, 0], [0, 0]];
    this.player = curr_player;
    this.curr_depth = 0;
    this.max_depth = max_depth;
    this.winner = null;
    this.end = "no"; 
    this.help = false; 
    this.nexthumanmove = [];
  }
  initialise_board = (c, w, h) => {
    c.background('rgba(0, 0, 0, 1)');
    c.strokeWeight(4);
    c.stroke('#E9E7F5CC');
    c.line(w, 0, w, c.height);
    c.line(w * 2, 0, w * 2, c.height);
    c.line(0, h, c.width, h);
    c.line(0, h * 2, c.width, h * 2);
    c.line(w, 0, w, c.height);
  }
  // adds O OR X 
  render_board = (c, w, h) => {
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let x = w * i + w / 2;
        let y = h * j + h / 2;
        let spot = this.board[i][j];
                c.textSize(32);

        let r = w / 2.8;
        if (spot == "ai") {
          c.noFill();
          c.stroke('rgb(255,0,0)');
          c.ellipse(x, y, r * 2);
        } else if (spot == "human") {
          c.stroke("yellow");
          c.line(x - r, y - r, x + r, y + r);
          c.line(x + r, y - r, x - r, y + r);
        }
      }
    }
  }
  highlight_hint = (c,w,h) => {
    if (this.player=="human" && this.end=="no" && this.help==true){
    this.human_move_help();
    let x = this.nexthumanmove[0]*w;
    let y = this.nexthumanmove[1]*h;
    c.stroke('white');
    c.fill(255,20);
    c.rect(x,y,w,h);
    }
  }
  print_winner = () => {
    if (this.winner!="tie")
    {
      if(this.winner=="ai")
      $("#winner").text ("You Lose!");
      else {
      $("#winner").text ("You Win!");
      }
    }
    else 
      $("#winner").text ("TIE!");
  }
  human_move_help = () =>{
    if (this.help==true && this.player=="human" && this.end=="no"){
    
      let res = [];
      let count = 0;
      for (let i=0;i<3;i++){
          for (let j=0;j<3;j++){
            if (this.board[i][j]=='') count++;
            else break;
          }
      }
      if (count==9){ 
        let moves = first_move_ai[Math.floor(Math.random() * first_move_ai.length)];
        res = moves;
      }
      else{
      res = this.find_move();
      this.nexthumanmove = res;
      }
      this.nexthumanmove = res;
    }
    return;
  }
  find_move = () => {
    let maxscore = this.player == "ai" ? -Infinity : Infinity;

    let move;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if free
        if (this.board[i][j] == '') {
          this.board[i][j] = this.player; 
          let newplayer = (this.player=="ai") ? "human" : "ai";
          let score = this.minimax(this.curr_depth,newplayer,-Infinity,Infinity); // pass alpha and beta
          console.log(score);
          this.board[i][j] = '';
          if (this.player == "ai" && score>maxscore) {
            maxscore = Math.max(score, maxscore);
            console.log(i + " " + j);
            move = [i, j]; 
          } else if (this.player=="human" && score<maxscore){
            maxscore = Math.min(score, maxscore);
            move = [i,j];
          } 
          
        }
      }
    }
    let x, y;
    if (this.player!="ai"){
    
      return move;
    }
    if (maxscore != -Infinity) {
      x = move[0];
      y = move[1];
      this.board[x][y] = "ai";
      this.curr_depth++;
      if (this.checkEnd() != null) {
        this.end = "yes";
        this.winner = (this.checkEnd() == "tie") ? "tie" : "ai";  
        
        this.print_winner();
        console.log("Winner is " + this.winner);
      }
      else this.player = "human"; 
    }

  }
  minimax = (depth, player,alpha,beta) => {
    
    let result = this.checkEnd();
  

    if (result != null || (depth >= this.max_depth && this.player=="ai")) {
    
      if (result == "ai") return 100 - depth;
      else if (result == "human") return -100 + depth;
      else return 0; // tie
    }
    
    let maxscore = player == "ai" ? -Infinity : Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // check if available
        if (this.board[i][j] == "") {
        
          this.board[i][j] = player; 
          
          let newplayer = (player == "ai") ? "human" : "ai";
          let score = this.minimax(depth + 1, newplayer,alpha,beta);
          
          this.board[i][j] = "";
          if (player == "ai") {
            maxscore = Math.max(score, maxscore);
            alpha = Math.max(alpha,score);
          } 
          else {
            maxscore = Math.min(score, maxscore);
            beta = Math.min(beta,score);
          }
          if (beta<=alpha) break; 
        }
      }
    }
  
    return maxscore;
  }
  isEmpty = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] == "") return true;
      }
    }
    return false;
  }
  drawLine = (c, w, h) => {
    c.strokeWeight(20);
    c.stroke('#83818FCF');
    c.line(this.res[0][0] * w + w / 2, this.res[0][1] * h + h / 2, this.res[1][0] * w + w / 2, this.res[1][1] * h + h / 2);
    c.noLoop();
  }

  mark_winner = (x1, y1, x2, y2) => {
    this.res[0] = [x1, y1];
    this.res[1] = [x2, y2];
  }
  checkEnd = () => {
    
    let win = null;

    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] != '' && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {
        win = this.board[i][0];
        this.mark_winner(i, 0, i, 2);
        return win;
      }
    }
    // check vertical winners
    for (let j = 0; j < 3; j++) {
      if (this.board[0][j] != '' && this.board[0][j] == this.board[1][j] && this.board[1][j] == this.board[2][j]) {
        win = this.board[0][j];
        this.mark_winner(0, j, 2, j);
        return win;
      }
    }
    // check diagonal
    if (this.board[0][0] != '' && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
      win = this.board[0][0];
      this.mark_winner(0, 0, 2, 2);
      return win;
    }
    // check other diagonal
    if (this.board[2][0] != '' && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
      win = this.board[2][0];
      this.mark_winner(2, 0, 0, 2);
      return win;
    }

    if (!this.isEmpty()) {
      win = 'tie';
    }
    return win;
  }

};

const make_board = (canvas_name, player, max_depth,help) => {
  let w, h;
  if(player=="human")
  {
  if (max_depth == "E") max_depth = 1;
  else if (max_depth == "M") max_depth = 3;
  else if (max_depth == "D") max_depth = 5;
  else if (max_depth == "VD") max_depth = 7;
  else max_depth = Infinity;
}
else if(player=='ai')
{
  if (max_depth == "E") max_depth = 1;
  else if (max_depth == "M") max_depth = 2;
  else if (max_depth == "D") max_depth = 3;
  else if (max_depth == "VD") max_depth = 4;
  else max_depth = Infinity;  
}

  var game = new TicTacToe(max_depth, player, w, h,help);

  let board = (s) => {

    s.setup = () => {

      s.createCanvas(400, 400).parent(canvas_name); // height, width
      w = s.width / 3;
      h = s.height / 3;
    
      let items = first_move_ai[Math.floor(Math.random() * first_move_ai.length)];
      if (game.player=='ai'){
        game.board[items[0]][items[1]] = "ai";
        game.player = "human";
      }
    }
  
    s.draw = () => {
      game.initialise_board(s, w, h); // find and fill board
      game.render_board(s, w, h);
      game.highlight_hint(s,w,h);
      if (game.end == "yes" && game.winner != "tie") {
        game.drawLine(s, w, h);
      }
    }
  
    s.mousePressed = () => {
      if (game.player == "human" && game.end == "no") {
        //console.log("hi");
        let i = Math.floor(s.mouseX / w);
        let j = Math.floor(s.mouseY / h);
        game.human_move_help();
      
        if (game.board[i][j] == "" && game.end == "no") {
          game.board[i][j] = "human";
          game.curr_depth++; // increment the depth
          console.log("human's turn");
          
          let res = game.checkEnd();
          if (res != null) {
            game.winner = (res == "tie") ? "tie" : "human";
            game.end = "yes";
            //s.noLoop();
            console.log(game.end);
            s.clear();
            // PRINT WINNER HERE 
            game.print_winner();
          }
          else { 
            game.player = "ai";
            game.find_move();
          }
        }
      } 
    }
  }
  return board;
}

let temp;
$(document).ready(function () {
  let level = "E";
  let startingplayer = 'ai';
  let help = false; 
  temp = new p5(make_board('can1', startingplayer, level,help));
  consoleHello();

  $('#depth').on('change', function () {
    level = $('#depth').val();
  });

  $('#player').on('change', function () {
    startingplayer = $('#player').val();
  });

  $('#help').on('change', function () {
    help = $('#help').val();
  });

  $('#submit').click(function (event) {
    event.preventDefault(); 
    temp.remove(); 

    console.log(startingplayer);
    console.log(level);
    console.log(help);
    $('#winner').html('&nbsp;');
    temp = new p5(make_board('can1', startingplayer, level,help));
  })
})

function consoleHello() {
  var userAgent = navigator.userAgent.toLowerCase();
  var supported = /(chrome|firefox)/;

  if (supported.test(userAgent.toLowerCase())) {
    var dark = ['padding: 18px 5px 16px', 'background-color: #171718', 'color: #e74c3c'].join(';');

    if (userAgent.indexOf('chrome') > -1) {
      dark += ';';
      dark += ['padding: 18px 5px 16px 40px', 'background-image: url("https://i.imgur.com/ElEn6VW.png")', 'background-position: 10px 9px', 'background-repeat: no-repeat', 'background-size: 30px 30px'].join(';');
    }
  }
}

    

