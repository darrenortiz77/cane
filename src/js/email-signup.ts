// TODO: a sessionStorage variable to not show the form on every page if they've already signed up

enum States {
	Default,
	InError,
	Success,
}

class EmailSignupForm {
	private formElm: HTMLFormElement;
	private input: HTMLInputElement;
	private state = States.Default;

	constructor(private elm: HTMLElement) {
		this.formElm = elm.querySelector<HTMLFormElement>('.js-email-form')!;
		this.input = document.getElementById('email-input')! as HTMLInputElement;

		this.input.addEventListener('input', this.onInputChange.bind(this));
		this.formElm.addEventListener('submit', this.onSubmit.bind(this));
	}

	/**
	 * If they're typing and we've already shown them an error,
	 * remove the error as soon as the input is valid.
	 */
	private onInputChange() {
		// TODO: throttling this would be nice, but probably too much of a pre-optimization
		if (this.state === States.InError && (this.isValid() || this.input.value.trim() === '')) {
			this.updateState(States.Default);
		}
	}

	/**
	 * Check if the email input is valid.
	 * Purposely disables automatic HTML5 validation because I don't like
	 * the built-in browser error notification.
	 * @returns boolean
	 */
	private isValid() {
		const val = this.input.value.trim();
		return val.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i);
	}

	/**
	 * Upon submitting the form,
	 * check its validity
	 */
	private onSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (this.isValid()) {
			// TODO: actual AJAX submission
			this.updateState(States.Success);
		} else {
			this.updateState(States.InError);
		}
	}

	/**
	 * Render the view according to the current state the form is in.
	 * @param newState What state we should be in
	 */
	private updateState(newState: States) {
		this.state = newState;

		switch (this.state) {
			case States.Default:
				this.elm.classList.remove('in-error');
				this.elm.classList.remove('success');
				break;
			case States.InError:
				this.elm.classList.add('in-error');
				this.elm.classList.remove('success');
				break;
			case States.Success:
				this.elm.classList.remove('in-error');
				this.elm.classList.add('success');
				break;
		}
	}
}

const elm = document.querySelector<HTMLElement>('.js-email-form-ctn');

if (elm) {
	new EmailSignupForm(elm);
}

export default EmailSignupForm;
