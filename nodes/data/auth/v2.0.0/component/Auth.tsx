import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import type { Props } from '../node/definition';
import type { BaseReactProps } from '@shared/node-v1.0.0';

// memo для того, чтобы не реагировать на изменяющиеся логин/пароль при печати.
export default memo(
	forwardRef(function (p: Props & BaseReactProps, ref) {
		const [signedIn, setSignedIn] = useState(false);

		// Примем внешние сигналы.
		useImperativeHandle(
			ref,
			() => ({
				async signIn() {
					// Авторизуем пользователя, переключив флаг, чтобы авторизация произошла у лидера по подписке.
					await R.db?.states.auth.set('username', () => p.username);
					await R.db?.states.auth.set('password', () => p.password);
					await R.db?.states.auth.set('signIn', () => true);
				},
				setSignInState(signedInState: boolean) {
					if (signedInState !== signedIn) setSignedIn(signedInState);
				},
			}),
			[p, signedIn]
		);

		return <>{signedIn ? p.children : null}</>;
	})
);
