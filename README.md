# TileFrames

A small layout helper that mirrors the behavior shown in the provided tile scheme.
It can compute coordinates for both the original horizontal orientation and the
requested vertical orientation.

## Usage

```
from tile_layout import LayoutEngine, Tile

engine = LayoutEngine(item_size=100, row_count=4, column_count=3)

tiles = [
    Tile(id="1", width_units=2, height_units=1),
    Tile(id="2", width_units=1, height_units=1),
    Tile(id="3", width_units=1, height_units=2),
]

positions = engine.layout(tiles, orientation="vertical")
for tile in positions:
    print(tile.id, tile.x, tile.y)
```

The `LayoutEngine` places tiles according to these rules:

### Horizontal orientation
- Groups sit side-by-side in a single row. `ColumnCount` is ignored.
- Each logical column is `2 * ItemSize` wide and can contain up to
  `RowCount` logical rows.
- Tiles are packed left-to-right within the column until the width limit is
  reached, then packing continues on the next row. When the row limit is met a
  new logical column begins.

### Vertical orientation
- Groups are stacked in a single column. `RowCount` is ignored.
- Each logical row is `2 * ItemSize` tall and can contain up to
  `ColumnCount` logical columns.
- Tiles are packed top-to-bottom within the row until the height limit is
  reached, then packing continues in the next column. When the column limit is
  met a new logical row begins underneath.

Tile sizes are expressed in multiples of `ItemSize` using the `width_units` and
`height_units` properties on `Tile`.
