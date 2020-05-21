import React, {useState} from 'react';
import {Button, Icon, Intent} from '@blueprintjs/core';

function ExpandedRightAreaButton({useCase, isExpanded, onClick , simpleChildren, children}) {
	return (
		<div
			className={isExpanded ? 'rightAreaButtonTexts rightAreaButtonText100' : 'rightAreaButtonTexts rightAreaButtonText0'}
		>
			{	simpleChildren && children.map((sub, index) => {
				if (sub.isSpecial != null && sub.isSpecial) {
					return sub.div;
				} else {
					return (
						<div
							className={index % 2 ? 'rightAreaButtonText' : 'rightAreaButtonText'}
							data-test-id={'map' + useCase + index}
							key={sub.name}
							onClick={() => onClick(sub)}
						>
							{sub.name}
						</div>
					);
				}
			}
			)
			}
			{	!simpleChildren &&
				children
			}
		</div>
	);
}

function RightAreaButton({forceOpen = false, useCase, icon, label, onClick, simpleChildren, children, className = ''}) {
	const [isExpanded, setExpanded] = useState(forceOpen);
	return (
		<>
			<div
				data-test-id={'mapButton' + useCase}
				className={'rightAreaButton ' + className}
				onClick={() => setExpanded(current => !current)}
			>
				<Icon icon={icon} iconSize={20} color='rgb(255,255,255)'/>
				<div className='rightAreaText'>
					{label}
				</div>
				{	!isExpanded &&
					<Icon icon='chevron-down' iconSize={20}/>
				}
				{	isExpanded &&
					<Icon icon='chevron-up' iconSize={20}/>
				}
			</div>
			<ExpandedRightAreaButton
				isExpanded={isExpanded}
				useCase={useCase}
				onClick={onClick}
				simpleChildren={simpleChildren}
			>
				{children}
			</ExpandedRightAreaButton>
		</>
	);
}

export default RightAreaButton;