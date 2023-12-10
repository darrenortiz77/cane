type NavState = {
	isStuck: boolean;
	isMobile: boolean;
	isMobileOpen: boolean;
};
class Nav {
	// TODO: pass this width in from the CSS somehow to avoid the duplication
	static DESKTOP_MEDIA_QUERY = '(min-width: 1200px)';

	private state: NavState = {
		isStuck: false,
		isMobile: false,
		isMobileOpen: false,
	};
	private hamburger: HTMLButtonElement;
	private onKeyDownBound: (e: KeyboardEvent) => void;
	private interactiveElms: Array<HTMLAnchorElement | HTMLButtonElement>;
	private mediaQuery: MediaQueryList;

	constructor(private elm: HTMLElement) {
		this.hamburger = elm.querySelector<HTMLButtonElement>('.js-hamburger')!;
		this.onKeyDownBound = this.onKeyDown.bind(this);
		this.interactiveElms = Array.from(elm.querySelectorAll('button, a'));

		// Watch for click events of the hamburger button
		this.hamburger.addEventListener('click', this.toggleNav.bind(this));

		// Watch the current scroll position (not actually a scroll event though)
		this.watchNavScrollPosition();

		// Check for breakpoint changes
		this.mediaQuery = window.matchMedia(Nav.DESKTOP_MEDIA_QUERY);
		this.onBreakpointChange();
		window.matchMedia(Nav.DESKTOP_MEDIA_QUERY).onchange = this.onBreakpointChange.bind(this);
	}

	/**
	 * Watch for breakpoint changes and update the state accordingly
	 */
	onBreakpointChange() {
		this.updateState({isMobile: !this.mediaQuery.matches});
	}

	/**
	 * Watch the scroll position of the page.
	 * (Technically we're just watching an invisible, single-pixel div
	 * to see if we're at the top of the page or not).
	 * If we're not scrolled to the top, make the nav "sticky".
	 */
	private watchNavScrollPosition() {
		const observerTarget = document.createElement('div');
		observerTarget.classList.add('nav-scroll-observer');
		document.body.prepend(observerTarget);

		const obs = new IntersectionObserver((entries) => {
			const shouldStick = !entries[0].isIntersecting;
			this.updateState({isStuck: shouldStick});
		});
		obs.observe(observerTarget);
	}

	/**
	 * Toggle mobile nav open/closed.
	 */
	private toggleNav() {
		this.updateState({isMobileOpen: !this.state.isMobileOpen});
	}

	/**
	 * Monitor key presses so we can:
	 * a) close the mobile nav if they hit the Esc key
	 * b) trap keyboard focus to within the nav if it's open
	 * @param e
	 */
	private onKeyDown(e: KeyboardEvent) {
		// Escape key == close nav
		if (e.key === 'Escape' || e.key === 'Esc') {
			this.updateState({isMobileOpen: false});
			this.hamburger.focus();

			// Tab key == trap focus
		} else if (e.key === 'Tab') {
			const currentFocus = document.activeElement;
			if (currentFocus) {
				let idx = this.interactiveElms.indexOf(currentFocus as HTMLAnchorElement);
				if (idx !== -1) {
					e.preventDefault();
					idx = e.shiftKey ? idx - 1 : idx + 1;
					if (idx < 0) {
						idx = this.interactiveElms.length - 1;
					} else if (idx >= this.interactiveElms.length) {
						idx = 0;
					}
					this.interactiveElms[idx].focus();
				}
			}
		}
	}

	/**
	 * Change some aspect of the state object and re-render accordingly.
	 * @param newState
	 */
	private updateState(newState: Partial<NavState>) {
		const stateNow = {
			...this.state,
			...newState,
		};

		if (this.state.isStuck !== stateNow.isStuck) {
			if (stateNow.isStuck) {
				this.stick();
			} else {
				this.unstick();
			}
		}

		if (this.state.isMobile !== stateNow.isMobile) {
			this.elm.setAttribute('aria-haspopup', String(stateNow.isMobile));

			if (!stateNow.isMobile) {
				stateNow.isMobileOpen = false;
				this.closeMobileNav();
			}
		}

		if (this.state.isMobileOpen !== stateNow.isMobileOpen) {
			if (stateNow.isMobileOpen) {
				this.openMobileNav();
			} else {
				this.closeMobileNav();
			}
		}

		this.state = stateNow;
	}

	/**
	 * Make the nav sticky
	 */
	private stick() {
		this.elm.classList.add('stuck');
	}

	/**
	 * Unstick the nav and show it in its default state
	 */
	private unstick() {
		this.elm.classList.remove('stuck');
	}

	/**
	 * Open the mobile nav
	 */
	private openMobileNav() {
		this.elm.classList.add('mobile-open');
		this.elm.setAttribute('aria-expanded', 'true');
		window.addEventListener('keydown', this.onKeyDownBound);
	}

	/**
	 * Close the mobile nav
	 */
	private closeMobileNav() {
		this.elm.classList.remove('mobile-open');
		this.elm.setAttribute('aria-expanded', 'false');
		window.removeEventListener('keydown', this.onKeyDownBound);
	}
}

const navElm = document.querySelector<HTMLElement>('.js-nav');
if (navElm) {
	new Nav(navElm);
}

export default Nav;
