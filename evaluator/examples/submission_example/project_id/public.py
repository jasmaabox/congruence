import pytest

import sample

class TestSample:

    def test_add(self):
        assert sample.add(1, 2) == 3
        assert sample.add(-1, 2) == 1
        assert sample.add(1, -2) == -1
        assert sample.add(-1, -2) == -3

    def test_from_zero(self):
        assert sample.from_zero(3) == [0, 1, 2]
        assert sample.from_zero(1) == [0]
        assert sample.from_zero(-3) == []

    def test_fail(self):
        assert 1 == 2
