import unittest

from tile_layout import LayoutEngine, Tile


class LayoutEngineTests(unittest.TestCase):
    def test_horizontal_layout_respects_row_count(self):
        engine = LayoutEngine(item_size=100, row_count=2, column_count=3)
        tiles = [Tile(id=str(i)) for i in range(1, 6)]

        positions = engine.layout(tiles, orientation="horizontal")

        # Tiles 1 and 2 fill the first row of the first logical column.
        self.assertEqual((positions[0].x, positions[0].y), (0, 0))
        self.assertEqual((positions[1].x, positions[1].y), (100, 0))

        # Row is full, so tile 3 starts the next logical row in the same column.
        self.assertEqual((positions[2].x, positions[2].y), (0, 100))

        # Row limit reached, tile 5 begins the next logical column to the right.
        self.assertEqual(positions[4].x, 200)

    def test_vertical_layout_respects_column_count(self):
        engine = LayoutEngine(item_size=50, row_count=4, column_count=2)
        tiles = [
            Tile(id="1", width_units=1, height_units=1),
            Tile(id="2", width_units=1, height_units=1),
            Tile(id="3", width_units=1, height_units=2),
            Tile(id="4", width_units=2, height_units=1),
        ]

        positions = engine.layout(tiles, orientation="vertical")

        # Tiles 1 and 2 fill the first logical column of the first row.
        self.assertEqual(positions[0].y, 0)
        self.assertEqual(positions[1].y, 50)

        # Tile 3 does not fit in remaining vertical space and starts a new column.
        self.assertEqual((positions[2].x, positions[2].y), (50, 0))

        # Column limit is reached, so tile 4 begins a new logical row underneath.
        self.assertEqual((positions[3].x, positions[3].y), (0, 100))

    def test_invalid_orientation(self):
        engine = LayoutEngine(item_size=50)
        with self.assertRaises(ValueError):
            engine.layout([], orientation="diagonal")


if __name__ == "__main__":
    unittest.main()
