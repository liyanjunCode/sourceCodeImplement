
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

### 2.initState 函数状态的初始化过程及对象的数据侦测
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
        let data = opts.data
        // 处理data， 因为data可以使function, 也可以是Object，需要区别对待处理获取到定义的数据对象
        data = vm._data = typeof data == 'function' ? data.call(vm) : data
        // 获取到数据后需要给每个数据进行get和set转换，目的是达到响应式数据
        Object.keys(data).forEach((key, i) => {
            proxy(vm, '_data', key)
            defineReactive(data, key, data[key])
        })
    }
    ```
    initData中， 首先需要对data进行判断， 因为data有两种形式存在，1.data为对象， 2 data为函数，在组件中都用data为函数的形式， 因为组件可以被复用，用函数可以做到数据隔离，保证组件间数据不会相互影响。
    如果opts.data是函数，就执行获取data数据，如果不是函数那么data就是对象， 然后赋值给变量data和vm._data。
    
    // 代理设置
    ```
    // 将所有数据代理给vm， 方便访问， 比如在vue中调用数据是this.a直接访问
    function proxy(vm, source, key) {
        Object.defineProperty(vm, key, {
            get() {
                return vm[source][key]
            },
            set(newVal) {
                vm[source][key] = newVal
            }
        })
    }
    ```
    通过设置get和set的方式当访问this.a的时候实际访问的是this._data.a,赋值时同理，减少过多书写问题

    然后进行对data进行遍历调用defineReactive给每个数据进行get和set转换， 将其转换为响应式数据
    ```
    // 对数据进行get和set的具体转换 在./observe/index.js中
    function defineReactive(data, key, value) {
        // 递归
        observe(value)
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
    function observe(value) {
        // 如果是对象或数组，就进入Observer方法递归进行get和set的转换
        if(typeof value === "object" && typeof value !== null) {
            new Observer(value)
        }
    }
    ```
    在defineReactive中用Object.defineProperty对每个键进行定义后，每当访问数据或设置数据时，都会触发对应数据的get和set方法， 需要在get方法触发时进行依赖收集（依赖收集的目的是当我们去对数据重新赋值或删除数据时，用收集到的依赖列表及时通知用到此数据的地方进行更新）， 在get方法中进行依赖的更新操作，具体步骤以后实现。
    observe 函数中进行了value的类型判断，如果data中的值是对象或数组的话， 需要对调用Observer对数组或对象进行相应的深层次数据监测

    ```
    // 进行转换get和set前的的处理， 区分Object和Array数据观测分类处理 在./observe/index.js中
    class Observer {
        constructor(value) {
            if (Array.isArray(value)) {
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

    Observer 会对数组和对象进行区别处理， 是因为Object.defineProperty不能观测到数组内部的数据改变，并且数组有原型方法如push pop等会对数组进行改变，此处先处理对象情况， 只需要将对象中的所有值进行循环调用defineReactive方法进行get和set转换即可

### 3数组的数据侦测
    监测数组数据特殊在于数组的原型方法对于数组的改变，所以侦测数组数据的思路在于， 在调用数组的原型方法前对其进行拦截， 即要通知原型进行数组相应操作，也需要对新增的数组进行响应式转换，所以需要建立一个拦截器
    // ./observe/array.js
    ```
    export const originPorto = Array.prototype  //复制数组原型
    export const copyOrigin = Object.create(originPorto)

    // 数组的一下方法会对数组进行改变，所以需要处理
    export const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

    methods.forEach( item => {
        const originMethods = originPorto[item]
        Object.defineProperty(copyOrigin, item, {
            value: function() {
                // 调用数组方法后触发
                originMethods.call(this, arguments)
                let insert;
                // 判断方法
                switch(item) {
                    case 'push':
                    case 'unshift':
                        insert = args.slice(0)
                        break
                    case 'splice':
                        insert = args.slice(2)
                        break
                }
                console.log(insert)
            },
            enum: false,
            configurable: false,
        })
    })
    ```
    先复制数组的原型对象， 创建一个原型对象的副本copyOrigin， methods数组中方法会对数组的操作导致数组会发生变化，用defineProperty对复制的原型copyOrigin进行处理， 当我们访问复制原型的push等方法时， 都会执行vale对应的函数，可以执行原数组原型方法和处理新增数据侦测逻辑，用insert存储新增数据，当调用push和unshift时，所有的参数都是新增数据，当调用splice时从参数的第二位开始是新增数据

    创建完拦截器， 接下来需要将拦截器进行挂载
    // ./observe/index.js中
    ```
    export class Observer {
        constructor(value) {
            if (Array.isArray(value)) {
                //处理数组的情况
                '__proto__' in Object ? protoAgument(value, copyOrigin) : copyAgument(value, methods, copyOrigin)
                // 处理数组的递归监测
                this.observeArray(value)
            } else {
                ...........
            }
        }
        .........
        observeArray(value) {
            for(let i=0; i< value.length; i++) {
                observe(value[i])
            }
        }
    } 
    ```
    Observer中新增observeArray方法和数组情况的处理,当__proto__（此属性未写入标准，但几乎所有浏览器都实现了，所以需要判别情况，进行兼容性处理挂载拦截器）存在时就调用protoAgument， 不能存在调用copyAgument

    protoAgument和copyAgument实现
    ```
    // 挂载到原型
    function protoAgument (val, proto) {
        val.__proto__ = proto
    }
    // 暴力挂载到value
    function copyAgument (val, keys, source) {
        for(let i=0; i < keys.length; i++){
            val[keys[i]] = source[keys[i]]
        } 
    }
    ```
    当浏览器支持__proto__属性时， 直接将拦截器覆盖原型方法即可， 当不支持__proto__属性时，就进行比较暴力的挂载，直接把push，pop等方法挂载到value上赋值为拦截器，挂载完拦截器后，用observeArray循环遍历数组，调用observe进行数据侦测

    //下面最后一步处理拦截器中如何对新增数据进行侦测
   ```
    export class Observer {
        constructor(value) {
            <!-- 新增 -->
            Object.defineProperty(value, "__ob__", {
                enum: false,
                configurable: false,
                value: this
            })
        }
        ..........
    }
   ```
    首先对于Observer需要对value新增__ob__属性，有两个方面原因， 1.可以做标记，在响应式转换时，可以直接略过，返回自带的__ob__即可， 2.因为Observer和数组的拦截器需要建立一个联系， 我们在拦截器中，是需要调用Observer的observeArray方法对push、pop、splice新增的数据进行一个数据侦测， 用defineProperty定义了__ob__属性后， 我们可以在拦截器中直接通过this.__ob__访问Observer实例
    <!-- 对拦截器的更改 -->
    ```
    methods.forEach( item => {
        const originMethods = originPorto[item]
        Object.defineProperty(copyOrigin, item, {
            value: function(...args) {
                // 调用数组方法后触发
                originMethods.call(this, args)
                const ob = this.__ob__  // 新增
                let insert;
                // 判断方法
                switch(item) {
                    case 'push':
                    case 'unshift':
                        insert = args.slice(0)
                        break
                    case 'splice':
                        insert = args.slice(2)
                        break
                }
                insert && ob.observeArray(insert) // 新增
                
            },
            enum: false,
            configurable: false,
        })
    })
    ```
    <!--修改observe -->
    ```
    function observe(value) {
        // 如果是对象或数组，就进入Observer方法递归进行get和set的转换
        if(typeof value !== "object" || typeof value === null) { return }
        if(value.__ob__) {
            return value.__ob__
        } else {
            new Observer(value)
        }   
    }
    ```
    // 最后说一下问什么用Object.defineProperty定义value的__ob__属性， 而不是用value.__ob__ = this,
    使用value.__ob__ = this 会造成循环引用导致溢出，因为用到了很多循环遍历，用Object.defineProperty将enum设置为false，value的__ob__属性就不可遍历， 不会出现栈溢出的情况
    
