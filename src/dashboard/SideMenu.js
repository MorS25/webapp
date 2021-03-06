import React, {useState} from 'react';
import '../Ades.css';
import {Menu, MenuDivider, MenuItem, Intent, Spinner, Dialog, Button} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import useAdesState from '../state/AdesState.js';
import S from 'sanctuary';
import {fM} from '../libs/SaferSanctuary';
import {useCookies} from 'react-cookie';
import {useTranslation} from 'react-i18next';
import styles from './Dashboard.module.css';
import {adesVersion} from '../consts';

function SideMenu() {
	const history = useHistory();
	const { t, i18n } = useTranslation(['dashboard', 'glossary']);

	/* Auth */
	const [, setCookie, removeCookie] = useCookies(['jwt']);
	const [adesState, adesActions] = useAdesState();
	const [logoutPressed, setLogoutP] = useState(false);

	const logout = () => {
		removeCookie('user', {path: '/'});
		removeCookie('jwt', {path: '/'});
		adesActions.auth.logout();
	};

	const changeLanguage = () => {
		if (i18n.language === 'en') {
			setCookie('lang', 'es', {path: '/'});
			i18n.changeLanguage('es');
		} else {
			setCookie('lang', 'en', {path: '/'});
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
				<h2>{t('sidemenu.logout_confirmation')}</h2>
				{t('sidemenu.logout_details')}
				<div className="logoutButtons">
					<Button style={{margin: '5px'}} intent={Intent.DANGER} onClick={() => setLogoutP(false)}>
						{t('sidemenu.logout_negative')}
					</Button>
					<Button style={{margin: '5px'}} intent={Intent.SUCCESS} onClick={logout}>
						{t('sidemenu.logout_positive')}
					</Button>
				</div>
			</Dialog>
		);
	};

	if (S.isJust(adesState.auth.user) && fM(adesState.auth.user).role === 'admin') {
		return (
			<>
				<LogoutConfirmation />
				<div className={styles.side}>
					<Menu>
						<MenuItem className="animated flash slower infinite"
							icon="map" intent={Intent.PRIMARY}
							text={t('sidemenu.returnmap')}
							onClick={() => history.push('/')}/>
						<MenuItem icon="home"
							text={t('sidemenu.dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('sidemenu.changelanguage')}
							onClick={() => changeLanguage()}/>
						{S.isJust(adesState.auth.user) &&
						<>
							<MenuDivider title={fM(adesState.auth.user).firstName}/>
							<MenuItem icon="person" disabled text={fM(adesState.auth.user).email}/>
							<MenuItem icon="log-out" text={t('sidemenu.logout')} onClick={() => setLogoutP(true)}/>
						</>
						}
						{S.isNothing(adesState.auth.user) &&
						<>
							{/* TODO: Persist user information locally so that this never happens */}
							<MenuDivider/>
							<Spinner/>
						</>
						}

						<MenuDivider title={t('glossary:users.plural_generic')} />
						{/* <MenuItem icon="drive-time" text="Add new Operator"/> */}
						{/* <MenuItem icon="desktop" text="Add new Monitor"/> */}
						<MenuItem
							icon="user"
							text={t('sidemenu.all_users')}
							onClick={() => history.push('/dashboard/users')}/>
						<MenuItem
							icon="new-person"
							text={t('sidemenu.new_user.text')}
							onClick={() => history.push('/dashboard/users/new')}/>
						<MenuDivider title={t('glossary:operations.plural_generic')}/>
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							text={t('sidemenu.operations_list')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuDivider title={t('glossary:vehicles.plural_generic')} />
						{/* As of 0.2 removed as vehicles have owners now...
						 	<MenuItem icon="airplane"
							text={t('sidemenu.vehicles_new')}
							onClick={() => history.push('/dashboard/vehicles/new')}/> */}
						<MenuItem icon="numbered-list"
							text={t('sidemenu.vehicles_list')}
							onClick={() => history.push('/dashboard/vehicles')}/>
						<MenuItem text={'PortableUTM WebApp v' + adesVersion} disabled={true}/>
					</Menu>
				</div>
			</>
		);
	} else if (S.isJust(adesState.auth.user) &&  fM(adesState.auth.user).role === 'pilot') {
		return (
			<>
				<LogoutConfirmation logoutPressed={logoutPressed} setLogoutPressed={setLogoutP} logout={logout}/>
				<div className={styles.side}>
					<Menu>
						<MenuItem icon="home"
							text={t('sidemenu.dshhome')}
							onClick={() => history.push('/dashboard')}/>
						<MenuItem icon="flag"
							text={t('sidemenu.changelanguage')}
							onClick={() => changeLanguage()}/>
						{S.isJust(adesState.auth.user) &&
						<>
							<MenuDivider title={fM(adesState.auth.user).firstName}/>
							<MenuItem icon="tick-circle" disabled text="Pilot"/>
							<MenuItem icon="person" text={t('sidemenu.edit_your_info')} onClick={() => history.push('/dashboard/users/' + fM(adesState.auth.user).username)}/>
							<MenuItem icon="log-out" text={t('sidemenu.logout')} onClick={() => setLogoutP(true)}/>
						</>
						}
						{S.isNothing(adesState.auth.user) &&
						<>
							{/* TODO: Persist user information locally so that this never happens */}
							<MenuDivider/>
							<Spinner />
						</>
						}
						<MenuDivider title={t('glossary:operations.plural_generic')} />
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							text={t('sidemenu.operations_list_pilot')}
							onClick={() => history.push('/dashboard/operations')}/>
						<MenuDivider title={t('glossary:vehicles.plural_generic')}/>
						<MenuItem icon="airplane"
							text={t('sidemenu.vehicles_new')}
							onClick={() => history.push('/dashboard/vehicles/new')}/>
						<MenuItem icon="numbered-list"
							text={t('sidemenu.vehicles_list_pilot')}
							onClick={() => history.push('/dashboard/vehicles')}
						/>
						<MenuItem text={'PortableUTM WebApp v' + adesVersion} disabled={true}/>
					</Menu>
				</div>
			</>
		);
	} else {
		return (
			<div>
				<div className={styles.side}>
					<Menu>
						<MenuItem
							className='bp3-skeleton'
							disabled={true}
							icon="map" intent={Intent.PRIMARY}
							text={'Loading'}
						/>
						<MenuItem
							className='bp3-skeleton'
							disabled={true}
							icon="map" intent={Intent.PRIMARY}
							text={'Loading'}
						/>
						<MenuItem
							className='bp3-skeleton'
							disabled={true}
							icon="map" intent={Intent.PRIMARY}
							text={'Loading'}
						/>
						<>
							<MenuDivider title='User'/>
							<MenuItem className='bp3-skeleton' icon="tick-circle" disabled text="Operator"/>
							<MenuItem className='bp3-skeleton' icon="person" disabled text='Text'/>
							<MenuItem className='bp3-skeleton' icon="log-out" text='Text' />
						</>

						<MenuDivider title="Operational Areas"/>
						<MenuItem className='bp3-skeleton' icon="changes" text="Change active area"/>
						<MenuItem className='bp3-skeleton' icon="circle" text="All operational areas"/>
						<MenuDivider title="Users"/>
						{/* <MenuItem icon="drive-time" text="Add new Operator"/> */}
						{/* <MenuItem icon="desktop" text="Add new Monitor"/> */}
						<MenuItem
							icon="user"
							className='bp3-skeleton'
							text="All users"
							onClick={() => history.push('/dashboard/users')}/>
						<MenuDivider title="Operations"/>
						{/* <MenuItem icon="zoom-in" text="Pending assesment"/> */}
						<MenuItem icon="numbered-list"
							className='bp3-skeleton'
							text={t('sidemenu.operations_list')}
						/>
						<MenuDivider title="Vehicles"/>
						<MenuItem icon="airplane"
							className='bp3-skeleton'
							text={t('sidemenu.vehicles_new')}
						/>
						<MenuItem icon="numbered-list"
							className='bp3-skeleton'
							text={t('sidemenu.vehicles_list')}
						/>
						<MenuItem text={'PortableUTM WebApp v' + adesVersion} disabled={true}/>
					</Menu>
				</div>
			</div>
		);
	}
}

export default SideMenu;