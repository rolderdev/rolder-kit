import systemLoaderAnimation from '@shared/system-loader-animation-v0.2.0'
import { forwardRef, memo, useImperativeHandle } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import type { Props } from '../node/definition'

function FallbackComponent({ error }: { error: Error }) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: 'white',
				padding: 64,
			}}
		>
			<h2 style={{ color: 'red' }}>Системная ошибка!</h2>
			<h3>{error.message}</h3>
			<img
				src="error.jpg"
				alt="Error illustration"
				style={{
					display: 'block',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: 64,
					width: '50%',
				}}
			/>
		</div>
	)
}
// memo для того, чтобы не реагировать на изменяющиеся логин/пароль при печати.
export default memo(
	forwardRef((p: Props, ref) => {
		// Завершим анимацию.
		systemLoaderAnimation.stop()
		// Изменим реактивное состояние инициализации приложения.
		R.states.init.value = 'initialized'

		// Примем внешние сигналы.
		useImperativeHandle(
			ref,
			() => ({
				async signIn() {
					// Авторизуем пользователя, переключив флаг, чтобы авторизация произошла у лидера по подписке.
					await R.db.states.auth.set('username', () => p.username)
					await R.db.states.auth.set('password', () => p.password)
					await R.db.states.auth.set('signIn', () => true)
				},
			}),
			[p]
		)

		return (
			<ErrorBoundary FallbackComponent={FallbackComponent}>
				<div
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					{p.children}
				</div>
			</ErrorBoundary>
		)
	})
)
