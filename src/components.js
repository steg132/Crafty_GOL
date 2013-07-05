// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * (Game.map_grid.tile.width + Game.map_grid.margin) + Game.map_grid.margin, 
        y: y * (Game.map_grid.tile.height + Game.map_grid.margin) + Game.map_grid.margin });
      this.attr({gridPos:{x:x, y:y}});
      return this;
    }
  }
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, DOM, Grid');
  },
});
 
// 
Crafty.c('Cell', {
  init: function() {
    this.requires('Actor, Color')
      .color('white')
  },
  // called to bring a cell to life
  live: function() {
    // set the cell color
    this.color('green')
  },
  die: function() {
    // set the cell color
    this.color('white')    
  }
});

Crafty.c('ClickableCell', {
  init: function() {
    this.requires('Cell, Mouse')
      .bind('MouseOver', function(e){
        if ( Game.isEditing == true ) {
          this.live();
          Game.lifeMap[this.gridPos.x][this.gridPos.y] = 1;
        }
      })
      .bind('Click', function(){
        this.live();
        Game.lifeMap[this.gridPos.x][this.gridPos.y] = 1;
      })
      .areaMap([0,0], [this.w,0], [this.w, this.h], [0, this.h]);
  }
});

 