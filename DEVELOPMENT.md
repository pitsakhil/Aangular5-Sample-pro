# Typescript

	This document presents preferred conventions and typescript syntax 
    
 ## Single responsibility
 
 	Apply the single responsibility principle (SRP) to all components, services, and other symbols. This helps make the app cleaner, 	easier to read and maintain, and more testable.
    
      Do define one thing, such as a service or component, per file.
      Consider limiting files to 400 lines of code.
      Do define small functions. Consider limiting to no more than 20 lines
 
 ## General
 
    Do use "_" as a prefix for private properties.
    Use whole words in names when possible.
    String,Actions and effects should end with $
    
## Coding Style

      Always keep a space before and after (except if it would cause a trailing space):

      	{ and }
		Attribution
		Conditional operators
        
        if (condition) { // OK! Right!
		if (x > y) // OK! Right!
		const a = b; // OK! Right!
 
	
 
		if(condition){ // WRONG!
		if (x>y) // WRONG!
		const a=b; // WRONG!
		const a = b // WRONG!
        

        
## Variables

	Short objects can be declared in a single line, in this case don’t use trailing comma
	If the object has too many properties then use multiple lines, always with a trailing comma
 
    	const size = { width: 10, height: 20 };
		const size = {
  		width: 10,
 		 height: 20,
		};

        
## Functions

	Function name and () should be together
	Add a space after closing ()
	Add a space after comma in arguments
	Opening bracket in the same line
	Anonymous functions should have a space between function and (
	No semicolon after the function block
    
 
    
    function foo() {
	}
 
	function foo(width, height, area) {
	}
 
	function (x, y) {
	}

	
    Arrow functions should always use (), even for a single parameter
	Add a semicolon after the code block
  
    
    const handleClick = (event) => {
	};
 
	const clear = (text1, search) => {
	};
 
  ## Export
     

    export default function fn() {
	  }
 
	export const types = {
	};
 
	export function foo() {
 
	}

    
## General Types
	
	Don’t ever use the types Number, String, Boolean, or Object. These types refer to non-primitive boxed objects that are almost never 	used appropriately in JavaScript code.  

	 /* WRONG */
	function reverse(s: String): String;
    
    /* OK */
	function reverse(s: string): string;

   
## Types
	
    Do not export types/functions unless you need to share it across multiple components.
	Do not introduce new types/values to the global namespace.
	Shared types should be defined in 'types.ts'.
	Within a file, type definitions should come first.
    
## null and undefined

	Use undefined. Do not use null.
	Use null where its a part of the API or conventional
    
    /* WRONG */
    let foo = {x:123,y:undefined};
    
    //OK

    let foo:{x:number,y?:number} = {x:123};
    Use undefined in general (do consider returning an object like {valid:boolean,value?:Foo} instead)
    
    /* WRONG */
    return null;
    
    //OK

    return undefined;
    Use null where its a part of the API or conventional
    Reason: It is conventional in Node.js e.g. error is null for NodeBack style callbacks.

     /* WRONG */
    cb(undefined)
    
    /* OK */    
    cb(null)
    
    Use truthy check for objects being null or undefined
    
     /* WRONG */
    if (error === null)
    
    /* OK */
    if (error)
    
    Use == undefined / != undefined (not === / !==) to check for null / undefined on primitives as it works for both null/undefined 	but not other falsy values (like '',0,false) e.g.
    
    /* WRONG*/
    if (error !== null)
    
  	/* OK */      
    if (error != undefined)

 ## Classes
 
 	For consistency, do not use classes in the core compiler pipeline. Use function closures instead.
    Use PascalCase for class names.
    
  	/* WRONG */
	class foo { }
    
	/* OK */
	class Foo { }
    
    Use camelCase of class members and methods
    
     /* WRONG */
    class Foo {
        Bar: number;
        Baz() { }
    }
    
    /* OK */
    class Foo {
        bar: number;
        baz() { }
    }
    
 ## Constants
 
 	Do declare variables with const if their values should not change during the application lifetime.
    
    /* WRONG */    
    let count=25;
    
    /* OK */      
    const count=25
    
 ## Interfaces
 
 	Do name an interface using upper camel case.
    Use camelCase for members.
    Don't prefix with I    
    Do  use a class instead of an interface. A class can act as an interface (use implements instead of extends).
    
    /* WRONG */
	interface IFoo {
	}
    
    /* OK */    
	interface Foo {
	}
        
 ##  Flags
 
 	More than 2 related Boolean properties on a type should be turned into a flag.
        
 ##  Comments
 
 	Use JSDoc style comments for functions, interfaces, enums, and classes.
        
 ##  Strings
 
 	Use single quotes quotes for strings.
	All strings visible to the user need to be localized (make an entry in diagnosticMessages.json).
    string should end with $
    
     /* WRONG */    
    public name:string;
    
    /* OK */    
    public name$:string
        
 ##  Diagnostic Messages
 
 
 	Use a period at the end of a sentence.
	Use indefinite articles for indefinite entities.
	Definite entities should be named (this is for a variable name, type name, etc..).
	When stating a rule, the subject should be in the singular (e.g. "An external module cannot..." instead of "External modules 		cannot...").
	Use present tense.
    
 ## General Constructs
 
 	For a variety of reasons, we avoid certain constructs, and use some of our own. Among them:

	Do not use for..in statements; instead, use ts.forEach, ts.forEachKey and ts.forEachValue. Be aware of their slightly different 	semantics.
	Try to use ts.forEach, ts.map, and ts.filter instead of loops when it is not strongly inconvenient.
    
## Style

	Use arrow functions over anonymous function expressions.
	Only surround arrow function parameters when necessary. 
	For example, (x) => x + x is wrong but the following are correct:
	x => x + x
	(x,y) => x + y
	<T>(x: T, y: T) => x === y
	Always surround loop and conditional bodies with curly braces. Statements on the same line are allowed to omit braces.
	Open curly braces always go on the same line as whatever necessitates them.
	Parenthesized constructs should have no surrounding whitespace. 
	A single space follows commas, colons, and semicolons in those constructs. For example:
	for (var i = 0, n = str.length; i < 10; i++) { }
	if (x < 10) { }
	function f(x: number, y: string): void { }
	Use a single declaration per variable statement 
	(i.e. use var x = 1; var y = 2; over var x = 1, y = 2;).
	else goes on a separate line from the closing curly brace.
	Use 4 spaces per indentation.
    
## Array

	Annotate arrays as  foos:Array instead of foos:Foo[]
    
## type vs. interface

	Use type when you might need a union or intersection:
	type Foo = number | { someProperty: number }
	Use interface when you want extends or implements e.g
 

 