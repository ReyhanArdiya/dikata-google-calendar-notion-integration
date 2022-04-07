/**
 * A class where you can pass an async `watchingFn` that will be called and
 * the awaited result will be passed to `asyncCb` as the first and only argument
 * for every `ms` interval.
 */
class Watcher {
	#asyncCb = null;
	#catchingFn = null;
	#isRunning = false;
	#ms = null;
	#timeoutTimer = null;
	#watchingFn = null;

	/**
	 * When this method is called, {@link watchingFn} will be called
	 * and awaited; then it will call {@link asyncCb} with the awaited result passed
	 * in as the first and only argument.
	 */
	 async #watch() {
		try {
			await this.#asyncCb(await this.#watchingFn());
		} catch (err) {
			this.#catchingFn(err);
		}
	}

	// Run the `watch`, then AFTER it is FINISHED, we run it again. I don't use
	// setInterval here since I want to make sure that the previous processs is finished
	// before running it again.
	async #runWatcher() {
		if (this.#isRunning) {
			this.#timeoutTimer = setTimeout(async () => {
				await this.#watch();
				this.#runWatcher();
			}, this.#ms);
		}
	}

	/**
	 *
	 * @param {() => Promise<any>} watchingFn
	 *
	 * @param {(watchingFnRes : any) => Promise<any>} asyncCb
	 *
	 * @param {(err: Error) => void} catchingFn
	 *
	 * @param {number} ms
	 */
	constructor(watchingFn, asyncCb, catchingFn, ms) {
		this.#watchingFn = watchingFn;
		this.#asyncCb = asyncCb;
		this.#catchingFn = catchingFn;
		this.#ms = ms;
	}

	/**
	 * Activates this {@link Watcher} by setting an interval that will call
	 * the `watch` method every {@link ms}.
	 * - If this {@link Watcher} is already activated, this method returns `false` and
	 * does not set a new interval.
	 * - If this method successfully activates this {@link Watcher}, it returns
	 * this {@link Watcher}'s {@link timeoutTimer}
	 *
	 * @param {boolean} doOnce If true, calls the `watch` method once
	 * on startup before setting the interval.
	 */
	async activate(doOnce = false) {
		if (this.#isRunning) {
			return false;
		}

		if (doOnce) {
			await this.#watch();
		}

		this.#isRunning = true;
		this.#runWatcher();
		return this.#timeoutTimer;
	}

	/**
	 * Deactivates this {@link Watcher}.
	 * - If there is no timer, this method returns `false`.
	 * - If this method successfully deactivates this {@link Watcher}, it returns
	 * `true`.
	 *
	 * @param {boolean} doOnce If true, calls the `watch` method once
	 * before deactivating the `Watcher`.
	 */
	async deactivate(doOnce = false) {
		if (!this.#isRunning) {
			return false;
		}

		if (doOnce) {
			await this.#watch();
		}

		clearTimeout(this.#timeoutTimer);
		this.#isRunning = false;
		this.#timeoutTimer = null;
		return true;
	}

	get ms() {
		return this.#ms;
	}

	set ms(ms) {
		this.#ms = ms;
	}

	get watchingFn() {
		return this.#watchingFn;
	}

	set watchingFn(watchingFn) {
		this.#watchingFn = watchingFn;
	}

	get asyncCb() {
		return this.#asyncCb;
	}

	set asyncCb(asyncCb) {
		this.#asyncCb = asyncCb;
	}

	get catchingFn() {
		return this.#catchingFn;
	}

	set catchingFn(catchingFn) {
		this.#catchingFn = catchingFn;
	}

	get timeoutTimer() {
		return this.#timeoutTimer;
	}

	get isRunning() {
		return this.#isRunning;
	}
}

export default Watcher;