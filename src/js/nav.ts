class Nav {
	isStuck = false;

	constructor(private elm: HTMLElement) {
		const observerTarget = document.createElement('div');
		observerTarget.classList.add('nav-scroll-observer');
		document.body.prepend(observerTarget);

		const obs = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				this.unstick();
			} else {
				this.stick();
			}
		});
		obs.observe(observerTarget);
	}

	private stick() {
		this.isStuck = true;
		this.elm.classList.add('stuck');
	}

	private unstick() {
		this.isStuck = false;
		this.elm.classList.remove('stuck');
	}
}

const navElm = document.querySelector<HTMLElement>('.js-nav');
if (navElm) {
	new Nav(navElm);
}

export default Nav;
