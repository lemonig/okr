const initState = {
  value: 0, //加载交互效果

}


function messageReducer(state = initState, action) {
  // console.log(action);
  switch (action.type) {
    case 'SHIFT_MESSAGE':
      return {
        ...state,
        value: action.value
      }
      case 'ADD_MESSAGE':
        return {
          ...state,
          value: action.value
        }
        default:
          return state
  }
}





export default messageReducer