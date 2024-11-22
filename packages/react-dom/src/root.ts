import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElementType } from 'shared/ReactTypes';

export function createRoot(container: Container) {
	const root = createContainer(container);
	console.warn('--------->root', root);
	return {
		render(element: ReactElementType) {
			updateContainer(element, root);
		}
	};
}
