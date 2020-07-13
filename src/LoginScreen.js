import React, {useEffect, useState} from 'react';
import {Button, Card, Elevation, FormGroup, InputGroup, Intent} from '@blueprintjs/core';

import S from 'sanctuary';
import {useTranslation} from 'react-i18next';
import {useCookies} from 'react-cookie';

/* Internal */
import useAdesState from './state/AdesState.js';
import {DEBUG} from './consts';
import logo from './images/logo.png';
import background from './images/bg.jpg';
import styles from './LoginScreen.module.css';
import * as classnames from 'classnames';

function LoginScreen() {
	const [adesState, adesActions] = useAdesState();
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [isError, setError] = useState(false);
	const [isLogging, setLogging] = useState(false);
	const { t, i18n } = useTranslation();
	const [, setCookie, ] = useCookies(['jwt']);

	/* Callbacks */
	const okCallback = () => {};
	const badCallback = () => {setLogging(false); setError(true);};

	useEffect(() => {
		setError(false);
	}, [user, password]);

	const login = (evt) => {
		evt.preventDefault();
		setLogging(true);
		adesActions.auth.login(user, password, okCallback, badCallback);
	};

	useEffect(() => {
		if (!DEBUG) {
			if (navigator.language.substring(0, 2) === 'es') {
				setCookie('lang', 'es', {path: '/'});
				i18n.changeLanguage('es');
			} else {
				setCookie('lang', 'en', {path: '/'});
				i18n.changeLanguage('en');
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/* img from https://pixabay.com/photos/airport-building-sun-weather-sky-1682067/ */
	return (
		<>
			<img
				ref={(img) => {
					if (!img) { return; }
					const image = img;
					const finishedLoading = () => {
						image.style.transition = 'all 1s linear';
						image.style.opacity = '1';
					};
					image.onload = finishedLoading;
					if (image.complete) {
						finishedLoading();
					}
				}}
				className={styles.background}
				alt="Background" src={background}
			/>
			<form onSubmit={login} className={styles.centeredScreen}>
				<Card className={styles.window} elevation={Elevation.ONE}>
					<div className={styles.logoWrapper}>
						<img className={styles.logo} alt="PortableUTM" src={logo} />
					</div>
					<h3>{t('login.pleaselogin')}</h3>
					<FormGroup
						helperText={t('login.user_helper')}
						label={t('user.username')}
						labelFor="login-user"
					>
						<InputGroup id="login-user" fill
							value={user}
							disabled={isLogging}
							onChange={(evt) => setUser(evt.target.value)}/>
					</FormGroup>
					<FormGroup
						helperText={t('login.password_helper')}
						label={t('app.password')}
						labelFor="login-password"
					>
						<InputGroup id="login-password" fill type="password"
							value={password}
							disabled={isLogging}
							onChange={(evt) => setPassword(evt.target.value)}/>
					</FormGroup>
					<div className={styles.buttonArea}>
						<Button style={{margin: '5px'}} intent={Intent.PRIMARY}
							type="submit"
							onClick={login}>
							{t('login.login')}
						</Button>
					</div>
				</Card>
				{isError &&
				<Card className={classnames('bp3-dark',styles.error,'animated flash')} elevation={Elevation.TWO}>
					{t('login.login_error')}
				</Card>
				}
				{isLogging &&
				<Card className={classnames('bp3-dark',styles.error,'animated fadeIn')} elevation={Elevation.TWO}>
					{t('login.login_pleasewait')}
				</Card>
				}
				{ S.isJust(adesState.auth.token) &&
				<Card className={classnames('bp3-dark',styles.successful,'animated fadeIn')} elevation={Elevation.TWO}>
					{t('login.login_successful')}
				</Card>
				}
			</form>
		</>
	);
}

export default LoginScreen;