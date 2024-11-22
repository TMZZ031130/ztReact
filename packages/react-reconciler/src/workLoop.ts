import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	console.warn('prepare中的root', root);
	console.warn('root.current', workInProgress, root.current);
	workInProgress = createWorkInProgress(root.current, {});
	console.warn('prepare中的wip', workInProgress, root.current);
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	//TODO调度方法
	//fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	console.warn('schedule中的root', root);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		console.warn('-----+++++++++++++++++++++++>', node.stateNode);
		return node.stateNode;
	}
	return null;
}

export const renderRoot = (root: FiberRootNode) => {
	//初始化
	console.warn('初始化前的root', root);
	prepareFreshStack(root);
	console.warn('初始化后的root', root, workInProgress);

	do {
		try {
			console.warn('循环开始', workInProgress);
			workLoop();
			console.warn('循环结束', workInProgress);
			break;
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop错误', e);
				workInProgress = null;
			}
		}
		// eslint-disable-next-line no-constant-condition
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	console.warn(finishedWork, root.finishedWork);

	commitRoot(root);
};

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;

	if (finishedWork === null) {
		return;
	}

	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork);
	}

	//重置
	root.finishedWork = null;
	console.warn('重置', root.finishedWork);

	//判断是否存在3个子阶段需要执行的操作
	//root flags root subtreeFlags
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

	if (subtreeHasEffect || rootHasEffect) {
		//beforeMutation
		//Mutation
		console.warn('执行commitMutationEffects', finishedWork);
		commitMutationEffects(finishedWork);

		root.current = finishedWork;
		console.warn('root.current后的finishedWork和root.current', finishedWork);
		//layout
	} else {
		root.current = finishedWork;
	}
}

export const workLoop = () => {
	if (workInProgress !== null) {
		console.warn('workLoop中的wip', workInProgress);
		performUnitOfWork(workInProgress);
	}
};

function performUnitOfWork(fiber: FiberNode) {
	console.warn('这里的fiber++SHHSHSH', fiber);
	const next = beginWork(fiber);
	console.warn('next:', fiber, next);
	fiber.memorizedProps = fiber.pendingProps;
	console.warn('memo:', fiber.memorizedProps, fiber.pendingProps);
	if (next === null) {
		completeUntiOfWork(fiber);
	} else {
		console.warn('进入下一个子节点');
		workInProgress = next;
	}
}

function completeUntiOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;

	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
