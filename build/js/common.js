'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
	var Tags = function () {
		function Tags(config) {
			_classCallCheck(this, Tags);

			this._input = config.input;
			this._url = this._input.data('file');
			this._btn = this._input.siblings('.' + this._className().button.js);

			this._active = 'is-active';

			this._buildHtml();
		}

		_createClass(Tags, [{
			key: '_className',
			value: function _className() {
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
		}, {
			key: '_templates',
			value: function _templates() {
				var that = this;

				return {
					loop: function loop(tagName, className, info) {
						var arr = [];

						for (var i = 0; i < info.length; i++) {
							arr.push('<' + tagName + ' class="' + className + '">' + info[i] + '</' + tagName + '>');
						}

						return arr.join(' ');
					},
					list: function list(config) {
						return '\n\t\t\t\t\t\t<div class="' + that._className().dropdown.js + ' ' + that._className().dropdown.css + '">\n\t\t\t\t\t\t\t<div class="' + that._className().title.css + '">' + config.title + '</div>\n\t\t\t\t\t\t\t<ul class="' + that._className().list.js + ' ' + that._className().list.css + '">\n\t\t\t\t\t\t\t\t' + this.loop('li', '' + that._className().listItem.js, config.list) + '\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t';
					},
					tag: function tag(config) {
						return '\n\t\t\t\t\t\t<li class="' + that._className().tag.js + ' ' + that._className().tag.css + '">\n\t\t\t\t\t\t\t<i class="' + that._className().close.js + ' ' + that._className().close.css + '"></i>\n\t\t\t\t\t\t\t<span>' + config.text + '</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t';
					}
				};
			}
		}, {
			key: '_getInfo',
			value: function _getInfo(url, callback) {
				$.ajax({
					url: url,
					method: 'GET',
					success: function success(data) {
						callback(data);
					}
				});
			}
		}, {
			key: '_buildHtml',
			value: function _buildHtml() {
				var that = this,
				    className = that._className();

				this._getInfo(this._url, function (data) {
					//create main wrapper
					this._input.wrap('<div class="' + className.wrapper.js + '"></div>');
					this._wrap = this._input.closest('.' + className.wrapper.js);
					//create track
					this._input.wrap('<div class="' + className.track.js + ' ' + className.track.css + '"></div>');
					this._track = this._input.closest('.' + className.track.js);
					//create label
					this._input.wrap('<label class="' + className.label.js + ' ' + className.label.css + '"></label>');
					this._label = this._input.closest('.' + className.label.js);
					//create tagsList
					this._label.before('<ul class="' + className.tagList.css + ' ' + className.tagList.js + '"></ul>');
					this._tagList = this._track.find('.' + className.tagList.js);
					this._tagList.wrap('<div class="' + className.tagListWrap.js + ' ' + className.tagListWrap.css + '""></div>');
					//create list
					this._wrap.append(this._templates().list({
						title: this._input.data('title'),
						list: data.info
					}));

					this._dropdown = this._wrap.find('.' + className.dropdown.js);

					this._addOnChange();
					this._addTagOnClick();
					this._removeTagOnClick();
					this._removeOnChange();
					this._showOnClick();
					this._showOnFocus();
				}.bind(this));
			}
		}, {
			key: '_keyboard',
			value: function _keyboard() {
				return {
					enter: function enter(e) {
						return e.which === 13;
					},
					backspace: function backspace(e) {
						return e.which === 8;
					}
				};
			}
		}, {
			key: '_addTagOnClick',
			value: function _addTagOnClick() {
				var that = this,
				    className = that._className();

				this._dropdown.on('click', '.' + className.tag.js, function () {
					var _this = $(this),
					    val = _this.text().split(' ');

					that._addTag(val);
				});
			}
		}, {
			key: '_addOnChange',
			value: function _addOnChange() {
				var that = this;

				that._input.on({
					'change': function change() {
						var _this = $(this),
						    val = _this.val().split(' ');

						that._addTag(val);
						$(this).val('');
					},
					'keyup': function keyup(e) {
						if (that._keyboard().enter(e)) {
							$(this).trigger('change');
						}
					}
				});
			}
		}, {
			key: '_addTag',
			value: function _addTag(tags) {
				var that = this,
				    tagList = that._tagList;

				function check(value, callback) {
					var flag = false,
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

				tags.forEach(function (tag) {
					check(tag, function () {
						var currentTag = that._templates().tag({
							text: tag
						});

						$(currentTag).appendTo(tagList);
					});
				});
			}
		}, {
			key: '_removeTagOnClick',
			value: function _removeTagOnClick() {
				var that = this,
				    className = this._className();

				this._tagList.on('click', '.' + className.close.js, function () {
					that._removeTag($(this).parent('.' + className.tag.js));
				});
			}
		}, {
			key: '_removeOnChange',
			value: function _removeOnChange() {
				var that = this;

				that._input.on({
					'keyup': function keyup(e) {
						var val = $(this).val(),
						    tags = that._tagList.find('.' + that._className().tag.js);

						//check: if input is empty, if tags are exist, if button is backspace
						if (val.length <= 0 && tags.length && that._keyboard().backspace(e)) {
							var currentTag = tags.last();
							that._removeTag(currentTag);
						};
					}
				});
			}
		}, {
			key: '_removeTag',
			value: function _removeTag(item) {
				item.remove();
			}
		}, {
			key: '_showDropDown',
			value: function _showDropDown() {
				this._dropdown.addClass(this._active);
				this._btn.addClass(this._active);
			}
		}, {
			key: '_closeDropDown',
			value: function _closeDropDown() {
				this._dropdown.removeClass(this._active);
				this._btn.removeClass(this._active);
			}
		}, {
			key: '_showOnClick',
			value: function _showOnClick() {
				var that = this;

				that._btn.click(function () {
					var _this = $(this);
					if (_this.hasClass(that._active)) {
						that._closeDropDown();
					} else {
						that._showDropDown();
					}
					return false;
				});
			}
		}, {
			key: '_showOnFocus',
			value: function _showOnFocus() {
				var that = this;

				that._input.on({
					'focusin': function focusin() {
						that._showDropDown();
					},
					'blur': function blur() {
						that._closeDropDown();
					},
					'keyup': function keyup() {
						if ($(this).val().length <= 0) {
							that._closeDropDown();
						} else {
							that._showDropDown();
						};
					}
				});
			}
		}]);

		return Tags;
	}();

	;

	var tags = $('.js-input-tags');

	tags.each(function () {
		new Tags({
			input: $(this)
		});
	});
});