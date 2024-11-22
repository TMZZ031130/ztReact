import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container: Container) {
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	console.warn('打印这个hostRootFiber', hostRootFiber);
	const root = new FiberRootNode(container, hostRootFiber);
	console.warn('根结点以创建并返回', root);
	hostRootFiber.updateQueue = createUpdateQueue();
	console.warn('根结点以创建并返回', root);
	return root;
}

export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	console.warn('刚创建的hostRootFiber', hostRootFiber);
	const update = createUpdate<ReactElementType | null>(element);
	console.warn('update创建', hostRootFiber.updateQueue, update);
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// hostRootFiber.updateQueue.shared.pending = update;
	console.warn('enque后的hostRootFiber.updateQueue', hostRootFiber.updateQueue);
	scheduleUpdateOnFiber(hostRootFiber);
	return element;
}
