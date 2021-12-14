export const arrObjIncludes = (arr, obj) => {
    let bools = [];

  arr.forEach(coord => {
      bools.push(JSON.stringify(coord) === JSON.stringify(obj))
    })
    
    return bools.includes(true)
}