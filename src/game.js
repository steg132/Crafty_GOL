Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  20,
    height: 20,
    tile: {
      width:  12,
      height: 12
    },
    margin: 1,
    offset: 0
  },
  startButtonHeight: 30,

  // This is a 2 dimentional array where game cells will be stored
  cellMap:[],
  // This is a 2 dimentional array 
  lifeMap:[],
 
  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width 
    + (1 + this.map_grid.width) * this.map_grid.margin;
  },
 
  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height
    + (1 + this.map_grid.height) * this.map_grid.margin;
  },

  calcOffset: function() {
    var width = window.innerWidth;
    if ( Crafty.viewport.width < width)
      width = Crafty.viewport.width;
      // compute offset to center grid
    Game.map_grid.offset = width - 
    (Game.map_grid.width * Game.map_grid.tile.width +
    Game.map_grid.margin * (Game.map_grid.width + 1));
    Game.map_grid.offset = Game.map_grid.offset / 2;

  },
 
  // Initialize and start our game
  start: function(w, h) {
    if ( w && h) {
      Game.map_grid.width = w;
      Game.map_grid.height = h;
    }
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height() + Game.startButtonHeight);
    Crafty.background('black'); 

    this.calcOffset();
 
    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
      var cellRow = [];
      var lifeRow = [];
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
        // Place a bush entity at the current tile
        var cell = Crafty.e('ClickableCell').at(x, y);
        var rand = Math.random();
        if ( rand < 0.05) {
          cell.live();
          lifeRow.push(1)
        } else if ( rand > 0.95) {
          cell.live();
          lifeRow.push(1);
        } else {
          lifeRow.push(0);
        }

        // add the cell to the map
        cellRow.push(cell);
      }
      // add the row to the map
      Game.cellMap.push(cellRow);
      Game.lifeMap.push(lifeRow);
    }

    // add a start/pause button
    Crafty.e("StartButton")
    .at(Game.map_grid.offset, Game.height());
  },

  generationCount: 0,

  update: function() {

    var newMap = [];
    for (var x = 0; x < Game.map_grid.width; x++) {
      var newRow = [];
      for (var y = 0; y < Game.map_grid.height; y++) {

        var newVal = 0;


        // get number of live neighbors
        var liveNebs = 0;
        for ( var i = -1; i < 2; i++){
          for ( var j = -1; j < 2; j++) {
            // ignore the origin cell
            if ( i == 0 && j == 0 ) continue;

            try {
              // check if the value of the cell is 1
              if ( Game.lifeMap[x + i][y + j] == 1)
                liveNebs++;
            } catch(e) {/*Ignore Exception*/}
          }
        }


        // Check if this cell is alive or dead
        if ( Game.lifeMap[x][y] == 1) {
          // this is a live cell
          if ( liveNebs < 2 || liveNebs > 3) {
            // the cell is too lonely
            newVal = -1;
          } else {
            // This one live to see another day
            newVal = 1;
          }

        } else {
          // this is a dead cell
          if ( liveNebs == 3) { 
            // It's Alive!
            newVal = 1;
          } else {
            newVal = -1;
          }
        }

        // Add the new value to the life map
        newRow.push(newVal);
        // Finally, Update the cell
        if ( newVal == 1) {
          Game.cellMap[x][y].live();
        } else {
          Game.cellMap[x][y].die();
        }
      }
      newMap.push(newRow);
    }

    // Update the life map
    Game.lifeMap = newMap;

    // Update the generation
    Game.generationCount++;
  }
}


