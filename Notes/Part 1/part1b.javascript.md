### Javascript and Node

- The code is written into files ending with .js and are run by issuing the command node `name_of_file.js`

### push vs concat

- When using React, techniques from functional programming are often used. 
- One characteristic of the functional programming paradigm is the use of immutable data structures. 
- In React code, it is preferable to use the method concat, which does not add the item to the array, but creates a new array in which the content of the old array and the new item are both included.

```javascript

const t = [1, -1, 3]

// bad 
// t.push(5)

.. good 
const t2 = t.concat(5)

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed

```

### Destructuring

Individual items of an array are easy to assign to variables with the help of the destructuring assignment.

```javascript

const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1, 2 is printed
console.log(rest)          // [3, 4 ,5] is printed
```

- Thanks to the assignment, the variables first and second will receive the first two integers of the array as their values. 
- The remaining integers are "collected" into an array of their own which is then assigned to the variable rest.

### THIS keyword

- Arrow functions and functions defined using the function keyword vary substantially when it comes to how they behave with respect to the keyword this which refers to the object itself.
- We can assign methods to an object by defining properties that are functions:

```javascript

const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is', this.name)
  },
  doAddition: function(a, b) {    
      console.log(a + b)  
  },
}

arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed

```

- Now the object has the method doAddition which calculates the sum of numbers given to it as parameters. 
- The method is called in the usual way using the object arto.doAddition(1, 4) or by storing a method reference in a variable and calling the method through the variable referenceToAddition(10, 15).
- If we try to do the same with the method greet we run into an issue:

```javascript

arto.greet()       // hello, my name is Arto Hellas gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints only hello, my name is
```

- When calling the method through a reference the method has lost knowledge of what was the original this. 
- Contrary to other languages, in Javascript the value of this is defined based on how the method is called. 
- When calling the method through a reference the value of this becomes the so-called global object and the end result is often not what the software developer had originally intended.
- Losing track of this when writing JavaScript code brings forth a few potential issues. 
- Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. 
- However, in this course we avoid issues by using the "this-less" JavaScript.