import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props; //正在被处理的新props
	key: Key;
	ref: Ref;
	stateNode: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memorizedProps: Props | null; //最新的Props
	memorizedState: any; //最新的State

	alternate: FiberNode | null; //两棵树的对应连接
	flags: Flags; //操作类型
	subtreeFlags: Flags;
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		//HostComponent <div>的divDOM
		this.stateNode = null;
		//FunctionComponent本身
		this.type = null;
		//指向父fiberNode
		this.return = null;
		//指向右边兄弟fiberNode
		this.sibling = null;
		//指向子fiberNode
		this.child = null;
		//代表了同级fiberNode的编号
		this.index = 0;

		this.ref = null;

		//作为工作单元
		this.pendingProps = pendingProps; //操作前
		this.memorizedProps = null; //操作后的props
		this.updateQueue = null; //更新队列
		this.memorizedState = null;

		this.alternate = null; //指向另一棵树的节点

		this.flags = NoFlags; //副作用(标记)
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		console.warn('this=========>', this);
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	console.warn('current', current);

	console.warn('首次创建wip', wip);

	if (wip === null) {
		//mount首屏渲染
		console.warn('mount开始', wip);
		console.warn('三个数据', current.tag, pendingProps, current.key);
		wip = new FiberNode(current.tag, pendingProps, current.key);
		console.warn('mount开始', wip);
		wip.type = current.type;
		console.warn('mount开始', wip);
		wip.stateNode = current.stateNode;

		console.warn('传入数据', wip);

		wip.alternate = current;
		current.alternate = wip;
	} else {
		//update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}
	wip.type = current.type;
	// wip.flags = current.flags;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	console.warn('获得child后', wip);
	wip.memorizedProps = current.memorizedProps;
	wip.memorizedState = current.memorizedState;
	console.warn('获得child后', wip);

	return wip;
};

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	console.warn('XXXXXXXXXXXXXX', element, type, props, key);
	if (typeof type === 'string') {
		//<div> --> 'div' --> type: 'div
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未实现的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	console.log('OOOOOOO', fiber);
	fiber.type = type;
	return fiber;
}
