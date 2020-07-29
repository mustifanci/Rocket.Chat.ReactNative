import log from '../../../utils/log';
import store from '../../createStore';
import RocketChat from '../../rocketchat';
import { inquiryRequest } from '../../../actions/inquiry';

const removeListener = listener => listener.stop();

let connectedListener;
let disconnectedListener;
let queueListener;

export default function subscribeInquiry() {
	const handleConnection = () => {
		store.dispatch(inquiryRequest());
	};

	const handleQueueMessageReceived = (ddpMessage) => {
		const [{ type, ...sub }] = ddpMessage.fields.args;

		// removed is handled by rooms subscription
		if (/removed/.test(type) || /added/.test(type)) {
			return;
		}

		// TODO: lets debounce these messages, since they are sometimes multiple
		// let's add this sub to a redux variable
		console.log(sub);
	};

	const stop = () => {
		if (connectedListener) {
			connectedListener.then(removeListener);
			connectedListener = false;
		}
		if (disconnectedListener) {
			disconnectedListener.then(removeListener);
			disconnectedListener = false;
		}
		if (queueListener) {
			queueListener.then(removeListener);
			queueListener = false;
		}
	};

	connectedListener = this.sdk.onStreamData('connected', handleConnection);
	disconnectedListener = this.sdk.onStreamData('close', handleConnection);
	queueListener = this.sdk.onStreamData('stream-livechat-inquiry-queue-observer', handleQueueMessageReceived);

	try {
		const { user } = store.getState().login;
		RocketChat.getAgentDepartments(user.id).then((result) => {
			if (result.success) {
				const { departments } = result;
				const departmentIds = departments.map(({ departmentId }) => departmentId);
				departmentIds.forEach((departmentId) => {
					this.sdk.subscribe('stream-livechat-inquiry-queue-observer', `department/${ departmentId }`).catch(e => console.log(e));
				});
			}
		});

		return {
			stop: () => stop()
		};
	} catch (e) {
		log(e);
		return Promise.reject();
	}
}
