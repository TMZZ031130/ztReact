import { appendChildToContainer, Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null; //指向下一个effect

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;
	console.warn('commitMutationEffects内部的finishedWork', finishedWork);

	while (nextEffect !== null) {
		//向下遍历
		const child: FiberNode | null = nextEffect.child;
		console.warn('获得child', child);

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
			console.warn('nextEffect变为child', nextEffect);
		} else {
			//向上遍历 DFS
			up: while (nextEffect !== null) {
				console.warn('进入up', nextEffect);
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	//执行并清除Placement
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}

	//flags Update
	//flags ChildDeletion
};

const commitPlacement = (finishedWork: FiberNode) => {
	//finishWork -- DOM
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	//parent DOM
	const hostParent = getHostParent(finishedWork);
	//finishedWork -- DOM append parent DOM
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

function getHostParent(fiber: FiberNode): Container | null {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		//HostComponent HostRoot
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			console.warn('返回值：', (parent.stateNode as FiberRootNode).container);
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
		console.warn('parent:', parent);
	}
	if (__DEV__) {
		console.warn('未找到host parent');
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	console.warn('执行appendPlacement', finishedWork, hostParent);
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
