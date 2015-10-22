# Elemental
Simple javascript object-oriented way to handle DOM elements

http://zerobytes.github.io/Elemental/

##Elemental options
>default_tag: 'div'
######Example
```
Elemental.options.default_tag = 'span';
```

##Elemental Static Methods

###String methods
**Trim** - Will remove extra spaces from the begining and the end of the string
>Elemental.trim(string)

**toUnderscore** - Transform string - thisString = this_string
>Elemental.toUnderscore(string)

**toDash** - Transform string - thisString = this-string
>Elemental.toDash(string) 

**toCamel** - Transform string - this-string = thisString
>Elemental.toCamel(string)

###Message methods
This method will make a replace on each '@?' string found inside of the first argument
with all parameters after the first one, ordered as used on method call
>Elemental.message.apply(message,**[n...]**) 
######Example
```
Elemental.message.apply("Hello @?. Have a good @?","Guilherme","night");
```

**talk** - Will make a screen reader say a given phrase
It has an algorithym that calculates the avarage time for JAWS to say a phrase based on the amount of
characters.
######Only works using a screen reader (e.g. JAWS)
>Elemental.message.talk(text,**optional** removeTimer)


###DOM Methods

**find** - Will find a given selector within the DOM and return an **Elemental object collection**
>Elemental.find(selector)

**matchSelector** - Will check if a given element matches a given selector
>Elemental.matchSelector(element, selector) 

**new** - Will create a **Elemental object collection** based on first argument
>Elemental.new(object, **optional** parent, **optional** forcetag)
######Example
```
//Gives <a href="#" class="link">
Elemental.new({tag:'a', href:'#',className:'link'});
//Gives
//<div some-attribute-that-shall-be-dashed-written="It Worked" style="height: 100px; width: 100px; background: rgb(170, 170, 170);">
//    Example of a div with children and events
//    <span style="color: red;">Span 1</span>
//    <span>Span 2</span>
//</div>
Elemental.new({
    style:{
        background:'#aaa',
        height:'100px',
        width:'100px'
    },
    text:'Example of a div with children and events',
    on:{
        click:function(event){
            //this = div element
            alert("I was clicked")
        }
    },
    items:[
        {tag:'span',text:'Span 1',style:{color:'red'}},
        {tag:'span',text:'Span 2'}
    ],
    someAttributeThatShallBeDashedWritten:'It Worked'
})
```


**get** - Will return the DOM Element Object with the given index (parameter) or the list of all DOM Elements inside of **Elemental Object Collection**
>get: function (index) {

**toString** - Returns the HTML string of the first DOM element on this collection
>toString:function(){

**find** - Will search within all the children elements for a given selector returning an **Elemental Object Collection**
>find: function (selector) {

**append** - Appends inside the DOM Elements the given item. *item* Can be a DOM Element or an **Elemental Object Collection**
>append: function (item) {

**attr** - Set an attribute in all DOM Elements inside the collection but gets only from the first. If no param is passed will return a full list of attributes for the first element
>attr: function (attr, value) {				

**objectAttr** - Will set an attribute on each DOM Element Object inside this collection independent if it beeing and html attr or not
>objectAttr: function (attr, value) {

**height** - Returns the client height of the first DOM Element of this collection
>height: function () {

**width** - Returns the client width of the first DOM Element of this collection
>width: function () {

**scrollTop** - Returns the scroll top of the first DOM Element of this collection
>scrollTop: function (scroll) {

**scrollLeft** - Returns the scroll left of the first DOM Element of this collection
>scrollLeft: function (scroll) {

**hasClass** - Check if an element (with index, if given) has a given class. If no index is passed will check only the first
>hasClass: function (className, index) {

**addClass** - Add a given class to all DOM Elements inside collection
>addClass: function (className) {

**removeClass** - Removes a given class from all DOM Elements inside the collection
>removeClass: function (className) {

**toggleClass** - Adds or Removes a given class from all DOM Elements inside the collection
>toggleClass: function (className) {

**css** - Set or get a CSS property on all DOM Elements inside the collection. 
It is possible to pass an object on first argument with property=>value to set multiple css rules.
>css: function (property, value) {

**is** - check if the first DOM Element inside the collection matches the given selector
Will support (individually) *:visible, :disabled* and *:readonly* and all common css selectors with multiple use
>is: function (prop) 
######Example
```
Elemental.find("input").is("[type=text], .form-control")
```

**skipOut** - Will return the element that matches the hierarchy with N levels above the first DOM Element inside collection
>skipOut: function (levels) {

**parent** - Will return the parent node of the first DOM Element inside the collection, with a given selector (if passed)
>parent: function (selector) {

**focus** - Will focus on the first DOM Element inside the collection
>focus: function () {

**blur** - Will blur from the first DOM Element inside the collection
>blur: function () 

**next** - Will jump to the next sibling DOM Element. If a selector is passed than it will jump to the next DOM Element that matches the given selector
>next: function (selector) 

**prev** - Will jump to the previous sibling DOM Element. If a selector is passed than it will jump to the previous DOM Element that matches the given selector
>prev: function (selector) 

**index** - Returns the index of the first DOM Element. If a selector is passed the index will be based on the given selector
>index: function (selector) 

**siblings** - Return all siblings of the first  DOM Element inside the collection
>siblings: function () 

**show** - Display all the DOM Elements inside the collection
>show: function () 

**hide** - Hide all the DOM Elements inside the collection
>hide: function () 

**toggle** - Display or Hide all the DOM Elements inside the collection
>toggle: function () 

**remove** - Remove all the DOM Elements inside the collection from javascript DOM tree
>remove: function () 

**on** - Binds an event to all DOM Elements inside the collection
>on: function (event, fnCallback) 

**size** - Returns the count of items inside the collection
>size: function () 

**conditionalAttribute** - Sets a conditional attribute to all DOM Elements inside the collection
>conditionalAttribute: 

**each** - Iterates thru all items inside the Collection executing a *callback* function
>each: function (callback, args) 