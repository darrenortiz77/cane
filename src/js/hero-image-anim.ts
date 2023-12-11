class HeroImageAnim {
	private img: HTMLImageElement;
	private allowAnim = false;
	private imgLoaded = false;
	private animPlayed = false;

	constructor(private elm: HTMLElement) {
		this.img = elm.querySelector<HTMLImageElement>('img')!;

		// Make sure the image is more or less visible before we allow the anim to play
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					obs.unobserve(elm);
					this.allowAnim = true;
					this.playAnim();
				}
			},
			{threshold: 0.75}
		);
		obs.observe(elm);

		// Wait for the image to be loaded before we allow the anim to play
		if (this.img.naturalWidth > 0) {
			this.onImgLoaded();
		} else {
			this.img.addEventListener('load', this.onImgLoaded.bind(this));
		}
	}

	private onImgLoaded() {
		this.imgLoaded = true;
		this.playAnim();
	}

	/**
	 * Only play once the image has loaded AND the element has scrolled on screen
	 */
	private playAnim() {
		if (!this.animPlayed && this.allowAnim && this.imgLoaded) {
			this.animPlayed = true;
			this.elm.classList.add('anim');
		}
	}
}

const elm = document.querySelector<HTMLElement>('.js-hero-img');
if (elm) {
	new HeroImageAnim(elm);
}

export default HeroImageAnim;
