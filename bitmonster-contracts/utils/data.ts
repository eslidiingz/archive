// land
export const dataLandId = [
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
  116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
  131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145,
  146, 147, 148, 149, 150, 151, 152, 201, 202, 203, 204, 205, 206, 207, 208,
  209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
  224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238,
  239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 301,
  302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316,
  317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331,
  332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346,
  347, 348, 349, 350, 351, 352, 401, 402, 403, 404, 405, 406, 407, 408, 409,
  410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424,
  425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439,
  440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 501, 502,
  503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517,
  518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532,
];
export const dataLandPrice = 25000000000000000000;

export const dataLand = [
  {
    zone: 1,
    price: dataLandPrice,
    id: dataLandId,
  },
  {
    zone: 2,
    price: dataLandPrice,
    id: dataLandId,
  },
  {
    zone: 3,
    price: dataLandPrice,
    id: dataLandId,
  },
  {
    zone: 4,
    price: dataLandPrice,
    id: dataLandId,
  },
  {
    zone: 5,
    price: dataLandPrice,
    id: dataLandId,
  },
];

// dataMonster
export const dataMonster = [
  {
    name: "Immortal",
    price: 500000000000000000000,
    id: [1, 2, 3],
    limit: [200, 200, 200],
    total: 600,
  },
  {
    name: "Legendary",
    price: 250000000000000000000,
    id: [4, 5, 6, 7],
    limit: [200, 200, 200, 200],
    total: 800,
  },
  {
    name: "Epic",
    price: 150000000000000000000,
    id: [8, 9, 10, 11, 12, 13],
    limit: [167, 167, 167, 167, 166, 166],
    total: 1000,
  },
  {
    name: "Rare",
    price: 60000000000000000000,
    id: [14, 15, 16, 17, 18, 19, 20],
    limit: [215, 215, 214, 214, 214, 214, 214],
    total: 1500,
  },
  {
    name: "Common",
    price: 25000000000000000000,
    id: [21, 22, 23, 24, 25],
    limit: [600, 600, 600, 600, 600],
    total: 3000,
  },
];

// item
export const dataItem = [
  {
    box: 1,
    price: 25000000000000000000,
    key: [40, 70, 85, 95, 100],
    id: {
      "40": [
        1, 4, 5, 6, 7, 8, 10, 11, 14, 15, 16, 17, 18, 19, 21, 24, 25, 26, 28,
        29, 30, 31,
      ],
      "70": [2, 9, 20, 23, 33, 43, 44, 45, 46, 47, 48, 49, 50],
      "85": [3, 22, 27, 32, 34, 41],
      "95": [12, 13, 36, 42],
      "100": [35, 37, 38, 39, 40],
    },
  },
];