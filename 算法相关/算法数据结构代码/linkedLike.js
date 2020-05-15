class LinkedLike{
    constructor() {
        this.head = null;
        this.length = 0
    }
    // 创建节点
    createNode(element, next) {
        return {
            element,
            next
        }
    }
    // 添加节点
    add(index) {

    }
    get(index) {
        for(let i=0; i<index; i++){
            console.log(this.head.next)
        }
    }
    // 清空链表
    clear() {
        this.head = null;
        this.length = 0
    }
}