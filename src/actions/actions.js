export const ADD_NUM = 'ADD_NUM';
export const DEL_NUM = 'DEL_NUM';
export const CHANGETEXT = 'CHANGETEXT';

export function addNum(data) {
	return {
		type:ADD_NUM,
		payload: {data}
	}
}

export function delNum(data) {
	return {
		type:DEL_NUM,
		payload:{data}
	}
}

export function changeText(data) {
	return {
		type:CHANGETEXT,
		payload:{data}
	}
}
