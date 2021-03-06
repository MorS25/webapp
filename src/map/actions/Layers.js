import React from 'react';

/* Visuals */
import {Button, Checkbox} from '@blueprintjs/core';
import styles from '../Map.module.css';

/* Logic */
import useOperationFilter from '../hooks/useOperationFilter';
import S from 'sanctuary';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import SidebarButton from '../SidebarButton';
import {fM} from '../../libs/SaferSanctuary';
import useAdesState from '../../state/AdesState';

const StateFilters = ({selectedFilters, setSelectedFilters}) => {
	const [, , , , , states] = useOperationFilter();
	const { t, } = useTranslation('map');
	return (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.bystate')}
			</div>
			{states.map((filter, index) => {
				return (
					<div
						key={index + filter.text}
						className={styles.sidebarButtonText}
					>
						<Checkbox
							className='donotselect'
							data-test-id={'layers' + filter.filter}
							checked={S.maybeToNullable(S.value('' + index)(selectedFilters))}
							onChange={(evt) => {
								setSelectedFilters((current) =>
									S.insert('' + index)(!fM(S.value('' + index)(current)))(current)
								);
							}}
						>
							{filter.text}
						</Checkbox>

					</div>
				);
			})}
		</>
	);
};

const OperationFilters = ({operations, ids, setIds}) => {
	const { t,  } = useTranslation('map');
	const [ state, actions ] = useAdesState();
	const showOrHide = (id) => {
		if (ids.indexOf(id) !== -1) {
			setIds(current => current.filter(idi => idi !== id));
		} else {
			setIds(current => {
				const newIds = current.slice();
				newIds.push(id);
				return newIds;
			});
		}
	};
	return (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.byid')}
			</div>
			{operations.map((op, index) => {
				if (state.map.ids.indexOf(op.gufi) !== -1) {
					return (
						<div
							className={styles.sidebarButtonText}
							key={op.gufi + index}
						>
							<Checkbox
								checked={ids.indexOf(op.gufi) !== -1}
								onChange={() => showOrHide(op.gufi)}
							/>
							{op.name}
							<Button
								className={styles.sidebarButtonAlternate}
								icon='cross'
								small={true}
								onClick={() => actions.map.removeId(op.gufi)}
							/>
						</div>
					);
				} else {
					return (
						<div
							key={op.gufi + index}
						>
						</div>
					);
				}
			}
			)}
		</>
	);
};

const RfvsFilters = ({rfvs, setRfvs}) => {
	const [state, ] = useAdesState();
	const { t, } = useTranslation('map');
	return (
		<>
			<div className={styles.sidebarSeparator}>
				{t('filter.rfvs')}
			</div>
			{S.map
			((rfv, index) => {
				const isSelected = rfvs.indexOf(rfv.id) !== -1;
				return (
					<div
						key={rfv.comments}
						className={styles.sidebarButtonText}
					>
						<Checkbox
							className='donotselect'
							data-test-id={'rfv' + index}
							checked={isSelected}
							onChange={() => setRfvs(curr => {
								if (isSelected) {
									return curr.filter(rfvi => rfvi !== rfv.id);
								} else {
									const newIds = curr.slice();
									newIds.push(rfv.id);
									return newIds;
								}
							})}
						>
							{rfv.comments}
						</Checkbox>

					</div>
				);
			})
			(S.values(state.rfv.list))
			}
		</>
	);
};

/* Button that opens a Menu that permits users selects what layers to show */
const Layers = ({filtersSelected, setFiltersSelected, operations, disabled, idsSelected, setIdsSelected, rfvs, setRfvsShowing}) => {
	const { t } = useTranslation('glossary');
	return (
		<>
			{/*
		<div data-test-id='mapButtonLayers' className='layersButton'>
			<Popover content={
				<div>
					<Menu>
						<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
						<OperationFilters operations={operations} ids={idsSelected} setIds={setIdsSelected}/>
					</Menu>
				</div>
			} position={Position.BOTTOM_LEFT} disabled={disabled}>
				<div className='contextualMenu'>
					<Icon icon='layers' iconSize={44} color={disabled ? 'rgb(200,200,200)' : 'rgb(50,50,50)'}/>
				</div>
			</Popover>
		</div>
		*/}
			<SidebarButton
				forceOpen={true}
				useCase='Layers'
				icon='layers'
				label={t('layers').toUpperCase()}
				simpleChildren={false}
			>
				<StateFilters selectedFilters={filtersSelected} setSelectedFilters={setFiltersSelected}/>
				<OperationFilters operations={operations} ids={idsSelected} setIds={setIdsSelected}/>
				<RfvsFilters rfvs={rfvs} setRfvs={setRfvsShowing}/>
			</SidebarButton>
		</>
	);
};

Layers.propTypes = {
	filtersSelected: PropTypes.object.isRequired,
	setFiltersSelected: PropTypes.func.isRequired,
	operations: PropTypes.array.isRequired,
	idsSelected: PropTypes.array.isRequired,
	setIdsSelected: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired
};
export default Layers;