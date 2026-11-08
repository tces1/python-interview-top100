window.QUESTIONS = [
  {
    id: 1,
    title: "Python 有哪些核心特点？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "Python 是高级、动态类型、强类型、自动内存管理的多范式语言。它强调可读性，拥有丰富的标准库和生态；最常见实现 CPython 会先把源码编译成字节码，再由虚拟机执行。",
    points: [
      "动态类型表示名字不声明固定类型；强类型表示不会随意做隐式类型转换。",
      "支持面向对象、函数式和过程式编程，不等于只能使用某一种范式。",
      "“解释型语言”是简化说法，具体执行方式取决于 CPython、PyPy 等实现。",
    ],
    code: `name = "Ada"       # 名字绑定到 str 对象
name = 42          # 之后可以绑定到 int 对象

# 强类型：不会自动把字符串转成整数
# "3" + 4  -> TypeError`,
    followUp: "动态类型和弱类型有什么区别？CPython 与 PyPy 的执行方式有何不同？",
  },
  {
    id: 2,
    title: "Python 代码从源码到执行经历了什么？",
    category: "基础语法",
    level: "进阶",
    frequency: 4,
    summary:
      "以 CPython 为例，源码先被解析并编译为字节码，随后交给 Python 虚拟机执行。可缓存的模块字节码通常放在 `__pycache__`，但 `.pyc` 不是机器码，也不会让所有运行都跳过编译。",
    points: [
      "`compile()` 可把源码编译为 code object，`dis` 可查看字节码。",
      "导入模块时，时间戳或哈希有效的 `.pyc` 可以减少解析与编译开销。",
      "PyPy 可通过 JIT 把热点路径进一步编译为机器码。",
    ],
    code: `import dis

def add(a, b):
    return a + b

dis.dis(add)`,
    followUp: "`.pyc` 为什么通常不能直接提升程序热点代码的执行速度？",
  },
  {
    id: 3,
    title: "可变对象与不可变对象有什么区别？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "可变对象能在身份 `id` 不变时修改内部状态，如 `list`、`dict`、`set`；不可变对象一旦创建就不能原地改变，如 `int`、`str`、`tuple`。对不可变对象执行“修改”通常会创建新对象并重新绑定名字。",
    points: [
      "不可变不等于一定可哈希：包含列表的元组仍不可哈希。",
      "可变对象作为参数时，函数内的原地修改对调用方可见。",
      "选择不可变结构通常更利于推理、缓存和并发安全。",
    ],
    code: `items = [1, 2]
before = id(items)
items.append(3)
assert id(items) == before

text = "py"
before = id(text)
text += "thon"
assert id(text) != before`,
    followUp: "为什么元组中可以包含可变对象？这会影响元组的哈希吗？",
  },
  {
    id: 4,
    title: "`is` 和 `==` 有什么区别？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "`is` 比较两个引用是否指向同一个对象；`==` 调用相等性协议比较值。判断 `None` 应使用 `is None`，不要依赖小整数或字符串驻留造成的身份相同。",
    points: [
      "`a == b` 通常会尝试 `a.__eq__(b)`，必要时再尝试反向比较。",
      "`is` 不能重载，表达的是对象身份。",
      "CPython 的缓存与驻留属于实现细节，不能作为业务逻辑依据。",
    ],
    code: `a = [1, 2]
b = [1, 2]
c = a

assert a == b
assert a is not b
assert a is c

value = None
assert value is None`,
    followUp: "自定义类不实现 `__eq__` 时，`==` 默认表现是什么？",
  },
  {
    id: 5,
    title: "列表和元组该如何选择？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "列表可变，适合会增删改的同类数据集合；元组不可变，适合表达固定结构或不应变化的记录。只在所有元素都可哈希时，元组才能作为字典键或集合元素。",
    points: [
      "元组通常占用更少空间，但不要把微小性能差异当作首要设计理由。",
      "单元素元组必须写成 `(value,)`，关键是逗号而不是括号。",
      "需要字段名时，`NamedTuple` 或 `dataclass` 往往比裸元组更清晰。",
    ],
    code: `point = (3, 4)       # 固定结构
tasks = ["build"]     # 会继续变化
tasks.append("test")

single = (42,)
coordinates = {(3, 4): "home"}`,
    followUp: "元组真的完全不可变吗？`([1],)` 中的列表能否修改？",
  },
  {
    id: 6,
    title: "浅拷贝和深拷贝有什么区别？",
    category: "基础语法",
    level: "进阶",
    frequency: 5,
    summary:
      "浅拷贝只创建新的外层容器，内部元素仍引用原对象；深拷贝会递归复制可复制的子对象，并用 memo 处理共享引用与循环引用。是否需要深拷贝取决于对象所有权，而不是层数越深越好。",
    points: [
      "`list.copy()`、切片和 `copy.copy()` 都是常见浅拷贝。",
      "`copy.deepcopy()` 可能昂贵，也可能复制了本应共享的资源。",
      "类可实现 `__copy__`、`__deepcopy__` 自定义语义。",
    ],
    code: `import copy

original = [[1], [2]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

original[0].append(9)
assert shallow[0] == [1, 9]
assert deep[0] == [1]`,
    followUp: "深拷贝如何处理循环引用？数据库连接应该被深拷贝吗？",
  },
  {
    id: 7,
    title: "Python 的参数是值传递还是引用传递？",
    category: "基础语法",
    level: "进阶",
    frequency: 5,
    summary:
      "更准确的说法是“按对象共享”或“按赋值传递”：形参是新的局部名字，绑定到实参传入的同一个对象。给形参重新赋值不影响调用方；若对共享的可变对象做原地修改，调用方能看到变化。",
    points: [
      "传递的是对象引用的值，但 Python 没有让函数直接重绑调用方变量的机制。",
      "`x = ...` 是重新绑定；`x.append(...)` 是修改对象。",
      "清晰的 API 通常返回新值，或在命名和文档中明确会原地修改。",
    ],
    code: `def update(number, values):
    number += 1        # 重新绑定局部名字
    values.append(3)   # 修改共享对象

n = 1
items = [1, 2]
update(n, items)

assert n == 1
assert items == [1, 2, 3]`,
    followUp: "为什么说“引用传递”也不够准确？",
  },
  {
    id: 8,
    title: "为什么不能随意使用可变默认参数？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "默认参数在函数定义时只求值一次，不是每次调用时重新创建。因此列表、字典等可变默认值会被不同调用共享，容易泄漏状态；通常用 `None` 作为哨兵并在函数内创建对象。",
    points: [
      "问题不是“默认值可变”本身，而是共享状态常常不是调用者预期。",
      "`None` 可能是合法输入时，应使用私有 `object()` 作为唯一哨兵。",
      "有意利用共享默认值做缓存虽可行，但显式缓存更易读。",
    ],
    code: `def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

assert add_item("a") == ["a"]
assert add_item("b") == ["b"]`,
    followUp: "默认参数可以引用函数定义之后才赋值的变量吗？为什么？",
  },
  {
    id: 9,
    title: "解释 LEGB 作用域规则，以及 `global` 和 `nonlocal`。",
    category: "基础语法",
    level: "进阶",
    frequency: 5,
    summary:
      "名字查找通常遵循 Local、Enclosing、Global、Builtins。赋值会让名字成为当前局部变量，除非用 `global` 指向模块作用域，或用 `nonlocal` 指向最近的闭包作用域。",
    points: [
      "在函数中先读取、后给同名局部变量赋值会触发 `UnboundLocalError`。",
      "`nonlocal` 要求外层函数作用域中已经存在该绑定。",
      "尽量通过参数和返回值传递状态，减少 `global`。",
    ],
    code: `count = 0

def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
assert counter() == 1`,
    followUp: "类定义体是否构成普通闭包的 enclosing scope？",
  },
  {
    id: 10,
    title: "什么是真值测试？哪些值会被视为 False？",
    category: "基础语法",
    level: "基础",
    frequency: 4,
    summary:
      "条件表达式会调用对象的真值协议：优先看 `__bool__()`，否则看 `__len__()`；两者都没有时默认是真。`None`、`False`、数值零和空容器通常为假。",
    points: [
      "业务上要区分 `None`、`0` 和空字符串时，不应只写 `if not value`。",
      "`and` 与 `or` 返回参与运算的对象，而不一定返回布尔值。",
      "自定义 `__bool__` 必须返回真正的 `bool`。",
    ],
    code: `values = [None, False, 0, 0.0, "", [], {}, set()]
assert all(not value for value in values)

name = ""
display = name or "Anonymous"
assert display == "Anonymous"`,
    followUp: "`a or b` 和 `a and b` 的返回值分别是什么？是否短路？",
  },
  {
    id: 11,
    title: "切片的语法和常见陷阱是什么？",
    category: "基础语法",
    level: "基础",
    frequency: 4,
    summary:
      "切片写作 `sequence[start:stop:step]`，左闭右开，三个部分都可省略，负索引从尾部计数。内置序列切片通常创建浅拷贝；`step` 不能为零。",
    points: [
      "`[::-1]` 可反转序列，但会创建新对象。",
      "切片越界通常不会抛 `IndexError`，单个索引越界会。",
      "列表切片赋值可以改变长度，扩展切片赋值则通常要求长度一致。",
    ],
    code: `numbers = [0, 1, 2, 3, 4, 5]

assert numbers[1:5:2] == [1, 3]
assert numbers[-2:] == [4, 5]
assert numbers[::-1] == [5, 4, 3, 2, 1, 0]`,
    followUp: "切片是视图还是副本？NumPy 数组的行为为什么可能不同？",
  },
  {
    id: 12,
    title: "列表推导式与普通循环该如何选择？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "列表推导式适合把一个可迭代对象映射、过滤为新列表，通常更紧凑也可能更快。出现多层分支、副作用或复杂异常处理时，普通循环更清晰；不需要立即物化结果时用生成器表达式。",
    points: [
      "推导式的循环变量在 Python 3 中有独立作用域，不会泄漏到外层。",
      "不要为了“一行代码”牺牲可读性。",
      "集合推导式和字典推导式分别使用 `{expr for ...}` 与 `{k: v for ...}`。",
    ],
    code: `squares = [n * n for n in range(10) if n % 2 == 0]
square_map = {n: n * n for n in range(4)}
unique_lengths = {len(word) for word in ["py", "python", "go"]}`,
    followUp: "生成器表达式与列表推导式在求值时机和内存上有何区别？",
  },
  {
    id: 13,
    title: "序列解包和星号表达式怎么用？",
    category: "基础语法",
    level: "基础",
    frequency: 4,
    summary:
      "解包把可迭代对象的元素绑定给多个目标；一个星号目标可以收集剩余元素。调用函数时，`*iterable` 展开位置参数，`**mapping` 展开关键字参数。",
    points: [
      "普通解包数量不匹配会抛 `ValueError`。",
      "星号收集目标总是得到列表。",
      "交换变量 `a, b = b, a` 先计算右侧，再统一绑定左侧。",
    ],
    code: `first, *middle, last = [1, 2, 3, 4]
assert first == 1 and middle == [2, 3] and last == 4

options = {"sep": " · ", "end": "\\n"}
print(*["Python", "100"], **options)`,
    followUp: "一个赋值表达式中能否出现两个星号收集目标？",
  },
  {
    id: 14,
    title: "`if __name__ == \"__main__\"` 有什么作用？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "模块被直接执行时，`__name__` 是 `\"__main__\"`；被导入时则通常是模块的限定名。这个守卫把命令行入口或演示代码与可导入定义分开，避免导入产生不必要副作用。",
    points: [
      "守卫不会阻止文件顶部的其他语句在导入时执行。",
      "把主流程放进 `main()`，更方便测试和复用。",
      "安装包的命令行入口也可通过 `pyproject.toml` 的 scripts 配置。",
    ],
    code: `def main() -> int:
    print("run application")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())`,
    followUp: "运行 `python -m package.module` 时，`__package__` 和相对导入有何作用？",
  },
  {
    id: 15,
    title: "`try / except / else / finally` 的执行顺序是什么？",
    category: "基础语法",
    level: "基础",
    frequency: 5,
    summary:
      "`try` 无异常时执行 `else`；匹配异常时执行对应 `except`；`finally` 无论正常返回、异常还是 `break` 通常都会执行。应尽量缩小 `try` 范围，避免捕获到非预期错误。",
    points: [
      "异常应从具体到宽泛捕获，通常不要直接吞掉 `Exception`。",
      "`finally` 中的 `return` 会覆盖先前返回值或异常，应避免。",
      "`else` 适合放只有在无异常时才执行、且不想被同一 `except` 捕获的代码。",
    ],
    code: `try:
    value = int("42")
except ValueError:
    value = 0
else:
    value += 1
finally:
    print("cleanup")

assert value == 43`,
    followUp: "`BaseException` 与 `Exception` 有何区别？为什么通常不捕获前者？",
  },
  {
    id: 16,
    title: "字典的底层原理、顺序和复杂度是什么？",
    category: "数据结构",
    level: "进阶",
    frequency: 5,
    summary:
      "CPython 字典是哈希表，平均查找、插入和删除为 O(1)，极端冲突下可能退化。Python 3.7 起语言规范保证保留插入顺序，但它仍是映射，不应把排序语义与插入顺序混淆。",
    points: [
      "键先计算哈希，再用相等性判断确认匹配，因此键必须可哈希且哈希稳定。",
      "字典会为控制装载因子而扩容，O(1) 是摊销与平均复杂度。",
      "给已有键赋值不会改变其位置；删除后重新插入会放到末尾。",
    ],
    code: `profile = {"name": "Ada", "level": "senior"}
profile["name"] = "Grace"
profile["lang"] = "Python"

assert list(profile) == ["name", "level", "lang"]
assert profile.get("missing", "N/A") == "N/A"`,
    followUp: "如果两个不同键的哈希值相同，字典如何区分它们？",
  },
  {
    id: 17,
    title: "什么对象可以作为字典键？什么是可哈希？",
    category: "数据结构",
    level: "进阶",
    frequency: 5,
    summary:
      "可哈希对象在生命周期内哈希值不变，并且相等对象必须具有相同哈希值。常见不可变内置类型可哈希；列表、字典、集合不可哈希；元组是否可哈希取决于全部元素。",
    points: [
      "自定义类默认按身份可哈希；实现值相等后必须同步设计 `__hash__`。",
      "可变字段参与哈希会破坏字典和集合的不变量。",
      "`frozenset` 不可变且可哈希，可用于表达无序复合键。",
    ],
    code: `valid = {
    ("user", 42): "tuple key",
    frozenset({"read", "write"}): "permission key",
}

# {[1, 2]: "no"}  -> TypeError: unhashable type: 'list'`,
    followUp: "只实现 `__eq__` 而不实现 `__hash__` 时，Python 3 会怎样处理实例？",
  },
  {
    id: 18,
    title: "`set` 和 `frozenset` 有什么区别？",
    category: "数据结构",
    level: "基础",
    frequency: 4,
    summary:
      "`set` 是可变的无序去重集合，支持增删；`frozenset` 不可变，因此自身可在元素可哈希时作为字典键或其他集合元素。两者都提供并、交、差和对称差运算。",
    points: [
      "集合不保证业务可依赖的迭代顺序。",
      "成员测试平均为 O(1)，通常比列表的 O(n) 更适合查重。",
      "空集合必须写 `set()`，`{}` 是空字典。",
    ],
    code: `left = {1, 2, 3}
right = {3, 4}

assert left | right == {1, 2, 3, 4}
assert left & right == {3}
assert left - right == {1, 2}

permissions = {frozenset({"read", "write"})}`,
    followUp: "集合推导式会如何处理重复结果？",
  },
  {
    id: 19,
    title: "`append`、`extend`、`+` 和 `+=` 有何不同？",
    category: "数据结构",
    level: "基础",
    frequency: 5,
    summary:
      "`append(x)` 把 `x` 作为一个元素追加；`extend(iterable)` 逐个追加；`a + b` 创建新列表；列表的 `+=` 通常原地扩展并保持对象身份。它们的返回值和别名影响不同。",
    points: [
      "`append` 与 `extend` 都原地修改并返回 `None`。",
      "元组的 `+=` 会创建新元组，因为元组不可变。",
      "对共享列表使用 `+=` 会让所有别名看到变化。",
    ],
    code: `items = [1]
items.append([2, 3])
assert items == [1, [2, 3]]

items = [1]
items.extend([2, 3])
assert items == [1, 2, 3]`,
    followUp: "为什么 `items = items + other` 和 `items += other` 对别名的影响不同？",
  },
  {
    id: 20,
    title: "`sort()` 与 `sorted()` 有什么区别？",
    category: "数据结构",
    level: "基础",
    frequency: 5,
    summary:
      "`list.sort()` 原地排序列表并返回 `None`；`sorted(iterable)` 接受任意可迭代对象并返回新列表。两者都是稳定排序，支持 `key` 和 `reverse`。",
    points: [
      "稳定排序意味着键相等的元素保持原相对顺序。",
      "`key` 对每个元素只计算一次，通常优于比较函数。",
      "多关键字可用返回元组的 key，或利用稳定性分步排序。",
    ],
    code: `users = [
    {"name": "Ada", "score": 95},
    {"name": "Linus", "score": 88},
]

ranked = sorted(users, key=lambda u: (-u["score"], u["name"]))
assert ranked[0]["name"] == "Ada"`,
    followUp: "Python 使用什么排序算法？稳定性在多级排序中有什么价值？",
  },
  {
    id: 21,
    title: "列表、字典、集合常见操作的时间复杂度是多少？",
    category: "数据结构",
    level: "进阶",
    frequency: 5,
    summary:
      "列表按索引访问和尾部摊销追加为 O(1)，中间插入删除与成员测试为 O(n)；字典、集合的查找插入删除平均 O(1)；排序通常 O(n log n)。复杂度应结合数据规模和实际常数。",
    points: [
      "列表头部 `pop(0)` 要移动元素，是 O(n)；队列优先用 `deque.popleft()`。",
      "字典/集合 O(1) 依赖良好的哈希分布，最坏可退化。",
      "列表扩容使单次 append 偶尔为 O(n)，但摊销仍为 O(1)。",
    ],
    code: `from collections import deque

queue = deque(["a", "b"])
queue.append("c")      # O(1)
first = queue.popleft() # O(1)

seen = {"a", "b"}
assert "a" in seen      # average O(1)`,
    followUp: "什么是摊销复杂度？为什么 list.append 通常称为 O(1)？",
  },
  {
    id: 22,
    title: "什么时候该用 `deque` 而不是 `list`？",
    category: "数据结构",
    level: "基础",
    frequency: 4,
    summary:
      "`collections.deque` 为两端追加和弹出优化，都是 O(1)，适合队列、双端队列和固定长度滑动窗口。列表适合随机索引和尾部栈操作，头部操作成本高。",
    points: [
      "`deque(maxlen=n)` 满时会自动丢弃另一端元素。",
      "deque 支持索引，但中部随机访问不是其优势。",
      "线程间通信需要阻塞和任务协调时优先用 `queue.Queue`。",
    ],
    code: `from collections import deque

recent = deque(maxlen=3)
for value in [1, 2, 3, 4]:
    recent.append(value)

assert list(recent) == [2, 3, 4]
recent.appendleft(1)`,
    followUp: "`deque` 与 `queue.Queue` 的使用场景有什么区别？",
  },
  {
    id: 23,
    title: "`heapq` 适合解决什么问题？",
    category: "数据结构",
    level: "进阶",
    frequency: 4,
    summary:
      "`heapq` 在列表上实现最小堆，适合优先队列、Top K 和流式选择。取堆顶 O(1)，插入和弹出 O(log n)，建堆 `heapify` 为 O(n)。",
    points: [
      "Python 传统 `heapq` 是最小堆；最大堆可用取负数等方式模拟，现代版本也在增加 max-heap API。",
      "元素为元组时按字典序比较，优先级相同要避免比较不可比对象。",
      "Top K 较小时，维护大小为 K 的堆比完整排序更节省。",
    ],
    code: `import heapq

scores = [8, 2, 7, 4, 9, 1]
top_three = heapq.nlargest(3, scores)
assert top_three == [9, 8, 7]

queue = [(2, "normal"), (1, "urgent")]
heapq.heapify(queue)
assert heapq.heappop(queue)[1] == "urgent"`,
    followUp: "从 n 个元素中选 Top K 的时间和空间复杂度是多少？",
  },
  {
    id: 24,
    title: "`Counter` 和 `defaultdict` 什么时候更合适？",
    category: "数据结构",
    level: "基础",
    frequency: 4,
    summary:
      "`Counter` 专门统计可哈希对象频次并提供 `most_common` 等操作；`defaultdict(factory)` 在缺键访问时自动创建默认值。它们表达意图比手写缺键分支更清楚。",
    points: [
      "`dict.get` 不会写入字典；`defaultdict[key]` 访问缺键会写入。",
      "`Counter` 的缺失键计数为 0，但通常不会因此插入键。",
      "对外序列化时注意 `defaultdict` 的工厂函数并不是普通数据。",
    ],
    code: `from collections import Counter, defaultdict

counts = Counter("banana")
assert counts.most_common(1) == [("a", 3)]

groups = defaultdict(list)
for name in ["Ada", "Alan", "Grace"]:
    groups[name[0]].append(name)`,
    followUp: "`setdefault` 与 `defaultdict` 的差异和取舍是什么？",
  },
  {
    id: 25,
    title: "`str` 和 `bytes` 有什么区别？",
    category: "数据结构",
    level: "基础",
    frequency: 5,
    summary:
      "`str` 是 Unicode 文本；`bytes` 是 0–255 的字节序列。文本与文件、网络协议的边界要显式 `encode` 和 `decode`，并明确编码，通常使用 UTF-8。",
    points: [
      "字符数量不等于编码后的字节数量。",
      "不要把二进制数据先随意 decode 成文本再处理。",
      "遇到非法字节时应按业务决定严格报错、替换或其他错误策略。",
    ],
    code: `text = "你好, Python"
payload = text.encode("utf-8")
restored = payload.decode("utf-8")

assert isinstance(text, str)
assert isinstance(payload, bytes)
assert restored == text`,
    followUp: "为什么网络与文件边界常被称为“Unicode 三明治”？",
  },
  {
    id: 26,
    title: "为什么字符串不可变？如何高效拼接大量字符串？",
    category: "数据结构",
    level: "基础",
    frequency: 4,
    summary:
      "字符串不可变使其可安全共享、缓存和哈希。循环中反复 `result += piece` 可能产生许多中间对象；已知片段集合时通常先收集，再用 `\"\".join(parts)` 一次拼接。",
    points: [
      "少量拼接优先可读性，性能结论应先测量。",
      "`join` 把分隔符放在元素之间，要求元素都是字符串。",
      "格式化值优先 f-string；构造大文本流可用 `io.StringIO`。",
    ],
    code: `parts = ["Python", "Interview", "Top", "100"]
title = " · ".join(parts)

name = "Ada"
score = 98
message = f"{name} scored {score}"`,
    followUp: "CPython 对简单字符串 `+=` 可能做什么优化？为什么仍不应依赖？",
  },
  {
    id: 27,
    title: "可迭代对象和迭代器有什么区别？",
    category: "数据结构",
    level: "进阶",
    frequency: 5,
    summary:
      "可迭代对象能通过 `iter(obj)` 产生迭代器；迭代器同时实现 `__iter__()` 和 `__next__()`，每次返回下一个值，耗尽时抛 `StopIteration`。容器通常可重复迭代，迭代器通常一次性。",
    points: [
      "`for` 循环会调用 `iter()`，再反复调用 `next()`。",
      "迭代器的 `__iter__` 通常返回自身。",
      "不要假设传入的 iterable 有长度、可索引或能遍历两次。",
    ],
    code: `values = [10, 20, 30]  # iterable
iterator = iter(values)   # iterator

assert next(iterator) == 10
assert next(iterator) == 20
assert iter(iterator) is iterator`,
    followUp: "怎样让自定义容器可重复迭代，而不是返回同一个已耗尽迭代器？",
  },
  {
    id: 28,
    title: "`range` 为什么节省内存？",
    category: "数据结构",
    level: "基础",
    frequency: 4,
    summary:
      "`range` 保存起点、终点和步长，按需计算元素，而不是存储完整整数列表，所以即使范围很大也占用近似固定空间。它是不可变序列，支持长度、索引、切片和成员测试。",
    points: [
      "`range` 不是迭代器，可以多次遍历。",
      "对整数的成员测试可通过算术完成，而非逐个扫描。",
      "`list(range(...))` 才会物化全部元素。",
    ],
    code: `numbers = range(0, 1_000_000_000, 2)

assert len(numbers) == 500_000_000
assert numbers[3] == 6
assert 10 in numbers
assert list(numbers[:3]) == [0, 2, 4]`,
    followUp: "`range(0, 3, 2) == range(0, 4, 2)` 的结果是什么？",
  },
  {
    id: 29,
    title: "`*args` 和 `**kwargs` 分别做什么？",
    category: "函数与迭代",
    level: "基础",
    frequency: 5,
    summary:
      "函数定义中，`*args` 把多余位置参数收集为元组，`**kwargs` 把多余关键字参数收集为字典；调用时，单星号和双星号分别展开可迭代对象与映射。名字可变，但惯例应保留。",
    points: [
      "它们适合包装器和可扩展 API，但过度使用会削弱签名与类型信息。",
      "同一个参数不能被位置和关键字重复赋值。",
      "现代字典保留插入顺序，因此 `kwargs` 也保留调用时关键字顺序。",
    ],
    code: `def announce(prefix, *items, uppercase=False, **meta):
    text = " ".join(map(str, items))
    if uppercase:
        text = text.upper()
    return prefix, text, meta

announce("INFO", "build", "done", uppercase=True, code=0)`,
    followUp: "完整函数参数顺序如何排列？`*` 为什么还能声明仅限关键字参数？",
  },
  {
    id: 30,
    title: "什么是仅限位置参数和仅限关键字参数？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 4,
    summary:
      "签名中的 `/` 之前是仅限位置参数，`*` 之后是仅限关键字参数。它们能表达调用意图、避免参数名成为兼容性承诺，并减少布尔参数调用时的歧义。",
    points: [
      "许多内置函数使用仅限位置参数。",
      "仅限关键字让 `connect(timeout=5)` 比 `connect(5)` 更清楚。",
      "`*args` 之后的普通参数天然是仅限关键字参数。",
    ],
    code: `def resize(image, /, width, height, *, keep_ratio=True):
    ...

resize(photo, 800, 600, keep_ratio=False)
# resize(image=photo, ...) -> TypeError`,
    followUp: "为什么库作者可能把参数设计为 positional-only？",
  },
  {
    id: 31,
    title: "lambda 函数有什么限制？",
    category: "函数与迭代",
    level: "基础",
    frequency: 4,
    summary:
      "`lambda` 创建匿名函数，但函数体只能是一个表达式。它适合短小的排序键或回调；逻辑复杂、需要注释、类型标注或复用时应使用 `def`。",
    points: [
      "lambda 仍会创建普通函数对象，也遵循闭包与晚绑定规则。",
      "不能在 lambda 体中放 `try`、`while`、赋值语句等 statement。",
      "追求可读性比省去一行 `def` 更重要。",
    ],
    code: `records = [("Ada", 95), ("Grace", 99), ("Linus", 91)]
records.sort(key=lambda item: item[1], reverse=True)

assert records[0] == ("Grace", 99)`,
    followUp: "lambda 能否包含条件表达式和海象运算符？",
  },
  {
    id: 32,
    title: "什么是头等函数和闭包？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 5,
    summary:
      "Python 函数是头等对象，可以赋值、传参、返回和存入容器。闭包是函数与其引用的外层自由变量环境的组合，即使外层函数已经返回，相关状态仍可保留。",
    points: [
      "闭包捕获的是变量绑定，不是自动冻结的值。",
      "`func.__closure__` 可观察闭包单元，但业务代码不应依赖其内部细节。",
      "闭包适合轻量状态封装；复杂状态通常用类更清晰。",
    ],
    code: `def make_multiplier(factor):
    def multiply(value):
        return value * factor
    return multiply

double = make_multiplier(2)
assert double(7) == 14`,
    followUp: "闭包和带 `__call__` 的类相比，各自适合什么场景？",
  },
  {
    id: 33,
    title: "闭包的晚绑定陷阱是什么？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 5,
    summary:
      "闭包中的自由变量在函数调用时查找，而不是创建函数时复制当前值。因此循环中创建的多个闭包可能都看到循环结束后的同一个值。可用默认参数或辅助函数在每轮固定值。",
    points: [
      "问题不是 lambda 独有，普通内嵌 `def` 一样会发生。",
      "默认参数在定义时求值，正好可以用于捕获当前值。",
      "`functools.partial` 也能显式绑定参数。",
    ],
    code: `functions = [lambda x, i=i: x + i for i in range(3)]

assert [fn(10) for fn in functions] == [10, 11, 12]

# 若写 lambda x: x + i，三个结果都会使用最终的 i`,
    followUp: "为什么用默认参数能修复，而可变默认参数通常又是陷阱？",
  },
  {
    id: 34,
    title: "装饰器的原理是什么？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 5,
    summary:
      "装饰器是接收被装饰对象并返回替代对象的可调用对象。`@decorator` 基本等价于 `func = decorator(func)`，常用于日志、鉴权、缓存、重试和注册。",
    points: [
      "带参数装饰器通常是“工厂 → 装饰器 → 包装函数”三层。",
      "多个装饰器在定义时从下往上应用，调用时从外往内进入。",
      "包装 async 函数时，包装器也应是 `async def` 并 `await` 原函数。",
    ],
    code: `from functools import wraps

def trace(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    return a + b`,
    followUp: "如何写一个可同时支持 `@retry` 和 `@retry(times=3)` 的装饰器？",
  },
  {
    id: 35,
    title: "为什么装饰器里要使用 `functools.wraps`？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 4,
    summary:
      "`wraps` 会把原函数的名称、文档、模块、注解等元数据复制到包装函数，并设置 `__wrapped__`。这有利于调试、文档生成、签名检查和需要解包装饰器的工具。",
    points: [
      "`wraps(func)` 本质上是 `update_wrapper` 的便捷形式。",
      "没有它，多个被装饰函数可能都显示为 `wrapper`。",
      "`inspect.signature` 会利用 `__wrapped__` 追踪原签名。",
    ],
    code: `from functools import wraps

def measured(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@measured
def greet(name: str) -> str:
    """Return a greeting."""
    return f"Hi, {name}"`,
    followUp: "`wraps` 会自动让运行时参数校验与原签名完全一致吗？",
  },
  {
    id: 36,
    title: "生成器是什么？与返回列表相比有什么优势？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 5,
    summary:
      "包含 `yield` 的函数调用后返回生成器对象；每次迭代执行到下一个 `yield` 暂停并保留状态。它按需产生值，适合大数据、流和无限序列，但通常只能消费一次。",
    points: [
      "调用生成器函数不会立即执行函数体，第一次 `next()` 才开始。",
      "内存优势取决于流水线各阶段是否保持惰性。",
      "`return value` 会结束生成器，并把 value 放入 `StopIteration.value`。",
    ],
    code: `def read_chunks(stream, size=8192):
    while chunk := stream.read(size):
        yield chunk

def countdown(n):
    while n:
        yield n
        n -= 1

assert list(countdown(3)) == [3, 2, 1]`,
    followUp: "生成器对象能否重启？`yield` 与 `return` 的关系是什么？",
  },
  {
    id: 37,
    title: "`yield from` 有什么作用？",
    category: "函数与迭代",
    level: "高级",
    frequency: 3,
    summary:
      "`yield from iterable` 把子迭代器的值直接转发给调用方，并完整代理 `send`、`throw`、`close` 等生成器协议；它还能接收子生成器的返回值。普通场景可理解为更完整的嵌套迭代委托。",
    points: [
      "对普通 iterable，它比手写 `for item in iterable: yield item` 更简洁。",
      "对子生成器，它不仅转发值，还处理双向通信和返回值。",
      "异步生成器中不能使用 `yield from`。",
    ],
    code: `def flatten(groups):
    for group in groups:
        yield from group

assert list(flatten([[1, 2], [3], [4, 5]])) == [1, 2, 3, 4, 5]`,
    followUp: "`yield from` 如何取得子生成器的 `return value`？",
  },
  {
    id: 38,
    title: "`map`、`filter`、`reduce` 与推导式如何选择？",
    category: "函数与迭代",
    level: "基础",
    frequency: 4,
    summary:
      "`map` 和 `filter` 返回惰性迭代器，适合已有函数的简单转换与筛选；推导式常更符合 Python 可读性；`reduce` 把序列归约为一个值，但 `sum`、`min` 等专用函数通常更清楚。",
    points: [
      "`map(func, a, b)` 可并行从多个 iterable 取参数，并在最短者结束。",
      "推导式容易同时表达映射和过滤。",
      "`functools.reduce` 适合确实是结合式累积、且意图清晰的场景。",
    ],
    code: `from functools import reduce
from operator import mul

numbers = [1, 2, 3, 4]
squares = [n * n for n in numbers if n % 2 == 0]
product = reduce(mul, numbers, 1)

assert squares == [4, 16]
assert product == 24`,
    followUp: "为什么 `map` 在 Python 3 返回迭代器而不是列表？",
  },
  {
    id: 39,
    title: "`enumerate` 和 `zip` 的常见用法与陷阱是什么？",
    category: "函数与迭代",
    level: "基础",
    frequency: 4,
    summary:
      "`enumerate(iterable, start)` 同时产生索引和值；`zip` 并行组合多个 iterable，默认在最短输入耗尽时停止。Python 3.10+ 可用 `strict=True` 在长度不一致时抛错。",
    points: [
      "需要索引时优先 `enumerate`，不要手工维护计数器。",
      "`zip(*matrix)` 常用于转置规则二维数据。",
      "输入可能长度不一致且不应静默截断时使用 `strict=True`。",
    ],
    code: `names = ["Ada", "Grace"]
scores = [95, 99]

ranked = [
    (rank, name, score)
    for rank, (name, score) in enumerate(
        zip(names, scores, strict=True), start=1
    )
]`,
    followUp: "如何处理最长输入，而不是在最短输入结束？",
  },
  {
    id: 40,
    title: "`any` 和 `all` 为什么适合条件判断？",
    category: "函数与迭代",
    level: "基础",
    frequency: 4,
    summary:
      "`any(iterable)` 在遇到第一个真值时返回 True；`all(iterable)` 在遇到第一个假值时返回 False，二者都会短路。配合生成器表达式可避免创建中间列表。",
    points: [
      "`any([])` 为 False，`all([])` 为 True，后者是空真。",
      "短路意味着后续昂贵计算或副作用不会发生。",
      "生成器表达式让条件按需计算。",
    ],
    code: `values = [2, 4, 6, 7]

has_odd = any(n % 2 for n in values)
all_positive = all(n > 0 for n in values)

assert has_odd is True
assert all_positive is True`,
    followUp: "为什么 `all([])` 为 True？这与逻辑中的全称量词有何关系？",
  },
  {
    id: 41,
    title: "Python 递归有哪些限制？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 4,
    summary:
      "每次递归都会消耗调用栈，CPython 有递归深度限制来防止 C 栈溢出，且不做尾调用优化。深度可能很大的遍历应改用显式栈或迭代。",
    points: [
      "`sys.setrecursionlimit` 不是通用修复，设得过高可能导致进程崩溃。",
      "递归适合天然递归且深度可控的树结构或分治问题。",
      "记忆化可减少重复子问题，但不能消除深调用链。",
    ],
    code: `def factorial(n):
    if n < 0:
        raise ValueError("n must be non-negative")
    if n < 2:
        return 1
    return n * factorial(n - 1)

assert factorial(5) == 120`,
    followUp: "Python 为什么没有尾递归优化？如何把 DFS 递归改为迭代？",
  },
  {
    id: 42,
    title: "上下文管理器如何保证资源清理？",
    category: "函数与迭代",
    level: "进阶",
    frequency: 5,
    summary:
      "`with` 调用上下文管理器的 `__enter__`，离开代码块时调用 `__exit__`，即使发生异常也会执行清理。也可用 `contextlib.contextmanager` 通过生成器编写。",
    points: [
      "`__exit__` 收到异常类型、值和 traceback，返回真值可抑制异常。",
      "文件、锁、事务和临时资源都适合上下文管理。",
      "异步资源使用 `async with` 与 `__aenter__`/`__aexit__`。",
    ],
    code: `from contextlib import contextmanager

@contextmanager
def managed(resource):
    resource.open()
    try:
        yield resource
    finally:
        resource.close()

# with managed(client) as ready:
#     ready.send()`,
    followUp: "如果 `__enter__` 本身抛异常，`__exit__` 会执行吗？",
  },
  {
    id: 43,
    title: "类属性和实例属性有什么区别？",
    category: "面向对象",
    level: "基础",
    frequency: 5,
    summary:
      "类属性存放在类的命名空间并被实例共享；实例属性通常存放在实例 `__dict__`，会遮蔽同名类属性。把可变对象作为类属性会让所有实例共享它，必须确认这正是意图。",
    points: [
      "读取 `obj.attr` 会先考虑描述符，再查实例与类层级。",
      "`obj.attr = value` 通常创建或更新实例属性，不会修改类属性。",
      "常量、注册表和所有实例共享的配置适合类属性。",
    ],
    code: `class Member:
    group = "python"

    def __init__(self, name):
        self.name = name

ada = Member("Ada")
grace = Member("Grace")
ada.group = "core"

assert grace.group == "python"`,
    followUp: "为什么 `class Team: members = []` 往往是 bug？",
  },
  {
    id: 44,
    title: "实例方法、类方法和静态方法如何选择？",
    category: "面向对象",
    level: "基础",
    frequency: 5,
    summary:
      "实例方法接收 `self` 并操作实例；`@classmethod` 接收 `cls`，适合可继承的替代构造器或类级行为；`@staticmethod` 不自动接收实例或类，只是放在类命名空间中的相关函数。",
    points: [
      "替代构造器用 `cls(...)`，这样子类调用能返回子类实例。",
      "静态方法若与类关系不强，模块级函数可能更自然。",
      "三者通过描述符协议完成绑定。",
    ],
    code: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, value):
        return cls((value - 32) * 5 / 9)

    @staticmethod
    def is_valid(value):
        return value >= -273.15`,
    followUp: "从实例调用 classmethod 时，`cls` 是实例类型还是定义方法的类？",
  },
  {
    id: 45,
    title: "`__new__` 和 `__init__` 有什么区别？",
    category: "面向对象",
    level: "进阶",
    frequency: 5,
    summary:
      "`__new__` 负责创建并返回实例，是静态式的构造阶段；`__init__` 在实例创建后初始化它，并且必须返回 `None`。自定义不可变类型、单例或元类行为时才常重写 `__new__`。",
    points: [
      "如果 `__new__` 返回的不是当前类实例，通常不会调用该类的 `__init__`。",
      "重写 `__new__` 一般要调用 `super().__new__(cls)`。",
      "绝大多数普通类只需实现 `__init__`。",
    ],
    code: `class PositiveInt(int):
    def __new__(cls, value):
        value = int(value)
        if value <= 0:
            raise ValueError("must be positive")
        return super().__new__(cls, value)

assert PositiveInt("3") == 3`,
    followUp: "为什么不可变类型通常要在 `__new__` 而不是 `__init__` 中定制值？",
  },
  {
    id: 46,
    title: "继承和组合该如何选择？",
    category: "面向对象",
    level: "进阶",
    frequency: 5,
    summary:
      "继承表达稳定的“is-a”替换关系；组合表达“has-a”并通过委托复用能力。组合耦合更低、运行时更灵活；继承适合真正的多态层级，而不是单纯为了复用几行实现。",
    points: [
      "遵循里氏替换：子类应能在基类预期位置正常工作。",
      "深继承层级让状态与方法来源难以追踪。",
      "策略、适配器和依赖注入通常用组合实现。",
    ],
    code: `class JsonSerializer:
    def serialize(self, value):
        import json
        return json.dumps(value)

class ReportService:
    def __init__(self, serializer):
        self.serializer = serializer

    def export(self, report):
        return self.serializer.serialize(report)`,
    followUp: "Mixin 属于继承还是组合？怎样避免 Mixin 变成隐藏依赖？",
  },
  {
    id: 47,
    title: "什么是 MRO？`super()` 如何工作？",
    category: "面向对象",
    level: "高级",
    frequency: 5,
    summary:
      "MRO 是多重继承中的方法解析顺序，Python 使用 C3 线性化保证局部优先级和单调性。`super()` 不是简单指向父类，而是沿当前类的 MRO 查找下一个实现。",
    points: [
      "用 `Class.__mro__` 或 `Class.mro()` 可检查顺序。",
      "协作式多继承要求各层使用兼容签名并继续调用 `super()`。",
      "直接调用某个父类方法可能跳过 MRO 中其他协作者。",
    ],
    code: `class A:
    def run(self):
        return ["A"]

class B(A):
    def run(self):
        return ["B", *super().run()]

class C(A):
    def run(self):
        return ["C", *super().run()]

class D(B, C):
    pass

assert D().run() == ["B", "C", "A"]`,
    followUp: "钻石继承中，C3 如何保证共同基类只沿链调用一次？",
  },
  {
    id: 48,
    title: "鸭子类型、ABC 和 Protocol 有什么区别？",
    category: "面向对象",
    level: "高级",
    frequency: 4,
    summary:
      "鸭子类型关注对象能做什么，不要求显式继承；ABC 用名义子类型和抽象方法约束运行时层级；`typing.Protocol` 支持静态结构子类型，只要形状匹配就可通过类型检查。",
    points: [
      "小接口比庞大基类更容易复用和测试。",
      "需要共享实现或运行时 `isinstance` 语义时 ABC 仍有价值。",
      "`@runtime_checkable` Protocol 只能做有限的运行时成员检查。",
    ],
    code: `from typing import Protocol

class Writer(Protocol):
    def write(self, data: str) -> int: ...

def publish(target: Writer, text: str) -> None:
    target.write(text)

# 文件对象和自定义对象无需继承 Writer，只要满足协议`,
    followUp: "Protocol 的结构类型检查与 Go interface 有哪些相似点？",
  },
  {
    id: 49,
    title: "常见魔术方法如何让对象融入 Python 语法？",
    category: "面向对象",
    level: "进阶",
    frequency: 4,
    summary:
      "双下方法定义语言协议：`__repr__` 表示调试文本，`__len__` 支持 `len`，`__iter__` 支持迭代，`__enter__` 支持 `with`，`__call__` 让实例可调用。应实现协议语义，而不是直接手调双下方法。",
    points: [
      "优先调用 `len(obj)` 而不是 `obj.__len__()`，让解释器选择正确协议路径。",
      "`__repr__` 应明确、无歧义，可能时提供可重建表达。",
      "运算符方法遇到不支持类型应返回 `NotImplemented`。",
    ],
    code: `class Batch:
    def __init__(self, items):
        self._items = list(items)

    def __len__(self):
        return len(self._items)

    def __iter__(self):
        return iter(self._items)

    def __repr__(self):
        return f"Batch({self._items!r})"`,
    followUp: "`NotImplemented` 与 `NotImplementedError` 有什么区别？",
  },
  {
    id: 50,
    title: "`property` 有什么价值？",
    category: "面向对象",
    level: "进阶",
    frequency: 4,
    summary:
      "`property` 把方法暴露为属性访问，可在保持 `obj.name` API 的同时加入计算、校验或兼容逻辑。属性应尽量表现得像轻量字段，不宜隐藏昂贵 I/O 或惊讶副作用。",
    points: [
      "先用公开属性，真正需要控制时再平滑升级为 property。",
      "setter 可维持对象不变量，但复杂更新通常更适合显式方法。",
      "`functools.cached_property` 适合昂贵且实例生命周期内稳定的计算。",
    ],
    code: `class Account:
    def __init__(self, balance=0):
        self.balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("negative balance")
        self._balance = value`,
    followUp: "`property` 为什么本质上是数据描述符？",
  },
  {
    id: 51,
    title: "描述符协议是什么？",
    category: "面向对象",
    level: "高级",
    frequency: 4,
    summary:
      "定义 `__get__`、`__set__` 或 `__delete__` 的对象是描述符，放在类属性上时可控制点号属性访问。实现 `__set__` 或 `__delete__` 的数据描述符优先于实例字典；非数据描述符可被实例属性遮蔽。",
    points: [
      "函数、property、classmethod 和许多 ORM 字段都建立在描述符上。",
      "`__set_name__` 可让描述符知道绑定的类和属性名。",
      "描述符必须放在类上，放进单个实例通常不会触发协议。",
    ],
    code: `class Positive:
    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, obj, owner=None):
        return self if obj is None else getattr(obj, self.name)

    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError("must be positive")
        setattr(obj, self.name, value)

class Product:
    price = Positive()`,
    followUp: "数据描述符、实例字典和非数据描述符的查找优先级是什么？",
  },
  {
    id: 52,
    title: "`dataclass` 自动做了什么？",
    category: "面向对象",
    level: "进阶",
    frequency: 5,
    summary:
      "`@dataclass` 根据类型标注字段生成 `__init__`、`__repr__`、`__eq__` 等样板代码，还支持排序、冻结、slots 和默认工厂。它不会自动做运行时类型校验。",
    points: [
      "可变默认值用 `field(default_factory=list)`，避免共享。",
      "`frozen=True` 提供浅层不可变约束，不会冻结嵌套对象。",
      "派生字段或跨字段校验可在 `__post_init__` 中完成。",
    ],
    code: `from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True)
class Candidate:
    name: str
    skills: tuple[str, ...] = field(default_factory=tuple)

ada = Candidate("Ada", ("Python",))
assert ada.name == "Ada"`,
    followUp: "`unsafe_hash=True` 为什么叫 unsafe？",
  },
  {
    id: 53,
    title: "`__slots__` 的作用和限制是什么？",
    category: "面向对象",
    level: "高级",
    frequency: 4,
    summary:
      "`__slots__` 声明预期实例属性并通常避免每个实例拥有 `__dict__`，大量小实例时可降低内存，也会阻止随意添加属性。它不是安全机制，继承设计也需要额外注意。",
    points: [
      "需要弱引用时可能要包含 `__weakref__`，现代 dataclass 可配置。",
      "若基类已有普通实例字典，子类 slots 的节省可能有限。",
      "不要仅为微小速度猜测使用，先测量实例规模与内存。",
    ],
    code: `class Point:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

point = Point(1, 2)
# point.label = "A" -> AttributeError`,
    followUp: "slots 类如何参与多重继承和 pickle？",
  },
  {
    id: 54,
    title: "元类是什么？什么时候才应该使用？",
    category: "面向对象",
    level: "高级",
    frequency: 4,
    summary:
      "元类是创建类对象的类，默认是 `type`。它能拦截类创建、校验定义、自动注册或构建 ORM 声明，但复杂度高；很多需求用类装饰器或 `__init_subclass__` 更简单。",
    points: [
      "实例由类创建，类对象由元类创建。",
      "元类冲突会出现在多继承基类使用不兼容元类时。",
      "只有当行为必须发生在类创建阶段并跨层级统一时再考虑。",
    ],
    code: `class Registered(type):
    registry = {}

    def __new__(mcls, name, bases, namespace):
        cls = super().__new__(mcls, name, bases, namespace)
        if name != "Plugin":
            mcls.registry[name] = cls
        return cls

class Plugin(metaclass=Registered):
    pass`,
    followUp: "`type(name, bases, namespace)` 如何动态创建类？",
  },
  {
    id: 55,
    title: "`__getattr__` 与 `__getattribute__` 有何区别？",
    category: "面向对象",
    level: "高级",
    frequency: 4,
    summary:
      "`__getattribute__` 拦截几乎所有实例属性读取；正常查找失败后才调用 `__getattr__`。前者很容易造成无限递归，内部访问通常要委托 `object.__getattribute__`。",
    points: [
      "`__getattr__` 更适合懒加载、代理或兼容旧属性名。",
      "无法提供属性时必须抛 `AttributeError`，工具才能正确工作。",
      "模块级也可以定义 `__getattr__` 处理缺失属性。",
    ],
    code: `class Settings:
    def __init__(self, data):
        self._data = data

    def __getattr__(self, name):
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(name) from None

settings = Settings({"debug": True})
assert settings.debug is True`,
    followUp: "`hasattr` 为什么依赖 `AttributeError`？属性 getter 抛错会有什么影响？",
  },
  {
    id: 56,
    title: "自定义相等性时为什么还要考虑哈希？",
    category: "面向对象",
    level: "进阶",
    frequency: 5,
    summary:
      "哈希契约要求 `a == b` 时 `hash(a) == hash(b)`。值对象实现 `__eq__` 后，若字段可变通常应保持不可哈希；若对象不可变，可基于同一组字段实现 `__hash__`。",
    points: [
      "哈希相同不代表对象相等，碰撞是允许的。",
      "对象进入 set 或作为 dict 键后，参与哈希的状态不能改变。",
      "dataclass 会根据 `eq`、`frozen` 等配置谨慎生成或禁用哈希。",
    ],
    code: `from dataclasses import dataclass

@dataclass(frozen=True)
class UserId:
    value: int

left = UserId(7)
right = UserId(7)
assert left == right
assert hash(left) == hash(right)
assert len({left, right}) == 1`,
    followUp: "为什么可变值对象通常不应该实现基于字段的 `__hash__`？",
  },
  {
    id: 57,
    title: "`__init_subclass__` 能解决什么问题？",
    category: "面向对象",
    level: "高级",
    frequency: 3,
    summary:
      "`__init_subclass__` 在类被继承时自动调用，可校验子类、注册插件或处理类声明参数。它比元类轻量，并能参与协作式继承。",
    points: [
      "定义为钩子时无需显式添加 `@classmethod`。",
      "应接受并向 `super()` 转发不认识的关键字参数。",
      "它只能影响自己的子类创建，无法替代所有元类能力。",
    ],
    code: `class Handler:
    registry = {}

    def __init_subclass__(cls, *, event, **kwargs):
        super().__init_subclass__(**kwargs)
        Handler.registry[event] = cls

class LoginHandler(Handler, event="login"):
    pass

assert Handler.registry["login"] is LoginHandler`,
    followUp: "类装饰器、`__init_subclass__` 和元类的执行时机如何比较？",
  },
  {
    id: 58,
    title: "模块和包有什么区别？绝对导入与相对导入如何选择？",
    category: "工程实践",
    level: "基础",
    frequency: 4,
    summary:
      "模块通常是一个可导入的 Python 文件，包是组织子模块的命名空间。绝对导入从顶层包开始，通常更清晰；显式相对导入用点表示当前包层级，适合包内部重构。",
    points: [
      "`__init__.py` 可定义传统包；命名空间包可以没有它。",
      "避免依赖当前工作目录的偶然 `sys.path`。",
      "应用代码通常导入顶层包，测试也应验证安装后的导入方式。",
    ],
    code: `# myapp/services/report.py
from myapp.models import Report      # 绝对导入
from .renderer import render         # 同包相对导入
from ..config import settings        # 上一级包`,
    followUp: "命名空间包解决了什么问题？为什么直接运行包内文件常破坏相对导入？",
  },
  {
    id: 59,
    title: "Python 导入机制与循环导入是怎么回事？",
    category: "工程实践",
    level: "进阶",
    frequency: 5,
    summary:
      "导入先检查 `sys.modules` 缓存，再通过 finder/loader 查找并执行模块。模块在执行完成前就会放入缓存，因此循环导入可能读到“部分初始化”的模块，导致缺失属性。",
    points: [
      "根治循环依赖应重新划分职责、抽出共享层，而不是到处局部导入。",
      "函数内延迟导入可打破部分时序，但可能只是临时方案。",
      "导入模块多次通常不会重复执行顶层代码，除非显式 reload。",
    ],
    code: `# 推荐：把双方共享的协议抽到独立模块
# contracts.py
from typing import Protocol

class Repository(Protocol):
    def save(self, value) -> None: ...

# service.py 和 repository.py 都只依赖 contracts.py`,
    followUp: "`from module import name` 为什么更容易在循环导入中失败？",
  },
  {
    id: 60,
    title: "为什么每个项目都应使用虚拟环境？",
    category: "工程实践",
    level: "基础",
    frequency: 4,
    summary:
      "虚拟环境为项目隔离解释器入口和第三方包安装位置，避免不同项目依赖版本冲突。它不替代锁文件或容器，而是本地和 CI 中可复现环境的一层。",
    points: [
      "`python -m venv .venv` 使用目标解释器创建环境。",
      "不要把 `.venv` 提交到 Git，应提交依赖声明和锁文件。",
      "激活只是修改 shell 路径；也可以直接调用环境中的 Python。",
    ],
    code: `# 创建
python -m venv .venv

# Windows PowerShell
.venv\\Scripts\\Activate.ps1

# 安装
python -m pip install -r requirements.txt`,
    followUp: "虚拟环境、版本管理工具和容器分别解决哪一层问题？",
  },
  {
    id: 61,
    title: "`pyproject.toml`、依赖范围和锁文件各自负责什么？",
    category: "工程实践",
    level: "进阶",
    frequency: 4,
    summary:
      "`pyproject.toml` 是项目元数据、构建系统和工具配置的标准入口；库通常声明兼容依赖范围，应用则通过锁文件固定完整依赖图，获得可复现部署。",
    points: [
      "只固定顶层 requirements 不一定固定传递依赖。",
      "库若把所有依赖锁死，会妨碍使用者解析兼容版本。",
      "CI 应从干净环境安装，并验证锁文件与声明一致。",
    ],
    code: `[project]
name = "interview-guide"
requires-python = ">=3.11"
dependencies = [
  "httpx>=0.27,<1",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"`,
    followUp: "应用和可复用库在版本固定策略上为什么不同？",
  },
  {
    id: 62,
    title: "wheel 和 source distribution 有什么区别？",
    category: "工程实践",
    level: "进阶",
    frequency: 3,
    summary:
      "wheel 是已构建的分发格式，安装时通常无需执行构建；sdist 是源码归档，安装端需要按构建配置生成 wheel。含原生扩展的 wheel 往往与平台、架构和 Python ABI 相关。",
    points: [
      "纯 Python wheel 常标记为 `py3-none-any`，跨平台使用。",
      "发布包通常同时提供 sdist 和适用平台的 wheel。",
      "wheel 不是独立可执行程序，也不会自动打包 Python 解释器。",
    ],
    code: `# 使用标准构建前端生成 dist/*.whl 与 dist/*.tar.gz
python -m build

# 检查分发元数据
python -m twine check dist/*`,
    followUp: "为什么某些包在本机安装时会要求 C 编译器？",
  },
  {
    id: 63,
    title: "如何设计和抛出自定义异常？",
    category: "工程实践",
    level: "进阶",
    frequency: 4,
    summary:
      "自定义异常通常继承 `Exception`，按调用者能采取的恢复策略设计层级，并保留结构化上下文。转换底层异常时用 `raise ... from ...` 保留因果链。",
    points: [
      "异常用于异常路径，不应代替普通分支控制。",
      "库应暴露稳定的领域异常，避免调用者依赖底层驱动细节。",
      "捕获后无法处理时，应记录必要上下文并重新抛出，而非静默吞掉。",
    ],
    code: `class PaymentError(Exception):
    pass

class CardDeclined(PaymentError):
    def __init__(self, transaction_id):
        self.transaction_id = transaction_id
        super().__init__(f"declined: {transaction_id}")

try:
    int("not-a-number")
except ValueError as exc:
    raise PaymentError("invalid provider response") from exc`,
    followUp: "`raise`、`raise exc` 和 `raise NewError() from exc` 对 traceback 有何影响？",
  },
  {
    id: 64,
    title: "生产代码为什么要用 `logging` 而不是 `print`？",
    category: "工程实践",
    level: "基础",
    frequency: 4,
    summary:
      "`logging` 提供级别、结构化上下文、过滤、格式化和多种输出处理器，可由应用集中配置；`print` 只写文本，难以控制和关联请求。库代码应获取命名 logger，不要擅自配置全局输出。",
    points: [
      "使用参数化日志 `logger.info(\"user=%s\", id)`，避免未启用级别时提前格式化。",
      "异常处理处用 `logger.exception` 自动附带 traceback。",
      "不要记录密码、令牌和不必要的个人数据。",
    ],
    code: `import logging

logger = logging.getLogger(__name__)

def process(job_id: str) -> None:
    logger.info("job_started job_id=%s", job_id)
    try:
        ...
    except Exception:
        logger.exception("job_failed job_id=%s", job_id)
        raise`,
    followUp: "日志、指标和分布式追踪分别回答什么问题？",
  },
  {
    id: 65,
    title: "如何安全、高效地处理文件和大文件？",
    category: "工程实践",
    level: "基础",
    frequency: 5,
    summary:
      "用 `with open(...)` 确保关闭文件，文本模式明确编码；大文件按行或按块流式处理，避免一次 `read()` 全部载入。写重要文件可采用临时文件加原子替换。",
    points: [
      "文本换行、编码错误策略和二进制模式要根据协议明确。",
      "文件对象本身是迭代器，`for line in file` 是惰性的。",
      "用户提供的路径需要校验，避免目录穿越和覆盖敏感文件。",
    ],
    code: `from pathlib import Path

path = Path("events.log")
with path.open("r", encoding="utf-8") as stream:
    for line in stream:
        if "ERROR" in line:
            handle(line.rstrip("\\n"))`,
    followUp: "怎样原子地更新配置文件？为什么先截断原文件再写有风险？",
  },
  {
    id: 66,
    title: "JSON、pickle 和自定义序列化如何选择？",
    category: "工程实践",
    level: "进阶",
    frequency: 5,
    summary:
      "JSON 跨语言、可读但类型有限，适合 API 和持久化契约；pickle 能还原复杂 Python 对象但与 Python 强绑定，并且反序列化可执行任意代码，绝不能加载不可信数据。",
    points: [
      "协议格式应显式版本化，并为新增字段提供兼容策略。",
      "日期、Decimal 等类型需要自定义编码，不能假设 JSON 原生支持。",
      "性能或模式要求更高时可考虑 MessagePack、Protobuf 等。",
    ],
    code: `import json
from dataclasses import asdict

payload = json.dumps(
    {"name": "Ada", "skills": ["Python"]},
    ensure_ascii=False,
)
data = json.loads(payload)

# 永远不要：pickle.loads(untrusted_bytes)`,
    followUp: "为什么给 pickle 数据加签名只能解决完整性，不能让任意来源变可信？",
  },
  {
    id: 67,
    title: "应用配置和密钥应该如何管理？",
    category: "工程实践",
    level: "进阶",
    frequency: 4,
    summary:
      "配置应与代码分离，普通配置可来自文件或环境变量，密钥应来自受控的 secret manager 或部署平台，并遵循最小权限、轮换和审计。不要把真实密钥提交到仓库或写进日志。",
    points: [
      "环境变量是传递机制，不自动提供加密或访问控制。",
      "启动时集中解析和校验配置，尽早失败。",
      "泄漏后要撤销和轮换，单纯从 Git 历史删除不够。",
    ],
    code: `import os

def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"missing environment variable: {name}")
    return value

database_url = require_env("DATABASE_URL")`,
    followUp: "十二要素应用的配置原则是什么？本地 `.env` 文件有哪些边界？",
  },
  {
    id: 68,
    title: "`__all__` 和公开 API 有什么关系？",
    category: "工程实践",
    level: "进阶",
    frequency: 3,
    summary:
      "`__all__` 主要控制 `from module import *` 导出的名字，也可作为公开 API 的文档信号，但不会阻止直接导入其他名称。真正的兼容承诺需要文档、命名和版本策略共同维护。",
    points: [
      "下划线前缀表示非公开约定，不是访问控制。",
      "包的 `__init__.py` 可重导出稳定入口，隐藏内部目录变化。",
      "避免在应用代码中使用星号导入，来源不清且易冲突。",
    ],
    code: `# package/__init__.py
from .client import Client
from .errors import PackageError

__all__ = ["Client", "PackageError"]`,
    followUp: "如何在重构包内部结构时保持旧导入路径兼容？",
  },
  {
    id: 69,
    title: "什么是 monkey patching？为什么要谨慎？",
    category: "工程实践",
    level: "高级",
    frequency: 3,
    summary:
      "Monkey patching 是运行时替换模块、类或对象属性来改变行为。它在测试隔离和兼容补丁中偶尔有用，但会引入全局隐式状态、导入时序依赖和并发风险。",
    points: [
      "测试中优先使用框架提供的 patch，并确保结束后自动恢复。",
      "应在“使用该名字的模块”处 patch，而不是原始定义处。",
      "生产设计优先依赖注入、适配器或明确扩展点。",
    ],
    code: `# service.py: from clock import now
# 测试应 patch service.now，而不是 clock.now
from unittest.mock import patch

with patch("service.now", return_value=123):
    assert service.timestamp() == 123`,
    followUp: "为什么 patch 的目标是 lookup location，而不一定是 definition location？",
  },
  {
    id: 70,
    title: "依赖注入在 Python 中如何落地？",
    category: "工程实践",
    level: "进阶",
    frequency: 4,
    summary:
      "依赖注入是把数据库、时钟、HTTP 客户端等外部协作者从外部传入，而不是函数内部硬编码创建。Python 可用构造函数、函数参数或工厂完成，不一定需要重量级容器。",
    points: [
      "显式依赖让测试可传 fake，并使资源生命周期更清楚。",
      "传入窄接口或 Protocol，避免服务知道具体实现细节。",
      "在应用入口组合对象，业务层保持与框架解耦。",
    ],
    code: `from typing import Protocol

class Clock(Protocol):
    def now(self) -> float: ...

class TokenService:
    def __init__(self, clock: Clock):
        self.clock = clock

    def is_expired(self, expires_at: float) -> bool:
        return self.clock.now() >= expires_at`,
    followUp: "依赖注入与 service locator 有什么区别？",
  },
  {
    id: 71,
    title: "GIL 是什么？它对 Python 并发意味着什么？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "传统 CPython 的 GIL 使同一进程中通常只有一个线程执行 Python 字节码，因此纯 Python CPU 密集任务难以靠线程多核并行；I/O 等待时会释放 GIL。Python 3.13+ 另有可选 free-threaded 构建，可禁用 GIL，但生态兼容和性能仍需验证。",
    points: [
      "GIL 不等于代码线程安全，多步操作仍可能竞态。",
      "CPU 密集可用多进程、原生扩展或经测量的 free-threaded 构建。",
      "I/O 密集线程仍有价值，因为等待时其他线程可运行。",
    ],
    code: `# 判断当前解释器是否为 free-threaded 构建（3.13+）
import sysconfig

free_threaded = bool(sysconfig.get_config_var("Py_GIL_DISABLED"))
print(free_threaded)`,
    followUp: "为什么有 GIL 仍然需要 Lock？C 扩展如何影响 GIL？",
  },
  {
    id: 72,
    title: "线程、多进程和 asyncio 应该如何选择？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "先看瓶颈：阻塞 I/O 且依赖同步库可用线程；纯 Python CPU 密集通常用进程；大量可异步 I/O 可用 asyncio。三者都要限制并发，避免压垮下游或耗尽资源。",
    points: [
      "线程共享内存、切换成本较低，但需要同步。",
      "进程可利用多核，但启动、序列化和进程间通信成本更高。",
      "asyncio 是协作式并发，不是自动并行，阻塞调用会卡住事件循环。",
    ],
    code: `# I/O 阻塞库
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(fetch_url, urls))

# CPU 密集可改用 ProcessPoolExecutor`,
    followUp: "一个既调用 API 又做重计算的服务，如何组合这些模型？",
  },
  {
    id: 73,
    title: "什么是竞态条件？Lock 应该保护什么？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "竞态条件是结果依赖不可控的执行交错。Lock 应保护需要作为一个整体保持不变量的临界区，而不只是某个单独变量；临界区应尽量短，并用上下文管理器确保释放。",
    points: [
      "`x += 1` 是读、计算、写的组合，不应假设在所有实现与情境下原子。",
      "持锁时避免网络 I/O、回调和未知耗时操作。",
      "不可变数据、消息传递和线程安全队列可减少共享状态。",
    ],
    code: `from threading import Lock

class Counter:
    def __init__(self):
        self.value = 0
        self._lock = Lock()

    def increment(self):
        with self._lock:
            self.value += 1`,
    followUp: "`Lock` 和 `RLock` 有什么区别？死锁常见成因是什么？",
  },
  {
    id: 74,
    title: "`ThreadPoolExecutor` 与 `ProcessPoolExecutor` 怎么用？",
    category: "并发与性能",
    level: "进阶",
    frequency: 4,
    summary:
      "二者提供统一的 Future 接口：提交任务、等待结果、处理异常。线程池适合阻塞 I/O，进程池适合可序列化的 CPU 任务；池大小要由瓶颈、内存和外部限流决定。",
    points: [
      "`executor.map` 按输入顺序产出结果；`as_completed` 按完成顺序处理。",
      "Future 的异常会在 `result()` 时重新抛出。",
      "不要为每个请求反复创建大进程池，应明确生命周期。",
    ],
    code: `from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=8) as pool:
    futures = {pool.submit(fetch, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            consume(url, future.result())
        except Exception as exc:
            report(url, exc)`,
    followUp: "`executor.map` 遇到单个任务异常时如何表现？",
  },
  {
    id: 75,
    title: "使用 multiprocessing 时有哪些常见陷阱？",
    category: "并发与性能",
    level: "进阶",
    frequency: 4,
    summary:
      "多进程任务和参数通常需要可 pickle，进程间不直接共享普通内存；Windows 和常见 spawn 模式会重新导入主模块，因此创建进程的入口必须放在 `if __name__ == \"__main__\"` 守卫中。",
    points: [
      "局部函数、lambda 和打开的资源常难以安全传给子进程。",
      "大对象序列化与复制可能抵消并行收益。",
      "共享状态优先用队列传消息；必要时再使用受控共享内存。",
    ],
    code: `from concurrent.futures import ProcessPoolExecutor

def square(value):
    return value * value

def main():
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(square, range(5))))

if __name__ == "__main__":
    main()`,
    followUp: "fork、spawn 和 forkserver 的启动语义有什么差异？",
  },
  {
    id: 76,
    title: "async/await 和事件循环如何工作？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "`async def` 调用后产生协程对象；事件循环调度协程，协程在 `await` 可等待对象时主动让出控制权。它适合高并发 I/O，但同一事件循环线程一次仍只运行一段 Python 代码。",
    points: [
      "只创建协程对象不会开始执行，必须 await 或调度为 Task。",
      "`await` 普通 CPU 计算不会神奇地让它并行。",
      "顶层程序通常只调用一次 `asyncio.run(main())`。",
    ],
    code: `import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name

async def main():
    results = await asyncio.gather(
        fetch("a", 0.1),
        fetch("b", 0.1),
    )
    print(results)

asyncio.run(main())`,
    followUp: "`[await fetch(x) for x in items]` 是并发还是串行？",
  },
  {
    id: 77,
    title: "协程、Task 和 Future 有什么区别？",
    category: "并发与性能",
    level: "高级",
    frequency: 4,
    summary:
      "协程对象描述一段可暂停的计算；Task 把协程调度到事件循环并追踪其状态；Future 是更底层的“未来结果”占位接口，Task 是 Future 的一种。应用代码通常操作协程和 Task。",
    points: [
      "`asyncio.create_task(coro)` 会安排其尽快运行，并返回 Task。",
      "必须保留后台 Task 引用并处理结果或异常。",
      "Task 取消是请求，在协程下一个可取消等待点注入 `CancelledError`。",
    ],
    code: `import asyncio

async def worker():
    await asyncio.sleep(0.1)
    return 42

async def main():
    task = asyncio.create_task(worker())
    assert isinstance(task, asyncio.Task)
    result = await task
    assert result == 42`,
    followUp: "创建后从不 await 的 Task，其异常会怎样暴露？",
  },
  {
    id: 78,
    title: "`asyncio.gather` 与 `TaskGroup` 有什么区别？",
    category: "并发与性能",
    level: "高级",
    frequency: 4,
    summary:
      "`gather` 并发等待多个 awaitable，并按输入顺序返回结果；一个任务报错时默认向调用者传播，但其他任务不一定自动取消。Python 3.11+ 的 `TaskGroup` 提供结构化并发：子任务失败会取消兄弟任务，并以 `ExceptionGroup` 汇总。",
    points: [
      "`gather(return_exceptions=True)` 会把异常当作结果，必须显式检查。",
      "TaskGroup 保证退出上下文前所有子任务都已结束。",
      "关联任务应优先结构化生命周期，减少泄漏后台任务。",
    ],
    code: `import asyncio

async def main():
    async with asyncio.TaskGroup() as group:
        first = group.create_task(fetch("a"))
        second = group.create_task(fetch("b"))

    return first.result(), second.result()`,
    followUp: "如何用 `except*` 分别处理 ExceptionGroup 中不同异常类型？",
  },
  {
    id: 79,
    title: "异步代码中调用阻塞函数会怎样？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "阻塞函数会占住事件循环线程，使所有其他协程停顿。短小同步计算可直接做；阻塞 I/O 应换异步库或用 `asyncio.to_thread`；CPU 密集任务通常交给进程池或外部任务系统。",
    points: [
      "`async def` 内部的代码不会自动变成非阻塞。",
      "把大量 CPU 工作放到线程仍受传统 GIL 影响。",
      "跨线程取消通常只能停止等待，不能强行终止正在运行的同步函数。",
    ],
    code: `import asyncio
import requests

async def fetch_legacy(url):
    # 避免 requests.get 阻塞事件循环
    response = await asyncio.to_thread(requests.get, url, timeout=5)
    return response.text`,
    followUp: "什么时候应使用 `run_in_executor` 而不是 `to_thread`？",
  },
  {
    id: 80,
    title: "如何正确处理异步取消和超时？",
    category: "并发与性能",
    level: "高级",
    frequency: 4,
    summary:
      "取消是协作式的：`task.cancel()` 请求在下一个 await 点抛出 `CancelledError`。协程应在 `finally` 中清理，并在确有必要捕获后重新抛出；Python 3.11+ 可用 `asyncio.timeout` 给代码块设期限。",
    points: [
      "不要用宽泛异常处理吞掉取消信号。",
      "超时后仍要等待清理完成，资源生命周期比“立即返回”更重要。",
      "对外部服务要同时设置连接、读取和整体业务超时。",
    ],
    code: `import asyncio

async def run():
    try:
        async with asyncio.timeout(2):
            await slow_operation()
    finally:
        await close_resources()`,
    followUp: "`asyncio.shield` 解决什么问题？为什么仍需谨慎？",
  },
  {
    id: 81,
    title: "如何实现生产者—消费者模型？",
    category: "并发与性能",
    level: "进阶",
    frequency: 4,
    summary:
      "用线程安全或异步队列解耦生产与消费，并通过有界容量施加背压。生产者放任务，消费者取任务、处理并确认；还要设计停止信号、异常传播和重试策略。",
    points: [
      "`queue.Queue` 用于线程，`asyncio.Queue` 用于同一事件循环协程。",
      "无界队列可能在下游变慢时无限吃内存。",
      "任务确认必须放在 `finally`，避免 `join()` 永远等待。",
    ],
    code: `import asyncio

async def consumer(queue):
    while True:
        item = await queue.get()
        try:
            if item is None:
                return
            await process(item)
        finally:
            queue.task_done()

queue = asyncio.Queue(maxsize=100)`,
    followUp: "队列满时应该阻塞、丢弃、合并还是扩容？如何做业务取舍？",
  },
  {
    id: 82,
    title: "CPython 如何管理内存？循环引用怎么办？",
    category: "并发与性能",
    level: "高级",
    frequency: 5,
    summary:
      "CPython 主要使用引用计数，对象引用归零时通常立即释放；分代循环垃圾回收器补充处理相互引用的容器。内存归还给 Python 分配器不等于立即归还操作系统。",
    points: [
      "`del name` 删除绑定，不保证对象立刻消失，其他引用可能仍在。",
      "弱引用可观察对象而不延长其生命周期，适合缓存和映射。",
      "带资源的对象不要依赖析构时机，使用上下文管理器显式关闭。",
    ],
    code: `import weakref

class CacheItem:
    pass

item = CacheItem()
reference = weakref.ref(item)
assert reference() is item

del item
assert reference() is None`,
    followUp: "为什么进程 RSS 可能在对象释放后仍不下降？",
  },
  {
    id: 83,
    title: "如何定位 Python 的性能和内存问题？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "先建立可复现负载和基线，再用 profiler 找热点：`cProfile` 或采样分析器看时间，`tracemalloc` 比较内存分配，`timeit` 测微小片段。优化算法和 I/O 往往比语法微调更有效。",
    points: [
      "不要只在开发机用单次 wall-clock 猜测。",
      "先检查 O(n²) 算法、重复 I/O、无界缓存和不必要物化。",
      "每次只改一个主要变量，并回归正确性与尾延迟。",
    ],
    code: `import cProfile
import pstats

with cProfile.Profile() as profiler:
    run_workload()

stats = pstats.Stats(profiler)
stats.sort_stats("cumtime").print_stats(15)`,
    followUp: "确定性 profiler 和采样 profiler 的开销与适用场景有何差异？",
  },
  {
    id: 84,
    title: "`lru_cache` 如何工作？有哪些陷阱？",
    category: "并发与性能",
    level: "进阶",
    frequency: 5,
    summary:
      "`functools.lru_cache` 按可哈希参数缓存函数结果，并以最近最少使用策略限制大小；适合纯函数或在缓存周期内结果稳定的昂贵计算。不适合依赖隐式外部状态的函数。",
    points: [
      "方法缓存键包含 `self`，可能让实例被缓存强引用长期保留。",
      "不同关键字顺序或类型设置可能形成不同缓存键。",
      "要考虑失效、内存上限、并发重复计算与观测命中率。",
    ],
    code: `from functools import lru_cache

@lru_cache(maxsize=256)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

assert fibonacci(30) == 832040
print(fibonacci.cache_info())`,
    followUp: "为什么不能直接用 lru_cache 缓存接收列表参数的函数？",
  },
  {
    id: 85,
    title: "Python 类型标注会在运行时强制检查吗？",
    category: "测试与类型",
    level: "基础",
    frequency: 5,
    summary:
      "标准类型标注通常只是元数据，解释器不会自动阻止传入错误类型。mypy、Pyright 等静态检查器在运行前分析；Pydantic 等库则可基于标注执行运行时验证。",
    points: [
      "类型标注改善 IDE、重构、文档和接口沟通，但不能代替测试。",
      "优先标注公共边界与复杂数据结构，再逐步提高严格度。",
      "外部输入必须做运行时验证，静态类型无法信任网络数据。",
    ],
    code: `def total(prices: list[float]) -> float:
    return sum(prices)

# Python 本身不会因注解在调用入口自动拦截：
# total("123")
# 静态检查器会报告参数类型错误`,
    followUp: "`from __future__ import annotations` 会改变什么？",
  },
  {
    id: 86,
    title: "`Any`、`object`、`Optional` 和 Union 怎么理解？",
    category: "测试与类型",
    level: "进阶",
    frequency: 4,
    summary:
      "`Any` 让静态检查器基本放弃该值上的类型约束；`object` 表示任意对象，但使用前必须缩窄。`T | None` 表示可能为 None，`A | B` 表示联合类型，不代表自动转换。",
    points: [
      "`Optional[T]` 等价于 `T | None`，不代表参数有默认值。",
      "用 `isinstance`、`is None`、TypeGuard 或模式匹配做类型缩窄。",
      "在系统边界滥用 Any 会让不安全类型传播。",
    ],
    code: `def normalize(value: str | bytes | None) -> str:
    if value is None:
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8")
    return value`,
    followUp: "`object` 为什么比 `Any` 更安全？",
  },
  {
    id: 87,
    title: "泛型与 Protocol 如何表达可复用接口？",
    category: "测试与类型",
    level: "高级",
    frequency: 4,
    summary:
      "泛型用类型参数表达输入输出之间的关系，Protocol 用结构类型表达所需能力。二者结合可在不强制继承的前提下保留精确返回类型和替换约束。",
    points: [
      "类型参数不是“任意类型”的同义词，它表达多个位置必须保持的关系。",
      "协变、逆变取决于类型只被产出还是被消费。",
      "API 应暴露最小能力，如 `Iterable[T]`，而不是无必要要求 `list[T]`。",
    ],
    code: `from typing import Protocol, TypeVar

T = TypeVar("T")

class Repository(Protocol[T]):
    def get(self, item_id: int) -> T: ...
    def save(self, item: T) -> None: ...

def load(repo: Repository[T], item_id: int) -> T:
    return repo.get(item_id)`,
    followUp: "为什么可变容器通常是不变（invariant）的？",
  },
  {
    id: 88,
    title: "`dataclass`、`NamedTuple` 和 Pydantic 模型如何选择？",
    category: "测试与类型",
    level: "进阶",
    frequency: 4,
    summary:
      "`dataclass` 适合内部领域数据和行为；`NamedTuple` 是不可变、可按元组解包的轻量记录；Pydantic 模型适合不可信外部数据的运行时解析与校验。选择依据是边界和语义，不只是代码行数。",
    points: [
      "dataclass 标注不自动验证类型。",
      "NamedTuple 的元组兼容有时会让位置语义泄漏。",
      "外部模型与内部领域模型分离，可避免校验框架渗透核心业务。",
    ],
    code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: int
    currency: str

    def add(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("currency mismatch")
        return Money(self.amount + other.amount, self.currency)`,
    followUp: "什么时候应把 API schema 与领域对象分成两个模型？",
  },
  {
    id: 89,
    title: "单元测试、集成测试和端到端测试有什么区别？",
    category: "测试与类型",
    level: "基础",
    frequency: 5,
    summary:
      "单元测试快速验证小范围行为；集成测试验证组件与真实边界的协作；端到端测试从用户入口覆盖完整系统。通常保持大量快速单测、适量集成测试和少量关键 E2E。",
    points: [
      "分类看隔离边界，不是看文件名或是否使用 class。",
      "数据库方言、事务和迁移应在真实数据库集成测试中验证。",
      "测试应关注可观察行为与风险，而不是追求每个实现细节。",
    ],
    code: `def test_discount_for_vip():
    policy = DiscountPolicy()
    assert policy.price(total=100, is_vip=True) == 90

# 集成测试会接真实数据库/消息系统
# E2E 从 HTTP/UI 入口覆盖关键业务旅程`,
    followUp: "为什么 100% 行覆盖率仍可能遗漏主要风险？",
  },
  {
    id: 90,
    title: "pytest fixture 和 parametrize 解决什么问题？",
    category: "测试与类型",
    level: "进阶",
    frequency: 5,
    summary:
      "fixture 提供可复用的测试依赖与清理生命周期；`parametrize` 用多组输入运行同一行为测试。二者减少复制，但 fixture 依赖图过深会让测试难读。",
    points: [
      "yield fixture 在 yield 之后执行 teardown。",
      "fixture scope 要尽可能小，避免测试间共享可变状态。",
      "参数化应给案例清晰 id，失败时能看懂业务场景。",
    ],
    code: `import pytest

@pytest.fixture
def repository():
    repo = InMemoryRepository()
    yield repo
    repo.clear()

@pytest.mark.parametrize(
    ("value", "expected"),
    [(2, 4), (0, 0), (-3, 9)],
)
def test_square(value, expected):
    assert value * value == expected`,
    followUp: "fixture 的 function、module、session scope 各有什么隔离风险？",
  },
  {
    id: 91,
    title: "Mock 应该在哪里 patch？何时 fake 更好？",
    category: "测试与类型",
    level: "进阶",
    frequency: 5,
    summary:
      "Patch 应作用于被测代码查找名字的位置，而不是对象最初定义的位置。Mock 适合验证少量交互或制造异常；有状态、可复用的 fake 往往更贴近行为并降低与实现耦合。",
    points: [
      "过度断言调用顺序会让重构破坏测试，即使行为没变。",
      "为 HTTP/数据库建立窄适配器，测试时替换适配器更稳定。",
      "Mock 规格可限制不存在的方法，减少测试通过而生产失败。",
    ],
    code: `from unittest.mock import create_autospec

client = create_autospec(PaymentClient, instance=True)
client.charge.return_value = Receipt("ok")

service = CheckoutService(client)
service.checkout(order)

client.charge.assert_called_once_with(order.total)`,
    followUp: "London-school mock-heavy 测试与 state-based 测试各自的取舍是什么？",
  },
  {
    id: 92,
    title: "如何建立 Python 代码质量流水线？",
    category: "测试与类型",
    level: "进阶",
    frequency: 4,
    summary:
      "把格式化、lint、类型检查、测试和依赖安全检查放进自动化 CI，并让本地命令与 CI 一致。工具不是越多越好，关键是快速、稳定、可执行的反馈。",
    points: [
      "格式化解决风格争论，lint 找潜在错误，类型检查覆盖接口契约。",
      "覆盖率用于发现未测试区域，不应成为唯一质量目标。",
      "固定工具版本，分层运行快速检查与较慢集成测试。",
    ],
    code: `# 一套常见的本地/CI 检查顺序
ruff format --check .
ruff check .
pyright
pytest -q --cov=src --cov-report=term-missing

# 可通过 pre-commit 提前运行快速检查`,
    followUp: "哪些检查适合 pre-commit，哪些更适合只放在 CI？",
  },
  {
    id: 93,
    title: "编码题：如何反转字符串并判断回文？",
    category: "编码实战",
    level: "基础",
    frequency: 5,
    summary:
      "简单反转可用切片 `text[::-1]`；回文题先明确是否忽略大小写、空格、标点和 Unicode，再用规范化后的序列与反转比较，或用双指针减少额外空间。",
    points: [
      "面试先问清输入规则，算法正确性取决于规格。",
      "`casefold()` 比 `lower()` 更适合通用 Unicode 不区分大小写。",
      "切片方案简洁但需要 O(n) 额外空间。",
    ],
    code: `def is_palindrome(text: str) -> bool:
    normalized = [
        char.casefold()
        for char in text
        if char.isalnum()
    ]
    return normalized == normalized[::-1]

assert is_palindrome("A man, a plan, a canal: Panama")`,
    followUp: "如何用双指针在不创建规范化列表的情况下完成？",
  },
  {
    id: 94,
    title: "编码题：如何保持顺序地去重？",
    category: "编码实战",
    level: "基础",
    frequency: 5,
    summary:
      "元素可哈希时，`list(dict.fromkeys(items))` 利用字典插入顺序简洁去重；需要自定义 key、处理不可哈希元素或流式产出时，用 `seen` 集合配合循环。",
    points: [
      "集合去重不应依赖迭代顺序。",
      "seen 方法平均 O(n) 时间、O(n) 空间。",
      "自定义 key 可按大小写、ID 等业务身份去重。",
    ],
    code: `def unique_by(items, key=lambda value: value):
    seen = set()
    for item in items:
        marker = key(item)
        if marker not in seen:
            seen.add(marker)
            yield item

names = list(unique_by(["Ada", "ada", "Grace"], str.casefold))
assert names == ["Ada", "Grace"]`,
    followUp: "元素不可哈希且没有可提取 key 时，复杂度会如何变化？",
  },
  {
    id: 95,
    title: "编码题：如何统计词频并找出最高频元素？",
    category: "编码实战",
    level: "基础",
    frequency: 5,
    summary:
      "用 `collections.Counter` 在线性时间统计频次，`most_common(k)` 取前 K。面试中要明确并列频次的排序规则，以及分词、大小写和标点如何规范化。",
    points: [
      "完整排序通常 O(m log m)，m 是不同元素数；Top K 可用堆降低成本。",
      "结果稳定性和并列处理应由题目规则决定。",
      "流数据可分块 Counter 后相加，但超高基数要考虑内存。",
    ],
    code: `from collections import Counter
import re

def most_common_words(text: str, k: int):
    words = re.findall(r"\\w+", text.casefold())
    return Counter(words).most_common(k)

assert most_common_words("Py py Go", 1) == [("py", 2)]`,
    followUp: "数据大到单机放不下时，如何分布式统计词频？",
  },
  {
    id: 96,
    title: "编码题：Two Sum 如何做到 O(n)？",
    category: "编码实战",
    level: "基础",
    frequency: 5,
    summary:
      "单次遍历时用字典保存已见值到索引；对当前值 `x` 查找 `target - x`，找到就返回两个索引。时间平均 O(n)，空间 O(n)。",
    points: [
      "先查再存，能避免同一元素被使用两次。",
      "有重复值时字典策略仍可工作，但要明确返回任意解还是全部解。",
      "若输入已排序，可用双指针达到 O(1) 额外空间。",
    ],
    code: `def two_sum(numbers, target):
    seen = {}
    for index, value in enumerate(numbers):
        complement = target - value
        if complement in seen:
            return seen[complement], index
        seen[value] = index
    return None

assert two_sum([2, 7, 11, 15], 9) == (0, 1)`,
    followUp: "如果要求返回全部不重复数值对，如何避免重复结果？",
  },
  {
    id: 97,
    title: "编码题：如何正确实现二分查找？",
    category: "编码实战",
    level: "进阶",
    frequency: 5,
    summary:
      "二分查找要求搜索空间有序，每轮排除一半，时间 O(log n)。关键是明确区间不变量，例如使用左闭右开 `[lo, hi)`，并据此统一循环条件与边界更新。",
    points: [
      "Python 标准库 `bisect` 适合查找插入点，但插入列表仍是 O(n)。",
      "寻找第一个满足条件的位置是更通用的二分模板。",
      "空数组、单元素、重复值和目标在边界外必须测试。",
    ],
    code: `def binary_search(items, target):
    lo, hi = 0, len(items)
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    if lo < len(items) and items[lo] == target:
        return lo
    return -1

assert binary_search([1, 3, 3, 7], 3) == 1`,
    followUp: "如何二分一个单调谓词，而不是具体数组值？",
  },
  {
    id: 98,
    title: "编码题：如何对字母异位词分组？",
    category: "编码实战",
    level: "进阶",
    frequency: 4,
    summary:
      "为每个单词构造与字符顺序无关的可哈希签名，再按签名分组。通用方案是 `tuple(sorted(word))`，每词 O(k log k)；字符集固定时可用频次数组降为 O(k)。",
    points: [
      "先明确大小写、Unicode 规范化和空格是否参与。",
      "签名必须可哈希，因此排序结果要转元组或字符串。",
      "`defaultdict(list)` 很适合累积分组。",
    ],
    code: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        key = tuple(sorted(word.casefold()))
        groups[key].append(word)
    return list(groups.values())

groups = group_anagrams(["eat", "tea", "tan", "ate"])`,
    followUp: "仅含 a-z 时如何用 26 个计数构造 O(k) 签名？",
  },
  {
    id: 99,
    title: "编码题：如何找出数据中的 Top K？",
    category: "编码实战",
    level: "进阶",
    frequency: 5,
    summary:
      "K 较小且数据可流式读取时，维护大小为 K 的最小堆，时间 O(n log k)、空间 O(k)；数据已在内存且规模不大时直接排序更简单；平均线性时间还可用 Quickselect。",
    points: [
      "先明确是最大 K 个值、最高频 K 个，还是按自定义键。",
      "`heapq.nlargest` 已实现常见情况，生产代码优先标准库。",
      "需要稳定并列顺序时，把顺序号作为堆元组的一部分。",
    ],
    code: `import heapq

def top_k(stream, k):
    if k <= 0:
        return []
    heap = []
    for value in stream:
        if len(heap) < k:
            heapq.heappush(heap, value)
        elif value > heap[0]:
            heapq.heapreplace(heap, value)
    return sorted(heap, reverse=True)

assert top_k([8, 1, 7, 3, 9], 3) == [9, 8, 7]`,
    followUp: "Quickselect 的平均与最坏复杂度是什么？什么时候不如堆？",
  },
  {
    id: 100,
    title: "编码题：如何设计一个 O(1) 的 LRU Cache？",
    category: "编码实战",
    level: "高级",
    frequency: 5,
    summary:
      "LRU 需要 O(1) 查找和 O(1) 更新最近使用顺序，经典实现是“哈希表 + 双向链表”；Python 中可用保持顺序的 `OrderedDict` 简洁实现。容量满时淘汰最久未使用项。",
    points: [
      "`get` 命中和 `put` 更新都要把键移动到最近使用端。",
      "要明确容量为零、更新已有键和并发访问的语义。",
      "生产缓存还要考虑 TTL、内存计量、击穿和一致性。",
    ],
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key, default=None):
        if key not in self.data:
            return default
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key, value):
        if self.capacity <= 0:
            return
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)`,
    followUp: "若缓存需要线程安全和 TTL，应在哪些操作周围加锁、何时清理过期项？",
  },
];
