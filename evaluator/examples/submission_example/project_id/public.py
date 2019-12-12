import unittest

import sample

class TestSample(unittest.TestCase):
    
    def test_add(self):
        self.assertEqual(sample.add(1, 2), 3)
        self.assertEqual(sample.add(-1, 2), 1)
        self.assertEqual(sample.add(1, -2), -1)
        self.assertEqual(sample.add(-1, -2), -3)

    def test_from_zero(self):
        self.assertEqual(sample.from_zero(3), [0, 1, 2])
        self.assertEqual(sample.from_zero(1), [0])
        self.assertEqual(sample.from_zero(-3), [])

if __name__ == '__main__':
    unittest.main()
    
