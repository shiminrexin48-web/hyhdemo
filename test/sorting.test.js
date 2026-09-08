/* 排序算法回归测试（ISSUE-4 修复）
   运行：node test/sorting.test.js
   覆盖：固定用例、随机数据对照原生 sort、退化输入守卫（有序/逆序/全相等大数组不崩溃） */
'use strict';

const assert = require('assert');
const { bubbleSort, insertionSort, quickSort } = require('../js/sorting.js');

const algorithms = { bubbleSort, insertionSort, quickSort };
let pass = 0;

function verify(name, input, expected) {
  const out = algorithms[name](input.slice());
  assert.deepStrictEqual(out, expected,
    name + ' 在 ' + JSON.stringify(input) + ' 上结果错误');
  pass++;
}

// 1. 固定用例
const fixedCases = [
  [[], []],
  [[5], [5]],
  [[1, 2, 3], [1, 2, 3]],
  [[3, 2, 1], [1, 2, 3]],
  [[2, 2, 2], [2, 2, 2]],
  [[5, 3, 8, 1, 9, 3], [1, 3, 3, 5, 8, 9]],
  [[-7, 0, 42, -7, 3], [-7, -7, 0, 3, 42]],
];

// 2. 随机数据对照原生 sort（各 200 轮）
let randomCases = 0;

// 3. 退化输入守卫：1 万个有序/逆序/全相等元素不得抛错（ISSUE-1 回归）
const N = 10000;
const degenerateInputs = [
  Array.from({ length: N }, (_, i) => i),               // 有序
  Array.from({ length: N }, (_, i) => N - i),           // 逆序
  new Array(N).fill(7),                                 // 全相等
];

Object.keys(algorithms).forEach((name) => {
  fixedCases.forEach(([input, expected]) => verify(name, input, expected));

  for (let i = 0; i < 200; i++) {
    const len = 1 + Math.floor(Math.random() * 80);
    const input = Array.from({ length: len }, () => Math.floor(Math.random() * 200) - 100);
    const expected = input.slice().sort((a, b) => a - b);
    verify(name, input, expected);
    randomCases++;
  }

  degenerateInputs.forEach((input) => {
    assert.doesNotThrow(() => algorithms[name](input.slice()), name + ' 处理大数组时崩溃');
    pass++;
  });
});

console.log('全部通过：3 种算法 × (' +
  fixedCases.length + ' 固定用例 + ' + randomCases + ' 随机对照 + ' +
  degenerateInputs.length + ' 退化输入) = ' + pass + ' 项断言 ✅');
