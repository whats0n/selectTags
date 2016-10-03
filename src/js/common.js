
$(document).ready(function() {
	
	class Tags {

		constructor(config) {
			this._input = config.input;
			this._url = this._input.data('file');
			this._btn = this._input.siblings(`.${this._className().button.js}`);

			this._active = 'is-active';

			this._buildHtml();
		}

		_className() {
			return {
				button: {
					js: 'js-tags-button'
				},
				wrapper: {
					css: 'tags',
					js: 'js-tags'
				},
				label: {
					css: 'tags__label',
					js: 'js-tags-label'
				},
				title: {
					css: 'tags__title'
				},
				list: {
					css: 'tags__list',
					js: 'js-tags-list'
				},
				listItem: {
					js: 'js-tags-item'
				},
				dropdown: {
					css: 'tags__dropdown',
					js: 'js-tags-dropdown'
				},
				track: {
					css: 'tags__track',
					js: 'js-tags-track'
				},
				tagList: {
					css: 'tags__items',
					js: 'js-tags-items'
				},
				tagListWrap: {
					css: 'tags__items-wrap',
					js: 'js-tags-track-in'
				},
				tag: {
					css: 'tags__item',
					js: 'js-tags-item'
				},
				close: {
					css: 'tags__close',
					js: 'js-tags-close'
				}
			};
		}

		_templates() {
			let that = this;

			return {
				loop(tagName, className, info) {
					let arr = [];

					for (let i = 0; i < info.length; i++) {
						arr.push(`<${tagName} class="${className}">${info[i]}</${tagName}>`);
					}

					return arr.join(' ');
				},
				list(config) {
					return `
						<div class="${that._className().dropdown.js} ${that._className().dropdown.css}">
							<div class="${that._className().title.css}">${config.title}</div>
							<ul class="${that._className().list.js} ${that._className().list.css}">
								${this.loop('li', `${that._className().listItem.js}`, config.list)}
							</ul>
						</div>
					`;
				},
				tag(config) {
					return `
						<li class="${that._className().tag.js} ${that._className().tag.css}">
							<i class="${that._className().close.js} ${that._className().close.css}"></i>
							<span>${config.text}</span>
						</li>
					`;
				}
			};
		}

		_getInfo(url, callback) {
			$.ajax({
				url: url,
				method: 'GET',
				success: function(data) {
					callback(data);
				}
			})
		}

		_buildHtml() {
			let that = this,
				className = that._className();

			this._getInfo(this._url, function(data) {
				//create main wrapper
				this._input.wrap(`<div class="${className.wrapper.js}"></div>`);
				this._wrap = this._input.closest(`.${className.wrapper.js}`);
				//create track
				this._input.wrap(`<div class="${className.track.js} ${className.track.css}"></div>`);
				this._track = this._input.closest(`.${className.track.js}`);
				//create label
				this._input.wrap(`<label class="${className.label.js} ${className.label.css}"></label>`);
				this._label = this._input.closest(`.${className.label.js}`);
				//create tagsList
				this._label.before(`<ul class="${className.tagList.css} ${className.tagList.js}"></ul>`);
				this._tagList = this._track.find(`.${className.tagList.js}`);
				this._tagList.wrap(`<div class="${className.tagListWrap.js} ${className.tagListWrap.css}""></div>`);
				//create list
				this._wrap.append(this._templates().list({
					title: this._input.data('title'),
					list: data.info
				}));

				this._dropdown = this._wrap.find(`.${className.dropdown.js}`);

				this._addOnChange();
				this._addTagOnClick();
				this._removeTagOnClick();
				this._removeOnChange();
				this._showOnClick();
				this._showOnFocus();
			}.bind(this));
		}

		_keyboard() {
			return {
				enter: function(e) {
					return e.which === 13;
				},
				backspace: function(e) {
					return e.which === 8;
				}
			};
		}

		_addTagOnClick() {
			let that = this,
				className = that._className();

			this._dropdown.on('click', `.${className.tag.js}`, function() {
				let _this = $(this),
					val = _this.text().split(' ');

				that._addTag(val);
			});
		}

		_addOnChange() {
			let that = this;

			that._input.on({
				'change': function() {
					let _this = $(this),
						val = _this.val().split(' ');

					that._addTag(val);
					$(this).val('');
				},
				'keyup': function(e) {
					if (that._keyboard().enter(e)) {
						$(this).trigger('change');
					}
				}
			});
		}

		_addTag(tags) {
			let that = this,
				tagList = that._tagList;

			function check(value, callback) {
				let flag = false,
					items = tagList.find('li span');

				//check if tags exist - compare
				if (items.length > 0) {
					//check tag: if it olready exist - don't add
					for (var i = 0; i < items.length; i++) {
						if (value !== $(items[i]).text()) {
							flag = true;
						} else {
							flag = false;
							break;
						}
					};
				} else {
					flag = true;
				};

				//check if this tag is not exist and not empty
				if (flag === true && value.length) {
					callback();
				};
			}

			tags.forEach(function(tag) {
				check(tag, function() {
					let currentTag = that._templates().tag({
						text: tag
					});

					$(currentTag).appendTo(tagList);
				});
			});
		}

		_removeTagOnClick() {
			let that = this,
				className = this._className();

			this._tagList.on('click', `.${className.close.js}`, function() {
				that._removeTag($(this).parent(`.${className.tag.js}`));
			});
		}

		_removeOnChange() {
			let that = this;

			that._input.on({
				'keyup': function(e) {
					let val = $(this).val(),
						tags = that._tagList.find(`.${that._className().tag.js}`);

					//check: if input is empty, if tags are exist, if button is backspace
					if (val.length <= 0 && tags.length && that._keyboard().backspace(e)) {
						let currentTag = tags.last();
						that._removeTag(currentTag);
					};
				}
			});
		}

		_removeTag(item) {
			item.remove();
		}

		_showDropDown() {
			this._dropdown.addClass(this._active);
			this._btn.addClass(this._active);
		}

		_closeDropDown() {
			this._dropdown.removeClass(this._active);
			this._btn.removeClass(this._active);
		}

		_showOnClick() {
			let that = this;

			that._btn.click(function() {
				let _this = $(this);
				if (_this.hasClass(that._active)) {
					that._closeDropDown();
				} else {
					that._showDropDown();
				}
				return false;
			});
		}

		_showOnFocus() {
			let that = this;

			that._input.on({
				'focusin': function() {
					that._showDropDown();
				},
				'blur': function() {
					that._closeDropDown();
				},
				'keyup': function() {
					if ($(this).val().length <= 0) {
						that._closeDropDown();
					} else {
						that._showDropDown();
					};
				}
			});
		}

	};

	let tags = $('.js-input-tags');

	tags.each(function() {
		new Tags({
			input: $(this)
		});
	});

});