
### 1.首先要理解， 为什么Vue用的是es5的定义类方法，而不是用的es6 class
    因为如果用es6的class定义Vue，会导致所有的方法回全在一个文件中， 导致不易管理，
    用ES5 在原型上进行相应的方法挂在，可以将方法模块进行拆分， 利于管理，代码结构清晰

### 2.定义Vue类
    // index.js入口文件
    ```
        function Vue(options) {
            this._init(options) // init方法调用相关方法, 此init方法为initMixin挂载在Vue原型上
        }

        initMixin(Vue) // 给原型上新增_init方法
    ```
    Vue方法内很简单， 只是进行this._init进行调用，而_init函数是initMixin方法在Vue原型方法上进行扩充而来,为了代码结构清晰，我把initMixin定义在init.js中

    ```
    export function initMixin(Vue) {
        Vue.prototype._init = function(options) {
            const vm = this;
            vm.$options = options
            initState(vm)
        }
    }
    ```
    // 上面为initMixin的实现， 首先存储Vue实例并把用户定义的options挂载到实例上，方便后续使用， 然后调用
    initState函数， 进行一些数据的初始化过程，initState函数定义在./initState文件夹下

### 2.initState 函数对状态的初始化过程
    initState初始化过程包括props、methods、 data、computed、watched，初始化的过程有一定的逻辑顺序（找资料扩充）, 此次主要实现initData的过程

    //initState函数的实现，在./initState.js中
    ```
    export function initState(vm) {
        const opts = vm.$options;
            ......
        // 初始化data
        if (opts.data) {
            initData(vm, opts)
        }
            ......
    }
    ```
    当opts.data存在时， 会调用initData进行数据初始化

    ```
    function initData(vm, opts) {
        // 处理data， 因为data可以使function, 也可以是Object，需要区别对待处理获取到定义的数据对象
        const data = typeof opts.data == 'function' ? opts.data() : opts.data
        // 获取到数据后需要给每个数据进行get和set转换，目的是达到响应式数据
        Object.keys(data).forEach((key, i) => {
            defineReactive(data, key, data[key])
        })
        
    }
    ```
    initData中， 首先需要对data进行判断， 因为data有两种形式存在，1.data为对象， 2 data为函数，在组件中都用data为函数的形式， 因为组件可以被复用，用函数可以做到数据隔离，保证组件间数据不会相互影响。
    如果opts.data是函数，就执行获取data数据，如果不是函数那么data就是对象， 然后赋值给变量data。

    然后进行对data进行遍历调用defineReactive给每个数据进行get和set转换， 将其转换为响应式数据
    ```
    // 对数据进行get和set的具体转换 在./observe/index.js中
    function defineReactive(data, key, value) {
        // 如果是对象或数组，就进入observer方法递归进行get和set的转换
        if(typeof value === "object") { new observer(value) }

        Object.defineProperty(data, key, {
            get() {
                // 处理依赖收集逻辑
                return value
            },
            set(newVal) {
                if(newVal === value) return
                // 处理数据更新通知及新增数据的get， set转换
            }
        })
    }
    ```
    在defineReactive中用Object.defineProperty对每个键进行定义后，每当访问数据或设置数据时，都会触发对应数据的get和set方法， 需要在get方法触发时进行依赖收集（依赖收集的目的是当我们去对数据重新赋值或删除数据时，用收集到的依赖列表及时通知用到此数据的地方进行更新）， 在get方法中进行依赖的更新操作，具体步骤稍后实现。
    defineReactive 函数第一行进行了value的类型判断，如果data中的值是对象或数组的话， 需要对调用observer对数组或对象进行相应的深层次数据监测

    ```
    // 进行转换get和set前的的处理， 区分Object和Array数据观测分类处理 在./observe/index.js中
    class observer {
        constructor(value) {
            if (value instanceof Array) {
                //处理数组的情况
            } else {
                // 处理对象的情况
                this.walk(value)
            }
        }

        walk(val) {
            // 对val中的值进行循环转换get set
            Object.keys(val).forEach(item => {
                defineReactive(val, item, val[item])
            })
        }
    }
    ```

    observer 会对数组和对象进行区别处理， 是因为Object.defineProperty不能观测到数组内部的数据改变，并且数组有原型方法如push pop等会对数组进行改变，此处先处理对象情况， 只需要将对象中的所有值进行循环调用defineReactive方法进行get和set转换即可

### 3.get中依赖收集


