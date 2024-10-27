import { useForm } from '@mantine/form'
import { useId } from '@mantine/hooks'
import { sendOutput, sendSignal } from '@packages/port-send'
import { FormMolecule, FormScope, type FormValues } from '@packages/scope'
import { ScopeProvider, useMolecule } from 'bunshi/react'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const formId = useId()
	const formHook = useMolecule(FormMolecule, { withScope: [FormScope, formId] })

	function Form(formScheme: FormValues) {
		const form = useForm<FormValues>(formScheme)
		formHook.set(form)
		sendOutput(props.noodlNode, 'formHook', form)

		return (
			<ScopeProvider scope={FormScope} value={formId}>
				<form onSubmit={form.onSubmit(() => sendSignal(props.noodlNode, 'submited'))} style={props.style}>
					{props.children}
				</form>
			</ScopeProvider>
		)
	}

	return props.formScheme ? <Form {...props.formScheme} /> : null
})
