import * as actionTypes from '../actions/actions'
import * as data from '../constants/number'
let initData = data.initData;

export default function(state=initData, action) {
	switch(action.type) {
		case actionTypes.ADD_NUM: {
			return {
				...state,
				cart:state.cart.map((item) => item.product === action.payload.product ? action.payload : item)
			}
		}
		case actionTypes.DEL_NUM: {
			return {
				...state,
				cart:state.cart.map((item) => item.product === action.payload.product ? action.payload : item)
			}
		}
		case actionTypes.CHANGETEXT: {
			return {
				...state,
				cart:state.cart.map((item) => item.product === action.payload.product ? action.payload : item)
			}
		}
		default:
			return state
	}
}
