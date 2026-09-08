/* ==========================================================================
   排序算法演示 - 冒泡排序 / 插入排序 / 快速排序
   纯 JavaScript 实现，无任何依赖。

   说明：
   - 所有排序函数均为原地排序（in-place），会修改传入的数组，
     如需保留原数据请先拷贝，如 arr.slice()
   - 默认按升序排列
   ========================================================================== */

/**
 * 冒泡排序
 * 相邻元素两两比较，逆序则交换；每一轮将当前最大值"冒泡"到数组末尾。
 * 时间复杂度：O(n²)；空间复杂度：O(1)
 */
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
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
 * 快速排序（Lomuto 分区，递归实现）
 * 每轮选取区间末尾的元素作为枢轴（pivot），把小于枢轴的元素移到左侧，
 * 然后递归处理左右两侧。
 * 时间复杂度：平均 O(n log n)，最坏 O(n²)；空间复杂度：递归栈 O(log n)
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;

  const pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];

  quickSort(arr, left, i - 1);
  quickSort(arr, i + 1, right);
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
