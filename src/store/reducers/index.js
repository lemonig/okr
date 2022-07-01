import {
  combineReducers
} from 'redux';
import
loadReducer
from './load-reducers';
import messageRducer from './message-reducers'
import treeReducer from './tree-reducers'

const finalReducer = {
  load: loadReducer,
  message: messageRducer,
  tree: treeReducer
}

const rootReducer = combineReducers(finalReducer)

export default rootReducer