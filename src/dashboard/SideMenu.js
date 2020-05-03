import React, {useState} from 'react';
import '../Ades.css';
import {Menu, MenuDivider, MenuItem, Intent, Spinner, Dialog, Button} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import useAdesState from '../state/AdesState.js';
import S from 'sanctuary';
import {fM} from '../libs/SaferSanctuary';
import {useCookies} from 'react-cookie';
import {useTranslation} from 'react-i18next';

function SideMenu() {
	const history = useHistory();
	const { t, i18n } = useTranslation();
	
	/* Auth */
	const [, setCookie, removeCookie] = useCookies(['jwt']);
	const [adesState, adesActions] = useAdesState();
	const [logoutPressed, setLogoutP] = useState(false);

	const logout = () => {
		removeCookie('user');
		removeCookie('jwt');
		adesActions.auth.logout();
	};

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			setCookie('lang', 'es');
			i18n.changeLanguage('es');
		} else {
			setCookie('lang', 'en');
			i18n.changeLanguage('en');
		}
	};

	const LogoutConfirmation = () => {
		return (
			<Dialog
				className="logoutDialog bp3-dark"
				autoFocus="true"
				isOpen={logoutPressed}
				onClose={() => setLogoutP(false)}
			>
				<h2>{t('dsh_logout_confirmation')}</h2>
				{t('dsh_logout_details')}
				<div className="logoutButtons">
					<Button style={{margin: '5px'}} intent={Intent.DANGER} onClick={() => setLogoutP(false)}>
						{t('dsh_logout_negative')}
					</Button>
					<Button style={{margin: '5px'}} intent={Intent.SUCCESS} onClick={logout}>
						{t('dsh_logout_positive')}
					</Button>
				</div>
			</Dialog>
		);
	};

	if (fM(adesState.auth.user).role === 'admin') {
		return (
			<>
				<LogoutConfirmation />
				<div className="dshSide">
					<Menu>
						<MenuItem className="animated flash slower infinite"
							icon="map" intent={Intent.PRIMARY}
							text={t('dsh_returnmap')}
							onClick={() => history.push('/')}/>
						<MenuItem icon="home"
							text={t('dsh_dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('app_changelanguage')}
							onClick={() => changeLanguage()}/>
						{S.isJust(adesState.auth.user) &&
						<>
							<MenuDivider title={fM(adesState.auth.user).firstName}/>
							<MenuItem icon="tick-circle" disabled text="Operator"/>
							<MenuItem icon="person" disabled text={fM(adesState.auth.user).email}/>
							<MenuItem icon="log-out" text={t('dsh_logout')} onClick={() => setLogoutP(true)}/>
						</>
						}
						{S.isNothing(adesState.auth.user) &&
						<>
							{/* TODO: Persist user information locally so that this never happens */}
							<MenuDivider/>
							<Spinner/>
						</>
						}

						<MenuDivider title="Operational Areas"/>
						<MenuItem icon="changes" text="Change active area"/>
						<MenuItem icon="circle" text="All operational areas"/>
						<MenuDivider title="Users"/>
						{/* <MenuItem icon="drive-time" text="Add new Operator"/> */}
						{/* <MenuItem icon="desktop" text="Add new Monitor"/> */}
						<MenuItem
							icon="user"
							text="All users"
							onClick={() => history.push('/dashboard/users')}/>
						<MenuDivider title="Operations"/>
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							text={t('dsh_operations_list')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuDivider title="Vehicles"/>
						<MenuItem icon="airplane" 
							text={t('dsh_vehicles_new')}
							onClick={() => history.push('/dashboard/vehicles/new')}/>
						<MenuItem icon="numbered-list"
							text={t('dsh_vehicles_list')}
							onClick={() => history.push('/dashboard/vehicles')}/>
					</Menu>
				</div>
			</>
		);
	} else if (fM(adesState.auth.user).role === 'pilot') {
		return (
			<>
				<LogoutConfirmation logoutPressed={logoutPressed} setLogoutPressed={setLogoutP} logout={logout}/>
				<div className="dshSide">
					<Menu>
						<MenuItem icon="home"
							text={t('dsh_dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('app_changelanguage')}
							onClick={() => changeLanguage()}/>
						{S.isJust(adesState.auth.user) &&
						<>
							<MenuDivider title={fM(adesState.auth.user).firstName}/>
							<MenuItem icon="tick-circle" disabled text="Pilot"/>
							<MenuItem icon="person" text={t('dsh_edit_your_info')} onClick={() => history.push('/dashboard/users/' + fM(adesState.auth.user).username)}/>
							<MenuItem icon="log-out" text={t('dsh_logout')} onClick={() => setLogoutP(true)}/>
						</>
						}
						{S.isNothing(adesState.auth.user) &&
						<>
							{/* TODO: Persist user information locally so that this never happens */}
							<MenuDivider/>
							<Spinner />
						</>
						}
						<MenuDivider title="Operations"/>
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							text={t('dsh_operations_list_pilot')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuDivider title="Vehicles"/>
						<MenuItem icon="airplane"
							text={t('dsh_vehicles_new')}
							onClick={() => history.push('/dashboard/vehicles/new')}/>
						<MenuItem icon="numbered-list"
							text={t('dsh_vehicles_list_pilot')}
							onClick={() => history.push('/dashboard/vehicles')}
						/>
					</Menu>
				</div>
			</>
		);
	} else {
		return (
			<div>
				test
			</div>
		);
	}
}

export default SideMenu;