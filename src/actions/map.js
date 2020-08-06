import {print} from '../state/AdesState';
import L from 'leaflet';

export const setCorners = (store, cornerNW, cornerSE) => {
	//console.log('MapState: (BOUND) ', JSON.stringify(cornerNW), JSON.stringify(cornerSE));
	//print(store.state, false, 'MapState', cornerNW, cornerSE);
	store.setState({map: {...store.state.map, cornerNW, cornerSE}});
};

export const addId = (store, id) => {
	const newIds = store.state.map.ids.slice();
	newIds.push(id);
	store.setState({map: {...store.state.map, ids: newIds}});
};

export const removeId = (store, id) => {
	store.setState({map: {...store.state.map, ids: store.state.map.ids.filter(idsaved => idsaved !== id)}});
};

/* Should be called only ONCE - after the map reference has been initalized with a leaflet map */
export const setMapRef = (store, reference) => {
	const cornerNW = reference.current.getBounds().getNorthWest();
	const cornerSE = reference.current.getBounds().getSouthEast();
	store.setState({map: {...store.state.map, cornerNW, cornerSE, mapRef: reference, isInitialized: true}});
};

export const setMapOnClick = (store, fn) => {
	print(store.state, false, 'MapState onClick', fn);
	if (store.state.map.mapRef) {
		store.state.map.mapRef.current.getContainer().addEventListener('click', (evt) => {
			if (evt.currentTarget !== evt.target) {
				if (store.state.map.mapRef.current.listens('contextmenu')) {
					enableClickSelection(store, evt.clientX, evt.clientY);
				}
			}
		}, {capture: true});
		store.state.map.mapRef.current.on('click', (evt) => {
			executeOrAddToClickSelection(store, 'MAP: add new point', () => fn(evt), true);
		});
		store.state.map.mapRef.current.on('contextmenu', (evt) => {
			fn(evt);
		});
		store.state.map.mapRef.current.on('drag', (evt) => {
			disableClickSelection(store);
		});
	}
};

export const disableMapOnClick = (store) => {
	print(store.state, false, 'MapState disable onClick');
	if (store.state.map.mapRef) {
		store.state.map.mapRef.current.off('click');
		store.state.map.mapRef.current.off('contextmenu');
	}
};

export const enableClickSelection = (store, x, y) => {
	store.setState({
		map: {
			...store.state.map, clickSelection: {
				isSelecting: true,
				x: x,
				y: y,
				listIsComplete: false, // true when click reaches parent - topmost of bubbling
				listFns: [] // [{label: 'map', fn: () => {}}]
			},
		}
	});
};

export const disableClickSelection = (store) => {
	if (store.state.map.clickSelection.isSelecting) {
		store.setState({
			map: {
				...store.state.map, clickSelection: {
					isSelecting: false,
					listIsComplete: false, // true when click reaches parent - topmost of bubbling
					listFns: []
				},
			}
		});
	}
};

export const executeOrAddToClickSelection = (store, label, fn, isListComplete = false) => {
	if (store.state.map.clickSelection.isSelecting) {
		const listFns = store.state.map.clickSelection.listFns;
		const fnAndHide = () => {
			fn();
			disableClickSelection(store);
		};
		listFns.push({label, fn: fnAndHide});
		store.setState({
			map: {
				...store.state.map, clickSelection: {
					...store.state.map.clickSelection,
					isSelecting: true,
					listIsComplete: isListComplete, // true when click reaches parent - topmost of bubbling
					listFns: listFns
				},
			}
		});
	} else {
		fn();
	}
};