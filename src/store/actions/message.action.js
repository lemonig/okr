export const SHIFT_MESSAGE = 'SHIFT_MESSAGE'
export const ADD_MESSAGE = 'ADD_MESSAGE'

export const messageActions = {
  shiftMessage: (val) => ({
    type: SHIFT_MESSAGE,
    value: val
  }),
  addMessage: (val) => ({
    type: ADD_MESSAGE,
    value: val
  })
}