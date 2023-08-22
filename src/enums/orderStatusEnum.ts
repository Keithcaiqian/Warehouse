export enum OrderStatusEnum {
  COMPLETE = 'complete', // 已完成的订单
  CANCEL = 'cancel', // 取消的订单
  WAIT = 'wait', // 待审核的订单
  REJECT = 'reject', //审核被拒绝的订单
}

export const OrderStatusMap = {
  [OrderStatusEnum.COMPLETE]: '已完成',
  [OrderStatusEnum.CANCEL]: '已取消',
  [OrderStatusEnum.WAIT]: '待审核',
  [OrderStatusEnum.REJECT]: '被拒绝',
};

// 订单列表
export const OrderStatusList = [
  {
    code: OrderStatusEnum.COMPLETE,
    name: OrderStatusMap[OrderStatusEnum.COMPLETE],
  },
  {
    code: OrderStatusEnum.CANCEL,
    name: OrderStatusMap[OrderStatusEnum.CANCEL],
  },
];

// 未完成列表
export const UnOrderStatusList = [
  {
    code: OrderStatusEnum.WAIT,
    name: OrderStatusMap[OrderStatusEnum.WAIT],
  },
  {
    code: OrderStatusEnum.REJECT,
    name: OrderStatusMap[OrderStatusEnum.REJECT],
  },
];
