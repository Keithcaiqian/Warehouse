import NP from 'number-precision';

// 显示价格
function show(price: string | number) {
  return NP.divide(price, 100);
}

// 储存价格
function save(price: string | number) {
  return NP.times(price, 100);
}

const priceTrans = {
  show,
  save,
};

export default priceTrans;
