import { onMounted, reactive, ref, onBeforeUnmount } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';

const rawGetBoundingClientRect  = Element.prototype.getBoundingClientRect;

/* 
* rowKey 行数据的唯一id
*/
export default function useVxeTable(params: VxeGridProps, dataChange?: (data: any) => void){
    const initConfig = {
        loading: false,
        border: 'inner',
        autoResize: true,
        showOverflow:'tooltip',
        columnConfig: {
            minWidth: 100,
        },
        data: [],
        ...params,
        rowConfig: {
            isHover: true,
            height: 40,
            keyField: 'id',
            ...(params.rowConfig || {})
        },
    };
    const rowKey = initConfig.rowConfig.keyField; //行数据的唯一id
    const table = reactive(initConfig);
    const table$ = ref<VxeGridInstance>();

    const methods = {
        /**
        * 插件行数据
        * @param data 插入的数据 
        * @param position 
        * 如果 position 为 1 向上插入（不传row则插入顶部）;
        * 如果 position 为 -1 向下插入（不传row则插入底部）;
        * @param row 行数据
        */
        insertRow(data: {} | [], position: -1 | 1 = 1, row?: string | {}){
            const list = Array.isArray(data) ? data : [data];

            if(row){
                const key = typeof row === 'object' ? row[rowKey] : row;
                const arr: any[] = [];
                table.data.forEach((item: any) => {
                    // 向上插入
                    if(position === 1 && item[rowKey] === key){
                        arr.push(...list);
                    }

                    arr.push(item)

                    // 向下插入
                    if(position === -1 && item[rowKey] === key){
                        arr.push(...list);
                    }
                })
                table.data = arr;
            } else {
                // 插入顶部
                if(position === 1){
                    table.data = [
                        ...list,
                        ...table.data,
                    ]
                } 
                // 插入底部
                else {
                    table.data = [
                        ...table.data,
                        ...list,
                    ]
                }
            }

            watchChangeFn();
            return true;
        },
        /**
         * 移动行位置
         * @param row 要移动的行 string类型时为行的id, 对象为行，
         * 数组为多行(数组内分为行数据，行id，行索引三种情况)
         * 行为索引最好调用moveRowByIndex方法
         * @param index 负数代表向上移动的行数，整数代表向下移动的行数
        */
        moveRow(row: string | {} | {}[] | string[] | number[], index: number){
            if(index === 0){
                return false;
            }

            // 用来储存所有要移动行的key值
            const rowMap: {
                [id: string]: true
            } = {}
            if(typeof row === 'string'){
                rowMap[row] = true;
            }else if(Array.isArray(row)){
                // 空数据
                if(row.length === 0){
                    return false;
                }
                row.forEach((item: any) => {
                    // 传进来的是行数据
                    if(typeof item === 'object'){
                        rowMap[item[rowKey]] = true;
                    }
                    // 传进来的是行id
                    else if(typeof item === 'string'){
                        rowMap[item] = true;
                    }
                    // 传进来的是行索引
                    else if(typeof item === 'number'){
                        rowMap[table.data[item][rowKey]] = true;
                    }
                })
            }else {
                rowMap[row[rowKey]] = true;
            }

            const originArr: any[] = [];
            const targetArr: any[] = [];
            const indexList = []; //要移动的行数据的目标位置

            for(let i = 0; i < table.data.length; i++){
                const data = table.data[i];
                const id = data[rowKey];
                if(rowMap[id]){
                    originArr.push(data);
                    indexList.push(i + index);
                }else {
                    targetArr.push(data);
                }
            }

            // 移动位置超出了范围
            if(indexList[0] < 0 || indexList[indexList.length - 1] > table.data.length - 1){
                return false;
            }
            
            indexList.forEach((item, index) => {
                targetArr.splice(item, 0, originArr[index]);
            })

            table.data = targetArr;
            watchChangeFn();
            return table.data;
        },
        /**
         * 移动行位置
         * @param indexList 要移动的行的索引的数组(按先后顺序传进来)
         * @param index 负数代表向上移动的行数，整数代表向下移动的行数
        */
        moveRowByIndex(indexList: number[], index: number){
            if(index === 0){
                return false;
            }
            const targetIndexList = indexList.map(item => item + index);

            // 移动位置超出了范围
            if(targetIndexList[0] < 0 || targetIndexList[indexList.length - 1] > table.data.length - 1){
                return false;
            }

            // 要移动的数据的数组
            const originArr = [];
            for(let i = 0; i < indexList.length; i++){
                originArr.push(table.data.splice(indexList[i] - i,1)[0]);
            }
            
            for(let i = 0; i < targetIndexList.length; i++){
                table.data.splice(targetIndexList[i], 0, originArr[i]);
            }
            table.data = [...table.data];
            watchChangeFn();
            return table.data;
        },
        /**
         * 移动行位置 置顶或置底
         * @param row 要移动的行 string类型时为行的id, 对象为行，
         * 数组为多行(数组内分为行数据，行id，行索引三种情况)
         * 行为索引最好调用moveRowByIndexTopOrBottom方法
         * @param type -1移到顶部 1移到底部
         */
        moveRowTopOrBottom(row: string | {} | {}[] | string[] | number[], type: -1 | 1){
            const list = [];
            let targetIndex: number = type === -1 ? table.data.length - 1 : 0; //第一个或最后一个数据的位置
            if(typeof row === 'string'){
                targetIndex = table.data.findIndex(item => item[rowKey] === row);
                list.push(table.data[targetIndex]);
            }else if(Array.isArray(row)){
                if(row.length === 0){
                    return false;
                }
                row.forEach((it: any) => {
                    let rowData = it;
                    let currentIndex = 0;
                    // 传进来的是行数据
                    if(typeof it === 'object'){
                        currentIndex = table.data.findIndex(item => item[rowKey] === it[rowKey]);
                    }
                    // 传进来的是行id
                    else if(typeof it === 'string'){
                        currentIndex = table.data.findIndex(item => item[rowKey] === it);
                        rowData = table.data[currentIndex];
                    }
                    // 传进来的是行索引
                    else if(typeof it === 'number'){
                        currentIndex = it;
                        rowData = table.data[currentIndex];
                    }

                    // 置顶取最小的index
                    if(type === -1){
                        (currentIndex < targetIndex) && (targetIndex = currentIndex);
                    }

                    // 置底取最大的index
                    if(type === 1){
                        (currentIndex > targetIndex) && (targetIndex = currentIndex);
                    }

                    list.push(rowData);
                });
            }else {
                targetIndex = table.data.findIndex(item => item[rowKey] === row[rowKey]);
                list.push(row);
            }
            // 没移动或超出边界
            if((type === -1 && targetIndex <= 0) || (type === 1 && targetIndex >= table.data.length - 1)){
                return false;
            }
            
            const moveNumber = type === -1 ? -targetIndex : table.data.length - 1 - targetIndex;
            return methods.moveRow(list, moveNumber);
        },
        /**
         * 移动行位置 置顶或置底
         * @param indexList 要移动的行的索引的数组(按先后顺序传进来)
         * @param index 负数代表向上移动的行数，整数代表向下移动的行数
        */
        moveRowByIndexTopOrBottom(indexList: number[], type: -1 | 1){
            // 没移动或超出边界
            if((type === -1 && indexList[0] <= 0) || (type === 1 && indexList[indexList.length - 1] >= table.data.length - 1)){
                return false;
            }

            const moveNumber = type === -1 ? -indexList[0] : table.data.length - 1 - indexList[indexList.length - 1];

            return methods.moveRowByIndex(indexList, moveNumber);
        },
        /**
         * 删除行数据
         * @param row 要删除的行 string类型时为行的id, 对象为行，
         * 数组为多行(数组内分为行数据，行id，行索引三种情况)
        */
        deleteRow(row: string | {} | {}[] | string[] | number[]){
            if(typeof row === 'string'){
                table.data = table.data.filter(item => (item[rowKey] !== row));
            }else if(Array.isArray(row)){
                if(row.length === 0){
                    return false;
                }
                const type = typeof row[0];
                table.data = table.data.filter((item, index) => {
                    // 传进来的是行数据
                    if(type === 'object'){
                        return !row.includes(item)
                    }
                    // 传进来的是行id
                    if(type === 'string'){
                        return !row.includes(item[rowKey]);
                    }
                    // 传进来的是行索引
                    else if(type === 'number'){
                        return !row.includes(index);
                    }
                });
            }else {
                table.data = table.data.filter(item => (item !== row));
            }
            watchChangeFn();
            return true;
        }
    }

    // 调用上面方法改变数据后的回调
    function watchChangeFn(){
        if(dataChange){
            dataChange(table.data);
        }
    }

    // 重写，因为在微前端中有bug
    function rewriteGetBoundingClientRect(){
        if(window.__MICRO_APP_ENVIRONMENT__){
            Element.prototype.getBoundingClientRect = function() {
                const appBody = document.querySelector('micro-app-body');
                const appBodyRect: DOMRect = rawGetBoundingClientRect.call(appBody)
                const rawRect = rawGetBoundingClientRect.apply(this);
                
                const computedRect: DOMRect = new DOMRect(
                    rawRect.x - appBodyRect.x,
                    rawRect.y - appBodyRect.y,
                    rawRect.width,
                    rawRect.height,
                )
                return computedRect;
            };
        } 
    }

    // 恢复这个方法
    function restoreGetBoundingClientRect(){
        if(window.__MICRO_APP_ENVIRONMENT__){
            Element.prototype.getBoundingClientRect = rawGetBoundingClientRect;
        }
    }

    onMounted(() => {        
        table$.value?.$el.addEventListener('mouseenter', rewriteGetBoundingClientRect);
        table$.value?.$el.addEventListener('mouseleave', restoreGetBoundingClientRect);
    })

    onBeforeUnmount(() => {
        table$.value?.$el.removeEventListener('mouseenter', rewriteGetBoundingClientRect);
        table$.value?.$el.removeEventListener('mouseleave', restoreGetBoundingClientRect);
    })

    return {
        table,
        table$,
        ...methods,
    }
}