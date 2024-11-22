import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { reconcileChildFibers, mountChildFibers } from './childFibers';

export const beginWork = (wip: FiberNode) => {
	console.warn('进入beginwork', wip);
	//比较，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			console.warn('进入beginwork', wip);
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.log('beginwork未实现的类型');
			}
			break;
	}
	return null;
};

function updateHostRoot(wip: FiberNode) {
	console.warn('问题！！！！！！！！！', wip.memorizedState);
	const baseState = wip.memorizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	console.warn('updateHostRoot中的baseState', wip.memorizedState, wip);
	console.warn('updateHostRoot中的updateQuenen', updateQueue.shared.pending);
	const pending = updateQueue.shared.pending; //参与计算的update
	updateQueue.shared.pending = null;
	const { memorizedState } = processUpdateQueue(baseState, pending);
	console.warn('返回的resultMMMMMMMMM', memorizedState);
	wip.memorizedState = memorizedState;

	const nextChildren = wip.memorizedState;
	reconcileChildren(wip, nextChildren);
	console.warn('准备返回子fiber', nextChildren, wip.child);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	console.warn('GGGGGGGGGGGG', nextChildren);
	reconcileChildren(wip, nextChildren);
	console.warn('GGGGGGGGGGGG', wip.child);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current !== null) {
		//update
		console.warn('进3', current, children);
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		//mount
		console.warn('进4');
		wip.child = mountChildFibers(wip, null, children);
	}
}
