export const PUSH_LOADING = 'PUSH_LOADING'
export const SHIFT_LOADING = 'SHIFT_LOADING'


export const actions = {
  showLoading: ()=> ({type:PUSH_LOADING,value: true}),
  shiftLoading:()=> ({ type: SHIFT_LOADING,value: false })
}

