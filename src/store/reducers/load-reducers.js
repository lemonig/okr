const initState = {
  showLoading: false, //加载交互效果
  loadType: 'top',
  loadText: '', 
}


function loadingReducer(state = initState, action) {
  switch (action.type) {
    case 'PUSH_LOADING':
      return {
        ...state,
        showLoading: true
      }
      case 'SHIFT_LOADING':
        return {
          ...state,
          showLoading:false
        }

        default:
          return state
  }
}





export default loadingReducer