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
	var $new = function (list) {
		list = list instanceof Array ? list : [list];
		return {

			//Returns dom object
			get: function (index) {
				var return_list = [];
				for (i = 0; i < list.length; i++) {
					return_list[return_list.length] = list[i];
				}
				return index == undefined ? return_list : return_list[index];
			},
			items: {
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
						items_list[items_list.length] = this.items.add(items[i]);
					}
					return items_list;
				},
			},
			find: function (selector) {
				var return_list = [], query;
				for (i = 0; i < list.length; i++) {
					query = list[i].querySelectorAll(selector);
					for (i = 0; i < query.length ; i++) {
						return_list[return_list.length] = query[i];
					}
				}
				return $new(return_list);
			},
			append: function (item) {
				if (item instanceof Array) {
					return this.items.bulk(item);
					return this;
				}
				return $new(this.items.add(item));
			},
			attr: function (attr, value) {
				if (typeof value == 'boolean') {
					return this.conditionalAttribute(attr, attr, value);
				}
				for (i = 0; i < list.length; i++) {
					list[i].setAttribute(attr, value);
				}
				return this;
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
					if (value == undefined) return list[i].style[property];
					list[i].style[property] = value;
				}
				return this;
			},
			is: function (prop) {
				for (i = 0; i < list.length; i++) {
					switch (prop) {
						case 'visible':
							return !(list[i].offsetParent === null);
							break;
						default:
							return list[i].hasAttribute(prop);
							break;
					}
				}
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
			on: function (event, fnCallback) {
				for (i = 0; i < list.length; i++) {
					$addEvent(event, list[i], fnCallback);
				}
				return this;
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
			}
		}
	};
	return {
		options: {
			default_tag: 'div'
		},		
		//Todo:
		//All elements that were created by Elemental should be placed on a index
		//and have all its 'searchable' properties indexed as well
		//Then here in get it will first search for indexed elements and if it didnt find
		//it will return a query selector
		find: function (selector) {
			var return_list=[],query = document.querySelectorAll(selector);
			for (i = 0; i < query.length; i++) {
				return_list[return_list.length] = query[i];
			}
			return $new(return_list);
		},
		new: function (object_custom, parent, forcetag) {
			var object = object_custom;
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
			return $new(dom_object, object);
		}
	}
}());
