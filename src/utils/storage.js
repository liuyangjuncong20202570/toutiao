// 该模块是为了让本地存储这项操作模块化，在以后的操作中可以随取随用

// 存储数据
export const setItem = (key, value) => {
  // 如果存储的数据为数组或对象，我们应该将数据转换为json格式字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

// 取数据
export const getItem = (key) => {
  const data = localStorage.getItem(key)
  // 这里使用trycatch语句聪明的利用该语句的特点，如果json.parse失败说明不是一个json格式数据，则直接return data，否则就return解析后的json数据
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

// 删除数据
export const removeItem = (key) => {
  localStorage.removeItem(key)
}
