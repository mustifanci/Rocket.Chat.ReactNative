import * as types from './actionsTypes';

export function inquiryTake(inquiryId) {
	return {
		type: types.INQUIRY.TAKE,
		inquiryId
	};
}

export function inquirySetEnabled(enabled) {
	return {
		type: types.INQUIRY.SET_ENABLED,
		enabled
	};
}

export function inquiryRequest() {
	return {
		type: types.INQUIRY.REQUEST
	};
}

export function inquirySuccess(inquiries) {
	return {
		type: types.INQUIRY.SUCCESS,
		inquiries
	};
}

export function inquiryFailure(error) {
	return {
		type: types.INQUIRY.FAILURE,
		error
	};
}
