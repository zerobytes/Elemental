var Elemental = (function () {
	function $addEvent(evnt, elem, func) {
		if (elem.addEventListener)  // W3C DOM
			elem.addEventListener(evnt, func, false);
		else if (elem.attachEvent) { // IE DOM
			elem.attachEvent("on" + evnt, func);
		}
		else { // No much to do
			elem[evnt] = func;
		}
	}
	var $element_test = document.createElement('div');
	var $matches_selector = $element_test.matches || $element_test.webkitMatchesSelector || $element_test.mozMatchesSelector || $element_test.msMatchesSelector;
	var $new = function (list) {
		list = list instanceof Array ? list : ((list == undefined) ? [] : [list]);
		var $items = {
			add: function (item) {
				if (item.get == undefined) {
					item = Elemental.new(item);
				}
				for (i = 0; i < list.length; i++) {
					list[i].appendChild(item.get(0));
				}
				return item.get(0);
			},
			bulk: function (items) {
				var items_list = [];
				for (i in items) {
					items_list[items_list.length] = $items.add(items[i]);
				}
				return items_list;
			}
		};

		return {
			//Returns dom object
			get: function (index) {
				var return_list = [];
				for (i = 0; i < list.length; i++) {
					return_list[return_list.length] = list[i];
				}
				return index == undefined ? return_list : return_list[index];
			},
			toString:function(){
				return Elemental.new({}).append(this).get(0).innerHTML;
			},
			find: function (selector) {
				var return_list = [], query;
				for (i = 0; i < list.length; i++) {
					if (!list[i].querySelectorAll) continue;
					query = list[i].querySelectorAll(selector);
					for (i = 0; i < query.length ; i++) {
						return_list[return_list.length] = query[i];
					}
				}
				return $new(return_list);
			},
			append: function (item) {
				if (item instanceof Array) {
					return $items.bulk(item);
					return this;
				}
				return $new($items.add(item));
			},
			attr: function (attr, value) {
				if (attr == undefined) {
					return list[0].attributes;
				}
				if (value == undefined) {
					return list[0].getAttribute(attr);
				}
				if (typeof value == 'boolean') {
					return this.conditionalAttribute(attr, attr, value);
				}
				for (i = 0; i < list.length; i++) {
					list[i].setAttribute(attr, value);
				}
				return this;
			},
			height: function () {
				return list[0].clientHeight;
			},
			width: function () {
				return list[0].clientWidth;
			},
			scrollTop: function (scroll) {
				return scroll == undefined ? list[0].scrollTop : list[0].scrollTop = parseInt(scroll) + 'px';
			},
			scrollLeft: function (scroll) {
				return scroll == undefined ? list[0].scrollLeft : list[0].scrollLeft = parseInt(scroll) + 'px';
			},
			hasClass: function (className, index) {
				if (index != undefined) return new RegExp(' ' + className + ' ').test(' ' + list[index].className + ' ');
				for (i = 0; i < list.length; i++) {
					return new RegExp(' ' + className + ' ').test(' ' + list[i].className + ' ');
				}
			},
			addClass: function (className) {
				//Will proc only the first
				for (i = 0; i < list.length; i++) {
					if (!this.hasClass(className, i)) {
						list[i].className += ' ' + className;
					}
				}
				return this;
			},
			removeClass: function (className) {
				for (i = 0; i < list.length; i++) {
					var newClass = ' ' + list[i].className.replace(/[\t\r\n]/g, ' ') + ' ';
					if (this.hasClass(className, i)) {
						while (newClass.indexOf(' ' + className + ' ') >= 0) {
							newClass = newClass.replace(' ' + className + ' ', ' ');
						}
						list[i].className = newClass.replace(/^\s+|\s+$/g, ' ');
					}
				}
				return this;
			},
			toggleClass: function (className) {
				for (i = 0; i < list.length; i++) {
					var newClass = ' ' + list[i].className.replace(/[\t\r\n]/g, " ") + ' ';
					if (this.hasClass(className, i)) {
						while (newClass.indexOf(" " + className + " ") >= 0) {
							newClass = newClass.replace(" " + className + " ", " ");
						}
						list[i].className = newClass.replace(/^\s+|\s+$/g, ' ');
					} else {
						this.className += ' ' + className;
					}
				}
				return this;
			},
			css: function (property, value) {
				for (i = 0; i < list.length; i++) {
					if (property instanceof Array) {
						for (prop in property) {
							list[i].style[prop] = property[i][prop];
						}
						return;
					}
					if (typeof value == 'undefined') return list[i].style[property];
					list[i].style[property] = value;
				}
				return this;
			},
			is: function (prop) {
				prop = Elemental.trim(prop);
				//attribute
				switch (prop[0]) {
					case ':':
						switch (prop) {
							case ':visible':
								return !(list[0].offsetParent === null);
								break;
						}
						break;
					case '[':
					case '.':
					case '#':
						return Elemental.matchSelector(list[0], prop);
						break;
				}
			},
			//Goes to N levels of parent elements
			skipOut: function (levels) {
				var return_element = this, level = 0;

				while (return_element && level < levels) {
					return_element = return_element.parent();
					level++;
				}
				return return_element;
			},
			parent: function (selector) {
				function collectionHas(a, b) { //helper function (see below)
					for (var i = 0, len = a.length; i < len; i++) {
						if (a[i] == b) return true;
					}
					return false;
				}
				function findParentBySelector(elm, selector) {
					var all = document.querySelectorAll(selector);
					var cur = elm.parentElement;
					while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
						cur = cur.parentElement; //go up
					}
					return cur;
				}
				var return_list = [];
				for (i = 0; i < list.length; i++) {
					return_list[return_list.length] = (selector == undefined) ? list[i].parentElement : findParentBySelector(list[i], selector);
				}
				return $new(return_list);
			},
			focus: function () {
				if (list[0]) list[0].focus();
				return this;
			},
			blur: function () {
				if (list[0]) list[0].blur();
				return this;
			},
			next: function (selector) {
				if (!selector) return $new(list[0].nextElementSibling || list[0].nextSibling);
				return Elemental.find(selector).index(this.index() + 1);
			},
			prev: function (selector) {
				if (!selector) return $new(list[0].previousElementSibling || list[0].previousSibling);
				var index = this.index(selector);
				var element = Elemental.find(selector).index(index - 1);
				return element ? $new(element) : $new({});
			},
			index: function (selector) {
				if (typeof selector == 'string') {
					var elements = this.parent().find(selector).get();
					for (i = 0; i < elements.length; i++) {
						if (elements[i] == list[0]) return i;
					}
					return false;
				}
				if (typeof selector == 'number') {
					return typeof list[selector] != 'undefined' ? list[selector] : false;
				}
				var return_list = [],
					node = list[0].parentNode.firstChild,
					index = 0;
				while (node) {
					if (node == list[0]) return index;
					index++;
					node = node.nextElementSibling || node.nextSibling;
				}
				return false;
			},
			siblings: function () {
				var return_list = [],
					node = list[0].parentNode.firstChild;
				while (node && node.nodeType === 1) {
					if (node != list[0]) return_list.push(node);
					node = node.nextElementSibling || node.nextSibling;
				}
				return return_list;
			},
			show: function () {
				for (i = 0; i < list.length; i++) {
					list[i].style.display = 'block';
				}
				return this;
			},
			hide: function () {
				for (i = 0; i < list.length; i++) {
					list[i].style.display = 'none';
				}
				return this;
			},
			toggle: function () {
				if (this.is('visible')) {
					this.hide();
					return;
				}
				this.show();
				return this;
			},
			remove: function () {
				for (i = 0; i < list.length; i++) {
					var p = list[i].parentNode;
					p.removeChild(list[i]);
				}
				return true;
			},
			on: function (event, fnCallback) {
				for (i = 0; i < list.length; i++) {
					$addEvent(event, list[i], fnCallback);
				}
				return this;
			},
			size: function () {
				return list.length;
			},
			//Add or remove an attribute accordingly to 'IS' param
			conditionalAttribute: function (attribute, value, is) {
				for (i = 0; i < list.length; i++) {
					if (is) {
						list[i].setAttribute(attribute, value);
						return;
					}
					list[i].removeAttribute(attribute);
				}
				return this;
			},
			each: function (callback, args) {
				obj = list;
				var value,
					i = 0,
					length = obj.length,
					isArray = obj instanceof Array;

				if (args) {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					}

					// A special, fast, case for the most common use of each
				} else {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					}
				}

				return obj;
			}
		}
	};
	return {
		options: {
			default_tag: 'div'
		},
		trim: function (s) {
			return s.replace(/^\s+|\s+$/gm, '');
		},
		//Todo:
		//All elements that were created by Elemental should be placed on a index
		//and have all its 'searchable' properties indexed as well
		//Then here in get it will first search for indexed elements and if it didnt find
		//it will return a query selector
		find: function (selector) {
			var return_list = []
			var s = selector.split(','), second_selector = [], a;
			for (i in s) {
				a = Elemental.trim(s[i]);
				if (a[0] == '#') {
					return_list[return_list.length] = document.getElementById(s[i].replace('#', ''));
					continue;
				}
				if (a == '') continue;
				second_selector[second_selector.length] = a;
			}
			if (second_selector.length > 0) {
				query = document.querySelectorAll(second_selector.join(','));
				for (i = 0; i < query.length; i++) {
					return_list[return_list.length] = query[i];
				}
			}
			return $new(return_list);
		},
		matchSelector: function (element, selector) {
			if (element.get) element = element.get(0);
			var elements_selector = Elemental.find(selector);
			elements_selector.css("match-selector-test", "match-selector-value");
			var match = element.style["match-selector-test"] == "match-selector-value";
			elements_selector.css("match-selector-test", null);
			return match;
		},
		//Creates a new Elemental object based on @object param
		//@object param can also be a DOM element
		new: function (object, parent, forcetag) {
			//this is prob a dom element
			if (object.nodeName) {
				return $new(object);
			}
			//If the passed object is an array then it will
			//iterate those elements configured inside this array 
			//and append inside the parent object
			if (object instanceof Array && parent != undefined) {
				var elemental_items = [], iterator = 0, elements = [];

				for (f in object) {
					//Force some tags to be a specific tag
					//Option case, for select parents
					if (forcetag) object[f].tag = forcetag;
					//creates the new element
					elemental_items[iterator] = Elemental.new(object[f]);
					elements = elemental_items[iterator].get();
					//Append the created element insde its parent
					for (i = 0; i < elements.length; i++) {
						parent.appendChild(elements[i]);
					}
					iterator++;
				}
				return elemental_items;
			}

			//Sets DEFAULT tag if tag property not set
			object.tag = (object.tag == undefined ? Elemental.options.default_tag : object.tag).toLowerCase();
			//creates the dom object
			var dom_object = document.createElement(object.tag);
			var elemental_object = $new(dom_object)

			for (i in object) {
				//if (typeof i != 'string') continue;
				switch (i) {
					//All this cases below are about event listeners
					//that will be created to the current element on this
					//recursive method 'Elementa.new'
					//this property must be an object
					case 'event':
					case 'events':
					case 'methods':
					case 'on':
						//Create a listener for each defined event
						for (event in object[i]) {
							if (typeof event != 'string') continue;
							if (object[i] == undefined) continue;
							elemental_object.on(event, object[i][event]);
						}
						break;
						//Al this cases below are about child elements
						//To be appended inside the root element
					case 'items':
					case 'child':
					case 'children':
						var _forcetag = object.tag == 'select' ? 'option' : false;
						Elemental.new(object[i], dom_object, _forcetag);

						//Here i'll create the index for all elements added inside root using Elemental 
						//So 'find' method will be based on this index and not on querySelector only

						//object.items = Elemental.new(object[i], dom_object, _forcetag);
						//object.children = object.items;
						//object.child = object.items;
						break;
					case 'class':
					case 'className':
						if (!(object[i] instanceof Array)) {
							object[i] = [object[i]];
						}
						for (a in object[i]) elemental_object.addClass(object[i][a]);
						break;
					case 'data':
					case 'data-attributes':
					case 'attr':
					case 'attributes':
						for (a in object[i]) {
							//Sets the data string attribute to the new object
							elemental_object.attr(a, object[i][a]);
						}
						break;
					case 'text':
					case 'string':
					case 'html':
						dom_object.insertAdjacentHTML('beforeend', object[i]);
						break;
					case 'tag':
						break;
					case 'style':
					case 'css':
						for (prop in object[i]) {
							elemental_object.css(prop, object[i][prop])
						}
						break;
					case 'disabled':
					case 'checked':
					case 'readonly':
						if (object[i] == true) elemental_object.attr(i, object[i]);
						break;
						//By default it sets attributes on the object
					default:
						//Sets the string attribute to the new object
						elemental_object.attr(i, object[i]);
						break;
				}

			}
			return $new(dom_object);
		}
	}
}());



