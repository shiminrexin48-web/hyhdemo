/* ==========================================================================
   排序算法演示 - 冒泡排序 / 插入排序 / 快速排序
   纯 JavaScript 实现，无任何依赖。

   说明：
   - 所有排序函数均为原地排序（in-place），会修改传入的数组，
     如需保留原数据请先拷贝，如 arr.slice()
   - 默认按升序排列
   - Node 环境可通过 module.exports 引入（见文件末尾）与 test/sorting.test.js
   ========================================================================== */

/** 交换数组中两个位置的元素（临时变量交换，避免解构赋值产生临时数组） */
function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

/**
 * 冒泡排序
 * 相邻元素两两比较，逆序则交换；每一轮将当前最大值"冒泡"到数组末尾。
 * 若某一轮没有发生任何交换，说明数组已经有序，直接提前退出。
 * 时间复杂度：平均/最坏 O(n²)，最好 O(n)（已有序提前退出）；空间复杂度：O(1)
 */
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 热路径就地交换（临时变量，不分配临时数组、无函数调用开销）
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swapped = true;
      }
    }
    if (!swapped) break;          // 本轮无交换 => 数组已有序
  }
  return arr;
}

/**
 * 插入排序
 * 将当前元素插入到左侧已排序区间的合适位置。
 * 时间复杂度：平均 O(n²)，最好 O(n)（数组已有序）；空间复杂度：O(1)
 */
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

/**
 * 快速排序（三数取中枢轴 + 三路分区，递归实现）
 * - 枢轴：取区间左 / 中 / 右三个候选值的中位数，避免有序输入下
 *   枢轴总选到极值导致最坏 O(n²) 和 O(n) 深递归（栈溢出风险）
 * - 分区：三路分区（荷兰国旗），小于枢轴的移到左侧、等于的留在中间、
 *   大于的移到右侧；重复元素一次性归位，递归深度保持 O(log n)
 * 时间复杂度：平均 O(n log n)，最坏 O(n²)（概率极低）；空间复杂度：递归栈 O(log n)
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;

  // 三数取中：把左/中/右三个候选值的中位数换到区间首位作枢轴
  const mid = left + ((right - left) >> 1);
  const a = arr[left];
  const b = arr[mid];
  const c = arr[right];
  const median = a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  const pivotIndex = a === median ? left : b === median ? mid : right;
  swap(arr, left, pivotIndex);
  const pivot = arr[left];

  // 三路分区：arr[left..lt) < pivot，arr[lt..i) == pivot，arr[i..gt] 未知，arr(gt..right] > pivot
  let lt = left;
  let i = left;
  let gt = right;
  while (i <= gt) {
    if (arr[i] < pivot) {
      swap(arr, lt, i);
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      swap(arr, i, gt);
      gt--;
    } else {
      i++;
    }
  }

  quickSort(arr, left, lt - 1);
  quickSort(arr, gt + 1, right);
  return arr;
}

/* ---------- 演示部分 ---------- */

/** 生成 n 个随机整数（0 ~ 99） */
function generateArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

/** 校验数组是否有序（升序） */
function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

/** 初始化排序演示面板：生成随机数组并同时运行三种算法比较耗时 */
function initSortDemo() {
  const panel = document.getElementById('sortDemo');
  if (!panel) return;

  const sizeInput = document.getElementById('demoSize');
  const runBtn = document.getElementById('runSort');
  const resultEl = document.getElementById('demoResult');
  const table = document.getElementById('demoTable');
  const tbody = table.querySelector('tbody');

  runBtn.addEventListener('click', () => {
    const size = parseInt(sizeInput.value, 10);
    if (Number.isNaN(size) || size < 1 || size > 200) {
      resultEl.textContent = '请输入 1 ~ 200 之间的数组长度';
      table.hidden = true;
      return;
    }

    const original = generateArray(size);
    const algorithms = [
      { name: '冒泡排序', fn: bubbleSort },
      { name: '插入排序', fn: insertionSort },
      { name: '快速排序', fn: quickSort },
    ];

    tbody.innerHTML = '';
    algorithms.forEach(({ name, fn }) => {
      const data = original.slice();          // 每个算法使用独立副本
      const start = performance.now();
      fn(data);
      const cost = performance.now() - start;

      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + name + '</td>' +
        '<td>' + cost.toFixed(2) + ' ms</td>' +
        '<td>' + (isSorted(data) ? '✔ 正确' : '✘ 错误') +
        '，前 8 个元素：' + data.slice(0, 8).join(', ') +
        (data.length > 8 ? ' …' : '') + '</td>';
      tbody.appendChild(row);
    });

    resultEl.textContent =
      '原始数据（前 8 个）：' + original.slice(0, 8).join(', ') +
      (original.length > 8 ? ' …' : '') + '（共 ' + original.length + ' 个）';
    table.hidden = false;
  });
}

if (typeof document !== 'undefined') {
  initSortDemo();
}

/* Node 环境导出，供 test/sorting.test.js 回归测试使用（浏览器环境忽略） */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { bubbleSort, insertionSort, quickSort, generateArray, isSorted };
}
