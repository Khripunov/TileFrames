"""
Tile layout engine supporting horizontal and vertical orientations.

The horizontal orientation follows the behavior shown in the provided scheme:
* Groups are rendered side-by-side in a single row.
* ``RowCount`` limits how many logical rows can exist inside a column.
* Each logical column is exactly ``2 * ItemSize`` units wide.
* Tiles are packed left-to-right inside a column until the column width is filled,
  then packing continues on the next row. When the row limit is reached the
  next logical column starts.

The vertical orientation mirrors the same logic, but swaps axes:
* Groups are rendered in a single column, stacked vertically.
* ``ColumnCount`` limits how many logical columns can exist inside a row.
* Each logical row is exactly ``2 * ItemSize`` units tall.
* Tiles are packed top-to-bottom inside a row until the row height is filled,
  then packing continues in the next column. When the column limit is reached
  the next logical row starts beneath the previous one.

Dimensions are expressed in multiples of ``ItemSize`` so a tile that is twice as
wide as the base size should set ``width_units=2``.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Tuple


@dataclass(frozen=True)
class Tile:
    """Represents a tile with size expressed in multiples of ItemSize."""

    id: str
    width_units: int = 1
    height_units: int = 1

    def __post_init__(self) -> None:
        if self.width_units <= 0 or self.height_units <= 0:
            raise ValueError("Tile dimensions must be positive integers")


@dataclass(frozen=True)
class PositionedTile(Tile):
    """A tile with an assigned position in pixels."""

    x: int = 0
    y: int = 0


class LayoutEngine:
    """Computes tile positions for horizontal and vertical orientations."""

    def __init__(self, item_size: int, row_count: int = 1, column_count: int = 1):
        if item_size <= 0:
            raise ValueError("item_size must be positive")
        if row_count <= 0:
            raise ValueError("row_count must be positive")
        if column_count <= 0:
            raise ValueError("column_count must be positive")

        self.item_size = item_size
        self.row_count = row_count
        self.column_count = column_count

    def layout(self, tiles: Iterable[Tile], orientation: str) -> List[PositionedTile]:
        """Return pixel positions for every tile based on orientation.

        Args:
            tiles: Iterable of tiles in the order they should appear.
            orientation: ``"horizontal"`` or ``"vertical"``.
        """

        normalized = orientation.lower()
        if normalized not in {"horizontal", "vertical"}:
            raise ValueError("orientation must be 'horizontal' or 'vertical'")

        if normalized == "horizontal":
            block_width = 2
            block_height = self.row_count
            block_advance = (2 * self.item_size, 0)
            search_order = ("row", "column")  # scan rows first
        else:
            block_width = self.column_count
            block_height = 2
            block_advance = (0, 2 * self.item_size)
            search_order = ("column", "row")  # scan columns first (top-to-bottom)

        tiles_list = list(tiles)
        positions: List[PositionedTile] = []

        block_origin_x = 0
        block_origin_y = 0
        grid = [[None for _ in range(block_width)] for _ in range(block_height)]

        for tile in tiles_list:
            placed = False
            while not placed:
                location = self._find_space(
                    grid, tile.width_units, tile.height_units, search_order
                )
                if location is None:
                    # start a new block
                    block_origin_x += block_advance[0]
                    block_origin_y += block_advance[1]
                    grid = [[None for _ in range(block_width)] for _ in range(block_height)]
                    continue

                grid_x, grid_y = location
                pixel_x = block_origin_x + grid_x * self.item_size
                pixel_y = block_origin_y + grid_y * self.item_size
                self._occupy(grid, grid_x, grid_y, tile.width_units, tile.height_units)
                positions.append(
                    PositionedTile(
                        id=tile.id,
                        width_units=tile.width_units,
                        height_units=tile.height_units,
                        x=pixel_x,
                        y=pixel_y,
                    )
                )
                placed = True

        return positions

    @staticmethod
    def _find_space(
        grid: List[List[str | None]],
        width_units: int,
        height_units: int,
        search_order: Tuple[str, str],
    ) -> Tuple[int, int] | None:
        grid_height = len(grid)
        grid_width = len(grid[0]) if grid else 0

        if width_units > grid_width or height_units > grid_height:
            return None

        primary_first = search_order[0]
        range_primary = range(grid_height - height_units + 1)
        range_secondary = range(grid_width - width_units + 1)

        # For vertical orientation we scan columns first so we rotate the loops.
        if primary_first == "column":
            range_primary, range_secondary = range_secondary, range_primary

        for primary in range_primary:
            for secondary in range_secondary:
                x = secondary if primary_first == "row" else primary
                y = primary if primary_first == "row" else secondary
                if LayoutEngine._fits(grid, x, y, width_units, height_units):
                    return x, y

        return None

    @staticmethod
    def _fits(grid: List[List[str | None]], x: int, y: int, w: int, h: int) -> bool:
        for dy in range(h):
            for dx in range(w):
                if grid[y + dy][x + dx] is not None:
                    return False
        return True

    @staticmethod
    def _occupy(grid: List[List[str | None]], x: int, y: int, w: int, h: int) -> None:
        for dy in range(h):
            for dx in range(w):
                grid[y + dy][x + dx] = "occupied"
