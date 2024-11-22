import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>;
};

export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
	console.warn('将update塞入', update, updateQueue.shared.pending);
};

//用于计算新的状态
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		console.warn('action!!!!!!!!!!', baseState);
		console.warn('action!!!!!!!!!!', action);
		if (action instanceof Function) {
			console.warn('进1');
			result.memorizedState = action(baseState);
		} else {
			console.warn('进2');
			result.memorizedState = action;
		}
	}
	console.warn('result!!!!!!!!!!', result);
	return result;
};
